$(function ($) {
    //This section is only performed if there is an access token
    if (localStorage.getItem('spark-token')) {

        $('.logged-in').removeClass('hidden');

        sparkAuth.getMyProfile(function (profile) {
            $('#user span').text(profile.name);
            $('#user img').attr('src', profile.profile.avatar_path);
        });
      // This section is performed if there is no access token
    } else {
        $('.logged-out').removeClass('hidden');
    }

    /**
     * Clear the modal content after closing it
     */
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this)
            .find("input.field,textarea.field,select.field")
            .val('')
            .end();

        $(this)
            .find("img")
            .remove()
            .end()
    });

}(jQuery));
