;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloChatCtrl',
            ['$scope',
                function ($scope) {
                    $scope.getDestinatarioNick = function(){
                        if($scope.destinatario && $scope.destinatario.nick){
                            return $scope.destinatario.nick;
                        }else if($scope.listaMessaggiUtente && $scope.listaMessaggiUtente.length>0){
                            return $scope.listaMessaggiUtente[0].mittente;
                        }
                    };
                    $scope.invioMessaggio = function(){
                        $scope.inviaMessaggioFn({nickDestinatario:$scope.getDestinatarioNick(), msgDaInviare:$scope.msgDaInviare});
                    };
                }]);
}());