;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('homeCtrl',
            ['$scope', /*'apiService',*/'$http',
                function ($scope,/* api,*/$http) {
                    console.log("homeCtrl controller ");
                    $scope.outRestCall = "";
                    $scope.outRestCallPOST = "";

                    $scope.cliccaLogin = function () {

                        var url = 'http://localhost/printnetwork/apinode/login';
                        var myCall = $http({
                            method: 'GET',
                            url: url,
                            headers: {'Content-Type': 'application/json'}
                        });
                        myCall.then(function (response) {
                            $scope.outRestCall = response.data;
                        });
                    };

                    $scope.cliccaStampa = function () {

                        var url = 'http://localhost/printnetwork/apinode/2d';

                        var myCall = $http({
                            method: 'POST',
                            url: url,
                            data: {token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJub21lIjoic2FzYSIsImlhdCI6MTQ1ODQ3MDA5NSwiZXhwIjoxNDU4NDg4MDk1fQ.IQud9gIHOh0XdqyVS2oDfMiAqkiHhvyuDWPnuuNfHHw'},
                            headers: {'Content-Type': 'application/json'}
                        });
                        myCall.then(function (response) {
                            $scope.outRestCallPOST = response.data;
                        }, function (err) {
                            alert("errore (" + err.status + ") " + err.data.messaggio);
                        });
                    };
                    $scope.cliccaRegistrazione = function () {

                        var url = 'http://localhost/printnetwork/apinode/registrazione';

                        var myCall = $http({
                            method: 'POST',
                            url: url,
                            // data: {},
                            headers: {'Content-Type': 'application/json'}
                        });
                        myCall.then(function (response) {
                            $scope.outRegistrazione = response.data;
                        }, function (err) {
                            alert("errore (" + err.status + ") " + err.data.messaggio);
                        });
                    };

                }]);
}());