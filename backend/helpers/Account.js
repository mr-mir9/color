const Session = require('../models/SessionModel')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isStr } = require('./IsType')


exports.auth = async req => {
	if(!isObj(req)) throw new Error('Request not passed')

	const { headers } = req
	if(!isObj(headers)) throw new Error('Invalid headers object')
	
	const { authorization } = headers
	if(!isStr(authorization)) throw new InvalidDataException('Нет доступа')

	const parse = /^Bearer\s(.+)$/ig.exec(authorization)
	if(!parse) throw new InvalidDataException('Нет доступа')

	const token = parse[1]
	if(!isStr(token) || token.length !== 128) throw new InvalidDataException('Нет доступа')

	const session = await Session.getByToken(token)
	if(!session) throw new InvalidDataException('Нет доступа')
	return session.user
}