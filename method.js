/* jshint -W079 */
var Promise = require('./base');
/* jshint +W079 */
var settle = require('./src/settle');
var doResolve = settle.doResolve;
var reject = settle.reject;
var INTERNAL = function() {};

Promise.try = function(fn, args, context) {

	var _this = this;
	var promise = new Promise(INTERNAL);
	var descriptor = {
		fulfillmentHandler: fn,
		promise: promise
	};

	_this.all(args).then(function(args) {

		doResolve(descriptor, args, context, true);

	}, function(reason) {

		reject.call(promise, reason);

	});

	return promise;

};

Promise.method = function(fn) {

	var _this = this;
	return function() {
		return _this.try(fn, arguments, this);
	};

};
