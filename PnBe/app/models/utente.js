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
            formato: [{value:String,label:String}] /* {A4,216 × 279 mm}.. */
        },
        stampa3D:{
            dimensioniMax: String, /* altezza X larghezza X profondita  (cm) */
            unitaDimisura: String,
            materiale: String /* Legno, PVC etc..*/
        }        
    }
}));