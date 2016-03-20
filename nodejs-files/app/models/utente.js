// ottengo un'istanza di mongoose emongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// configurazione di un modello mongoose.
// tramite il module.exports viene reso disponibile ai moduli che lo richiedano
module.exports = mongoose.model('Utente', new Schema({ 
    nome: String, 
    cognome: String, 
    email: String, 
    nick: String, 
    password: String, 
    tipologiaUtente:String 
}));