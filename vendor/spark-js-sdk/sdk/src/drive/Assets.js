var ADSKSpark = ADSKSpark || {};

(function () {
	'use strict';

	var Client = ADSKSpark.Client;

	/**
	 * @class
	 * @type {{getAsset: Function, getMyAssets: Function, createAsset: Function, updateAsset: Function, removeAsset: Function, retrieveAssetThumbnails: Function, retrieveAssetSources: Function, createAssetThumbnails: Function, createAssetSources: Function, deleteAssetSources: Function, deleteAssetThumbnails: Function}}
	 * @description - The Assets API singleton.
	 * See reference - https://spark.autodesk.com/developers/reference/drive?deeplink=%2Freference%2Fassets
	 */
	ADSKSpark.Assets = {


		/**
		 * Get public assets - requires only a guest token
		 * @param {Object} conditions - Various conditions for the query
		 * @returns {Promise} - A promise that will resolve to all public assets
		 */
		getPublicAssetsByConditions: function (conditions) {

			//default limit/offset
			conditions.limit = conditions.limit ? conditions.limit : 12;
			conditions.offset = conditions.offset ? conditions.offset : 0;

			return Client.authorizedAsGuestApiRequest('/assets').then(function(promise){
				return promise.get(null, conditions);
			});
		},

		/**
		 * Get a specific asset
		 * @param {Number} assetId - The ID of the asset
		 * @returns {Promise} - A promise that will resolve to an asset
		 */
		getPublicAsset: function (assetId) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				return Client.authorizedAsGuestApiRequest('/assets/' + assetId).then(function(promise){
					return promise.get();
				});
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));
		},

		/**
		 * Get a specific asset
		 * @param {Number} assetId - The ID of the asset
		 * @returns {Promise} - A promise that will resolve to an asset
		 */
		getAsset: function (assetId) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				return Client.authorizedApiRequest('/assets/' + assetId).get();
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));
		},


		/**
		 * Get logged in user assets
		 * @param {Object} params - limit/offset/sort/filter options.
		 * @returns {Promise} - A promise that will resolve to an object that contains a property "assets"
		 * 				that holds an array of assets.
		 */
		getMyAssets: function (params) {

			if (Client.isAccessTokenValid()) {
				var accessTokenObj = Client.getAccessTokenObject();

				var memberId = accessTokenObj.spark_member_id;

				//Make sure memberId is defined and that it is a number
				if (!isNaN(memberId)) {
					return Client.authorizedApiRequest('/members/' + memberId + '/assets').get(null, params);
				}
			}

			return Promise.reject(new Error('Access token is invalid'));

		},

		/**
		 * Create a new asset for a logged in user
		 * @param {Object} asset - Asset data - title, description, tags etc
		 * @returns {Promise} - A promise that will resolve to a success/failure asset
		 */
		createAsset: function (asset) {

			//construct the full params
			var params = Object.keys(asset).map(function (k) {
				return encodeURIComponent(k) + "=" + encodeURIComponent(asset[k]);
			}).join('&');

			var headers = {'Content-type': 'application/x-www-form-urlencoded'};
			return Client.authorizedApiRequest('/assets').post(headers, params);

		},

		/**
		 * Update an asset for a logged in user
		 * @param {Object} asset - The asset we want to update, make sure that this object has an assetId property
		 * @returns {Promise} - A promise that will resolve to a success/failure asset
		 */
		updateAsset: function (asset) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(asset.assetId)) {

				var assetId = asset.assetId;

				//construct the full params, omit assetId in the request
				var params = Object.keys(asset).filter(function (key) {
					return key !== 'assetId';
				}).map(function (k) {
					return encodeURIComponent(k) + "=" + encodeURIComponent(asset[k]);
				}).join('&');

				return Client.authorizedApiRequest('/assets/' + assetId).put(null, params);
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));


		},

		/**
		 * Remove an asset for a logged in user
		 * @param {Number} assetId - The ID of the asset
		 * @returns {Promise} - A promise that will resolve to an empty body with a proper success/failure response
		 */
		removeAsset: function (assetId) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				return Client.authorizedApiRequest('/assets/' + assetId).delete();
			}
			return Promise.reject(new Error('Proper assetId was not supplied'));
		},

		/**
		 * Retrieve all thumbnails for an asset
		 * @param {Number} assetId - The ID of the asset
		 * @returns {Promise} - A promise that will resolve to an object that has a "thumbnails" property
		 * 						that is an array of asset thumbnails
		 */
		retrieveAssetThumbnails: function (assetId) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {

				return Client.authorizedApiRequest('/assets/' + assetId + '/thumbnails').get();

			}
			return Promise.reject(new Error('Proper assetId was not supplied'));
		},

		/**
		 * Retrieve all sources (3d model files) for an asset
		 * @param {Number} assetId - The ID of the asset
		 * @returns {Promise} - A promise that will resolve to an object that has a "sources" property
		 * 						that is an array of asset sources
		 */
		retrieveAssetSources: function (assetId) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				return Client.authorizedApiRequest('/assets/' + assetId + '/sources').get();
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));


		},

		/**
		 * Create asset thumbnail(s)
		 * @param {Number} assetId - The asset ID for which the thumbnails are created
		 * @param {Array} filesArray - The files that are attached to this asset, they come in the form of [{id:"id",caption:"caption",description,"description",is_primary:true/false}]
		 * @param {Boolean} async - Whether thumbnails should be generated asynchronously to save system resources.
		 * @returns {Promise} - A promise that will resolve to an asset thumbnails object
		 */
		createAssetThumbnails: function (assetId, filesArray, async) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {

				var thumbnails = filesArray.map(function (file) {
					return {id: file.id, caption: file.caption || '', description:file.description || '',is_primary:file.is_primary || false};
				});
				async = async || false;
				var params = "thumbnails=" + JSON.stringify(thumbnails) + '&async=' + async;

				var headers = {'Content-type': 'application/x-www-form-urlencoded'};
				return Client.authorizedApiRequest('/assets/' + assetId + '/thumbnails').post(headers, params);

			}
			return Promise.reject(new Error('Proper assetId was not supplied'));



		},

		/**
		 * Create asset source(s)
		 * @param {Number} assetId - The asset ID for which the thumbnails are created
		 * @param {String} fileIds - The file ids that are attached to this asset, separated by comma i.e. 123456,258242
		 * @returns {Promise} - A promise that will resolve to an asset sources object
		 */
		createAssetSources: function (assetId, fileIds) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				var params = 'file_ids=' + fileIds;
				var headers = {'Content-type': 'application/x-www-form-urlencoded'};
				return Client.authorizedApiRequest('/assets/' + assetId + '/sources').post(headers, params);
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));

		},

		/**
		 * Remove sources from an asset for a logged in user
		 * @param {Number} assetId - The ID of the asset
		 * @param {String} fileIds - String of file ids to delete from asset
		 * @returns {Promise} - A promise that will resolve to an empty body with a proper success/failure response
		 */
		deleteAssetSources: function (assetId, fileIds) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {
				var params = '?file_ids=' + fileIds;
				return Client.authorizedApiRequest('/assets/' + assetId + '/sources' + params).delete();
			}

			return Promise.reject(new Error('Proper assetId was not supplied'));
		},

		/**
		 * Remove thumbnails from an asset for a logged in user
		 * @param {Number} assetId - The ID of the asset
		 * @param {String} fileIds - Array of file ids to delete from asset
		 * @returns {Promise} - A promise that will resolve to an empty body with a proper success/failure response
		 */
		deleteAssetThumbnails: function (assetId, fileIds) {

			//Make sure assetId is defined and that it is a number
			if (!isNaN(assetId)) {

				var params = '?thumbnail_ids=' + fileIds;
				return Client.authorizedApiRequest('/assets/' + assetId + '/thumbnails' + params).delete();

			}

			return Promise.reject(new Error('Proper assetId was not supplied'));


		}
	};

}());
