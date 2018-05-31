const Util = require('../helpers/util')

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

		return getDocumentData(doc).then(data => {
			if(data) obj.__FIELDS__ = data
		}).then(() =>
			getDocumentCollectionsData(collections).then((data) => {
				if(data) obj.__COLLECTIONS__ = data
			})
		).then(() => obj)
	})
}

function getDocumentCollections(doc) {
	return doc.getCollections().then(data => Util.formatData(data))
}

function getDocumentData(doc) {
	return new Promise((resolve, reject) => {
		doc.get
			? doc.get().then(result => resolve(result.data()))
			: resolve()
	})
}

function getDocumentCollectionsData(collections, callback) {
	return new Promise((resolve, reject) => {
		let obj = {}

		collections.length == 0
			? resolve()
			: Promise.all(collections.map(collection =>
				scavengeCollection(collection).then(subData => {
					obj[collection.id] = subData
				})
			)).then(() => resolve(obj))
	})
}

function scavengeCollection(collection) {
	return getCollectionData(collection).then(colData => {
		let obj = {}

		return colData.length == 0
			? obj
			: Promise.all(colData.map(doc =>
				scavengeDoc(doc.ref).then(subData => {
					obj[doc.id] = subData
				})
			)).then(() => obj)
	})
}

function getCollectionData(collection) {
	return collection.get().then(data => Util.formatData(data))
}