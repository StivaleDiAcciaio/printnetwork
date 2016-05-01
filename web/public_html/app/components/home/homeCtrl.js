;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$state', 'serviziRest', 'CONST',
                function ($scope, $state, serviziRest, COSTANTI) {
                    $scope.messaggio = null;
                    $scope.vaiAllaPagina = function (pagina) {
                        $state.go(pagina);
                    };
                    $scope.mostraMessaggioInfo = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.INFO, $scope);
                    };
                    $scope.mostraMessaggioWarning = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.WARNING, $scope);
                    };

                    $scope.mostraMessaggioError = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.ERROR, $scope);
                    };
                    $scope.resetMessaggioUtente = function () {
                        $scope.messaggio = null;
                    };
                    $scope.logout = function () {
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                    };
                    $scope.richiediAccesso = function () {
                        if (!localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN)) {
                            $scope.vaiAllaPagina(COSTANTI.PAGINA.LOGIN);
                        }
                    };
                    $scope.checkToken = function () {
                        return localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN) != null;
                    };
                    $scope.getUtenteLoggato = function () {
                        return JSON.parse(localStorage.getItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO));
                    };
                    $scope.setUtenteLoggato = function (utenteLoggato) {
                        localStorage.setItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO, JSON.stringify(utenteLoggato));
                    };
                    $scope.getToken = function () {
                        return localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                    };
                    $scope.setToken = function (token) {
                        localStorage.setItem(COSTANTI.LOCAL_STORAGE.TOKEN,token);
                    };
                    function mostraMessaggioUtente(messaggio, level, scope) {
                        scope.messaggio = {};
                        scope.messaggio.contenuto = messaggio;
                        scope.messaggio.level = level;
                    }
                    ;
                    /*Eventi del Routing */
                    $scope.$on('$viewContentLoaded', function (event) {
                        $scope.resetMessaggioUtente();
                    });

                }]);
}());