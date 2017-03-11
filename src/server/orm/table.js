var sql = require("mssql");

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
 	var config = {
 		user: 'sa',
 		password: '',
 		server: 'localhost',
 		database: 'Pointo'
 	};
	// console.log(config)

	var callDB = function(stringStament) {
		console.log(stringStament)
		sql.connect(config, function(err) {
			if (err) console.log(err);
			// console.log(config)
			new sql.Request().query(stringStament, function(err, recordset) {
				if (err) console.log(err);
				console.log(recordset);
				sql.close();
			});
		});
	};
	if (typeof(definition.name) !== "string") {
		throw "Invalid Name";
	}

	var _self = this;
	var operators = {
		$gt: ">",
		$lt: "<",
		$gte: ">=",
		$lte: "<=",
		$not: "!="
	};

	/**
	 * { Obtener la sentenceia WHERE }
	 *
	 * @param      {<Array>}  
	 * 		whereOptions: [{
     *			field_name: value,
     *			$and: [{
     *				field_name: value,
     *				field_name: value,
     *				$or: [{
     *					field_name: value,
     *					field_name: value,
     *				}]
     *			}],
     *			$or: [{
     *				field_name: value,
     *				field_name: value
     *			}]
     *		}]
	 * @return     {string}  { String con la sentencia WHERE para query SQL }
	 */
	 var _parseWhere = function(whereOptions, righTable) {
	 	return " WHERE " + _parseCondition(whereOptions, righTable);
	 };


	 var _parseCondition = function(whereOptions, rightTable) {
	 	var _stringWhere = "";
	 	var _cont = 0;
	 	for (var CONDITION in whereOptions) {
	 		if (whereOptions.hasOwnProperty(CONDITION)) {
	 			var _operator = "=";
	 			var _value = null;
	 			if (CONDITION === "$and" || CONDITION === "$or") {
	 				var ands = whereOptions[CONDITION];
	 				_stringWhere += "("
	 				for (var k = 0; k < ands.length; k++) {
	 					_stringWhere += _parseCondition(ands[k]);

	 					if (k < ands.length - 1) {
	 						_stringWhere += (CONDITION === "$and" ? " AND " : " OR ");
	 					}
	 				}
	 				_stringWhere += ")";
	 			} else {
	 				var _condition = whereOptions[CONDITION];
	 				if (_self.fields.hasOwnProperty(CONDITION)) {
	 					var _field = _self.fields[CONDITION];

	 					if (typeof(_condition) === "object" && !Array.isArray(_condition)) {
	 						var oper = Object.keys(_condition)[0];
	 						if (oper === "on") {
	 							_value = rightTable.name + '.' + rightTable.fields[_condition[oper]].name;
	 						} else {
	 							_operator = operators[oper];
	 							_value  = _condition[oper];
	 						}
	 					} else { 
	 						_value = _condition;
	 					}

	 					if (Array.isArray(_value)) {
	 						if (_operator === "=" || _operator === "!=") {
	 							if (_operator === "=") {
	 								_operator = " IN "
	 							} else if (_operator === "not") {
	 								_operator = " NOT IN ";
	 							}
	 							_value = "('" + _value.join("','") + "')";
	 						} else {
	 							_stringWhere += "(";
	 							_stringWhere += _field.name + _operator + " OR " + _value.join(" " + _field.name + " OR" + _operator) + ")";
	 							continue;
	 						}
	 					}

	 					if (_field.type === "number" && Number.isNaN(_value)) {
	 						throw "Can't compare types";
	 					}

	 					if (_field.type === "string" && _operator !== " IN " && _operator !== " NOT IN ") {
	 						_value = "'" + _value + "'";
	 					}

	 					_stringWhere += _field.name + _operator + _value;

	 				} else {
	 					throw "The table doesn't have the field: " + CONDITION;
	 				}
	 			}
	 			if (_cont < Object.keys(whereOptions).length - 1) {
	 				_stringWhere += " AND ";
	 			}
	 		}
	 		_cont++;
	 	}
		// console.log(_stringWhere)
		return _stringWhere;
	};

	/**
	 * { Obtiene una cadena de texto con el nombre de los campos. }
	 *
	 * @param      {<Array> o <JSON>}   fields    		Arreglo u objeto con los nombres de los campos que se desean obtener. 
	 * 													Ejemplo: ["field_name1", "field_name2"]
	 * 										
	 * @param      {<boolean>}  		isOrderBy		Indica si se llamó desde orderBy
	 * 
	 * @return     {<string>}   		stringFields	Cadena de texto con los nombres de las columnas separados por comas.
	 * 													Ejemplo: "[FIELD NAME], [FIELD NAME2]"
	 */
	 var getStringFields = function(fields, isOrderBy) {
	 	var stringFields = "";
	 	if (!Array.isArray(fields)) {
	 		fields = Object.keys(fields);
	 	}

	 	for (var i = 0; i < fields.length; i++) {
	 		var _orderBy = "";
	 		if (isOrderBy) {
	 			_orderBy = fields[i].startsWith("-") ? "DESC" : "ASC";

	 			if (fields[i].startsWith("-") || fields[i].startsWith("+")) {
	 				fields[i] = fields[i].slice(1, fields[i].length);
	 				console.log("@fields[i]", fields[i])
	 			}					
	 		}
	 		if (_self.fields.hasOwnProperty(fields[i])) {
	 			stringFields += _self.fields[fields[i]].name + (isOrderBy ? (" " + _orderBy) : "") + ",";
	 		}
	 	}
	 	if (stringFields.endsWith(",")) {
	 		stringFields = stringFields.slice(0, stringFields.length - 1);
	 	}
	 	return stringFields;
	 };

	/**
	 *
	 * @param      {JSON}  	object  		JSON tipo key value, donde el key es nombre del campo y value será el valor. 
	 *										En caso de que el JSON no tengo un campo de la tabla lo colocará nulo o buscará si el campo tiene valor por defecto
	 *										y en el caso que el campo sea obligatorio no se realizará la insercción. 
	 *										El valor a insertar deberá coincidir con el tipo del campo.
	 * 
	 * @return     {string}	stringStament 	Statement para la insercción
	 * 
	 * RESTAURANTES.CREATE2({
	 * 	nombre: "Matambritas",
	 * 	$otherTables: [{
	 * 		table: "Local",
	 * 		values: [{
	 * 			idRestaurante: {
	 * 				from: RESTAURANTES.fields.id
	 * 			},
 	 *			address: "sdaasd",
 	 * 			phone: "asdad"
	 * 		}]		
	 * 	},{
	 * 		table: "CATEGORIAS",
	 * 		values: [{
	 *	 		idCategoria: 1,
	 * 			idRestaurante: {
	 * 				from: RESTAURANTES.fields.id
	 * 			}
	 * 		}]
	 * 	}]
	 * })
	 * 
	 * $tblsIntermedias: [{
	 * 	table: tabla1,
	 * 	values: [{
	 * 		field1: value,
	 * 		field2: {
	 * 			from: tabla1.field 
	 * 		}
	 * 	}]
	 * }]
	 */
     /**  RESTAURANTES.CREATE2({
     *  nombre: "Matambritas",
     *  $tblsIntermedias: [{
     *   table: "CATEGORIAS",
     *   values: [{
     *    idCategoria: 1,
     *    idRestaurante: {
     *     from: RESTAURANTES.fields.id
     *    }
     *   }]
     *  }]
     * })
     * 
     * $tblsIntermedias: [{
     *  table: tabla1,
     *  values: [{
     *   field1: value,
     *   field2: {
     *    from: tabla1.field 
     *   }
     *  }]
     * }]
     */
	 this.CREATE = function(object) {
	var stringStament = "INSERT INTO " + this.name + " (";
	var stringValues = ") VALUES ";
	if (!Array.isArray(object)) {
		object = [object];
	}    
	 	// Buscar los campos que no trae el objeto y obtener el valor por defecto o validar si el valor puede ser nulo
	 	for (var KEY in this.fields) {
	 		if (this.fields.hasOwnProperty(KEY)) {
	 			var field = this.fields[KEY];
                for(var i = 0; i < object.length; i++){ 
                    if (!object[i].hasOwnProperty(KEY)) {

                        if (field.defaultValue !== undefined) {
                            object[i][KEY] = field.defaultValue;
                        } else if (!field.hasNull) {
                            throw "CREATE -> The field " + field.name + " cannot be null";
                        }
                    }
                }
	 		}
	 	}
	 	for(var i = 0; i < object.length; i++){ 
            stringValues += "(";
	 		for (var fieldName in object[i]) {
	 			if (object[i].hasOwnProperty(fieldName)) {
	 				if (this.fields.hasOwnProperty(fieldName)) {
	 					var field = this.fields[fieldName];
	 					if (!field.isAutoIncrement) {
	 						if(i==0){
	 							stringStament += field.name + ",";
                            }
	 						if (field.type !== "number") {
	 							stringValues += "'" + object[i][fieldName] + "',";
	 						} else {
	 							if (!Number.isNaN(object[i][fieldName])) {
	 								stringValues += object[i][fieldName] + ",";
	 							} else {
	 								throw "CREATE -> Cannot insert " + object[i][fieldName] + " in " + fieldName;
	 							}
	 						}
	 					} else {
	 						console.warn("The field " + fieldName + " is Auto Increment");
	 					}
	 				} else {
	 					console.warn("The table doesn't have the field: " + fieldName);
	 				}
	 			}
	 		}
            if (stringValues.endsWith(",")) {
	 		    stringValues = stringValues.slice(0, stringValues.length - 1);
            }
            stringValues += "),"
	 	}
	 	// Fix con la coma final
	 	if (stringStament.endsWith(",")) {
	 		stringStament = stringStament.slice(0, stringStament.length - 1);
	 	}
	 	
	 	if (stringValues.endsWith(",")) {
	 		stringValues = stringValues.slice(0, stringValues.length - 1);
	 	}
	 	
	 	stringStament += stringValues;
	 	// console.log("@INSERT_STATEMENT = ", stringStament);
	 	callDB(stringStament);
	 	return stringStament;
	 };

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


>>>>>>> 7f865a04e4aa5f990b9cc2fb5d9956b24a96cdff
	  /**
	   * Ejecutar select
	   *
	   * @param      {<JSON>}  object (opcional) 
	   *			{
	   *				fields(optional): [field_name, field_name2], // Si no tiene la propiedad o es un arreglo vacio trae todos los campos
	   *				join: [{
	   *					table: objectTable,
	   *					outer: "LEFT" / "JOIN",
	   *					on: [{
	   *						field1: {
	   *							on: field2
	   *						}
	   *					}]
	   *				}]
	   *				where(optional): [{
	   *					field_name: value,
	   *					$and: [{
	   *							field_name: value,
	   *							field_name: value,
	   *							$or: [{
	   *								field_name: value,
	   *								field_name: value,
	   *							}]
	   *					}],
	   *					$or: [{
	   *						field_name: value,
	   *						field_name: value
	   *					}]
	   *				}],
	   *				orderBy(optional): [-field_name, +field_name2, field_name3], // El guion es equivalente a DESC y el signo mas o sólo el nombre del campo es igual que ASC
	   *				groupBY(optional): [field_name, field_name2]
	   *			}
	   */
	   this.READ = function(object) {
	   	object = object || {};
	   	var stringStament = "SELECT " + (Boolean(object.distinct) ? "DISTINCT " : "");
	   	if (!object) {
	   		stringStament += "* FROM " + this.name;
	   		console.log(stringStament);
	   	} else {
	   		if (!object.fields) {
	   			stringStament += "*";
	   		} else {
	   			if (object.fields.length > 0) {
	   				stringStament += getStringFields(object.fields);
	   			} else {
	   				stringStament += "*"
	   			}
	   		}
	   		stringStament += " FROM " + this.name;

	   		var stringJoin = "";
	   		if (object.join) {
	   			for (var JOIN = 0; JOIN < object.join.length; JOIN++) {
	   				var _join = object.join[JOIN];
	   				var _outer = "INNER";

	   				if (_join.hasOwnProperty("outer")) {
	   					_outer = _join.outer;
	   				}

	   				stringJoin += _outer + " JOIN " + _join.table.name;
	   				stringJoin += " ON " + _parseCondition(_join.on, _join.table);
	   			}
	   		}
	   		stringStament += stringJoin;

	   		if (object.where && Object.keys(object.where).length > 0) {
	   			stringStament += _parseWhere(object.where);
	   		}

	   		if (object.groupBy) {
	   			stringStament += " GROUP BY " + getStringFields(object.groupBy);
	   		}

	   		if (object.orderBy) {
	   			stringStament += " ORDER BY " + getStringFields(object.orderBy, true);
	   		}

	   	}
		// console.log(stringStament);
		callDB(stringStament);
		return stringStament;
	};


	/**
	 *
	 * @param      {JSON}  	object  		El json puede llevar una propiedad para el where en caso de no tenerla hará el where de acuerdo al id
	 * 										JSON tipo key value, donde el key es nombre del campo y value será el valor. 
	 *										En caso de que el JSON no tengo un campo de la tabla lo colocará nulo o buscará si el campo tiene valor por defecto
	 *										y en el caso que el campo sea obligatorio no se realizará la insercción. 
	 *										El valor a insertar deberá coincidir con el tipo del campo.
	 * 
	 * @return     {string}	stringStament 	Statement para la insercción
	 */
	 this.UPDATE =function(object){
	 	if(!object){
	 		throw "Invalid  Parameters";
	 	}else{
	 		var stringStament = "UPDATE "+ this.name+ " SET ";
	 		var counter=0;
	 		for(var temp in object) {
	 			if(object.hasOwnProperty(temp) && temp !== "id"){
	 				if(this.fields.hasOwnProperty(temp)){
	 					var field= this.fields[temp];
	 					if(!field.isAutoIncrement){
	 						stringStament += field.name + "=";
	 						if (field.type !== "number") {
	 							stringStament += "'" + object[temp] + "',";
	 						} else {
	 							if (!Number.isNaN(object[temp])) {
	 								stringStament += object[temp] + ",";
	 							} else {
	 								throw "UPDATE -> Cannot update " + object[temp] + " in " + temp;
	 							}	
	 						}		
	 					}else{
	 						console.warn("The field " + field.name + "is Auto Increment");
	 					}
	 				}
	 			}
	 		}
	 		if (stringStament.endsWith(",")) {
	 			stringStament = stringStament.slice(0, stringStament.length - 1);
	 		}
	 		if (object.where && Object.keys(object.where).length > 0) {
	 			stringStament += _parseWhere(object.where);
	 		} else if (object.fields.hasOwnProperty("id")) {
	 			stringStament += " WHERE ID = " + this.fields.id.name;
	 		}
	 		// console.log("@UPDATE_STATEMENT = ", stringStament);
	 		callDB(stringStament);
	 		return stringStament;
	 	}
	 };
	 
	 /**
	  * { function_description }
	  *
	  * @param      {JSON}	object  El objeto puedo contener la propiedad o where o simplemente el id
	  */
	  this.DELETE =function(object){
	  	var stringStament = "";
	  	if (!object) {
	  		stringStament = "DELETE * FROM " + this.name+";";
	  	} else {
	  		stringStament += "DELETE FROM "+ this.name;
	  		if (object.where && Object.keys(object.where).length >0){
	  			stringStament += _parseWhere(object.where);
	  		} else if (object.hasOwnProperty("id")) {
	  			stringStament += " WHERE ID = " + object.id;
	  		} else {
	  			throw "Cannot delete all the data";
	  		}
	  	}
	 	// console.log("@DELETE_STATEMENT = ", stringStament);
	 	callDB(stringStament);
	 	return stringStament;
	 }


	// if (!Array.isArray(definition.field)) {
	// 	throw "Invalid fields";
	// }

	
	this.name = definition.name;
	this.fields = {};
	var DBNames = [];
	for (var KEY in definition.fields) {
		if (definition.fields.hasOwnProperty(KEY)) {
			if (DBNames.indexOf(definition.fields[KEY].name) === -1) {
				this.fields[KEY] = new Field(definition.fields[KEY], this);
				DBNames.push(this.fields[KEY].name);
			} else {
				console.error("Duplicity fields");
			}
		}
	}
};
var Field = function (definition, table) {
	this.name = table.name + "." + definition.name;
	if (this.name.indexOf(" ") !== -1) {
		this.name = "[" + this.name + "]";
	}
	this.type = definition.type;
	this.dimension = definition.dimension;
	this.defaultValue = definition.defaultValue;
	this.options = definition.options;
	this.isAutoIncrement = definition.isAutoIncrement;
	this.isPrimaryKey = definition.isPrimaryKey;
	this.isForeignKey = definition.isForeignKey;
	this.hasNull = definition.hasNull === undefined ? true : definition.hasNull;
};


module.exports = table;
// var myTable = new table({
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
// var myHobbies = new table({
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
