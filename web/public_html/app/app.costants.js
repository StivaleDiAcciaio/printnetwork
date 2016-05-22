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
                label: "Formato A4"
            },
            "FORMATO_A3": {
                value: "A3",
                label: "Formato A3"
            },
            "FORMATO_A2": {
                value: "A2",
                label: "Formato A2"
            },
            "FORMATO_A1":{
                value: "A1",
                label: "Formato A1"
            },
            "FORMATO_TUTTI":{
                value:"TF",
                label:"Tutti i formati"
            }            
        }
    });
}());