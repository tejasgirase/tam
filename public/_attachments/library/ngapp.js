var app = angular.module('tamsa', ['ui.router','angularUtils.directives.dirPagination']);
var $state_global = "";
app.factory('tamsaFactories', function($state) {
  $state_global = $state;
  return {
    saveRequestForFMH: function(action,parent,relation,condition){
      $.couch.db(db).view("tamsa/testFamilyMedicalHistory",{
        success:function(data){
          if(data.rows.length > 0) {
            var newdata =getRelationAndCondition(data.rows[0].doc,parent,relation,condition);
            newdata.update_ts = new Date();
            $.couch.db(db).saveDoc(newdata, {
              success: function(data) {
                if(action == "risk"){
                  tamsaRiskCalculator.getPatientMetabolicRiskParameters();
                }else if(action != ""){
                  successOnSavingFMH(action);
                }else{
                  
                }  
              },
              error: function(status) {
                newAlert("danger","reason");
                $("html, body").animate({scrollTop: 0}, 'slow');
                $("#add_fmh").removeAttr("disabled");
                return false;
              }
            });
          }else{
            var data_test = "";
            var newdata_relations = getRelationAndCondition(data_test,parent,relation,condition);
            var fmh_doc = {
              update_ts: new Date(),
              relations: newdata_relations,
              doctype:   "Family_Medical_History",
              user_id:   userinfo.user_id
            }
            $.couch.db(db).saveDoc(fmh_doc, {
              success: function(data) {
                if(action == "risk"){
                  tamsaRiskCalculator.getPatientMetabolicRiskParameters();
                }else if(action != ""){
                  successOnSavingFMH(action);
                }else{
                  
                }
              },
              error: function(status) {
                newAlert("danger","reason");
                $("html, body").animate({scrollTop: 0}, 'slow');
                $("#add_fmh").removeAttr("disabled");
                return false;
              }
            });
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        startkey:[userinfo.user_id],
        endkey:[userinfo.user_id, {}, {}],
        include_docs:true
      });
    },
    selectLocationForAppointment : function (selectid,selval) {
      $.couch.db(db).view("tamsa/getLocationSettings",{
        success: function(data) {
          if(data.rows.length == 0) {
            $("#"+selectid).html("<option>"+pd_data.city+"</option>")
          }else if(data.rows.length == 1 && data.rows[0].doc.location_data.length > 0){
            var locdata = data.rows[0].doc.location_data,
                output = [];
            for(var i=0;i<locdata.length;i++){
              output.push("<option>"+locdata[i].city+"</option>");
            }
            $("#"+selectid).html(output.join(""));
            if(selval) {
              $("#"+selectid).val(selval);
            } 
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:pd_data.dhp_code,
        include_docs:true
      });
    },
    deleteDocumentWithCallBack : function (modal_id,doc,callback) {
      $.couch.db(db).removeDoc(doc, {
        success:function(data) {
          newAlert('success', 'Removed Successfully!');
          $('html, body').animate({scrollTop: 0}, 'slow');
          $('#'+modal_id).modal("hide");
          callback();
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    },
    saveSinglePatientFromNewAppointmentFrontDesk: function(doAction,newPatient){
      var patient_dhp_id = "SHS-"+getInvitationcode();
      var user_id = $.couch.newUUID();
      if(newPatient){
        $("#search_patient_for_appointment").attr("userid",user_id);
      }
      var isu_pi_data = {
        MaritalStatus:       "",
        address1:            "",
        address2:            "",
        bloodgroup:          "",
        city:                pd_data.city,
        country:             pd_data.country,
        doctype:             "UserInfo",
        ename:               "",
        ephone:              "",
        erelation:           "",
        first_nm:            $("#fd_appointment_patient_first_name").val(),
        last_nm:             $("#fd_appointment_patient_last_name").val(),
        gender:              "",
        initial:             false,
        update_ts:           d,
        patient_dhp_id:      patient_dhp_id,
        phone:               $("#fd_appointment_patient_phone").val(),
        user_email:          $("#fd_appointment_patient_email").val(),
        pincode:             pd_data.pincode ? pd_data.pincode : "",
        state:               pd_data.state,
        user_id:             user_id,
        added_by:            "Front_Desk",
        adder_id:            pd_data._id,
        free_credits:        3,
        credit_start_date:   moment(d).format("YYYY-MM-DD"),
        credit_end_date:     moment(d).add(4, 'months').format("YYYY-MM-DD"),
        applied_coupen_code: [],
        purchased_credits:   0,
        partial:             true
      };
      
      var isu_contactdata = {
        _id:            user_id,
        doctype:        "UserInfo",
        user_id:        user_id,
        patient_dhp_id: patient_dhp_id,
        user_email:     $("#fd_appointment_patient_email").val(),
        update_ts:      d,
        insert_ts:      d,
        height:         "",
        waist:          "",
        weight:         "",
        Procedure:      "",
        Medication:     "",
        Condition:      "",
        Allergies:      "",
        initial:        true,
        Diastolic_bp:   "",
        Pulse:          "",
        Systolic_bp:    "",
        alcohol:        "",
        hdl:            "",
        ldl:            "",
        mobile_id:      "",
        smoking:        "",
        tgl:            "",
        added_by:       "Front_Desk",
        adder_id:       pd_data._id
      };
      
      var isu_subscriber_doc = {
        Designation:     "",
        Name:            $("#fd_appointment_physician_list").val(),
        Email:           $("#fd_appointment_physician_list").data("doctor_email"),
        doctor_id:       $("#fd_appointment_physician_list").data("doctor_id"),
        Phone:           $("#fd_appointment_physician_list").data("doctor_phone"),
        Relation:        "Doctor",
        "Select Report": "All conditions",
        doctype:         "Subscriber",
        insert_ts:       d,
        user_id:         user_id,
        User_firstname:  $("#fd_appointment_patient_first_name").val(),
        User_lastname:   $("#fd_appointment_patient_last_name").val(),
        patient_dhp_id:  patient_dhp_id,
        dhp_code:        pd_data.dhp_code,
        added_by:        "Front_Desk",
        frequency:       "",
        payment_status:  "unpaid",
        adder_id:        pd_data._id,
        report_freq:     "",
        alerts:          "",
        added_by:        "Front_Desk",
        adder_id:        pd_data._id,
        initial:         true
      };

      var isu_cron_record_doc = {
        doctype:        'cronRecords',
        operation_case: '6',
        processed:      'No',
        first_nm:       $("#fd_appointment_patient_first_name").val(),
        last_nm:        $("#fd_appointment_patient_last_name").val(),
        user_email:     $("#fd_appointment_patient_email").val(),
        phone:          $("#fd_appointment_patient_phone").val(),
        address1:       "",
        address2:       "",
        ename:          "",
        ephone:         "",
        user_id:        user_id,
        gender:         "",
        country:        pd_data.country,
        state:          pd_data.state,
        city:           pd_data.city,
        pincode:        pd_data.pincode ? pd_data.pincode : "",
        status:         "",
        erelation:      "",
        height:         "",
        weight:         "",
        waist:          "",
        bloodgroup:     "",
        Procedure:      "",
        Medication:     "",
        Condition:      "",
        Allergies:      "",
        patient_dhp_id: patient_dhp_id,
        update_ts:      d,
        insert_ts:      d,
        added_by:       "Front_Desk",
        adder_id:       pd_data._id,
        initial:        true
      }

      var bulk_data = [];
      bulk_data.push(isu_contactdata);
      bulk_data.push(isu_subscriber_doc);
      bulk_data.push(isu_cron_record_doc);
        $.couch.db(personal_details_db).saveDoc(isu_pi_data,{
          success:function(data){
            $.couch.db(db).bulkSave({"docs":bulk_data},{
              success:function(data){
                doAction(user_id);
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
    },
    displayLoggedInUserDetails: function(data) {
      $("#random_code_span").html(data.random_code);
      if (data.level) {
        if (data.level == "Doctor") {
          $("#Logedin").text("Dr "+String(data.first_name)); 
        }
        else {
          $("#Logedin").text(data.first_name);
          //$('#isu_physicians').attr('disabled', true);
          //$("#physicians_by_dhp_id").attr('disabled', true);
          $("#daily_dashboard_parent").hide();
        }
      }
      else {
        $("#Logedin").text("Dr "+String(data.first_name));
      }
    },
    pdBack: function (){
      $("body").on("click",".pd_back",function() {
        $state.go("dashboard");
      });
    },
    sharedBindings: function (){
      $('#Logout').off().on('click',function() {
      // $("body").on("click","",function(){
        $.couch.logout({
          success: function(data) {
            backafter();
            window.location.href = "index.html";
          }
        });
      });
      $("body").on("keypress", "#advance_paid, #total_cash_paid, #total_online_paid, #total_bill_discount, #diagnosis_procedure_charges_val, .sbr_charges, .prod_cost, .prod_price, #edit_prodp, #edit_cost, #code,#lot, #edit_code, #edit_lot, .editqty_num, #qty_t, .min-age-value, .max-age-value, .dose-interval-value, #task_manager_autoremove_request, #pdphone,  .drug_quantity, .drug_strength, #ct_systolic_bp, #ct_diastolic_bp, #ct_heartrate, #ct_Fasting_Glucose, #ct_O2, #ct_temp, #ct_respiration_rate, #ct_bmi_weight, #ct_bmi_height, #ct_bmi_value, #ct_waist, #location_phone",function (e) {
        return allowOnlyNumbers(e);
      });

      $("body").on("keypress","#pdphonealert, #su_phone_number, #isu_ephone, #isu_phone, #edit_patient_emergency_phone, #edit_patient_phone, #fd_appointment_patient_phone,#patient_phone_appointment", function(e){
        return allowOnlyTenNumbers(e,$(this));
      });

      $('#mh_patient_dhp_id_print').off().on('click',function() {
      // $("#mh_patient_dhp_id_print").click(function() {
        printPatientDHPIDSlip($("#mh_patient_dhp_id").text(),pd_data.first_name+ " " +pd_data.last_name,$("#mh_name_new").text(),userinfo.date_of_birth,$("#mh_gender_new").text(),userinfo.address1 +" "+userinfo.address2,$("#mh_phone_no").text(),userinfo.update_ts);
      })

      // $("").on("click","#add_padf",function(){
      //   console.log("test1");
      //   addPadf($("#add_padf").attr("operation"));
      // });

      // // $("body").on("click","#add_new_allergiess",function(){
      // //   console.log("test1");
      // //   addNewAllergiesModel();
      // // });

      // // $("body").on("click","#remove_new_allergiess",function(){
      // //   console.log("test1");
      // //   $(this).parent().remove();
      // // });
      // $("body").on("click","#mh_patient_dhp_id_print",function(){
      //   printPatientDHPIDSlip($("#mh_patient_dhp_id").text(),pd_data.first_name+ " " +pd_data.last_name,$("#mh_name_new").text(),userinfo.date_of_birth,$("#mh_gender_new").text(),userinfo.address1 +" "+userinfo.address2,$("#mh_phone_no").text(),userinfo.update_ts);
      // });
    },
    getSearchPatient: function(user_id,task,attachment_id,activateModuleFN) {
      $('#mytabs').show();
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
        success: function(data) {
          $.couch.db(db).view("tamsa/testPatientsInfo",{
            success:function(meddata){
              if(data.rows.length == 1){
                userinfo = data.rows[0].doc;
                userinfo.date_of_birth = moment(userinfo.date_of_birth).format("YYYY-MM-DD");
                if(meddata.rows.length > 0){
                  userinfo_medical = meddata.rows[0].doc;  
                }
                $(".pd").show('slow');
                $(".pd").css('display','inline-block'); 
                setmenu();
                $("#practice_dashboard_link").parent().removeClass("active");
                getUserpicAndInfo(data);
                setPatientBriefSummary();
                switch(task){
                  case "patientImageLink":
                    activateModuleFN();
                    break;
                  case "Appointment":
                    $state.go("patient_appointments",{user_id:user_id});
                    break;
                  case "eRx":
                    $state.go("medical_history",{user_id:user_id,tab_id:"medication"});
                  break;
                  case "eImaging":
                    $state.go("medical_history",{user_id:user_id,tab_id:"imaging order"});
                  break;
                  case "eLab":
                    $state.go("medical_history",{user_id:user_id,tab_id:"elab order"});
                    break;
                  case "Other":
                    $state.go("medical_history",{user_id:user_id,tab_id:"other"});
                    break;
                  case "eLabResults":
                    $state.go("medical_history",{user_id:user_id,tab_id:"eLabResults",attachment_id:attachment_id});
                  break;
                  case "eImagingResults":
                    $state.go("medical_history",{user_id:user_id,tab_id:"eImagingResults",attachment_id:attachment_id});
                  break;
                  case "Charting_Template":
                  if(attachment_id){
                    $state.go("patient_charting_templates",{user_id:user_id,template_id:attachment_id,template_state:"choose"});
                  }else{
                    $state.go("patient_charting_templates",{user_id:user_id,template_state:"choose"});
                  }
                  break;
                }
              }else{
                if (data.rows.length > 1) newAlert("danger","There are multiple entries for given User ID. Please contact Your Admin.")
                else newAlert("danger","No User Found with given User ID.")
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:user_id,
            include_docs:true
          });
        },
        error: function(status) {
          console.log(status);
        },
        key:user_id,
        include_docs:true
      });  
    },
    makePatientCritical: function (action,id,user_id,doctor_id) {
      var d                  = new Date();
      var condition_severity = '';
      var critical_checkbox  = '';

      if (action) {
        condition_severity = "High";
      }
      else {
        condition_severity = "Low"; 
      }

      //  critical_checkbox = $("#critical_checkbox").val();

      var condition = {
        CONDITION:          'From Doctor Note',
        CONDITION_SEVERITY: condition_severity,
        doctype:            'Conditions',
        user_id:            user_id,
        doctor_id:          doctor_id,
        insert_ts:          new Date()
      };

      // if (critical_checkbox) {
      //   condition._id  = $("#critical_checkbox").val();
      //   condition._rev = $("#critical_checkbox").attr('rev');
      // }

      $.couch.db(db).view("tamsa/patientConditions", {
        success: function(data) {
          if(data.rows.length == 1) {
            condition._id  = data.rows[0].value._id;
            condition._rev = data.rows[0].value._rev;
          }
          if (data.rows.length > 1) {
             condition._id  = data.rows[0].value._id;
             condition._rev = data.rows[0].value._rev; 

            for (var i = 1; i < data.rows.length; i++) {
              var extra_doc = {
                  _id:  data.rows[i].value._id,
                  _rev: data.rows[i].value._rev
              };
              $.couch.db(db).removeDoc(extra_doc, {
                  success: function(data) {
                    console.log(data);
                  },
                  error: function(status) {
                    console.log(status);
                  }
              }); 
            }
          }
          
          $.couch.db(db).saveDoc(condition, {
            success: function(data) {
              newAlert('success', 'Saved successfully !');
              $('html, body').animate({scrollTop: 0}, 'slow');
              if(id == "regular_patient_link"){
                plController.getRegularPatients();
              }else if (id == "critical_patient_link"){
                plController.getDoctorsPatientList();    
              }else if(id == "daily_dashboard_tab"){
                plController.getCriticalPatientsForDailyDashboard();
              }else{
                getCriticalConditionStatusFromDoctorNote(id);
                $("#critical_checkbox").attr("disabled", false);
              }
              //getDoctorPatients(pd_data._id);
            },
            error: function(data, error, reason) {
              if (data == '409') {
                newAlert('danger', 'Details were updated already on other device.'); 
              }
              else {
                newAlert('danger', reason);
              }
              $("#critical_checkbox").attr("disabled", false);
            }
          });
        },
        error: function(status) {
            console.log(status);
        },
        key: [user_id,"From Doctor Note",doctor_id]
      });  
    },
    displayDoctorInformation: function(data) {
      $("#random_code_span").html(data.random_code);
      if (data.level) {
        if (data.level == "Doctor") {
          $("#Logedin").text("Dr "+String(data.first_name)); 
        }
        else {
          $("#Logedin").text(data.first_name);
          //$('#isu_physicians').attr('disabled', true);
          //$("#physicians_by_dhp_id").attr('disabled', true);
          $("#daily_dashboard_parent").hide();
        }
      }
      else {
        $("#Logedin").text("Dr "+String(data.first_name));
      }
    },
    blockScreen: function(message,color){
      $.blockUI({
        message: '<h1>'+message+'</h1>',
        css:{
          color: color
        }
      });
    },
    unblockScreen: function(){
      $.unblockUI();
    }
  };
});

app.filter('custom_level', function ($scope) {
  return function (level) {
      if(level == "Doctor") {
        $.couch.db(db).view("tamsa/getMiscSetting", {
          success: function(data) {
            if(data.rows.length > 0) {
              $("#misc_front_disk").attr("checked", data.rows[0].value.enable_front_disk);
              $("#save_misc_setting").attr("index", data.rows[0].value._id);
              $("#save_misc_setting").attr("rev", data.rows[0].value._rev);
            }else {
              return true;
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key: [pd_data._id,pd_data.dhp_code],
          include_docs:true
        });
        return true;
      }else {
        return false;
      }
  };
});

// app.provider('modalState', function($stateProvider) {
//   var provider = this;
//   this.$get = function() {
//     return provider;
//   }
//   this.state = function(stateName, options) {
//     var modalInstance;
//     $stateProvider.state(stateName, {
//       url: options.url,
//       onEnter: function($modal, $state) {
//         modalInstance = $modal.open(options);
//         modalInstance.result['finally'](function() {
//           modalInstance = null;
//           if ($state.$current.name === stateName) {
//               $state.go('^');
//           }
//         });
//       },
//       onExit: function() {
//         if (modalInstance) {
//           modalInstance.close();
//         }
//       }
//     });
//   }
// });
//app.config(function($stateProvider, modalStateProvider, $urlRouterProvider){
app.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider){
  paginationTemplateProvider.setPath('template/dirPagination.tpl.html');
  $urlRouterProvider.otherwise('/dashboard');
  $stateProvider
  .state('telemedicine', {
    url: '/telemedicine/:doc_id',
    views: {
      'dashboard-view': {
        templateUrl: 'template/telehealth.html',
        controller: 'telemedicineController'
      },
      'dd-menu@telemedicine': {
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('inventory', {
    url: '/inventory',
    views: {
      'dashboard-view': {
        templateUrl: 'template/inventory.html',
        controller: 'inventoryController'
      },
      'dd-menu@inventory':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  }).state('admin', {
    url: '/admin',
    views: {
      'dashboard-view': {
        templateUrl: 'template/admin.html',
        controller: 'adminController'
      },
      'dd-menu@admin':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('community_template', {
    url: '/community_template',
    views: {
      'dashboard-view': {
        templateUrl: 'template/community-template.html',
        controller: 'templateCommunityController'
      },
      'dd-menu@community_template':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('dailydashboard', {
    url: '/dailydashboard',
    views: {
      'dashboard-view': {
        templateUrl: 'template/daily-dashboard.html',
        controller: 'dailyDasboardController'
      },
      'vital_signs@dailydashboard':{
        templateUrl: 'template/vital-signs.html'
      },
      'dd-menu@dailydashboard':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('frontdesk', {
    url: '/frontdesk',
    views: {
      'dashboard-view': {
        templateUrl: 'template/front-desk.html',
        controller: 'frontDeskController'
      },
      'dd-menu@frontdesk':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('practice_info', {
    url: '/practice_info/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/practice-info.html',
        controller: 'practiceInfoController'
      },
      'dd-menu@practice_info':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patientlist', {
    url: '/patientlist',
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-list.html',
        controller: 'patientListController'
      },
      'dd-menu@patientlist':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('dashboard', {
    url: '/dashboard',
    views: {
      'dashboard-view': {
        templateUrl: 'template/dashboard.html',
        controller: 'dashboardController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patientinfo', {
    url: '/patientinfo/:user_id',
    params: {
      user_id: null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-info.html',
        controller: 'patientInfoController'
      },
      'dd-menu@patientinfo':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('appointments', {
    url: '/appointments/:user_id/:request_id',
    params: {
      user_id: null,
      request_id: null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-appointments.html',
        controller: 'patientAppointmentsController'
      },
      'dd-menu@appointments':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('billing', {
    url: '/billing',
    views: {
      'dashboard-view': {
        templateUrl: 'template/billing.html',
        controller: 'billingController'
      },
      'billing_template@billing':{
        templateUrl: 'template/billing_template.html',
        controller: 'billingTemplateController'
      },
      'dd-menu@billing':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('daily_dashboard_task_manager', {
    url: '/task_manager/:user_id/:action/:attachment_id',
    params:{
      action: null,
      user_id: null,
      attachment_id: null
    },
   views: {
      'dashboard-view': {
        controller: 'taskManagerController'
      },
      'dd-menu@daily_dashboard_task_manager':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('task_manager', {
    url: '/task_manager',
    params:{
      action: null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/task-manager.html',
        controller: 'taskManagerController'
      },
      'dd-menu@task_manager':{
        templateUrl: 'template/doctor-menu.html',
        controller: 'dashboardMenuController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('population_health_management', {
    url: '/population_health_management',
    views: {
      'dashboard-view': {
        templateUrl: 'template/population-health-management.html',
        controller: 'populationHealthManagementController'
      },
      'dd-menu@population_health_management':{
        templateUrl: 'template/doctor-menu.html'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patientdetails', {
    url: '/patientdetails/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-template.html'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('medical_history', {
    url: '/patient_medical_history/:user_id',
    params: {
      user_id:       null,
      tab_id:        null,
      attachment_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-medical-history.html',
        controller: 'patientMedicalHistoryController'
      },
      'menu@medical_history':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'add_medication@medical_history':{
        templateUrl: 'template/add-medication.html',
        controller: 'patientAddMedicationController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_referral', {
    url: '/patient_referral/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-referral.html',
        controller: 'patientReferralController'
      },
      'menu@patient_referral':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('risk_calculator', {
    url: '/risk_calculator/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/risk-calculator.html',
        controller: 'riskCalculatorController'
      },
      'menu@risk_calculator':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_appointments', {
    url: '/patient_appointments/:user_id/:request_id',
    params: {
      user_id: null,
      request_id: null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-appointments.html',
        controller: 'patientAppointmentsController'
      },
      'menu@patient_appointments':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_billing', {
    url: '/patient_billing/:user_id/:index',
    params: {
      user_id: null,
      index: null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-billing.html',
        controller: 'patientBillingController'
      },
      'menu@patient_billing':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'billing_template@patient_billing':{
        templateUrl: 'template/billing_template.html',
        controller: 'billingTemplateController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_diagnosis', {
    url: '/patient_diagnosis/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-diagnosis.html',
        controller: 'patientDiagnosisController'
      },
      'menu@patient_diagnosis':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_ecgresults', {
    url: '/patient_ecgresults/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-ecg-results.html',
        controller: 'patientECGResultsController'
      },
      'menu@patient_ecgresults':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_care_plans_summary', {
    url: '/patient_care_plans_summary/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/care-plan-summary.html',
        controller: 'patientCarePlanSummaryController'
      },
      'menu@patient_care_plans_summary':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_choose_careplan', {
    url: '/patient_choose_careplan/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/choose-care-plans.html',
        controller: 'patientChooseCarePlanController'
      },
      'menu@patient_choose_careplan':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_build_careplan', {
    url: '/patient_build_careplan/:user_id/:template_id',
    params: {
      user_id: null,
      template_id:null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/build-care-plan.html',
        controller: 'patientBuildCarePlanController'
      },
      'menu@patient_build_careplan':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_generic_chart_note', {
    url: '/patient_generic_chart_note:/user_id/:template_id',
    params: {
      user_id: null,
      template_state:null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-charting-template.html',
        controller: 'patientChartingTemplateController'
      },
      'menu@patient_generic_chart_note':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_charting_templates', {
    url: '/patient_charting_templates/:user_id/:template_state/:template_id',
    params: {
      user_id: null,
      template_id:null,
      template_state:null,
      template_parameter:null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-charting-template.html',
        controller: 'patientChartingTemplateController'
      },
      'menu@patient_charting_templates':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'add_medication@patient_charting_templates':{
        templateUrl: 'template/add-medication.html',
        controller: 'patientAddMedicationController'
      },
      'vital_signs@patient_charting_templates':{
        templateUrl: 'template/vital-signs.html'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  })
  .state('patient_build_templates', {
    url: '/patient_build_templates/:user_id/:template_state',
    params: {
      user_id: null,
      template_state:null
    },
    views: {
      'dashboard-view': {
        templateUrl: 'template/patient-charting-template.html',
        controller: 'patientChartingTemplateController'
      },
      'menu@patient_build_templates':{
        templateUrl: 'template/patient-menu.html',
        controller: 'patientDetailsController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  });
  
  // modalStateProvider.state('dailydashboard.patient_charting_templates', {
  //   url: '/patient_charting_templates/:template_state/:template_id',
  //   parent:'patientdetails',
  //   templateUrl: 'template/patient-charting-template.html',
  //   controller: 'patientChartingTemplateController',
  //   params: {
  //     user_id: null,
  //     template_id:null,
  //     template_state:null
  //   }
  // });
});

// app.controller("mainCtrl",function($scope,$location){
//   $scope.init = function(){
//     $.couch.session({
//       success: function(data) {
//         if(data.userCtx.name == null){
//            window.location.href = 'index.html';
//         }
//         else {
//           backbefore();
//         }
//       }
//     });
//   }
//   $scope.changeDashboard = function(module_name){
//     if(module_name == 'refer'){
//       $('#refer-a-doc').show();
//     }
//     else if(module_name == "teleh"){
//       $(".tab-pane").removeClass("active");
//       $("#telemedicine_inquiry_tab").addClass("active");
//       $("#home").addClass("active");
//       $("#personal_details_in").addClass("active");
//       $("#lab_results_inner").addClass("active");
//       $('#telehealth').show();
//       getDoctorTelemedicineInqueries();
//     }else if(module_name == "dailydasboard"){
//       $('#dr_daily_dashboard').show();
//       $(".tab-pane").removeClass("active");
//       $("#dr_daily_dashboard").addClass("active");
//     }
//     else if(module_name == "templatecommunity"){
//       $(".tab-pane").removeClass("active");
//       $("#dc_template_list_parent").addClass("active");
//       $("#dc_template_list").show();
//       $("#save_dc_charting_template_tab").hide();
//       $("#home").addClass("active");
//       $("#personal_details_in").addClass("active");
//       $("#lab_results_inner").addClass("active");
//       $("#dc_charting_flag").val("Copy");
//       $('#templatecommunity').show();
//       getDCTemplateList();
//     }else if(module_name == 'ebilling'){
      
//     }else if(module_name == 'frontdesk'){
      
//     }
//   }
//   $scope.onreferdocsend = function(){
//     $("#rd_save").attr("disabled","disabled");
//     if(requiredReferDoc() && verifyEmail("rd_doctor_email")){
//      saveRd();
//     }else{
//       $("#rd_save").removeAttr("disabled");
//       return false;
//     }
//   }
 
//   var getEprescribe = function(){
//     $.couch.db(db).view("tamsa/getEprescribe", {
//       success: function(data) {
//         if(data.rows.length > 0) {
//           $("#push_medications").attr("checked", data.rows[0].value.push_medications);
//           $("#send_an_rx_directly").attr("checked", data.rows[0].value.send_an_rx_directly);
//           $("#update_existing_medications").attr("checked", data.rows[0].value.update_existing_medications);
//           $("#save_e_prescribe").attr("index", data.rows[0].value._id);
//           $("#save_e_prescribe").attr("rev", data.rows[0].value._rev);

//           if(!data.rows[0].value.push_medications && !data.rows[0].value.send_an_rx_directly && !data.rows[0].value.update_existing_medications) {
//             $("#current_madication").removeClass("pd");
//             $("#current_madication").hide("slow");
//             $("#e_prescribe_link").html("Enable E-Prescribing");
//             $("#e_prescribe_link").attr("val", 0);
//           }
//           else {
            
//             $("#current_madication").addClass("pd");
//             $("#e_prescribe_link").html('E-Prescribe enabled <span class="glyphicon glyphicon-ok-circle" aria-hidden="true" style="color: green"></span>');
//             $("#e_prescribe_link").attr("val", 1);
//           }
//         }
//         else {
//           $("#current_madication").removeClass("pd");
//           $("#current_madication").hide("slow");
//         }
//       },
//       error: function(data, error, reason) {
//         newAlert('danger', reason);
//         $('html, body').animate({scrollTop: 0}, 'slow');
//       },
//       key: $("#pd_id").val()
//     });
//   }
//   $scope.saveEprescribe = function() {
//     $("#save_e_prescribe").attr("disabled","disabled");
//     var d  = new Date();
//     var eprescribe = {
//       update_ts:                   d,
//       doctype:                     "Eprescribe",
//       doctor_id:                   $("#pd_id").val(),
//       push_medications:            $("#push_medications").is(':checked'),
//       send_an_rx_directly:         $("#send_an_rx_directly").is(':checked'),
//       update_existing_medications: $("#update_existing_medications").is(':checked')
//     };

//     if ($("#save_e_prescribe").attr("index") && $("#save_e_prescribe").attr("rev")) {
//       eprescribe._rev = $("#save_e_prescribe").attr("rev");
//       eprescribe._id  = $("#save_e_prescribe").attr("index");
//     }

//     $.couch.db(db).saveDoc(eprescribe, {
//       success: function(data) {
//         newAlert('success', 'Saved successfully !');
//         $('html, body').animate({scrollTop: 0}, 'slow');
//         getEprescribe();
//         $("#save_e_prescribe").removeAttr("disabled");
//       },
//       error: function(data, error, reason) {
//         newAlert('danger', reason);
//         $('html, body').animate({scrollTop: 0}, 'slow');
//         $("#save_e_prescribe").removeAttr("disabled");
//       }
//     });
//   }
// });