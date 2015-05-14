//Init the Spark Client
var APP_KEY = CLIENT_ID || '',
	GUEST_TOKEN_URL = GUEST_TOKEN_URL || 'http://localhost:3000/guest_token',
	ACCESS_TOKEN_URL = ACCESS_TOKEN_URL || 'http://localhost:3000/access_token',
	REFRESH_TOKEN_URL = REFRESH_TOKEN_URL || 'http://localhost:3000/refresh_token';

ADSKSpark.Client.initialize(APP_KEY,// Your app key
	GUEST_TOKEN_URL,// The guest token endpoint that is implemented by your server (i.e. http://example.com/guest_token)
	ACCESS_TOKEN_URL,// The access token endpoint that is implemented by your server (i.e. http://example.com/access_token)
	REFRESH_TOKEN_URL,
	ADSKSpark.Constants.API_HOST_SANDBOX // api host - production or sandbox
);