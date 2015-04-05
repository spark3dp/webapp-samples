//provide environment through console i.e. ENV=beta node server.js
var env = process.env.ENV || 'local',
	config = require('./config.js'),
	API_HOST = (env === 'prod' ? 'api.spark.autodesk.com/api/v1' : 'https://sandbox.spark.autodesk.com/api/v1');

var express = require('express'),
	app = express();

var oauth2 = require('simple-oauth2')({
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
	site: API_HOST,
	tokenPath: '/oauth/accesstoken'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
	redirect_uri: config.CALLBACK_URI
});

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


// Initial page redirecting to Github
app.get('/auth', function (req, res) {
	res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
	var code = req.query.code;
	oauth2.authCode.getToken({
		code: code,
		redirect_uri: config.CALLBACK_URI
	}, saveToken);

	function saveToken(error, result) {
		if (error) {
			//console.log('Access Token Error', error.message);
		}
		var tokenObj = oauth2.accessToken.create(result);
		res.cookie('spark-token', JSON.stringify(tokenObj.token));
		res.redirect(config.HOME_URI);
	}
});


app.get('/access_token', function(req, res){
	var url = API_HOST + '/oauth/accesstoken',
		params = "grant_type=client_credentials",
		contentLength = params.length,
		request = require('request'),
	 	headers = {
			'Authorization': 'Basic ' + toBase64(config.CLIENT_ID + ':' + config.CLIENT_SECRET),
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Content-Length': contentLength
		};


	request({
		headers: headers,
		uri: url,
		body: params,
		method: 'POST'
	}, function (err, result, body) {
		res.send(body);
	});


});


app.listen(3000);

console.log('Express server started on port 3000');