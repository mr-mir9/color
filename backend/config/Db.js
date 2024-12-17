const mysql = require('mysql2/promise')
const { isNum, isObj } = require('../helpers/IsType')


function getDb(){
	return mysql.createPool({
		host: '84.54.44.107',
		user: 'admin_color',
		password: 'bwT8H1zimIm9jj5cuEKf',
		database: 'db_color',

		charset: 'utf8mb4_general_ci',
		connectionLimit: 50,
		queueLimit: 100,
		dateStrings: true
	})
}
const Db = getDb()


Db.getCount = rows => {
	if(!rows.length) throw new Error('Invalid count rows')
	if(!isObj(rows[0])) throw new Error('Invalid row object')
	if(!isNum(rows[0].count)) throw new Error('Invalid count number')
	return rows[0].count
}


Db.getInseretId = data => {
	if(!data.length) throw new Error('Invalid DB count responses')
	if(!isObj(data[0]) || data[0].constructor.name !== 'ResultSetHeader') throw new Error('Invalid DB result header response')
	if(!isNum(data[0].insertId)) throw new Error('Invalid DB insert id response')
	return data[0].insertId
}


module.exports = Db