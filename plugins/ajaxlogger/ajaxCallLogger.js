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

	var loggerId = "requestLog";
	var loggerDeatilsId = loggerId+"-details";
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
		//console.log(data);
		renderjson.set_show_to_level(3);

		var renderedRes = renderjson((data.res));
		//console.log("rendered", rendered)

		var txt = $(document.getElementById(loggerId));
		var id = "response" + txt.children().size();

		var on = "$('#" + loggerDeatilsId + "').children().hide();$('#requestLog').children().removeClass('active');"+"$('#" + id + "').show();$(this).addClass('active');";

		var onclick = "onclick=" + on;
		var div = $('<div class="request"'+onclick+'></div>');

		div.append("<pre class='renderjson' " + "><div class='req-resp' id='" + "req" + id + "'>" +
					"<span class='method method-" + data.req.METHOD.toLowerCase() + "'>" + data.req.METHOD + "</span> " +
			maxLength(data.req.URL,90) + "<span class='open-full-request'><i class='spark_icon si-dropdown-open'></i></span></div></pre>");

		var response = $("<div id='" + id + "' style='display:none'></div>");
		var renderedReq = renderjson(data.req);

		var request = $("<div>data" + data.req.data + "</div>");

		var requestId = id+"-request";
		var responseId = id+"-response";
		var requestOnClick = "$('#"+requestId+"').show();$('#"+responseId+"').hide();$(this).addClass('active').siblings('a').removeClass('active');";
		var responseOnClick = "$('#"+responseId+"').show();$('#"+requestId+"').hide();$(this).addClass('active').siblings('a').removeClass('active');";

		var responseMenu = $("<div class='logger-menu'><a class='logger-menu-item active ' onclick=" +requestOnClick + ">REQUEST</a> <a class='logger-menu-item' onclick="+responseOnClick+">RESPONSE</a></div><div class=''>&nbsp;</div>");

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
					'<div class="pull-right clear" onClick="$(\'#'+loggerId+'\').empty()">Clear</div>' +
					'</div>' +
					'<div id="'+loggerId+'"></div>' +
					'<div id="drag">|||</div>' +
					'<div id="'+loggerDeatilsId+'">' +
					'</div>');
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

					console.log("mouseDOWN:"+isResizing);

				});

				$(document).on('mousemove', function (e) {

					console.log("*****mouseMOVE:"+isResizing);

					if (!isResizing)
						return;

					var offsetBottom = lastDownX - e.clientY;
					console.log("container.height():"+container.height() + ", e.clientY:" + e.clientY + ", container.offset().top" + container.offset().top + ", offset:"+offsetBottom);

					console.log("startHeight + e.clientY - startY:" + startHeight +" " + e.clientY + " -" + startY);
					var change= (e.clientY - startY);
					top.height (startHeight + change + 'px');
					bottom.height (bottomStartHeight - change + 'px');


				});

				$(document).on('mouseup', function (e) {
					// stop resizing
					isResizing = false;
					console.log("mouseup:"+isResizing);

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
					if(event.data!=undefined && event.data.type=="ajaxLogger")
					log(event.data.data);
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


