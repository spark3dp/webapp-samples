/**
 * Created by michael on 4/16/15.
 */
var statePlugin = function($){
	'use strict';

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
		changeState:changeState
	}

}(jQuery);