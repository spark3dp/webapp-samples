/**
 * Our spark auth object
 */
var sparkAuth = function () {



	/**
	 * Get guest token
	 * @param code
	 * @param callback
	 */
	var getGuestTokenFromServer = function (callback) {
		var params = "grant_type=client_credentials";
		var headers = {
			"Authorization": "Basic " + AUTH_HASH,
			"Content-type": "application/x-www-form-urlencoded"
		}

		Util.xhr(protocol + '://' + apiHost + '/oauth/accesstoken', 'POST', params, headers, function(response){

			var date = new Date();
			var now = date.getTime();
			response.expires_at = now+parseInt(response.expires_in)*1000;
			localStorage.setItem('spark-guest-token', JSON.stringify(response));
			callback(response);
		});

	};

	/**
	 * Fetch current member
	 * @param callback
	 */
	var getMemberFromServer = function(callback) {
		var headers = {
			"Authorization": "Bearer " + sparkAuth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = protocol + '://' + apiHost + '/members/' + sparkAuth.accessToken(true).spark_member_id;
		Util.xhr(url, 'GET', '', headers, function(response){
			var date = new Date();
			var now = date.getTime();
			//expire in 2 hours
			response.expires_at = now + 7200*1000;
			localStorage.setItem('spark-member', JSON.stringify(response));
			callback(response);
		});
	};

	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Get current member as there is no end point for that :(
		 */
		checkTokenValidity:function (callback) {

			var token = JSON.parse(localStorage.getItem('spark-token'));
			var date = new Date();
			var now = date.getTime();
			if (token && token.expires_at && token.expires_at > now){
				callback(true);
			}else{
				sparkAuth.logout();
			}


		},

		/**
		 * Logout the user - clear the token in local storage
		 */
		logout: function(){
			localStorage.removeItem('spark-token');
			localStorage.removeItem('spark-member');
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
					var date = new Date();
					var now = date.getTime();
					response.expires_at = now+parseInt(response.expires_in)*1000;
					localStorage.setItem('spark-token', JSON.stringify(response));
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
					var member = JSON.parse(localStorage.getItem('spark-member'));
					var date = new Date();
					var now = date.getTime();
					if (member && member.expires_at && member.expires_at > now){
						callback(member);
					}else{
						getMemberFromServer(function(member){
							callback(member);
						});
					}
				}else{
					callback(false);
				}
			});
		},
		/**
		 * Get access token
		 * @returns {*|any}
		 */
		accessToken: function(returnFullObject){
			var token = JSON.parse(localStorage.getItem('spark-token'));
			if (token){
				return (returnFullObject ? token : token.access_token);
			}else{
				return false;
			}
		},

		/**
		 * Get the guest token
		 * @param callback
		 */
		getGuestToken: function(callback){
			var guestToken = JSON.parse(localStorage.getItem('spark-guest-token'));
			var date = new Date();
			var now = date.getTime();
			if (guestToken && guestToken.expires_at && guestToken.expires_at > now){
				callback(guestToken.access_token);
			}else{
				getGuestTokenFromServer(function(response){
					callback(response.access_token);
				});
			}

		}
	};


}();
