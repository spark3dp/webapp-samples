/**
 * Created by michael on 3/22/15.
 */
/**
$("#drive-div").steps({
	headerTag: "h3",
	bodyTag: "section",
	transitionEffect: "slideLeft",
	autoFocus: true
});
*/
	/**
var form = $("#drive-form");

form.validate({
	errorPlacement: function errorPlacement(error, element) { element.before(error); },
	rules: {
		confirm: {
			equalTo: "#password"
		}
	}
});

form.children("div").steps({
	headerTag: "h3",
	bodyTag: "section",
	transitionEffect: "slideLeft",
	onStepChanging: function (event, currentIndex, newIndex)
	{
		//form.validate().settings.ignore = ":disabled,:hidden";
		//return form.valid();

		if(currentIndex==1) {

		}
			return true;

		//return true;
	},
	onFinishing: function (event, currentIndex)
	{
		form.validate().settings.ignore = ":disabled";
		return form.valid();
		//return true;
	},
	onFinished: function (event, currentIndex)
	{
		alert("Submitted!");
	}
});

*/
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

var enabledTab = function(id,isEnable){

	if(isEnable){
		$('#myTabs a[href="#'+id+'"]').attr("data-toggle","tab");
		$('#myTabs a[href="#'+id+'"]').parent().removeClass("disabled");
	}
	else{
		$('#myTabs a[href="#'+id+'"]').attr("data-toggle","");
		$('#myTabs a[href="#'+id+'"]').parent().addClass("disabled");
	}

};


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
	/**
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

	});*/

	//Add an asset
	$('#add-asset').on('click', function () {
		/**
		$('#myModal').modal('show');
		$('#myModal').find('#inputTitle').val('');
		$('#myModal').find('#inputDesc').val('');
		$('#myModal').find('#assetId').val('');
		$('#myModal .modal-title').text('Create an asset');
		editMode = false;*/
	});


	$("#asset-form").on('submit', function (e) {


		e.preventDefault();
		var asset = {
			title: $('#inputTitle').val(),
			description: $('#inputDesc').val(),
			tags: $('#inputTags').val()
		};

		var fileData = thumbnail;


			sparkDrive.createAsset(asset, function (response) {
				console.log(response);
				/**
				$('#myModal').modal('hide');
				var assetElem = '';
				assetElem += '<div class="asset col-md-4">';
				assetElem += '<div class="asset-content"><h4>' + asset.title + '</h4>';
				assetElem += '<p>' + asset.description + '</p>';
				assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
				assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
				assetElem += '<input type="hidden" class="asset-id" value="' + response.asset_id + '">';
				assetElem += '</div></div>';
				$('.row.marketing .assets-placeholder').append(assetElem);
				*/


				$("#assetId").val(response.asset_id);

				enabledTab("token",false);
				enabledTab("create",false);
				enabledTab("manage",true);
				enabledTab("upload",true);
				//$('#myTabs a[href="#token"]').attr("data-toggle","");
				//$('#myTabs a[href="#create"]').attr("data-toggle","");
				//$('#myTabs a[href="#manage"]').attr("data-toggle","tab");
				//$('#myTabs a[href="#upload"]').attr("data-toggle","tab");

				$('#myTabs a[href="#upload"]').tab('show');
/**
				sparkDrive.uploadFileToAsset(response.asset_id, fileData, function(resp){
					sparkDrive.retrieveUserAssetThumbnails(response.asset_id, function(thumbResp){
						if (thumbResp.thumbnails.length) {
							var thumb = '<img src="' + thumbResp.thumbnails[0].thumb_path_prefix + 'Petite.jpg' + '">';
							$('.asset-id[value=' + response.asset_id + ']').parent().before(thumb);
						}
					});
				});*/
			})

	});


	$("#upload-files-form").on('submit', function (e) {
		e.preventDefault();

		var fileData = thumbnail;
		var assetId=$("#assetId").val();
		sparkDrive.uploadFileToAsset(assetId, fileData, function(resp){
			$('#myTabs a[href="#manage"]').click();
		});

	});


	$('#myTabs a[href="#manage"]').bind('click', function (e) {
		if($('#myTabs a[href="#manage"]').parent().hasClass("disabled")){
			return;
		}
		sparkDrive.retrieveUserAssetSources($("#assetId").val(), function(response){

			//console.log(thumbResp);

			var assetElem = '';
			for (var i in response.sources) {
				//build the elements
				var type = response.sources[i].file_type;
				var name = response.sources[i].file_name;

				assetElem += '<div class="asset asset-resource col-md-4">';
				assetElem += '<div class="asset-content"><h4>' + type + '</h4>';
				assetElem += '<p>' + name + '</p>';
				assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
				assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
				assetElem += '<input type="hidden" class="asset-id" value="' + type + '">';
				assetElem += '</div></div>';

			}
			$('.row.marketing .assets-sources-placeholder').empty();
			$('.row.marketing .assets-sources-placeholder').append(assetElem);

			$('#myTabs a[href="#manage"]').tab('show');

		});
	});

	$(document).ready(function() {
		/**
		$("div.tabbable ul.nav").on('show', "li.disabled a", function(event) {
			event.stopImmediatePropagation();
			return false;
		});
		$("div.tabbable ul.nav").off('show', "li:not(.disabled) a")*/
	});

	function progressHandler(event){
		_("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
		var percent = (event.loaded / event.total) * 100;
		_("progressBar").value = Math.round(percent);
		_("status").innerHTML = Math.round(percent)+"% uploaded... please wait";
	}
	function completeHandler(event){
		_("status").innerHTML = event.target.responseText;
		_("progressBar").value = 0;
	}
	function errorHandler(event){
		_("status").innerHTML = "Upload Failed";
	}
	function abortHandler(event){
		_("status").innerHTML = "Upload Aborted";
	}

}(jQuery));
