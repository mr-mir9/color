module.exports = {
	apps: [{
		name: 'COLOR frontend',
		script: './frontend/server.js',
		autorestart: false
	}, {
		name: 'COLOR backend',
		script: './backend/server.js',
		autorestart: false,
		env: {
			'NODE_COLOR_URL': 'https://color.spbgty.ru'
		}
	}]
}