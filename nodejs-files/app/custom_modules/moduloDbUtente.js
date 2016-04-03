var Utente = require('../models/utente'); // mongoose model

module.exports = {
    creaUtente: function (callback) {
        // create a sample user
        var nick = new Utente({
            nome: 'Topolino',
            cognome: 'Marta',
            email: 'topolino@gmail.com',
            nick: 'TopoMarta',
            password: '123',
            tipologiaUtente: 'privato'
        });
        // save the sample user
        nick.save(function (err) {
            if (err) {
                var data={};
                data.esito = false;
                data.messaggio=err;
                callback(data);
            } else {
                var data={};
                data.esito = true;
                data.messaggio='salvataggio effettuato con successo';
                callback(data);
            }
        });
    }
};
