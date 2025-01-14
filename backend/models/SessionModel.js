const Db = require('../config/Db')
const User = require('./UserModel')
const Rand = require('../helpers/Rand')
const DateTime = require('../helpers/DateTime')
const { isArr, isObj, isNum } = require('../helpers/IsType')


async function getObject(rows, type=null){
	if(!isArr(rows)) throw new Error('Invalid rows')
	if(!rows.length) return false

	if(!isObj(rows[0])) throw new Error('Invalid row object')
	const result = { object:'session', ...rows[0] }
	result.user = await User.getById(result.user_id, type)
	delete result.user_id
	return result
}


const getByToken = async (token, type=null) => {
	const sql = `SELECT * FROM session WHERE token=?`
	const bind = [token]

	const [rows] = await Db.execute(sql, bind)
	return await getObject(rows, type)
}
exports.getByToken = getByToken


exports.new = async userId => {
	const now = new Date()
	const afterWeek = new Date()
	afterWeek.setDate(afterWeek.getDate()+7)

	const token = Rand('base62', 128)
	const sql = `INSERT INTO session (token, user_id, date_create, date_expire) VALUES (?, ?, ?, ?)`
	const bind = [token, userId, DateTime.formatted(now), DateTime.formatted(afterWeek)]

	const data = await Db.execute(sql, bind)
	return await getByToken(token, 'public')
}