//Init the Spark Client - you may supply your personal config through the assets/scripts/config.js file
var APP_KEY = APP_KEY || '',
	REDIRECT_URI = REDIRECT_URI || '';

var isProd = (ENVIRONMENT != "sandbox");

var options = {
	isProduction: isProd,
	redirectUri: REDIRECT_URI
};

ADSKSpark.Client.initialize(APP_KEY, options);