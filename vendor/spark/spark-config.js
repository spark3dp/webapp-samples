//Various Spark config parameters

var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
//var apiHostSandbox = 'api-alpha.spark.autodesk.com/api/v1',
	apiHostProduction = 'api.spark.autodesk.com/api/v1',
	apiHost = ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox,
	endUserAuthorizationEndpoint = apiHost + "/oauth/authorize", // The page of the authorize
	protocol = 'https'; //The protocol of the server
;

// Spark constants
var IMPORT_TASK_TYPE = 'import';
var ANALYZE_TASK_TYPE = 'analyze';
var REPAIR_TASK_TYPE = 'repair';
var EXPORT_TASK_TYPE = 'export';

var RUNNING_TASK_STATUS = 'running';
var ERROR_TASK_STATUS = 'error';
var DONE_TASK_STATUS = 'done';



