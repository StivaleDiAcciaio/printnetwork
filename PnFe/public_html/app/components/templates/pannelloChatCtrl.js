;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloChatCtrl',
            ['$scope',
                function ($scope) {
                    $scope.getInfoDestinatario = function(destinatario){
                      console.log("Destinatario:"+destinatario.nick);  
                    };
                }]);
}());