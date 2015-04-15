jQuery(function ($) {

	if (spark.auth.isAccessTokenValid()) {
		$('.logged-in').removeClass('hidden');
		$('.row.marketing').removeClass('hidden');
		spark.auth.getMyProfile(function (response) {
			console.info(response.member);
			$('#user span').text(response.member.screen_name);
			$('#user-image').removeClass('hidden');
			$('#user img').attr('src', response.member.profile.avatar_path);
		});
		// This section is performed if there is no access token
	} else {
		$('.logged-out').removeClass('hidden');
	}

}(jQuery));