const initialize = require('./src/initializer')
const ignite = require('./src/igniter')

const backup = require('./src/actions/backup')
const restore = require('./src/actions/restore')

let args = process.argv.slice(2), 
	settings, 
	firestore

try {
	settings = initialize(args)
} catch(err) {
	return console.log(err.message)
}

try {
	firestore = ignite(settings.credentialPath)
} catch(err) {
	return console.log(err.message)
}

console.log(firestore)