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
var Utente = require('./app/models/utente'); // mongoose model
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
    // create a sample user
    var nick = new Utente({
        nome: 'Marta',
        cognome: 'Arinisi',
        email: 'marta.arinisi@gmail.com',
        nick: 'martuccia',
        password: '123',
        tipologiaUtente: 'privato'
    });
   // save the sample user
    nick.save(function (err) {
        if (err)
            console.log("errore salvataggio");

        console.log('Utente salvato successfully');
        res.json({success: true});
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
                        success: false,
                        message: 'Token invalido!'
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
                success: false,
                message: 'Nessun Token Fornito.'
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
console.log('nodJs server in ascolto sulla porta ' + porta);
