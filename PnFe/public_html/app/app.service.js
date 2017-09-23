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
    pnApp.factory('notificationEngine', ['$websocket', 'CONST', '$location', function ($websocket, COSTANTI, $location) {
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
                                /**
                 * effettua verifiche sui messaggi in enrtata
                 * @param {type} messaggio
                 * @returns {Boolean}
                 */
                var checkMessaggioInEntrata = function (messaggio){
                    var esito=false;
                    var end = messaggio.indexOf(":");
                    var mittente = messaggio.substring(0, end);
                    var msgUtente = messaggio.substring(end+1);
                    if (mittente && mittente != utl.nick){
                        if(msgUtente === COSTANTI.RICHIESTA_STAMPA && 
                                listaRichiesteStampaIN && 
                                listaRichiesteStampaIN.length<COSTANTI.NUM_RICHIESTE_STAMPA_IN){
                            //In entrata una richiesta di stampa che non supera il limite delle richieste in entrata
                            //verifico che mittente non abbia gia fatto richiesta precedentemente..
                            var richiestaPrecEsistente=false;
                            for (var c = 0; c < listaRichiesteStampaIN.length; c++) {
                                if(listaRichiesteStampaIN[c].mittente === mittente &&
                                        listaRichiesteStampaIN[c].stato === COSTANTI.RICHIESTA_STAMPA){
                                   richiestaPrecEsistente = true;
                                   break;
                                }
                            }
                            if(!richiestaPrecEsistente){
                                listaRichiesteStampaIN.push({mittente:mittente,stato:msgUtente});
                                esito = false; //non e' un messaggio da visualizzare a console Ma una richiesta di stampa in entrata
                            }
                        }else if(msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE ||
                                 msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.ANNULLATA
                                ){
                            //In entrata una contrattazione (destinatario ha accettato una mia richiesta)
                            // o annullamento richiesta
                            //di stampa da parte del destinatario... verifico
                            //che ci sia effettivamente stata una richiesta precedentemente
                            if (listaRichiesteStampaOUT && listaRichiesteStampaOUT.length>0){
                                 for (var i = 0; i < listaRichiesteStampaOUT.length; i++) {
                                     if(listaRichiesteStampaOUT[i].destinatario === mittente &&
                                        listaRichiesteStampaOUT[i].stato === COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA){
                                        //..c'e' stata..aggiorno lo stato della richiesta
                                        listaRichiesteStampaOUT[i].stato = msgUtente;
                                        if(msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE){
                                            //richiesta di stampa accettata ...
                                            listaRichiesteStampaIN.push({mittente:mittente,stato:msgUtente});
                                        }else if(msgUtente === COSTANTI.STATO_RICHIESTE_STAMPA.ANNULLATA && listaRichiesteStampaIN){
                                           //..ANNULLA...rimuovo dalle richieste in entrata la vecchia richiesta
                                           for (var x = 0; x < listaRichiesteStampaIN.length; x++){
                                               if(listaRichiesteStampaIN[x].mittente === mittente){
                                                   listaRichiesteStampaIN.splice(x, 1);
                                                   break;
                                               }
                                           }
                                        }
                                        //non e' un messaggio da mostrare a console ma una Accettazzione/Annullamento di richiesta di stampa in uscita
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
                                     if(listaRichiesteStampaOUT[i].destinatario === mittente &&
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
                                        if(listaRichiesteStampaIN[z].mittente === mittente &&
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
                                if(checkMessaggioInEntrata(message.data)){
                                    var end = message.data.indexOf(":");
                                    var mittente = message.data.substring(0, end);
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
                    this.inviaMessaggio(destinatario, COSTANTI.RICHIESTA_STAMPA);
                    listaRichiesteStampaOUT.push({destinatario:destinatario,stato:COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA});
                };
                
                this.accettaRichiestaStampa = function (destinatario) {
                    console.log("accetto la richiesta stampa di "+destinatario);
                    //accettata richiesta...
                    //aggiorno lo stato del canale IN entrata..
                    for (var z = 0; z < listaRichiesteStampaIN.length; z++) {
                        //..deve esistere uno stato precedente a "CONTRATTAZIONE"
                        if(listaRichiesteStampaIN[z].mittente === destinatario &&
                            listaRichiesteStampaIN[z].stato === COSTANTI.RICHIESTA_STAMPA){
                        
                            listaRichiesteStampaIN[z].stato =COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE;
                            break;
                        }
                    }
                    this.inviaMessaggio(destinatario, COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE);
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
