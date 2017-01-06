var STATE_PENDING
var STATE_FULFILLED = 1
var STATE_REJECTED = 2
var nextTick = require('./next-tick')

function resolve(value) {

	var _this = this
	if (this._state !== STATE_PENDING) {
		return
	}

	if (this === value) {
		reject.call(this, new TypeError('Chaining cycle detected for promise'))
		return
	}

	if (value && (typeof value === 'function' || typeof value === 'object')) {

		try {

			var isSettler = true
			var then = value.then

			if (typeof then === 'function') {
				then.call(value,
				function(result) {
					if (isSettler) {
						isSettler = false
						resolve.call(_this, result)
					}
				},

				function(reason) {
					if (isSettler) {
						isSettler = false
						reject.call(_this, reason)
					}
				})

				return
			}

		} catch (e) {

			if (isSettler) {
				reject.call(this, e)
			}

			return

		}

	}

	this._state = STATE_FULFILLED
	this._settleValue = value

	if (this.next) {
		setTimeout(function() {
			for (var i = 0, n = _this.next.length; i < n; i++) {
				fulfillWith(_this.next[i], value)
			}
		}, 0)
	}

}

function reject(reason) {

	if (this._state !== STATE_PENDING) {
		return
	}

	this._state = STATE_REJECTED
	this._settleValue = reason

	var next = this.next
	if (next) {
		nextTick(function() {
			for (var i = 0, n = next.length; i < n; i++) {
				doReject(next[i], reason)
			}
		})
	}

}

function fulfillWith(descriptor, value, context, shouldApplyArray) {

	if (typeof descriptor.fulfillmentHandler === 'function') {

		try {

			var returnValue = shouldApplyArray && value.length !== void 0 ?
			descriptor.fulfillmentHandler.apply(context, value) : descriptor.fulfillmentHandler.call(context, value)
			resolve.call(descriptor.promise, returnValue)

		} catch (e) {
			reject.call(descriptor.promise, e)
		}

	} else {
		resolve.call(descriptor.promise, value)
	}

}

function rejectWith(descriptor, reason) {

	if (typeof descriptor.rejectionHandler === 'function') {

		try {

			var returnValue = descriptor.rejectionHandler.call(void 0, reason)
			resolve.call(descriptor.promise, returnValue)

		} catch (e) {
			reject.call(descriptor.promise, e)
		}

	} else {
		reject.call(descriptor.promise, reason)
	}

}

function doNext() {

	// implement end of resolve or reject here

}

exports.resolve = resolve
exports.reject = reject
exports.fulfillWith = fulfillWith
exports.doReject = doReject
exports.doNext = doNext
