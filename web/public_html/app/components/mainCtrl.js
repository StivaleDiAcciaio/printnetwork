;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('mainCtrl',
            ['$rootScope', '$scope', '$state', 'serviziRest', 'CONST',
                function ($rootScope, $scope, $state, serviziRest, COSTANTI) {
                    $scope.paginaCorrente = null;
                    $scope.messaggio = null;

                    $scope.setPaginaCorrente = function (pagina) {
                        $scope.paginaCorrente = {};
                        $scope.paginaCorrente.nome = pagina;
                    };
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
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO);
                        localStorage.removeItem(COSTANTI.RICORDAMI);
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
                        localStorage.setItem(COSTANTI.LOCAL_STORAGE.TOKEN, token);
                    };
                    $scope.setRicordami = function (email,pwd) {
                        var ricordaAccesso={};
                        ricordaAccesso.email=email;
                        ricordaAccesso.pwd=pwd;
                        localStorage.setItem(COSTANTI.RICORDAMI, JSON.stringify(ricordaAccesso));
                    };                    
                    $scope.getRicordami = function () {
                        if (localStorage.getItem(COSTANTI.RICORDAMI)){
                            return JSON.parse(localStorage.getItem(COSTANTI.RICORDAMI));
                        }
                        return null;
                    };                    
                    
                    function mostraMessaggioUtente(messaggio, level, scope) {
                        scope.messaggio = {};
                        scope.messaggio.contenuto = messaggio;
                        scope.messaggio.level = level;
                    }
                    $scope.vaiPannelloControllo = function () {
                        if ($scope.checkToken()) {
                            $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                        } else {
                            $scope.vaiAllaPagina(COSTANTI.PAGINA.LOGIN);
                        }
                    };

                    /*Eventi del Routing */
                    $scope.$on('$viewContentLoaded', function (event, viewConfig) {
                        $scope.resetMessaggioUtente();
                        if (viewConfig.context) {
                            $scope.setPaginaCorrente(viewConfig.context.name);
                        }
                    });
                }]);
}());