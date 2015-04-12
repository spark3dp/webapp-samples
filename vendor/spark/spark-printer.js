/**
 * Created by michael on 2/5/15.
 */



var sparkPrint = function () {

	var serverUrl = "https://api-alpha.spark.autodesk.com/api/v1/"

	/**
	 * Return the factory object
	 */
	return {


		registerPrinter: function (memberID,token,printerName,callback,errorCallback) {
			//Make sure token is still valid
			if (sparkAuth.isTokenValid()) {
/**
					var headers = {
						"X-Member-id":memberID,
						"Content-type": "application/x-www-form-urlencoded"
					}
 */
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


		getAllPrinters: function (memberID,callback) {
			//Make sure token is still valid
			if (sparkAuth.isTokenValid()) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					Util.xhr(serverUrl + 'print/printers', 'GET', '', headers, callback);
				}else{
					callback(false);
				}

		},

		printJob: function (memberID,fileUrl, printerId,settings,callback,errorCallback) {
			//Make sure token is still valid
			if (sparkAuth.isTokenValid()) {

					var params =JSON.stringify( {printable_id:fileUrl,settings:settings});
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
		 * Create a new asset
		 * @param assetPost
		 */
		getJobsStatusByPrinter: function (memberID,printerId,callback) {
			//Make sure token is still valid
			if (sparkAuth.isTokenValid()) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					Util.xhr(serverUrl + 'print/printers/' + printerId + "/jobs", 'GET', '', headers, callback);
				}else{
					callback(false);
				}

		},

		sendPrintCommand: function(memberID,printerID,jobId,command,callback,errorCallback){
			if (sparkAuth.isTokenValid()) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					Util.xhr(serverUrl + 'print/printers/' + printerID + "/command", 'POST', 'command='+command+"&job_id="+jobId, headers, callback);
				}else{
					callback(false);
				}

		}
	}


}();
