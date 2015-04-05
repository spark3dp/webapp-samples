//Various Spark config parameters

var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
//var apiHostSandbox = 'api-alpha.spark.autodesk.com/api/v1',
	apiHostProduction = 'api.spark.autodesk.com/api/v1',
	apiHost = ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox,
	endUserAuthorizationEndpoint = apiHost + "/oauth/authorize", // The page of the authorize
	protocol = 'https'; //The protocol of the server
;

// Spark constants
const IMPORT_TASK_TYPE = 'import';
const ANALYZE_TASK_TYPE = 'analyze';
const REPAIR_TASK_TYPE = 'repair';
const EXPORT_TASK_TYPE = 'export';

const RUNNING_TASK_STATUS = 'running';
const ERROR_TASK_STATUS = 'error';
const DONE_TASK_STATUS = 'done';



