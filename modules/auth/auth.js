var auth = function($){
	'use strict';

	return {


		/**
		 * Set up the iframe for the login screen
		 * and it's appropriate source
		 */
		loadAuthScreen: function(elem){
			$(elem).load('modules/auth/auth.html', function(){
				$('#auth-iframe-wrapper iframe').attr('src',sparkAuth.redirectToAuthLoginURL(true));
			});
		}
	}

}(jQuery);