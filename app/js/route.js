(function() {
	'use strict';
	
	angular.module('VisitorApp').config(['$routeProvider','$locationProvider','CONFIG',
		function($routeProvider, $locationProvider ,CONFIG) {
			
			// for(var key in CONFIG.routes){
			// 	$routeProvider.when(CONFIG.routes[key]['route'], {
			// 		templateUrl: CONFIG.routes[key]['templateUrl']
			// 	});
			// }
			var homeRoute = '/' + CONFIG.site.default_language + '/home';
			$routeProvider.when('/:language/invoice', {
				templateUrl: 'app/template/invoice.html',
				resolve:{
					"checkOrder": function($location, UserInterface){
						console.log('in checkorder');
						if(UserInterface.getOrder()==null){
							$location.path(homeRoute);
						}
					}
				}
			});
			$routeProvider.when('/:language/payment', {
				templateUrl: 'app/template/payment.html',
				resolve:{
					"checkOrder": function($location, UserInterface){
						console.log('in checkorder');
						if(UserInterface.getOrder()==null){
							$location.path(homeRoute);
						}
					}
				}
			});
			$routeProvider.when('/:language/receipt', {
				templateUrl: 'app/template/receipt.html',
				resolve:{
					"checkOrderAndPayment": function($location, UserInterface){
						console.log('in checkorder');
						var order = UserInterface.getOrder();
						var payment;
						if(order==null){
							$location.path(homeRoute);
						}else{
							if(Object.keys(order.payment).length != 1){
								$location.path(homeRoute);
							}
						}
					}
				}
			});
			$routeProvider.when('/:language/accommodations', {
				templateUrl: 'app/template/accommodations.html'
			});
			$routeProvider.when('/:language/accommodation/:id', {
				templateUrl: 'app/template/accommodation.html'
			});

			$routeProvider.when('/:language/:page', {
				templateUrl: 'app/template/page.html'
			});

			$routeProvider.otherwise({
				redirectTo: '/' + CONFIG.site.default_language + '/home',
				templateUrl: 'app/template/page.html'
			});


			// $locationProvider.html5Mode({
			//   enabled: true,
			//   requireBase: false
			// });
		}
	]);
	
	// solve nv-view inside ng-include. ref: http://stackoverflow.com/questions/16674279/how-to-nest-ng-view-inside-ng-include
	angular.module('VisitorApp').run(['$route', function($route)  {
  		$route.reload();
	}]);

})();