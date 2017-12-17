
angular.module('printNetworkApp')
	.directive('onlyDigits', function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attr, ctrl) {
				function inputValue(val) {
					if (val) {
						var newVal = val.replace(/[^0-9]/g, '');

						if (newVal !== val) {
							ctrl.$setViewValue(newVal);
							ctrl.$render();
						}
						return newVal;
					}
					return undefined;
				}            
				ctrl.$parsers.push(inputValue);
			}
		};
	});

angular.module('printNetworkApp')
	.directive('onlyAlphabetic', function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attr, ctrl) {
				function inputValue(val) {
					if (val) {
						var newVal = val.replace(/[^A-z 'àèéìòù]/g, '');
	
						if (newVal !== val) {
							ctrl.$setViewValue(newVal);
							ctrl.$render();
						}
						return newVal;
					}
					return undefined;
				}            
				ctrl.$parsers.push(inputValue);
			}
		};
	});

angular.module('printNetworkApp')
	.directive('currency', function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attr, ctrl) {
				function inputValue(val) {
					if (val) {
						var newVal = val.replace(/[^0-9\,\.]/g, '');
	
						if (newVal !== val) {
							ctrl.$setViewValue(newVal);
							ctrl.$render();
						}
						return newVal;
					}
					return undefined;
				}            
				ctrl.$parsers.push(inputValue);
				

				element.bind('blur', function() {
					if (element.val()) {
						
						if( /^[1-9]*[0-9]+\.[0-9]{1,2}$/g.test(element.val()) )
							element.val(element.val().replace('.', ','));
						
						if(/^([1-9][0-9]{0,2}){1}(\.[0-9]{3})*(\,[0-9]{1,2})?$/g.test(element.val()))
							element.val(element.val().replace(/\./g, ''));
						
						if( !/^[1-9]*[0-9]+(\,[0-9]{1,2})?$/g.test(element.val()) )
							element.val("");
						
		            }
				});
			}
		};
	});




angular.module('printNetworkApp')
	.directive('formatValidation', function () {
		return {
			require: ['ngModel'],
			restrict: 'A',
			scope: {
				formatValidation: '@'
			},
			link: function (scope, element, attr, ctrls) {
				element.bind('blur', function() {
					if (element.val()) {
						var regex = new RegExp(scope.formatValidation);
						if( !regex.test(element.val()) )
							element.val("");
						
		            }
				});
					        
			}
		};
	});



angular.module('printNetworkApp')
.directive('percent', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function (scope, element, attr, ctrl) {
			
			var el = element[0];

			ctrl.$parsers.push(function inputValue(val) {
				if (val) {
					
					var newVal = val.replace(/[^0-9\.]/g, '');
					
					var newValArray = newVal.split(".");
					
					var left = "";
					var right = "";
					
					if(newValArray[0]!= null){						
						left = newValArray[0].replace(/[\.]/g,"");			
					}					
					
					if(newValArray[1]!= null){						
						right = newValArray[1].replace(/[\.]/g,"");					
					}
					
					newVal = val.indexOf(".")!= -1 ? (left + "." + right) : left;

			        if (newVal === val) return val;

			        var start = el.selectionStart;
			        var end = el.selectionEnd + newVal.length - val.length;

			        ctrl.$setViewValue(newVal);
			        ctrl.$render();

			        el.setSelectionRange(start, end);					
					return newVal;
				}
				return undefined;
			});
		}
	};
});
/**
 * Direttiva attributo "conferma-password"
 * */
angular.module('printNetworkApp')
        .directive('confermaPassword', function (){
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=confermaPassword"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.confronta = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
/**
 * tramite la direttiva formati-2d-min
   capiamo se è stato scelto almeno un formato stampa2d.
 */
angular.module('printNetworkApp')
        .directive('formati2dMin', function (){
    return {
        require: "ngModel",
        scope: {
            formatiScelti: "=formati2dMin"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.checkFrmt2d = function(modelValue) {
                return (scope.formatiScelti && scope.formatiScelti.length>0);
            };
 
            scope.$watch("formatiScelti", function() {
                ngModel.$validate();
            });
        }
    };
});
/**
 * Direttiva per disegnare  Stelle colorate del feedback utente
 */
angular.module('printNetworkApp')
        .directive('stelleFeedback', function (){
    return {
        require: "ngModel",
        restrict : "E",
        scope: {
            feedback: "=feedback"
        },
        templateUrl : "app/components/templates/stelleFeedback.html"
    };
});
/**
 * Direttiva per disegnare pannello direzione
 */
angular.module('printNetworkApp')
        .directive('pannelloDirezione', function (){
    return {
        require: "ngModel",
        restrict : "E",
        scope: {
            mostra:"=mostra",
            partenza:"=partenza",
            arrivo:"=arrivo",
            distanzaTotale:"=distanzaTotale",
            tempoTotale:"=tempoTotale",
            passi: "=passi",
            vettore:"=vettore"
        },
        templateUrl : "app/components/templates/pannelloDirezione.html",
        controller:'pannelloDirezioneCtrl'
    };
});

angular.module('printNetworkApp')
        .directive('pannelloChat', function (){
    return {
        require: "ngModel",
        restrict : "E",
        scope: {
            mostraChat:"=mostraChat",
            listaMessaggiUtente:"=listaMessaggiUtente",
            destinatario:"=destinatario",
            inviaMessaggioFn: '&'
        },
        templateUrl : "app/components/templates/pannelloChat.html",
        controller:'pannelloChatCtrl'
    };
});