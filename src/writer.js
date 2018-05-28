const fs = require('fs')

module.exports = function(obj, path) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, JSON.stringify(obj, null, 4), function(err) {
			err && reject(err)
			resolve('File has been written successfully!')
		})
	})
}