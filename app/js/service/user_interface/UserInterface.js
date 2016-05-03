(function() {
	'use strict';

	function UserInterface($filter, $route, CONFIG, ResourceManager) {

		var service = this;
		service.ready = false;
		service.currentSelectedLanguage = CONFIG.site.default_language;
		service.site = null;
		service.order = null;

		service.setSite = function(site){
			service.site = site;
		};

		service.setLanguage = function(language){
			console.log($route);
			//$route.current.params.language = language;

			service.currentSelectedLanguage = language;
			$route.updateParams({'language': language});
		};

		service.getLanguage = function(){
			return service.currentSelectedLanguage;
		};

		service.getFlagByIso2Code = function(language){
			return CONFIG.languages[language].flag;
		};

		service.setReady = function(){
			service.ready = true;
		};
		
		service.isReady = function(){
			return service.ready;
		};
		
		service.setOrder = function(order){
			service.order = order;
		};

		service.getOrder = function(){
			return service.order;
		};

		service.countOrder = function(){
			var count = 0;

			if(service.order != null){
				count += Object.keys(service.order.accommodationOrders).length;
			}
			
			return count;
		};

		service.getHref = function(location){
			return '#/' + service.getLanguage() + '/' + location;
		};
	}

	UserInterface.$inject = [
		'$filter',
		'$route',
		'CONFIG',
		'ResourceManager'
	];

	angular
		.module('_UserInterface')
		.service('UserInterface', UserInterface);
})();