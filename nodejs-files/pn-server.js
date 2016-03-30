// =======================
// Packages di cui abbiamo bisogno ============
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
appRouter.get('/login', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET");

    var user = {
        nome: 'sasa'
    };
    var token = jwt.sign(user, app.get('superSecret'), {
        expiresIn: '5h'
    });
    res.json({data: 'login effettuato!',
        token: token
    }
    );
});

//Il metodo di Registrazione non richiede autenticazione
appRouter.post('/registrazione', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST");
    moduloDbUtente.creaUtente(function (risultato) {
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
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST DELETE");

    //aggiungere IF sul metodo della request
    if (req.method === 'GET' ||
            req.method === 'PUT' ||
            req.method === 'POST' ||
            req.method === 'DELETE') {
        // controllo header o parametri url o parametri post per il token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifica secret e scadenza
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    res.status(400).send({
                        esito: false,
                        messaggio: 'Token invalido!'
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
            res.status(400).send({
                esito: false,
                messaggio: 'Nessun Token Fornito.'
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
