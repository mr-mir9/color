const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const Session = require('../models/SessionModel')
const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isStr } = require('../helpers/IsType')


exports.login = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		let { email, password } = req.body
		let user = null


		const errors = {}

		if(!isStr(email)) errors.email = 'Введите адрес электронной почты'
		else{
			email = email.trim()
			if(!email.length) errors.email = 'Введите адрес электронной почты'
			else{
				user = await User.getByEmail(email)
				if(!user) errors.email = 'Пользователь с такой электронной почтой не найден'
				else if(user.deleted) errors.email = 'Такого аккаунта не существует'
			}
		}

		if(!isStr(password) || !password.length) errors.password = 'Введите пароль'
		else if(!user) errors.password = 'Неверный пароль'
		else if(user.password !== User.getPasswordHash(password, user.password_salt)) errors.password = 'Неверный пароль'

		if(Object.keys(errors).length) throw new InvalidFieldsException(errors)


		res.ok(await Session.new(user.id))
	}catch(e){
		res.err(e)
	}
})


exports.get = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req.query)) throw new InvalidDataException('Токен не указан')

		const { token } = req.query
		if(!isStr(token) || token.length !== 128) throw new InvalidDataException('Сессия истекла')

		const session = await Session.getByToken(token)
		if(!session) throw new InvalidDataException('Сессия истекла')

		res.ok(session)
	}catch(e){
		res.err(e)
	}
})