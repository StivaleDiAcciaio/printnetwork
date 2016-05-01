;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('pannelloControlloCtrl',
            ['$scope', 'serviziCustom',
                function ($scope, serviziCustom) {
                    $scope.utenteLoggato = JSON.parse(localStorage.getItem('utenteLoggato'));
                    $scope.token = localStorage.getItem('token');
                }]);
}());