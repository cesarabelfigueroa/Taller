var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sql = require("mssql");

var app = express();

app.set('port', (process.env.PORT || 3000));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));



var config = {
	user: 'sa',
	password: '',
	server: 'localhost',
	database: 'Pointo'
};

sql.connect(config, function(err) {
	if (err) console.log(err);
	var request = new sql.Request();
	var query = 'select * from dbo.users';
	request.query(query, function(err, recordset) {
		if (err) console.log(err);
		app.get('/users', function(req, res) {
			res.send(recordset);
		});
	});
});



app.listen(app.get('port'), function() {
	console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
});


module.exports = app;