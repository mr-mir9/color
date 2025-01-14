const asyncHandler = require('express-async-handler')
const Account = require('../helpers/Account')
const User = require('../models/UserModel')
const InvalidFieldsException = require('../exceptions/InvalidFieldsException')
const InvalidDataException = require('../exceptions/InvalidDataException')
const { isObj, isStr } = require('../helpers/IsType')


exports.getAll = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)
		if(user.role !== 'admin') throw new InvalidDataException('У вас нет прав')

		res.ok({ object:'list', list:await User.getAll() })
	}catch(e){
		res.err(e)
	}
})


async function validate(req, nowEmail=null){
	if(!isObj(req)) throw new Error('Invalid request object')
	if(!isObj(req.body)) throw new Error('Invalid request body object')
	const data = req.body
	const errors = {}

	if(!isStr(data.first_name)) errors.first_name = 'Имя является обязательным'
	else{
		data.first_name = data.first_name.trim()
		if(!data.first_name.length) errors.first_name = 'Имя является обязательным'
		else if(data.first_name.length > 64) errors.first_name = 'Максимальная длина имени 64 символа'
		else if(!/^[а-я\s]+$/i.test(data.first_name)) errors.first_name = 'В имени можно использовать только русские буквы'
	}

	if(!isStr(data.last_name)) errors.last_name = 'Фамилия является обязательной'
	else{
		data.last_name = data.last_name.trim()
		if(!data.last_name.length) errors.last_name = 'Фамилия является обязательной'
		else if(data.last_name.length > 64) errors.last_name = 'Максимальная длина фамилии 64 символа'
		else if(!/^[а-я\s]+$/i.test(data.last_name)) errors.last_name = 'В фамилии можно использовать только русские буквы'
	}

	if(isStr(data.patronymic)){
		data.patronymic = data.patronymic.trim()
		if(data.patronymic.length){
			if(data.patronymic.length > 64) errors.patronymic = 'Максимальная длина отчества 64 символа'
			else if(!/^[а-я\s]+$/i.test(data.patronymic)) errors.patronymic = 'В отчестве можно использовать только русские буквы'
		}
	}else data.patronymic = ''

	if(!isStr(data.role) || !['admin', 'user'].includes(data.role)) errors.role = 'Укажите роль пользователя'

	if(!isStr(data.email)) errors.email = 'Адрес электронной почты является обязательным'
	else{
		data.email = data.email.trim()
		if(!data.email.length) errors.email = 'Адрес электронной почты является обязательным'
		else if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)) errors.email = 'Введите валидный адрес электронной почты'
		else if(nowEmail !== data.email && await User.countByEmail(data.email) > 0) errors.email = 'Такой адрес электронной почты уже зарегистрирован'
	}

	return errors
}
async function validatePassword(req){
	if(!isObj(req)) throw new Error('Invalid request object')
	if(!isObj(req.body)) throw new Error('Invalid request body object')
	const data = req.body
	const errors = {}

	if(!isStr(data.password)) errors.password = 'Введите пароль'
	else if(data.password.length < 5) errors.password = 'Минимальная длина пароля 5 символов'

	return errors
}

exports.new = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)
		if(user.role !== 'admin') throw new InvalidDataException('У вас нет прав')

		const errors = {...(await validate(req, null)), ...(await validatePassword(req))}
		if(Object.keys(errors).length) throw new InvalidFieldsException(errors)

		const { first_name:firstName, last_name:lastName, patronymic, role, email, password } = req.body
		res.ok(await User.new(firstName, lastName, patronymic, role, email, password))
	}catch(e){
		res.err(e)
	}
})

exports.update = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)
		if(user.role !== 'admin') throw new InvalidDataException('У вас нет прав')

		if(!isObj(req.params)) throw new Error('Invalid params')

		const { userId } = req.params
		if(!isStr(userId) || !userId.length) throw new InvalidDataException('ID пользователя не указан')

		const updateUser = await User.getById(userId)
		if(!updateUser) throw new InvalidDataException('Пользователь не существует')

		const errors = await validate(req, updateUser.email)
		if(Object.keys(errors).length) throw new InvalidFieldsException(errors)

		const { first_name:firstName, last_name:lastName, patronymic, role, email } = req.body
		res.ok(await User.updateAdmin(userId, firstName, lastName, patronymic, role, email))
	}catch(e){
		res.err(e)
	}
})
exports.updatePassword = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)
		if(user.role !== 'admin') throw new InvalidDataException('У вас нет прав')

		if(!isObj(req.params)) throw new Error('Invalid params')

		const { userId } = req.params
		if(!isStr(userId) || !userId.length) throw new InvalidDataException('ID пользователя не указан')

		const updateUser = await User.getById(userId)
		if(!updateUser) throw new InvalidDataException('Пользователь не существует')

		const errors = await validatePassword(req)
		if(Object.keys(errors).length) throw new InvalidFieldsException(errors)

		const { password } = req.body
		res.ok(await User.updatePassword(userId, password))
	}catch(e){
		res.err(e)
	}
})

exports.delete = asyncHandler(async (req, res) => {
	try{
		const user = await Account.auth(req)
		if(user.role !== 'admin') throw new InvalidDataException('У вас нет прав')

		if(!isObj(req.params)) throw new Error('Invalid params')

		const { userId } = req.params
		if(!isStr(userId) || !userId.length) throw new InvalidDataException('ID пользователя не указан')

		const deleteUser = await User.getById(userId)
		if(!deleteUser) throw new InvalidDataException('Пользователь не существует')

		await User.delete(userId)
		res.ok(null)
	}catch(e){
		res.err(e)
	}
})