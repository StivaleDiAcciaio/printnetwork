// ===== ottengo un'istanza di mongoose e mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// ======================================================

// configurazione di un modello mongoose.
// tramite il module.exports viene reso disponibile ai moduli che lo richiedano
module.exports = mongoose.model('Utente', new Schema({
    nick: String,
    email: String,
    password: String,
    tipologiaUtente: String, /* P: privato, A: attivita commerciale */
    indirizzo: {
        tipoIndirizzo: String,
        descrizione: String
    },
    tipologiaStampa: {
        stampa2D: {
            colore: String, /* B: bianco e nero, C: colori */
            formato: [{value: String, label: String}] /* {A4,216 × 279 mm}.. */
        },
        stampa3D: {
            altezza: Number,
            larghezza: Number,
            profondita: Number,
            unitaDimisura: String,
            materiale: String /* Legno, PVC etc..*/
        }
    }
}));