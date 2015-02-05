$(function ($) {
    //This section is only performed if there is an access token
    if (localStorage.getItem('spark-drive-token')) {

        $('.logged-in').removeClass('hidden');

        sparkAuth.getMyProfile(function (profile) {
            $('#user span').text(profile.name);
            $('#user img').attr('src', profile.profile.avatar_path);
        });
      // This section is performed if there is no access token
    } else {
        $('.logged-out').removeClass('hidden');
    }

}(jQuery));
