/**
 * Our spark printer object
 * See API reference - http://docs.sparkprint1.apiary.io/
 * Created by michael on 2/5/15.
 */



var sparkPrint = function () {
	'use strict';

	var serverUrl = spark.const.API_PROTOCOL + '://' + spark.const.API_SERVER + '/';

	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Get printer type by type id.
		 * @param type_id
		 * @param callback
		 * @param errorCallback
		 */
		getPrinterTypeById: function (type_id, callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = serverUrl + "printdb/printertypes/" + type_id
				spark.util.xhr(url, 'GET', "", headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},

		/**
		 * Get printer types.
		 * @param callback
		 * @param errorCallback
		 */
		getPrinterTypes: function ( callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = serverUrl + "printdb/printertypes"
				spark.util.xhr(url, 'GET', "", headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},


		/**
		 * Registers a printer for the logged in user.
		 * @param printerName
		 * @param callback
		 * @param errorCallback
		 */
		registerPrinter: function (token, printerName,callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = serverUrl + "print/printers/register"
				spark.util.xhr(url, 'POST', "registration_code="+token+"&printer_name="+printerName, headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},

		/**
		 * Unregisters a printer for the logged in user.
		 * @param printer_id
		 * @param callback
		 * @param errorCallback
		 */
		unregisterPrinter: function (printer_id,callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = serverUrl + "print/printers/" + printer_id;
				spark.util.xhr(url, 'DELETE', '', headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},


		/**
		 * Gets all printer that are registered to the logged in user
		 * @param callback
		 * @param errorCallback
		 */
		getAllPrinters: function (callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				spark.util.xhr(serverUrl + 'print/printers', 'GET', '', headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},

		/**
		 * Sends a print job
		 * @param printableId
		 * @param printerId
		 * @param settings
		 * @param callback
		 * @param errorCallback
		 */
		printJob: function (printableId, printerId,settings,callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {

				var params =JSON.stringify( {printable_url:printableId,settings:settings});

				//var params = {printable_id:fileUrl,settings:settings};
				//var params = "printable_url="+printableId;

				console.log(params);

				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/json"
				};
				var url = serverUrl + 'print/printers/'+printerId+"/jobs";
				spark.util.xhr(url, 'POST', params, headers, callback,errorCallback);

			}else{
				callback(false);
			}

		},

		/**
		 * Returns all job statuses for printer specified by printerId
		 * @param printerId
		 * @param callback
		 * @param errorCallback
		 */
		getJobsStatusByPrinter: function (printerId,callback,errorCallback) {
			//Make sure token is still valid
			if (spark.auth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				spark.util.xhr(serverUrl + 'print/printers/' + printerId + "/jobs", 'GET', '', headers, callback,errorCallback);
			}else{
				callback(false);
			}

		},

		/**
		 * Sends a command(resume/pause/cancel) to a specific printer with specific job
		 * @param printerID
		 * @param jobId
		 * @param command - resume/pause/cancel
		 * @param callback
		 * @param errorCallback
		 */
		sendPrintCommand: function(printerID,jobId,command,callback,errorCallback){
			if (spark.auth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + spark.auth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				spark.util.xhr(serverUrl + 'print/printers/' + printerID + "/command", 'POST', 'command='+command+"&job_id="+jobId, headers, callback,errorCallback);
			}else{
				callback(false);
			}

		}
	}


}();
