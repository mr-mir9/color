const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isStr } = require('../helpers/IsType')


module.exports = (req, res, next) => {
	res.ok = data => res.status(200).json({ status:'ok', data })
	res.err = e => {
		let status = 500
		let response = { status:'error' }

		if(isObj(e) && e.constructor === InvalidFieldsException){
			status = 400
			response.fields = e.fields
		} else if(isObj(e) && e.constructor === InvalidDataException){
			status = 400
			response.message = e.message
		} else{
			response.message = 'Server Error'
			console.dir(e)
		}

		res.status(status).json(response)
	}
	next()
}