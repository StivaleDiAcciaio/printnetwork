// constants holder module
;
(function () {
    //var contextRoot = 'http://www.printnetwork.it/';
    var contextRoot = 'http://localhost/printnetwork/';
    angular.module('printNetworkApp').constant('CONST', {
        "CONTEXT_ROOT": contextRoot,
        "RICORDAMI":"ricordami",
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
                    "STAMPA_2D":contextRoot +"apinode/2d"
                },
        "MESSAGE_LEVEL": {
            "INFO": "INFO",
            "WARNING": "WARNING",
            "ERROR": "ERROR"
        }
    });
}());