var ADSKSpark = ADSKSpark || {};

(function() {
    var Client = ADSKSpark.Client;

    // The Members API singleton.
    //
    ADSKSpark.Members = {

        // meshAttrs, defaultMaterialId, progressCallback are optional
        getMyProfile: function() {
            var accessTokenObj = Client.getAccessTokenObject();

            var userId = accessTokenObj.spark_member_id;

            return Client.authorizedApiRequest('/members/' + userId)
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
