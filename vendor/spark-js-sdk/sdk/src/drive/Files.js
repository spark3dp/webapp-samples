var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;


    /**
     * The Files API singleton.
     * See reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Ffiles
     */
    ADSKSpark.Files = {

        /**
         * Get the details for a specific file
         * @param {String} fileId - The ID of the file
         * @returns {Promise} - A promise that will resolve to an a file
         */
        getFileDetails: function (fileId) {

            return Client.authorizedApiRequest('/files/' + fileId)
                .get()
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    return error;
                });
        },

        /**
         * Upload a file to Spark Drive
         * @param fileData - The file object to upload - has the form of:
         *                      {
         *                          file: The actual file data that is passed in the body
         *                          unzip: Should we treat the upload as a zip of multiple files
         *                          public: If it has full public URL for everyne's access
         *                      }
         * @returns {Promise} - A promise that will resolve to a file object response
         */
        uploadFile: function (fileData) {

            var fd = new FormData();
            fd.append("file", fileData.file);

            var unzip = fileData.unzip ? fileData.unzip : false;
            fd.append("unzip", unzip);

            if (fileData.public) {
                fd.append("public", fileData.public);
            }

            return Client.authorizedApiRequest('/files/upload')
                .post(null, fd)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    return error;
                });

        },
    };

}());
