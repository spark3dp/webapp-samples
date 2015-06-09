
/**
 * Created by michael on 4/16/15.
 */
var broadcastEventListener = function($){
	'use strict';


	var startIframeBroadcastListener = function() {

		var iframeBroadCastListener = function(event){
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}
			if (event.origin === window.location.origin) {
				if(event.data!=undefined && event.data.type=="eventBroadcast") {
					console.log("got eventBroadcast event:"+JSON.stringify(event.data));
					if (broadcastMapper[event.data.data.event] != undefined) {
						broadcastMapper[event.data.data.event](event.data.data.optionalParams);
					}
					else {
						console.info("broadcastMapper doesn't have " + event.data.data.event + " mapping");
					}
				}
			}
		};

		if (window.addEventListener) {
			window.addEventListener("message", iframeBroadCastListener, false);
		} else {
			window.attachEvent("onmessage", iframeBroadCastListener);
		}
	};

	return {
		startIframeBroadcastListener:startIframeBroadcastListener
	}

}(jQuery);