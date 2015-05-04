var ADSKSpark = ADSKSpark || {};

ADSKSpark.PrintLayout = function( printerType, layoutName )
{
    var TrayAPI = ADSKSpark.TraiAPI;

    // A print layout follows one or more models through the print preparation
    // process. The layout can be in various states:
    // - error  - some operation has failed
    // - unprepared
    // - prepared
    // - printable
    // - printable locked
    //
    // Most methods will fail if the layout is locked.
    //

    var _this = this;
    var _lock = false;
    var _name = layoutName || 'Print Job';    // TODO: Make unique with date stamp "... YYYY/MM/DD HH:MM"
    var _prepared = false;
    var _models = [];           // List of PrintModel's in this layout.
    var _settings = {};         // Printer settings (or profile?)
    var _trayData = null;
    var _printable = null;
    var _printerType = printerType;
    var _printerProfileId;
    var _error;


    function checkLock(data)
    {
        if( _this._lock )
            return Promise.reject('Attempted operation on locked PrintLayout');

        // Pass input data through to resolve:
        return Promise.resolve(data);
    }

    function unprepareLayout(data)
    {
        // TODO: Track old data for undo?
        _prepared = false;
        _trayData = null;
        _error = null;
        // TODO: If we've tossed the tray then any support data is now invalid!!!
        //
        // This will have to be revisited... When a tray is modified how much of the
        // previously prepared state and content do we keep? For example if supports
        // have been generated for some meshes we can continue to use them until that
        // particular mesh is modified in some way. 
        //
        // So should we do this or not? Should the user choose whether they want
        // the entire tray to be automatically laid out?
        for( var i=0; i < newMeshes.length; ++i ) {
            _models[i].setAttributes( { 'reposition': true, 'reorient': true, 'support': true } );
        }
        // Pass input data through to resolve:
        return Promise.resolve(data);
    }

    function handleError(msg)
    {
        // TODO: add logging?
        _error = 'Print Layout Error: ' + msg;
        console.log(_error);

        // Propagate the error to the caller:
        return Promise.reject(_error);
    }


    this.setName = function( name )
    {
        if( _lock )
            return false;

        _name = name;
        return true;
    };


    this.getName = function()
    {
        return _name;
    };


    this.getId = function()
    {
        return _trayData ? _trayData.id : null;
    };


    this.addModel = function( localPath )
    {
        // Add a model (stl or obj or ???) to the current print layout.
        // Unprepares the layout. Fails if layout is locked.
        // Returns a promise which resolves when the model upload and import succeeds.
        //
        function createModel(localPath)
        {
            var model = new ADSKSpark.PrintModel(localPath, getNameFromPath(localPath));
            _models.push(model);
            return model.importMesh();
        }
        // TODO
        return checkLock(localPath).then(unprepareLayout).then(createModel).catch(handleError);
    };


    this.addSparkModel = function( printModel )
    {
        // Add a previously created PrintModel to the current layout.
        // Unprepares the layout. Fails if layout is locked.
        // Consider: Can I add the same model more than once? This should
        // then duplicate the mesh, perhaps with a unique name?

        function addModel(printModel)
        {
            // TODO: Check for duplicates;
            _models.push(printModel);
            return printModel.importMesh(); // Make sure it's uploaded and imported.
        }
        return checkLock(printModel).then(unprepareLayout).then(addModel).catch(handleError);
    };


    this.removeModel = function( modelIndex )
    {
        // Remove by index.
        // Unprepares the layout. Fails if layout is locked.
        function removeModel(index)
        {
            var removed = _models.splice(index, 1);
            // TODO... what else do we need to do here? Update visuals?
            return _this;
        }
        return checkLock(modelIndex).then(unprepareLayout).then(removeModel);
    };


    this.getModels = function()
    {
        return _models.slice();
    };


    this.transformModel = function( modelIndex, transform )
    {
        // Toss any existing tray. Unprepare the layout.
        // Transform mesh and updates internal mesh list.
        //
        function transformModel(args)
        {
            var index = args[0];
            var transform = args[1];
            var model = _models[index];

            return model.transform(transform);
        }
        return checkLock([modelIndex, transform]).then(unprepareLayout).then(transformModel);
    };


    this.prepare = function()
    {
        // Attempts to prepare the layout for printing.
        // Returns a promise.
        // Creates the tray with appropriate mesh_attr flags and runs
        // prepare on it. Upon success sets layout to prepared.

        function createTray()
        {
            // TODO: Validate that we have one or more meshes to add.
            // Already created?
            if( !_this._trayData )
            {
                // Collect meshes and mesh attributes, invoke create.
                var meshAttrs = {};
                var meshIds = _models.map(function(m) {
                    var id = m.getId();
                    meshAttrs[id] = m.getAttributes();
                    return id;
                });

                return TrayAPI.createTray(
                            _printerType.id, 
                            _printerProfileId ? _printerProfileId : _printerType.profile_id,
                            meshIds,
                            meshAttrs
                        ).then(function(response) {
                            _this._prepared = false;
                            _this._trayData = response;
                            return response;
                        });
            }
            Promise.resolve(_this._trayData);
        }

        function requestPrepare() 
        {
            if( !_this._prepared )
            {
                // Consider: always use generate_visual option and
                // collect visual files for each mesh??
                //
                var payload = {
                    'id': _this.getId(),
                    'generate_visual': true
                };
                return TrayAPI.prepareTray(_this.getId(), true)
                        .then(function(response) {
                            // Traverse the model list and update each one
                            // with the new mesh data.
                            var newMeshes = response.meshes;
                            for( var i=0; i < newMeshes.length; ++i ) {
                                _models[i].updateMesh(newMeshes[i]);
                            }
                            //
                            // Consider: tracking old tray and operation history
                            // for undo/redo.
                            //
                            _this._trayData = response; // New tray!
                            _this._prepared = true;
                            return response;
                        });
            }
            Promise.resolve(_this._trayData);
        }

        // Returns promise.
        return checkLock().then(createTray).then(requestPrepare);
    };


    this.getVisuals = function()
    {
        // Get a list of all current visuals for this layout??
    };


    function exportSupports( _this )
    {
        return new Promise(function(resolve, reject) {
            if( !_this._supported )
            {
                // Send export supports request with generate_visual true.
                // On success:
                {
                    _this._supported = true;
                    // Must now traverse the list of PrintModels
                    // and stash the support file id's (if any) there.
                    resolve(_this);
                }
            }
            else
                resolve(_this);
        });
    }


    // It's probably much simpler to always ask for all the supports instead
    // of providing an interface to request individual mesh supports.
    //
    this.getSupportFiles = function()
    {
        function collectSupports(_this)
        {
            return _models.map(function(m) { return m.getSupport(); });
        }

        return this.prepare().then(exportSupports).then(collectSupports);
    };


    this.getSupportVisuals = function()
    {
        function collectSupportVisuals(_this)
        {
            return _models.map(function(m) { return m.getSupportVisual(); });
        }

        return this.prepare().then(exportSupports).then(collectSupportVisuals);
    };


    this.getPrintable = function()
    {
        // Will succeed even if locked:
        if( _printable )
            return Promise.resolve(_printable);

        function requestPrintable(_this)
        {
            return new Promise(function(resolve, reject) {
                if( !_printable )
                {
                    // Invoke generatePrintable endpoint
                    // on success:
                    {
                        this._printable = response.file_id;
                        resolve(_this._printable);
                    }
                }
                else
                    resolve(_printable);
            });
        }
        // Returns promise.
        return this.prepare().then( requestPrintable );
    };


    this.downloadPrintable = function(localPath)
    {
        // this.getPrintable().then(...);
    };


    this.getSupport = function()
    {
        // Support files are created via the PrintLayout.getSupportFiles method.
        // This function will only return a result if getSupportFiles has been
        // invoked on the layout.
        // Returns file_id or undefined.
    };


    this.getSupportVisual = function()
    {
        // Support files are created via the PrintLayout.getSupportFiles method.
        // This function will only return a result if getSupportFiles has been
        // invoked on the layout.
        // Returns file_id or undefined.
    };


    this.setLock = function( state )
    {
        // TODO: We probably should lock the PrintModel objects in this layout.
        if( state && this.getPrintable() )
        {
            _lock = state;
            return true;
        }
        return false;
    };


    this.getLock = function()
    {
        return _lock;
    };


    // Allow override default profile:
    this.setProfile = function( profileId )
    {
        unprepareLayout();
        _printerProfileId = profileId;
    };


    // Allow change printerType:
    this.setPrinterType = function( printerType )
    {
        unprepareLayout();
        // TODO: validate type data
        _printerType = printerType;
    };
};
