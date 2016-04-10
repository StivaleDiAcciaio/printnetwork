;
(function () {
    'use strict';
    angular.module('tellmeApp')
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
                            views: {'content2@': {
                                    templateUrl: 'app/components/test/test.html',
                                    controller: 'testCtrl'
                                }
                            }
                        });
                $urlRouterProvider.otherwise('/');
            });
}());
