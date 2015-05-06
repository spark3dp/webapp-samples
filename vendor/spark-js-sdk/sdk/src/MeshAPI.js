var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;
    var _meshCounter = 0;

    var requestImport = function(fileId, name, generateVisual, transform) {
        ++_meshCounter;
        name = name || ("Mesh_" + _meshCounter);
        transform = transform || [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0]
        ];
        var data = {
            "file_id": fileId,
            "name": name,
            "transform": transform,
            "generate_visual": !!generateVisual
        };

        var headers = {
            'Content-Type' : 'application/json'
        };
        return Client.authorizedApiRequest('/geom/meshes/import').post(headers, JSON.stringify(data));
    };

    var uploadFileObject = function(file, progressCallback)
    {
        var formData = new FormData();
        formData.append(file.name, file);
                
        // TODO: file upload progress ???
        return Client.authorizedApiRequest('/files/upload').post(null, formData);
    };

    // The Mesh API singleton.
    //
    ADSKSpark.MeshAPI = {
        /**
         */

        // progressCallback is optional
        importMesh: function(fileId, name, generateVisual, transform, progressCallback) {

            var waiter = new ADSKSpark.TaskWaiter(progressCallback);

            return requestImport(fileId, name, generateVisual, transform)
                    .then(waiter.wait);
        },

        // progressCallback is optional (not implemented yet)
        uploadFile: function(file, progressCallback) {
            return uploadFileObject(file, progressCallback);
        },

        transformMesh: function( meshId, transform ) {
            var payload = {
                id: meshId,
                transform: transform
            };
            return Client.authorizedApiRequest('/geom/meshes/transform').post(null, payload);
        },

        // progressCallback is optional
        analyzeMesh: function( meshId, progressCallback ) {
            var payload = {
                id: meshId
            };
            // TODO: It's possible to get immediate 200 response instead of 202 + task.
            var waiter = new ADSKSpark.TaskWaiter(progressCallback);
            return Client.authorizedApiRequest('/geom/meshes/analyze').post(null, payload)
                    .then(waiter.wait);
        },

        generateVisual: function( meshId, progressCallback ) {
            var payload = {
                id: meshId
            };
            // TODO: It's possible to get immediate 200 response instead of 202 + task.
            var waiter = new ADSKSpark.TaskWaiter(progressCallback);
            return Client.authorizedApiRequest('/geom/meshes/generateVisual').post(null, payload)
                    .then(waiter.wait);
        }

    };
}());
