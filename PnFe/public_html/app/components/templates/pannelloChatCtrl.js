;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloChatCtrl',
            ['$scope','CONST',
                function ($scope,COSTANTI) {
                    $scope.getDestinatarioNick = function(){
                        if($scope.destinatario && $scope.destinatario.nick){
                            return $scope.destinatario.nick;
                        }else if($scope.listaMessaggiUtente && $scope.listaMessaggiUtente.length>0){
                            return $scope.listaMessaggiUtente[0].mittente;
                        }
                    };
                    $scope.invioMessaggio = function(tipoMessaggio){
                        if(tipoMessaggio===COSTANTI.STATO_RICHIESTE_STAMPA.CONTRATTAZIONE && $scope.msgDaInviare && $scope.msgDaInviare.trim()!==''){
                            $scope.inviaMessaggioFn({nickDestinatario:$scope.getDestinatarioNick(), msgDaInviare:$scope.msgDaInviare});
                            $scope.listaMessaggiUtente.push({mittente:'io',msg:'io: '+$scope.msgDaInviare,istante:$scope.getIstante()});
                            $scope.msgDaInviare='';                            
                        }else if(tipoMessaggio===COSTANTI.STATO_RICHIESTE_STAMPA.CHIUSA){
                            $scope.inviaMessaggioFn({nickDestinatario:$scope.getDestinatarioNick(), msgDaInviare:COSTANTI.STATO_RICHIESTE_STAMPA.CHIUSA});
                            $scope.togglePannelloChat();
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