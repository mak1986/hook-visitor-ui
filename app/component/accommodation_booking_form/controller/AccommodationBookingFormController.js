(function() {
	'use strict';

	function AccommodationBookingFormController($filter, $uibModal, ResourceManager, UserInterface) {

		var vm = this;
		vm.accommodation = null;
		vm.extra_bed_quantity = null;
		vm.loading = false;
		vm.available = false;

		vm.book = function() {

			vm.loading = true;

			openModal();

			if (!isBooking()) {

				createOrder(createAccommodationOrder);

			} else {

				createAccommodationOrder();

			}


		};

		var openModal = function() {

			$uibModal.open({
				'templateUrl': 'app/component/accommodation_booking_form/view/modal.html',
				'controller': ['$location', '$uibModalInstance', 'parent', 'UserInterface', function($location, $uibModalInstance, parent, UserInterface) {
					var vmModal = this;

					vmModal.isLoading = function() {
						return parent.loading;
					};
					vmModal.isAvailable = function(){
						return parent.available;
					}

					vmModal.close = function() {
						$uibModalInstance.close();
					};

					vmModal.completeBooking = function() {
						$uibModalInstance.close();
						$uibModalInstance.closed.then(function() {
							$location.path(UserInterface.getLanguage() + '/invoice');
						});
					};
					$uibModalInstance.closed.then(function() {
						vm.available = false;
					});

				}],
				'controllerAs': 'AccommodationBookingModalController',
				'resolve': {
					parent: function() {
						return vm;
					}
				}
			});

		};

		var createOrder = function(callBackSuccess, callBackError) {
			var order = {
				'type': 'order',
				'paid': false,
				'site': {}
			};
			order['site'][UserInterface.site.id] = UserInterface.site;

			ResourceManager.create(order)
				.then(function(newResource) {

					UserInterface.setOrder(newResource);

					callBackSuccess();

				}, function(reason) {

					callBackError();

				});
		};

		var createAccommodationOrder = function(callBackSuccess, callBackError) {
			
			if (!isAvailable()) {
				vm.loading = false;
				vm.available = false;
				return;
			}
			vm.available = true;

			var accommodationOrder = {
				'type': 'accommodation__order',
				'from': vm.from.toISOString().substring(0, 10),
				'to': vm.to.toISOString().substring(0, 10),
				'extra_bed_quantity': vm.extra_bed_quantity,
				'accommodation': {},
				'order': {}
			};
			accommodationOrder['accommodation'][vm.accommodation.id] = vm.accommodation;
			accommodationOrder['order'][UserInterface.getOrder().id] = UserInterface.getOrder();


			ResourceManager.create(accommodationOrder)
				.then(function(newResource) {

					vm.loading = false;
					//callBackSuccess();

				}, function(reason) {

					//callBackError();

				});
		};

		// havn't check for paid order
		var isAvailable = function() {
			var newFrom = new Date(vm.from.toISOString().substring(0, 10));
			var newTo = new Date(vm.to.toISOString().substring(0, 10));
			var existingFrom;
			var existingTo;

			var orders = ResourceManager.readFromStorage('order');
			var orderId;

			var accommodationOrders;
			var accommodationOrder;
			var accommodationOrderId;

			var accommodation;

			for (orderId in orders) {
				accommodationOrders = orders[orderId].accommodationOrders
				for (accommodationOrderId in accommodationOrders) {

					accommodationOrder = accommodationOrders[accommodationOrderId];
					accommodation = $filter('hookFilterByFirstRelationship')(accommodationOrder.accommodation);

					if (accommodation.id == vm.accommodation.id) {
						existingFrom = new Date(accommodationOrder.from);
						existingTo = new Date(accommodationOrder.to);

						if (newFrom < existingTo && existingFrom < newTo) {
							return false;
						}
					}
				}
			}

			return true;
		};

		var isBooking = function() {
			if (UserInterface.getOrder() == null) {
				return false;
			}

			return true;

		};


		// Date picker

		vm.from = new Date();
		vm.to = new Date();
		vm.to.setDate(vm.from.getDate() + 1);

		vm.fromOptions = {
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};

		vm.toOptions = {
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: vm.to,
			startingDay: 1
		};

		vm.open1 = function() {
			vm.popup1.opened = true;
		};

		vm.open2 = function() {
			vm.popup2.opened = true;
		};

		vm.format = 'dd-MMMM-yyyy';

		vm.popup1 = {
			opened: false
		};

		vm.popup2 = {
			opened: false
		};



	}

	AccommodationBookingFormController.$inject = [
		'$filter',
		'$uibModal',
		'ResourceManager',
		'UserInterface'
	];

	angular
		.module('_Controllers')
		.controller('AccommodationBookingFormController', AccommodationBookingFormController);
})();