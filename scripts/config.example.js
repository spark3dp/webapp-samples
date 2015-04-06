var SERVER_URL = '<address of your server>'; //The URL of your server that has an implementation of auth2.0 techniques (i.e. http://example.com)

var AUTH_URL = SERVER_URL + '/auth';// The redirect URI for the auth service that is implemented by your server (i.e. http://example.com/auth)
var GUEST_TOKEN_URL = SERVER_URL + '/guest_token';// The guest token endpoint that is implemented by your server (i.e. http://example.com/guest_token)
var ENVIRONMENT = 'sandbox'; // sandbox/production
