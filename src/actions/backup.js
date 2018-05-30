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
				getCollectionData(collection.ref).then(colData => {
					obj[collection.name] = {}

					return Promise.all(colData.map(doc =>
						scavengeData(doc.ref).then(subData => {
							obj[collection.name][doc.key] = Object.assign(doc.data, subData)
						})
					))
				})
			)).then(() => obj)
	})
}

function getCollectionsFromDocument(doc) {
	return doc.getCollections().then(result => {
		let collections = []

		result.map(item => collections.push({
			name: item.id,
			ref: item
		}))

		return collections
	})
}

function getCollectionData(collection) {
	return collection.get().then(result => {
		let data = []

		result.forEach(item => data.push({
			key: item.id,
			ref: item.ref,
			data: item.data()
		}))

		return data
	})
}