module.exports = function(db, path) {
	let initialPath = path ? path : db
	return scavengeData(initialPath)
}

function scavengeData(doc) {
	return getCollectionsFromDocument(doc).then(collections => {
		let obj = {}

		return collections.length == 0
			? obj
			: Promise.all(collections.map(collection =>
				getCollectionData(collection.ref).then(data =>
					Promise.all(data.map(item =>
						scavengeData(item.ref).then(subData => {
							let collectionData = data.map(doc => Object.assign(doc.data, subData))
							obj[collection.name] = collectionData
						})
					))
				)
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
			ref: item.ref,
			data: item.data()
		}))

		return data
	})
}