/* globals describe, it */
/* jshint -W079 */
var Promise = require('../');
/* jshint +W079 */
var expect = require('expect.js');

describe('Promise (spread)', function() {

	describe('#spread()', function() {

		it('if the promise on which spread is used returns an array, its members should be arguments to the handler', function(done) {

			new Promise(function(resolve) {

				resolve(['De Gaulle', 'Pompidou', 'Giscard']);

			}).spread(function(firstPresident, secondPresident, thirdPresident) {

				expect(firstPresident).to.be('De Gaulle');
				expect(secondPresident).to.be('Pompidou');
				expect(thirdPresident).to.be('Giscard');
				done();

			}).catch(function(e) {
				done(e);
			});

		});

	});

});
