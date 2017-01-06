/* jshint -W079 */
var Promise = require('./base');
/* jshint +W079 */

require('./promisify');
require('./method');
require('./spread');
require('./timers');

module.exports = Promise;
