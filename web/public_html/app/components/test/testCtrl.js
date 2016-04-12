;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('testAppCtrl',
            ['$scope', 'apiService',
                function ($scope, api) {
                    console.log("testapp controller ");
                }]);
}());