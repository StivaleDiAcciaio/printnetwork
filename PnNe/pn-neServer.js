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
var appRouter = express.Router();
var bodyParser = require('body-parser');
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
// uso body parser per ottenere info da POST e/o URL parameters
app.use(bodyParser.urlencoded({extended: false}));
// create application/json parser
app.use(bodyParser.json());
//** Credenziali da utilizzare per protocollo HTTPS 
var privateKey = fs.readFileSync(config.keyPermPublic);
var certificate = fs.readFileSync(config.certPermPublic);
var passphrase = config.passphraseCert;
var credentials = {key: privateKey, cert: certificate, passphrase: passphrase};
//******************************************************************************
//******************************************************************************
//** Creo metodo REST per invio istantaneo di messaggi agli utenti (usa WEBSOCKET)
//** utilizzato dal modulo PnBe notifiche varie
//******************************************************************************
var mittenteServer = 'SERVER';
appRouter.post('/sendMessageToUser', function (req, res) {
    res.header("Access-Control-Allow-Origin", "localhost");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, token, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST");
    var bodyReq = req.body;
    var esito = sendMessageToUser(mittenteServer,bodyReq.destinatario, bodyReq.msg);
    res.status(200);
    res.json({
        esito: esito,
        messaggio: esito ? 'OK' : 'KO',
        codErr: esito ? 0 : -1
    });
});
app.use('/notificationws', appRouter);
//******************************************************************************
//** Creo server https con le credenziali sopra configurate 
//******************************************************************************
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.portaNotificationService);
logger.debug("httpsServer in ascolto su " + config.portaNotificationService);
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
//** verifica il token utente e acquisisce info su utente legato al token.
//** Utilizza chiamata REST sincrona verso il modulo PnBe **
//******************************************************************************
var checkUtente = function (protocollo) {
    var tokenProtocollo = protocollo[1];
    var checkUtenteProtocollo = null;
    var checkTokenPnBeService = require('sync-request');
    var resPnBeService =
            checkTokenPnBeService('POST',
                    config.hostPnBeService + ':'
                    + config.portaPnBeService +
                    config.checkTokenPnBeService, {
                        'headers': {
                            "token": tokenProtocollo
                        }
                    });
    try {
        var bodyResp = JSON.parse(resPnBeService.getBody('utf8'));
        logger.debug("utente connesso->" + bodyResp.datiUtente._doc.nick);
        //restituisco nick associato al token
        checkUtenteProtocollo = bodyResp.datiUtente._doc.nick;
    } catch (exception) {
        logger.debug("errore @checkTokenUtente:" + exception);
    }
    //se checkUtenteProtocollo e' uguale a utenteProtocollo
    //viene stabilita la connessione con il websocket
    return checkUtenteProtocollo;
};
//******************************************************************************
//** ISTANZA SOCKET SERVER
//******************************************************************************
var wss = new WebSocketServer.Server({
    server: httpsServer,
    handleProtocols: checkUtente
});
logger.debug("WebSocket server in ascolto su " + config.portaNotificationService);
//******************************************************************************

//******************************************************************************
// Gestione messaggi bidirezionali client-server
//******************************************************************************
wss.on('connection', function connection(ws, req) {
    var listaUtentiCollegati = [];
    ws.listaUtentiCollegati = listaUtentiCollegati;
    ws.on('message', function incoming(messaggio) {
        //se messaggio da un utente contiene prefisso server..lo elimino
        try {
            var msgJson = JSON.parse(messaggio);
            var msgUtente = msgJson.testo.replace(mittenteServer, '');
            sendMessageToUser(ws.protocol, msgJson.destinatario, msgUtente);
        } catch (error) {
            logger.error("Errore @onmessage " + error);
        }
    });
    ws.on('close', function close() {
        logger.debug('disconnected:' + ws.protocol);
    });
    //un saluto al client dal server
    ws.send('connesso al server!');
});

function sendMessageToUser(mittente, destinatario, messaggio) {
    var esito = false;
    //logger.debug(mittente + ' invia messaggio a ' + destinatario + ":" + messaggio);
    //loop su tutti i client connessi..
    wss.clients.forEach(function each(wsDestinatario) {
        if (wsDestinatario.readyState === WebSocketServer.OPEN &&
                wsDestinatario.protocol === destinatario) {
            var msgDaInviare;
            if(messaggio !== 'RICHIESTA_STAMPA' &&
               messaggio !== 'stampa_inviata' &&
               messaggio !== 'stampa_contrattazione' &&
               messaggio !== 'stampa_chiusa' &&
               messaggio !== 'stampa_annullata'){
                msgDaInviare=mittente+': '+messaggio+'\t('+new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+')';
            }else{
                msgDaInviare=mittente+':'+messaggio;
            }
            wsDestinatario.send(msgDaInviare);
            esito = true;
        }
    });
    return esito;
}
/**
 * Invia messaggi a diversi utenti
 * 
 * es: 
 * listaMessaggi=
 * [
 *  {'destinatario':'RENERO','msg':'ciao renero'},
 *  {'destinatario':'CARMELO','msg':'ciao carmelo'},
 * ]
 * @param {type} listaMessaggi
 * @returns {undefined}
 */
function sendMessageToMoreUser(listaMessaggi) {
    //loop su tutti i client connessi..
    wss.clients.forEach(function each(wsDestinatario) {
        if (wsDestinatario.readyState === WebSocketServer.OPEN) {
            for (var idxMsg = 0; idxMsg < listaMessaggi.length; idxMsg++) {
                if (listaMessaggi[idxMsg].destinatario === wsDestinatario.protocol) {
                    wsDestinatario.send(listaMessaggi[idxMsg].msg);
                }
            }
        }
    });
}
/* Ogni 30 secondi check client sconnessi*/
/*var interval =
        setInterval(
                function ping() {
                    checkConnessioniBroken();
                }
        , 30000);*/