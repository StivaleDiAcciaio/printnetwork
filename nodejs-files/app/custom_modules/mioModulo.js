var Utente = require('../models/utente'); // mongoose model

module.exports = {
    creaUtente: function (callback) {
        // create a sample user
        var nick = new Utente({
            nome: 'Stivale',
            cognome: 'DiAcciaio',
            email: 'lostivalediacciaio@gmail.com',
            nick: 'Stivale',
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
