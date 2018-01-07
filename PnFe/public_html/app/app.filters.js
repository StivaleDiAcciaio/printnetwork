angular.module('printNetworkApp')
        .filter('unique', function () {
            return function (collection, keyname) {
                var output = [], keys = [];

                angular.forEach(collection, function (item) {
                    var key = item[keyname];
                    if (keys.indexOf(key) === -1) {
                        keys.push(key);
                        output.push(item);
                    }
                });

                return output;
            };
        }).filter('evidenziaFormatiScelti', function () {
    return function (dominioFormati, formatiScelti) {
        if (dominioFormati == null || dominioFormati.length == 0) {
            return [];
        } else {
            var dominioFiltrato = [];
            var filtra = false;
            for (var i = 0; i < dominioFormati.length; i++) {
                for (var j = 0; j < formatiScelti.length; j++) {
                    if (dominioFormati[i].value == formatiScelti[j].value) {
                        filtra = true;
                    }
                }
                //se non va filtrato..
                if (!filtra) {//..aggiungo un attributo all'oggetto che indica che NON è stato scelto..
                    dominioFormati[i].checked=false;
                    dominioFiltrato.push(dominioFormati[i]);
                }else{//se va filtrato...aggiungo un attributo all'oggetto che indica che è stato scelto..
                      //verra comunque mostrato
                    dominioFormati[i].checked=true;
                    dominioFiltrato.push(dominioFormati[i]);
                }
                filtra = false;
            }
        }
        return dominioFiltrato;
    };
}).filter('filtroChat', function () {
        return function (listaMsgUtente, nickDestinatario) {
            if (listaMsgUtente === null || listaMsgUtente.length === 0) {
                return [];
            } else {
                var messaggiFiltrati = [];
                //filtro i messaggi di un determinato utente
                for (var i = 0; i < listaMsgUtente.length; i++) {
                    //..tutti quei messaggi con mittente uguale al nick del destinatario in input
                    //oppure quelli con mittente io ma con nickDestinatario il destinatario in input
                    if(listaMsgUtente[i].mittente===nickDestinatario ||
                       (listaMsgUtente[i].mittente==='io' && listaMsgUtente[i].nickDestinatario===nickDestinatario)
                      ){
                     messaggiFiltrati.push(listaMsgUtente[i]);   
                    }  
                }
            }
            return messaggiFiltrati;
        };
    });