var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var appRouter = express.Router();
var porta = 3000;
var config = require('./config'); // mio file di configurazione
var jwt = require('jsonwebtoken'); // usato per creare e verificare tokens
app.set('superSecret', config.secret); // parola segreta per generazione token
// uso body parser per ottenere info da POST e/o URL parameters
app.use(bodyParser.urlencoded({extended: false}));
// create application/json parser
app.use(bodyParser.json());

appRouter.get('/login', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");

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

// route middleware per verificare il token
appRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");

    // controllo header o parametri url o parametri post per il token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifica secret e scadenza
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Token invalido!'});
            } else {
                // se OK, salvo la richiesta per gli altri routes
                console.log('Token ok');
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // se non è presente nessun token
        // restituisco un errore
        /*        console.log("Token non fornito");
         return res.status(403).send({
         success: false,
         message: 'Nessun token fornito.'
         });*/
        res.json({data: 'nessun token fornito',
            token: token
        }
        );


    }
});


appRouter.post('/2D', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    console.log("Stampa 2d: token" + req.body.token);
    
    req.accepts('application/json');
    res.json({data: 'stampa 2D avviata!', token: req.decoded});
});


app.use('/apinode', appRouter);
app.listen(3000);
console.log('nodJs server in ascolto sulla porta ' + porta);
