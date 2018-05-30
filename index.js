const initialize = require('./src/initializer')
const ignite = require('./src/igniter')
const write = require('./src/writer')
const Util = require('./src/util')

const backup = require('./src/actions/backup')
const restore = require('./src/actions/restore')

let args = process.argv.slice(2), settings, firestore

try {
	settings = initialize(args)
	Util.logSuccess('INITIALIZATION')
} catch(err) {
	return Util.logError('INITIALIZATION', err)
}

try {
	let fire = ignite(settings.credentialPath)
	firestore = fire.connection

	Util.logSuccess('CONNECTION', `Connected on: ${ fire.project }`)
} catch(err) {
	return Util.logError('CONNECTION', err)
}

if(settings.action == 'BACKUP')
	backup(firestore, settings.path)
		.then(result => {
			Util.logSuccess('BACKUP')
			write(result, settings.outputPath)
				.then(msg => Util.logSuccess('WRITING', msg))
				.catch(err => Util.logError('WRITING', err))
		})
		.catch(err => Util.logError('BACKUP', err))

if(settings.action == 'RESTORE') {
	try {
		let backup = require(settings.outputPath)
	} catch(err) {
		return Util.logError('READING', err)
	}

	restore(firestore, settings.path, backup)
		.then(msg => Util.logSuccess('RESTORE', msg))
		.catch(err => Util.logError('RESTORE', err))
}