;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', '$http','$state','apiService','CONST',
                function ($scope,$http, $state, serviziCustom,costanti ) {
                    console.log("homeCtrl controller ");
        			
                    $scope.goToPage = function(pagina) {
                    	$state.go('pagina');
        			};
                }]);
}());