const admin = require('firebase-admin')

module.exports = function(credentialPath) {
	let credential = require(credentialPath)

	admin.initializeApp({
		credential: admin.credential.cert(credential),
		databaseUrl: `https://${ credential.project_id }.firebaseio.com`
	})

	return admin.firestore()
}