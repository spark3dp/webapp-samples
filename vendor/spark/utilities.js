/**
 * Our utilities object
 */
var Util = function () {

	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Standard AJAX requests
		 * @param url
		 * @param method
		 * @param params
		 * @param headers
		 * @param callback
		 */
		xhr:function (url, method, params, headers, callback) {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url, true);

			for (var i in headers) {
				xhr.setRequestHeader(i, headers[i]);
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200 || xhr.status == 201) {
						var response = JSON.parse(xhr.responseText);
						callback(response);
					}else{
						//Server or auth error
						callback(false);
					}
				}
			}
			xhr.send(params);
		},

		/**
		 * Transform parameter strings to array of params
		 * @param prmstr
		 * @returns {{}}
		 */
		transformToAssocArray:function (prmstr) {
			var params = {};
			var prmarr = prmstr.split("&");
			for (var i = 0; i < prmarr.length; i++) {
				var tmparr = prmarr[i].split("=");
				params[tmparr[0]] = tmparr[1];
			}
			return params;
		},

		/**
		 * Extract the auth code
		 */
		extractRedirectionCode: function () {
			var prmstr = window.location.search.substr(1);
			var getParams = prmstr != null && prmstr != "" ? Util.transformToAssocArray(prmstr) : [];

			return getParams['code'] ? getParams['code'] : null;
		},

	}


}();