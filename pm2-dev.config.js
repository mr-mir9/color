module.exports = {
	apps: [{
		name: 'COLOR-DEV frontend',
		script: './frontend/server.js',
		autorestart: false
	}, {
		name: 'COLOR-DEV backend',
		script: './backend/server.js',
		autorestart: false,
		env: {
			'NODE_COLOR_URL': 'http://localhost:35100'
		}
	}]
}