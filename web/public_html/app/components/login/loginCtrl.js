;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope','$state','serviziRest','CONST',
                function ($scope, $state,serviziRest,COSTANTI) {
                    $scope.setPaginaCorrente($state.current.name);
                    if ($scope.checkToken()){
                        $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                    }
                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziRest.autenticazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $scope.setToken(response.token);
                                    $scope.setUtenteLoggato(response.utenteLoggato);
                                    $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                                }else{
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            });
                        }
                    };
                }]);
}());