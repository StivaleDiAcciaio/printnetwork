;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope', '$cookies','serviziCustom',
                function ($scope, $cookies,serviziCustom) {
                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziCustom.autenticazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $cookies.put('token', response.token);
                                    $cookies.put('utenteLoggato', JSON.stringify(response.utenteLoggato));
                                    $scope.vaiAllaPagina('pannelloControllo');
                                }else{
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            });
                        }
                    };
                }]);
}());