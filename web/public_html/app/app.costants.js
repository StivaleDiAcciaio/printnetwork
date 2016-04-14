// constants holder module
;
(function () {
    var contextRoot = '/printNetworkApp/';
    angular.module('printNetworkApp').constant('CONST', {
        "CONTEXT_ROOT": contextRoot,
        "ENDPOINT":
                {
                    "REGISTRAZIONE": contextRoot + "rest/registrazione/"
                }
    });
}());