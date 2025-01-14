const fs = require('fs')
const asyncHandler = require('express-async-handler')
const File = require('../models/FileModel')
const { isStr } = require('../helpers/IsType')


exports.get = asyncHandler(async (req, res) => {
	try{
		const path = req.params[0]
		if(!isStr(path) || !path.length) throw new Error('Неверный путь к файлу')
		
		let [hash, name] = path.split('/')
		if(!isStr(hash)) hash = ''
		if(!isStr(name)) name = ''

		const file = await File.getByHash(hash)
		if(!file) throw new Error('Файл не найден')
		
		try{
			const stat = fs.statSync(file.path)
			res.status(200)
			res.setHeader('Content-Type', file.mime)
			res.setHeader('Content-Length', stat.size)

			const filestream = fs.createReadStream(file.path)
			filestream.pipe(res)
		}catch(e){ throw new Error('Файл не найден на сервере') }
		
	}catch(e){
		res.status(404).send(e.message)
	}
})