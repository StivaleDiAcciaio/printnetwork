;
(function () {
    var pnApp = angular.module('printNetworkApp');
    pnApp.factory('serviziRest', ['CONST', '$http', '$location', '$q', function (COSTANTI, $http, $location, $q) {
            var portaDefault = '80';
            var ServiziRest = function () {

                this.getHostAddressAndPort = function () {
                    //return 'http://' + $location.host() + ':' + $location.port() + "/";
                    //return 'https://' + $location.host() + ':' + portaDefault + "/";
                    return 'https://' + $location.host() + "/";
                };
                this.autenticazione = function (utente) {
                    return this.post(this.getHostAddressAndPort() + COSTANTI.ENDPOINT.LOGIN, utente, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.trovaPDS = function (paramRicercaPDS) {
                    return this.post(this.getHostAddressAndPort() + COSTANTI.ENDPOINT.TROVA_PDS, paramRicercaPDS, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.registrazione = function (utente) {
                    return this.post(this.getHostAddressAndPort() + COSTANTI.ENDPOINT.REGISTRAZIONE, utente, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };
                this.stampa2D = function (data) {
                    return this.post(this.getHostAddressAndPort() + COSTANTI.ENDPOINT.STAMPA_2D, data, localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN));
                };

                this.geoCodificaIndirizzo = function (indirizzo) {
                    return this.get(COSTANTI.ENDPOINT.GOOGLE_GEOCOD + indirizzo + '&key=' + COSTANTI.KEY_GEOCOD);
                };

                this.post = function (url, data, token, config) {
                    if (token) {
                        $http.defaults.headers.common.token = token;
                    } else {
                        delete $http.defaults.headers.common.token;
                    }

                    var response = $q.defer();
                    $http.post(url, data, config).then(function (promoteResponse) {
                        response.resolve(promoteResponse.data);
                    }, function (error) {
                        response.reject(error);
                    });
                    return response.promise;
                };
                this.get = function (url, token, config) {
                    if (token) {
                        $http.defaults.headers.common.token = token;
                    } else {
                        delete $http.defaults.headers.common.token;
                    }
                    var q = $q.defer();
                    $http.get(url, config).then(function (d) {
                        var p = d.data;
                        if (p == null || p == "") {
                            var errMsg = "Info non trovata!";
                            q.reject([errMsg]);
                        } else {
                            q.resolve(p);
                        }
                    }, function (error) {
                        q.reject(error);
                    });
                    return q.promise;
                };
            };
            return new ServiziRest();
        }]);
    pnApp.factory('notificationEngine', ['$websocket', function ($websocket) {
            // Open a WebSocket connection
            var dataStream = $websocket('ws://127.0.0.1:3300/chatPN');
            var collection = [];


            dataStream.onMessage(function (message) {
                collection.push(message);
                console.log("onMessage scattato:"+message.data);
            });
            var methods = {
                collection: collection,
                get: function () {
                    dataStream.send('ciao');
                }
            };
            //methods.get() ->fa scattare il send al websocket server
            return methods;
        }]);

}());
