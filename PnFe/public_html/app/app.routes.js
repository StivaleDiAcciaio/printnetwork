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
                        })
                        .state('login', {
                            url: '/login',
                            views: {'content@': {
                                    templateUrl: 'app/components/login/login.html',
                                    controller: 'loginCtrl'
                                }
                            }
                        })
                        .state('autenticazione', {
                            url: '/autenticazione',
                            views: {'content@': {
                                    templateUrl: 'app/components/autenticazione/autenticazione.html',
                                    controller: 'autenticazioneCtrl'
                                }
                            }
                        })
                        .state('pannelloControllo', {
                            url: '/pannelloControllo',
                            views: {'content@': {
                                    templateUrl: 'app/components/pannelloControllo/pannelloControllo.html',
                                    controller: 'pannelloControlloCtrl'
                                }
                            }
                        });
                $urlRouterProvider.otherwise('/');
            });
}());
