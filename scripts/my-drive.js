/**
 * Get assets from api and append them in the DOM
 * @param limit
 * @param offset
 * @param callback
 */
function getAssetsAndAppend(limit, offset, callback) {
	sparkDrive.getMyAssets(limit, offset, function (response) {
		var assetElem = '';
		for (var i in response.assets) {
			//build the elements
			var imgUrl = response.assets[i].thumb_path_prefix;
			if (imgUrl.indexOf('FullPreview/ThumbnailGradient')<0){
				imgUrl += 'Petite.jpg';
			}
			assetElem += '<div class="asset col-md-4">';
			assetElem += '<img src="' + imgUrl + '">';
			assetElem += '<div class="asset-content"><h4>' + response.assets[i].asset_name + '</h4>';
			assetElem += '<p>' + response.assets[i].description + '</p>';
			assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
			assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
			assetElem += '<input type="hidden" class="asset-id" value="' + response.assets[i].asset_id + '">';
			assetElem += '</div></div>';

		}

		$('.row.marketing .assets-placeholder').append(assetElem);

		callback(response);

	});
}


$(function ($) {
	//Keep track for the assets pagination
	var currentOffset = 0,
		//Edit or create mode
		editMode = false,
		//All asset thumbnails
		thumbnailList = [],
		//Asset thumbnail for upload
	 	thumbnail;



	getAssetsAndAppend(12, currentOffset, function (response) {
		if (response._link_next) {
			$('.load-more-button').removeClass('hidden');
			currentOffset = 12;
		} else {
			$('.load-more-button').addClass('hidden');
		}
	});


	//Detect start of thumbnail upload
	$('#thumbnail').on('change', function () {
		thumbnail = this.files[0];
	});

	//load more assets
	$('.load-more-button a').on('click', function () {
		getAssetsAndAppend(12, currentOffset, function (response) {
			if (response._link_next) {
				$('.load-more-button').removeClass('hidden');
				currentOffset += 12;
			} else {
				$('.load-more-button').addClass('hidden');
			}
		});
	});


	//Edit asset
	$('.row.marketing .assets-placeholder').on('click', '.asset i.edit', function () {
		var assetElem = $(this).parents('.asset');
		var assetId = assetElem.find('.asset-id').val();
		$('#myModal #thumbnail_list').html('');
		$('#myModal').find('#inputTitle').val(assetElem.find('h4').text());
		$('#myModal').find('#inputDesc').val(assetElem.find('p').text());
		$('#myModal').find('#assetId').val(assetId);
		$('#myModal').modal('show');
		$('#myModal .modal-title').text('Edit an asset');
		editMode = true;
		sparkDrive.retrieveUserAssetThumbnails(assetId, function(thumbResp){
			thumbnailList = thumbResp.thumbnails;
			var thumbnailsElems = '';
			for (var i in thumbnailList){
				thumbnailsElems += '<img src="' + thumbnailList[i].thumb_path_prefix + 'Small.jpg">'
			}
			$('#myModal #thumbnail_list').html(thumbnailsElems);
		});
	});

	//Delete asset
	$('.row.marketing .assets-placeholder').on('click', '.asset i.delete', function () {
		var c = confirm('Are you sure?');

		if (c) {
			var assetElem = $(this).parents('.asset');
			var assetId = assetElem.find('.asset-id').val();
			sparkDrive.removeAsset(assetId, function () {
				assetElem.remove();
			});
		}

	});

	//Add an asset
	$('#add-asset').on('click', function () {
		$('#myModal').modal('show');
		$('#myModal').find('#inputTitle').val('');
		$('#myModal').find('#inputDesc').val('');
		$('#myModal').find('#assetId').val('');
		$('#myModal .modal-title').text('Create an asset');
		editMode = false;
	});


	$("#asset-form").on('submit', function (e) {


		e.preventDefault();
		var asset = {
			title: $('#inputTitle').val(),
			description: $('#inputDesc').val()
		};

		var fileData = thumbnail;

		//edit
		if (editMode) {
			asset.assetId = $('#assetId').val();
			sparkDrive.updateAsset(asset, function (response) {
				var assetElem = $('input.asset-id[value=' + asset.assetId + ']').parent('.asset');
				assetElem.find('h4').text(asset.title);
				assetElem.find('p').text(asset.description);
				$('#myModal').modal('hide');


			});
			sparkDrive.uploadFileToAsset(asset.assetId, fileData, function(resp){
				sparkDrive.retrieveUserAssetThumbnails(asset.assetId, function(thumbResp){
					if (thumbResp.thumbnails.length && !$('.asset-id[value=' + asset.assetId + ']').parents('.asset').find('img')) {
						var thumb = '<img src="' + thumbResp.thumbnails[0].thumb_path_prefix + 'Petite.jpg' + '">';
						$('.asset-id[value=' + asset.assetId + ']').parent().before(thumb);
					}
				});
			});

			//create new
		} else {
			sparkDrive.createAsset(asset, function (response) {
				$('#myModal').modal('hide');
				var assetElem = '';
				assetElem += '<div class="asset">';
				assetElem += '<div class="asset-content"><h4>' + asset.title + '</h4>';
				assetElem += '<p>' + asset.description + '</p>';
				assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
				assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
				assetElem += '<input type="hidden" class="asset-id" value="' + response.asset_id + '">';
				assetElem += '</div></div>';
				$('.row.marketing .assets-placeholder').append(assetElem);

				sparkDrive.uploadFileToAsset(response.asset_id, fileData, function(resp){
					sparkDrive.retrieveUserAssetThumbnails(response.asset_id, function(thumbResp){
						if (thumbResp.thumbnails.length) {
							var thumb = '<img src="' + thumbResp.thumbnails[0].thumb_path_prefix + 'Petite.jpg' + '">';
							$('.asset-id[value=' + response.asset_id + ']').parent().before(thumb);
						}
					});
				});
			})
		}
	});

}(jQuery));
