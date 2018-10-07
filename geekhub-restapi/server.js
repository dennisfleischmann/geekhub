var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/raw' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

require('./routes')(app);

app.listen(5000);

console.log("Geekhub\' runs on port 5000...");
