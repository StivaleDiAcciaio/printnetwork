;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('loginCtrl',
            ['$scope', '$http', 'apiService',
                function ($scope, $http, serviziCustom) {
                    console.log("loginCtrl controller ");
                    $scope.outRestCall = "";
                    $scope.outRestCallPOST = "";

                    $scope.cliccaLogin = function (formLogin) {
                        if (formLogin.$valid) {
                            var url = 'http://localhost/printnetwork/apinode/login';
                            var myCall = $http({
                                method: 'GET',
                                url: url,
                                headers: {'Content-Type': 'application/json'}
                            });
                            myCall.then(function (response) {
                                $scope.outRestCall = response.data;
                            });
                        }
                    };
                }]);
}());