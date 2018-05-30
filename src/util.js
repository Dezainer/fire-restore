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

exports.areObjectsEqual = function (obj1, obj2) {	
	for (var p in obj1) {		
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false
 
		switch (typeof (obj1[p])) {			
			case 'object':
				if (!module.exports.areObjectsEqual(obj1[p], obj2[p])) return false
				break			
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false
				break			
			default:
				if (obj1[p] != obj2[p]) return false
		}
	}
 	
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false
	}

	return true
}