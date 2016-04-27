//Definisco eventuale configurazione del mio modulo
;
(function () {
    'use strict';
    angular.module('printNetworkApp', ['ngSanitize', 'ui.bootstrap', 'ui.router', 'nya.bootstrap.select','ngCookies'])
            .config([function () {
                    //// provider-injector
                    // This is an example of config block.
                    // You can have as many of these as you want.
                    // You can only inject Providers (not instances)
                    // into config blocks.
                }]);
}());