/**
 * Our spark auth object
 * See API reference - http://docs.spark.authentication.apiary.io/
 */
spark.auth = function () {
	'use strict';

	/**
	 * Get from local storage the token obj, and return it parsed
	 * @returns {*|any}
	 */
	var getTokenObj = function () {
		var rawToken = localStorage.getItem('spark-access-token');

		return rawToken ? JSON.parse(rawToken) : {};

	}

	/**
	 * Get guest token from your local server
	 * @param code
	 * @param callback
	 */
	var getGuestTokenFromServer = function (callback) {

		spark.util.xhr(GUEST_TOKEN_URL, 'GET', {}, {}, function (response) {

			var date = new Date();
			var now = date.getTime();
			response.expires_at = now + parseInt(response.expires_in) * 1000;
			localStorage.setItem('spark-guest-token', JSON.stringify(response));
			callback(response);
		});

	};

	/**
	 * Fetch current logged in member
	 * @param callback
	 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/members/members-without-id/retrieve-the-current-member
	 */
	var getMemberFromServer = function (callback) {
		var headers = {
			"Authorization": "Bearer " + spark.auth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/members/' + spark.auth.accessToken(true).spark_member_id;
		spark.util.xhr(url, 'GET', '', headers, function (response) {
			var date = new Date();
			var now = date.getTime();
			//expire in 2 hours
			response.expires_at = now + 7200 * 1000;
			localStorage.setItem('spark-member', JSON.stringify(response));
			callback(response);
		});
	};

	/**
	 * Return the Auth2.0 provider login screen URL
	 * @returns {string}
	 * See API reference - http://docs.spark.authentication.apiary.io/#reference/oauth-2.0/access-token
	 */
	var getAuthLoginUrl = function(){
		return spark.const.API_PROTOCOL + "://" + spark.const.API_SERVER + '/oauth/authorize' +
			"?response_type=code" +
			"&client_id=" + CLIENT_ID
			"&redirect_uri=" + REDIRECT_URL
			;
	};

	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Check if access token validaty
		 */
		isAccessTokenValid: function () {
			var token = getTokenObj();
			var date = new Date();
			var now = date.getTime();
			return (token && token.expires_at && new Date(token.expires_at).getTime() > now);


		},

		/**
		 * Logout the user - clear the token and the member in local storage
		 */
		logout: function () {
			localStorage.removeItem('spark-access-token');
			localStorage.removeItem('spark-member');
			location.reload();
		},

		getAuthLoginUrl: getAuthLoginUrl,

		/**
		 * Redirect user to Auth login page
		 */
		redirectToAuthLoginURL: function () {
			window.location = getAuthLoginUrl();
		},

		/**
		 * Get the access token
		 * @param code - The code from the previous step
		 * @param callback - Callback to run after getting the access token
		 */
		getAccessToken: function (code, callback) {
			var params = "code=" + code;

			spark.util.xhr(ACCESS_TOKEN_URL + '?' + params, 'GET', {}, {}, function (response) {

				//If request was for access token, set it in localStorage
				if (response.access_token) {
					var date = new Date();
					var now = date.getTime();
					response.expires_at = now + parseInt(response.expires_in) * 1000;
					localStorage.setItem('spark-access-token', JSON.stringify(response));
				}
				callback(response);
			});

		},


		/**
		 * Gets logged in user profile
		 * @param callback
		 */
		getMyProfile: function (callback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {
				var member = JSON.parse(localStorage.getItem('spark-member'));
				var date = new Date();
				var now = date.getTime();
				if (member && member.expires_at && member.expires_at > now) {
					callback(member);
				} else {
					getMemberFromServer(function (member) {
						callback(member);
					});
				}
			} else {
				callback(false);
			}
		},
		/**
		 * Get access token
		 * @returns {*|any}
		 */
		accessToken: function (returnFullObject) {
			var token = getTokenObj();
			if (token) {
				return (returnFullObject ? token : token.access_token);
			} else {
				return false;
			}
		},

		/**
		 * Get the guest token from localStorage. If missing - make a server
		 * call to acquire a new guest token
		 * @param callback
		 */
		getGuestToken: function (callback) {
			var guestToken = JSON.parse(localStorage.getItem('spark-guest-token'));
			var date = new Date();
			var now = date.getTime();
			if (guestToken && guestToken.expires_at && guestToken.expires_at > now) {
				callback(guestToken.access_token);
			} else {
				getGuestTokenFromServer(function (response) {
					callback(response.access_token);
				});
			}

		},
		/**
		 * method checking validity of access token and return it if it is valid ,false otherwise.
		 * @returns {*}
		 */
		getValidAccessToken: function () {
			var token = getTokenObj();
			var date = new Date();
			var now = date.getTime();
			if (token && token.expires_at && token.expires_at > now) {
				return token.access_token;
			} else {
				return false;
			}
		}
	};


}();
