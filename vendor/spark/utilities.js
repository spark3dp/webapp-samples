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
		 * @param url - the url to send the request to
		 * @param method - http method type
		 * @param params - http call parameters
		 * @param headers - http call headers
		 * @param callback - callback function in case of success or fail if no error callback exists.
		 * @param errorCallback - error callback function.
		 * @param isJsonResponse - indication if the response is json one, true or undefined are json response.
		 * @param xhrEventMap - map of events with callback functions to perform when the event listener fire the event.
		 */
		xhr: function (url, method, params, headers, callback, errorCallback, isJsonResponse, xhrEventMap) {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url, true);

			for (var i in headers) {
				xhr.setRequestHeader(i, headers[i]);
			}


			xhr.onload = function () {
				if (xhr.status == 200 || xhr.status == 201 || xhr.status == 202) {
					var response = xhr.responseText;
					if (isJsonResponse == undefined || isJsonResponse == true) {
						response = JSON.parse(xhr.responseText);
					}
					callback(response);
				} else {
					if (errorCallback !== undefined) {
						errorCallback(xhr.responseText)
					}
					else {
						//Server or auth error
						callback(false);
					}
				}

			};
			if (xhrEventMap != undefined) {
				for (var key in xhrEventMap) {
					xhr.addEventListener(key, xhrEventMap[key], false);
				}
			}

			xhr.send(params);
		},

		/**
		 * Get a cookie by cookie name
		 * @param cookieName
		 * @returns {*}
		 */
		getCookie: function (cookieName) {

			function getRawCookie(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) === ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) !== -1) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			}

			var sessionCookie = getRawCookie(cookieName);

			if (sessionCookie) {
				return JSON.parse(decodeURIComponent(sessionCookie));
			}

			return false;
		},

		/**
		 * Expire the cookie
		 * @param cname
		 */
		expireCookie: function (cname) {

			var date = new Date();
			date.setTime(date.getTime() - 1);
			var expires = "; expires=" + date.toUTCString();

			document.cookie = cname + "=" + expires + "; path=/";
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
		}


	}


}();