;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope','serviziCustom',
                function ($scope, serviziCustom) {
                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziCustom.autenticazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    localStorage.setItem("token", response.token);
                                    localStorage.setItem("utenteLoggato", JSON.stringify(response.utenteLoggato));
                                    $scope.vaiAllaPagina('pannelloControllo');
                                }else{
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            });
                        }
                    };
                }]);
}());