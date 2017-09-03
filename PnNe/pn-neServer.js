/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
var https = require('https');
var fs = require('fs');
//******************************************************************************
//** File di configurazione (stesso per il modulo PnBE
var config = require('./config'); 
//** Credenziali da utilizzare per protocollo HTTPS 
var privateKey = fs.readFileSync(config.keyPermPublic);
var certificate = fs.readFileSync(config.certPermPublic);
var passphrase = config.passphraseCert;
var credentials = {key: privateKey, cert: certificate, passphrase: passphrase};
var express = require('express');
var app = express();
var portaHttpsServer=8443;
//******************************************************************************
//******************************************************************************
//** Creo server https con le credenziali precedentemente definite 
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(portaHttpsServer);
//** Creo web socket server e lo aggancio all'HTTPS server sopra definito
var WebSocketServer = require('ws').Server;

//************
//Check autorizzazione utente
//**************************
var checkTokenUtente = function (credenziali){
    console.log('utente='+credenziali[0]+' token='+credenziali[1]);
    //logica per testare il token dell'utente
    return credenziali[1];
};
var wss = new WebSocketServer({
    server: httpsServer,
    handleProtocols:checkTokenUtente
});

console.log("WebSocket server in ascolto su "+portaHttpsServer);
//** Gestisco connessione con il websocket ed eventuali messaggi bidirezionali
//** client-server
wss.on('connection', function connection(ws,req) {
        
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    //un saluto al client dal server
    ws.send('un saluto dal websocket server');
    
    //loop su tutti i client connessi..
    wss.clients.forEach(function each(client) {
        console.log('client.readyState:' + client.readyState);
       // console.log(client);
    });
});
////****************************************************************************