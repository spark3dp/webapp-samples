/**
 * Created by michael on 3/22/15.
 */




$(function ($) {


	var editMode = false;

	var currentAssetId = 0;

	var currentAsset={};

	var thumbnail;

	var showScreen = function(selector){
		hideAll();
		$(selector).show();
	};

	var hideAll = function(){
		$("#main-container").children().hide();
	};



	$("#firstScreen").on("click", function(){
		showScreen("#secondScreen");
	});

	var onLoadManageFilesScreen = function(){
		var currentAssetSources, currentAssetThumbnails ;
		$("#manageFilesTitle").text(currentAsset.asset_name);
		$("#filesTable").empty();


		sparkDrive.retrieveUserAssetSources(currentAssetId,function(response){
			currentAssetSources = response;
			var tr = $("<tr class='asset-in-table'></tr>")
			var nameTd=$("<td>" + "Sources" + "</td>");
			tr.append(nameTd);
			nameTd.on("click",function(){
				currentAssetId=assetId;

				showScreen("#uploadSources");
				//onLoadManageFilesScreen();

			});
			tr.append($("<td>" +  "</td>"));
			tr.append($("<td>" + response.sources.length + " files</td>"));
			$("#filesTable").append(tr);


		});
		sparkDrive.retrieveUserAssetThumbnails(currentAssetId,function(response){
			currentAssetThumbnails=response;
			var tr = $("<tr class='asset-in-table'></tr>")
			var nameTd=$("<td>" + "Thumbnails" + "</td>");
			tr.append(nameTd);
			/**nameTd.on("click",function(){
				currentAssetId=assetId;
				currentAsset = item;
				showScreen("#manageFiles");
				onLoadManageFilesScreen();

			});*/
			tr.append($("<td>" +  "</td>"));
			tr.append($("<td>" + response.thumbnails.length + " files</td>"));
			$("#filesTable").append(tr);
		});
	};

	var onloadShowAssetsScreen = function(){
		sparkDrive.getMyAssets(100, 0, function (response) {
			//sparkDrive.getAssetsByConditions({},function(response){
			console.log(response);
			$("#assetsTbody").empty();
			$.each(response.assets, function (index, item) {
				var tr = $("<tr class='asset-in-table'></tr>")
				var nameTd=$("<td>" + item.asset_name + "</td>");
				tr.append(nameTd);
				tr.append($("<td>" + item.date_submitted + "</td>"));
				tr.append($("<td>" + item.date_modified + "</td>"));
				tr.append($("<td>" + item.status + "</td>"));
				tr.append($('<td><i class="glyphicon glyphicon-pencil edit"></i><i class="glyphicon glyphicon-remove delete"></i></td>'));
				tr.append($('<input type="hidden" class="asset-id" value="' + item.asset_id + '">'));
				//console.log(item);
				var assetId = item.asset_id;
				nameTd.on("click",function(){
					currentAssetId=assetId;
					currentAsset = item;
					showScreen("#manageFiles");
					onLoadManageFilesScreen();

				});
				$("#assetsTbody").append(tr);


				//loopGallery(index <= conditions.limit, index, item);
			});

			$('tr.asset-in-table td i.delete').on('click', function () {
				var c = confirm('Are you sure?');

				if (c) {
					var assetElem = $(this).parents('.asset-in-table');
					var assetId = assetElem.find('.asset-id').val();
					sparkDrive.removeAsset(assetId, function () {
						assetElem.remove();
					});
				}

			});

			//Edit asset
			$('tr.asset-in-table td i.edit').on('click', function () {
				var assetElem = $(this).parents('.asset-in-table');
				var assetId = assetElem.find('.asset-id').val();
				editMode=true;
				currentAssetId=assetId;
				//$('#myTabs a[href="#create"]').click();
				showScreen("#manageAssets");
				onLoadManageAssetScreen();

			});
		});
	};


	$("#asset-form").on('submit', function (e) {


		e.preventDefault();
		var asset = {
			title: $('#manage-assets-title').val(),
			description: $('#manage-assets-description').val(),
			tags: $('#manage-assets-tags').val()
		};


		if(!editMode) {
			sparkDrive.createAsset(asset, function (response) {
				console.log(response);
				onloadShowAssetsScreen();
				showScreen("#showAssets");
			});
		}
		else{
			asset.assetId = currentAssetId;
			sparkDrive.updateAsset(asset, function (response) {
				onloadShowAssetsScreen();
				showScreen("#showAssets");
			});
		}
	});

	$('#manage-assets-cancel').on("click",function(){
		onloadShowAssetsScreen();
		showScreen("#showAssets");

	});

	$("#manage-assets-create-asset").on("click",function(){
		onLoadManageAssetScreen();
		editMode=false;
		showScreen("#manageAssets")
	});
	var onLoadManageAssetScreen = function(){
		if(editMode){
			$('#manageTitle').text("Edit Asset");
			sparkDrive.getAsset(currentAssetId,function(response){
				$("#manage-assets-title").val(response.asset_name);
				$("#manage-assets-description").text(response.description);
				var tags = response.keywords.replace(/ /g,",");
				tags = (tags!="undefined")?tags:"";
				$("#manage-assets-tags").val(tags);
			});
		}else{
			$('#manageTitle').text("Create an Asset");

		}
	};

	$('#thumbnail').on('change', function () {
		thumbnail = this.files[0];
	});

	$("#upload-files-form").on('submit', function (e) {
		e.preventDefault();

		var fileData = thumbnail;
		//var assetId=$("#assetId").val();
		sparkDrive.uploadFileToAsset(currentAssetId, fileData, function(resp){
			$('#myTabs a[href="#manage"]').click();
		});

	});

	$("#manage-files-back").on("click",function(){
		onloadShowAssetsScreen();
		showScreen("#showAssets");
	});

	onloadShowAssetsScreen();
	showScreen("#showAssets");

});










