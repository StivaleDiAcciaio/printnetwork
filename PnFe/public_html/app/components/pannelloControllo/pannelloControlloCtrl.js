;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST', 'NgMap', '$timeout',
                function ($scope, $state, serviziRest, COSTANTI, NgMap, $timeout) {
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
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.panTo($scope.locationTrovata);
                            $scope.slider.posizioneCerchio = $scope.locationTrovata;
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                            $scope.trovaPDS($scope.locationTrovata);
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                        $scope.slider.posizioneCerchio = $scope.map.getCenter();
                        $scope.trovaPDS($scope.map.getCenter());
                        //per evitare problema di render scorretto della slider
                        $scope.refreshSlider();
                    });

                    $scope.centraMappa = function (location) {
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
                        if ($scope.indirizzo && $scope.indirizzo.cercato) {
                            $scope.arrayMarkerPDS =[];
                            $scope.locationTrovata = null;
                            $scope.indirizzoTrovato = null;
                            $scope.indirizzo.cercato = null;
                            $scope.map.panTo($scope.googleFallBackPosition);
                            $scope.zoomCalcolato = COSTANTI.MAPPA.FALL_GEO_ZOOM;
                            
                        }
                    };
                    $scope.infoPDScancel = function (){
                        $scope.pdsSelezionato.classe='pdsNoActive';
                        $scope.pdsSelezionato=null;
                    };
                    $scope.trovaPDS = function (posizioneScelta) {
                        if (!$scope.isGeoFallback()) {
                            serviziRest.trovaPDS({paramRicercaPDS: {lng: posizioneScelta.lng(), lat: posizioneScelta.lat()}}).then(function (response) {
                                if (response.esito) {
                                    if (response.utentiPds) {
                                        //costruzione position dalle location trovate
                                        for (var i = 0; i < response.utentiPds.length; i++) {
                                            var posizionePDS = new google.maps.LatLng(response.utentiPds[i].location.coordinates[1], response.utentiPds[i].location.coordinates[0]);
                                            response.utentiPds[i].geoposizione = posizionePDS;
                                            $scope.caricaArrayMarkerPDS(response.utentiPds[i]);
                                        }                                        
                                        $scope.mostraPDS();
                                    }

                                } else {
                                    $scope.mostraMessaggioError(response.codErr);
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.codErr);
                                }
                            });
                        }
                    };
                    $scope.caricaArrayMarkerPDS = function(utentePDS){
                        var pdsPresente = false;
                        for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                            //se utentePDS e' gia presente nell'array dei Markers non lo ricarico nuovamente.
                            if($scope.arrayMarkerPDS[i].nick == utentePDS.nick && $scope.arrayMarkerPDS[i].geoposizione.equals(utentePDS.geoposizione)){
                                pdsPresente = true;
                                break;
                            }//se piu utenti diversi condividono lo stesso indirizzo carico l'utentePDS nell'array dei Markers
                            else if ($scope.arrayMarkerPDS[i].geoposizione.equals(utentePDS.geoposizione) && $scope.arrayMarkerPDS[i].nick != utentePDS.nick){
                                if ($scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo && $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo.length>0){
                                    $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo.push(utentePDS);
                                }else{//se array di utentiPDS con lo stesso indirizzo è vuoto lo creo..
                                    var utentiPDSstessoIndirizzo = [];
                                    utentiPDSstessoIndirizzo.push(utentePDS);
                                    $scope.arrayMarkerPDS[i].utentiPDSstessoIndirizzo = utentiPDSstessoIndirizzo;
                                }
                                return;
                            }
                        }
                        if(!pdsPresente){
                            $scope.arrayMarkerPDS.push(utentePDS);   
                        }
                    };
                    
                    $scope.mostraPDS = function () {
                        if ($scope.arrayMarkerPDS) {
                            for (var i = 0; i < $scope.arrayMarkerPDS.length; i++) {
                                if (google.maps.geometry.spherical.computeDistanceBetween($scope.arrayMarkerPDS[i].geoposizione, $scope.slider.posizioneCerchio) <= $scope.slider.raggioCerchio) {
                                   $scope.arrayMarkerPDS[i].mostra=true;
                                } else {
                                    $scope.arrayMarkerPDS[i].mostra=false;
                                }
                            }
                        }
                    };
                    $scope.markerPDSonClick = function(utentePDS){
                      if ($scope.pdsSelezionato && $scope.pdsSelezionato !== utentePDS){
                          $scope.pdsSelezionato.classe='pdsNoActive';
                      }
                      utentePDS.classe='pdsActive';
                      $scope.pdsSelezionato=utentePDS;
                      $scope.scrollTo('infoPDSscroll');
                    };
                    $scope.getPosizioneRilevata();                    
                }]);
}());