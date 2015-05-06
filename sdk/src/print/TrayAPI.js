var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;
    var _meshCounter = 0;


    // The Tray API singleton.
    //
    ADSKSpark.TrayAPI = {
        /**
         */

        // meshAttrs, defaultMaterialId, progressCallback are optional
        createTray: function(printerTypeId, printerProfileId, meshIds, meshAttrs, defaultMaterialId, progressCallback) {

            var waiter = new ADSKSpark.TaskWaiter(progressCallback);

            var payload = {
                'printer_type_id': printerTypeId,
                'profile_id': printerProfileId,
                'mesh_ids': meshIds
            };
            if( meshAttrs )
                payload.mesh_attrs = meshAttrs;

            if( defaultMaterialId )
                payload.default_material_id = defaulMaterialId;
    
            return Client.authorizedApiRequest('/print/trays').post(null, payload)
                    .then(waiter.wait);
        },

        // generateVisual, progressCallback are optional
        prepareTray: function(trayId, generateVisual, progressCallback) {
            var waiter = new ADSKSpark.TaskWaiter(progressCallback);

            var payload = {
                'id': trayId,
                'generate_visual': !!generateVisual
            };

            return Client.authorizedApiRequest('/print/trays/prepare').post(null, payload)
                    .then(waiter.wait);
        }

    };
}());
