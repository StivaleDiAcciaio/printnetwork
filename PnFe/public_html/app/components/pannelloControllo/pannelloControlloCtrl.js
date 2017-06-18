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
                    $scope.defaultZoom=15;
                    $scope.fallGeoZoom=6;
                    $scope.fallBackPosition = [40.979898, 13.337401999999997];
                    $scope.indirizzoSelezionato = function () {
                        $scope.place = this.getPlace();
                        if ($scope.place.geometry) {
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.setCenter($scope.locationTrovata);
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                            $scope.map.setZoom($scope.defaultZoom);
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                        if ($scope.isGeoFallback()){
                            $scope.map.setZoom($scope.fallGeoZoom);
                        }else{
                             $scope.map.setZoom($scope.defaultZoom);
                        }
                    });

                    $scope.centraMappa = function (location) {
                        $scope.map.setCenter(location);
                        $scope.map.setZoom($scope.defaultZoom);
                    };
                    
                    $scope.isGeoFallback = function(){
                       if (!$scope.map.getCenter() ||
                            ($scope.map.getCenter().lat() == $scope.fallBackPosition[0] &&
                             $scope.map.getCenter().lng() == $scope.fallBackPosition[1])){
                            return true;
                        }
                        return false;
                    };

                    $scope.resetCercaIndirizzo = function () {
                        $scope.locationTrovata = null;
                        $scope.indirizzoTrovato = null;
                        $scope.indirizzo.cercato = null;
                        var posizione = new google.maps.LatLng($scope.fallBackPosition[0], $scope.fallBackPosition[1]);
                        $scope.map.setCenter(posizione);
                        $scope.map.setZoom($scope.fallGeoZoom);
                    };
                }]);
}());