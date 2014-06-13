var exec = require('child_process').exec;
var fs = require('fs');
var zmq = require('zmq');
var _ = require('underscore');

var publisher = zmq.socket('pub');
publisher.bind('tcp://*:5556', function(error) {
	if(error) {
		console.log(error);
		process.exit(0);
	}
	else {
		console.log('Binding on port: 5556');
	}
});

var getProcessList = function(sendList) {
	var commandLine = exec('ps -A -o pid',
		function(error, stdout, stderr) {
			if(stdout) {
				var processes = stdout.split("\n");
				processes = _.map(processes, function(elem) {
					return elem.trim();
				});
				
				writeToFile(processes);
				sendList(processes);
			}
			else if(stderr) {
				console.log("stderr " + stderr);
			}
			else {
				console.log("error " + error);
			}
		});
};

var writeToFile = function(processes) {
	fs.writeFile("pids.log", processes, function(error) {
		if(error) {
			console.log(error);
		}
	});
};

var sendList = function(processes) {
	publisher.send(JSON.stringify(processes));
};

setInterval(function() {
	getProcessList(sendList);
}, 60000);
