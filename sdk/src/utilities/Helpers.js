var ADSKSpark = ADSKSpark || {};

/**
 * Our utilities object
 */
ADSKSpark.Helpers = function () {
	'use strict';

	/**
	 * Return the factory object
	 */
	var helpers =  {

		/**
		 * Open window in the center of the screen
		 * @param url
		 * @param title
		 * @param w
		 * @param h
		 * @returns {*}
		 */
		popupWindow: function (url, title, w, h) {
			var left = (screen.width / 2) - (w / 2);
			var top = (screen.height / 3) - (h / 3);
			return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		},

		/**
		 * Transform parameter strings to array of params
		 * @param prmstr
		 * @returns {{}}
		 */
		transformToAssocArray: function (prmstr) {
			var params = {};
			var prmarr = prmstr.split("&");
			for (var i = 0; i < prmarr.length; i++) {
				var tmparr = prmarr[i].split("=");
				params[tmparr[0]] = tmparr[1];
			}
			return params;
		},
		/**
		 * Extract params from URL
		 * @returns {{}}
		 */
		extractParamsFromURL: function(){
			var prmstr = window.location.search.substr(1);
			var getParams = prmstr != null && prmstr != "" ? helpers.transformToAssocArray(prmstr) : [];

			return getParams;
		},
	}

	return helpers;


}();