// constants holder module
;
(function () {
    //var contextRoot = 'http://www.printnetwork.it/';
    var contextRoot = 'http://localhost/printnetwork/';
    angular.module('printNetworkApp').constant('CONST', {
        "CONTEXT_ROOT": contextRoot,
        "RICORDAMI": "ricordami",
        "LOCAL_STORAGE": {
            TOKEN: "token",
            UTENTE_LOGGATO: "utenteLoggato"
        },
        "PAGINA": {
            "PANNELLO_CONTROLLO": "pannelloControllo",
            "LOGIN": "autenticazione",
            "REGISTRAZIONE": "autenticazione",
            "HOME": "home"
        },
        "ENDPOINT":
                {
                    "REGISTRAZIONE": contextRoot + "apinode/registrazione",
                    "LOGIN": contextRoot + "apinode/login",
                    "STAMPA_2D": contextRoot + "apinode/2d"
                },
        "MESSAGE_LEVEL": {
            "INFO": "INFO",
            "WARNING": "WARNING",
            "ERROR": "ERROR"
        },
        "DOMINIO_FORMATO_STAMPA_2D": {
            "FORMATO_A4": {
                value: "A4",
                label: "216 × 279 mm"
            },
            "FORMATO_A3": {
                value: "A3",
                label: "432 × 279 mm"
            },
            "FORMATO_A2": {
                value: "A2",
                label: "432 × 559 mm"
            },
            "FORMATO_A1":{
                value: "A1",
                label: "559 × 864 mm"
            },
            "FORMATO_A0":{
                value: "A0",
                label: "864 × 1118 mm"
            }
        }
    });
}());