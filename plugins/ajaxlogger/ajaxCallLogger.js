/**
 * Created by michael on 4/15/15.
 */

/**
 * this class is used together with ajaxCallListener. it creates logger element, and logs every call caught with ajaxCallListener.
 *
 *
 * @returns {{log: log, createLoggerElement: createLoggerElement, startIframeListener: startIframeListener, startRegularListener: startRegularListener}}
 */
var ajaxCallLogger = function(){

	var loggerHeight = 460;
	var loggerElementsHeight = 60;
	var loggerId = "requestLog";
	var loggerDeatilsId = loggerId+"-details";
	var urlToHide = ".spark.autodesk.com/api/v1/";
	/**
	 *  Adjsut string length to desired length
	 */
	var maxLength = function(input, desiredLength, hidePoints) {
		if (input.length <= desiredLength) {
			return input;
		} else {
			return input.substring(0, desiredLength) + (!hidePoints ? '...' : '');
		}
	};
	/**
	 * adds another row in the logger
	 * @param data - the data to log
	 */
	var log = function (data) {
		renderjson.set_show_to_level(3);
		renderjson.set_icons('▸ ','▾ ');
		var renderedRes = renderjson((data.res));

		var txt = $(document.getElementById(loggerId));

		var hideElement = function(id){
			$('#'+id).hide();
		};
		var showElement = function(id){
			$('#'+id).show();
		};

		var id = "response" + txt.children().size();

		var div = $('<div class="request"></div>');

		div.on("click",function(){
			if($("#"+loggerDeatilsId).css('display')=='none'){
				$("#"+loggerId).height('160px');
				$("#"+loggerDeatilsId).height(loggerHeight - $("#"+loggerId).height() -loggerElementsHeight);
				showElement("drag");
			}

			showElement(loggerDeatilsId);
			$("#" + loggerDeatilsId).children().hide();
			$('#requestLog').children().removeClass('active');
			//$("#" + id).show();
			showElement(id);
			$(this).addClass('active');
		});

		div.append("<pre class='renderjson' " + "><div class='req-resp' id='" + "req" + id + "'>" +
					"<span class='method method-" + data.req.METHOD.toLowerCase() + "'>" + data.req.METHOD + "</span> " +
			maxLength("../" + data.req.URL.split(urlToHide)[1],90) + "</div></pre>");

		var response = $("<div id='" + id + "' style='display:none'></div>");
		var renderedReq = renderjson(data.req);

		var request = $("<div>data" + data.req.data + "</div>");

		var requestId = id+"-request";
		var responseId = id+"-response";


		var requestLink = $("<a class='logger-menu-item active'>REQUEST</a>");
		var responseLink = $(" <a class='logger-menu-item'>RESPONSE</a>");
		var closeLink = $("<div class='new_spark_icon si-close pull-right'></div>");

		requestLink.on("click",function(){
			showElement(requestId);
			hideElement(responseId);
			$(this).addClass('active').siblings('a').removeClass('active');
		});

		responseLink.on("click",function(){
			showElement(responseId);
			hideElement(requestId);
			$(this).addClass('active').siblings('a').removeClass('active');
		});

		closeLink.on("click",function(){
			hideElement(loggerDeatilsId);
			hideElement("drag");
			$("#"+loggerId).height($('.logger-container').height()-50)
		});

		var responseMenu = $("<div class='logger-menu'></div>");
		responseMenu.append(requestLink);
		responseMenu.append(responseLink);
		responseMenu.append(closeLink);

		response.append(responseMenu);

		response.append($("<div id=" +requestId + "></div>").append(renderedReq));
		response.append($("<div id=" +responseId + "></div>").append(renderedRes).hide());

		$("#"+loggerDeatilsId).append(response);
		txt.prepend(div);

	};

	return{
		log: log,

		/**
		 * creates a logger HTML element and appends it to the parentSelector Element
		 * @param parentSelector - css selector of the parent element of the logger
		 */
		createLoggerElement: function (parentSelector) {
			var div = $(
					'<div class="logger-container center">' +
					'<div class="logger-header clearfix">' +
					'<div class="title pull-left" for="'+loggerId+'">Network Log</div>' +
					'<div class="pull-right clear" onClick="$(\'#'+loggerId+'\').empty();$(\'#'+loggerDeatilsId+'\').empty();'+"$('#"+loggerDeatilsId+"').hide();$('#drag').hide();$('#"+loggerId+"').height($('.logger-container').height()-50)\""+'>Clear</div>' +
					'</div>' +
					'<div id="'+loggerId+'"></div>' +
					'<div id="drag">===</div>' +
					'<div id="'+loggerDeatilsId+'">' +
					'</div>');
			div.height(loggerHeight + "px");
			$(parentSelector).append(div);


			var isResizing = false,
				lastDownX = 0;

			$(function () {

				var container = $('.logger-container'),
					top = $('#' + loggerId),
					bottom = $('#' + loggerDeatilsId),
					handle = $('#drag');


				var startX, startY, startWidth, startHeight;
				var bottomStartHeight;

				handle.on('mousedown', function (e) {
					isResizing = true;
					startY = e.clientY;
					startHeight = parseInt(document.defaultView.getComputedStyle(top.get(0)).height, 10);
					bottomStartHeight = parseInt(document.defaultView.getComputedStyle(bottom.get(0)).height, 10);

				});

				$(document).on('mousemove', function (e) {
					if (!isResizing)
						return;
					var offsetBottom = lastDownX - e.clientY;

					var change= (e.clientY - startY);
					var newTopHeight = startHeight + change;
					if(newTopHeight>=0 && newTopHeight < (loggerHeight - loggerElementsHeight)) {

						top.height(newTopHeight + 'px');
						bottom.height(bottomStartHeight - change + 'px');

					}
				});

				$(document).on('mouseup', function (e) {
					// stop resizing
					isResizing = false;
				});
			});

		},

		/**
		 * Starts a listener to events that come from the iframe. when event is caught - log the data.
		 * Should call this method from the parent HTML, when using ajaxListener in Iframe
		 */
		startIframeListener: function () {
			var iframeLoggerListener = function(event) {
				if (event.origin === window.location.origin) {
					if(event.data!=undefined && event.data.type=="ajaxLogger" && event.data.data.req.URL.indexOf(urlToHide) > -1){
						log(event.data.data);
					}

				}
			};

			if (window.addEventListener) {
				addEventListener("message", iframeLoggerListener, false)
			} else {
				attachEvent("onmessage", iframeLoggerListener)
			}
		},

		/**
		 * starts listener to events from ajaxCallsListener. when event is caught - log the data.
		 */
		startRegularListener: function(){
			ajaxCallListener(function(data){
				ajaxCallLogger.log(data);
			});
		}
	};
}();


