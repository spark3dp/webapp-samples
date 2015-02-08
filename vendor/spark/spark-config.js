//Various Spark config parameters

var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
	apiHostProduction = 'api.spark.autodesk.com/api/v1',
	apiHost = ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox,
	endUserAuthorizationEndpoint = apiHost + "/oauth/authorize", // The page of the authorize
	protocol = ENVIRONMENT === 'production' ? 'https' : 'http' //The protocol of the server
;