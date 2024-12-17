class NetworkInvalidException extends Error{}


class NetworkInvalidFieldsException extends Error{
	constructor(fields){
		super('Invalid fields')
		this.fields = fields
	}
}


export { NetworkInvalidException, NetworkInvalidFieldsException }