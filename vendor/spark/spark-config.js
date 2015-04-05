//Various Spark config parameters

//var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
var apiHostSandbox = 'api-alpha.spark.autodesk.com/api/v1',
	apiHostProduction = 'api.spark.autodesk.com/api/v1',
	apiHost = ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox,
	endUserAuthorizationEndpoint = apiHost + "/oauth/authorize", // The page of the authorize
	protocol = 'https'; //The protocol of the server
;
