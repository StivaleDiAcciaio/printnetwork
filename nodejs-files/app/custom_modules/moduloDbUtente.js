var Utente = require('../models/utente'); // mongoose model

module.exports = {
    creaUtente: function (utenteReq,callback) {
        // crea un Modello Utente definito nello schema di mongoDB 
        var nick = new Utente({
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
