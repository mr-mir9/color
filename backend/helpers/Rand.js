const { isStr } = require('./IsType')


function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function Rand(alphabetName, length){

	const alphabets = {
		base62: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	}
	if(!isStr(alphabets[alphabetName])) throw new Error('Unsupported alphabet')
	const alphabet = alphabets[alphabetName]

	const result = []
	for(let i = 0; i < length; i++) result.push(alphabet[randomNumber(0,alphabet.length-1)])
	return result.join('')
}
module.exports = Rand