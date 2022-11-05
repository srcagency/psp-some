'use strict'

const test = require('tape')
const {pull, through, values, error} = require('pull-stream')
const some = require('./')

test((t) => {
	t.plan(2)
	const stream = pull(
		values([1, 2, 3]),
		some((x) => x > 2)
	)

	t.ok(stream instanceof Promise, '`stream` is a promise')
	stream.then((found) => t.equal(found, true, 'resolved value'))
})

test('terminated on match', (t) => {
	t.plan(2)
	const processed = []
	pull(
		values([1, 2, 3]),
		through((x) => processed.push(x)),
		some((x) => x > 1)
	).then((found) => {
		t.equal(found, true, 'resolved value')
		t.deepEqual(processed, [1, 2], 'processed values')
	})
})

test('without a match', (t) => {
	t.plan(2)
	const processed = []
	pull(
		values([1, 2, 3]),
		through((x) => processed.push(x)),
		some((x) => x > Infinity)
	).then((found) => {
		t.equal(found, false, 'resolved value')
		t.deepEqual(processed, [1, 2, 3], 'processed values')
	})
})

test('on an empty stream', (t) => {
	t.plan(1)
	pull(
		values([]),
		some((x) => x === {})
	).then((found) => t.equal(found, false, 'resolved value'))
})

test('some a stream with an error in the beginning', (t) => {
	t.plan(1)
	const testError = new Error('test')
	const stream = pull(
		error(testError),
		some((x) => x === {})
	)

	stream.catch((e) => t.equal(e, testError, 'rejection value'))
})

test('some a stream which errors', (t) => {
	t.plan(1)
	const testError = new Error('test')
	let count = 0
	pull(
		(end, cb) => {
			if (count++ < 2) {
				cb(null, count)
			} else {
				cb(testError)
			}
		},
		some((x) => x === {})
	).catch((e) => t.equal(e, testError, 'rejection value'))
})
