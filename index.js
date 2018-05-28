const initialize = require('./src/initializer')
const ignite = require('./src/igniter')
const write = require('./src/writer')

const backup = require('./src/actions/backup')
const restore = require('./src/actions/restore')

let args = process.argv.slice(2), 
	settings, 
	firestore

try {
	settings = initialize(args)
	logSuccess('INITIALIZATION')
} catch(err) {
	return logError('INITIALIZATION', err)
}

try {
	firestore = ignite(settings.credentialPath)
	logSuccess('CONNECTION')
} catch(err) {
	return logError('CONNECTION', err)
}

if(settings.action == 'BACKUP') {
	backup(firestore, settings.path)
		.then(result => {
			logSuccess('BACKUP')
			write(result, settings.outputPath)
				.then(msg => logSuccess('WRITING', msg))
				.catch(err => logError('WRITING', err))
		})
		.catch(err => logError('BACKUP', err))
}

function logSuccess(label, msg) {
	console.log('\x1b[32m', `- ${ label.toUpperCase() } SUCCEEDED`)
	msg && console.log(` - ${ msg }`)
	return console.log('\x1b[0m')
}

function logError(label, err) {
	console.log('\x1b[31m', `- ${ label.toUpperCase() } ERROR`)
	console.log(` - ${ err.message }`)
	return console.log('\x1b[0m')
}