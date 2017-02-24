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
	  name: "ID",
	  type: "int",
	  dimension: 2
 		
 	}
 }
})