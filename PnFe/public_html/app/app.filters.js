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
        }).filter('filtraFormatiScelti', function () {
    return function (dominioFormati, formatiScelti) {
        if (dominioFormati == null || dominioFormati.length == 0) {
            return [];
        } else {
            var dominioFiltrato = [];
            var filtra = false;
            for (var i = 0; i < dominioFormati.length; i++) {
                for (var j = 0; j < formatiScelti.length; j++) {
                    if (dominioFormati[i].value == formatiScelti[j]) {
                        filtra = true;
                    }
                }
                if (!filtra) {
                    dominioFiltrato.push(dominioFormati[i]);
                }
                filtra = false;
            }
        }
        return dominioFiltrato;
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
                    if (dominioFormati[i].value == formatiScelti[j]) {
                        filtra = true;
                    }
                }
                //se non va filtrato..
                if (!filtra) {//verra semplicemente mostrato nella lista
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
});