;
(function () {
    'use strict';
    angular.module('printNetworkApp').controller('mainCtrl',
            ['$scope', '$state', '$location', '$anchorScroll', '$uibModal', 'serviziRest', 'CONST',
                function ($scope, $state, $location, $anchorScroll, $uibModal, serviziRest, COSTANTI) {
                    $scope.paginaCorrente = null;
                    $scope.messaggio = null;
                    $scope.dominioFormati2D = [];
                    $scope.dominioFormati2D[0] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A4;
                    $scope.dominioFormati2D[1] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A3;
                    $scope.dominioFormati2D[2] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A2;
                    $scope.dominioFormati2D[3] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A1;
                    $scope.dominioFormati2D[4] = COSTANTI.DOMINIO_FORMATO_STAMPA_2D.FORMATO_A0;
                    
                    $scope.formatiStampa2DScelti = [];
                   
                    $scope.setPaginaCorrente = function (pagina) {
                        $scope.paginaCorrente = {};
                        $scope.paginaCorrente.nome = pagina;
                    };
                    $scope.vaiAllaPagina = function (pagina) {
                        $state.go(pagina);
                    };
                    $scope.mostraMessaggioInfo = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.INFO, $scope);
                    };
                    $scope.mostraMessaggioWarning = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.WARNING, $scope);
                    };

                    $scope.mostraMessaggioError = function (messaggio) {
                        mostraMessaggioUtente(messaggio, COSTANTI.MESSAGE_LEVEL.ERROR, $scope);
                    };
                    $scope.resetMessaggioUtente = function () {
                        $scope.messaggio = null;
                    };
                    $scope.logout = function () {
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.TOKEN);
                        localStorage.removeItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO);
                    };
                    $scope.checkToken = function () {
                        return localStorage.getItem(COSTANTI.LOCAL_STORAGE.TOKEN) != null;
                    };
                    $scope.getUtenteLoggato = function () {
                        return JSON.parse(localStorage.getItem(COSTANTI.LOCAL_STORAGE.UTENTE_LOGGATO));
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

                    function mostraMessaggioUtente(messaggio, level, scope) {
                        scope.messaggio = {};
                        scope.messaggio.contenuto = messaggio;
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
                        $location.hash(idElemento);
                        $anchorScroll();
                    };
                    $scope.mainAnagFormati2Dmodal = function (size,formati2dUtente) {
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
                                    if (formati2dUtente && formati2dUtente.length>0){
                                        return formati2dUtente;
                                    }else {
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
                        if (toParams) {
                            $scope.setPaginaCorrente(toParams.name);
                        }
                    });
                }]);
}());