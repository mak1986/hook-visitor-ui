(function() {
	'use strict';

	function AccommodationBookingDetailController($location, $filter, ResourceManager, UserInterface) {

		var vm = this;
		vm.accommodationOrders = null;

		vm.getDuration = function(from, to){
			return $filter('amDifference')(to, from, 'days');
		};

		vm.getLinePrice = function(accommodationOrder){
			var duration = vm.getDuration(accommodationOrder.from, accommodationOrder.to);
			return $filter('hookFilterByFieldValue')(accommodationOrder.accommodation, 'price') * duration;
		};

		vm.getTotalPrice = function(){
			var total = 0;
			var id;

			for(id in vm.accommodationOrders){
				total += vm.getLinePrice(vm.accommodationOrders[id]);
			}

			return total;
		};
		vm.delete = function(accommodationOrder){
			ResourceManager.delete(accommodationOrder).then(function(){
				if(Object.keys(UserInterface.getOrder().accommodationOrders).length==0){
					$location.path('/'+UserInterface.getLanguage()+'/accommodations');
				}
				console.log('delete success');

			},function(){
				console.log('delete error');
			});
		}

	}

	AccommodationBookingDetailController.$inject = [
		'$location',
		'$filter',
		'ResourceManager',
		'UserInterface'
	];

	angular
		.module('_Controllers')
		.controller('AccommodationBookingDetailController', AccommodationBookingDetailController);
})();