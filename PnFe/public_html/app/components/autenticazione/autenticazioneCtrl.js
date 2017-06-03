;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('autenticazioneCtrl',
            ['$scope', 'serviziRest', 'CONST', '$translate',
                function ($scope, serviziRest, COSTANTI, $translate) {
                    $scope.formLoginData = {};
                    $scope.formRegistrazioneData = {};
                    $scope.formatoStampa2DSelezionato = null;
                    $scope.mostraFormRegistrazione = false;
                    $scope.mostraFormLogin = true;

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
                            $scope.togglePageLoading();
                            serviziRest.autenticazione({utente: $scope.formLoginData}).then(function (response) {
                                if ($scope.ricordami) {
                                    $scope.setRicordami($scope.formLoginData.email, $scope.formLoginData.password);
                                }
                                if (response.esito) {
                                    $scope.togglePageLoading();
                                    $scope.setToken(response.token);
                                    $scope.setUtenteLoggato(response.utenteLoggato);
                                    $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                                } else {
                                    $scope.mostraMessaggioError(response.codErr);
                                    $scope.togglePageLoading();
                                }
                            }, function (err) {
                                if (err.data) {
                                    $scope.mostraMessaggioError(err.data.codErr);
                                    $scope.togglePageLoading();
                                } else {
                                    $scope.mostraMessaggioError($translate.instant("ERR_GENERICO_MSG"));
                                    $scope.togglePageLoading();
                                }
                            });
                        }
                    };
                    //ottengo il token della risposta captcha
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
                    /**
                     * Effettua prececk prima di invocare il metodo
                     * inviaFormRegistrazione 
                     * @param {type} formRegistrazione
                     * @returns {undefined}
                     */
                    $scope.registrazione = function (formRegistrazione) {
                        if (formRegistrazione.$valid) {
                            if ($scope.condividoStampante &&
                                    $scope.formatiStampa2DScelti &&
                                    $scope.formatiStampa2DScelti.length > 0) {
                                $scope.formRegistrazioneData.tipologiaStampa.stampa2D.formato = $scope.formatiStampa2DScelti;
                            }
                            $scope.togglePageLoading();
                            if ($scope.formRegistrazioneData.indirizzo && $scope.formRegistrazioneData.indirizzo.descrizione) {
                                var location = {};
                                var lng = 0, lat = 0;
                                location.type = 'Point';
                                //acquisizione geocoordinate dall'indirizzo
                                serviziRest.geoCodificaIndirizzo($scope.formRegistrazioneData.indirizzo.descrizione).then(function (response) {
                                    if (response.status==='OK') {
                                        lng = response.results[0].geometry.location.lng;
                                        lat = response.results[0].geometry.location.lat;
                                    }
                                    location.coordinates = [lng, lat];
                                    $scope.formRegistrazioneData.location = location;
                                    $scope.inviaFormRegistrazione();
                                }, function (err) {
                                    if (err.data) {
                                        $scope.mostraMessaggioError(err.data.codErr);
                                    } else {
                                        $scope.mostraMessaggioError("Errore imprevisto!");
                                    }
                                });
                            } else {
                                $scope.inviaFormRegistrazione();
                            }
                        }
                    };
                    $scope.inviaFormRegistrazione = function () {
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
                            $scope.mainResetFormati2D();
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
                            console.log("errore reset captcha " + err);
                        }

                    };
                    $scope.clickTabRegistrazione = function (e) {
                        $scope.resetMessaggioUtente();
                        $scope.mostraFormRegistrazione = true;
                        $scope.mostraFormLogin = false;
                        $scope.mainMostraCaptcha(true);
                        $scope.scrollTo("idBoxCaptcha");
                    };
                    $scope.clickTabLogin = function (e) {
                        $scope.resetMessaggioUtente();
                        $scope.mostraFormRegistrazione = false;
                        $scope.mostraFormLogin = true;
                        $scope.mainMostraCaptcha(false);
                    };
                }]);
}());