;
(function () {
    angular.module('tellmeApp').factory('apiService',
            ['CONST', '$http', '$location', '$q',
                function (CONST, $http, $location, $q) {
                    var ApiService = function () {
                        
                        this.getHostAddressAndPort = function () {
                            return 'http://' + $location.host() + ':' + $location.port() + "/";
                        };
                        this.inviaMessaggio = function (richiesta) {
                            return this.post(CONST.ENDPOINT.TELLME,richiesta);
                        };

                        this.leggiMessaggio = function (richiesta) {
                            return this.get(CONST.ENDPOINT.TELLME,richiesta);
                        };

                        this.post = function (url, data, config) {
                            var response = $q.defer();
                            $http.post(url, data, config).then(function (promoteResponse) {
                                response.resolve(promoteResponse.data);
                            }, function (error) {
                                response.reject(error);
                            });
                            return response.promise;
                        };
                        this.get = function (url, config) {
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
                    return new ApiService();
                }]);
}());
