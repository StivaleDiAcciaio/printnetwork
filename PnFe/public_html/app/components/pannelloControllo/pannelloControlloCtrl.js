;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST','NgMap',
                function ($scope, $state, serviziRest, COSTANTI,NgMap) {
                    $scope.isCollapsedHorizontal = true;
                    $scope.map=null;
                    $scope.placeChanged = function () {
                        $scope.place = this.getPlace();
                        $scope.map.setCenter($scope.place.geometry.location);
                    };
                    NgMap.getMap().then(function (map) {
                        $scope.map = map;
                    });
                }]);
}());