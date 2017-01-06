/* jshint -W079 */
var Promise = require('./base');
/* jshint +W079 */

Promise.promisify = function(method, context) {

	return function() {

		var args = Array.prototype.slice.call(arguments, 0);
		return new Promise(function(resolve, reject) {
			args.push(function(reason, value) {
				if (reason) {
					reject(reason);
				} else {
					resolve(value);
				}
			});

			method.apply(context, args);
		});

	};

};

function functionKeys(target) {

	var arr = [];
	var index = 0;
	for (var key in target) {
		if (typeof target[key] === 'function') {
			arr[index] = key;
			index++;
		}
	}

	return arr;

}

Promise.promisifyAll = function(target) {

	var keys = functionKeys(target);
	var index;
	var length = keys.length;
	if (length) {

		for (index = 0; index < length; index++) {

			var key = keys[index];
			var newKey = key + 'Async';
			var method = target[key];
			target[newKey] = this.promisify(method, target);

		}

	}

};

// @if DEBUG

Promise.promisifyAllLeak = function(target) {

	for (var key in target) {

		if (typeof target[key] === 'function') {
			target[key + 'Async'] = this.promisify(target[key], target);
		}

	}

};

// @endif

module.exports = Promise;
