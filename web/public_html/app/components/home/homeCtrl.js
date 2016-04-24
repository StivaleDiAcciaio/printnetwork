;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$state', 'serviziCustom', 'CONST',
                function ($scope, $state, serviziCustom, costanti) {
                    $scope.token = null;
                    $scope.utenteLoggato = null;
                    $scope.messaggio = null;
                    $scope.vaiAllaPagina = function (pagina) {
                        $state.go(pagina);
                    };
                    $scope.setToken = function (token) {
                        $scope.token = token;
                    };
                    $scope.getToken = function () {
                        return $scope.token;
                    };
                    $scope.setUtenteLoggato = function (utenteLoggato) {
                        $scope.utenteLoggato = utenteLoggato;
                    };
                    $scope.getUtenteLoggato = function () {
                        return $scope.utenteLoggato;
                    };
                    $scope.mostraMessaggioInfo = function (messaggio) {
                        mostraMessaggioUtente(messaggio, costanti.MESSAGE_LEVEL.INFO, $scope);
                    };
                    $scope.mostraMessaggioWarning = function (messaggio) {
                        mostraMessaggioUtente(messaggio, costanti.MESSAGE_LEVEL.WARNING, $scope);
                    };

                    $scope.mostraMessaggioError = function (messaggio) {
                        mostraMessaggioUtente(messaggio, costanti.MESSAGE_LEVEL.ERROR, $scope);
                    };
                    $scope.resetMessaggioUtente = function () {
                        $scope.messaggio = null;
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