const Util = require('../helpers/util')

module.exports = function(db, path) {
	return path
		? Util.isPathDocOrCollection(db, path) == 'DOCUMENT'
			? scavengeDoc(db.doc(path))
			: scavengeCollection(db.collection(path))
		: scavengeDoc(db)
}

function scavengeDoc(doc, fieldsData) {
	return getDocumentCollections(doc).then(collections => {
		let obj = {}

		return getDocumentCollectionsData(collections).then((data) => {
			if(data) obj.__COLLECTIONS__ = data
		}).then(() => 
			getDocumentData(doc, fieldsData).then(data => {
				if(data) obj.__FIELDS__ = data
			})
		).then(() => obj)
	})
}

function getDocumentCollections(doc) {
	return doc.getCollections().then(data => Util.formatData(data))
}

function getDocumentCollectionsData(collections, callback) {
	let obj = {}

	return collections.length == 0
		? new Promise((resolve, reject) => resolve())
		: Promise.all(collections.map(collection =>
			scavengeCollection(collection).then(subData => {
				obj[collection.id] = subData
			})
		)).then(() => obj)
}

function getDocumentData(doc, data) {
	return data 
		? new Promise((resolve, reject) => resolve(data))
		: doc.get
			? doc.get().then(result => result.data())
			: new Promise((resolve, reject) => resolve())
}

function scavengeCollection(collection) {
	return getCollectionData(collection).then(colData => {
		let obj = {}

		return colData.length == 0
			? obj
			: Promise.all(colData.map(doc =>
				scavengeDoc(doc.ref, doc.data()).then(subData => {
					obj[doc.id] = subData
				})
			)).then(() => obj)
	})
}

function getCollectionData(collection) {
	return collection.get().then(data => Util.formatData(data))
}