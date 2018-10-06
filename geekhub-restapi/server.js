var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.json())
app.use(bodyParser.raw({
  type: 'application/raw',
  limit: '10mb'
}))

require('./routes')(app);

app.listen(5000);

console.log("Geekhub\' runs on port 5000...");
