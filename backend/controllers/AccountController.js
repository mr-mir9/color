const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const File = require('../models/FileModel')
const Account = require('../helpers/Account')
const Validators = require('../helpers/Validators')
const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isArr, isStr } = require('../helpers/IsType')


exports.update = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)

		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.params)) throw new Error('Invalid request params object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		const data = { errors:{}, body:req.body }
		await Validators.firstName(data)
		await Validators.lastName(data)
		await Validators.patronymic(data)
		await Validators.email(data, user.email)
		if(Object.keys(data.errors).length) throw new InvalidFieldsException(data.errors)

		const { body } = data
		res.ok(await User.update(user.id, body.first_name, body.last_name, body.patronymic, body.email))
	}catch(e){
		res.err(e)
	}
})


exports.updatePassword = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)

		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.params)) throw new Error('Invalid request params object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		if(user.password !== User.getPasswordHash(req.body.now_password, user.password_salt)) throw new InvalidFieldsException({ now_password:'Неверный пароль' })

		const data = { errors:{}, body:req.body }
		await Validators.newPassword(data)
		if(Object.keys(data.errors).length) throw new InvalidFieldsException(data.errors)

		const { body } = data
		await User.updatePassword(user.id, body.new_password)
		res.ok(null)
	}catch(e){
		res.err(e)
	}
})


exports.set2FA = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)

		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.params)) throw new Error('Invalid request params object')
		if(!isObj(req.body)) throw new Error('Invalid request body object')

		const body = req.body
		if(body.type !== 'image') throw new InvalidDataException('Поддерживается только двухфакторная авторизация по картинке')

		const image = req.file
		if(!isObj(image)) throw new InvalidDataException('Загрузите картинку')
		if(!['image/webp', 'image/png', 'image/jpeg', 'image/bmp'].includes(image.mimetype)) throw new InvalidDataException('Изображение должно быть JPG, JPEG, PNG, WEBP или BMP')
		if(image.size > 10000000) throw new Error('Максимальный размер файла 10 Мб')

		if(!/^[0-9]{1,2}$/.test(body.inaccuracy)) throw new InvalidDataException('Введите погрешность от 1% до 15%')
		else{
			body.inaccuracy = parseInt(body.inaccuracy)
			if(body.inaccuracy < 1 || body.inaccuracy > 15) throw new InvalidDataException('Введите погрешность от 1% до 15%')
		}

		if(!isArr(body.dots) || !body.dots.length) throw new InvalidDataException('Укажите минимум 1 точку на картинке')
		for(const index in body.dots){
			const dot = body.dots[index]
			if(!/^[0-1]{1}(\.[0-9]+)?,[0-1]{1}(\.[0-9]+)?$/.test(dot)) throw new InvalidDataException(`Невалидные координаты точки с индексом ${index}`)
		}

		
		const imageFileId = await File.upload(image)
		res.ok(await User.update2FA(user.id, imageFileId, body.inaccuracy, body.dots.join('|'), body.dots.length))
	}catch(e){
		res.err(e)
	}
})


exports.remove2FA = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)

		if(!isObj(req)) throw new Error('Invalid request object')
		if(!isObj(req.params)) throw new Error('Invalid request params object')
		if(!isObj(req.query)) throw new Error('Invalid request query object')
		
		const { password } = req.query


		const errors = {}

		if(!isStr(password) || !password.length) errors.password = 'Введите пароль'
		else if(user.password !== User.getPasswordHash(password, user.password_salt)) errors.password = 'Неверный пароль'

		if(Object.keys(errors).length) throw new InvalidFieldsException(errors)

		
		res.ok(await User.remove2FA(user.id))
	}catch(e){
		res.err(e)
	}
})