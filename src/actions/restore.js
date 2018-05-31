const Util = require('../helpers/util')
const Batch = require('../helpers/batch')

module.exports = function(db, path, obj) {
	Batch.start(db)

	path
		? Util.isPathDocOrCollection(db, path) == 'DOCUMENT'
			? populateDoc(db.doc(path), obj)
			: populateCollection(db.collection(path), obj)
		: populateDoc(db, obj)

	return Batch.commit()
}

function populateDoc(ref, doc) {
	if(doc.__FIELDS__)
		Batch.set(ref, doc.__FIELDS__)

	if(doc.__COLLECTIONS__)
		Util.mapObject(doc.__COLLECTIONS__, (collection, colKey) => {
			populateCollection(ref.collection(colKey), collection)
		})
}

function populateCollection(ref, collection) {
	Util.mapObject(collection, (doc, docKey) => {
		populateDoc(ref.doc(docKey), doc)
	})
}