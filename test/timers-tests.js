/* globals describe, it */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */
var expect = require('expect.js');

function now() {
	return +new Date;
}

describe('Promise (timers)', function() {

	describe('delay()', function() {

		it('should delay (without result)', function(done) {

			var start = now();
			Promise.delay(100).then(function() {
				var end = now();
				expect(end).to.be.greaterThan(start + 99);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should delay the result', function(done) {

			var start = now();
			Promise.delay('superResult', 100).then(function(result) {
				var end = now();
				expect(end).to.be.greaterThan(start + 99);
				expect(result).to.be('superResult');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('#delay()', function() {

		it('should delay the result', function(done) {

			var start = now();
			new Promise(function(resolve) {
				resolve('delayedResult');
			}).delay(200).then(function(delayedResult) {
				var end = now();
				expect(end).to.be.greaterThan(start + 199);
				expect(delayedResult).to.be('delayedResult');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('#timeout()', function() {

		it('should throw an error after the time is out', function(done) {

			var start = now();
			var end;
			Promise.delay(200).timeout(100).then(function() {
				done(new Error('Should not resolve'));
			}).catch(function(e) {

				if (e.timeout) {
					end = now();
					expect(end).to.be.greaterThan(start + 99);
					expect(end).to.be.lessThan(start + 199);
				} else {
					throw e;
				}

			}).then(function() {

				start = now();
				return Promise.delay(100);

			}).timeout(400).then(function() {

				done();

			}, function(e) {

				if (e.timeout) {
					end = now();
					e = new Error('Should not time out (but does)');
				}

				throw e;

			}).catch(function(e) {
				done(e);
			});

		});

	});

});
