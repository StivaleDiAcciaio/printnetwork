;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$state', 'serviziCustom', 'CONST',
                function ($scope, $state, serviziCustom, costanti) {
                    $scope.messaggio = null;
                    $scope.vaiAllaPagina = function (pagina) {
                        $state.go(pagina);
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
                    $scope.logout = function (){
                        localStorage.removeItem("token");
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