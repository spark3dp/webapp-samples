var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;

    // The printDB singleton.
    // TODO: Should we cache results?
    // TODO: There is a way to make this object's properties immutable. Is that something we would want to do?
    ADSKSpark.PrintDB = {
        /**
         * @param {String} [typeId] - The type ID. If not specified, return all printer types.
         * @returns {Promise} - A promise that will resolve with a list of printer types.
         */
        getPrinterType: function(typeId) {
            return Client.authorizedApiRequest('/printDB/printerTypes/' + typeId)
                .get();
        },

        getPrinterTypes: function() {
            return Client.authorizedApiRequest('/printDB/printerTypes')
                .get()
                .then(function(data) {
                    return data.printer_types;
                });
        },

        /**
         * @param {String} [materialId] - The type ID. If not specified, return all materials.
         * @returns {Promise} - A promise that will resolve with a list of materials.
         */
        getMaterial: function(materialId) {
            // TODO: Make XHR request and chain the resulting promise to parse the JSON
        },

        /**
         * @param {String} [profileId] - The type ID. If not specified, return all profiles.
         * @returns {Promise} - A promise that will resolve with a list of profiles.
         */
        getProfile: function(profileId) {
            // TODO: Make XHR request and chain the resulting promise to parse the JSON
        }
    };
}());
