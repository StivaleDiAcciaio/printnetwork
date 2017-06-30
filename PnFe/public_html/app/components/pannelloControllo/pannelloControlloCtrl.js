;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST', 'NgMap', '$timeout',
                function ($scope, $state, serviziRest, COSTANTI, NgMap, $timeout) {
                   $scope.onChangeSliderFn = function (id, model) {
                        $scope.mostraPDS($scope.arrayMarkerPDS);
                    };
                    $scope.slider = {
                        raggioCerchio: COSTANTI.MAPPA.RAGGIO_CERCHIO_DEFAULT,
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
                    $scope.arrayMarkerPDS = null;
                    $scope.indirizzoSelezionato = function () {
                        $scope.place = this.getPlace();
                        if ($scope.place.geometry) {
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.panTo($scope.locationTrovata);
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                            $scope.trovaPDS();
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                        $scope.trovaPDS();
                        //per evitare problema di render scorretto della slider
                        $scope.refreshSlider();
                    });

                    $scope.centraMappa = function (location) {
                        if (location) {
                            $scope.map.panTo(location);
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                        } else if ($scope.posizioneRilevata) {
                            var posizione = new google.maps.LatLng($scope.posizioneRilevata.lat(), $scope.posizioneRilevata.lng());
                            $scope.map.panTo(posizione);
                            $scope.zoomCalcolato = COSTANTI.MAPPA.DEFAULT_ZOOM;
                        }

                    };

                    $scope.getPosizioneRilevata = function () {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                if (position) {
                                    $scope.$apply(function () {
                                        var geocoder = new google.maps.Geocoder;
                                        var posizione = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                        $scope.posizioneRilevata = posizione;
                                        $scope.locationTrovata = posizione;
                                        $scope.posizioneMappa = $scope.posizioneRilevata.lat() + ", " + $scope.posizioneRilevata.lng();
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
                                    var geoFallBackPosiz = new google.maps.LatLng(COSTANTI.MAPPA.FALL_GEO_POSITION[0], COSTANTI.MAPPA.FALL_GEO_POSITION[1]);
                                    $scope.posizioneMappa = geoFallBackPosiz.lat() + ", " + geoFallBackPosiz.lng();
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
                            $scope.locationTrovata = null;
                            $scope.indirizzoTrovato = null;
                            $scope.indirizzo.cercato = null;
                            $scope.map.panTo($scope.googleFallBackPosition);
                            $scope.zoomCalcolato = COSTANTI.MAPPA.FALL_GEO_ZOOM;
                        }
                    };

                    $scope.trovaPDS = function () {
                        if (!$scope.isGeoFallback()) {
                            serviziRest.trovaPDS({paramRicercaPDS: {lng: $scope.locationTrovata.lng(), lat: $scope.locationTrovata.lat()}}).then(function (response) {
                                if (response.esito) {
                                    if (response.utentiPds) {
                                        //costruzione position dalle location trovate
                                        var arrayMarkerPDS = [];
                                        for (var i = 0; i < response.utentiPds.length; i++) {
                                            var posizionePDS = new google.maps.LatLng(response.utentiPds[i].location.coordinates[1], response.utentiPds[i].location.coordinates[0]);
                                            arrayMarkerPDS.push(new google.maps.Marker({position: posizionePDS, map: null, draggable: false}));
                                        }
                                        $scope.arrayMarkerPDS = arrayMarkerPDS;
                                        $scope.mostraPDS(arrayMarkerPDS);
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
                    $scope.mostraPDS = function (arrayMarkerPDS) {
                        if (arrayMarkerPDS) {
                            for (var i = 0; i < arrayMarkerPDS.length; i++) {
                                if (google.maps.geometry.spherical.computeDistanceBetween(arrayMarkerPDS[i].getPosition(), $scope.map.shapes.cerchioRicerca.getCenter()) <= $scope.map.shapes.cerchioRicerca.getRadius()) {
                                    arrayMarkerPDS[i].setMap($scope.map);
                                }else{
                                    arrayMarkerPDS[i].setMap(null);
                                }
                            }
                        }
                    };
                    $scope.getPosizioneRilevata();
                }]);
}());