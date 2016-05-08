;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('autenticazioneCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST',
                function ($scope, $state, serviziRest, COSTANTI) {
                    console.log("Autenticazione form");
                    $scope.login = function (formLogin) {
                        alert('Completare la funzione');
                        if (formLogin.$valid) {
                            serviziRest.autenticazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $scope.setToken(response.token);
                                    $scope.setUtenteLoggato(response.utenteLoggato);
                                    $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                                } else {
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            });
                        }
                    };
                }]);
}());