/* globals describe, it, before */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */
var expect = require('expect.js');

describe('Promise (method)', function() {

	describe('try()', function() {

		it('should return a promise', function() {

			var promise = Promise.try(function() {});

			expect(promise.then).to.be.a('function');
			expect(promise instanceof Promise).to.be(true);

		});

		it('should resolve the promise with the return value from the handler', function(done) {

			Promise.try(function() {
				return 'theValue';
			}).then(function(value) {
				expect(value).to.be('theValue');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should reject the promise if the handler throw an error', function(done) {

			Promise.try(function() {
				throw new Error('Bad');
			}).then(function() {
				throw new Error('Should not resolve');
			}).catch(function(e) {
				var message = e.message || e.name;
				expect(message).to.be('Bad');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should resolve to the value of the returned promise from the handler', function(done) {

			Promise.try(function() {
				return new Promise(function(resolve) {
					resolve(5);
				});
			}).then(function(value) {
				expect(value).to.be(5);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should reject with the reason provided by the the returned promise', function(done) {

			Promise.try(function() {
				return new Promise(function(resolve) {
					resolve(Promise.resolve(true));
				}).then(function() {
					throw new Error('Bad');
				});
			}).then(function() {
				throw new Error('Should not resolve');
			}).catch(function(e) {

				var message = e.message || e.name;
				expect(message).to.be('Bad');
				done();

			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('method()', function() {

		function DelaySeries(interval, times, tickFunction) {
			this.interval = interval;
			this.times = times;
			this.tickFunction = tickFunction;
		}

		before(function() {

			DelaySeries.prototype.me = Promise.method(function() {
				return this;
			});

			DelaySeries.prototype.run = Promise.method(function(remaining) {

				var _this = this;
				remaining || (remaining = this.times);

				if (typeof this.interval !== 'number' || typeof remaining !== 'number') {
					throw new TypeError('Invalid value type for interval or type');
				}

				return Promise.delay(this.interval).then(function() {

					_this.tickFunction(remaining);

					if (--remaining > 0) {
						return _this.run(remaining);
					}

				});

			});

			DelaySeries.prototype.cat = Promise.method(function(value) {
				return value;
			});

		});

		it('should return a function that returns a promise', function() {

			var generatedFunction = Promise.method(function() {});

			expect(generatedFunction).to.be.a('function');
			var promise = generatedFunction();
			expect(promise instanceof Promise).to.be(true);

		});

		it('should preserve this (context) value', function(done) {

			var series = new DelaySeries;
			series.me().then(function(value) {
				expect(value).to.be(series);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should preserve this (context) value and pass arguments', function(done) {

			var count = 0;
			var series = new DelaySeries(16, 10, function() {
				count++;
			});

			series.run().then(function() {

				expect(count).to.be(10);
				done();

			}).catch(function(e) {
				done(e);
			});

		});

		it('should support dynamic arguments (promises)', function(done) {

			var series = new DelaySeries;
			series.cat(Promise.resolve(999)).then(function(value) {
				expect(value).to.be(999);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

});
