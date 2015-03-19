/**
 * Created by michael on 3/18/15.
 */
var ajaxListenerAndLogger = function(requestLog, responseLog) {

	var logger = function (textAreaId,data) {
		console.log(data);
		var txt = $("#"+textAreaId);
		txt.val(txt.val() + "\n" + data);
		txt.scrollTop(txt[0].scrollHeight);
	};

	var jsonLogger = function(textAreaId,data) {
		console.log(data);

		//var txt = $(textAreaId);
		console.log("txt",txt)
		var rendered = renderjson(data);
		console.log("rendered",rendered)
		var txt = document.getElementById(textAreaId);
		txt.appendChild(rendered);

		//var txt = $(textAreaId);
		//txt.val(txt.val() + "\n" + data);
		//txt.scrollTop(txt[0].scrollHeight);
	};

	var open = window.XMLHttpRequest.prototype.open,
		send = window.XMLHttpRequest.prototype.send,
		onReadyStateChange;

	function openReplacement(method, url, async, user, password) {
		var syncMode = async !== false ? 'async' : 'sync';
		jsonLogger(requestLog,'Preparing ' +	syncMode +' HTTP request : ' +method +' ' +	url);
		return open.apply(this, arguments);
	}

	function sendReplacement(data) {
		jsonLogger(requestLog,'Sending HTTP request data : '+ data);

		if(this.onreadystatechange) {
			this._onreadystatechange = this.onreadystatechange;
		}
		this.onreadystatechange = onReadyStateChangeReplacement;

		return send.apply(this, arguments);
	}

	function onReadyStateChangeReplacement() {
		if(this.readyState ==4) {
			jsonLogger(responseLog,'HTTP request ready state changed : ' + this.status);
			jsonLogger(responseLog,  JSON.parse(this.responseText));

		}
		if(this._onreadystatechange) {
			return this._onreadystatechange.apply(this, arguments);
		}
	}

	window.XMLHttpRequest.prototype.open = openReplacement;
	window.XMLHttpRequest.prototype.send = sendReplacement;
};

