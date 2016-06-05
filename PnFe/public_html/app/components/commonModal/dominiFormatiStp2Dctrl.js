

angular.module('printNetworkApp').controller('DominiFormatiStp2DCtrl', function ($scope, $uibModalInstance, dominioFormati2D, formati2dUtente) {

    $scope.dominioFormati2D = dominioFormati2D;
    $scope.formatiStampa2DScelti = [];
    if (formati2dUtente && formati2dUtente.length>0) {
        $scope.formatiStampa2DScelti = formati2dUtente;
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.formatiStampa2DScelti);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.toggleFormatoStampa = function (formatoSelezionato, checked) {
        if (checked) {
            $scope.formatiStampa2DScelti.push(formatoSelezionato);
        } else {
            for (var i = 0; i < $scope.formatiStampa2DScelti.length; i++) {
                if ($scope.formatiStampa2DScelti[i].value == formatoSelezionato.value) {
                    $scope.formatiStampa2DScelti.splice(i, 1);
                }
            }
        }
    };
});