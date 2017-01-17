// Serialport package: https://www.npmjs.com/package/serialport

var ws = require("nodejs-websocket");
var SerialPort = require("serialport");

var port = new SerialPort("/dev/tty.usbmodem1421", {
	baudRate: 9600
});

var server = ws.createServer(function(conn) {
	console.log("Created new WebSocket connection.");
    conn.on("close", function (code, reason) {
        console.log("WebSocket connection closed")
    })

    conn.on("error", function(e) {
    	console.log("Error in WebSocket connection: ", e);
    });
}).listen(9998);


port.on('open', function() {
	console.log("Serial port to Arduino opened.");
});

// open errors will be emitted as an error event
port.on('error', function(err) {
	console.log('Error: ', err.message);
})

port.on('data', function(chunk) {
	console.log("Chunk of length " + chunk.length + " received: ", chunk[0]);

	if(chunk[0] == '1'.charCodeAt(0)) {
		broadcast(server, "1");
	} else {
		broadcast(server, "0");
	}

});

function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
		console.log("Sending ", chunk[0], " over WebSocket.");
        conn.sendText(msg)
	})
}

