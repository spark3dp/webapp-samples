/**
 * Created by michael on 4/19/15.
 */
/**
 * Created by michael on 4/16/15.
 */
var eventBroadCaster = function($){
	'use strict';

	/**
	 * change state of the whole page from an iframe
	 * @param state
	 * @param optionalParams - GET params for the next state (will)
	 */
	var broadcastEvent = function(event,optionalParams){
		var data = {
			type:"eventBroadcast",
			data:{
				event:event,
				optionalParams:optionalParams
			}
		};

		console.log("broadcasting event:"+JSON.stringify(data));

		parent.postMessage(data,"*");

	};




	return {
		broadcastEvent:broadcastEvent
	}

}(jQuery);