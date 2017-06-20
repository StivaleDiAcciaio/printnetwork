;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST', 'NgMap',
                function ($scope, $state, serviziRest, COSTANTI, NgMap) {
                    $scope.isCollapsedHorizontal = true;
                    $scope.map = null;
                    $scope.indirizzoTrovato = null;
                    $scope.locationTrovata = null;
                    $scope.defaultZoom = 15;
                    $scope.fallGeoZoom = 6;
                    $scope.zoomCalcolato = $scope.defaultZoom;
                    $scope.fallBackPosition = [40.979898, 13.337401999999997];
                    $scope.googleFallBackPosition = new google.maps.LatLng($scope.fallBackPosition[0], $scope.fallBackPosition[1]);
                    $scope.indirizzoSelezionato = function () {
                        $scope.place = this.getPlace();
                        if ($scope.place.geometry) {
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.setCenter($scope.locationTrovata);
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                            $scope.zoomCalcolato = $scope.defaultZoom;
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                    });

                    $scope.centraMappa = function (location) {
                        if (location) {
                            $scope.map.setCenter(location);
                            $scope.zoomCalcolato = $scope.defaultZoom;
                        }
                    };
                    $scope.centraPosizioneRilevata = function () {
                        if ($scope.posizioneRilevata) {
                            var posizione = new google.maps.LatLng($scope.posizioneRilevata.lat(), $scope.posizioneRilevata.lng());
                            $scope.map.panTo(posizione);
                            $scope.zoomCalcolato = $scope.defaultZoom;
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
                                        $scope.posizioneMappa = $scope.posizioneRilevata.lat() + ", " + $scope.posizioneRilevata.lng();
                                        $scope.zoomCalcolato = $scope.defaultZoom;
                                        var latlng = {lat: $scope.posizioneRilevata.lat(), lng: $scope.posizioneRilevata.lng()};
                                        geocoder.geocode({'location': latlng}, function(results, status) {
                                              $scope.$apply(function () {
                                                 if (status === 'OK' && results[1]) {
                                                     $scope.indirizzoRilevato = results[1].formatted_address;
                                                 } 
                                              });
                                        });
                                    });
                                }
                            }, function (error) {
                                $scope.$apply(function () {
                                    //imposto posizione di geoFallback
                                    var geoFallBackPosiz = new google.maps.LatLng($scope.fallBackPosition[0], $scope.fallBackPosition[1]);
                                    $scope.posizioneMappa = geoFallBackPosiz.lat() + ", " + geoFallBackPosiz.lng();
                                    $scope.zoomCalcolato = $scope.fallGeoZoom;
                                });
                            });
                        }
                    };
                    $scope.isGeoFallback = function () {
                        if (!$scope.map.getCenter() ||
                                ($scope.map.getCenter().lat() == $scope.fallBackPosition[0] &&
                                        $scope.map.getCenter().lng() == $scope.fallBackPosition[1])) {
                            return true;
                        }
                        return false;
                    };

                    $scope.resetCercaIndirizzo = function () {
                        if ($scope.indirizzo.cercato) {
                            $scope.locationTrovata = null;
                            $scope.indirizzoTrovato = null;
                            $scope.indirizzo.cercato = null;
                            $scope.map.setCenter($scope.googleFallBackPosition);
                            $scope.zoomCalcolato = $scope.fallGeoZoom;
                        }
                    };

                    $scope.getPosizioneRilevata();
                }]);
}());