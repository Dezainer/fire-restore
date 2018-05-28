module.exports = function(args) {
	let credentialPath, path, action

	if(args.includes('-a')) {
		let choosenCredentialPath = getFlagValue(args, '-a')

		if(!choosenCredentialPath) {
			throw new Error('The "-a" flag needs to be accompanied by your credential file, like "serviceAccount.json"')
		}

		if(!choosenCredentialPath.includes('.json')) {
			throw new Error('Insert a valid credential file to continue')
		}

		credentialPath = choosenCredentialPath
	} else {
		throw new Error('You need to specify your account')
	}

	if(!(args.includes('-b') || args.includes('-r'))) {
		throw new Error('You need to include an action like "-b"(backup) or "-r"(restore)')
	}

	if(args.includes('-b') && args.includes('-r')) {
		throw new Error('Include only one action to proceed')
	}

	if(args.includes('-p')) {
		let choosenPath = getFlagValue(args, '-p')
		
		if(!choosenPath) {
			throw new Error('The "-p" flag needs to be accompanied by a path like "-p /users"')
		}

		if(choosenPath.indexOf('/') == -1) {
			throw new Error('Insert a valid path(or none if you want to backup everything) to continue, like "/users"')
		}

		path = choosenPath
	} else {
		path = '/'
	}

	if(args.includes('-b')) {
		action = 'BACKUP'
	} else {
		action = 'RESTORE'
	}

	return { credentialPath, path, action }
}

function getFlagValue(args, flag) {
	return args[args.indexOf(flag) + 1]
}