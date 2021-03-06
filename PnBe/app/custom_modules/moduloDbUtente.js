var Utente = require('../models/utente'); // mongoose model
var md5 = require('js-md5');
var LUNGHEZZA_MAX_GENERICA = 50;
module.exports = {
    precheckCreazioneUtente: function (utenteReq, callback) {
        if (validaInputCreaUtente(utenteReq)) {
            //Verifico che non esista già un utente 
            //con la stessa Email..o con lo stesso Nick
            Utente.findOne({$or: [{email: utenteReq.email.toUpperCase()}, {nick: utenteReq.nick.toUpperCase()}]
            }, function (err, utente) {
                var data = {};
                if (err) {
                    data.esito = false;
                    data.codErr = 500;
                    data.messaggio = err;
                } else if (utente) {
                    data.esito = false;
                    if (utente.nick.toUpperCase() === utenteReq.nick.toUpperCase()) {
                        data.codErr = 10;
                        data.messaggio = "indirizzo nick gia' utilizzato";
                    } else if (utente.email.toUpperCase() === utenteReq.email.toUpperCase()) {
                        data.codErr = 20;
                        data.messaggio = "indirizzo email gia' utilizzato";
                    }
                    callback(data);
                } else if (!utente) {
                    //indirizzo email/nick non utilizzati..
                    var data = {};
                    data.esito = true;
                    data.codErr = 0;
                    data.messaggio = 'precheck creazione utente ok';
                    callback(data);
                }
            });
        } else {//Input non valido
            var data = {};
            data.esito = false;
            data.codErr = 2;
            data.messaggio = 'form invalido';
            callback(data);
        }
    },
    creaUtente: function (utenteReq, callback) {
        // creo un Modello Utente definito nello schema di mongoDB 
        //cifro password prima di salvarla
        md5(utenteReq.password);
        var hash = md5.create();
        hash.update(utenteReq.password);
        var pwdCriptata = hash.hex();

        var nuovoUtente = new Utente({
            nick: utenteReq.nick.toUpperCase(),
            email: utenteReq.email.toUpperCase(),
            password: pwdCriptata,
            tipologiaUtente: utenteReq.tipologiaUtente,
            indirizzo: utenteReq.indirizzo,
            tipologiaStampa: utenteReq.tipologiaStampa,
            feedback: 0, //valore di default per feedback
            location: utenteReq.location
        });
        // salva Utente nel DB
        nuovoUtente.save(function (err) {
            var data = {};
            if (err) {
                data.esito = false;
                data.codErr = 500;
                data.messaggio = err;
            } else {
                data.esito = true;
                data.codErr = 0;
                data.messaggio = 'salvataggio effettuato con successo';
            }
            callback(data);
        });
    },
    cercaUtente: function (utenteReq, callback) {
        // ricerca Utente
        Utente.findOne({
            email: utenteReq.email.toUpperCase()
        }, function (err, utente) {
            var data = {};
            if (err) {
                data.esito = false;
                data.codErr = 500;
                data.messaggio = err;
            } else if (!utente) {
                data.esito = false;
                data.codErr = 3;
                data.messaggio = 'Utente non trovato.';
            } else if (utente) {
                //cifro password
                md5(utenteReq.password);
                var hash = md5.create();
                hash.update(utenteReq.password);
                var pwdCriptata = hash.hex();
                // controllo password
                if (utente.password !== pwdCriptata) {
                    data.esito = false;
                    data.codErr = 4;
                    data.messaggio = 'Email/password errati.';
                } else {
                    data.esito = true;
                    data.codErr = 0;
                    data.messaggio = 'Autenticazione riuscita.';
                    data.utente = utente;
                }
            }
            callback(data);
        });
    },infoNick: function (nickUtente, callback) {
        // ricerca Utente
        Utente.findOne({
            nick: nickUtente
        },{ nick: 1,tipologiaUtente: 1,indirizzo: 1,tipologiaStampa: 1,feedback: 1, location: 1}, function (err, utente) {
            var data = {};
            if (err) {
                data.esito = false;
                data.codErr = 500;
                data.messaggio = err;
            } else if (!utente) {
                data.esito = false;
                data.codErr = 3;
                data.messaggio = 'Utente non trovato.';
            } else if (utente) {
                data.esito = true;
                data.codErr = 0;
                data.messaggio = 'utente trovato';
                data.utente = utente;
            }
            callback(data);
        });
    },trovaPDS: function (paramRicercaPDS, callback) {
        // ricerca Utenti PDS nel raggio di 5 km
        Utente.find({
            location: {$near:
                        {
                            $geometry: {type: "Point", coordinates: [paramRicercaPDS.lng, paramRicercaPDS.lat]},
                            $minDistance: 0,
                            $maxDistance: 5000
                        }
            }
        },{ nick: 1,tipologiaUtente: 1,indirizzo: 1,tipologiaStampa: 1,feedback: 1, location: 1}, function (err, utentiPds) {
            var data = {};
            if (err) {
                data.esito = false;
                data.codErr = 500;
                data.messaggio = err;
            } else if (!utentiPds) {
                data.esito = false;
                data.codErr = 3;
                data.messaggio = 'punti di stampa non trovati';
            } else if (utentiPds) {
                data.esito = true;
                data.codErr = 0;
                data.messaggio = 'punti di stampa trovati';
                data.utentiPds = utentiPds;
            }
            callback(data);
        }).sort( { feedback: -1 } );
    }
};

validaInputCreaUtente = function (utente) {
    if (!utente.nick ||
            !utente.email ||
            !utente.password) {
        return false;
    } else {
        if (utente.nick.length == 0 || utente.nick.length > LUNGHEZZA_MAX_GENERICA ||
                utente.email.length == 0 || utente.email.length > LUNGHEZZA_MAX_GENERICA ||
                utente.password.length == 0 || utente.password.length > LUNGHEZZA_MAX_GENERICA
                ) {
            return false;
        }
    }
    //Se ha scelto di condividere stampante..
    if (utente.tipologiaUtente && utente.tipologiaUtente.length > 1) {
        return false;
    } else if (utente.tipologiaUtente && utente.tipologiaUtente.length == 1) {
        //verifico i campi necessari..
        if (!utente.tipologiaStampa) {
            return false;
        } else {
            //indirizzo più stampa2D o stampa3D obbligatori
            return checkIndirizzoCompilato(utente.indirizzo) &&
                    (
                            checkStampa2DCompilata(utente.tipologiaStampa.stampa2D) ||
                            checkStampa3DCompilata(utente.tipologiaStampa.stampa3D)
                            );

        }
    }

    if (!utente.indirizzo || !utente.indirizzo.descrizione) {
        var location = {};
        var lng = 0, lat = 0;
        location.type = 'Point';
        location.coordinates = [lng, lat];
        utente.location = location;
    }
    return true;
};

checkIndirizzoCompilato = function (indirizzo) {
    var valido = true;
    try {
        if (!indirizzo || !indirizzo.tipoIndirizzo || !indirizzo.descrizione) {
            valido = false;
        } else if (indirizzo.tipoIndirizzo.length > 1 || indirizzo.descrizione.length > LUNGHEZZA_MAX_GENERICA) {
            valido = false;
        }
    } catch (err) {
        valido = false;
    }
    return valido;
};
checkStampa2DCompilata = function (stampa2d) {
    var valido = true;
    try {
        if (!stampa2d || !stampa2d.colore || !stampa2d.formato) {
            valido = false;
        } else if (stampa2d.colore.length > 1 || stampa2d.formato.length > 5) {//5 elementi al massimo
            valido = false;
        } else {
            for (var i = 0; i < stampa2d.formato.length; i++) {
                if (!stampa2d.formato[i].value || stampa2d.formato[i].value.length > 2 ||
                        !stampa2d.formato[i].label || stampa2d.formato[i].label.length > 15
                        ) {
                    valido = false;
                    break;
                }
            }
        }
    } catch (err) {
        valido = false;
    }
    return valido;
};
checkStampa3DCompilata = function (stampa3d) {
    var valido = true;
    try {
        if (!stampa3d || !stampa3d.altezza || !stampa3d.larghezza || !stampa3d.profondita || !stampa3d.unitaDimisura ||
                !stampa3d.materiale) {
            valido = false;
        } else if (stampa3d.altezza.length > 4 || stampa3d.larghezza.length > 4 || stampa3d.profondita.length > 4) {
            valido = false;
        } else if (stampa3d.unitaDimisura.length > 2 || stampa3d.materiale.length > 20) {
            valido = false;
        }
    } catch (err) {
        valido = false;
    }
    return valido;
};
