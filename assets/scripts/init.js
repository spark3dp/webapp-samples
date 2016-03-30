//Init the Spark Client - you may supply your personal config through the assets/scripts/config.js file
var APP_KEY = APP_KEY || '',
	REDIRECT_URI = REDIRECT_URI || '',
	IS_PRODUCTION_ENVIRONMENT = IS_PRODUCTION_ENVIRONMENT || false;

var options = {
	isProduction: IS_PRODUCTION_ENVIRONMENT,
	redirectUri: REDIRECT_URI
};

ADSKSpark.Client.initialize(APP_KEY, options);

/*---SegmentAnalytics---*/