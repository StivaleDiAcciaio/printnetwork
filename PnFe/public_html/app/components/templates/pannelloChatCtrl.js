;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloChatCtrl',
            ['$scope','CONST','$uibModal',
                function ($scope,COSTANTI,$uibModal) {
                    
                    $scope.openConfirmModal = function (size) {
                        var modalConfirmInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/commonModal/confirm.html',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                                $scope.ok = function () {
                                    $uibModalInstance.close('ok');
                                };
                            },
                            size: size
                        });
                        modalConfirmInstance.result.then(function (scelta) {
                           if(scelta==='ok'){
                            $scope.inviaMessaggioFn({nickDestinatario:$scope.getDestinatarioNick(), msgDaInviare:COSTANTI.STATO_RICHIESTE_STAMPA.CHIUSA});
                            $scope.togglePannelloChat();                               
                           }
                        }, function () {
                            //openConfirmModal chiusa
                        });
                    };
                    
                    $scope.getDestinatarioNick = function(){
                        /* se ho contattato io il destinatario allora e' noto il nick */
                        if($scope.destinatario && $scope.destinatario.nick){
                            return $scope.destinatario.nick;
                        }else if($scope.listaMessaggiUtente && $scope.listaMessaggiUtente.length>0){
                            /* ..altrimenti vuol dire che io sono stato contattato ed il nick del destinatario dei miei 
                             * messaggi si trova qui.. */
                            return $scope.listaMessaggiUtente[0].mittente;
                        }
                    };
                    $scope.invioMessaggio = function(tipoMessaggio){
                        if(tipoMessaggio===COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE && $scope.msgDaInviare && $scope.msgDaInviare.trim()!==''){
                            $scope.inviaMessaggioFn({nickDestinatario:$scope.getDestinatarioNick(), msgDaInviare:$scope.msgDaInviare});
                            $scope.listaMessaggiUtente.push({mittente:'io',nickDestinatario:$scope.getDestinatarioNick(),msg:'io: '+$scope.msgDaInviare,istante:$scope.getIstante()});
                            $scope.msgDaInviare='';                            
                        }else if(tipoMessaggio===COSTANTI.STATO_RICHIESTE_STAMPA.CHIUSA){
                          $scope.openConfirmModal();                           
                        }
                    };
                    
                    $scope.getIstante = function(){
                      return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');  
                    };
                    $scope.togglePannelloChat = function(){
                      $scope.mostraChat=!$scope.mostraChat;    
                    };
                    $scope.getMessaggioUtente = function(messaggio){
                      if($scope.mostraChat){
                         messaggio.visualizzata=true; 
                      }
                      return messaggio.msg;  
                    };
                     
                }]);
}());