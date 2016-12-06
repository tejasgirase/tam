(function(){
	"use strict";
	angular.module('tamsa_pediatric').factory('dashboardServices',dashboardServices);
	dashboardServices.$inject = ['$http'];
	function dashboardServices($http){
		var service = {
			getMsg :getMsg,
			getDataWithList :getDataWithList,
			getUserSession :getUserSession,
			openDocument :openDocument,
			getDataWithView :getDataWithView
		};
		return service;
		function getMsg(){
			return "tejas";
		}
		function getDataWithList(data){
			return $http.get("/api/list",{params:data});
		}
		function getDataWithView(data){
			return $http.get("/api/view",{params:data});
		}
		function getUserSession(){
			return $http.get("/api/session");
		}
		function openDocument(data){
			return $http.get("/api/open",{params:data});
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
