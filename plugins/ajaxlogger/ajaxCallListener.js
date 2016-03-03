/**
 * Created by michael on 3/18/15.
 */

/**
 * This class catches all XMLHttpRequest calls, and calls callbackPushData with the data
 * @param callbackPushData - callback function this class calls when request is caught
 */
var ajaxCallListener = function(callbackPushData) {

	var requestResponseMap = [];

	var open = window.XMLHttpRequest.prototype.open,
		send = window.XMLHttpRequest.prototype.send;

	var tryJsonParse = function(data){

		try{
			var parsedData = JSON.parse(data);
			return parsedData;

		}catch(e){
			return data;
		}
	};

	function openReplacement(method, url, async, user, password) {

		this.guid=requestResponseMap.length;
		requestResponseMap.push({req : {METHOD:method, URL:url}});

		return open.apply(this, arguments);
	}

	function sendReplacement(data) {

		requestResponseMap[this.guid].req.PARAMS = {};

		if(data) {
			if(data instanceof FormData){
				requestResponseMap[this.guid].req.PARAMS = "FormData";
			}
			else {
				requestResponseMap[this.guid].req.PARAMS = tryJsonParse(data);
			}
		}

		if(this.onload){
			this._onload = this.onload;
		}

		this.onload=onloadReplacement;

		return send.apply(this, arguments);
	}

	function onloadReplacement(){
		var responseText = '';
		if(this.responseType == '' || this.responseType == 'text'){
			responseText = tryJsonParse(this.responseText)
		}
		requestResponseMap[this.guid].res = {HTTP_CODE:this.status,RESPONSE:responseText};
		requestResponseMap[this.guid].res.HEADERS = this.getAllResponseHeaders();

		callbackPushData(requestResponseMap[this.guid]);

		if(this._onload){
			return this._onload.apply(this,arguments);
		}
	}

	window.XMLHttpRequest.prototype.open = openReplacement;
	window.XMLHttpRequest.prototype.send = sendReplacement;
};

var ajaxCallListenerFromIframe = function(){
	ajaxCallListener(function(data){
		parent.postMessage({
			type:"ajaxLogger",
			data:data
		},"*");
	});
};
