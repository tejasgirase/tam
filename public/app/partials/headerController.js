(function(){
	'use strict';
	angular.module('tamsa_pediatric').
	controller("headerController",headerController);
	console.log("donr");
	// headerController.$inject = ['headerServices'];
	function headerController(headerServices) {
		var vm = this;
		vm.doctor_name="";
		vm.practice_id="";
		var data = headerServices.getDoctorProfile().then(function(response){
			vm.practice_id = response.data.random_code;
			vm.doctor_name = response.data.first_name + " " + response.data.last_name;
		});
	}
})();