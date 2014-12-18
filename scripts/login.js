$(function ($) {

    var code = sparkDrive.extractSparkRedirectionCode();

    //New page load and no token yet
    if (!code && !localStorage.getItem('spark-drive-token')) {
        //Get the Auth Code which is required for requesting an access token.
        sparkDrive.redirectToAuthLoginURL();
    //Either returning from getting the Auth Code or there is an access token already in storage
    } else {
        sparkDrive.getAccessToken(code, function(token){
            $('body').removeClass('hidden');
            if (token) {
                window.location = APP_HOME;
            } else {
                console.log('Problem with fetching token');
            }
        });
    }
}(jQuery));
