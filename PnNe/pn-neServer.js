/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
var https = require('https');
var fs = require('fs');
var config = require('./config'); // mio file di configurazione
var privateKey = fs.readFileSync(config.keyPermPublic);
var certificate = fs.readFileSync(config.certPermPublic);
var passphrase = config.passphraseCert;

var credentials = {key: privateKey, cert: certificate, passphrase: passphrase};
var express = require('express');
var app = express();

//... bunch of other express stuff here ...

//pass in your express app and credentials to create an https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: httpsServer
});

wss.on('connection', function connection(ws) {
    console.log("connessione avvenuta");
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('un saluto dal websocket server');

    //loop su tutti i client connessi..
    wss.clients.forEach(function each(client) {
        console.log('client.readyState:' + client.readyState);
        console.log(client);
    });
});