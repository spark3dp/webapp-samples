/**
 * Created by michael on 4/16/15.
 */
var statePlugin = function($){
	'use strict';

	/**
	 * change state of the whole page from an iframe
	 * @param state
	 * @param optionalParams - GET params for the next state (will)
	 */
	var changeStateFromIframe = function(state,optionalParams){
		var data = {
			type:"changeState",
			data:{
				state:state,
				optionalParams:optionalParams
			}
		};
		parent.postMessage(data,"*");

	};

	var startIframeStateListener = function() {

		var iframeStateListener = function(){
			if (event.origin === window.location.origin) {
				if(event.data!=undefined && event.data.type=="changeState")
					changeState(event.data.data.state,event.data.data.optionalParams);
			}
		};

		if (window.addEventListener) {
			addEventListener("message", iframeStateListener, false)
		} else {
			attachEvent("onmessage", iframeStateListener)
		}
	};


	var setTabEnable = function(tabSelector, isEnable){
		if(!isEnable){
			$(tabSelector).addClass("disabled");
		}
		else{
			$(tabSelector).removeClass("disabled");
		}
	};

	var changeState = function(stateName,optionalParams){
		if(states[stateName]!=undefined){
			var enabledTabs = states[stateName].enabledTabs;
			var disabledTabs = states[stateName].disabledTabs;

			var srcIframe = states[stateName].src;
			if(optionalParams!=undefined){
				srcIframe = srcIframe+"?"+optionalParams;
			}

			for(var i in enabledTabs){
				setTabEnable(enabledTabs[i],true);
			}
			for(var i in disabledTabs){
				setTabEnable(disabledTabs[i],false);
			}
			$("#mainIframe").attr("src",srcIframe);
		}
	};

	return {
		changeState:changeState,
		startIframeStateListener:startIframeStateListener,
		changeStateFromIframe:changeStateFromIframe
	}

}(jQuery);