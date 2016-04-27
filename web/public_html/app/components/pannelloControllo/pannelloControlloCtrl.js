;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$cookies','serviziCustom',
                function ($scope, $cookies,serviziCustom) {
                    $scope.utenteLoggato = $cookies.get('utenteLoggato');
                    $scope.token = $cookies.get('token');
                }]);
}());