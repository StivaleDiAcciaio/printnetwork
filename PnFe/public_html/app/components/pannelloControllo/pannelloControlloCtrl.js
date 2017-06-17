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

                    $scope.indirizzoSelezionato = function () {
                        $scope.place = this.getPlace();
                        if ($scope.place.geometry) {
                            $scope.locationTrovata = $scope.place.geometry.location;
                            $scope.map.setCenter($scope.place.geometry.location);
                            $scope.indirizzoTrovato = $scope.place.formatted_address;
                        }
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                    });

                    $scope.centraMappa = function (location) {
                        $scope.map.setCenter(location);
                    };

                    $scope.resetCercaIndirizzo = function () {
                        $scope.locationTrovata = null;
                        $scope.indirizzoTrovato = null;
                        $scope.indirizzo.attuale = null;
                    };
                }]);
}());