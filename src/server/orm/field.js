var Field = function (definition) {
	if(!definition.hasOwnProperty("name") || !definition.hasOwnProperty("type")){
		throw "Invalid Parameters";		
	}	
	if(typeof(definition.name) !== "string"){
		throw "Invalid Name";
	}
	this.name = definition.name;
	if (this.name.indexOf(" ") !== -1) {
		this.name = "[" + this.name + "]";
	}
	this.type = definition.type;
	this.isAutoIncrement = definition.isAutoIncrement;
	if(definition.type == "string" || !definition.hasOwnProperty("isAutoIncrement")){
		this.isAutoIncrement = false;
	}	
	this.dimension = definition.dimension;
	if(!definition.hasOwnProperty("dimension")){
		this.dimension = 45;	
	}
	this.defaultValue = definition.defaultValue;
	this.options = JSON.parse(JSON.stringify(definition.options));
	if(!definition.hasOwnProperty("options")){
		this.options = null;
	}
	this.isPrimaryKey = definition.isPrimaryKey;
	this.isForeignKey = definition.isForeignKey;
	this.hasNull = definition.hasNull === undefined ? true : definition.hasNull;
}