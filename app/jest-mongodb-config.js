module.exports = {
	mongodbMemoryServerOptions: {
		binary: {
			version: 'latest',
			skipMD5: true
		},
		instance: {
			dbName: 'nodec_test'
		},
		autoStart: false
	}
};