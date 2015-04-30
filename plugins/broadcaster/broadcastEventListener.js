
/**
 * Created by michael on 4/16/15.
 */
var broadcastEventListener = function($){
	'use strict';


	var startIframeBroadcastListener = function() {

		var iframeBroadCastListener = function(event){
			if (event.origin === window.location.origin) {
				if(event.data!=undefined && event.data.type=="eventBroadcast") {

					if (broadcastMapper[event.data.data.event] != undefined) {
						broadcastMapper[event.data.data.event](event.data.data.optionalParams);
					}
					else {
						console.error("broadcastMapper doesn't have " + event.data.data.event + " mapping");
					}
				}
			}
		};

		if (window.addEventListener) {
			addEventListener("message", iframeBroadCastListener, false)
		} else {
			attachEvent("onmessage", iframeBroadCastListener)
		}
	};

	return {
		startIframeBroadcastListener:startIframeBroadcastListener
	}

}(jQuery);