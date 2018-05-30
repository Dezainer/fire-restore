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