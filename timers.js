/* jshint -W079 */
var Promise = require('./base');
/* jshint +W079 */
var settle = require('./src/settle');
var resolve = settle.resolve;
var reject = settle.reject;
var STATE_PENDING;
var INTERNAL = function() {};

Promise.delay = function(value, ms) {

	ms === void 0 && (ms = value) && (value = void 0);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(value);
		}, ms);
	});

};

Promise.prototype.delay = function(ms) {

	return this.then(function(value) {
		return Promise.delay(value, ms);
	});

};

Promise.prototype.timeout = function(ms) {

	var _this = this;
	var promise = new Promise(INTERNAL);
	var id = setTimeout(function() {
		if (_this._state === STATE_PENDING) {
			var err = new Error('Timed out');
			err.timeout = true;
			reject.call(promise, err);
		}
	}, ms);

	this.then(function(value) {
		clearTimeout(id);
		resolve.call(promise, value);
	}).catch(function(reason) {
		clearTimeout(id);
		reject.call(promise, reason);
	});

	return promise;

};
