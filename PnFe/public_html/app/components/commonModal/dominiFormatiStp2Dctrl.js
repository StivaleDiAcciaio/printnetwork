

angular.module('printNetworkApp').controller('DominiFormatiStp2DCtrl', function ($scope, $uibModalInstance, dominioFormati2D, formati2dUtente) {

    $scope.dominioFormati2D = dominioFormati2D;
    $scope.formatiStampa2DScelti = [];
    $scope.chkBoxFrmt2D_ALL = true;
    //verifica che tra i domini di stampa 2d ci sia
    //almeno un formato non scelto..
    for (var y = 0; y < $scope.dominioFormati2D.length; y++) {
        if (!$scope.dominioFormati2D[y].checked) {
            //..in questo caso deseleziona il checkALL
            $scope.chkBoxFrmt2D_ALL = false;
            break;
        }
    }
    //se utente ha precedentemente scelto dei formati, 
    //vengono mostrati sulla griglia..
    if (formati2dUtente && formati2dUtente.length > 0) {
        $scope.formatiStampa2DScelti = formati2dUtente;
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.formatiStampa2DScelti);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //Click su singolo checkBox del formato di stampa..
    $scope.toggleFormatoStampa = function (formatoSelezionato, checked) {
        if (checked) {
            //prima di memorizzare il formato scelto..verifico che non sia già stato scelto..
            var esiste = false;
            for (var i = 0; i < $scope.formatiStampa2DScelti.length; i++) {
                if ($scope.formatiStampa2DScelti[i].value == formatoSelezionato.value) {
                    esiste = true;
                    break;
                }
            }
            if (!esiste) {
                var objFormatoSelezionato = {};
                objFormatoSelezionato.value = formatoSelezionato.value;
                objFormatoSelezionato.label = formatoSelezionato.label;
                $scope.formatiStampa2DScelti.push(objFormatoSelezionato);
            }
        } else {
            //se il formato stampa è stato deselezionato..
            for (var i = 0; i < $scope.formatiStampa2DScelti.length; i++) {
                if ($scope.formatiStampa2DScelti[i].value == formatoSelezionato.value) {
                    $scope.formatiStampa2DScelti.splice(i, 1);
                    break;
                }
            }
        }
    };
    //Click sul checkBox seleziona tutti formati stampa 2d..
    $scope.toggleAllFormatoStampa = function (checkedAll) {
        for (var i = 0; i < $scope.dominioFormati2D.length; i++) {
            $scope.toggleFormatoStampa($scope.dominioFormati2D[i], checkedAll);
        }
    };
});