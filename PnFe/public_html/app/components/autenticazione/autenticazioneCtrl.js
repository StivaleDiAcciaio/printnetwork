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

                    $scope.defaultFormatoStampa2D = function(){
                      $scope.mainAggiungiFormato2D(COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A4);
                    };
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
                        if (formRegistrazione.$valid) {
                            if ($scope.condividoStampante){
                                if ($scope.formatiStampa2DScelti && $scope.formatiStampa2DScelti.length>0) {
                                    $scope.formRegistrazioneData.tipologiaStampa.stampa2D.formato = $scope.formatiStampa2DScelti;
                                }
                            }else{//non condivido stampante
                                $scope.formRegistrazioneData.tipologiaStampa = null;
                                $scope.formRegistrazioneData.tipologiaUtente = null;
                                $scope.formRegistrazioneData.indirizzo = null;
                            }
                            serviziRest.registrazione({utente: $scope.formRegistrazioneData}).then(function (response) {
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