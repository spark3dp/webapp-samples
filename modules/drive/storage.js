var storage = function($){
	'use strict';

	return {

		/**
		 * Run onload
		 */
		init: function(){

			//if the user is not logged in show him the login page
			//otherwise show him the first assets screen
			if (!sparkAuth.isTokenValid()) {
				auth.loadAuthScreen('#app-screen');
			}else{

			}
		}
	}

}(jQuery);