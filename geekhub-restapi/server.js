var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

require('./routes')(app);

app.listen(5000);

console.log("Geekhub\' runs on port 5000...");
