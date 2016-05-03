(function() {
	'use strict';

	function PaymentController($location, ResourceManager, UserInterface) {

		var vm = this;
		vm.payment = { type:'payment' };

		vm.pay = function(){
			var order = UserInterface.getOrder();
			var site = UserInterface.site;
			
			vm.payment['order'] = {};
			vm.payment['order'][order.id] = order;
			vm.payment['site'] = {};
			vm.payment['site'][site.id] = site;

			console.log(vm.payment);

			ResourceManager.create(vm.payment)
				.then(function(createdPayment) {
					
					order.paid = true;
					
					ResourceManager.update(order)
						.then(function(updatedOrder){
						
						$location.path(UserInterface.getLanguage()+'/receipt');
					
					},function(){

					});
					
				}, function(reason) {

				});
		};
	}

	PaymentController.$inject = [
		'$location',
		'ResourceManager',
		'UserInterface'
	];

	angular
		.module('_Controllers')
		.controller('PaymentController', PaymentController);
})();