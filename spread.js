/* jshint -W079 */
var Promise = require('./base');
/* jshint +W079 */

Promise.prototype.spread = function(onFulfilled) {

	return this.then(function(args) {

		return onFulfilled ? onFulfilled.apply(void 0, args) : args;

	});

};
