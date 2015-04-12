/**
 * Created by michael on 2/5/15.
 */



var sparkPrint = function () {

	var serverUrl = "https://api-alpha.spark.autodesk.com/api/v1/"

	/**
	 * Return the factory object
	 */
	return {


		/**
		 * Registers a printer for the logged in user.
		 * @param printerName
		 * @param callback
		 * @param errorCallback
		 */
		registerPrinter: function (token, printerName,callback,errorCallback) {
			//Make sure token is still valid
			if (sparkAuth.isTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};

				var url = serverUrl + "print/printers/register"
				Util.xhr(url, 'POST', "registration_code="+token+"&printer_name="+printerName, headers, callback,errorCallback);
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
			if (sparkAuth.isTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				Util.xhr(serverUrl + 'print/printers', 'GET', '', headers, callback,errorCallback);
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
			if (sparkAuth.isTokenValid()) {

				var params =JSON.stringify( {printable_id:printableId,settings:settings});
				//var params = {printable_id:fileUrl,settings:settings};
				console.log(params);
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/json"
				};
				var url = serverUrl + 'print/printers/'+printerId+"/jobs";
				Util.xhr(url, 'POST', params, headers, callback,errorCallback);
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
			if (sparkAuth.isTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				Util.xhr(serverUrl + 'print/printers/' + printerId + "/jobs", 'GET', '', headers, callback,errorCallback);
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
			if (sparkAuth.isTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				Util.xhr(serverUrl + 'print/printers/' + printerID + "/command", 'POST', 'command='+command+"&job_id="+jobId, headers, callback,errorCallback);
			}else{
				callback(false);
			}

		}
	}


}();
