/**
 * Get assets from api and append them in the DOM
 * @param limit
 * @param offset
 * @param callback
 */
function getAssetsAndAppend(limit, offset, callback){
    sparkDrive.getMyAssets(limit, offset, function (response) {
        var assetElem = '';
        for (var i in response.assets) {
            //build the elements
            assetElem += '<div class="asset col-md-4">';
            assetElem += '<h4>' + response.assets[i].asset_name + '</h4>';
            assetElem += '<p>' + response.assets[i].description + '</p>';
            assetElem += '<i class="glyphicon glyphicon-pencil edit"></i>';
            assetElem += '<i class="glyphicon glyphicon-remove delete"></i>';
            assetElem += '<input type="hidden" class="asset-id" value="' + response.assets[i].asset_id + '">';
            assetElem += '</div>'
        }

        $('.row.marketing .assets-placeholder').append(assetElem);

        callback(response);

    });
}


$(function ($) {
        //Keep track for the assets pagination
        var currentOffset = 0;

        var editMode = false;
        getAssetsAndAppend(12, currentOffset, function (response){
            if (response._link_next){
                $('.load-more-button').removeClass('hidden');
                currentOffset = 12;
            }else{
                $('.load-more-button').addClass('hidden');
            }
        });

        //Edit asset
        $('.row.marketing .assets-placeholder').on('click','.asset i.edit', function(){
            var assetElem = $(this).parent('.asset');
            $('#myModal').find('#inputTitle').val(assetElem.find('h4').text());
            $('#myModal').find('#inputDesc').val(assetElem.find('p').text());
            $('#myModal').find('#assetId').val(assetElem.find('.asset-id').val());
            $('#myModal').modal('show');
            editMode = true;
        });

        //Delete asset
        $('.row.marketing .assets-placeholder').on('click','.asset i.delete', function(){
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
            $('#myModal').find('#assetId').val('');
            editMode = false;
        });

        //load more assets
        $('.load-more-button a').on('click',function(){
            getAssetsAndAppend(12, currentOffset, function (response){
                if (response._link_next){
                    $('.load-more-button').removeClass('hidden');
                    currentOffset += 12;
                }else{
                    $('.load-more-button').addClass('hidden');
                }
            });
        });


        $("#asset-form").on('submit', function (e) {
            e.preventDefault();
            var asset = {
                title: $('#inputTitle').val(),
                description: $('#inputDesc').val()
            };

            //edit
            if (editMode){
                asset.assetId = $('#assetId').val();
                sparkDrive.updateAsset(asset, function (response) {
                    var assetElem = $('input.asset-id[value=' + asset.assetId + ']').parent('.asset');
                    assetElem.find('h4').text(asset.title);
                    assetElem.find('p').text(asset.description);
                    $('#myModal').modal('hide');


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

}(jQuery));
