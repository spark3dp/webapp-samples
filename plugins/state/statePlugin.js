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

		$(tabSelector).removeClass("selected");
	};

	var setTabVerified = function(tab){

		var enabledTabs = $(tab).siblings().parents().first().children().not(".disabled");

		if(enabledTabs.length > 1){
			enabledTabs.each(function(index, element){
				if (index < enabledTabs.length - 1) {
					$(this).addClass("verified");
				}
			});
		}
	};

	var changeState = function(stateName,optionalParams){
		if(states[stateName]!=undefined){

			_currentState = stateName;
			var selectedTab = states[stateName].selectedTab;
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

			if(enabledTabs.length > 0) {
				setTabVerified(enabledTabs[0]);
			}
			$(selectedTab).addClass("selected");

			$("#mainIframe").attr("src",srcIframe);

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