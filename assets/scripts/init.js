//Init the Spark Client - you may supply your personal config through the assets/scripts/config.js file
var APP_KEY = APP_KEY || '',
	SERVER_URL = SERVER_URL || 'http://localhost:3000',
	REDIRECT_URI = REDIRECT_URI || '';

var isProd = (ENVIRONMENT == "sandbox") ? false : true;

ADSKSpark.Client.initialize(
	APP_KEY,
	isProd,
	REDIRECT_URI,
	SERVER_URL

);