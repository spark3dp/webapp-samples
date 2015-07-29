var spark = {};

var IS_PROD = IS_PROD || false;

//Various Spark constants
spark.const = function () {
	'use strict';

	//var apiHostSandbox = 'api-alpha.spark.autodesk.com/api/v1',
	var apiHostSandbox = 'sandbox.spark.autodesk.com/api/v1',
		apiHostProduction = 'api.spark.autodesk.com/api/v1';

	return {
		API_SERVER: IS_PROD ? apiHostProduction : apiHostSandbox,
		API_PROTOCOL: 'https', //The protocol of the server
		EXPORT_TASK_TYPE: 'export',
		ERROR_TASK_STATUS: 'error',
		RUNNING_TASK_STATUS: 'running'

	}
}();


