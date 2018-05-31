var db,
	batch, 
	entities = 0, 
	batches = []

exports.start = function(conn) {
	db = conn
	batch = db.batch()
}

exports.set = function(ref, value) {
	batch.set(ref, value)
	entities += 1

	if(entities >= 500) {
		entities = 0

		batches.push(batch)
		batch = db.batch()
	}
}

exports.commit = function() {
	return Promise.all(batches.map(batch => batch.commit()))
}