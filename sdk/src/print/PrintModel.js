var ADSKSpark = ADSKSpark || {};

// NOTE: We may want to make this class private and not expose it to clients
// since some operations on it really should be done via the layout object.
// For example, you can't just transform one of these and expect the layout
// to update with the new position (unless we make these models aware of the
// layout they belong to). If we expose this in it's current state, it may 
// result in unexpected behaviour. So we probably should make the layout object
// the primary interface for all print prep work.

/**
 * This is the sdk interface to a Spark Mesh resource.
 *  @class
 *  @param {String} source - Path to local source file (currently obj or stl)
 *  @param {String} name - User visible name of this mesh object.
 *  @constructor
 */


ADSKSpark.PrintModel = function( source, name, fileInfo )
{
    var Client  = ADSKSpark.Client;
    var MeshAPI = ADSKSpark.MeshAPI;

    // A print model represents a single Spark Mesh resource and tracks
    // as much information as possible about this entity.
    //

    var _this = this;
    var _sourceModel = source;  // Source file path.
    var _name = name;
    var _fileInfo = fileInfo;
    var _error = null;
    var _meshData = null;
    var _importPromise = null;
    var _serial = 0;
    var _attributes = { 'reposition': true, 'reorient': true, 'support': true };


    function setMeshData(data)
    {
        // TODO Validate incoming data.
        _meshData = data;
        _serial++;
        // TODO send change event?
        return data;
    }

    function setError(data)
    {
        _error = data;
        return data;
    }


    // Returns promise that resolves to this object.
	this.importMesh = function(progressCallback)
    {
        if( !_importPromise )
            _importPromise = MeshAPI.importMesh(_fileInfo.file_id, _name, transform, progressCallback)
                            .then(setMeshData).catch(setError);

        return _importPromise;
    };


	this.getName = function()
    {
        return _name;
    };


	this.getId = function()
    {
        return _meshData ? _meshData.id : null;
    };


	this.setAttributes = function( attributes )
    {
        if( attributes.support !== undefined )
            _attributes.support    = !!attributes.support;

        if( attributes.reposition !== undefined )
            _attributes.reposition = !!attributes.reposition;

        if( attributes.reorient !== undefined )
            _attributes.reorient   = !!attributes.reorient;
    };


	this.getAttributes = function()
    {
        return _attributes;
    };


	this.transform = function( transform, progressCallback )
    {
        // TODO: Check if the transform valid and is different.
        // TODO: Check if the mesh has been imported
        //
        return MeshAPI.transformMesh(this.getId(), transform, progressCallback)
                .then(setMeshData);
    };


	this.analyze = function(progressCallback)
    {
        // Returns promise. May already be fulfilled if analyzed previously.
        if( _meshData && _meshData.analyzed )
            return Promise.resolve(_meshData);

        return MeshAPI.analyzeMesh(this.getId(), transform, progressCallback)
                .then(setMeshData);
    };


	this.repair = function(all, progressCallback)
    {
        // Returns promise. On success _meshData is updated.
        // Consider: Track old mesh value and operation for undo/redo.
        // Consider: Always repair with generate_visual option true.
    };


	this.getVisualId = function(progressCallback)
    {
        function resolveVisualId(data)
        {
            return Promise.resolve(_meshData.visual_file_id);
        }

        // Returns a promise to get the visual.
        // Note that operations like repair and PrintLayout.prepare may automatically
        // generate a visual, which means this promise may resolve immediately.
        if( _meshData && _meshData.visual_file_id )
            return resolveVisualId();

        return MeshAPI.generateVisual(this.getId(), progressCallback)
                .then(setMeshData)
                .then(resolveVisualId);
    };

	this.getSerialNumber = function()
    {
        // The serial number can be used to test for changes.
        // It gets incremented whenever the mesh is modified.
        return _serial;
    };


	this.updateMesh = function( meshData )
    {
        setMeshData(meshData);
    };
};
