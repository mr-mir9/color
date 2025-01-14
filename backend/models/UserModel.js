const Db = require('../config/Db')
const Rand = require('../helpers/Rand')
const DateTime = require('../helpers/DateTime')
const File = require('./FileModel')
const { isArr, isObj, isStr } = require('../helpers/IsType')
const { createHash } = require('crypto')


function getPasswordHash(password, passwordSalt){
	if(!isStr(password)) throw new Error('Invalid password input')
	return createHash('sha256').update(`password:${password};salt1:${passwordSalt};salt2:uL4QrJMKGRdd3fKRP5r4Zi4yQGMmLnD5`).digest('hex')
}
exports.getPasswordHash = getPasswordHash


async function getObject(rows, type=null){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const row = rows[0]

	if(type === 'public'){
		const { id, date_create, email, first_name, last_name, patronymic, role } = row
		const twoFA = row['2fa']
		const twoFAImage = row['2fa_image_file']
		const twoFAImageDots = row['2fa_image_dots_count']

		const result = { object:'user', id, date_create, email, first_name, last_name, patronymic, role }

		if(twoFA === 'image'){
			result['2fa'] = { enabled:true, type:'image', dots:twoFAImageDots }
			const file = await File.getById(twoFAImage)
			result['2fa'].image = file.url
		}else result['2fa'] = { enabled:false }

		return result
	}

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
const getById = async (id, type=null) => {
	const sql = `SELECT * FROM user WHERE id=? AND deleted=0`
	const bind = [id]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows, type)
}
exports.getById = getById


exports.new = async (firstName, lastName, patronymic, role, email, password) => {
	const now = new Date()
	const passwordSalt = Rand('base62', 16)
	const sql = `INSERT INTO user (date_create, first_name, last_name, patronymic, role, email, password, password_salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	const bind = [DateTime.formatted(now), firstName, lastName, patronymic, role, email, getPasswordHash(password, passwordSalt), passwordSalt]

	const id = Db.getInseretId(await Db.execute(sql, bind))
	return await getById(id, 'public')
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
exports.update = async (id, firstName, lastName, patronymic, email) => {
	const sql = `UPDATE user SET first_name=?, last_name=?, patronymic=?, email=? WHERE id=?`
	const bind = [firstName, lastName, patronymic, email, id]

	await Db.execute(sql, bind)
	return await getById(id, 'public')
}
exports.updateAdmin = async (id, firstName, lastName, patronymic, role, email) => {
	const sql = `UPDATE user SET first_name=?, last_name=?, patronymic=?, role=?, email=? WHERE id=?`
	const bind = [firstName, lastName, patronymic, role, email, id]

	await Db.execute(sql, bind)
	return await getById(id, 'public')
}
exports.updatePassword = async (id, password) => {
	const passwordSalt = Rand('base62', 16)
	const sql = `UPDATE user SET password=?, password_salt=? WHERE id=?`
	const bind = [getPasswordHash(password, passwordSalt), passwordSalt, id]

	await Db.execute(sql, bind)
	return await getById(id, 'public')
}


exports.update2FA = async (id, imageId, inaccuracy, dots, countDots) => {
	const sql = `UPDATE user SET 2fa='image', 2fa_image_file=?, 2fa_image_inaccuracy=?, 2fa_image_dots=?, 2fa_image_dots_count=? WHERE id=?`
	const bind = [imageId, inaccuracy, dots, countDots, id]

	await Db.execute(sql, bind)
	return await getById(id, 'public')
}
exports.remove2FA = async (id) => {
	const sql = `UPDATE user SET 2fa='none' WHERE id=?`
	const bind = [id]

	await Db.execute(sql, bind)
	return await getById(id, 'public')
}