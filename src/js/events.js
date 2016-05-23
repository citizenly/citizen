// module to manage events and make them available across components
var EventEmitter = require('events');

module.exports = new EventEmitter();