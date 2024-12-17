import { NetworkInvalidException, NetworkInvalidFieldsException } from './Exceptions'


function isFunc(arg){
	return typeof arg === 'function'
}
function isObj(arg){
	return arg && typeof arg === 'object'
}
function isArr(arg){
	return isObj(arg) && arg.constructor === Array
}
function ofArr(arg){
	return isArr(arg) ? arg : []
}
function isStr(arg){
	return typeof arg === 'string'
}
function isNum(arg){
	return typeof arg === 'number'
}
function isPromise(arg){
	return isObj(arg) && arg.constructor === Promise
}


function isNetInv(arg){
	return isObj(arg) && arg.constructor === NetworkInvalidException
}
function isNetInvFields(arg){
	return isObj(arg) && arg.constructor === NetworkInvalidFieldsException
}


export {
	isFunc,
	isObj,
	isArr,
	ofArr,
	isStr,
	isNum,
	isPromise,

	isNetInv,
	isNetInvFields
}