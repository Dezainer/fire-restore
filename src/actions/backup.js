module.exports = function(db, path) {
	let initialPath = path ? db.doc(path) : db
	return scavengeDoc(initialPath)
}

function scavengeDoc(doc) {
	return getCollectionsFromDocument(doc).then(collections => {
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

function getCollectionsFromDocument(doc) {
	return doc.getCollections().then(data => formatData(data))
}

function scavengeCollection(collection) {
	return getCollectionData(collection).then(colData => {
		let obj = {}

		return colData.length == 0
			? obj
			: Promise.all(colData.map(doc =>
				scavengeDoc(doc.ref).then(subData => {
					obj[doc.id] = Object.assign(doc.data(), subData)
				})
			)).then(() => obj)
	})
}

function getCollectionData(collection) {
	return collection.get().then(data => formatData(data))
}

function formatData(data) {
	let formated = []

	data.forEach(item => formated.push(item))
	return formated
}