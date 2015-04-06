/**
 * Created by michael on 3/18/15.
 */
var ajaxListenerAndLogger = function(requestLog) {

	var requestResponseMap = [];
/**
	var logger = function (textAreaId,data) {
		console.log(data);
		var txt = $("#"+textAreaId);
		txt.val(txt.val() + "\n" + data);
		txt.scrollTop(txt[0].scrollHeight);
	};

	var jsonLogger = function(textAreaId,data) {
		console.log(data);
		renderjson.set_show_to_level(1);

		var rendered = renderjson(data);
		console.log("rendered",rendered)
		var txt = document.getElementById(textAreaId);
		txt.appendChild(rendered);

	};
*/
	var jsonLogger = function(textAreaId,data) {
		console.log(data);
		renderjson.set_show_to_level(1);

		var rendered = renderjson((data.res));
		console.log("rendered",rendered)
		var txt = $(document.getElementById(textAreaId));
		var div = $("<pre></pre>");
		var id = "response"+ txt.children().size();

		var on = "$('#"+id+"').toggle()";
		var onclick = "onclick="+on
		div.append("<pre class='renderjson' "+onclick+"><div id='"+"req"+id+"'>"+data.req.METHOD + " " + data.req.URL+"</div></pre>");
		var response = $("<div id='"+id + "' style='display:none'></div>");
		var renderedReq = renderjson((data.req));

		var request =$("<div>data"+data.req.data+"</div>");
		response.append(renderedReq);
		response.append(rendered);
		div.append(response);
		txt.append(div);

	};

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

		/**
		if(this.onreadystatechange) {
			this._onreadystatechange = this.onreadystatechange;
		}
		this.onreadystatechange = onReadyStateChangeReplacement;
		*/

		if(this.onload){
			this._onload = this.onload;
		}

		this.onload=onloadReplacement;

		return send.apply(this, arguments);
	}

	/**
	function onReadyStateChangeReplacement() {
		if(this.readyState ==4) {
			requestResponseMap[this.guid].res = {HTTP_CODE:this.status,RESPONSE:JSON.parse(this.responseText)};
			requestResponseMap[this.guid].res.HEADERS = this.getAllResponseHeaders();
			jsonLogger(requestLog,requestResponseMap[this.guid]);
		}


		if(this._onreadystatechange) {
			return this._onreadystatechange.apply(this, arguments);
		}
	}*/

	function onloadReplacement(){
		requestResponseMap[this.guid].res = {HTTP_CODE:this.status,RESPONSE:tryJsonParse(this.responseText)};
		requestResponseMap[this.guid].res.HEADERS = this.getAllResponseHeaders();
		jsonLogger(requestLog,requestResponseMap[this.guid]);

		if(this._onload){
			return this._onload.apply(this,arguments);
		}
	}

	window.XMLHttpRequest.prototype.open = openReplacement;
	window.XMLHttpRequest.prototype.send = sendReplacement;
};

