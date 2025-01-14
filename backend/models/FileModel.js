const fs = require('fs')
const Db = require('../config/Db')
const Rand = require('../helpers/Rand')
const filesDir = `${__dirname}/../files`
const { isStr, isNum, isArr, isObj } = require('../helpers/IsType')


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const result = { object:'file', ...rows[0], url:`${process.env.NODE_COLOR_URL}/files/${rows[0].hash}/${rows[0].name}`, path:`${filesDir}/${rows[0].hash}` }
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


const getById = async id => {
	const sql = `SELECT * FROM file WHERE id=?`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.getById = getById

const getByHash = async hash => {
	const sql = `SELECT * FROM file WHERE hash=?`
	const bind = [hash]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.getByHash = getByHash


exports.upload = async file => {
	const hash = Rand('base62', 64)
	fs.copyFileSync(file.path, `${filesDir}/${hash}`)

	const sql = `INSERT INTO file(hash, name, size, mime) VALUES (?, ?, ?, ?)`
	const bind = [hash, isStr(file.originalname) ? file.originalname : '', isNum(file.size) && file.size > 0 ? file.size : 0, isStr(file.mimetype) ? file.mimetype : '']

	return Db.getInseretId(await Db.execute(sql, bind))
}