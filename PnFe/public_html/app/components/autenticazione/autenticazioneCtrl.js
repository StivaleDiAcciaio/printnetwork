;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('autenticazioneCtrl',
            ['$scope', 'serviziRest', 'CONST', '$translate',
                function ($scope, serviziRest, COSTANTI, $translate) {
                    $scope.formLoginData = {};
                    $scope.formRegistrazioneData = {};
                    $scope.formatoStampa2DSelezionato = null;
                    if ($scope.getRicordami()) {
                        $scope.formLoginData.email = $scope.getRicordami().email;
                        $scope.formLoginData.password = $scope.getRicordami().pwd;
                    }

                    $scope.defaultFormatoStampa2D = function () {
                        $scope.mainResetFormati2D();
                        $scope.mainAggiungiFormato2D(COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A4);
                    };
                    $scope.resetFormLogin = function () {
                        localStorage.removeItem(COSTANTI.RICORDAMI);
                        $scope.formLoginData = null;
                        $scope.resetMessaggioUtente();
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
                                    $scope.mostraMessaggioError(response.codErr);
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.codErr);
                                } else {
                                    $scope.mostraMessaggioError($translate.instant("ERR_GENERICO_MSG"));
                                }
                            });
                        }
                    };
                    $scope.tokenCaptcha = function () {
                        var noToken = false;
                        try {
                            var token = grecaptcha.getResponse();
                            return token == "" || token == null ? noToken : token;
                        } catch (err) {
                            $scope.mostraMessaggioError($translate.instant("BOX_CAPTCHA_NON_TROVATO"));
                            return noToken;
                        }
                    };
                    $scope.registrazione = function (formRegistrazione) {
                        if (formRegistrazione.$valid) {
                            if ($scope.condividoStampante &&
                                    $scope.formatiStampa2DScelti &&
                                    $scope.formatiStampa2DScelti.length > 0) {
                                $scope.formRegistrazioneData.tipologiaStampa.stampa2D.formato = $scope.formatiStampa2DScelti;
                            }
                            $scope.togglePageLoading();
                            serviziRest.registrazione({utente: $scope.formRegistrazioneData, tokenCaptcha: $scope.tokenCaptcha()}).then(function (response) {
                                if (response.esito) {
                                    $scope.mostraMessaggioInfo(response.codErr);
                                    $scope.outRegistrazione = response.data;
                                } else {
                                    $scope.mostraMessaggioError(response.codErr);
                                }
                                $scope.togglePageLoading();
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.codErr);
                                    $scope.togglePageLoading();
                                } else {
                                    $scope.mostraMessaggioError("Errore imprevisto!");
                                    $scope.togglePageLoading();
                                }
                            });
                        }
                    };

                    $scope.boxCondividoST3D = function (checkBox3D) {
                        if (!checkBox3D && $scope.formRegistrazioneData && $scope.formRegistrazioneData.tipologiaStampa) {
                            //non condivido stampante 3D
                            $scope.formRegistrazioneData.tipologiaStampa.stampa3D = null;
                        }
                    };
                    $scope.boxCondividoST2D = function (checkBox2D) {
                        if (!checkBox2D && $scope.formRegistrazioneData && $scope.formRegistrazioneData.tipologiaStampa) {
                            //non condivido stampante 2D
                            $scope.formRegistrazioneData.tipologiaStampa.stampa2D = null;
                        }
                    };
                    $scope.boxCondividoStampante = function (checkCondividoStampante) {
                        if (!checkCondividoStampante && $scope.formRegistrazioneData) {
                            //non condivido nessuna stampante
                            $scope.formRegistrazioneData.tipologiaStampa = null;
                            $scope.formRegistrazioneData.tipologiaUtente = null;
                            $scope.formRegistrazioneData.indirizzo = null;
                        }
                    };
                    $scope.resetRegistrazione = function () {
                        //resetto anche il model
                        $scope.condividoStampante = false;
                        $scope.chkBoxRegolamento = false;
                        $scope.chkBoxPrivacy = false;
                        $scope.formRegistrazioneData = null;
                        $scope.resetMessaggioUtente();
                        try {
                             grecaptcha.reset();
                        } catch (err) {
                            console.log("errore reset captcha "+err);
                        }

                    };
                    $scope.clickTabRegistrazione = function (e) {
                        $scope.resetMessaggioUtente();
                        $("#idFormRegistrazione").delay(100).fadeIn(100);
                        $("#idFormLogin").fadeOut(100);
                        $('#idFormLoginLink').removeClass('active');
                        $(this).addClass('active');
                        e.preventDefault();

                    };
                    $scope.clickTabLogin = function (e) {
                        $scope.resetMessaggioUtente();
                        $("#idFormLogin").delay(100).fadeIn(100);
                        $("#idFormRegistrazione").fadeOut(100);
                        $('#idFormRegistrazioneLink').removeClass('active');
                        $(this).addClass('active');
                        e.preventDefault();
                    };
                }]);
}());