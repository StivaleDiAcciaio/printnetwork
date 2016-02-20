var express     = require('express');
var app = express();
var appRouter   = express.Router();
var porta = 3000;

appRouter.get('/', function(req, res) {
    res.json({ data: 'PrintNetwork HOME'});
});

appRouter.get('/2D', function(req, res) {
   res.json({ data: 'stampa 2D avviata!'});
});

appRouter.get('/3D', function(req, res) {
   res.json({ data: 'stampa 3D avviata!'});
});

app.use('/apinode', appRouter);
app.listen(3000);
console.log('nodJs server in ascolto sulla porta '+porta );
