var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + './../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.listen(app.get('port'), function() {
  console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
});


module.exports = app;