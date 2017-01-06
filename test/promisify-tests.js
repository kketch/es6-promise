/* globals describe, it */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */
var expect = require('expect.js');

describe('Promise (promisify)', function() {

	function operation(shouldPassError, callback) {

		setTimeout(function() {

			if (shouldPassError) {
				callback(new Error('Bad'));
			} else {
				callback(null, true);
			}

		}, 100);

	}

	function operation2(shouldPassError, arg2, arg3, callback) {

		var _this = this;
		setTimeout(function() {

			if (shouldPassError) {
				callback(new Error('Bad'));
			} else {
				callback(null, [arg2, arg3, _this.value]);
			}

		}, 16);

	}

	describe('promisify()', function() {

		it('should promisify a given function', function(done) {

			var promisified = Promise.promisify(operation);
			promisified(false).then(function(value) {

				expect(value).to.be(true);
				return promisified(true).catch(function(e) {

					var message = e.message || e.name;
					expect(message).to.be('Bad');
					done();

				});

			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('promisifyAll()', function() {

		var object = {
			value: 'nice',
			op1: operation,
			op2: operation2
		};

		it('should promisify all functions on a given object', function(done) {

			Promise.promisifyAll(object);
			object.op1Async(false).then(function(value) {

				expect(value).to.be(true);
				return object.op2Async(false, 1, 2);

			}).then(function(array) {

				expect(array[0]).to.be(1);
				expect(array[1]).to.be(2);
				expect(array[2]).to.be('nice');
				return object.op1Async(true).catch(function(e) {
					var message = e.message || e.name;
					expect(message).to.be('Bad');
					done();
				});

			}).catch(function(e) {
				done(e);
			});

		});

	});

});
