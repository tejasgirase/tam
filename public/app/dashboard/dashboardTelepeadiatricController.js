(function(){
	'use strict';
	angular.module('tamsa_pediatric').
	controller("dashboardTelepeadiatricController",dashboardTelepeadiatricController);
	dashboardTelepeadiatricController.$inject = ['dashboardServices'];
	function dashboardTelepeadiatricController(dashboardServices){
		var vm = this;
		vm.telemedicineLength="";
		vm.elabsLength;
    getAllTelemedicineCount();
    getAllLabCount();
		function getAllTelemedicineCount(){
			vm.telehealth_data = {
				"design_doc": "tamsa",
				"list":       "getHospitalInquiryList",
				"view":       "getDoctorTelemedicineInqueries",
				"view_data":  {"option_list":{
							include_docs:true,
							practice_id:"FGlKxW",
							dhp_code:"H-testingdhp"
						}},
				"db": "meluha_db5",
			};
			var getdata = dashboardServices.getDataWithList(vm.telehealth_data).then(function(response){
				vm.telemedicineLength = response.data.rowlen;
			});
		}
		function getAllLabCount(){
			vm.telehealth_data = {
				"design_doc": "tamsa",
				"view":       "getDocumentByDoctorId",
				"view_data":  {"option_list":{
							key:"org.couchdb.user:n@n.com",
							reduce:true,
							group:true
						}},
				"db": "meluha_db5",
			};
			var getdata = dashboardServices.getDataWithView(vm.telehealth_data).then(function(response){
				vm.elabsLength = response.data.rows[0].value;
			});
		}
	}
})();
// app.controller("dashboardTelepeadiatricController",function ($state,$stateParams,$http) {
	
// 	// $http({
// 	// 	method:"GET",
// 	// 	url:"/api/list",
// 	// 	params:vm.telehealth_data
// 	// }).success(function(response){
// 	// 	console.log(response);
// 	// });
// 	console.log(vm.telehealth_data);
// 	$http.get("/api/list",{params:vm.telehealth_data}).then(function(response) {
// 	   console.log(response);
// 	 }, function(error) {
// 	 	console.log(error);
// 	});

// });sssss