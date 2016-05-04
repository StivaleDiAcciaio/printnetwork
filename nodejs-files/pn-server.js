// =======================
// Packages, Moduli e Oggetti di cui abbiamo bisogno ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var appRouter = express.Router();
var jwt = require('jsonwebtoken'); // usato per creare e verificare tokens
var config = require('./config'); // mio file di configurazione
var moduloDbUtente = require('./app/custom_modules/moduloDbUtente');
var Utente = require('./app/models/utente'); // mongoose model
var log4js = require('log4js');
// ===============================================================
// =======================
// Configurazione ============
// =======================
var porta = 3000;
mongoose.connect(config.database); // connect to database
// parola segreta per generazione token
app.set('superSecret', config.secret);
// uso body parser per ottenere info da POST e/o URL parameters
app.use(bodyParser.urlencoded({extended: false}));
// create application/json parser
app.use(bodyParser.json());
log4js.configure({
    appenders: [
        {type: 'file', filename: 'app/pn-server.log', category: 'pn-server'}
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('pn-server');
logger.setLevel('DEBUG');
// 
// =======================
// ============
// =======================


//Il metodo di Login non richiede autenticazione
appRouter.post('/login', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, token, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST");
    var esito = null;
    var token = null;
    // logger.debug("password "+req.body.utente.password);
    if (req.body.utente) {
        //logger.debug("email da verificare " + req.body.utente.email);
        //verifica utente su DB
        moduloDbUtente.cercaUtente(req.body.utente, function (risultato) {
            if (!risultato.esito) {
                logger.error(risultato.messaggio);
                res.json({
                    esito: risultato.esito,
                    messaggio: risultato.messaggio
                });
            } else {
                var utenteLoggato = risultato.utente;
                token = jwt.sign(utenteLoggato, app.get('superSecret'), {
                    expiresIn: '5h'
                });
                res.json({
                    esito: risultato.esito,
                    messaggio: risultato.messaggio,
                    token: token,
                    utenteLoggato: utenteLoggato
                });
            }
        });
    }
});
//Il metodo di Registrazione non richiede autenticazione
appRouter.post('/registrazione', function (req, res) {
    //======== Abilito il CROSS DOMAIN 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, token, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST");
    //================================

    moduloDbUtente.creaUtente(req.body.utente, function (risultato) {
        if (!risultato.esito) {
            logger.error('errore durante creazione utente');
            logger.error(risultato.messaggio);
            res.status(500).send({
                esito: risultato.esito,
                messaggio: 'errore durante creazione utente'
            });
        } else {
            res.json({esito: risultato.esito,
                messaggio: risultato.messaggio});
        }
    });
});
/* Route middleware per verificare il token
 * Viene posto prima dei metodii che richiedono autenticazione
 */
appRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, token, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST DELETE");
    //aggiungere IF sul metodo della request
    if (req.method === 'GET' ||
            req.method === 'PUT' ||
            req.method === 'POST' ||
            req.method === 'DELETE') {
        // controllo header o parametri url o parametri post per il token
        var token = req.headers.token;
        logger.debug("Token "+token);
        // decode token
        if (token != "null") {
            // verifica secret e scadenza
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    res.status(401).send({
                        esito: false,
                        messaggio: 'Utente non autenticato!'
                    });
                } else {
                    // se OK, salvo la richiesta per gli altri routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // se non è presente nessun token
            // restituisco un errore
            res.status(401).send({
                esito: false,
                messaggio: 'Utente non autenticato!'
            });
        }
    } else {
        //In caso di metodo OPTIONS restituisco 
        //un json vuoto
        res.status(200);
        res.json({});
    }
});
/**
 * Metodi Rest che necessitano l'autenticazione
 */

appRouter.post('/2D', function (req, res) {
    req.accepts('application/json');
    res.json({data: 'stampa 2D avviata!', token: req.decoded});
});
//Imposto radice /apinode per tutte le chiamate ai rest nodejs (es: /apinode/login )
app.use('/apinode', appRouter);
app.listen(porta);
logger.debug('nodJs server in ascolto sulla porta ' + porta);
