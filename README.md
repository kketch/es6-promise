<a href="http://promisesaplus.com/">
    <img src="http://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.1 compliant" align="right" />
</a>

ES6 Promise
===========

This module is Promise/A+ compliant & interoperable with other implementations conforming
with the Promise/A+ specification including ES2015 promises.

`Promise.all`, `Promise.race`, `Promise.resolve`, `Promise.reject` and `Promise#catch` from ES6
are implemented too, there is however no support for ES6 iterator as this module target ES3/ES5 engines.

Other methods inspired from other promise librairies are optionnally available:

* Promise.promisify
* Promise.promisifyAll
* Promise.delay
* Promise#delay
* Promise#timeout
* Promise.try
* Promise.method
* Promise#spread

If you are using node.js or browserify, you can require only the ES2015 compliant
methods:

  var Promise = require('es6-promise/base');

If you only want `promisify` methods too but are don't care about `spread`:

  var Promise = require('es6-promise/base');
  require('es6-promise/promisify');

If you want to import everything :

  var Promise = require('es6-promise');
