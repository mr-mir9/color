const User = require('../models/UserModel')
const { isStr } = require('./IsType')


exports.firstName = data => {
	const { errors, body } = data

	if(!isStr(body.first_name)) errors.first_name = 'Имя является обязательным'
	else{
		body.first_name = body.first_name.trim().replace(/\s+/g, ' ')
		if(!body.first_name.length) errors.first_name = 'Имя является обязательным'
		else if(body.first_name.length > 64) errors.first_name = 'Максимальная длина имени 64 символа'
		else if(!/^[а-я\s]+$/i.test(body.first_name)) errors.first_name = 'В имени можно использовать только русские буквы'
	}
}

exports.lastName = data => {
	const { errors, body } = data

	if(!isStr(body.last_name)) errors.last_name = 'Фамилия является обязательной'
	else{
		body.last_name = body.last_name.trim().replace(/\s+/g, ' ')
		if(!body.last_name.length) errors.last_name = 'Фамилия является обязательной'
		else if(body.last_name.length > 64) errors.last_name = 'Максимальная длина фамилии 64 символа'
		else if(!/^[а-я\s]+$/i.test(body.last_name)) errors.last_name = 'В фамилии можно использовать только русские буквы'
	}
}

exports.patronymic = data => {
	const { errors, body } = data

	if(isStr(body.patronymic)){
		body.patronymic = body.patronymic.trim().replace(/\s+/g, ' ')
		if(body.patronymic.length){
			if(body.patronymic.length > 64) errors.patronymic = 'Максимальная длина отчества 64 символа'
			else if(!/^[а-я\s]+$/i.test(body.patronymic)) errors.patronymic = 'В отчестве можно использовать только русские буквы'
		}
	}else body.patronymic = ''
}

exports.email = async (data, nowEmail) => {
	const { errors, body } = data

	if(!isStr(body.email)) errors.email = 'Адрес электронной почты является обязательным'
	else{
		body.email = body.email.trim().replace(/\s+/g, ' ')
		if(!body.email.length) errors.email = 'Адрес электронной почты является обязательным'
		else if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email)) errors.email = 'Введите валидный адрес электронной почты'
		else if(nowEmail !== body.email && await User.countByEmail(body.email) > 0) errors.email = 'Такой адрес электронной почты уже зарегистрирован'
	}
}

exports.newPassword = data => {
	const { errors, body } = data

	if(!isStr(body.new_password)) errors.new_password = 'Введите пароль'
	else if(body.new_password.length < 5) errors.new_password = 'Минимальная длина пароля 5 символов'
	else if(body.new_password === body.now_password) errors.new_password = 'Пароль должен отличаться от старого'
}