// constants holder module
;
(function () {
    var contextRoot = '/tellmeApp/';
    angular.module('tellmeApp').constant('CONST', {
        "CONTEXT_ROOT": contextRoot,
        "ENDPOINT":
                {
                    "TELLME": contextRoot + "rest/tellme/"
                }
    });
}());