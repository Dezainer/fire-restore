module.exports = function(args) {
	let credentials, path, action

	if(args.includes('-a')) {
		let choosenCredentialsPath = getFlagValue(args, '-a')

		if(!choosenCredentialsPath) {
			throw new Error('The "-a" flag needs to be accompanied by your credentials file, like "serviceAccount.json"')
		}

		if(!choosenCredentialsPath.includes('.json')) {
			throw new Error('Insert a valid credentials file to continue')
		}

		credentials = require(choosenCredentialsPath)
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

	return { credentials, path, action }
}

function getFlagValue(args, flag) {
	return args[args.indexOf(flag) + 1]
}