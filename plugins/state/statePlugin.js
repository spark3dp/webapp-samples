/**
 * Created by michael on 4/16/15.
 */
var statePlugin = function($){
	'use strict';

	var _currentState = "";

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

			_currentState = stateName;
			var enabledTabs = states[stateName].enabledTabs;
			var disabledTabs = states[stateName].disabledTabs;

			if (states[stateName].src){
				var srcIframe = states[stateName].src;
				if(optionalParams!=undefined){
					srcIframe = srcIframe+"?"+optionalParams;
				}

				$("#mainIframe").attr("src",srcIframe);
			}


			for(var i in enabledTabs){
				setTabEnable(enabledTabs[i],true);
			}
			for(var i in disabledTabs){
				setTabEnable(disabledTabs[i],false);
			}

			//Callback function after state changes
			var callbackFunc = states[stateName].callbackFunc;

			if (callbackFunc){
				callbackFunc();
			}
		}
	};

	var getCurrentState = function(){
		return _currentState;
	};

	return {
		changeState:changeState,
		getCurrentState:getCurrentState
	}

}(jQuery);