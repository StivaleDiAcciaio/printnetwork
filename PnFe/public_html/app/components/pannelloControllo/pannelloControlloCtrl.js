;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$state','serviziRest','CONST',
                function ($scope, $state,serviziRest,COSTANTI) {
                   $scope.isCollapsedHorizontal = true;
                }]);
}());