(function(){
	'use strict';
	angular.module('tamsa_pediatric').
	controller("dashboardTelepeadiatricController",dashboardTelepeadiatricController);
	dashboardTelepeadiatricController.$inject = ['dashboardServices'];
	function dashboardTelepeadiatricController(dashboardServices){
		var vm = this;
		vm.telemedicineLength="";
		vm.elabsLength;
		vm.pd_data = "";
		dashboardServices.getUserSession().then(function(response){
			vm.pd_data=response.data;
			activeDashboardTelepeadiatric();
			bindingDashboardTelepeadiatric();
		});
    function activeDashboardTelepeadiatric(){
    	getAllTelemedicineCount();
    	getAllLabCount();
    }
    function bindingDashboardTelepeadiatric(){
    	var _view="searchDoctorPatientsByNameOrDHPId" ;
    	var _viewDHP="searchDHPPatientsByNameOrDHPId" ;
    	searchPatientsByNameOrDHPIdAutocompleter("search_patient",getPatientAllDetails,true	,vm.pd_data._id,vm.pd_data.dhp_code,_view,_viewDHP);
    }
		function getAllTelemedicineCount(){
			vm.telehealth_data = {
				"design_doc": "tamsa",
				"list":       "getHospitalInquiryList",
				"view":       "getDoctorTelemedicineInqueries",
				"view_data":  {"option_list":{
							include_docs:true,
							practice_id:vm.pd_data.random_code,
							dhp_code:vm.pd_data.dhp_code,
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
							key:vm.pd_data._id,
							reduce:true,
							group:true
						}},
				"db": "meluha_db5",
			};
			var getdata = dashboardServices.getDataWithView(vm.telehealth_data).then(function(response){
				vm.elabsLength = response.data.rows[0].value;
			});
		}
		function getPatientAllDetails(){
			console.log("tejas");
		}
		function searchPatientsByNameOrDHPIdAutocompleter(search_id,selectEvent,include_image,doctor_id,dhpcode,_view,_viewDHP){
			  $("#"+search_id).autocomplete({
			    search: function(event, ui) { 
			       $("#"+search_id).addClass('myloader');
			    },
			    source: function( request, response ) {
			      var view = "";
			      var keyval = "";
			      if(vm.pd_data.level == "Doctor" || vm.pd_data.level == ""){
			        view = _view;
			        keyval = doctor_id;
			      }else{
			        view   = _viewDHP;
			        keyval = dhpcode;
			      }
			      var send_data = {
							"design_doc": "tamsa",
							"view":       view,
							"view_data":  {"option_list":{
										startkey:[keyval,$("#"+search_id).val().trim()],
										endkey: [keyval,$("#"+search_id).val().trim()+"\u9999"],
										reduce:true,
						        group:true,
						        limit:5
									}},
							"db": "meluha_db5"
						};
			      var getdata = dashboardServices.getDataWithView(send_data).then(function(res){
			      	$("#"+search_id).removeClass('myloader');
							response(res.data.rows)
						});
			    },
			    focus: function(event, ui) {
			      $("#"+search_id).val(ui.item.key[3]);
			      return false;
			    },
			    minLength: 1,
			    select: function( event, ui ) {
			      selectEvent(ui,search_id);
			      return false;
			    },
			    response: function(event, ui) {
			      if (!ui.content.length) {
			        var noResult = { key: ['','','','No results found'],label:"No results found" };
			        ui.content.push(noResult);
			        //$("#message").text("No results found");
			      }
			    },
			    open: function() {
			      //$("#"+search_id).removeClass('myloader');
			      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			    },
			    close: function() {
			      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			    }
			  }).
			  data("uiAutocomplete")._renderItem = function(ul, item) {
			    if (item.key[3] == "No results found") {
			      return $("<li></li>")
			        .data("item.autocomplete", item)
			        .append("<a>" + item.key[3]+ "</a>")
			        .appendTo(ul);
			    }
			    else {
			      if(include_image){
			        getAutoCompleteImages(item.key[2],search_id+"search_pic_");
			        return $("<li></li>")
			          .data("item.autocomplete", item)
			          .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='"+search_id+"search_pic_"+item.key[2]+"'>  " + item.key[3] + "<small class='rght-float pdhp-search-box'>"+item.key[4]+"</small></a>")
			          .appendTo(ul);
			      }else{
			        return $("<li></li>")
			          .data("item.autocomplete", item)
			          .append("<a>"+item.key[3]+"<small class='rght-float'>"+item.key[4]+"</small></a>")
			          .appendTo(ul);
			      }
			    }
			  };
		}
		function getAutoCompleteImages(uvalue,source) {
		  	var send_data = {
					"design_doc": "tamsa",
					"view":       "getPatientInformation",
					"view_data":  {"option_list":{
								key:uvalue,
				        limit:1
							}},
					"db": "meluha_db5_pi"
				};
				dashboardServices.getDataWithView(send_data).then(function(response){
					var data2 = response.data;
					if (data2.rows.length > 0) {
		        $("#phone_"+uvalue).html(data2.rows[0].value.phone);
		        if(data2.rows[0].value._attachments){
		          var url = "/api/attachment?attachment_name="+Object.keys(data2.rows[0].value._attachments)[0]+"&db="+personal_details_db+"&id="+data2.rows[0].id;
		          $("#"+source+uvalue).attr("src", url);
		        }else if(data2.rows[0].value.imgblob){
		          $("#"+source+uvalue).attr("src",data2.rows[0].value.imgblob);
		        }else{
		          
		        }
		      }
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