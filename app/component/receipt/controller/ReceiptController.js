(function() {
	'use strict';

	function ReceiptController($rootScope, UserInterface) {

		var vm = this;

		$rootScope.$on('$routeChangeStart', function(next, current) {
			console.log('routeChangestart');
			UserInterface.setOrder(null);
		});

	}

	ReceiptController.$inject = [
		'$rootScope',
		'UserInterface'
	];

	angular
		.module('_Controllers')
		.controller('ReceiptController', ReceiptController);
})();