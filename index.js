'use strict'

const drain = require('psp-drain')

module.exports = some

function some(test) {
	let found = false
	return (read) => drain((v) => !(found = test(v)))(read).then(() => !!found)
}
