import { useMemo } from 'react'
import { useUser } from './User'
import { isObj, isStr, isNetInv, isNetInvFields } from '../helpers/IsType'
import { NetworkInvalidException, NetworkInvalidFieldsException } from '../helpers/Exceptions'
import axios from 'axios'


function getRoleName(role){
	const roles = {
		user: 'Инженер-технолог',
		admin: 'Администратор'
	}
	return roles[role] ?? 'Не указано'
}


function getUserName(user){
	const { first_name:firstName, last_name:lastName, patronymic } = user
	const result = []
	if(lastName.length) result.push(`${lastName[0].toUpperCase()}${lastName.toLowerCase().substr(1)}`)
	if(firstName.length) result.push(`${result.length === 1 ? ' ' : ''}${firstName[0].toUpperCase()}.`)
	if(patronymic.length) result.push(`${result.length === 1 ? ' ' : ''}${patronymic[0].toUpperCase()}.`)
	return result.length ? result.join('') : 'Не указано'
}


function parseNetworkError(e, fields, main){
	if(isNetInvFields(e)){
		const unprocessedFieldsMessages = []
		if(!isObj(e.fields)) e.fields = {}
		for(const fieldNameError in e.fields){
			let found = false
			for(const fieldNameSetter in fields){
				if(fieldNameSetter !== fieldNameError) continue;

				found = true
				fields[fieldNameSetter](e.fields[fieldNameError])
				break;
			}
			if(!found) unprocessedFieldsMessages.push(e.fields[fieldNameError])
		}
		if(unprocessedFieldsMessages.length) main(unprocessedFieldsMessages.join('. '))
		return;
	}
	if(isNetInv(e)) main(e.message)
}


function Api(bearer){

	const result = {}
	const baseURL = process.env.REACT_APP_API

	const Request = options => {
		if(!isObj(options)) options = {}
		let { method, url, data, headers, object, bearer } = options
		if(!isObj(headers)) headers = {}

		let resolve, reject
		const promise = new Promise((res, rej) => { resolve=res; reject=rej })

		if(!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) throw new Error('Invalid method')
		if(!isStr(url) || !url.length) throw new Error('URL not passed')
		if(isStr(bearer)) headers['Authorization'] = `Bearer ${bearer}`

		const request = { method, baseURL, url, timeout:10000 }
		if(isObj(headers)) request.headers = headers
		if(isObj(data)){
			if(method === 'GET') request.params = data
			else request.data = data
		}

		axios(request)
		.then(response => {
			if(!isObj(response) || !isObj(response.data) || response.data.status !== 'ok') reject(new NetworkInvalidException('Невалидный ответ от API2'))
			else if(isStr(object) && object.length && (!isObj(response.data.data) || response.data.data.object !== object)) reject(new NetworkInvalidException('Невалидный ответ от API1'))
			else resolve(response.data.data)
		})
		.catch(err => {
			if(isObj(err.response) && isObj(err.response.data)){
				const data = err.response.data
				if(data.status === 'error' && isStr(data.message)) reject(new NetworkInvalidException(data.message))
				else if(data.status === 'error' && isObj(data.fields)) reject(new NetworkInvalidFieldsException(data.fields))
				else reject(new NetworkInvalidException('Невалидный ответ от API'))
			}else reject(new NetworkInvalidException('Произошла ошибка при запросе к API'))
		})

		return promise
	}

	const Account = () => {
		const result = {}

		result.getSession = token => Request({ method:'GET', url:'/v1/session', data:{ token }, object:'session' })
		result.login = (email, password) => Request({ method:'POST', url:'/v1/session', data:{ email, password }, object:'session' })

		return result
	}
	result.Account = Account()

	const Admin = () => {
		const result = {}

		result.getUsers = () => Request({ method:'GET', url:'/v1/admin/account', bearer, object:'list' })
		result.createUser = (firstName, lastName, patronymic, role, email, password) => Request({ method:'POST', url:'/v1/admin/account', bearer, object:'user', data: { first_name:firstName, last_name:lastName, patronymic, role, email, password } })
		result.deleteUser = userId => Request({ method:'DELETE', url:`/v1/admin/account/${userId}`, bearer })
		result.updateUser = (userId, firstName, lastName, patronymic, role, email) => Request({ method:'PUT', url:`/v1/admin/account/${userId}`, bearer, object:'user', data: { first_name:firstName, last_name:lastName, patronymic, role, email } })
		result.updateUserPassword = (userId, password) => Request({ method:'PUT', url:`/v1/admin/account/${userId}/password`, bearer, object:'user', data: { password } })

		return result
	}
	result.Admin = Admin()

	return result
}

function useApi(){

	const userData = useUser()
	const api = useMemo(() => Api(isObj(userData) && isStr(userData.token) ? userData.token : null), [userData])
	return api

}


export { getRoleName, getUserName, parseNetworkError, useApi }