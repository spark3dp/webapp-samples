/**
 * Created by michael on 3/18/15.
 */

var ajaxListener = function(callbackPushData) {

	var requestResponseMap = [];

	var open = window.XMLHttpRequest.prototype.open,
		send = window.XMLHttpRequest.prototype.send;

	var tryJsonParse = function(data){

		try{
			var a = JSON.parse(data);
			return a;

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

		if(data!="") {
			requestResponseMap[this.guid].req.PARAMS = tryJsonParse(data);
		}

		if(this.onload){
			this._onload = this.onload;
		}

		this.onload=onloadReplacement;

		return send.apply(this, arguments);
	}

	function onloadReplacement(){
		requestResponseMap[this.guid].res = {HTTP_CODE:this.status,RESPONSE:tryJsonParse(this.responseText)};
		requestResponseMap[this.guid].res.HEADERS = this.getAllResponseHeaders();

		callbackPushData(requestResponseMap[this.guid]);

		if(this._onload){
			return this._onload.apply(this,arguments);
		}
	}

	window.XMLHttpRequest.prototype.open = openReplacement;
	window.XMLHttpRequest.prototype.send = sendReplacement;
};

