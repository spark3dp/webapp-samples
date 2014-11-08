$(function ($) {

    var code = sparkDrive.extractSparkRedirectionCode();

    //New page load and no token yet
    if (!code && !localStorage.getItem('spark-drive-token')) {
        sparkDrive.redirectToAuthLoginURL();
    //Came from redirection or we have token in local storage
    } else {
        sparkDrive.getAccessToken(code, function(token){
            $('body').removeClass('hidden');
            if (token) {
                console.log(token);

                window.location = window.location.protocol + "//" + window.location.hostname + '/drive-gallery';
            } else {
                console.log('Problem with fetching token');
            }
        });
    }
}(jQuery));
