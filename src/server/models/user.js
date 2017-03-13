var Table = require('../orm/table.js');

var user = new Table({
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

module.exports = user;