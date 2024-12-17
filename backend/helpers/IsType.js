function isFunc(arg){
	return typeof arg === 'function'
}
function isObj(arg){
	return arg && typeof arg === 'object'
}
function isArr(arg){
	return isObj(arg) && arg.constructor.name === 'Array'
}
function isStr(arg){
	return typeof arg === 'string'
}
function isNum(arg){
	return typeof arg === 'number'
}


function isModal(arg){
	return isObj(arg) && arg.type === 'Modal'
}


export {
	isFunc,
	isObj,
	isArr,
	isStr,
	isNum,

	isModal
}