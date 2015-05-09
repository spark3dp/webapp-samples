// Provide environment through console i.e. ENV=beta node server.js
var env = process.env.ENV || 'local',
    port = process.env.PORT || 3000,
    API_SERVER = (env === 'prod' ? 'https://api.spark.autodesk.com/api/v1' : 'https://sandbox.spark.autodesk.com/api/v1');
    config = require('./config.js');

//Make sure port is a number
if (isNaN(port)){
    port = 3000;
}

// Setup express + request
var express = require('express'),
    app = express(),
    request = require('request');

/**
 * Encode a string in base64.
 *
 * @param {String} s - The string to encode.
 * @returns {String} - The base64 encoding of s.
 */
var toBase64 = function(s){
    return new Buffer(s).toString('base64');
};

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Access token service
// See API reference - http://docs.sparkauthentication.apiary.io/#reference/oauth-2.0/access-token
app.get('/access_token', function(req, res){
    var code = req.query.code;

    var url = API_SERVER + '/oauth/accesstoken',
        params = "code=" + code + "&grant_type=authorization_code&response_type=code",
        contentLength = params.length,
        headers = {
            'Authorization': 'Basic ' + toBase64(config.APP_KEY + ':' + config.APP_SECRET),
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
// See API reference - http://docs.sparkauthentication.apiary.io/#reference/oauth-2.0/guest-token
app.get('/guest_token', function(req, res){
    var url = API_SERVER + '/oauth/accesstoken',
        params = "grant_type=client_credentials",
        contentLength = params.length,
        headers = {
            'Authorization': 'Basic ' + toBase64(config.APP_KEY + ':' + config.APP_SECRET),
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

        //return the access token object (json)
        res.send(body);
    });
});

// TODO: Add a refresh token endpoint

app.listen(port);

console.log('Express server started on port ' + port);
