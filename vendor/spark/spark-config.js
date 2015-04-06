//Various Spark config parameters
var CONST = function () {

	var //apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
		apiHostSandbox = 'api-alpha.spark.autodesk.com/api/v1',
		apiHostProduction = 'api.spark.autodesk.com/api/v1';

	return {
		API_HOST: ENVIRONMENT === 'production' ? apiHostProduction : apiHostSandbox,
		API_PROTOCOL: 'https' //The protocol of the server
	}
}();

// Spark constants
var IMPORT_TASK_TYPE = 'import';
var ANALYZE_TASK_TYPE = 'analyze';
var REPAIR_TASK_TYPE = 'repair';
var EXPORT_TASK_TYPE = 'export';

var RUNNING_TASK_STATUS = 'running';
var ERROR_TASK_STATUS = 'error';
var DONE_TASK_STATUS = 'done';


