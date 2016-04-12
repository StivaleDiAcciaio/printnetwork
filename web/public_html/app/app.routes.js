;
(function () {
    'use strict';
    angular.module('printNetworkApp')
            .config(function ($stateProvider, $urlRouterProvider) {

                $stateProvider
                        .state('home', {
                            url: '/',
                            views: {'content@': {
                                    templateUrl: 'app/components/home/home.html',
                                    controller: 'homeCtrl'
                                }
                            }
                        })
                        .state('test', {
                            url: '/test',
                            views: {'content@': {
                                    templateUrl: 'app/components/test/test.html',
                                    controller: 'testAppCtrl'
                                }
                            }
                        });
                $urlRouterProvider.otherwise('/');
            });
}());
