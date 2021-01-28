module.exports = {
	mongodbMemoryServerOptions: {
		binary: {
			version: '4.0.5',
			skipMD5: true
		},
		instance: {
			dbName: 'nodec_test'
		},
		autoStart: false
	}
};