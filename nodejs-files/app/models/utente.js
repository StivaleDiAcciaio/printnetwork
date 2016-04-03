// ===== ottengo un'istanza di mongoose e mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// ======================================================
 
// configurazione di un modello mongoose.
// tramite il module.exports viene reso disponibile ai moduli che lo richiedano
module.exports = mongoose.model('Utente', new Schema({ 
    nome: String, 
    cognome: String, 
    email: String, 
    indirizzo: String,
    nick: String, 
    password: String, 
    tipologiaUtente:String,/* P: privato, A: attivita commerciale */
    tipologiaStampa: {
        stampa2D: {
            colore: String, /* B: bianco e nero, C: colori */
            formato: [String] /* A4,A3,A2...TUTTI */
        },
        stampa3D:{
            dimensioniMax:String, /* altezza X larghezza X profondita  (cm) */
            materiale: String /* Legno, PVC etc..*/
        }        
    }
}));