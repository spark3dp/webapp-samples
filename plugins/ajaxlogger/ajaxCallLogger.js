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

	/**
	 * adds another row in the logger
	 * @param data - the data to log
	 */
	var log = function (data) {
		console.log(data);
		renderjson.set_show_to_level(1);

		var rendered = renderjson((data.res));
		console.log("rendered", rendered)

		var div = $("<pre></pre>");
		var txt = $(document.getElementById(loggerId));
		var id = "response" + txt.children().size();

		var on = "$('#" + id + "').toggle()";
		var onclick = "onclick=" + on;
		div.append("<pre class='renderjson' " + onclick + "><div id='" + "req" + id + "'>" + data.req.METHOD + " " + data.req.URL + "</div></pre>");
		var response = $("<div id='" + id + "' style='display:none'></div>");
		var renderedReq = renderjson((data.req));

		var request = $("<div>data" + data.req.data + "</div>");
		response.append(renderedReq);
		response.append(rendered);
		div.append(response);
		txt.append(div);
	};

	return{
		log: log,

		/**
		 * creates a logger HTML element and appends it to the parentSelector Element
		 * @param parentSelector - css selector of the parent element of the logger
		 */
		createLoggerElement: function (parentSelector) {
			var div = $('<div class="container">' +
				'<div class="row" style="background: black">' +
				'<div class="col-md-12">' +
				'<div class="form-group">' +
				'<label for="'+loggerId+'">Request Log</label>' +
				'<span class="pull-right" onClick="$(\'#'+loggerId+'\').empty()">CLEAR</span>' +
				'<div id="'+loggerId+'"></div></div></div></div></div>');
			$(parentSelector).append(div);


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


