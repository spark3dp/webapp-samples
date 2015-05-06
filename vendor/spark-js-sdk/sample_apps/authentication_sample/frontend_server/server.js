var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../../src')); // Make the SDK available from the server root

app.listen(8000);

console.log('Frontend server started on port 8000');