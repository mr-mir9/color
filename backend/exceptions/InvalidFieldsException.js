class InvalidFieldsException extends Error{

	constructor(fields){
		super()
		this.fields = fields
	}

}
module.exports = InvalidFieldsException