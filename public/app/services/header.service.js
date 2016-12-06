(function(){
	"use strict";
	angular.module('tamsa_pediatric').factory('headerServices',headerServices);
	headerServices.$inject = ['$http'];
	function headerServices($http){
		var service = {
			getDoctorProfile :getDoctorProfile
		};
		return service;
		function getDoctorProfile(){
			return $http.get("/api/session");
		}
	}
})();
// (function () {
//     'use strict';
//     angular.module('app')
//     .factory('dashboardService', dashboardService);

//     dashboardService.$inject = ['$http'];

//     function dashboardService($http) {
//         var service = {
//             getMsg: getMsg
//         };
//         return service;

//         function getMsg()
//         {
//             return $http.get("http://localhost:3000/api/dashboard/getMessage");
//         }
//     }
// })();
