var storage = function($){
	'use strict';

	return {

		/**
		 * Run onload
		 */
		init: function(){
			auth.loadAuthScreen('#app-screen');
		}
	}

}(jQuery);