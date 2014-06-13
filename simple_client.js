var zmq = require('zmq');
var subscriber = zmq.socket('sub');

subscriber.on('message', function(msg) {
	console.log('monitored process list ' + msg.toString());
});

subscriber.connect('tcp://localhost:5556');
subscriber.subscribe('');
console.log('Listening on port 5556')
