var memjs = require('memjs');
var client = memjs.Client.create(process.env.MEMCACHED_URI || 'localhost:11211');

module.exports = client;