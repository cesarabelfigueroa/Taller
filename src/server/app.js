var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var sql = require("mssql");
var fs = require('fs');
var Table = require('./orm/table.js');

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

// Just for test
<<<<<<< HEAD
var myTable = new table({
	name: "USERS",
	fields: {
		id: {
			name: "id_user",
	  		type: "number",
	  		dimension: 2,
	  		isAutoIncrement: true
		},
		name: {
			name: "name",
			type: "string",
			dimension: 10,
			hasNull: false
		},
		userName: {
			name: "username",
			type: "string",
			dimension: 10,
			hasNull: false
		},
		password: {
			name: "password",
			type: "string",
			dimension: 10,
			hasNull: false
		},
		email: {
			name: "email",
			type: "string",
			defaultValue: "Tegucigalpa"
		},
		disabled: {
			name: "disabled",
			type: "number",
			defaultValue: 0
		}
	}
});
=======
// var myTable = new Table({
// 	name: "USERS",
// 	fields: {
// 		id: {
// 			name: "id_user",
// 	  		type: "number",
// 	  		dimension: 2,
// 	  		isAutoIncrement: true
// 		},
// 		name: {
// 			name: "name",
// 			type: "string",
// 			dimension: 10,
// 			hasNull: false
// 		},
// 		userName: {
// 			name: "username",
// 			type: "string",
// 			dimension: 10,
// 			hasNull: false
// 		},
// 		password: {
// 			name: "password",
// 			type: "string",
// 			dimension: 10,
// 			hasNull: false
// 		},
// 		email: {
// 			name: "email",
// 			type: "string",
// 			defaultValue: "Tegucigalpa"
// 		},
// 		disabled: {
// 			name: "disabled",
// 			type: "number",
// 			defaultValue: 0
// 		}
// 	}
// });
// var myHobbies = new Table({
// 	name: "HOBBIES",
// 	fields: {
// 		idUser: {
// 			name: "id_user",
// 	  		type: "number",
// 	  		dimension: 2,
// 	  		isAutoIncrement: true
// 		},
// 		hobby: {
// 			name: "Hobby",
// 			type: "string",
// 			dimension: 10
// 		}
// 	}
// });


>>>>>>> 7f865a04e4aa5f990b9cc2fb5d9956b24a96cdff
// myTable.CREATE2({
// 	name: "Cesar",
// 	userName: "cesar",
// 	password: "12345",
// 	email: "cesads@hola.com"
// });
// myTable.READ({
// 	fields: ["id", "userName"]
// });


// app.sql = sql.connect(config, function(err) {
// 	if (err) console.log(err);
	// var request = new sql.Request();
	// var query = 'select * from dbo.users';
	// request.query(query, function(err, recordset) {
	// 	if (err) console.log(err);
	// 	app.get('/users', function(req, res) {
	// 		res.send(recordset);
	// 	});
	// });
// });


app.get('/assets/images/*', function(request, response){
	var url =  request.url;
	var type = url.split('.');
	console.log(url);
	fs.readFile('..' + url, (err, data) => {
		if(!err){
			response.writeHead(200, { 'Content-Type': 'image/' + type.pop() });
			response.write(data);
		}
	});
});



app.listen(app.get('port'), function() {
	console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
});


module.exports = app;


// Create the Service

app.service('nameService', Function()){
    
});

 myTable.CREATE([{
 	name: "Cesar",
 	userName: "cesar",
 	password: "12345",
 	email: "cesads@hola.com"
},{
 	name: "Cesar",
 	userName: "cesar",
 	password: "12345",
 	email: "cesads@hola.com"
}]);