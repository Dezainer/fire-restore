module.exports = function(args) {
	let credentialPath, outputPath, path, action

	if(args.includes('-a')) {
		let choosenCredentialPath = getFlagValue(args, '-a')

		if(!choosenCredentialPath)
			throw new Error('The "-a" flag needs to be accompanied by your credential file, like "serviceAccount.json"')

		credentialPath = choosenCredentialPath
	} else {
		throw new Error('You need to specify your account')
	}

	if(args.includes('-o')) {
		let choosenOutputPath = getFlagValue(args, '-o')

		if(!choosenOutputPath)
			throw new error('The "-o" flag needs to be accompanied by a file path')

		outputPath = choosenOutputPath
	} else {
		throw new Error('You must set a path to the file where you want to save your backup')
	}

	if(!(args.includes('-b') || args.includes('-r')))
		throw new Error('You need to include an action like "-b"(backup) or "-r"(restore)')

	if(args.includes('-b') && args.includes('-r'))
		throw new Error('Include only one action to proceed')

	if(args.includes('-p')) {
		let choosenPath = getFlagValue(args, '-p')
		
		if(!choosenPath)
			throw new Error('The "-p" flag needs to be accompanied by a path like "-p /users"')

		path = choosenPath
	}

	action = args.includes('-b') ? 'BACKUP' : 'RESTORE'
	return { credentialPath, outputPath, path, action }
}

function getFlagValue(args, flag) {
	return args[args.indexOf(flag) + 1]
}