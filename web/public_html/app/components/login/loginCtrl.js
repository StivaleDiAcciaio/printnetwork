;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope','serviziRest','CONST',
                function ($scope, serviziRest,COSTANTI) {
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