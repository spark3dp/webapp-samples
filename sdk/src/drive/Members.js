var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;

    // The Members API singleton.
    //
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
        }

    };
}());
