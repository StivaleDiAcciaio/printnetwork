;
(function () {
    var pnApp = angular.module('printNetworkApp');
    pnApp.factory('serviziRest', ['CONST', '$http', '$location', '$q', function (COSTANTI, $http, $location, $q) {
            var portaDefault = '80';
            var ServiziRest = function () {

                this.autenticazione = function (utente) {
                    return this.post('https://' + $location.host() + "/" + COSTANTI.ENDPOINT.LOGIN, utente, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.trovaPDS = function (paramRicercaPDS) {
                    return this.post('https://' + $location.host() + "/" + COSTANTI.ENDPOINT.TROVA_PDS, paramRicercaPDS, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.registrazione = function (utente) {
                    return this.post('https://' + $location.host() + "/" + COSTANTI.ENDPOINT.REGISTRAZIONE, utente, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.stampa2D = function (data) {
                    return this.post('https://' + $location.host() + "/" + COSTANTI.ENDPOINT.STAMPA_2D, data, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };

                this.geoCodificaIndirizzo = function (indirizzo) {
                    return this.get(COSTANTI.ENDPOINT.GOOGLE_GEOCOD + indirizzo + '&key=' + COSTANTI.KEY_GEOCOD);
                };
                this.infonick = function (nick) {
                    return this.post('https://' + $location.host() + "/" + COSTANTI.ENDPOINT.INFO_NICK, nick, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };

                this.post = function (url, data, token, config) {
                    if (token) {
                        $http.defaults.headers.common.token = token;
                    } else {
                        delete $http.defaults.headers.common.token;
                    }

                    var response = $q.defer();
                    $http.post(url, data, config).then(function (promoteResponse) {
                        response.resolve(promoteResponse.data);
                    }, function (error) {
                        response.reject(error);
                    });
                    return response.promise;
                };
                this.get = function (url, token, config) {
                    if (token) {
                        $http.defaults.headers.common.token = token;
                    } else {
                        delete $http.defaults.headers.common.token;
                    }
                    var q = $q.defer();
                    $http.get(url, config).then(function (d) {
                        var p = d.data;
                        if (p == null || p == "") {
                            var errMsg = "Info non trovata!";
                            q.reject([errMsg]);
                        } else {
                            q.resolve(p);
                        }
                    }, function (error) {
                        q.reject(error);
                    });
                    return q.promise;
                };
            };
            return new ServiziRest();
        }]);
    pnApp.factory('notificationEngine', ['$websocket', 'CONST', '$location', 'serviziRest',function ($websocket, COSTANTI, $location,serviziRest) {
            var NotificationEngine = function () {
                var protocollo = [];
                var utl;//Utente loggato;
                //elenco messaggi ricevuti da Utenti
                var listaMessaggiUtenteRicevuti = [];
                //elenco di notifiche ricevute dal server
                var listaNotificheServer = []; 
                //elenco delle richieste di stampa EFFETTUATE
                //verso altri utenti
                var listaRichiesteStampaOUT = [];
                //elenco delle richieste di stampa RICEVUTE
                //da altri utenti
                var listaRichiesteStampaIN = [];
                var dataStream = null;
                var MAX_SIZE_MESSAGGI_UTENTE=1000;//capienza massima del buffer dei messaggi utente
                var NUM_MESSAGGI_UTENTE_DA_SFOLTIRE=200;//numero messaggi eliminati appena superata la capienza del buffer
                
                /**
                 * Acquisisce le info del mittente che richiede una stampa
                 * e popola il relativo elenco delle richiesta in entrata
                 * @param {type} nick
                 * @param {type} statoRichiesta
                 * @returns {undefined}
                 */
                this.getInfoMittente = function (nick,statoRichiesta){
                    serviziRest.infonick(nick).then(function (response) {
                        if (response.esito) {
                            if (response.utente) {
                              listaRichiesteStampaIN.push({mittente:response.utente,stato:statoRichiesta}); 
                            }
                        } 
                    }, function (err) {
                        console.log(err);
                    });                    
                };
                /**
                 * effettua verifiche sui messaggi in enrtata
                 * filtrando le particolari richieste di stampa/annulla/accetta
                 * dai messaggi da visualizzare a console
                 * @param {type} messaggio
                 * @returns {Boolean}
                 */
                var filtraMessaggioInEntrata = function (messaggio){
                    var esito=false;
                    var end = messaggio.indexOf(":");
                    var mittente = messaggio.substring(0, end);
                    var msgUtente = messaggio.substring(end+1);
                    if (mittente && mittente !== utl.nick){//mittente deve essere diverso da utente loggato
                        if(msgUtente === COSTANTI.RICHIESTA_STAMPA && 
                                listaRichiesteStampaIN && 
                                listaRichiesteStampaIN.length<COSTANTI.NUM_RICHIESTE_STAMPA_IN){
                            //In entrata una richiesta di stampa che non supera il limite delle richieste (contemporanee) in entrata 
                            //verifico che mittente non abbia gia fatto richiesta precedentemente..
                            var richiestaPrecEsistente=false;
                            for (var c = 0; c < listaRichiesteStampaIN.length; c++) {
                                if(listaRichiesteStampaIN[c].mittente.nick === mittente &&
                                        listaRichiesteStampaIN[c].stato === COSTANTI.RICHIESTA_STAMPA){
                                   richiestaPrecEsistente = true;
                                   break;
                                }
                            }
                            if(!richiestaPrecEsistente){
                                serviziRest.infonick({nick:mittente}).then(function (response) {
                                    if (response.esito) {
                                        if (response.utente) {
                                          listaRichiesteStampaIN.push({mittente:response.utente,stato:COSTANTI.RICHIESTA_STAMPA}); 
                                        }
                                    } 
                                }, function (err) {
                                    console.log(err);
                                });                               
                                //listaRichiesteStampaIN.push({mittente:mittente,stato:msgUtente});
                                esito = false; //non e' un messaggio da visualizzare a console Ma una richiesta di stampa in entrata
                            }
                        }else if(msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE ||
                                 msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.ANNULLATA
                                ){
                            //In entrata una contrattazione (Si tratta di una Risposta ad una mia richiesta,
                            //                                  destinatario ha accettato una mia richiesta)
                            // o annullamento richiesta     (non ha accettato)
                            //di stampa da parte del destinatario... verifico
                            //che ci sia stata effettivamente una richiesta precedentemente da parte mia
                            if (listaRichiesteStampaOUT && listaRichiesteStampaOUT.length>0){
                                 for (var i = 0; i < listaRichiesteStampaOUT.length; i++) {
                                     if(listaRichiesteStampaOUT[i].destinatario.nick === mittente &&
                                        listaRichiesteStampaOUT[i].stato === COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA){
                                        //..c'e' stata..aggiorno lo stato della richiesta
                                        listaRichiesteStampaOUT[i].stato = msgUtente;
                                        //non e' un messaggio da mostrare a console ma una Accettazzione/Annullamento di richiesta di stampa in uscita
                                        esito = false;
                                         break;
                                     }
                                 }
                            }
                            //verifico anche se eventuale "ANNULLA" da parte del mittente si riferisca ad una sua precedente 
                            //richiesta in Entrata..
                            if(msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.ANNULLATA && listaRichiesteStampaIN){
                               //..ANNULLA...rimuovo dalle richieste in entrata la vecchia richiesta
                               for (var x = 0; x < listaRichiesteStampaIN.length; x++){
                                   if(listaRichiesteStampaIN[x].mittente.nick === mittente){
                                       listaRichiesteStampaIN.splice(x, 1);
                                       //non e' un messaggio da mostrare a console ma un Annullamento di richiesta di stampa in entrata
                                       esito = false;
                                       break;
                                   }
                               }
                            }
                        }else{
                            // per qualunque altro messaggio..
                            //controllo sul canale delle richieste OUT..
                            if (listaRichiesteStampaOUT && listaRichiesteStampaOUT.length>0){
                                 for (var i = 0; i < listaRichiesteStampaOUT.length; i++) {
                                     //..deve esistere uno stato precedente a "CONTRATTAZIONE"
                                     if(listaRichiesteStampaOUT[i].destinatario.nick === mittente &&
                                        listaRichiesteStampaOUT[i].stato === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE){
                                        esito = true;
                                         break;
                                     }
                                 }
                            }
                            //se non ho trovato nulla sul canale OUT..
                            //provo sul canale IN
                            if (!esito && listaRichiesteStampaIN && listaRichiesteStampaIN.length>0){
                                    for (var z = 0; z < listaRichiesteStampaIN.length; z++) {
                                         //..deve esistere uno stato precedente a "CONTRATTAZIONE"
                                        if(listaRichiesteStampaIN[z].mittente.nick === mittente &&
                                         listaRichiesteStampaIN[z].stato === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE){
                                         esito = true;
                                          break;
                                        }
                                    }
                            } 
                        }
                    }
                    return esito;
                };
                /**
                 * Tenta la connessione con il WebSocket
                 * Se il canale è stato chiuso lo riapre
                 * @returns {undefined}
                 */
                this.connettiWS = function () {
                    if (!dataStream) {
                        utl = JSON.parse(localStorage.getItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO));
                        protocollo.push(utl.nick);
                        protocollo.push(localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                        // Apro connessione con il websocket in SSL
                        // (gestire i certificati self-signed)
                        dataStream = $websocket('wss://' + $location.host() + "/" + COSTANTI.ENDPOINT.NOTIFICHE_WSOCKET, protocollo);
                        dataStream.onMessage(function (message) {
                            if (message.data.startsWith("SERVER")){
                                listaNotificheServer.push(message.data);
                            }else{
                                if(filtraMessaggioInEntrata(message.data)){
                                    var end = message.data.indexOf(":");
                                    var mittente = message.data.substring(0, end);
                                    if(listaMessaggiUtenteRicevuti.length>=MAX_SIZE_MESSAGGI_UTENTE){
                                        listaMessaggiUtenteRicevuti.splice(0, NUM_MESSAGGI_UTENTE_DA_SFOLTIRE);
                                    }
                                    listaMessaggiUtenteRicevuti.push({mittente:mittente,msg:message.data});
                                }
                            }
                        });
                        dataStream.onClose(function () {
                            console.log("connessione chiusa con il server");
                        });
                    } else if (dataStream.readyState !== 1) {
                        //persa connessione con il socket server..
                        dataStream.reconnect();
                    }
                };
                this.chatUtente = function (destinatario, msg) {
                    this.inviaMessaggio(destinatario, msg);
                };

                this.inviaRichiestaStampa = function (destinatario) {
                    var inviato = false;
                    if (listaRichiesteStampaOUT && listaRichiesteStampaOUT.length>0){
                        for (var lrs = 0; lrs < listaRichiesteStampaOUT.length; lrs++) {
                            //verifico che non sia gia stata inviata richiesta stampa al destinatario
                            if(listaRichiesteStampaOUT[lrs].destinatario.nick === destinatario.nick){
                                inviato=true;
                                break;
                            }
                        }
                    }
                    if(destinatario.nick !== utl.nick && !inviato){
                       //memorizzo alcune info nell'array delle richieste (coordinates[0] ->longitudine coordinates[1] ->latitudine)
                        this.inviaMessaggio(destinatario.nick, COSTANTI.RICHIESTA_STAMPA);
                       //listaRichiesteStampaOUT.push({destinatario:destinatario.nick,stato:COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA,destinatarioPos:destinatario.location.coordinates,indirizzoDestinatario:destinatario.indirizzo.descrizione,feedback:destinatario.feedback});   
                       listaRichiesteStampaOUT.push({destinatario:destinatario,stato:COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA});   
                    }
                };
                /**
                 * Accetta/Rifiuta richiesta di stampa in entrata 
                 * @param {type} nickDestinatario
                 * @param {type} azione
                 * @returns {undefined}
                 */
                this.richiestaStampaInEntrata = function (nickDestinatario,azione) {
                    var invio = false;
                    //accettata/rifiutata richiesta...
                    //aggiorno lo stato del canale IN entrata..
                    for (var z = 0; z < listaRichiesteStampaIN.length; z++) {
                        //..deve esistere uno stato precedente a "CONTRATTAZIONE"
                        if(listaRichiesteStampaIN[z].mittente.nick === nickDestinatario &&
                            listaRichiesteStampaIN[z].stato === COSTANTI.RICHIESTA_STAMPA){
                            if(azione==='accetta'){
                               listaRichiesteStampaIN[z].stato=COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE;
                            }else{
                               listaRichiesteStampaIN.splice(z, 1);//se rifiuto la richiesta in entrata..la elimino dall'elenco
                            }
                            invio = true;
                            break;
                        }
                    }
                    if(invio){
                      this.inviaMessaggio(nickDestinatario,(azione==='accetta'?COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE:COSTANTI.STATO_RICHIESTE_STAMPA.ANNULLATA));
                    }
                };
                
                this.inviaMessaggio = function (nick, data) {
                    if (nick && data) {
                        this.connettiWS();
                        dataStream.send({destinatario:nick,testo:data});
                    }
                };
                this.getMessaggiUtente = function () {
                    return listaMessaggiUtenteRicevuti;
                };
                this.getNotificheServer = function () {
                    return listaNotificheServer;
                };
                this.getRichiesteStampaEntrata = function () {
                    return listaRichiesteStampaIN;
                };
                this.getRichiesteStampaUscita = function () {
                    return listaRichiesteStampaOUT;
                };
                               
                this.pingWs = function () {
                    this.connettiWS();
                };
                this.chiudiWs = function () {
                    if (dataStream)
                        dataStream.close();
                };
                this.isConnected = function () {
                    return (dataStream !== null && dataStream.readyState === 1) ? true : false;
                };
                this.isRichiestaStampa = function(stato){
                  return stato===COSTANTI.RICHIESTA_STAMPA?true:false;
                };
            };
            return new NotificationEngine();
        }]);
}());
