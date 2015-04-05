/**
 * Created by roiyarden on 3/26/15.
 */
var sparkPrintPrep = function() {

	var mesh_id;
	var download_file_id;
	var problems ='';
	var downloadFileData;
	return {
		/**
		 * Upload file via Spark drive (usually a 3D format type as stl,obj),then the mesh is being imported.
		 * @param files - files to be uploaded
		 * @param events - map of events to support the ajax async call
		 */
		uploadFileAndImport: function (files,events) {
			var token = sparkAuth.getValidAccessToken();
				if (token) {
					var callback = function(filesResp){
						if (filesResp.files != undefined && filesResp.files.length > 0) {

							sparkPrintPrep.importMesh(filesResp.files[0].file_id, filesResp.files[0].name,events)


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
		importMesh: function (fileId, fileName,events) {

			var token = sparkAuth.getValidAccessToken();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = protocol + '://' + apiHost + '/geom/meshes/import';

					var params = "file_id=" + fileId + "&name=" + fileName + "&generate_visual=true";


					Util.xhr(url, 'POST', params, headers, function (response) {

							sparkPrintPrep.getTask(response.id, IMPORT_TASK_TYPE,events);

					});
				}




		},
		/**
		 * Get the task and perform the needed logic for all the available tasks
		 * @param taskId
		 * @param taskType
		 * @param events - map of events to support the ajax async call
		 */
		getTask: function (taskId, taskType,events) {
			var token = sparkAuth.getValidAccessToken();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = protocol + '://' + apiHost + '/print/tasks/' + taskId;


					var callback = function (response) {
						if (response.status === RUNNING_TASK_STATUS ){
							sparkPrintPrep.getTask(taskId, taskType);
							return;
						}
						else if (response.status === ERROR_TASK_STATUS){
							console.log('Operation Failed:'+taskType+' Error code:'+response.error.code);
							return;

						}
						if (taskType === IMPORT_TASK_TYPE) {
							mesh_id = response.result.id;
						}
						else if (taskType === ANALYZE_TASK_TYPE) {
							mesh_id = response.result.id;
							if (response.result.problems.length ==0){
								problems = 'No Problems!'
							}
							else{
								problems = JSON.stringify(response.result.problems);
							}
						}
						else if (taskType === REPAIR_TASK_TYPE) {
							mesh_id = response.result.id;
							if (response.result.problems.length ==0){
								problems = 'No Problems!'
							}
							else{
								problems = JSON.stringify(response.result.problems);
							}
						}
						else if (taskType === EXPORT_TASK_TYPE) {
							download_file_id = response.result.file_id;
							sparkPrintPrep.downloadFile(download_file_id);

						}
					};

					Util.xhr(url, 'GET', '', headers, callback,undefined,undefined,events);
				}


		},
		/**
		 * analyze mesh to find problems.
		 * @param events - map of events to support the ajax async call
		 */
		analyzeMesh: function (events) {

			var token = sparkAuth.getValidAccessToken();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = protocol + '://' + apiHost + '/geom/meshes/analyze';

					var params = "id=" + mesh_id;

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id, ANALYZE_TASK_TYPE,events);

					};

					Util.xhr(url, 'POST', params, headers, callback,undefined,undefined,events);
				}



		},
		/**
		 * reapir mesh problems (actually does analyze and repair if not analyzed).
		 * @param events - map of events to support the ajax async call
		 */
		repairMesh: function (events) {

			var token = sparkAuth.getValidAccessToken();
				if (token) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = protocol + '://' + apiHost + '/geom/meshes/repair';

					var params = "id=" + mesh_id + "&all=true";

					var callback = function (response) {

							sparkPrintPrep.getTask(response.id, REPAIR_TASK_TYPE,events);

					};

					Util.xhr(url, 'POST', params, headers, callback,undefined,undefined,events);
				}



		},
		/**
		 * export the mesh to a desired file type
		 * @param events - map of events to support the ajax async call
		 */
		exportMesh: function (events) {

			var token = sparkAuth.getValidAccessToken();
			if (token) {
				var headers = {
					"Authorization": "Bearer " + token,
					"Content-type": "application/x-www-form-urlencoded"
				};
				var url = protocol + '://' + apiHost + '/geom/meshes/export';

				var params = "id=" + mesh_id + "&file_type=obj";

				var callback = function (response) {

					sparkPrintPrep.getTask(response.id, EXPORT_TASK_TYPE, events);

				};

				Util.xhr(url, 'POST', params, headers, callback);
			}


		},

		/**
		 *
		 * @param fileId
		 */
		downloadFile: function(fileId){
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};
					var url = protocol + '://' + apiHost + '/files/download?file_ids='+fileId;


					var callback = function (response) {
						downloadFileData = response;
						console.log(response);

					};

					Util.xhr(url, 'GET', '', headers, callback,undefined,false);
				}
			});

		},
		getDownlaodFileData:function(){
			return downloadFileData;
		},
		getMeshId:function(){
			return mesh_id;
		},
		getProblems:function(){
			return problems;
		}
	}


}();