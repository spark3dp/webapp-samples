/**
 * Our spark drive object
 */
var sparkDrive = function () {

    /**
     * Return the factory object
     */
    return {

        /**
         * Get my assets
         * @param callback
         */
        getMyAssets: function (limit,offset, callback) {
            //Make sure token is still valid
            sparkAuth.checkTokenValidity(function (response) {
                if (response) {

                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }

                    var assetsLimit = limit ? limit : 12;
                    var assetsOffset = offset ? offset : 0;

                    var url = protocol + '://' + apiHost + '/members/' + sparkAuth.getMember().acs_member_id + '/assets?limit=' + assetsLimit + '&offset=' + assetsOffset;
                    Util.xhr(url, 'GET', '', headers, callback);
                }else{
                    callback(false);
                }
            });
        },
        /**
         * Create a new asset
         * @param assetPost
         */
        createAsset: function (assetPost, callback) {
            //Make sure token is still valid
            sparkAuth.checkTokenValidity(function (response) {
                if (response) {
                    var params = "title=" + assetPost.title + "&description=" + assetPost.description +
                        "&media_type=file&tags=" + assetPost.tags;
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    Util.xhr(protocol + '://' + apiHost + '/assets', 'POST', params, headers, callback);
                }else{
                    callback(false);
                }
            });
        },
        /**
         * Create a new asset
         * @param assetPost
         */
        updateAsset: function (assetPost, callback) {
            //Make sure token is still valid
            sparkAuth.checkTokenValidity(function (response) {
                if (response) {

                    var params = "title=" + assetPost.title + "&description=" + assetPost.description +
                        "&publish=true&tags=drivester";
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    var url = protocol + '://' + apiHost + '/assets/' + assetPost.assetId + '?' + params;
                    Util.xhr(url, 'PUT', '', headers, callback);
                }else{
                    callback(false);
                }
            });
        },
        /**
         * Remove an asset
         * @param assetId
         * @param callback
         */
        removeAsset: function (assetId, callback) {

            //Make sure token is still valid
            sparkAuth.checkTokenValidity(function (response) {
                if (response) {
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    var url = protocol + '://' + apiHost + '/assets/' + assetId;
                    Util.xhr(url, 'DELETE', '', headers, callback);
                }else{
                    callback(false);
                }
            });
        }
    }


}();
