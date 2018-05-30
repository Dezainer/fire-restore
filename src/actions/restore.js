const Util = require('../util')
var batch

module.exports = function(db, path, obj) {
	batch = db.batch()
}

function populateDoc(ref, obj) {
	Util.mapObject(obj, collection => {
		populateCollection(collection)
	})
}

function populateCollection(ref, obj) {
	
}