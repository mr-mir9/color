import { isStr } from './IsType'


function required(trim=false){
	return value => {
		if(!isStr(value)) return false
		if(trim) value = value.trim()
		return value.length > 0
	}
}

function minLength(length, trim=false){
	return value => {
		if(!isStr(value)) return false
		if(trim) value = value.trim()
		return value.length >= length
	}
}

function email(value){
	if(!isStr(value)) return false
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
}


const Validators = { required, minLength, email }
export default Validators