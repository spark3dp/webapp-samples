$(function ($) {
    //This section is only performed if there is an access token
    if (localStorage.getItem('spark-drive-token')) {
        $('.logged-in').removeClass('hidden');
        $('.row.marketing').removeClass('hidden');
        sparkAuth.getMyProfile(function (profile) {
            $('#user-name a').text(profile.name);
            $('#user-image').removeClass('hidden');
            $('#user-image img').attr('src', profile.profile.avatar_path);
        });


        var editMode = false;
        sparkDrive.getMyAssets(function (response) {
            var assetElem = '';
            for (var i in response.assets) {
                //build the elements
                assetElem += '<div class="asset">';
                assetElem += '<h4>' + response.assets[i].asset_name + '</h4>';
                assetElem += '<p>' + response.assets[i].description + '</p>';
                assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
                assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
                assetElem += '<input type="hidden" class="asset-id" value="' + response.assets[i].asset_id + '">';
                assetElem += '</div>'
            }

            $('.row.marketing .col-lg-6').html(assetElem);

        });

        //Edit asset
        $('.row.marketing .col-lg-6').on('click','.asset i.edit', function(){
            var assetElem = $(this).parent('.asset');
            $('#myModal').find('#inputTitle').val(assetElem.find('h4').text());
            $('#myModal').find('#inputDesc').val(assetElem.find('p').text());
            $('#myModal').find('#assetId').val(assetElem.find('.asset-id').val());
            $('#myModal').modal('show');
            editMode = true;
        });

        //Delete asset
        $('.row.marketing .col-lg-6').on('click','.asset i.delete', function(){
            var c = confirm('Are you sure?');

            if (c) {
                var assetElem = $(this).parent('.asset');
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
            $('#myModal').find('#inputTags').val('');
            $('#myModal').find('#assetId').val('');
            editMode = false;
        });


        $("#asset-form").on('submit', function (e) {
            e.preventDefault();
            var asset = {
                title: $('#inputTitle').val(),
                description: $('#inputDesc').val(),
                tags: $('#inputTags').val()
            };

            //edit
            if (editMode){
                asset.assetId = $('#assetId').val();
                sparkDrive.updateAsset(asset, function (response) {
                    var assetElem = $('input.asset-id[value=' + asset.assetId + ']').parent('.asset');
                    assetElem.find('h4').text(asset.title);
                    assetElem.find('p').text(asset.description);


                });
            //create new
            }else {

                sparkDrive.createAsset(asset, function (response) {
                    $('#myModal').modal('hide');
                    var assetElem = '';
                    assetElem += '<div class="asset">';
                    assetElem += '<h4>' + asset.title + '</h4>';
                    assetElem += '<p>' + asset.description + '</p>';
                    assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
                    assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
                    assetElem += '<input type="hidden" class="asset-id" value="' + response.asset_id + '">';
                    assetElem += '</div>'
                    $('.row.marketing .col-lg-6').append(assetElem);
                })
            }
        });
      // This section is performed if there is no access token
    } else {
        $('.logged-out').removeClass('hidden');
    }

}(jQuery));
