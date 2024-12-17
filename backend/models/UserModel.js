const Db = require('../config/Db')
const Rand = require('../helpers/Rand')
const DateTime = require('../helpers/DateTime')
const { isArr, isObj, isStr } = require('../helpers/IsType')
const { createHash } = require('crypto')


function getPasswordHash(password, passwordSalt){
	if(!isStr(password)) throw new Error('Invalid password input')
	return createHash('sha256').update(`password:${password};salt1:${passwordSalt};salt2:uL4QrJMKGRdd3fKRP5r4Zi4yQGMmLnD5`).digest('hex')
}
exports.getPasswordHash = getPasswordHash


async function getObject(rows){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const result = { object:'user', ...rows[0] }
	result.deleted = !!result.deleted
	return result
}
async function getObjects(rows){
	const result = []
	if(!isArr(rows)) throw new Error('Invalid rows')
	for(const row of rows) result.push(await getObject([row]))
	return result
}


exports.countByEmail = async email => {
	const sql = `SELECT COUNT(*) as count FROM user WHERE email=?`
	const bind = [email]

	const [rows] = await Db.execute(sql, bind)
	return Db.getCount(rows)
}
exports.countById = async id => {
	const sql = `SELECT COUNT(*) as count FROM user WHERE id=?`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return Db.getCount(rows)
}


exports.getAll = async id => {
	const sql = `SELECT * FROM user WHERE deleted=0 ORDER BY role asc, date_create asc`

	const [rows] = await Db.execute(sql)
	return await getObjects(rows)
}
exports.getByEmail = async email => {
	const sql = `SELECT * FROM user WHERE email=?`
	const bind = [email]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
const getById = async id => {
	const sql = `SELECT * FROM user WHERE id=?`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows)
}
exports.getById = getById


exports.new = async (firstName, lastName, patronymic, role, email, password) => {
	const now = new Date()
	const passwordSalt = Rand('base62', 16)
	const sql = `INSERT INTO user (date_create, first_name, last_name, patronymic, role, email, password, password_salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	const bind = [DateTime.formatted(now), firstName, lastName, patronymic, role, email, getPasswordHash(password, passwordSalt), passwordSalt]

	const id = Db.getInseretId(await Db.execute(sql, bind))
	return await getById(id)
}
exports.delete = async (id) => {
	let sql = `UPDATE user SET email=CONCAT('deleted:',email), deleted=1 WHERE id=?`
	let bind = [id]
	await Db.execute(sql, bind)

	sql = `DELETE FROM session WHERE user_id=?`
	bind = [id]
	await Db.execute(sql, bind)

	return true
}
exports.update = async (id, firstName, lastName, patronymic, role, email) => {
	const sql = `UPDATE user SET first_name=?, last_name=?, patronymic=?, role=?, email=? WHERE id=?`
	const bind = [firstName, lastName, patronymic, role, email, id]

	await Db.execute(sql, bind)
	return await getById(id)
}
exports.updatePassword = async (id, password) => {
	const passwordSalt = Rand('base62', 16)
	const sql = `UPDATE user SET password=?, password_salt=? WHERE id=?`
	const bind = [getPasswordHash(password, passwordSalt), passwordSalt, id]

	await Db.execute(sql, bind)
	return await getById(id)
}