;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope', 'serviziCustom',
                function ($scope, serviziCustom) {
                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziCustom.autenticazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $scope.setToken(response.token);
                                    $scope.setUtenteLoggato(response.utenteLoggato);
                                    $scope.vaiAllaPagina('pannelloControllo');
                                }else{
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            });
                        }
                    };
                }]);
}());