
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
