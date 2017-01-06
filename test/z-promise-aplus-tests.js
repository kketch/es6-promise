/* globals describe */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */

var adapter = {
	resolved: Promise.resolve,
	rejected: Promise.reject,
	deferred: function() {
		var resolveRef;
		var rejectRef;
		var promise = new Promise(function(resolve, reject) {
			resolveRef = resolve;
			rejectRef = reject;
		});

		return {
			resolve: resolveRef,
			reject: rejectRef,
			promise: promise
		};
	}
};

describe('Promises/A+ Tests', function() {

	require('es5-shim');
	require('es5-shim/es5-sham');
	require('promises-aplus-tests').mocha(adapter);

});
