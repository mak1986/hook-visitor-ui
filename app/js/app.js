// Inject Modules in VisitorApp
(function() {
	'use strict';

	angular.module('VisitorApp', [
		'ngRoute',
		'ngSanitize',
		'ui.bootstrap',
		'angularMoment',
		'SharedComponents',
		'_UserInterface'
	]);

	//gular.module('VisitorApp').constant('moment');


	// Manual Bootstrap


	var initInjector = angular.injector(['ng']);
	var $http = initInjector.get('$http');

	$http.get('http://localhost:3000/visitor-config').then(
		function(res) {
			angular.module('VisitorApp').constant('CONFIG', res.data);

			// Manual Initialization. Ref: https://docs.angularjs.org/guide/bootstrap#manual-initialization
			// Note: Do not use ng-app directive
			angular.element(document).ready(function() {
				angular.bootstrap(document, ['VisitorApp']);
			});
		}
	);

	// Provider configurations

	angular.module('VisitorApp')
		.config(function(ResourceManagerProvider, CONFIG) {

			ResourceManagerProvider.setConverter(CONFIG.providers.ResourceManager.converter);
			ResourceManagerProvider.setRest(CONFIG.providers.ResourceManager.rest);
			ResourceManagerProvider.setStorage(CONFIG.providers.ResourceManager.storage);
		});
	angular.module('VisitorApp')
		.config(['$httpProvider', function($httpProvider) {
			//Reset headers to avoid OPTIONS request (aka preflight)
			$httpProvider.defaults.headers.common = {};
			$httpProvider.defaults.headers.post = {};
			$httpProvider.defaults.headers.put = {};
			$httpProvider.defaults.headers.patch = {};
		}]);

	angular.module('VisitorApp')
		.run(function(CONFIG, ResourceManager, UserInterface) {
			// Retrieve all data from server
			var count = 0;
			// must refactor simulate restricted resources.
			var modelsCount = Object.keys(CONFIG.models).length;
			var type;
			for (type in CONFIG.models) {

				ResourceManager.read(type).then(function(data) {
					//console.log("get a model success.")
					count++;

					if (count == modelsCount) {
						// service.isLoggedIn = true;
						// service.setup();
						UserInterface.setSite(ResourceManager.readFromStorage('site')[CONFIG.site.id]);
						UserInterface.setReady();
						//console.log(vm.ui.site);
						console.log("all models retrieved.");
						console.log(UserInterface.site);
					}

				}, function(errorData) {
					console.log("get a model fail.", errorData);
				});

			}
		});
})();