;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$http', '$state', 'serviziCustom', 'CONST',
                function ($scope, $http, $state, serviziCustom, costanti) {
                    $scope.token=null;
                    $scope.goToPage = function (pagina) {
                        $state.go(pagina);
                    };
                    $scope.setToken = function (token) {
                        $scope.token=token;
                    };
                }]);
}());