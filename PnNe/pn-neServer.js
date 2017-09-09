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
//** File di configurazione applicativo 
var config = require('./configPnNe');
//** Configurazione Log4j
log4js.configure({
    appenders: [
        {type: 'file', filename: config.pathLog, category: 'pn-neServer'}
    ],
    replaceConsole: true/* se true il console.log viene disabilitato.*/
});
var logger = log4js.getLogger('pn-neServer');
logger.setLevel('DEBUG');
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
var WebSocketServer = require('ws');
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
//** utilizzo chiamata sincrona in questo caso **
//******************************************************************************
var checkTokenUtente = function (token) {
    var checkToken = null;
    var checkTokenPnBeService = require('sync-request');
    var resPnBeService =
            checkTokenPnBeService('POST',
                    config.hostPnBeService + ':'
                    + config.portaPnBeService +
                    config.checkTokenPnBeService, {
                        'headers': {
                            "token": token
                        }
                    });
    try {
        var bodyResp = JSON.parse(resPnBeService.getBody('utf8'));
        logger.debug("utente connesso->" + bodyResp.datiUtente._doc.nick);

        checkToken = token;
    } catch (exception) {
        logger.debug("errore @checkTokenUtente:" + exception);
    }

    return checkToken;
};
//******************************************************************************
//** ISTANZA SOCKET SERVER
//******************************************************************************
var wss = new WebSocketServer.Server({
    server: httpsServer,
    handleProtocols: checkTokenUtente
});
logger.debug("WebSocket server in ascolto su " + config.portaNotificationService);
//******************************************************************************

//******************************************************************************
// Gestione messaggi bidirezionali client-server
//******************************************************************************
var testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7InRpcG9sb2dpYVN0YW1wYS5zdGFtcGEyRC5mb3JtYXRvIjoiaW5pdCIsImxvY2F0aW9uLmNvb3JkaW5hdGVzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJpbmRpcml6em8uZGVzY3JpemlvbmUiOiJpbml0IiwiaW5kaXJpenpvLnRpcG9JbmRpcml6em8iOiJpbml0IiwidGlwb2xvZ2lhU3RhbXBhLnN0YW1wYTJELmNvbG9yZSI6ImluaXQiLCJsb2NhdGlvbi50eXBlIjoiaW5pdCIsImZlZWRiYWNrIjoiaW5pdCIsInRpcG9sb2dpYVV0ZW50ZSI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJuaWNrIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiaW5kaXJpenpvLmRlc2NyaXppb25lIjp0cnVlLCJpbmRpcml6em8udGlwb0luZGlyaXp6byI6dHJ1ZSwidGlwb2xvZ2lhU3RhbXBhLnN0YW1wYTJELmZvcm1hdG8iOnRydWUsInRpcG9sb2dpYVN0YW1wYS5zdGFtcGEyRC5jb2xvcmUiOnRydWUsImxvY2F0aW9uLmNvb3JkaW5hdGVzIjp0cnVlLCJsb2NhdGlvbi50eXBlIjp0cnVlLCJmZWVkYmFjayI6dHJ1ZSwidGlwb2xvZ2lhVXRlbnRlIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsIm5pY2siOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7InNhdmUiOltudWxsLG51bGxdLCJpc05ldyI6W251bGwsbnVsbF19LCJfZXZlbnRzQ291bnQiOjIsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImluZGlyaXp6byI6eyJkZXNjcml6aW9uZSI6IlZpYSBQaWV0cm8gbWljY2EgNjcsIGxlZ25hbm8iLCJ0aXBvSW5kaXJpenpvIjoiQSJ9LCJ0aXBvbG9naWFTdGFtcGEiOnsic3RhbXBhMkQiOnsiZm9ybWF0byI6W3sidmFsdWUiOiJBNCIsImxhYmVsIjoiMjE2IMOXIDI3OSBtbSIsIl9pZCI6IjU5MzI3MWY1MGFlZjgxMzMwZTU4MWE1MyJ9LHsidmFsdWUiOiJBMyIsImxhYmVsIjoiNDMyIMOXIDI3OSBtbSIsIl9pZCI6IjU5MzI3MWY1MGFlZjgxMzMwZTU4MWE1MiJ9XSwiY29sb3JlIjoiQyJ9LCJzdGFtcGEzRCI6e319LCJsb2NhdGlvbiI6eyJjb29yZGluYXRlcyI6WzguOTA3MDEyMyw0NS42MDQyNzA1XSwidHlwZSI6IlBvaW50In0sIl9fdiI6MCwiZmVlZGJhY2siOjEsInRpcG9sb2dpYVV0ZW50ZSI6IlAiLCJwYXNzd29yZCI6IjIwMmNiOTYyYWM1OTA3NWI5NjRiMDcxNTJkMjM0YjcwIiwiZW1haWwiOiJTQUxWQVRPUkUuQVJJTklTSUBHTUFJTC5DT00iLCJuaWNrIjoiUkVORVJPIiwiX2lkIjoiNTkzMjcxZjUwYWVmODEzMzBlNTgxYTUxIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdfSwiaWF0IjoxNTA0OTQ5NTk2LCJleHAiOjE1MDQ5Njc1OTZ9.voQ9mNyxPsBMwVJkxv1WBxy9u0xu5pjSHTOKfXZa3k8';
wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(message) {
        logger.debug('received: %s', message);
    });
    ws.on('close', function close() {
        logger.debug('disconnected');
    });
    //un saluto al client dal server
    ws.send('un saluto dal websocket server');
});

function sendMessageToUser() {
    //loop su tutti i client connessi..
    wss.clients.forEach(function each(client) {
        if (client.readyState===WebSocketServer.OPEN && 
                client.protocol == testToken) {
            client.send("Ciao Cliente");
        }
    });
}
/* Ogni 30 secondi saluto client*/
var interval = setInterval(function ping() {
    sendMessageToUser();
}, 30000);

////****************************************************************************