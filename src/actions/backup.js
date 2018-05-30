module.exports = function(db, path) {
	let initialPath = path ? db.doc(path) : db
	return scavengeData(initialPath)
}

function scavengeData(doc) {
	return getCollectionsFromDocument(doc).then(collections => {
		let obj = {}

		return collections.length == 0
			? doc.get().then(result => result.data())
			: Promise.all(collections.map(collection =>
				getCollectionSubData(obj, doc, collection)
			)).then(() => obj)
	})
}

function getCollectionSubData(obj, doc, collection) {
	return getCollectionData(collection).then(colData => {
		obj[collection.id] = {}

		return Promise.all(colData.map(doc =>
			scavengeData(doc.ref).then(subData => {
				obj[collection.id][doc.id] = Object.assign(doc.data(), subData)
			})
		))
	})
}

function getCollectionsFromDocument(doc) {
	return doc.getCollections().then(data => formatData(data))
}

function getCollectionData(collection) {
	return collection.get().then(data => formatData(data))
}

function formatData(data) {
	let formated = []

	data.forEach(item => formated.push(item))
	return formated
}