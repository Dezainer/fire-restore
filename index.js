#!/usr/bin/env node

const initialize = require('./src/initializer')
const ignite = require('./src/igniter')
const write = require('./src/helpers/writer')
const Util = require('./src/helpers/util')

const backup = require('./src/actions/backup')
const restore = require('./src/actions/restore')

let args = process.argv.slice(2), settings, firestore

try {
	settings = initialize(args)
	Util.logSuccess('INITIALIZATION')
} catch(err) {
	return Util.logError('INITIALIZATION', err)
}

try {
	let fire = ignite(settings.credentialPath)
	firestore = fire.connection

	Util.logSuccess('CONNECTION', `Connected on: ${ fire.project }`)
} catch(err) {
	return Util.logError('CONNECTION', err)
}

if(settings.action == 'BACKUP')
	return backup(firestore, settings.path)
		.then(result => {
			Util.logSuccess('BACKUP')
			return write(result, settings.outputPath)
				.then(msg => Util.logSuccess('WRITING', msg))
				.catch(err => Util.logError('WRITING', err))
		})
		.catch(err => Util.logError('BACKUP', err))

if(settings.action == 'RESTORE') {
	let backup

	try {
		backup = require(settings.outputPath)
		Util.logSuccess('READING')
	} catch(err) {
		return Util.logError('READING', err)
	}

	return restore(firestore, settings.path, backup)
			.then(msg => Util.logSuccess('RESTORE'))
			.catch(err => Util.logError('RESTORE', err))
}