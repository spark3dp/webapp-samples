var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;


    /**
     * The Assets API singleton.
     * See reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Fassets
     */
    ADSKSpark.Assets = {
        /**
         * Get logged in user assets
         * @param {Object} params - limit/offset/sort/filter options.
         * @returns {Promise} - A promise that will resolve to an array of assets.
         */
        getMyAssets: function (params) {

            if (Client.isAccessTokenValid()) {
                var accessTokenObj = Client.getAccessTokenObject();

                var userId = accessTokenObj.spark_member_id;

                return Client.authorizedApiRequest('/members/' + userId + '/assets')
                    .get(null, params)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (error) {
                        return error;
                    });
            } else {
                return Promise.reject(new Error('Access token is invalid'));
            }
        },

        /**
         * Remove an asset for a logged in user
         * @param assetId - The id of the asset
         * @param callback
         */
        removeAsset: function (assetId) {
            return Client.authorizedApiRequest('/assets/' + assetId)
                .delete()
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    return error;
                });
        }
    };

}());
