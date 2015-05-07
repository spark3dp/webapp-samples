var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;

    // The Members API singleton.
    // See reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Fmembers
    ADSKSpark.Members = {

        /**
         * Gets user profile by ID
         * @param callback
         * See API reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Fmembers%2Fmembers-with-id%2Fretrieve-member-details
         */
        getMemberById: function(memberId) {

            return Client.authorizedApiRequest('/members/' + memberId)
                .get()
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    return error;
                });
        },


        /**
         * Gets logged in user profile
         * @param callback
         * See API reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Fmembers%2Fmembers-with-id%2Fretrieve-member-details
         */
        getMyProfile: function() {

            if (Client.isAccessTokenValid()) {
                var accessTokenObj = Client.getAccessTokenObject();

                var userId = accessTokenObj.spark_member_id;

                return ADSKSpark.Members.getMemberById(userId);
            }

            return Promise.reject(new Error('Access token is invalid'));

        }

    };
}());
