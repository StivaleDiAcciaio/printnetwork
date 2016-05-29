;
(function () {
    angular.module('printNetworkApp').factory('serviziRest',
            ['CONST', '$http', '$location', '$q',
                function (COSTANTI, $http, $location, $q) {
                    var ServiziRest = function () {

                        this.getHostAddressAndPort = function () {
                            return 'http://' + $location.host() + ':' + $location.port() + "/";
                        };
                        this.autenticazione = function (utente) {
                            return this.post(COSTANTI.ENDPOINT.LOGIN, utente);
                        };
                        this.registrazione = function (utente) {
                            return this.post(COSTANTI.ENDPOINT.REGISTRAZIONE, utente);
                        };
                        this.stampa2D = function (data) {
                            return this.post(COSTANTI.ENDPOINT.STAMPA_2D, data);
                        };
                        this.post = function (url, data, config) {
                            $http.defaults.headers.common.token = localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                            var response = $q.defer();
                            $http.post(url, data, config).then(function (promoteResponse) {
                                response.resolve(promoteResponse.data);
                            }, function (error) {
                                response.reject(error);
                            });
                            return response.promise;
                        };
                        this.get = function (url, config) {
                            $http.defaults.headers.common.token = localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN);
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
}());
