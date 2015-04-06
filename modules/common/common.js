var common = function($){
	'use strict';

	/**
	 * Loads ajax loader whenever we want
	 * @param elem - any jquery selector
	 */
	var loadAjaxLogger = function(elem){
		$(elem).load("plugins/ajaxlogger/loggers.html");
	}

	/**
	 * Clear the modal content after closing it
	 */
	var setResetModalListener = function(){
		$('body').on('hidden.bs.modal', '.modal', function () {
			$(this)
				.find("input.field,textarea.field,select.field")
				.val('')
				.end();

			$(this)
				.find("img")
				.remove()
				.end()
		});
	}



	return {

		/**
		 * Run onload - init everything
		 */
		init: function(){
			loadAjaxLogger('#footer');
			setResetModalListener();
		},

		/**
		 * Make the ajax logger public
		 */
		loadAjaxLogger: loadAjaxLogger
	}

}(jQuery);