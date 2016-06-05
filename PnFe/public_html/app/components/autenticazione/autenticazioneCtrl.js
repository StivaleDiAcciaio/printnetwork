;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('autenticazioneCtrl',
            ['$scope', 'serviziRest', 'CONST',
                function ($scope, serviziRest, COSTANTI) {
                    $scope.formLoginData = {};
                    $scope.formRegistrazioneData = {};                  
                    $scope.formatoStampa2DSelezionato = null;
                    if ($scope.getRicordami()) {
                        $scope.formLoginData.email = $scope.getRicordami().email;
                        $scope.formLoginData.password = $scope.getRicordami().pwd;
                    }

                    $scope.resetFormLogin = function () {
                        localStorage.removeItem(COSTANTI.RICORDAMI);
                        $scope.formLoginData = null;
                    };

                    $scope.login = function (formLogin) {
                        if (formLogin.$valid) {
                            serviziRest.autenticazione({utente: $scope.formLoginData}).then(function (response) {
                                if ($scope.ricordami) {
                                    $scope.setRicordami($scope.formLoginData.email, $scope.formLoginData.password);
                                }
                                if (response.esito) {
                                    $scope.setToken(response.token);
                                    $scope.setUtenteLoggato(response.utenteLoggato);
                                    $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                                } else {
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.messaggio);
                                } else {
                                    $scope.mostraMessaggioError("Errore imprevisto!");
                                }
                            });
                        }
                    };
                    
                    $scope.registrazione = function (formRegistrazione) {
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
                        
                        $scope.formRegistrazioneData.tipologiaStampa.stampa2D.formato = $scope.formatiStampa2DScelti;
                        
                        if (formRegistrazione.$valid) {
                            serviziRest.registrazione({utente: $scope.utente}).then(function (response) {
                                if (response.esito) {
                                    $scope.mostraMessaggioInfo(response.messaggio);
                                    $scope.outRegistrazione = response.data;
                                } else {
                                    $scope.mostraMessaggioError(response.messaggio);
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.messaggio);
                                } else {
                                    $scope.mostraMessaggioError("Errore imprevisto!");
                                }
                            });
                        }
                    };
                }]);
}());