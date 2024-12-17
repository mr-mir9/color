import { isNum, isStr } from './IsType'


const getCookie = name => {
	const result = {}
	let cookies = document.cookie
	if(cookies.trim() === '') cookies = []
	else cookies = cookies.split(';')
	for(let cookie of cookies){
		cookie = cookie.split('=')
		result[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim())
	}
	return isStr(result[name]) ? result[name] : ''
}


const setCookie = (name, value, maxAge=31622400, path='/') => {
	const body = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]
	if(isNum(maxAge)) body.push(`max-age=${maxAge}`)
	if(isStr(path)) body.push(`path=${path}`)
	document.cookie = body.join('; ')
}


const deleteCookie = name => {
	document.cookie = `${name}=; max-age=-1`
}


export { getCookie, setCookie, deleteCookie }