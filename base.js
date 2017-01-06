var STATE_PENDING
var STATE_FULFILLED = 1
var STATE_REJECTED = 2
var INTERNAL = function() {}

var settle = require('./src/settle')
var resolve = settle.resolve
var reject = settle.reject
var fulfillWith = settle.fulfillWith
var rejectWith = settle.rejectWith

function Promise(executor) {
	var _this = this
	if (executor && executor.call) {
		executor(
			function(value) {
				resolve.call(_this, value)
			},
			function(reason) {
				reject.call(_this, reason)
			}
		)
	} else {
		// @ifdef DEBUG
		var errMsg = 'Missing resolver for Promise: ' + executor
		console.error(errMsg)
		throw new TypeError(errMsg)
		// @endif
	}
}

Promise.resolve = function(value) {
	return new Promise(function(resolve) {
		resolve(value)
	})
}

Promise.reject = function(reason) {

	return new Promise(function(resolve, reject) {
		reject(reason)
	})

}

function many(array, race) {

	// ES5 only do not support iterators
	var manyPromise = new Promise(INTERNAL)
	var arrayLength = array && array.length
	var resolvedCount = 0
	var values = []

	function resolver(promise, index) {

		if (typeof promise.then !== 'function') {
			promise = Promise.resolve(promise)
		}

		promise.then(function(value) {
			values[index] = value
			resolvedCount++
			if (race) {
				resolve.call(manyPromise, value)
			} else if (resolvedCount === arrayLength) {
				resolve.call(manyPromise, values)
			}
		},

		function(reason) {
			reject.call(manyPromise, reason)
		})
	}

	if (!arrayLength) {
		resolve.call(manyPromise, values)
	}

	for (var i = 0; i < arrayLength; i++) {
		resolver(array[i], i)
	}

	return manyPromise

}

Promise.all = function(array) {
	return many(array)
}

Promise.race = function(array) {
	return many(array, true)
}

Promise.prototype.then = function(onFulfilled, onRejected) {
	var promise = new Promise(INTERNAL)
	var state = this._state
	var value = this._settleValue
	var descriptor = {
		fulfillmentHandler: onFulfilled,
		rejectionHandler: onRejected,
		promise: promise
	}

	if (state === STATE_PENDING)
		if (this.next)
			this.next.push(descriptor)
    else
			this.next = [descriptor]
	else if (state === STATE_FULFILLED)
	  setTimeout(function() {
			fulfillWith(descriptor, value)
		}, 0)
	else if (state === STATE_REJECTED)
	  setTimeout(function() {
			rejectWith(descriptor, value)
		}, 0)

	return promise
}

Promise.prototype.catch = function(onRejected) {
	return this.then(null, onRejected)
}

module.exports = Promise
