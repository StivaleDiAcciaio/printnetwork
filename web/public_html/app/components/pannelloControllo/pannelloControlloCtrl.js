;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', '$cookies','serviziCustom',
                function ($scope, $cookies,serviziCustom) {
                    $scope.utenteLoggato = JSON.parse($cookies.get('utenteLoggato'));
                    $scope.token = $cookies.get('token');
                }]);
}());