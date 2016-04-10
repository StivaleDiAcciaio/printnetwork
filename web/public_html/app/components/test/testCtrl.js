;
(function () {
    'use strict';
    angular.module('tellmeApp').controller('testCtrl',
            ['$scope', 'apiService',
                function ($scope, api) {
                    console.log("controller testCtrl");
                }]);
}());