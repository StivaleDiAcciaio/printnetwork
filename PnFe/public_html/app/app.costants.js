// constants holder module
;
(function () {
    //var contextRoot = 'http://www.printnetwork.it/';
    //var contextRoot = 'http://localhost/printnetwork/';
    angular.module('printNetworkApp').constant('CONST', {
        //"CONTEXT_ROOT": contextRoot,
        "RICORDAMI": "ricordami",
        "KEY_GEOCOD": "AIzaSyDUgfDN2lOzsSvZkl0VNlTpq7BpAqMAO70",
        "MAPPA": {
            "RAGGIO_CERCHIO_DEFAULT": 500,
            "RAGGIO_CERCHIO_MIN": 100,
            "RAGGIO_CERCHIO_MAX": 5000,
            "DEFAULT_ZOOM":13,
            "FALL_GEO_ZOOM":6,
            "FALL_GEO_POSITION":[40.979898, 13.337401999999997]
        },
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
                    "REGISTRAZIONE": "printnetwork/apinode/registrazione",
                    "LOGIN": "printnetwork/apinode/login",
                    "STAMPA_2D": "printnetwork/apinode/2d",
                    "TROVA_PDS": "printnetwork/apinode/pds",
                    "GOOGLE_GEOCOD": "https://maps.googleapis.com/maps/api/geocode/json?address=",
                    "NOTIFICHE_WSOCKET": "printnetwork/notification"
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
            "FORMATO_A1": {
                value: "A1",
                label: "559 × 864 mm"
            },
            "FORMATO_A0": {
                value: "A0",
                label: "864 × 1118 mm"
            }
        }
    });
}());