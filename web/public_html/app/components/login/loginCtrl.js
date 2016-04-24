;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope', 'serviziCustom',
                function ($scope, serviziCustom) {
                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziCustom.serviceLogin({utente: $scope.utente}).then(function (response) {
                                $scope.setToken(response.token);
                                $scope.goToPage('pannelloControllo');
                            });
                        }
                    };
                }]);
}());