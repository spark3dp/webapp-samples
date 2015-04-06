//provide environment through console i.e. ENV=beta node server.js
var env = process.env.ENV || 'local',
	config = require('./config.js'),
	API_HOST = (env === 'prod' ? 'api.spark.autodesk.com/api/v1' : 'https://api-alpha.spark.autodesk.com/api/v1');

//setup express + request
var express = require('express'),
	app = express(),
	request = require('request');



/**
 * Encode string in base64
 * @param str
 * @returns {*}
 */
var toBase64 = function(str){
	return new Buffer(str).toString('base64');
}


//Enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// Access token service
app.get('/access_token', function(req, res){

	console.log(req.query);
	console.log(req.params);
	var code = req.query.code;

	var url = API_HOST + '/oauth/accesstoken',
		params = "code=" + code + "&grant_type=authorization_code&response_type=code",
		contentLength = params.length,
		headers = {
			'Authorization': 'Basic ' + toBase64(config.CLIENT_ID + ':' + config.CLIENT_SECRET),
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length': contentLength
		};

	//call the accesstoken endpoint
	request({
		headers: headers,
		uri: url,
		body: params,
		method: 'POST'
	}, function (err, result, body) {

		//return the guest token object (json)
		res.send(body);
	});


});

// Guest token service
app.get('/guest_token', function(req, res){
	var url = API_HOST + '/oauth/accesstoken',
		params = "grant_type=client_credentials",
		contentLength = params.length,
	 	headers = {
			'Authorization': 'Basic ' + toBase64(config.CLIENT_ID + ':' + config.CLIENT_SECRET),
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length': contentLength
		};

	//call the accesstoken endpoint
	request({
		headers: headers,
		uri: url,
		body: params,
		method: 'POST'
	}, function (err, result, body) {

		//return the guest token object (json)
		res.send(body);
	});


});


app.listen(3000);

console.log('Express server started on port 3000');