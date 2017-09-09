/* 
 * Rappresenta il Notification Engine (NE) 
 * per invio di notifiche e messaggi chat tra utenti
 */
//******************************************************************************
//** Import librerie
var https = require('https');
var fs = require('fs');
var log4js = require('log4js');
var express = require('express');
var app = express();
var Client = require('node-rest-client').Client;
//******************************************************************************
//** Configurazione Log4j
log4js.configure({
    appenders: [
        {type: 'file', filename: config.pathLog, category: 'pn-neServer'}
    ],
    replaceConsole: true/* se true il console.log viene disabilitato.*/
});
var logger = log4js.getLogger('pn-neServer');
logger.setLevel('DEBUG');
//******************************************************************************
//** File di configurazione applicativo (stesso per il modulo PnBE)
var config = require('./config');
//** Credenziali da utilizzare per protocollo HTTPS 
var privateKey = fs.readFileSync(config.keyPermPublic);
var certificate = fs.readFileSync(config.certPermPublic);
var passphrase = config.passphraseCert;
var credentials = {key: privateKey, cert: certificate, passphrase: passphrase};
//******************************************************************************

//******************************************************************************
//** Creo server https con le credenziali sopra configurate 
//******************************************************************************
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.portaNotificationService);
//** Creo web socket server e lo aggancio all'HTTPS server sopra definito
var WebSocketServer = require('ws').Server;
//*****************************************************************************

/*var checkTokenUtenteOLD = function (token) {
 var checkToken = null;
 //rejectUnauthorized is one of the HTTPS client options. 
 // * It allows a client to talk to a server with self-signed certificate.
 
 var options = {
 connection: {
 rejectUnauthorized: false,
 headers: {
 "Content-Type": "application/json",
 "token": token
 }
 },
 requestConfig: {
 timeout: 60000,
 noDelay: true,
 keepAlive: true,
 keepAliveDelay: 1000
 },
 responseConfig: {
 timeout: 300000
 }
 };
 
 var client = new Client(options);
 // set content-type header and data as json in args parameter 
 var args = {data: {saluto: "ciao"}};
 client.post("https://localhost:3000/apinode/checkToken", args, function (data, response) {
 // parsed response body as js object 
 //logger.debug(data);
 //logger.debug(response)
 checkToken = token;
 });
 
 logger.debug("esco dalla checkTokenUtente ");
 return checkToken;
 };*/
/*********************************************************************************/
// *                              IMPORTANTE!!
// * TOGLIERE IN PRODUZIONE QUANDO USERO I CERTIFICATI SSL (NO-SELF SIGNED)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
/*********************************************************************************/
//******************************************************************************
//**Check autorizzazione utente durante handshake con il websocket
//** verifica il token e restituisce info su utente
//******************************************************************************
var checkTokenUtente = function (token) {
    var checkToken = null;
    var checkTokenPnBeService = require('sync-request');
    var resPnBeService = 
            checkTokenPnBeService('POST', 
                                  config.hostPnBeService+':'
                                 +config.portaPnBeService+
                                 config.checkTokenPnBeService, {
        'headers': {
            "token": token
        }
    });
    try{
        var bodyResp = JSON.parse(resPnBeService.getBody('utf8'));
        logger.debug("utente connesso->"+bodyResp.datiUtente._doc.nick);
        checkToken=token;
    }catch (exception){
        logger.debug("errore @checkTokenUtente:"+exception);
    }
    
    return checkToken;
};
//******************************************************************************
//** ISTANZA SOCKET SERVER
//******************************************************************************
var wss = new WebSocketServer({
    server: httpsServer,
    handleProtocols: checkTokenUtente
});
logger.debug("WebSocket server in ascolto su " + config.portaNotificationService);
//******************************************************************************

//******************************************************************************
// Gestione messaggi bidirezionali client-server
//******************************************************************************
wss.on('connection', function connection(ws, req) {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    //un saluto al client dal server
    ws.send('un saluto dal websocket server');

    //loop su tutti i client connessi..
    wss.clients.forEach(function each(client) {
        logger.debug('client.readyState:' + client.readyState);
    });
});
////****************************************************************************