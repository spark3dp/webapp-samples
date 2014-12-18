/**
 * Our spark drive object
 */
var sparkDrive = function () {

    /*** PRIVATE STUFF ***/

    var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
        apiHostProduction = 'api.spark.autodesk.com/api/v1',
        apiHost,
        endUserAuthorizationEndpoint, // The page of the authorize
        protocol = 'http', //The protocol of the server
        clientId, //App key
        authHash, // Base64 encoded App key + ":" + app secret
        redirectURI; // The redirect URL you set for your application (location of your auth.html file)
    ;

    /**
     * Transform parameter strings to array of params
     * @param prmstr
     * @returns {{}}
     */
    var transformToAssocArray = function (prmstr) {
        var params = {};
        var prmarr = prmstr.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    /**
     * Redirects the user to the Drive login page, where they will be requested to login
     */
    var redirectToAuthLoginURL = function () {

        var authUrl = "https://" + endUserAuthorizationEndpoint +
                "?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectURI
            ;

        window.location = authUrl;
    }

    /**make API call
     * Standard AJAX requests
     * @param url
     * @param method
     * @param params
     * @param headers
     * @param callback
     */
    var xhr = function (url, method, params, headers, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        for (var i in headers) {
            xhr.setRequestHeader(i, headers[i]);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 201) {
                    var response = JSON.parse(xhr.responseText);

                    //If request was for access token, set it in localStorage
                    if (response.access_token) {
                        localStorage.setItem('spark-drive-token', response.access_token);
                        localStorage.setItem('spark-drive-member', response.acs_member_id);
                    }
                    callback(response);
                }else{
                    //Server or auth error
                    callback(false);
                }
            }
        }
        xhr.send(params);
    }

    /**
     * Get current member as there is no end point for that :(
     */
    var checkTokenValidity = function (callback) {

        var headers = {
            "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
            "Content-type": "application/x-www-form-urlencoded"
        }
        var url = protocol + '://' + apiHost + '/members/' + localStorage.getItem('spark-drive-member');
        xhr(url, 'GET', '', headers, callback);
    }

    /**
     * Return the factory object
     */
    return {
        /**
         * Initialize the app key (client_ID), auth hash (Base64 [app key + : + app secret]) and rediorect URL
         */
        init: function (CLIENT_ID, AUTH_HASH, REDIRECT_URI,ENVIRONMENT) {
            clientId = CLIENT_ID;
            authHash = AUTH_HASH;
            redirectURI = REDIRECT_URI;
            apiHost = ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox;
            endUserAuthorizationEndpoint = apiHost + "/oauth/authorize";

        },
        /**
         * Extract the auth code
         */
        extractSparkRedirectionCode: function () {
            var prmstr = window.location.search.substr(1);
            var getParams = prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : [];

            return getParams['code'] ? getParams['code'] : null;
        },

        /**
         * Redirect user to Drive login page
         */
        redirectToAuthLoginURL: redirectToAuthLoginURL,

        /**
         * Get the access token
         * @param code - The code from the previous step
         * @param callback - Callback to run after getting the access token
         */
        getAccessToken: function (code, callback) {
            var params = "code=" + code + "&grant_type=authorization_code&response_type=code&redirect_uri=" + redirectURI;
            var headers = {
                "Authorization": "Basic " + authHash,
                "Content-type": "application/x-www-form-urlencoded"
            }
            xhr(protocol + '://' + apiHost + '/oauth/accesstoken', 'POST', params, headers, callback);

        },

        /**
         * Gets user profile
         * @param callback
         */
        getMyProfile: function (callback) {
            //Make sure token is still valid
            checkTokenValidity(function (response) {
                if (response) {
                    callback(response.member);
                }else{
                    callback(false);
                }
            });
        },

        /**
         * Get my assets
         * @param callback
         */
        getMyAssets: function (callback) {
            //Make sure token is still valid
            checkTokenValidity(function (response) {
                if (response) {

                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    var url = protocol + '://' + apiHost + '/members/' + localStorage.getItem('spark-drive-member') + '/assets';
                    xhr(url, 'GET', '', headers, callback);
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
            checkTokenValidity(function (response) {
                if (response) {
                    var params = "title=" + assetPost.title + "&description=" + assetPost.description +
                        "&media_type=file&tags=" + assetPost.tags;
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    xhr(protocol + '://' + apiHost + '/assets', 'POST', params, headers, callback);
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
            checkTokenValidity(function (response) {
                if (response) {

                    var params = "title=" + assetPost.title + "&description=" + assetPost.description +
                        "&publish=true&tags=" + assetPost.tags;
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    var url = protocol + '://' + apiHost + '/assets/' + assetPost.assetId + '?' + params;
                    xhr(url, 'PUT', '', headers, callback);
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
            checkTokenValidity(function (response) {
                if (response) {
                    var headers = {
                        "Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                    var url = protocol + '://' + apiHost + '/assets/' + assetId;
                    xhr(url, 'DELETE', '', headers, callback);
                }else{
                    callback(false);
                }
            });
        }
    }


}();
