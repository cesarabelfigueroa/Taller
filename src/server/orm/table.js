/**
 * { function_description }
 *
 * @param      {<JSON>}  definition  The definition
 * {
 * 	name: String,
 * 	fields: Array<field>
 * }
 */
var table = function (definition) {
	if (!definition.hasOwnProperty("name") || !definition.hasOwnProperty("fields")) {
		throw "Invalid Parameters";
	}

	if (typeof(definition.name) !== "string") {
		throw "Invalid Name";
	}

	var _self = this;

	/**
	 * {
	 * 	fieldName: value,
	 * 	fieldName: {
	 * 		"oper": value //oper => >,<,>=,=,"not"
	 * 	},
	 * 	$and: {
	 * 		fieldName: value,
	 * 		fieldName: {
	 * 			"oper": value //oper => >,<,>=,=,"not"
	 * 		}
	 * 	},
	 * 	$or: {
	 * 		fieldName: value
	 * 	}
	 * }
	 */



	 /**
	 *	myTable.CREATE({
 	 * 	id:2,
 	 *	nombre:"Herbert",
 	 *	apellido:"Paz"
	 *	})	
	 *  Este metodo valida tanto el nombre y tipo de cada campo 
	 */
	 this.CREATE = function(object){
	 	var stringStament = "INSERT INTO ";
	 	if (!object) {
	 		throw "Invalid Parameters";
	 	}else{
	 		var counter = 0;
	 		stringStament += this.name+ " (";
	 		for(var tempfields in this.fields){	
	 			var checker = 0;
	 			for(var fieldName in object) {
	 				if(this.fields[tempfields].name == fieldName){
	 					if (counter == Object.keys(object).length-1) {
	 						stringStament += fieldName;
	 					}else{
	 						stringStament += fieldName + ", ";	
	 					}
	 					counter++;
	 					checker = 1;
	 				}else{
	 				}
	 			}
				if(checker == 0){
					throw "Invalid Field";
 				}
	 		}
	 		stringStament += ") VALUES (";
	 		counter=0;
	 		for(var tempfields in this.fields){
	 			var checker = 0;
	 			for (var fieldValue in object) {
	 				if((this.fields[tempfields].type) == typeof(object[fieldValue])){
	 					if (counter == Object.keys(object).length-1) {
	 						stringStament += "'"+ object[fieldValue]+"'";
	 					}else{
	 						stringStament += "'"+ object[fieldValue] + "', ";	
	 					}
	 					counter++;	
	 					checker = 1;	
	 				}
	 			}	
	 			if(checker == 0){
	 				throw "Invalid Type of Value";
	 			}
	 		}	 			
	 		stringStament += ");";
	 		console.log(stringStament);
	 	}
	 };


	 this.READ = function(object) {
		var stringStament = "SELECT ";
		if (!object) {
			stringStament += "* FROM " + this.name;
			console.log(stringStament);
		} else {
			if (!object.fields) {
				stringStament += "* FROM " + this.name;
			}
			if (object.where && Object.keys(object.where).length > 0) {
				stringStament += _parseWhere(object.where);
			}
		}
		console.log(stringStament)
	};


	 this.UPDATE =function(object){
	 	if(!object){
	 		throw "Invalid  Parameters";
	 	}else{
	 		var stringStament = "UPDATE "+ this.name+ " SET ";
	 		var counter=0;
	 		for(var tempfields in this.fields){
	 			for(var temp in object) {
	 				if((this.fields[tempfields].name == temp) && ((this.fields[tempfields].type) == typeof(object[temp]))){
	 					if (counter == Object.keys(object).length-1) {
	 						stringStament += temp + "='" + object[temp] + "'";
	 					}else{
	 						stringStament += temp + "='" + object[temp] + "', ";	
	 					}
	 					counter++;
	 				}
				}
	 		}
			console.log(stringStament);
	 		if (object.where && Object.keys(object.where).length > 0) {
					stringStament += _parseWhere(object.where);
				}else{
					throw "WARNING";
				}
	 		console.log(stringStament);
	 	}
	 };
	 

	 this.DELETE =function(object){
	 	var stringStament = "";
	 	if (!object) {
	 		stringStament = "DELETE * FROM " + this.name+";";
	 		console.log(stringStament);
	 	}else{
	 		stringStament += "DELETE FROM "+ this.name;
	 		console.log(stringStament);
	 	}
	 	if(object.where && Object.keys(object.where).length >0){
	 		stringStament += _parseWhere(object.where);
	 		console.log(stringStament);
	 	}else{
	 		throw "Invalid condition";
	 	}
	 }


	var _parseWhere = function(whereOptions) {
		console.log(arguments)
		var _stringWhere = " ";
		for (var CONDITION in whereOptions) {
			if (whereOptions.hasOwnProperty(CONDITION)) {
				if (CONDITION === "$and") {

				} else if (CONDITION === "$or") {

				} else {
					console.log(CONDITION)
					if (_self.fields.hasOwnProperty(CONDITION)) {
						_stringWhere += CONDITION + " = " + whereOptions[CONDITION];
					}
				}
			}
		}
		console.log(_stringWhere)
		return _stringWhere;
	};

	


	// if (!Array.isArray(definition.field)) {
	// 	throw "Invalid fields";
	// }

	
	this.name = definition.name;
	this.fields = {};

	for (var KEY in definition.fields) {
		if (definition.fields.hasOwnProperty(KEY)) {
			var fieldData = definition.fields[KEY];
			this.fields[KEY] = new Field({
				name: fieldData.name,
				type: fieldData.type,
				dimension: fieldData.dimension,
				defaultValue: fieldData.defaultValue,
				options: fieldData.options
			})
		}
	}
};

var Field = function (definition) {
	this.name = definition.name;
	this.type = definition.type;
	this.dimension = definition.dimension;
	this.defaultValue = definition.defaultValue;
	this.options = definition.options;
}
var myTable = new table({
name: "Test",
fields: {
	id: {
		name: "id",
  		type: "number",
  		dimension: 2
	},
	names: {
		name: "names",
		type: "string",
		dimension: 10
	}
}
})

myTable.DELETE()

