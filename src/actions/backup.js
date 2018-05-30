const Util = require('../util')

module.exports = function(db, path) {
	return path
		? Util.isPathDocOrCollection(db, path) == 'DOCUMENT'
			? scavengeDoc(db.doc(path))
			: scavengeCollection(db.collection(path))
		: scavengeDoc(db)
}

function scavengeDoc(doc) {
	return getDocumentCollections(doc).then(collections => {
		let obj = {}

		return collections.length == 0
			? doc.get().then(result => result.data())
			: Promise.all(collections.map(collection =>
				scavengeCollection(collection).then(subData => {
					obj[collection.id] = subData
				})
			)).then(() => obj)
	})
}

function getDocumentCollections(doc) {
	return doc.getCollections().then(data => Util.formatData(data))
}

function scavengeCollection(collection) {
	return getCollectionData(collection).then(colData => {
		let obj = {}

		return colData.length == 0
			? obj
			: Promise.all(colData.map(doc =>
				scavengeDoc(doc.ref).then(subData => {
					obj[doc.id] = arrangeDocData(doc.data(), subData)
				})
			)).then(() => obj)
	})
}

function arrangeDocData(data, subData) {
	let arranged = {}
	arranged.__FIELDS__ = data

	if(!Util.areObjectsEqual(data, subData))
		arranged.__COLLECTIONS__ = subData

	return arranged
}

function getCollectionData(collection) {
	return collection.get().then(data => Util.formatData(data))
}