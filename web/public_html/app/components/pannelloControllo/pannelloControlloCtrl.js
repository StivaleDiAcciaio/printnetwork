;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', 'serviziRest','CONST',
                function ($scope, serviziRest,COSTANTI) {
                    $scope.richiediAccesso();
                }]);
}());