// constants holder module
;
(function () {
    //var contextRoot = 'http://www.printnetwork.it/';
    var contextRoot = 'http://localhost/printnetwork/';
    angular.module('printNetworkApp').constant('CONST', {
        "CONTEXT_ROOT": contextRoot,
        "ENDPOINT":
                {
                    "REGISTRAZIONE": contextRoot + "apinode/registrazione",
                    "LOGIN": contextRoot + "apinode/login"
                },
        "MESSAGE_LEVEL":{
                "INFO":"INFO",
                "WARNING":"WARNING",
                "ERROR":"ERROR"
        }
    });
}());