/**
 * Created by roiyarden on 3/26/15.
 */
var sparkPrintPrep = function() {
	'use strict';

	return {
		/**
		 * Upload file via Spark drive (usually a 3D format type as stl,obj),then the mesh is being imported.
		 * @param files - files to be uploaded
		 * @param events - map of events to support the ajax async call
		 */
			uploadFileAndImport: function (files,mainCallback) {
				var token = sparkAuth.isTokenValid();
				if (token) {
					var callback = function(filesResp){
						if (filesResp.files != undefined && filesResp.files.length > 0) {

							sparkPrintPrep.importMesh(filesResp.files[0].file_id, filesResp.files[0].name,mainCallback);

						}
						else {
							console.log('An upload error occurred!');
						}

					};
					sparkDrive.uploadFileToDrive(files,false,callback);
				}


			},
		/**
		 * Importing the Mesh from the file on Spark drive creating a mesh on print servers.
		 * @param fileId - spark drive file id
		 * @param fileName - spark drive file name
		 * @param events - map of events to support the ajax async call
		 */
		importMesh: function (fileId, fileName,mainCallback) {

			var token = sparkAuth.isTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/geom/meshes/import';

					var params = "file_id=" + fileId + "&name=" + fileName + "&generate_visual=true";


					Util.xhr(url, 'POST', params, headers, function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					});
				}




		},
		/**
		 * Get the task and perform the needed logic for all the available tasks
		 * @param taskId
		 * @param taskType
		 * @param events - map of events to support the ajax async call
		 */
		getTask: function (taskId,mainCallback) {
			var token = sparkAuth.isTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/print/tasks/' + taskId;


					var callback = function (response) {
						if (response.status === RUNNING_TASK_STATUS ){
							setTimeout(function() {
								sparkPrintPrep.getTask(taskId, mainCallback);
								return;
							}, 500);

						}
						else if (response.status === ERROR_TASK_STATUS){
							console.log('Operation Failed: Error code:'+response.error.code);
							return;

						}
						else{
							mainCallback(response.result);
						}
					};

					Util.xhr(url, 'GET', '', headers, callback,undefined,undefined,undefined);
				}


		},
		/**
		 * analyze mesh to find problems.
		 * @param events - map of events to support the ajax async call
		 */
		analyzeMesh: function (meshId,mainCallback) {

			var token = sparkAuth.isTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/geom/meshes/analyze';

					var params = "id=" + meshId;

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					};

					Util.xhr(url, 'POST', params, headers, callback,undefined,undefined,undefined);
				}



		},
		/**
		 * reapir mesh problems (actually does analyze and repair if not analyzed).
		 * @param events - map of events to support the ajax async call
		 */
		repairMesh: function (meshId,mainCallback) {

			var token = sparkAuth.isTokenValid();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/geom/meshes/repair';

					var params = "id=" + meshId + "&all=true";

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id,mainCallback);

					};

					Util.xhr(url, 'POST', params, headers, callback,undefined,undefined,undefined);
				}



		},
		/**
		 * export the mesh to a desired file type
		 * @param events - map of events to support the ajax async call
		 */
		exportMesh: function (meshId,mainCallback) {

			var token = sparkAuth.isTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/geom/meshes/export';

				var params = "id=" + meshId + "&file_type=obj";

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, mainCallback);

				};

				Util.xhr(url, 'POST', params, headers, callback);
			}


		},

		/**
		 *
		 * @param fileId
		 */
		downloadFile: function(fileId, mainCallback){
			var token = sparkAuth.isTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};
				var url = CONST.API_PROTOCOL + '://' + CONST.API_HOST + '/files/download?file_ids='+fileId;


				var callback = function (response) {
					mainCallback(response);

				};

				Util.xhr(url, 'GET', '', headers, callback,undefined,false);
			}

		},

		createTray: function (meshIds, printerTypeId, profileId,mainCallback) {

			var token = sparkAuth.isTokenValid();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + token,
					"Content-type": "application/json"
				};
				var url = protocol + '://' + apiHost + 'print/trays';

				//var params = "id=" + mesh_id + "&file_type=obj";
				var params = {
					"printer_type_id": "7FAF097F-DB2E-45DC-9395-A30210E789AA",
					"profile_id": "34F0E39A-9389-42BA-AB5A-4F2CD59C98E4",
					"mesh_ids":["cc9c967e-79dc-4b08-aefa-1f583c397a30"]
				};
				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, EXPORT_TASK_TYPE, events);

				};

				Util.xhr(url, 'POST', params, headers, callback);
			}


		}
	}


}();