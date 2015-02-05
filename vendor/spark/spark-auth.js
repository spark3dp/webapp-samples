/**
 * Our spark auth object
 */
var sparkAuth = function () {
	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Get current member as there is no end point for that :(
		 */
		checkTokenValidity:function (callback) {

			var headers = {
				"Authorization": "Bearer " + localStorage.getItem('spark-drive-token'),
				"Content-type": "application/x-www-form-urlencoded"
			}
			var url = protocol + '://' + apiHost + '/members/' + sparkAuth.getMember().acs_member_id;
			Util.xhr(url, 'GET', '', headers, function(response){
				if (!response){
					sparkAuth.logout();
				}
				callback(response);
			});
		},

		/**
		 * Logout the user - clear the token in local storage
		 */
		logout: function(){
			localStorage.removeItem('spark-drive-token');
			location.reload();
		},

		/**
		 * Redirect user to Drive login page
		 */
		redirectToAuthLoginURL: function(){
			var authUrl = "https://" + endUserAuthorizationEndpoint +
					"?response_type=code" +
					"&client_id=" + CLIENT_ID +
					"&redirect_uri=" + REDIRECT_URL
				;

			window.location = authUrl;
		},

		/**
		 * Get the access token
		 * @param code - The code from the previous step
		 * @param callback - Callback to run after getting the access token
		 */
		getAccessToken: function (code, callback) {
			var params = "code=" + code + "&grant_type=authorization_code&response_type=code&redirect_uri=" + REDIRECT_URL;
			var headers = {
				"Authorization": "Basic " + AUTH_HASH,
				"Content-type": "application/x-www-form-urlencoded"
			}
			Util.xhr(protocol + '://' + apiHost + '/oauth/accesstoken', 'POST', params, headers, function(response){

				//If request was for access token, set it in localStorage
				if (response.access_token) {
					localStorage.setItem('spark-drive-token', response.access_token);
					localStorage.setItem('spark-drive-member', JSON.stringify(response));
				}

				callback(response);
			});

		},

		/**
		 * Gets user profile
		 * @param callback
		 */
		getMyProfile: function (callback) {
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					callback(response.member);
				}else{
					callback(false);
				}
			});
		},
		/**
		 * Get the member object as JSON from localStorage
		 * @returns {*|any}
		 */
		getMember: function(){
			var memberAsJsonStr = localStorage.getItem('spark-drive-member');
			return JSON.parse(memberAsJsonStr);
		},

		/**
		 * Is the user logged in?
		 * @returns {*|any}
		 */
		isLoggedIn: function(){
			return localStorage.getItem('spark-drive-token');
		}
	};


}();