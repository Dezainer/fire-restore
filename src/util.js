exports.isPathDocOrCollection = function(db, path) {
	if(!path) return null
	let type = 'DOCUMENT'

	try {
		db.doc(path)
	} catch(err) {
		type = 'COLLECTION'
	}

	return type
}

exports.formatData = function(data) {
	let formated = []

	data.forEach(item => formated.push(item))
	return formated
}

exports.logSuccess = function(label, msg) {
	console.log('\x1b[32m', `- ${ label.toUpperCase() } SUCCEEDED`)
	msg && console.log(`\x1b[33m - ${ msg }`)
	return console.log('\x1b[0m')
}

exports.logError = function(label, err) {
	console.log('\x1b[31m', `- ${ label.toUpperCase() } FAILED`)
	console.log(` - ${ err }`)
	return console.log('\x1b[0m')
}

exports.mapObject = function(obj, callback) {
	Object.keys(obj).map((item, key) => callback(item, key))
}