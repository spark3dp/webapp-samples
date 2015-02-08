var Printer= (function() {

	// Private variables and functions
	var env = "alpha";
	var TOKEN_KEY = "com.autodesk.print.token"+env;
	var REGISTRATION_STATE="com.autodesk.print.registered"+env;
	var isOnline=false;
	var healthCheckTimer;
	//how often to send health check ping
	var HEALTH_CHECK_INTERVAL=60000;
	var PRINT_JOB_INTERVAL=1000;

	var BASE_URL="http://alpha.spark.autodesk.com/api/v1";
	var FAYE_URL="http://alpha.spark.autodesk.com/faye";

	var BASE_URL_LOCAL="http://localhost:8080/api/v1";
	var FAYE_URL_LOCAL="http://localhost:8080/faye"
	//faye client
	var client;


	var registrationSub=null;
	var commandSub=null;

	//track the total and current layers and current print command
	var totalLayers;
	var currentLayer
	var currentPrintCommand=null;
	var printCommandTimer=null;
	/**
	 * Initialize simulator
	 */
	var init= function(){


		log("initializing printer...");
		//set up url if local mode
		var local=getQueryVariable('mode');
		if(local!=false&&local.toUpperCase()==='LOCAL'){
			log("Setting url's to local mode");
			BASE_URL=BASE_URL_LOCAL;
			FAYE_URL=FAYE_URL_LOCAL;
		}

		//first set up faye client
		client = new Faye.Client(FAYE_URL);
		client.disable('websocket');

		Logger = {
			incoming: function(message, callback) {
				console.log('incoming', message);
				callback(message);
			},
			outgoing: function(message, callback) {
				console.log('outgoing', message);
				callback(message);
			}
		};
		client.addExtension(Logger);



		log("checking token in local storage...");
		var token=getToken();
		if(token==null){
			log("No token found in local storage getting a new one...");
			if(!resetToken()){
				log("failed to initialize...could not get token");
				return;
			}
		}
		else{
			log("retrieved token from local storage:");
			log("token:"+JSON.stringify(token));
			log ("printer id:"+token.printer_id);

			if(token.registered==false){
				offline();
				lcdWrite(token.registration_code)
				subscribeRegistrationChannel(token.printer_id);
			}
			else{
				lcdWrite('REGISTERED: '+token.printer_id);
				subscribeCommandChannel();
				online();
			}
		}


	}

	/**
	 *parse query params to check if running in local mode
	 */

	var getQueryVariable=function(variable)
	{
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}



	//get token from local storage
	var getToken = function() {
		var token_str=localStorage.getItem(TOKEN_KEY);
		if(token_str=='undefined')return null;
		var token=jQuery.parseJSON( token_str );
		return token;

	};

	//put the json token into storage
	var putToken = function(data) {
		localStorage.setItem(TOKEN_KEY,data);
	};

	//get a new token from remote server
	var getNewToken = function(){
		var reg_code=null;

		var api_url=BASE_URL+'/print/printers/register?model=Ember&firmware=1.1.10&manufacturer=Autodesk';
		log("Sending GET request to: "+api_url);
		jQuery.ajax({
			type: 'GET',
			url: api_url,
			success: function(data){
				var json_str=JSON.stringify(data);
				log("Server response:"+json_str);
				reg_code=data;


			},
			error: function(error){

				var json_str=JSON.stringify(error);
				log("Server Error:"+json_str);


			},
			async:   false
		});
		return reg_code;
	}

	//get registration state from local printer i.e if the printer has been registered
	var getRegistrationState = function() {
		var token=getToken();
		if(token!=null)return token.registered;

	};

	//put the REGISTRAIOTN STATE into storage
	var putRegistrationState = function(isRegistered) {
		var token=getToken();
		if(token==null) {
			log("putRegistrationState:No token found in storage!");
		}
		else{
			token.registered=isRegistered;
			var token_str=JSON.stringify(token);
			log("new registration state is:"+token_str);
			putToken(token_str);
		}
	};



	//clear the token and registration state in the printer
	var resetToken = function(){
		log("resetting token...");
		var token=getNewToken();
		if(token==null){
			log("failed to get token from server");
			return false;
		}
		var token_str=JSON.stringify(token);
		log("new token is:"+token_str);
		putToken(token_str);
		lcdWrite(token.registration_code);
		var printer_id=token.printer_id;
		subscribeRegistrationChannel(printer_id);
		unsubscribeCommandChannel();
		offline();

		return true;

	}

	/**
	 *subscribe to the registration channel - this channel is opened after the printer gets a new token
	 *and before it has been registered - it is listening for registration success messages
	 */

	var subscribeRegistrationChannel=function(printer_id){
		if(registrationSub!=null){
			log("canceling existing subscription");
			registrationSub.cancel();
		}
		log("Subscribing to server@"+"/printers/" + printer_id + "/users");

		registrationSub = client.subscribe("/printers/" + printer_id + "/users", function(message) {
			log("Recieved message from server:"+JSON.stringify(message));
			putRegistrationState(true);
			var token=getToken();
			lcdWrite('REGISTERED: '+token.printer_id);
			subscribeCommandChannel();
			online();


		});
		registrationSub.then(function() {
			log('Actively listening to registration success channel');

		});

	}

	/**
	 * subscribe to command channel : this channel is opened once the printer has been registered
	 */
	var subscribeCommandChannel=function(){
		unsubscribeCommandChannel();
		var token=getToken();
		if(token==null||token.registered==false){
			log("cannot subscribe to command channel, printer not registered");
		}
		var printer_id=token.printer_id;
		log("Subscribing to server@"+"/printers/" + printer_id + "/command");

		commandSub = client.subscribe("/printers/" + printer_id + "/command", function(message) {
			log("Recieved message from server:"+JSON.stringify(message));
			processCommand(message)
		});
		commandSub.then(function() {
			log('Actively listening to command channel');

		});

	}

	var unsubscribeCommandChannel=function(){
		if(commandSub!=null){
			log("canceling  command channel subscription");
			commandSub.cancel();
		}
	}

	var processCommand=function(message){

		var acg={};
		if(message.command=="print_data"){
			log("Print command recieved");
			if(printCommandTimer!=null){
				log("clearing previous print job...");
				clearTimeout(printCommandTimer);
			}
			totalLayers=50;
			currentLayer=1;
			currentPrintCommand=message;
			processPrintCommand(message);
			return;
		}
		else if(message.command=="pause"){
			acg.progress=1.0;
			if(pause()==true){
				acg.data =JSON.stringify({"job_id":currentPrintCommand.command_token,"status":"paused"});
			}

		}
		else if(message.command=="resume"){
			acg.progress=1.0;
			if(resume()==true){
				acg.data =JSON.stringify({"job_id":currentPrintCommand.command_token,"status":"resumed"});
			}

		}
		else if(message.command=="cancel"){
			acg.progress=1.0;
			var job_id=currentPrintCommand.command_token;
			if(cancel()==true){
				acg.data =JSON.stringify({"job_id":job_id,"status":"canceled"});
			}

		}
		else if(message.command=="calibrate"){
			acg.progress=0.0;
			acg.error_code=123;
			acg.error_message="Incorrect Calibration Settings";

		}
		else if(message.command=="firmware_upgrade"){
			acg.progress=1.0;

		}
		else if(message.command=="log"){
			acg.progress=1.0;
			var rand_name=(Math.random() + 1).toString(36).substring(7);
			acg.data=JSON.stringify({"url":"http://logs.com/logs/"+rand_name});

		}
		lcdWrite("Command:"+message.command);
		var token=getToken();
		var auth_code=token.auth_code;
		log("sending acknowledge auth code:"+auth_code);

		var api_url=BASE_URL+'/print/printers/command/'+message.command_token;
		log("Sending POST request to: "+api_url);
		log("POST data:"+JSON.stringify(acg));

		jQuery.ajax({
			type: 'POST',
			url: api_url,
			headers: { 'X-Printer-Auth-Token': auth_code },
			data:acg,
			success: function(data,testStatus, xhr){
				var json_str=JSON.stringify(data);
				log("Server response status "+xhr.status);


			},
			error: function(error){

				var json_str=JSON.stringify(error);
				log("Server Error in Command Acknowledge:"+json_str);


			},
			async:   true
		});


	}


	/**
	 * print commands sends udpates to a different end point
	 */
	var processPrintCommand=function(){
		var message=currentPrintCommand;
		lcdWrite("LAYER:"+currentLayer +" OF: "+totalLayers);


		if(currentLayer<totalLayers){
			setPrintJobStatus("printing");
		}
		else{
			setPrintJobStatus("complete");
		}



		if(currentLayer<totalLayers){
			printCommandTimer=setTimeout(processPrintCommand,PRINT_JOB_INTERVAL);
			currentLayer=currentLayer+1;
		}

		else{//reset everything
			clearPrintJob();

		}

	}



	/*
	 *set the status of a print job
	 */
	var setPrintJobStatus=function(status){
		var acg={};
		acg.state=status;
		acg.total_layers=totalLayers;
		acg.layer=currentLayer;
		acg.seconds_left=(totalLayers-currentLayer)*20;
		acg.temprature=71;
		acg.job_id=currentPrintCommand.command_token;
		//now send the status to server
		var token=getToken();
		var auth_code=token.auth_code;
		log("sending job status auth code:"+auth_code);
		var api_url=BASE_URL+'/print/printers/jobs/'+currentPrintCommand.command_token;
		log("Sending POST request to: "+api_url);
		log("POST data:"+JSON.stringify(acg));

		jQuery.ajax({
			type: 'POST',
			url: api_url,
			headers: { 'X-Printer-Auth-Token': auth_code },
			data:acg,
			success: function(data,testStatus, xhr){
				var json_str=JSON.stringify(data);
				log("Server response status "+xhr.status);


			},
			error: function(error){

				var json_str=JSON.stringify(error);
				log("Server Error in Command Acknowledge:"+json_str);


			},
			async:   true
		});
	}

	/**
	 *clear the current print job
	 */
	var clearPrintJob=function(){
		currentPrintCommand=null;
		if(printCommandTimer!=null){
			clearTimeout(printCommandTimer);
		}
		printCommandTimer=null;
		currentLayer=1;
	}

	var resume =function(){
		if(currentPrintCommand==null||printCommandTimer==null){
			log("No running job to resume...")
			return false;
		}
		else{
			log("resuming job "+currentPrintCommand.command_token);
			lcdWrite("Resume");
			setPrintJobStatus("resumed");
			printCommandTimer=setTimeout(processPrintCommand,PRINT_JOB_INTERVAL);
			return true;

		}

	}

	var cancel =function(){
		if(currentPrintCommand==null||printCommandTimer==null){
			log("No running job to cancel...");
			return false;
		}
		else{

			log("Canceling job "+currentPrintCommand.command_token);
			lcdWrite("Cancel");
			setPrintJobStatus("canceled");
			clearPrintJob();
			return true;
		}

	}

	var pause =function(){
		if(currentPrintCommand==null||printCommandTimer==null){
			log("No running job to pause...");
			return false;
		}
		else{
			log("pausing job "+currentPrintCommand.command_token);
			lcdWrite("Pause");
			clearTimeout(printCommandTimer);
			setPrintJobStatus("paused");
			return true;
		}

	}

	//show the existing token in the console
	var showToken =function(){
		var token=getToken();
		var token_str=JSON.stringify(token);
		log("Token is:"+token_str);
		lcdWrite(token.registration_code);
	}

	var offline=function(){
		isOnline=false;
		log("set printer state to OFFLINE");
		clearTimeout(healthCheckTimer);
	}

	var online=function(){
		isOnline=true;
		log("set printer state to ONLINE");
		healthCheck();
	}

	var healthCheck=function(){
		if(isOnline){

			var token=getToken();

			if(token==null||token.registered==false){
				log("Printer not registered, no health check required");

			}
			else{
				var auth_code=token.auth_code;
				log("sending health check ping with auth code:"+auth_code);
				var api_url=BASE_URL+'/print/printers/healthcheck';
				log("Sending POST request to: "+api_url);
				jQuery.ajax({
					type: 'POST',
					url: api_url,
					headers: { 'X-Printer-Auth-Token': auth_code },
					success: function(data,testStatus, xhr){
						var json_str=JSON.stringify(data);
						log("Server response status "+xhr.status);


					},
					error: function(error){

						var json_str=JSON.stringify(error);
						log("Server Error:"+json_str);


					},
					async:   true
				});

			}



			healthCheckTimer=setTimeout(healthCheck,HEALTH_CHECK_INTERVAL);
		}

	}




	//log data

	var log=function(data){
		console.log(data);
		var txt = $(".log");
		txt.val( txt.val() + "\n"+data);
		txt.scrollTop(txt[0].scrollHeight);
	}

	//utility function to write to lcd
	var lcdWrite=function(data){
		$(".lcd").html(data);
	}

	// Public API
	return {
		init: init,
		showToken:showToken,
		resetToken:resetToken,
		online:online,
		offline:offline,
		pause:pause,
		resume:resume,
		cancel:cancel


	};
})();

$( document ).ready( function() {
	Printer.init();
	$(".get-token").click(Printer.showToken);
	$(".new-token").click(Printer.resetToken);
	$(".printer-online").click(Printer.online);
	$(".printer-offline").click(Printer.offline);

	$(".resume-print").click(Printer.resume);
	$(".cancel-print").click(Printer.cancel);
	$(".pause-print").click(Printer.pause);

	$('[data-toggle="tooltip"]').tooltip();


});