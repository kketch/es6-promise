/* globals describe, it */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */
var expect = require('expect.js');

describe('Promise (ES6)', function() {

	it('should instantiate', function() {

		expect(Promise.length).to.be(1);
		expect(Promise.prototype.constructor).to.be(Promise);
		var promise = new Promise(function() {});

		expect(promise instanceof Promise).to.be(true);

	});

	describe('#catch()', function() {

		it('should catch rejection reasons', function(done) {

			new Promise(function(resolve) {
				resolve();
			}).then(function() {
				throw new Error('Pas bien');
			}).then(function() {
				done(new Error('Should not resolve'));
			}).catch(function(e) {
				var message = e.message || e.name;
				expect(message).to.be('Pas bien');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('.all()', function() {

		it('should resolve when all supplied promise are resolved', function(done) {

			var promises = [];

			// 0
			promises.push(Promise.resolve(1));

			// 1
			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve(true);
				}, 100);
			}));

			// 2
			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve(false);
				}, 500);
			}));

			// 3
			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve();
				}, 5);
			}));

			// 4
			promises.push(new Promise(function(resolve) {
				resolve(new Promise(function(resolve) {

					setTimeout(function() {
						resolve({name: 'La Roux'});
					}, 100);

				}));
			}));

			// 5
			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve('YO');
				}, 16);
			}));

			Promise.all(promises).then(function(results) {

				expect(results[0]).to.be(1);
				expect(results[1]).to.be(true);
				expect(results[2]).to.be(false);
				expect(results[3]).to.be(undefined);
				expect(results[4]).to.eql({name: 'La Roux'});
				expect(results[5]).to.be('YO');
				done();

			}).catch(function(e) {
				done(e);
			});

		});

		it('should be rejected as soon as a promise is rejected', function(done) {

			var promises = [];
			var expectedResolvedExecuted = false;

			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					expectedResolvedExecuted = true;
					resolve(true);
				}, 500);
			}));

			promises.push(new Promise(function(resolve, reject) {
				setTimeout(function() {
					var err = new Error('Oh oh there is an error');
					err.relevant = true;
					reject(err);
				}, 100);
			}));

			Promise.all(promises).then(function() {
				done(new Error('Should be rejected'));
			}).catch(function(e) {

				if (e.relevant) {
					done();
				} else {
					done(e);
				}

			});

		});

	});

	describe('.resolve()', function() {

		it('should return a resolved promise', function(done) {

			var value = Math.random();
			Promise.resolve(value).then(function(fulfilledValue) {
				expect(fulfilledValue).to.be(value);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('.reject()', function() {

		it('should return a rejected promise', function(done) {

			var reason = 'Oh oh ' + Math.random();
			Promise.reject(reason).then(function() {
				done(new Error('Should be rejected'));
			}).catch(function(rejectionReason) {
				expect(rejectionReason).to.be(reason);
				done();
			}).catch(function(e) {
				done(e);
			});

		});

	});

	describe('.race()', function() {

		it('should resolve as soon as a promise is resolved', function(done) {

			var promises = [];

			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve('TROLOLO');
				}, 16);
			}));

			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve('TOTO');
				}, 100);
			}));

			promises.push(new Promise(function(resolve, reject) {
				setTimeout(function() {
					reject(new Error('Very bad'));
				}, 20);
			}));

			Promise.race(promises).then(function(fulfilledValue) {
				expect(fulfilledValue).to.be('TROLOLO');
				done();
			}).catch(function(e) {
				done(e);
			});

		});

		it('should be rejected as soon as a promise is rejected', function(done) {

			var promises = [];

			promises.push(new Promise(function(resolve, reject) {
				setTimeout(function() {
					reject('WTF');
				}, 16);
			}));

			promises.push(new Promise(function(resolve, reject) {
				setTimeout(function() {
					reject('TOTO');
				}, 100);
			}));

			promises.push(new Promise(function(resolve) {
				setTimeout(function() {
					resolve('Very good');
				}, 20);
			}));

			Promise.race(promises).then(function() {
				done(new Error('Should not be resolved'));
			}).catch(function(rejectionReason) {
				expect(rejectionReason).to.be('WTF');
				done();
			});

		});

	});

});
