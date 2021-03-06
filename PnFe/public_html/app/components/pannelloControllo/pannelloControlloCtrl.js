;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$filter', '$state', 'serviziRest', 'CONST', 'NgMap', '$timeout', '$q', '$interval','$translate',
                function ($scope, $filter, $state, serviziRest, COSTANTI, NgMap, $timeout, $q, $interval,$translate) {
                    /* notification engine sta nello scope del mainCtrl */
                    $scope.listaMessaggiUtente = $scope.notificationEngine.getMessaggiUtente();
                    $scope.$watch('listaMessaggiUtente.length', function() {
                       var ultimoMsgIdx=($scope.listaMessaggiUtente.length) -1;
                        if($scope.listaMessaggiUtente.length>0 && $scope.listaMessaggiUtente[ultimoMsgIdx].mittente!=='io'){
                           $scope.segnalaMessaggioInEntrata(true);
                       }
                    });
                    $scope.listaNotificheServer = $scope.notificationEngine.getNotificheServer();
                    $scope.listaRichiesteStampaEntrata = $scope.notificationEngine.getRichiesteStampaEntrata();
                    $scope.listaRichiesteStampaUscita = $scope.notificationEngine.getRichiesteStampaUscita();
                    $scope.COSTANTI=COSTANTI;
                    $scope.geoPartenza=null;
                    $scope.geoArrivo=null;
                    $scope.mezzoTrasporto=null;
                    $scope.mostraPannelloDirezione=false;
                    $scope.mostraChat=false;
                    $scope.destinatarioChat=null;
                    $scope.numeroContatti=0;
                   
                    /*$scope.$on("messaggio_in_entrata", function(event, message){
                         if(message==="apri-pannello-chat" && $scope.listaMessaggiUtente && $scope.listaMessaggiUtente.length>0){
                             $scope.mostraChat=!$scope.mostraChat;
                         }
                    });*/
                    
                    $scope.segnalaMessaggioInEntrata = function(flagSegnale){
                      $scope.$emit('messaggio', (flagSegnale||flagSegnale===undefined)?"nuovo-messaggio":"");  
                    };
                    $scope.mostraInfoPartenza = function(){
                        $scope.infoWindowsPartenza = !$scope.infoWindowsPartenza;
                        $scope.scrollTo('infoPDSscroll');
                    };
                    $scope.numeroNotifiche = function(){
                      $scope.numeroNotificheServer=$scope.listaNotificheServer.length===null?0:$scope.listaNotificheServer.length;
                      $scope.numeroRichiesteStampaEntrata=$scope.listaRichiesteStampaEntrata.length===null?0:$scope.listaRichiesteStampaEntrata.length;
                      $scope.verificaNuoviMessaggi();
                      return $scope.numeroNotificheServer+$scope.numeroRichiesteStampaEntrata;
                    };
                    /**
                     * conta il numero dei contatti con cui si puo chattare
                     * @returns {Number}
                     */
                    $scope.numeroRisposteRicevute = function(){
                      var numRisposte=0;
                      $scope.listaRichiesteStampaUscita.forEach(function(richiestaUscita) {
                            if(richiestaUscita.stato === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE || 
                                    richiestaUscita.stato === COSTANTI.STATO_RICHIESTE_STAMPA.ACCETTATA){
                                numRisposte++;
                            }
                      });
                      $scope.numeroContatti=numRisposte;
                      $scope.verificaNuoviMessaggi();
                      return numRisposte;
                    };
                    $scope.numeroRichiestaStampaEffettuate = function(){
                        var numeroRichiesteEffettuate=0;
                        if ($scope.listaRichiesteStampaUscita){
                            $scope.listaRichiesteStampaUscita.forEach(function(richiestaUscita,idx) {
                            if(richiestaUscita.stato === COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA){
                               numeroRichiesteEffettuate++;
                             }
                         });
                        }
                        return numeroRichiesteEffettuate;
                    };
                    $scope.invioMessaggio = function(nickDestinatario,messaggioDaInviare){
                        $scope.notificationEngine.chatUtente(nickDestinatario, messaggioDaInviare);
                        if(messaggioDaInviare===COSTANTI.STATO_RICHIESTE_STAMPA.CHIUSA){
                          for (var x = 0; x < $scope.listaRichiesteStampaUscita.length; x++){
                            if($scope.listaRichiesteStampaUscita[x].destinatario.nick === nickDestinatario){
                                $scope.listaRichiesteStampaUscita.splice(x, 1);
                                break;
                            }
                          } 
                        }
                    };
                    $scope.apriChat = function (contatti) {
                        if(contatti.stato === COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE || contatti.stato === COSTANTI.STATO_RICHIESTE_STAMPA.ACCETTATA){
                            contatti.visualizzata=true;
                            $scope.leggoMessaggioContatto(contatti.destinatario.nick);
                            $scope.verificaNuoviMessaggi();
                            $scope.destinatarioChat=contatti.destinatario;
                            $scope.mostraChat = !$scope.mostraChat;                            
                        }
                    };
                    $scope.leggoMessaggioContatto = function(nickContatto){
                         $scope.listaMessaggiUtente.forEach(function(messaggiUtenteInEntrata) {
                            if(messaggiUtenteInEntrata.mittente===nickContatto){
                                //segno come letto il messaggio di un contatto che sto visualizzando..
                                messaggiUtenteInEntrata.visualizzata=true;
                            }
                        });
                    };
                    $scope.verificaNuoviMessaggi = function(){
                        var segnalaNotifica=false;
                        //verifica su contatti non letti(escludo richieste effettuate da me)
                        $scope.listaRichiesteStampaUscita.forEach(function(richiestaUscita) {
                            if(richiestaUscita.stato !== COSTANTI.STATO_RICHIESTE_STAMPA.INVIATA && !richiestaUscita.visualizzata){
                                //se esiste anche una sola voce sotto il menu Contatti non visualizzata...
                                segnalaNotifica=true;
                            }
                        });
                        //verifica su messaggi utente non letti(escludo richieste effettuate da me)
                        $scope.listaMessaggiUtente.forEach(function(messaggiUtenteInEntrata) {
                            if(messaggiUtenteInEntrata.mittente!=='io' && !messaggiUtenteInEntrata.visualizzata){
                                //se esiste anche una solo messaggio non letto...
                                segnalaNotifica=true;
                            }
                        });
                        //verifica su notifiche non lette
                        if($scope.numeroNotificheServer+$scope.numeroRichiesteStampaEntrata>0){
                            segnalaNotifica=true;
                        }
                      $scope.segnalaMessaggioInEntrata(segnalaNotifica);
                    };
                    $scope.checkMessaggiUtenteNonLetti = function(nickUtente){
                        var nonLetti=false;
                        $scope.listaMessaggiUtente.forEach(function(messaggiMittente) {
                            if(messaggiMittente.mittente===nickUtente && !messaggiMittente.visualizzata){
                                //se esiste anche una solo messaggio non letto...
                                nonLetti=true;
                            }
                        });                 
                        return nonLetti;
                    };
                    $scope.isRichiestaStampa = function(stato){
                        return $scope.notificationEngine.isRichiestaStampa(stato);
                    };
                    $scope.accettaRichiestaStampa = function(nickDestinatario){
                        //notifico al mittente la mia decisione
                        $scope.notificationEngine.richiestaStampaInEntrata(nickDestinatario,'accetta');  
                        //se accetto la richiesta di stampa in entrata..
                        //aggiungo il nuovo contatto..
                        $scope.aggiungiContatto(nickDestinatario);
                    };
                    /**
                     * Aggiunge un nuovo contatto.
                     * lo aggiunge alla lista delle richiestaStampaUscita(rappresenta la lista contatti)
                     * @param {type} nickDestinatario
                     * @returns {undefined}
                     */
                    $scope.aggiungiContatto = function(nickDestinatario){
                         $scope.listaRichiesteStampaEntrata.forEach(function(richiestaEntrata,idx) {
                            if(richiestaEntrata.mittente.nick === nickDestinatario){
                               $scope.listaRichiesteStampaUscita.push({destinatario:richiestaEntrata.mittente,stato:COSTANTI.STATO_RICHIESTE_STAMPA.ACCETTATA}); 
                               $scope.listaRichiesteStampaEntrata.splice(idx, 1);
                             }
                         });
                    };
                    $scope.rifiutaRichiestaStampa = function(nickDestinatario){
                        $scope.notificationEngine.richiestaStampaInEntrata(nickDestinatario,'rifiuta');  
                    };
                    $scope.inviaRichiestaStampa = function (pdsSelezionato) {
                        $scope.alertRSE=true;
                        $scope.notificationEngine.inviaRichiestaStampa(pdsSelezionato);
                    };
                    $scope.calcolaPercorso = function(pdsSelezionato,tipoTrasporto){
                        $scope.geoArrivo = pdsSelezionato.indirizzo.descrizione;
                        $scope.mezzoTrasporto = tipoTrasporto;
                        $scope.mostraPannelloDirezione=true;
                        if($scope.indirizzoTrovato){
                            $scope.geoPartenza = $scope.indirizzoTrovato;
                        }else if($scope.posizioneRilevata){
                            $scope.geoPartenza = new google.maps.LatLng($scope.posizioneRilevata.lat(),$scope.posizioneRilevata.lng());
                        }
                        $scope.map.directionsRenderers[0].setMap(this.map);
                    };
                  
                    $scope.onChangeSliderFn = function (id, model) {
                        $scope.mostraPDS();
                    };
                    $scope.slider = {
                        raggioCerchio: COSTANTI.MAPPA.RAGGIO_CERCHIO_DEFAULT,
                        posizioneCerchio: null,
                        options: {
                            floor: COSTANTI.MAPPA.RAGGIO_CERCHIO_MIN,
                            ceil: COSTANTI.MAPPA.RAGGIO_CERCHIO_MAX,
                            translate: function (value) {
                                return value + " metri";
                            },
                            onChange: $scope.onChangeSliderFn
                        }
                    };
                    $scope.refreshSlider = function () {
                        $timeout(function () {
                            $scope.$broadcast('rzSliderForceRender');
                        });
                    };
                    $scope.isCollapsedHorizontal = true;
                    $scope.map = null;
                    $scope.indirizzoTrovato = null;
                    $scope.locationTrovata = null;
                    $scope.zoomCalcolato = $scope.defaultZoom;
                    $scope.googleFallBackPosition = new google.maps.LatLng(COSTANTI.MAPPA.FALL_GEO_POSITION[0], COSTANTI.MAPPA.FALL_GEO_POSITION[1]);
                    $scope.arrayMarkerPDS = [];
                    $scope.indirizzoSelezionato = function () {
                        $scope.place = this.getPlace();
                        if ($scope.place.geometry) {
                            $scope.isCollapsedHorizontal = !$scope.isCollapsedHorizontal;
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.panTo($scope.locationTrovata);
                            $scope.slider.posizioneCerchio = $scope.locationTrovata;
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                            $scope.geoPartenza = $scope.indirizzoTrovato;
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                            $scope.trovaPDS($scope.locationTrovata);
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                        $scope.slider.posizioneCerchio = $scope.map.getCenter();
                        $scope.trovaPDS($scope.map.getCenter()).then(function () {
                            //dopo aver invocato la funzione trovaPds
                            //tento la connessione al wsocket
                            $scope.notificationEngine.connettiWS();
                            $scope.jobPingSocket();
                        });
                        //per evitare problema di render scorretto della slider
                        $scope.refreshSlider();
                    });

                    $scope.centraMappa = function (location) {
                        $scope.isCollapsedHorizontal = !$scope.isCollapsedHorizontal;
                        if (location) {
                            $scope.map.panTo(location);
                            $scope.slider.posizioneCerchio = location;
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                        } else if ($scope.posizioneRilevata) {
                            $scope.map.panTo($scope.posizioneRilevata);
                            $scope.slider.posizioneCerchio = $scope.posizioneRilevata;
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                        }
                        $scope.mostraPDS();
                    };

                    $scope.getPosizioneRilevata = function () {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                if (position) {
                                    $scope.$apply(function () {
                                        var geocoder = new google.maps.Geocoder;
                                        var posizione = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                        $scope.posizioneRilevata = posizione;
                                        $scope.posCentroMappa = $scope.posizioneRilevata.lat() + ", " + $scope.posizioneRilevata.lng();
                                        $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                                        var latlng = {lat: $scope.posizioneRilevata.lat(), lng: $scope.posizioneRilevata.lng()};
                                        geocoder.geocode({'location': latlng}, function (results, status) {
                                            $scope.$apply(function () {
                                                if (status === 'OK' && results[1]) {
                                                    $scope.indirizzoRilevato = results[0].formatted_address;
                                                    $scope.geoPartenza= posizione=$scope.indirizzoRilevato;
                                                }
                                            });
                                        });
                                    });
                                }
                            }, function (error) {
                                $scope.$apply(function () {
                                    //imposto posizione di geoFallback
                                    $scope.posCentroMappa = $scope.googleFallBackPosition.lat() + ", " + $scope.googleFallBackPosition.lng();
                                    $scope.zoomCalcolato = COSTANTI.MAPPA.FALL_GEO_ZOOM;
                                });
                            });
                        }
                    };
                    $scope.isGeoFallback = function () {
                        if (!$scope.map.getCenter() ||
                                ($scope.map.getCenter().lat() == COSTANTI.MAPPA.FALL_GEO_POSITION[0] &&
                                        $scope.map.getCenter().lng() == COSTANTI.MAPPA.FALL_GEO_POSITION[1])) {
                            return true;
                        }
                        return false;
                    };

                    $scope.resetCercaIndirizzo = function () {
                        if($scope.map.directionsRenderers[0] !== null){
                           $scope.map.directionsRenderers[0].setMap(null);
                        }
                        if ($scope.indirizzo && $scope.indirizzo.cercato) {
                            $scope.arrayMarkerPDS = [];
                            $scope.locationTrovata = null;
                            $scope.indirizzoTrovato = null;
                            $scope.indirizzo.cercato = null;
                            $scope.map.panTo($scope.googleFallBackPosition);
                            $scope.zoomCalcolato = COSTANTI.MAPPA.FALL_GEO_ZOOM;
                        }
                    };
                    $scope.infoPDScancel = function () {
                        $scope.pdsSelezionato.classe = 'pdsNoActive';
                        if($scope.pdsSelezionato.parent){
                            for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                                if ($scope.arrayMarkerPDS[i]._id === $scope.pdsSelezionato.parent) {
                                    $scope.arrayMarkerPDS[i].classe = 'pdsNoActive';
                                    $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo = $scope.pdsSelezionato.pdsConnMaster;
                                }
                            }                             
                        }
                        $scope.pdsSelezionato = null;
                    };
                    /**
                     * Cerca sul DB i PDS intorno alla posizioneScelta
                     * @param {type} posizioneScelta
                     * @returns {undefined}
                     */
                    $scope.trovaPDS = function (posizioneScelta) {
                        var q = $q.defer();
                        if (!$scope.isGeoFallback()) {
                            serviziRest.trovaPDS({paramRicercaPDS: {lng: posizioneScelta.lng(), lat: posizioneScelta.lat()}}).then(function (response) {
                                if (response.esito) {
                                    if (response.utentiPds) {
                                        /* reset array di markers*/
                                        $scope.arrayMarkerPDS = [];
                                        //costruzione position dalle location trovate
                                        for (var i = 0; i < response.utentiPds.length; i++) {
                                            var posizionePDS = new google.maps.LatLng(response.utentiPds[i].location.coordinates[1], response.utentiPds[i].location.coordinates[0]);
                                            response.utentiPds[i].geoposizione = posizionePDS;
                                            $scope.caricaArrayMarkerPDS(response.utentiPds[i]);
                                        }
                                        $scope.mostraPDS();
                                    }
                                    q.resolve();
                                } else {
                                    $scope.mostraMessaggioError(response.codErr);
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.codErr);
                                }
                            });
                        } else {
                            q.resolve();
                        }
                        return q.promise;
                    };
                    /**
                     * Carica l'array dei markersPDS con le info prese dal DB
                     * @param {type} utentePDS
                     * @returns {undefined}
                     */
                    $scope.caricaArrayMarkerPDS = function (utentePDS) {
                        if ($scope.arrayMarkerPDS.length > 0) {
                            for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                                //se piu utenti diversi condividono lo stesso indirizzo carico l'utentePDS nell'array dei Markers
                                if ($scope.arrayMarkerPDS[i].geoposizione.equals(utentePDS.geoposizione)) {
                                    if ($scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo && $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo.length > 0) {
                                        utentePDS.parent = $scope.arrayMarkerPDS[i]._id;
                                        $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo.push(utentePDS);
                                    } else {//se array di utentiPDS con lo stesso indirizzo è vuoto lo creo..
                                        var utentiPDSstessoIndirizzo = [];
                                        utentePDS.parent = $scope.arrayMarkerPDS[i]._id;
                                        utentiPDSstessoIndirizzo.push(utentePDS);
                                        $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo = utentiPDSstessoIndirizzo;
                                    }
                                    return;
                                }
                            }
                        }
                        utentePDS.master = true;
                        $scope.arrayMarkerPDS.push(utentePDS);
                    };
                    /**
                     * Mostra i markers PDS sulla mappa
                     * che rientrano nel raggio del cerchio che filtra gli utenti
                     * @returns {undefined}
                     */
                    $scope.mostraPDS = function () {
                        if ($scope.arrayMarkerPDS) {
                            for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                                if (google.maps.geometry.spherical.computeDistanceBetween($scope.arrayMarkerPDS[i].geoposizione, $scope.slider.posizioneCerchio) <= $scope.slider.raggioCerchio) {
                                    $scope.arrayMarkerPDS[i].mostra = true;
                                } else {
                                    $scope.arrayMarkerPDS[i].mostra = false;
                                }
                            }
                        }
                    };
                    /**
                     * gestisce il click sul marker PDS nella mappa
                     * @param {type} utentePDS
                     * @returns {undefined}
                     */
                    $scope.markerPDSonClick = function (utentePDS) {
                        //gestisco anche gli utenti PDS collegati allo stesso indirizzo
                        if ($scope.pdsSelezionato && $scope.pdsSelezionato.master && $scope.pdsSelezionato !== utentePDS) {
                            $scope.pdsSelezionato.classe = 'pdsNoActive';
                        } else if ($scope.pdsSelezionato && $scope.pdsSelezionato.parent && $scope.pdsSelezionato !== utentePDS) {
                            //nel caso sto deselezionando un pds slave allora cerco il suo parent e deseleziono lui
                            for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                                if ($scope.arrayMarkerPDS[i]._id === $scope.pdsSelezionato.parent) {
                                    $scope.arrayMarkerPDS[i].classe = 'pdsNoActive';
                                    $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo = $scope.pdsSelezionato.pdsConnMaster;
                                }
                            }
                        }
                        utentePDS.classe = 'pdsActive';
                        $scope.pdsSelezionato = utentePDS;
                        $scope.scrollTo('infoPDSscroll');
                    };
                    /**
                     * Gestisce il click sul nick di un eventuale
                     * altro utentePDS che si trova allo stesso indirizzo
                     * di altri PDS (box in alto nella mappa)
                     * @param {type} altroUtentePDS
                     * @returns {undefined}
                     */
                    $scope.altroUtentePDSonClick = function (altroUtentePDS, pdsSelezionato) {
                        $scope.pdsSelezionato = $scope.swapPdsSelezionatoAltroPDS(pdsSelezionato, altroUtentePDS);
                        $scope.scrollTo('infoPDSscroll');
                    };
                    /**
                     * Effettua lo swap tra utente selezionato nel markers e utente selezionato
                     * nel box degli altri utenti connessi allo stesso indirizzo
                     * @param {type} pdsCorrente
                     * @param {type} nuovoPdsSelezionato
                     * @returns {undefined}
                     */
                    $scope.swapPdsSelezionatoAltroPDS = function (pdsCorrente, nuovoPdsSelezionato) {
                        var nuovoArrayPdsStessoIndirizzo = [];
                        for (var idx = 0; idx < pdsCorrente.utentiPDSstessoIndirizzo.length; idx++) {
                            /* prepara il nuovo array utenti collegati */
                            if (pdsCorrente.utentiPDSstessoIndirizzo[idx]._id !== nuovoPdsSelezionato._id) {
                                nuovoArrayPdsStessoIndirizzo.push(pdsCorrente.utentiPDSstessoIndirizzo[idx]);
                            }
                        }
                        //lo inserisco direttamente nell'array dei Pds collegati
                        //privandolo del suo subArray (che darebbe errore nella visulizzazione)
                        if (pdsCorrente.master && pdsCorrente.utentiPDSstessoIndirizzo) {
                            //se il sono in presenza del master (salvo le dipendenze iniziali nel nuovoPdsSelezionato)
                            nuovoPdsSelezionato.pdsConnMaster = pdsCorrente.utentiPDSstessoIndirizzo;
                        }
                        pdsCorrente.utentiPDSstessoIndirizzo = null;
                        nuovoArrayPdsStessoIndirizzo.push(pdsCorrente);/* sposto il pdsCorrente nella lista dei PDS collegati */
                        nuovoPdsSelezionato.utentiPDSstessoIndirizzo = $filter('orderBy')(nuovoArrayPdsStessoIndirizzo, 'feedback', 'reverse');
                        return nuovoPdsSelezionato;
                    };
                    $scope.toggleSubMenuSecondario=function(parentItem,numSubMenuItem){
                       if(numSubMenuItem > 0){
                            if(parentItem === 'RichiesteEffettuate'){
                                $scope.toggleMenuRichiesteEffettuate=!$scope.toggleMenuRichiesteEffettuate;
                                $scope.toggleMenuRisposte=false;
                                $scope.toggleMenuNotifiche=false;
                            }else if(parentItem === 'Risposte'){
                                $scope.toggleMenuRisposte=!$scope.toggleMenuRisposte;
                                $scope.toggleMenuRichiesteEffettuate=false;
                                $scope.toggleMenuNotifiche=false;

                            }else if(parentItem === 'Notifiche'){
                                $scope.toggleMenuNotifiche=!$scope.toggleMenuNotifiche;
                                $scope.toggleMenuRichiesteEffettuate=false;
                                $scope.toggleMenuRisposte=false;
                            }                           
                       }
                    };
                    $scope.getPosizioneRilevata();
                    /* Ogni TIME_OUT_PING minuti circa pingo serversocket*/
                    var ping;
                    $scope.jobPingSocket = function () {
                        // non faccio partire più di un ping..
                        if (angular.isDefined(ping)){
                            return;
                        }
                        ping = $interval(function () {
                            console.log("eseguo ping automatico al wsChat..");
                            $scope.notificationEngine.pingWs();
                            if (!$scope.notificationEngine.isConnected()) {
                                $interval.cancel(ping);
                                ping = undefined;
                            }
                        }, COSTANTI.TIME_OUT_PING);
                    };
                }]);
}());