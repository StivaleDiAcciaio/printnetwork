/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
var port=3300;
var errorhandler = require('errorhandler');
//app.use(errorhandler()); // development only

var server = http.createServer(app);
 
var io = require('socket.io').listen(server);
var ns = io.of('/ns');
ns.on('connection', function (socket) {
    socket.on('call', function (p1, fn) {
    console.log('client sent '+p1);
        // do something useful
        fn(0, 'some data'); // success
    });
});
 

server.listen(port, function() {
  console.log('server notification engine up and running at %s port', port);
});
