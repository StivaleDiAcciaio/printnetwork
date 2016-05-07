;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('registrazioneCtrl',
            ['$scope','$state' ,'$http', 'serviziRest', 'CONST',
                function ($scope, $state,$http, serviziRest, COSTANTI) {
                    $scope.setPaginaCorrente($state.current.name);
                    $scope.outRestCall = "";
                    $scope.outRestCallPOST = "";

                    $scope.cliccaStampa = function () {
                        serviziRest.stampa2D({stampa: "stampa2d"}).then(function (response) {
                            $scope.outRestCallPOST = response.data;
                        }, function (err) {
                            alert(err.data.messaggio);
                            if (err.status == '401') {
                                $scope.vaiAllaPagina(COSTANTI.PAGINA.LOGIN);
                            }
                        });
                    };
                    $scope.cliccaRegistrazione = function (formRegistrazione) {
                        var utenteReq = {};
                        utenteReq.nome = 'Salvatore';
                        utenteReq.cognome = 'Arinisi';
                        utenteReq.email = 'Salvatore.Arinisi@gmail.com';
                        utenteReq.indirizzo = 'Legnano, via ester cuttica n.16'
                        utenteReq.nick = 'SASA';
                        utenteReq.password = '123';
                        utenteReq.tipologiaUtente = 'P';
                        var stampa2D = {};
                        stampa2D.colore = 'C';
                        stampa2D.formato = ['A4', 'A3'];
                        var stampa3D = {};
                        stampa3D.dimensioniMax = '30x30x30';
                        stampa3D.unitaDimisura = 'cm';
                        stampa3D.materiale = 'Plastica';
                        var tipologiaStampa = {};
                        tipologiaStampa.stampa2D = stampa2D;
                        tipologiaStampa.stampa3D = stampa3D;
                        utenteReq.tipologiaStampa = tipologiaStampa;
                        if (formRegistrazione.$valid) {
                            serviziRest.registrazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $scope.mostraMessaggioInfo(response.messaggio);
                                    $scope.outRegistrazione = response.data;
                                } else {
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            }, function (err) {
                                $scope.mostraMessaggioError(err.data.messaggio);
                            });
                        }
                    };
                }]);
}());