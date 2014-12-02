$(function ($) {

    var code = sparkDrive.extractSparkRedirectionCode();

    //New page load and no token yet
    if (!code && !localStorage.getItem('spark-drive-token')) {
        //Get the Auth Code which is a required when requesting an access token.
        sparkDrive.redirectToAuthLoginURL();
    //Either returning from getting the Auth Code or there is an access token already in storage
    } else {
        sparkDrive.getAccessToken(code, function(token){
            $('body').removeClass('hidden');
            if (token) {
                console.log(token);
    // replace "/drive-gallery" with the path of your web server folder whcih contains the sample code
                window.location = window.location.protocol + "//" + window.location.hostname + '/drive-gallery';
            } else {
                console.log('Problem with fetching token');
            }
        });
    }
}(jQuery));
