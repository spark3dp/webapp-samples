/**
 * Created by michael on 2/5/15.
 */


/**
 var myPrint = function () {

	var logger = function (textArea_id, data) {
		console.log(data);
		var txt = $("#" + textArea_id);
		txt.val(txt.val() + "\n" + data);
		txt.scrollTop(txt[0].scrollHeight);
	}

	return {


		registerPrinter: function (token,printerName) {
			//Make sure token is still valid
			sparkPrint.registerPrinter(token,printerName,function(response){
				logger("inputLog",response)
			});
		}



	}

}();
 */



var myPrinter = function () {

	var memberID = "";


	sparkAuth.getMyProfile(function(member){
		if(member)
			memberID = member.member.id;
		//(JSON.parse(member)).member.id;
	});

	var sendPrinterCommand = function(jobId, command){
		sparkPrint.sendPrintCommand(memberID,$("#printers-select2").val(),jobId,command,function(response){
				logger("#inputLogStatus","Successfully sent " + command + " command to printer "+$("#printers-select2").val());
			}
			,function(response){
				logger("#inputLogStatus",response);
				logger("#inputLogStatus","Error sending " + command + " command to printer "+$("#printers-select2").val());
			});
	}

	var classMapper = {
		"complete":"success",
		"queued":"warning",
		"started":"info",
		"canceled":"danger",
		"printing":"info"
	};

	var buildCommand = function(memberID,printerID,command){
		return "<a onclick='sendPrinterCommand("+memberID+","+printerID+","+"\""+command+"\""+")'>"+command+"</a>";
	};

	var logger = function (textArea_id, data) {
		console.log(data);
		var txt = $( textArea_id);
		txt.val(txt.val() + "\n" + data);
		txt.scrollTop(txt[0].scrollHeight);
	};

	var getAllPrinters = function(){
		sparkPrint.getAllPrinters(memberID,function(response){
			var printers = response.printers;
			$("#printers-select").find('option').remove()

			for(var i in printers){
				$("<option value='"+printers[i].printer_id+"'>"+printers[i].printer_id+":"+printers[i].printer_name+"</option>").appendTo("#printers-select")
			}

			$("#printers-select2").find('option').remove()
			$("<option value='0'>Choose Printer</option>").appendTo("#printers-select2")

			$("#printers-select").children().clone().appendTo("#printers-select2");
		});
	};

	$('.nav-tabs').bind('click', function (e) {
		getAllPrinters();
	});

	$("#printers-select2").on('change', function (e) {
		e.preventDefault();

		var printerId = $('#printers-select2').val();

		sparkPrint.getJobsStatusByPrinter(memberID,printerId,function(response){
				$("#print-statuses").find("tr:not(.header)").remove();
				//var printerId = response.printer_id;
				var printerJobs = response.printer_jobs;
				for(var i in printerJobs){
					$("<tr class='"+ classMapper[printerJobs[i].job_status.state]+"'><td>"+printerJobs[i].job_id+"</td><td>"+printerJobs[i].job_date_time+"</td><td>"+printerJobs[i].job_status.job_status+"</td><td>"+
						'<button type="button" class="btn btn-default resume-print" onclick="sendPrinterCommand(\''+printerJobs[i].job_id+'\',\'resume\')"><span class="glyphicon glyphicon-play" aria-hidden="true"></span>	</button>'+
					'<button type="button" class="btn btn-default pause-print"   onclick="sendPrinterCommand(\''+printerJobs[i].job_id+'\',\'pause\')"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></button>'+
					'<button type="button" class="btn btn-default cancel-print"  onclick="sendPrinterCommand(\''+printerJobs[i].job_id+'\',\'cancel\')"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>' +
					"</td></tr>").appendTo("#print-statuses");
				}

				logger("#inputLogStatus","Got "+ printerJobs.length +" jobs!");

			},
			function(response){
				logger("#inputLogStatus",response);

			});
	});

	$("#register-printer-form").on('submit', function (e) {
		e.preventDefault();

		var token = $('#inputToken').val();
		var printerName = $('#inputName').val();
		sparkPrint.registerPrinter(memberID,token,printerName,function(response){
				var printerId = response.printer_id;
				logger("#register-printer-form #inputLog","Registered Successfully! printerId="+printerId);
			},
			function(response){
				logger("#register-printer-form #inputLog",response);

			});
	});

	$("#print-job-form").on('submit', function (e) {
		e.preventDefault();

		var fileUrl = $('#fileURL').val();
		var printerId = $('#printers-select').val();
		var settings = JSON.parse($('#printer-settings').val());

		sparkPrint.printJob(memberID,fileUrl,printerId,settings,function(response){
				var printerId = response.printer_id;
				logger("#print-job-form #inputLog","Job sent successfully. "+JSON.stringify(response));
			},
			function(response){
				logger("#print-job-form #inputLog","error:" + response);

			});
	});


	return {sendPrinterCommand:sendPrinterCommand};
};

var sendPrinterCommand = myPrinter().sendPrinterCommand;
