var Utente = require('../models/utente'); // mongoose model

module.exports = {
    creaUtente: function (utenteReq, callback) {
        // crea un Modello Utente definito nello schema di mongoDB 
        var utente = new Utente({
            nome: utenteReq.nome,
            cognome: utenteReq.cognome,
            email: utenteReq.email,
            indirizzo: utenteReq.indirizzo,
            nick: utenteReq.nick,
            password: utenteReq.password,
            tipologiaUtente: utenteReq.tipologiaUtente,
            tipologiaStampa: utenteReq.tipologiaStampa
        });

        // salva Utente nel DB
        utente.save(function (err) {
            var data = {};
            if (err) {
                data.esito = false;
                data.messaggio = err;
            } else {
                data.esito = true;
                data.messaggio = 'salvataggio effettuato con successo';
            }
            callback(data);
        });
    },
    cercaUtente: function (utenteReq, callback) {
        // ricerca Utente
        Utente.findOne({
            email: utenteReq.email
        }, function (err, utente) {
            var data = {};
            if (err) {
                data.esito = false;
                data.messaggio = err;
            } else if (!utente) {
                data.esito = false;
                data.messaggio = 'Autenticazione fallita. Utente non trovato.';
            } else if (utente) {
                // controllo password
                if (utente.password !== utenteReq.password) {
                    data.esito = false;
                    data.messaggio = 'Autenticazione fallita. Email/password errati.';
                } else {
                    data.esito = true;
                    data.messaggio = 'Autenticazione riuscita.';
                    data.utente = utente;
                }
            }
            callback(data);
        });
    }
};
