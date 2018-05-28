const initialize = require('./src/initializer')
const backup = require('./src/actions/backup')
const restore = require('./src/actions/restore')

let args = process.argv.slice(2), settings

try {
	settings = initialize(args)
} catch(err) {
	console.log(err.message)
}

console.log(settings)