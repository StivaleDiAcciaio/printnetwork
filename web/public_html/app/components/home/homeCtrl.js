;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST',
                function ($scope, $state, serviziRest, COSTANTI) {
                    $scope.setPaginaCorrente($state.current.name);
                }]);
}());