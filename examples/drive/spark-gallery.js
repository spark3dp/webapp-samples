/**
 * Loop through the gallery
 * @param test
 * @param index
 * @param item
 */
function loopGallery(test, index, item) {
	if (test) {

		var imgUrlRow,
			imgUrlThumb,
			imgUrlLarge;
		imgUrlRow = imgUrlThumb = imgUrlLarge = item.thumb_path_prefix;
		if (imgUrlRow.indexOf('FullPreview/') < 0) {
			imgUrlThumb += 'Medium.jpg';
			imgUrlLarge += 'Large.jpg';
		}

		var box = $('<div class="col-md-4 box_animaux box-' + index + '"></div>');
		var pola = $('<div class="pola"></div>');
		var view = $('<div class="view thumb"></div>');
		var mask = $('<div class="mask"><h2>' + item.asset_name + '</h2>' +
		'<a href="' + imgUrlLarge + '" class="info fancybox" rel="group" title="' + item.asset_id + '" >' +
		'<div class="alt">Open</div></a></div>');

		$('.gallery').append(box);
		box.append(pola);
		pola.append(view);

		view.prepend('<img src="' + imgUrlThumb + '">');
		view.append(mask);
	}
}

/**
 * Get the date that was a month ago in the format mm-dd-yyyy
 */
function getMonthAgoDate() {
	var current = new Date();

	current.setMonth(current.getMonth() - 1);


	var yyyy = current.getFullYear().toString();
	var mm = (current.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = current.getDate().toString();
	return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + '-' + yyyy; // padding


}

$(function ($) {


	//run the fancybox
	$(".fancybox").fancybox();

	var monthAgo = getMonthAgoDate();
	//conditions to search - Get from last month
	var conditions = {
		offset: 0,
		limit: 12,
		start_date: monthAgo,
		sort_by: 'favorite_count'
	};

	spark.drive.getAssetsByConditions(conditions, function (response) {
		conditions.offset = conditions.limit;
		if (!response._link_next) {
			$('.gallery-load-more').remove();
		}
		$.each(response.assets, function (index, item) {
			loopGallery(index <= conditions.limit, index, item);
		});
	});

	$('.next').on('click', function (event) {
		event.preventDefault();

		$('.next').hide();
		$('.spinner').fadeIn();
		spark.drive.getAssetsByConditions(conditions, function (response) {
			if (!response._link_next) {
				$('.gallery-load-more').remove();
			}
			conditions.offset += conditions.limit;
			$.each(response.assets, function (index, item) {
				loopGallery(index <= conditions.limit, index, item);
			});
			$('.spinner').hide();
			$('.next').fadeIn();
		});
	});


}(jQuery));
