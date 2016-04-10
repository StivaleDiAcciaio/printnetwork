;
(function () {
    'use strict';
    angular.module('tellmeApp').controller('homeCtrl',
            ['$scope', 'apiService',
                function ($scope, api) {
                    console.log("controller home");
                }]);
}());