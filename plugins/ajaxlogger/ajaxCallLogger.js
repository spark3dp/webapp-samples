/**
 * Created by michael on 4/15/15.
 */
var ajaxCallLogger = function(){

	var loggerId = "requestLog";
	
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

		startIframeListener: function () {
			var iframeLoggerListener = function(event) {

				if (event.origin === window.location.origin) {
					log(event.data);
				}
			};

			if (window.addEventListener) {
				addEventListener("message", iframeLoggerListener, false)
			} else {
				attachEvent("onmessage", iframeLoggerListener)
			}
		}
	};
};


