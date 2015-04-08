/**
 * Our spark drive object
 * See API reference - http://docs.sparkdriveapi.apiary.io/
 */
var sparkDrive = function () {


	/***** PRIVATE METHODS *****/

	/**
	 * Create asset thumbnail(s)
	 * @param asset_id - The asset id for which the thumbnails are created
	 * @param file_ids - The file ids that are attached to this asset
	 * @param callback - Callback function
	 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/asset-thumbnails/create-a-new-thumbnail-within-the-asset
	 */
	var createAssetThumbnail = function (asset_id, file_ids, callback) {


		var thumbnails = [];

		for (var i = 0; i < file_ids.length; i++) {
			var thumbnail = {
				id: file_ids[i],
				caption: "thumbnail",
				description: "thumbnail",
				is_primary: true
			}

			thumbnails.push(thumbnail);
		}


		var params = "thumbnails=" + JSON.stringify(thumbnails);

		var headers = {
			"Authorization": "Bearer " + sparkAuth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + asset_id + "/thumbnails";

		Util.xhr(url, 'POST', params, headers, callback);

	};

	/**
	 * Create asset source
	 * @param asset_id - The asset id for which the thumbnails are created
	 * @param file_ids - The file ids that are attached to this asset
	 * @param callback - Callback function
	 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/asset-sources/create-a-new-source-within-the-asset
	 */
	var createAssetSource = function (asset_id, file_ids, callback) {
		var headers = {
			"Authorization": "Bearer " + sparkAuth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + asset_id + "/sources?file_ids=" + file_ids;

		Util.xhr(url, 'POST', '', headers, callback);
	};


	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Get public assets - requires only a guest token
		 * @param conditions - Various conditions for the query
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/list/get-a-list-of-assets
		 */
		getAssetsByConditions: function (conditions, callback) {

			//Make sure guest token is still valid, if not create a new one
			sparkAuth.getGuestToken(function (guestToken) {
				if (guestToken) {

					var headers = {
						"Authorization": "Bearer " + guestToken,
						"Content-type": "application/x-www-form-urlencoded"
					}

					//default limit/offset
					conditions.limit = conditions.limit ? conditions.limit : 12;
					conditions.offset = conditions.offset ? conditions.offset : 0;

					//Construct the full request
					var params = Object.keys(conditions).map(function (k) {
						return encodeURIComponent(k) + "=" + encodeURIComponent(conditions[k]);
					}).join('&');

					var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets?' + params;
					Util.xhr(url, 'GET', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Get logged in user assets
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/members/assets/list-a-member's-assets
		 */
		getMyAssets: function (limit, offset, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}

				var assetsLimit = limit ? limit : 12;
				var assetsOffset = offset ? offset : 0;

				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/members/' + sparkAuth.accessToken(true).spark_member_id + '/assets?limit=' + assetsLimit + '&offset=' + assetsOffset;
				Util.xhr(url, 'GET', '', headers, callback);
			} else {
				callback(false);
			}

		},
		/**
		 * Get a specific asset
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/readupdatedelete/retrieve-an-asset
		 */
		getAsset: function (assetId, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				};


				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + assetId;
				Util.xhr(url, 'GET', '', headers, callback);
			} else {
				callback(false);
			}

		},
		/**
		 * Create a new asset for a logged in user
		 * @param assetPost
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/create/create-a-new-asset
		 */
		createAsset: function (assetPost, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {
				var params = "title=" + assetPost.title + "&description=" + assetPost.description +
					"&media_type=file&tags=" + assetPost.tags;
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}
				Util.xhr(CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets', 'POST', params, headers, callback);
			} else {
				callback(false);
			}

		}
		,
		/**
		 * Update an asset for a logged in user
		 * @param assetPost
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/readupdatedelete/update-an-asset
		 */
		updateAsset: function (assetPost, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {

				var params = "title=" + assetPost.title + "&description=" + assetPost.description + "&tags=" + assetPost.tags
				"&publish=true";
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + assetPost.assetId + '?' + params;
				Util.xhr(url, 'PUT', '', headers, callback);
			} else {
				callback(false);
			}

		}
		,
		/**
		 * Remove an asset for a logged in user
		 * @param assetId - The id of the asset
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/readupdatedelete/delete-an-asset
		 */
		removeAsset: function (assetId, callback) {

			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + assetId;
				Util.xhr(url, 'DELETE', '', headers, callback);
			} else {
				callback(false);
			}

		}
		,

		/**
		 * Upload a file to an asset
		 * @param assetId - The id of the asset
		 * @param fileData - The file to upload
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/files/upload/upload-file-in-body
		 * @todo - Consolidate with uploadFile
		 */
		uploadFileToAsset: function (assetId, fileData, callback) {

			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken()
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/files/upload?unzip=false';

				var fd = new FormData();
				fd.append("file", fileData);

				Util.xhr(url, 'POST', fd, headers, function (filesResp) {
					if (filesResp.files != undefined && filesResp.files.length > 0) {

						var files_ids_array = [filesResp.files[0].file_id];

						createAssetSource(assetId, files_ids_array, callback);
					}
					else {
						callback(response);
					}

				});
			} else {
				callback(false);
			}
		}
		,

		/**
		 * Upload a file to Spark Drive
		 * @param fileData - The file to upload
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/files/upload/upload-file-in-body
		 */
		uploadFile: function (fileData, callback) {

			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken()
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/files/upload?unzip=false';

				var fd = new FormData();
				fd.append("file", fileData);

				Util.xhr(url, 'POST', fd, headers, function (filesResp) {
					callback(filesResp);
				});

			} else {
				callback(false);
			}

		}
		,
		/**
		 * Retrieve all thumbnails for an asset
		 * @param assetId - The id of the asset
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/asset-thumbnails/retrieve-asset-thumbnails
		 */
		retrieveUserAssetThumbnails: function (assetId, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + assetId + '/thumbnails';
				Util.xhr(url, 'GET', '', headers, function (response) {
					var thumbnailsResp = {
						assetId: assetId,
						thumbnails: response.thumbnails
					}
					callback(thumbnailsResp);
				});
			} else {
				callback(false);
			}
		}
		,

		/**
		 * Retrieve all sources (3d model files) for an asset
		 * @param assetId - The id of the asset
		 * @param callback
		 * See API reference - http://docs.sparkdriveapi.apiary.io/#reference/assets/asset-sources/retrieve-asset-sources
		 */
		retrieveUserAssetSources: function (assetId, callback) {
			//Make sure token is still valid
			if (sparkAuth.isAccessTokenValid()) {

				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken(),
					"Content-type": "application/x-www-form-urlencoded"
				}
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/assets/' + assetId + '/sources';
				Util.xhr(url, 'GET', '', headers, function (response) {
					var sourcesResp = {
						assetId: assetId,
						sources: response.sources
					}
					callback(sourcesResp);
				});
			} else {
				callback(false);
			}

		}
		,

		/**
		 * @todo: Consolidate with uploadFile
		 * @param files
		 * @param zipFile
		 * @param callback
		 */
		uploadFileToDrive: function (files, zipFile, callback) {
			if (sparkAuth.isAccessTokenValid()) {
				var headers = {
					"Authorization": "Bearer " + sparkAuth.accessToken()
				};
				if (zipFile == undefined) {
					zipFile = false;
				}
				var formData = new FormData();

				// Add the file to the request.
				formData.append(files[0].name, files[0]);
				var url = CONST.API_PROTOCOL + '://' + CONST.API_SERVER + '/files/upload?unzip=' + zipFile;


				Util.xhr(url, 'POST', formData, headers, function (filesResp) {
					if (filesResp.files != undefined && filesResp.files.length > 0) {

						callback(filesResp)


					}
					else {
						console.log('An upload error occurred!');
					}

				});
			}
		}
	}


}();
