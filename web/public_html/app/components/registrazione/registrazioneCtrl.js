;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('registrazioneCtrl',
            ['$scope', '$http', 'serviziRest',
                function ($scope, $http, serviziRest) {
                    $scope.outRestCall = "";
                    $scope.outRestCallPOST = "";

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
                    $scope.cliccaRegistrazione = function (formRegistrazione) {
                        if (formRegistrazione.$valid) {
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
                        }
                    };
                }]);
}());