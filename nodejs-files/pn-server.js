var express = require('express');
var app = express();
var appRouter = express.Router();
var porta = 3000;
var config = require('./config'); // mio file di configurazione
var jwt    = require('jsonwebtoken'); // usato per creare e verificare tokens
app.set('superSecret', config.secret); // parola segreta per generazione token

appRouter.get('/', function (req, res) {
    res.json({data: 'PrintNetwork HOME'});
});

appRouter.get('/2D', function (req, res) {
    res.json({data: 'stampa 2D avviata!'});
});

appRouter.get('/3D', function (req, res) {
    var user ={
        nome : 'sasa'
    };
    var token = jwt.sign(user, app.get('superSecret'), {
        expiresIn: '5h'
    });
    res.json({data: 'stampa 3D avviata!',
              token: token
             }
    );
});

app.use('/apinode', appRouter);
app.listen(3000);
console.log('nodJs server in ascolto sulla porta ' + porta);
