;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('mainCtrl',
            ['$scope', '$state', '$uibModal', 'serviziRest', 'CONST', '$translate', 'animatedScroll','notificationEngine',
                function ($scope, $state, $uibModal, serviziRest, COSTANTI, $translate, animatedScroll,notificationEngine) {
                    $scope.notificationEngine=notificationEngine;
                    $scope.paginaCorrente = null;
                    $scope.showLoading = false;
                    $scope.messaggio = null;
                    $scope.boxCaptcha = false;
                    $scope.dominioFormati2D = [];
                    $scope.dominioFormati2D[0] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A4;
                    $scope.dominioFormati2D[1] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A3;
                    $scope.dominioFormati2D[2] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A2;
                    $scope.dominioFormati2D[3] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A1;
                    $scope.dominioFormati2D[4] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A0;
                    $scope.formatiStampa2DScelti = [];
                    $scope.msgIN="";
                    
                   /* $scope.segnalaMessaggioInEntrata = function(){
                      $scope.$broadcast('messaggio_in_entrata', "apri-pannello-chat");  
                    };*/
                    $scope.$on("messaggio_in", function(event, message){
                         if(message==="nuovo-messaggio"){
                             $scope.msgIN="!";
                         }else{
                             $scope.msgIN="";
                         }
                    });
                    $scope.togglePageLoading = function () {
                        $scope.showLoading = !$scope.showLoading;
                    };
                    $scope.setPaginaCorrente = function (pagina) {
                        $scope.paginaCorrente = {};
                        $scope.paginaCorrente.nome = pagina;
                    };
                    $scope.vaiAllaPagina = function (pagina) {
                        $state.go(pagina);
                    };
                    $scope.mostraMessaggioInfo = function (codice) {
                        mostraMessaggioUtente(codice, COSTANTI.MESSAGE_LEVEL.INFO, $scope);
                    };
                    $scope.mostraMessaggioWarning = function (codice) {
                        mostraMessaggioUtente(codice, COSTANTI.MESSAGE_LEVEL.WARNING, $scope);
                    };
                    $scope.mostraMessaggioError = function (codice) {
                        mostraMessaggioUtente(codice, COSTANTI.MESSAGE_LEVEL.ERROR, $scope);
                    };
                    $scope.resetMessaggioUtente = function () {
                        $scope.messaggio = null;
                    };
                    $scope.logout = function () {
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO);
                        $scope.notificationEngine.chiudiWs();
                    };
                    $scope.checkToken = function () {
                        return localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN) != null;
                    };
                    $scope.getUtenteLoggato = function () {
                        var utl = JSON.parse(localStorage.getItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO));
                        return utl != null ? utl : "";
                    };
                    $scope.setUtenteLoggato = function (utenteLoggato) {
                        localStorage.setItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO, JSON.stringify(utenteLoggato));
                    };
                    $scope.getToken = function () {
                        return localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                    };
                    $scope.setToken = function (token) {
                        localStorage.setItem(COSTANTI.LOCAL_STORAGE.TOKEN, token);
                    };
                    $scope.setRicordami = function (email, pwd) {
                        var ricordaAccesso = {};
                        ricordaAccesso.email = email;
                        ricordaAccesso.pwd = pwd;
                        localStorage.setItem(COSTANTI.RICORDAMI, JSON.stringify(ricordaAccesso));
                    };
                    $scope.getRicordami = function () {
                        if (localStorage.getItem(COSTANTI.RICORDAMI)) {
                            return JSON.parse(localStorage.getItem(COSTANTI.RICORDAMI));
                        }
                        return null;
                    };
                    function mostraMessaggioUtente(codice, level, scope) {
                        if (codice==98){$scope.logout(); $scope.vaiAllaPagina('autenticazione');return;}
                        scope.messaggio = {};
                        scope.messaggio.contenuto = $translate.instant("SERVER_COD_" + codice);
                        scope.messaggio.level = level;
                        scope.scrollTo('messaggiUtente');
                    }
                    $scope.vaiPannelloControllo = function () {
                        if ($scope.checkToken()) {
                            $scope.vaiAllaPagina(COSTANTI.PAGINA.PANNELLO_CONTROLLO);
                        } else {
                            $scope.vaiAllaPagina(COSTANTI.PAGINA.LOGIN);
                        }
                    };
                    $scope.scrollTo = function (idElemento) {
                        var elementIWantToScrollTo = document.getElementById(idElemento);
                        animatedScroll.scroll(elementIWantToScrollTo, {
                            duration: 800
                        }).then(function (element) {
                            // do something after the the list item was scrolled into view 
                            // element = listItemIWantToScrollTo 
                        });
                    };
                    $scope.mainAggiungiFormato2D = function (formato) {
                        //prima di aggiungere il formato verifico che non sia già presente
                        var esiste = false;
                        for (var i = 0; i < $scope.formatiStampa2DScelti.length; i++) {
                            if ($scope.formatiStampa2DScelti[i].value == formato.value) {
                                esiste = true;
                                break;
                            }
                        }
                        if (!esiste) {
                            $scope.formatiStampa2DScelti.push(formato);
                        }
                    };
                    $scope.mainResetFormati2D = function () {
                        $scope.formatiStampa2DScelti = [];
                    };
                    $scope.mainAnagFormati2Dmodal = function (size, formati2dUtente) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/commonModal/dominiFormatiStp2D.html',
                            controller: 'DominiFormatiStp2DCtrl',
                            size: size,
                            resolve: {
                                dominioFormati2D: function () {
                                    return $scope.dominioFormati2D;
                                },
                                formati2dUtente: function () {
                                    if (formati2dUtente && formati2dUtente.length > 0) {
                                        return formati2dUtente;
                                    } else {
                                        return $scope.formatiStampa2DScelti;
                                    }
                                }
                            }
                        });
                        modalInstance.result.then(function (formati2dScelti) {
                            $scope.formatiStampa2DScelti = formati2dScelti;
                        }, function () {
                            //mainAnagFormati2Dmodal chiusa
                        });
                    };
                    $scope.mainOpenRegolamentoModal = function (size) {
                        var modalRegolamentoInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/commonModal/regolamentoSito.html',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            },
                            size: size
                        });
                    };
                    $scope.mainOpenPrivacyModal = function (size) {
                        var modalPrivacyInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/commonModal/infoPrivacy.html',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            },
                            size: size
                        });
                    };
                    $scope.mainOpenContattiModal = function (size) {
                        var modalContattiInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/components/commonModal/contatti.html',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            },
                            size: size
                        });
                    };

                    $scope.mainMostraCaptcha = function (stato) {
                        $scope.boxCaptcha = stato;
                    };

                    /*Eventi del Routing */
                    /*OLD
                     * $scope.$on('$viewContentLoaded', function (event, viewConfig) {
                     $scope.resetMessaggioUtente();
                     if (viewConfig.context) {
                     $scope.setPaginaCorrente(viewConfig.context.name);
                     }
                     });*/
                    $scope.$on('$stateChangeSuccess', function (toSelf, toParams, fromSelf, fromParams) {
                        $scope.resetMessaggioUtente();
                        $scope.mainMostraCaptcha(false);
                        if (toParams) {
                            $scope.setPaginaCorrente(toParams.name);
                        }
                    });
                }]);
}());