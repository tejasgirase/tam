var d    = new Date();
var pd_data = {};
var ebill_pref;
// $.couch.urlPrefix = "http://192.168.0.66:5984";
$.couch.urlPrefix = "https://nirmalpatel59:nirmalpatel@nirmalpatel59.cloudant.com";
app.controller("dashboardController",function($scope,$state,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
  //       //backbefore();
  //       $('.pd').hide('slow');
  //       resetmenu();
  //       $("#practice_dashboard").addClass("active");
  //       $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
  //         success: function(data) {
  //           pd_data = data;
  //           $scope.level = data.level;
  //           $scope.dhp_code = data.dhp_code;
  //           displayConfigurableModules();
  //           $scope.$apply();
  //           tamsaFactories.sharedBindings();
  //           tamsaFactories.pdBack();
  //           tamsaFactories.displayDoctorInformation(data);
  //           dashboardEventBindings();
  //           getNotifications(data._id);
  //           getDueTasks();
  //           getTodaysAppointments();
  //           //getEprescribe();
  //           getEbilling();
  //           getTotalNumberOfPatients();
  //           getPendingRequestSummary();
  //           getReferCount();
  //         },
  //         error: function(status) {
  //             console.log(status);
  //         }
  //       });
  //     }
  //   }
  // });
  
  $('.pd').hide('slow');
  resetmenu();
  $("#practice_dashboard").addClass("active");
  // $.ajax({
  //   url:"/api/open",
  //   method:"GET",
  //   data:{"openDocID":"org.couchdb.user:n@n.com"},
  //   success:function(data) {
  //     console.log(data);
  //     pd_data = data;
  //     console.log("data called");
  //     return false;
  //     // $scope.level = data.level;
  //     // $scope.dhp_code = data.dhp_code;
  //     // displayConfigurableModules();
  //     // $scope.$apply();
  //     // tamsaFactories.sharedBindings();
  //     // tamsaFactories.pdBack();
  //     // tamsaFactories.displayDoctorInformation(data);
  //     // dashboardEventBindings();
  //     // getNotifications(data._id);
  //     // getDueTasks();
  //     // getTodaysAppointments();
  //     // //getEprescribe();
  //     // getEbilling();
  //     // getTotalNumberOfPatients();
  //     // getPendingRequestSummary();
  //     // getReferCount();
  //   },
  //   error:function() {

  //   }
  // });
  $.couch.db(replicated_db).openDoc("org.couchdb.user:n@n.com", {
    success: function(data) {
      pd_data = data;
      $scope.level = data.level;
      $scope.dhp_code = data.dhp_code;
      displayConfigurableModules();
      $scope.$apply();
      tamsaFactories.sharedBindings();
      tamsaFactories.pdBack();
      tamsaFactories.displayDoctorInformation(data);
      dashboardEventBindings();
      getNotifications(data._id);
      getDueTasks();
      getTodaysAppointments();
      getEprescribe();
      getEbilling();
      getTotalNumberOfPatients();
      getPendingRequestSummary();
      getReferCount();
    },
    error: function(status,error,reason) {
      console.log(status);
      console.log(error);
      console.log(reason);
    }
  });

  function displayConfigurableModules() {
    $.couch.db(db).view("tamsa/getMiscSetting", {
      success: function(data) {
        if(data.rows.length > 0) {
          if(data.rows[0].value.enable_front_disk) $scope.configurable_level = true;
          else $scope.configurable_level = false;
          $scope.$apply();
        }else {
          return true;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:[pd_data._id, pd_data.dhp_code],
      include_docs:true
    });
  }
});

function dashboardEventBindings(){
  $("#practice_dashboard").on("click",".referral_notification",function() {
    hideNotification($( this ).attr('r_id'));
  });
  if(pd_data.level == "Doctor"){
    $.couch.db(db).view("tamsa/getMiscSetting", {
      success: function(data) {
        if(data.rows.length > 0) {
          if(data.rows[0].value.enable_front_disk){
              $("#front_desk_parent").show();        
           }else{
              $("#front_desk_parent").hide();        
           } 
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
  }else{
    $("#front_desk_parent").show();
  }
}

function getTotalNumberOfPatients(){
  $.couch.db(db).view("tamsa/getDoctorSubscribersCount", {
    success: function(data) {
      if(data.rows.length > 0){
        $("#total_patients_in_practise").html(data.rows[0].value);
      }else{
        $("#total_patients_in_practise").html("0");
      }
    },
    error:function(data,error,reason){
      newAlert("danger", reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:    [pd_data._id,pd_data.dhp_code],
    reduce: true,
    group:  true
  });
  $.couch.db(db).view("tamsa/getDhpSubscribersCount", {
    success: function(data) {
      if(data.rows.length > 0){
        $("#total_patients_in_DHP").html(data.rows[0].value);
      }else{
        $("#total_patients_in_DHP").html("0");
      }
    },
    error:function(data,error,reason){
      newAlert("danger", reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:    pd_data.dhp_code,
    reduce: true,
    group:  true
  });
}

function getReferCount(){ 
 $.couch.db(db).view("tamsa/getReferDocuments", {
    success: function(data) {
      if(data.rows.length > 0){
        $("#referred_count").html(data.rows[0].value);
      }else{
        $("#referred_count").html("0");
      }
    },
    error:function(data,error,reason){
      newAlert("danger", reason);
      $('body, html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key : pd_data._id,
    reduce: true,
    group:true
  });
}

function getTodaysAppointments() {
  $("#today_date").html(moment().format("YYYY-MM-DD"));
  todays_app = 0;
  var appointments = '';
  $.couch.db(db).view("tamsa/getAppointmentNotification", {
    success: function(data) {
      for (var i = data.rows.length - 1; i >= 0; i--) {
      var s_date = moment(data.rows[i].value.reminder_start).format("YYYY-MM-DD");
        if (moment(s_date).isSame(moment().format("YYYY-MM-DD")) && (!data.rows[i].value.block_start)) {
          appointments += '<div class="mrgtop col-lg-6">'+data.rows[i].value.reminder_note+'</div>';
          todays_app = todays_app + 1;
        }
      };
      $("#appointments").html(appointments);
      $("#appointment_count").html(todays_app+" appointments today");
      $(".demo").mCustomScrollbar({
        theme:"minimal"
      });
    },
    error:function(data,error,reason){
      console.log(error);
      // newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data._id],
    endkey:   [pd_data._id, {}],
    reduce:   false,
    group:    false
  });
}

function getNotifications(key) {
  $.couch.db(db).view("tamsa/getDoctorReferral", {
    success: function(data) {
      var notifications = '';
      for (var i = 0; i < data.rows.length; i++) {
        if (data.rows[i].key[2] == key) {
          notifications =  '<div class="col-lg-12"><div class="doc_msg"><i class="glyphicon glyphicon-remove icn referral_notification" r_id="'+data.rows[i].id+'"></i><p>Dr '+data.rows[i].value.doctor+' has completed the Referral</p></div></div>';
        }
      }
      $("#notifications").html(notifications);
    },
    error: function(status, error, reason) {
      console.log(error);
    },
    startkey: ["Y"],
    endkey:   ["Y", {}, {}, {}],
    reduce:   false,
    group:    false
  });
}

function hideNotification(r_id) {
  $.couch.db(db).openDoc(r_id, {
    success: function(referral) {
      referral.read_receipt = "C";
      $.couch.db(db).saveDoc(referral, {
        success: function(data) {
          getNotifications(pd_data._id);
        },
        error: function(data, error, reason) {
          newAlert('error', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      })
    },
    error: function(status, error, reason) {
      console.log(error);
    }
  });
}

function getDueTasks() {
  $.couch.db(db).view("tamsa/getDueTasksCount", {
    success: function(data) {
      if(data.rows.length > 0){
        var total_due_task = 0;
        var due_tasks = '';
        for (var i = 0; i < data.rows.length; i++) {
          if(i%2 != 0){
            due_tasks += '<span style="float:right;">' + data.rows[i].value + '&nbsp;&nbsp;'+data.rows[i].key[2]+'</span>';
            if(i != data.rows.length -1){
              due_tasks += '<br>';
            }
          }else{
            due_tasks += '<span>' + data.rows[i].value + '&nbsp;&nbsp;'+data.rows[i].key[2]+'</span>';  
          }
          total_due_task = total_due_task + Number(data.rows[i].value);
        };
        $("#total_due_task").html(total_due_task+'&nbsp;&nbsp;task due');
        $("#due_tasks").html(due_tasks);

      }else{
        $("#due_tasks").html("No Task Due");
      }
    },
    error: function(status, error, reason) {
      console.log(error);
    },
    startkey: [pd_data._id, "Review"],
    endkey:   [pd_data._id, "Review", {}, {}],
    reduce:   true,
    group:    true
  });
}

function getCvg() {
 $.couch.db(db).view("tamsa/getCvg", {
    success: function(data) {
      if (data.rows.length > 0) {
        $("#cvg_save").data("index",data.rows[0].id);
        $("#cvg_save").data("rev", data.rows[0].value._rev);
        $("#cvg_blood_pressure").prop("checked",data.rows[0].value.cvg_blood_pressure);
        $("#cvg_weight").prop("checked",data.rows[0].value.cvg_weight);
        $("#cvg_heart_rate").prop("checked",data.rows[0].value.cvg_heart_rate);
        $("#cvg_o2").prop("checked",data.rows[0].value.cvg_o2);
        $("#cvg_respiration_rate").prop("checked",data.rows[0].value.cvg_respiration_rate);
        $("#cvg_fasting_glucose").prop("checked",data.rows[0].value.cvg_fasting_glucose);
      }
      getAnalyticsRange();
    },
    error: function(status, error, reason) {
      console.log(error);
    },
    key: pd_data._id
  });
}

function getEbilling() {
  $.couch.db(db).view("tamsa/getEbilling", {
   success: function(data) {
     if(data.rows.length > 0) {
        // $("#enable_billing").attr("checked", data.rows[0].value.enable_billing);
        // $("#save_e_billing").attr("index", data.rows[0].value._id);
        // $("#save_e_billing").attr("rev", data.rows[0].value._rev);
        
        if(!data.rows[0].value.enable_billing) {
          $("#patient_billing").removeClass("pd");
          $("#patient_billing").hide("slow");
          $("#enable_billing_link").html("Enable Billing");
          $("#enable_billing_link").attr("val", 0);
          ebill_pref = false;
        }else {  
          $("#patient_billing").addClass("pd");
          $("#enable_billing_link").html('Billing enabled <span class="glyphicon glyphicon-ok-circle" aria-hidden="true" style="color: green"></span>');
          $("#enable_billing_link").attr("val", 1);
          ebill_pref = true;
        }
     }else {
      $("#patient_billing").removeClass("pd");
      $("#patient_billing").hide("slow");
     }
   },
   error: function(status, error, reason) {
     console.log(error);
   },
   key: pd_data.dhp_code
  });
}

function getEprescribe() {
  $.couch.db(db).view("tamsa/getEprescribe", {
    success: function(data) {
      if(data.rows.length > 0) {
        if(!data.rows[0].value.push_medications && !data.rows[0].value.send_an_rx_directly && !data.rows[0].value.update_existing_medications) {
          $("#current_madication").removeClass("pd");
          $("#current_madication").hide("slow");
          $("#e_prescribe_link").html("Enable E-Prescribing");
          $("#e_prescribe_link").attr("val", 0);
        }
        else {
          $("#current_madication").addClass("pd");
          $("#e_prescribe_link").html('E-Prescribe enabled <span class="glyphicon glyphicon-ok-circle" aria-hidden="true" style="color: green"></span>');
          $("#e_prescribe_link").attr("val", 1);
        }
      }
      else {
        $("#current_madication").removeClass("pd");
        $("#current_madication").hide("slow");
      }
    },
    error: function(data, error, reason) {
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    key: pd_data._id
  });
}

function getPendingRequestSummary() {
  $.couch.db(db).view("tamsa/getTaskManagerSettings",{
    success:function(tmdata){
      var no_of_days;
      if(tmdata.rows.length > 0) no_of_days = tmdata.rows[0].doc.request_autoremove_duration;
      else no_of_days = 7;
      // TODO :: uncomment after node-cloudant library completed
      $.couch.db(db).list("tamsa/getLatestRequestList", "getRequestList", {
      startkey:[pd_data._id],
      endkey:[pd_data._id,{},{}],
      include_docs: true,
      autoremove_days:no_of_days
      }).success(function(data){
        var sub_request_count = 0;
        var app_request_count = 0;
        for(var i=0;i<data.rows.length;i++){
          if(data.rows[i].key[2] == "appointment_request"){
            app_request_count++;
          }else{
            sub_request_count++;
          }
        }
        $("#pending_request").html(sub_request_count + "&nbsp;&nbsp;Subscription Requests <br>" + app_request_count + "&nbsp;&nbsp;Appointment Req");

        if(data.rows.length > 0){
          $("#total_pending_request").html((sub_request_count+app_request_count)+"&nbsp;&nbsp;Requests are Pending")
        }else{
          $("#total_pending_request").html("No Request are Pending");
        }
      });
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });
}

function resetmenu(){
  $('#signmenu').parent().css({'width':'552px','padding':'0','float':'right'});
  $('#signmenu li').css({'width':'auto','padding':'5px'});
  $('#Logout').parent().css('width','auto');
  $('#help').parent().css('width','auto');
}
