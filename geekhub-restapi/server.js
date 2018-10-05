var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

require('./routes')(app);

app.listen(5000, '0.0.0.0');

console.log("Geekhub\' runs on port 5000...");
