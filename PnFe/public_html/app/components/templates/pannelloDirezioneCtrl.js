;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloDirezioneCtrl',
            ['$scope',
                function ($scope) {
                    $scope.getInfoPasso = function(passo){
                      console.log("Passo:"+passo);  
                    };
                }]);
}());