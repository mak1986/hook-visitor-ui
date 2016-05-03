(function() {
	'use strict';

	function UiController($location, $rootScope, $routeParams, CONFIG, ResourceManager, UserInterface, $templateCache) {

		var vm = this;
		vm.ui = UserInterface;

		window.test = $templateCache;
		vm.getDate = function(){
			return new Date();
		};

		vm.getAccommodationImages = function(accommodation) {
			var images = [];
			var image;
			var id;
			var count = 0;
			for(id in accommodation.images){
				image = {
					id: id,
					image: 'http://localhost:3000/images/' + UserInterface.site.id + '/' + accommodation.images[id].name
				}; 
				if(accommodation.images[id].primary){
					images.unshift(image);
				}else{
					images.push(image);
				}
			}

			return images;
		};
		vm.getAccommodationPrimaryImage = function(accommodation){
			var id;
			for(id in accommodation.images){
				if(accommodation.images[id].primary){
					return accommodation.images[id];
				}
			}
		};
		vm.getSections = function() {
			if ($routeParams.page) {
				for (var id in vm.ui.site.pages) {
					if ($routeParams.page == vm.ui.site.pages[id].name) {
						return vm.ui.site.pages[id].sections;
					}
				}
			}
		};

		vm.getRouteParam = function(key) {
			return $routeParams[key];
		};

		vm.getSectionView = function(file) {
			return 'shared/section/' + file + '.html';
		};

		vm.getComponentView = function(component, file) {
			return 'app/component/' + component + '/view/' + file + '.html';
		};
		vm.getComponentImage = function(component, file, ext) {
			return 'app/component/' + component + '/img/' + file + '.' + ext;
		};
		vm.getImage = function(imageName){
			return 'app/images/' + imageName;
		}
		vm.mainMenuHasHome = function() {
			var id;

			for (id in vm.ui.site.pages) {
				if (vm.ui.site.pages[id].name == 'home') {
					return true;
				}
			}

			return false;
		};

	}

	UiController.$inject = [
		'$location',
		'$rootScope',
		'$routeParams',
		'CONFIG',
		'ResourceManager',
		'UserInterface',
		'$templateCache'
	];

	angular
		.module('_Controllers')
		.controller('UiController', UiController);
})();