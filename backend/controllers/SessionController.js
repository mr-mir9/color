const asyncHandler = require('express-async-handler')
const File = require('../models/FileModel')
const User = require('../models/UserModel')
const Session = require('../models/SessionModel')
const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isStr, isArr } = require('../helpers/IsType')


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


		if(user['2fa'] === 'image'){
			if(isArr(req.body['2fa_image_dots'])){
				const dots = req.body['2fa_image_dots']

				const inaccuracy = user['2fa_image_inaccuracy'] / 200
				const realDots = user['2fa_image_dots'].split('|')
				
				if(realDots.length !== dots.length) throw new InvalidDataException('Неверный графический ключ')
				for(const index in realDots){
					const realDot = realDots[index]
					let [realX, realY] = realDot.split(',')
					realX = parseFloat(realX)
					realY = parseFloat(realY)
					if(!isFinite(realX) || !isFinite(realY)) throw new InvalidDataException('Данные повреждены')
					
					let [x, y] = dots[index].split(',')
					x = parseFloat(x)
					y = parseFloat(y)
					if(!isFinite(x) || !isFinite(y)) throw new InvalidDataException('Неверный формат точки')

					const fromX = realX - inaccuracy
					const toX = realX + inaccuracy

					const fromY = realY - inaccuracy
					const toY = realY + inaccuracy

					console.log(`x:${x} (${fromX} - ${toX}), y:${y} (${fromY} (${y < fromY}) - ${toY} (${y > toY}))`)
					if(x < fromX || x > toX) throw new InvalidDataException('Неверный графический ключ')
					if(y < fromY || y > toY) throw new InvalidDataException('Неверный графический ключ')
				}

				res.ok(await Session.new(user.id))
			}else{
				const file = await File.getById(user['2fa_image_file'])
				res.ok({ object:'action', action:'2fa', '2fa':{ type:'image', image:file.url } })
			}
		}else res.ok(await Session.new(user.id))

	}catch(e){
		res.err(e)
	}
})


exports.get = asyncHandler(async (req, res) => {
	try{
		if(!isObj(req.query)) throw new InvalidDataException('Токен не указан')

		const { token } = req.query
		if(!isStr(token) || token.length !== 128) throw new InvalidDataException('Сессия истекла')

		const session = await Session.getByToken(token, 'public')
		if(!session) throw new InvalidDataException('Сессия истекла')

		res.ok(session)
	}catch(e){
		res.err(e)
	}
})