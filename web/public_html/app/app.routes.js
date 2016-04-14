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
                        .state('registrazione', {
                            url: '/registrazione',
                            views: {'content@': {
                                    templateUrl: 'app/components/registrazione/registrazione.html',
                                    controller: 'registrazioneCtrl'
                                }
                            }
                        });
                $urlRouterProvider.otherwise('/');
            });
}());