//Init the Spark Client - you may supply your personal config through the assets/scripts/config.js file
var APP_KEY = APP_KEY || '',
	GUEST_TOKEN_URL = GUEST_TOKEN_URL || 'http://localhost:3000/guest_token',
	ACCESS_TOKEN_URL = ACCESS_TOKEN_URL || 'http://localhost:3000/access_token',
	REFRESH_TOKEN_URL = REFRESH_TOKEN_URL || 'http://localhost:3000/refresh_token',
	REDIRECT_URI = REDIRECT_URI || '';

var isProd = (ENVIRONMENT == "sandbox") ? false : true;

ADSKSpark.Client.initialize(APP_KEY,// Your app key
	isProd,
	REDIRECT_URI,
	GUEST_TOKEN_URL,// The guest token endpoint that is implemented by your server (i.e. http://example.com/guest_token)
	ACCESS_TOKEN_URL,// The access token endpoint that is implemented by your server (i.e. http://example.com/access_token)
	REFRESH_TOKEN_URL// The refresh access token endpoint that is implemented by your server (i.e. http://example.com/refresh_token)

);