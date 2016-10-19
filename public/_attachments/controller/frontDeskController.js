var d    = new Date();
var pd_data = {};
app.controller("frontDeskController",function($scope,$state,$compile,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.pdBack();
            displayFrontDesk();
            frontDeskEventBindings();
            tamsaFactories.sharedBindings();
            tamsaFactories.displayDoctorInformation(data);
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });

  function displayFrontDesk(){
    $('#front-desk').show();
    $(".tab-pane").removeClass("active");
    $("#front-desk").addClass("active");
    searchDHPDoctorsList("fd_appointment_physician_list",autocompleterSelectForDoctorsList,pd_data.dhp_code);
    searchDHPPatientByNameAutocompleter("fd_appointment_patient_list",autocompleterSelectEventForSubscriberListOnFrontDeskAppointment,false,pd_data.dhp_code);
    setTimeIntervalForNewAppointmentAtFrontDesk();
    getServicesAndMicsDocuments("","","fd_hospital_document_list","fd_service_list");
    getDHPConsultatntList("fd_consultant_list");
    // searchDHPConsultantsList("",autocompleterSelectForDoctorsList);
    tamsaFactories.selectLocationForAppointment("fd_locations",pd_data.city);
    getTodaysScheduleForFrontDesk($("#fd_scheduled_patients_label"),"scheduled",pd_data.city);
    getCurrentTaskForFrontDesk("noselect","noselect");
    getCurrentTaskPatientListForFrontDesk();
  }

  function setTimeIntervalForNewAppointmentAtFrontDesk(){
    $.couch.db(db).view("tamsa/getCommunicationSettings",{
      success:function(data){
        if(data.rows.length > 0){
          var duration = data.rows[0].doc.calender_setting.exam_increment;
          var duration_total=Number(duration);
          $("#fd_start_time_minute, #fd_end_time_minute").html("<option>00</option>");
          while(duration_total<60){
            $("#fd_start_time_minute, #fd_end_time_minute").append("<option>"+duration_total+"</option>");
            duration_total = Number(duration_total)+Number(duration);
          }
         //if(!exist_flag) saveAppointmentFromFrontDesk();
        }else{
          $("#fd_start_time_minute, #fd_end_time_minute").html("<option>00</option><option>30</option>");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop : 0}, 'slow');
        return false;
      },
      key:pd_data.dhp_code,
      include_docs:true
    });
  }

  function setDateForNewAppointment(starttime,endtime){
    var a = moment();
    a.set('year', $("#fd_appointment_date").datepicker('getDate').getFullYear());
    a.set('month', $("#fd_appointment_date").datepicker('getDate').getMonth());
    a.set('date', $("#fd_appointment_date").datepicker('getDate').getDate());
    a.set('hour', Number(starttime));
    a.set('minute', Number(endtime));
    a.set('second', 00);
    a.set('millisecond', 000);
    // var remend = revent.end ? revent.end.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ") : revent.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    // var remstart = revent.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    var remstart = a.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    remstart = [remstart.slice(0, 25), "GMT", remstart.slice(25)].join(''); 
    return remstart;
  }

  function createAppointmentFromFrontDesk(){
    if(validateAppointmentFromFrontDesk()){
      $.couch.db(db).view("tamsa/getBlockedTimeAndAppointmentByDate",{
        success:function(data){
          if(data.rows.length > 0){
            var new_start_time = moment($("#fd_appointment_date").val());
            var new_end_time   = moment($("#fd_appointment_date").val());
            
            new_start_time.set('hour', Number($("#fd_start_time_hour").val()));
            new_start_time.set('minute', Number($("#fd_start_time_minute").val()));
            new_end_time.set('hour', Number($("#fd_end_time_hour").val()));
            new_end_time.set('minute', Number($("#fd_end_time_minute").val()));
            var exist_flag = false;
            for(var i=0;i<data.rows.length;i++){
              if(data.rows[i].doc.block_start){
                var start_time = moment(data.rows[i].doc.block_start);
                var end_time   = moment(data.rows[i].doc.block_end);
              }else{
                var start_time = moment(data.rows[i].doc.reminder_start);
                var end_time   = moment(data.rows[i].doc.reminder_end);
              }
              if(new_start_time >= start_time && new_start_time < end_time ){
                newAlert("danger","Appointment is not available for given date and time. Please choose different Date and/or Time.");
                $("html, body").animate({scrollTop: 0}, "slow");
                exist_flag = true;
                return false;
              }else if(new_end_time > start_time && new_end_time < end_time){
                newAlert("danger","Appointment is not available for given date and time. Please choose different Date and/or Time.");
                $("html, body").animate({scrollTop: 0}, "slow");
                exist_flag = true;
                return false;
              }else if(new_start_time < start_time && new_end_time > end_time){
                newAlert("danger","Appointment is not available for given date and time. Please choose different Date and/or Time.");
                $("html, body").animate({scrollTop: 0}, "slow");
                exist_flag = true;
                return false;
              }else{
                if(i== data.rows.length - 1) exist_flag = false;
              }
            }
            if(!exist_flag) saveRequestCheckBeforeAppointmentSaveFrontDesk(tamsaFactories.saveSinglePatientFromNewAppointmentFrontDesk, saveAppointmentRequestFromFrontDesk)
          }else{
            saveRequestCheckBeforeAppointmentSaveFrontDesk(tamsaFactories.saveSinglePatientFromNewAppointmentFrontDesk, saveAppointmentRequestFromFrontDesk);
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        },
        startkey:[$("#fd_appointment_physician_list").data("doctor_id"),moment($("#fd_appointment_date").val()).format("YYYY-MM-DD")],
        endkey:[$("#fd_appointment_physician_list").data("doctor_id"),moment($("#fd_appointment_date").val()).format("YYYY-MM-DD"),{}],
        include_docs:true
      });  
    }else{
      return false;
    }
  }

  function uploadFilesRequestFromFrontDesk() {
    if(validateFieldsForFrontDeskForm()) {
      saveRequestCheckBeforeAppointmentSaveFrontDesk(tamsaFactories.saveSinglePatientFromNewAppointmentFrontDesk, uploadFilesFromFrontDesk);
    }
  }

  function saveRequestCheckBeforeAppointmentSaveFrontDesk(saveUserandDoAction,doAction) {
    if($("#fd_new_patient").prop("checked")) {
      if($("#fd_appointment_patient_email").val() == "emailnotprovided@digitalhealthpulse.com"){
        $.couch.db(personal_details_db).view("tamsa/getPatientPhoneNumber",{
          success: function(data){
            if(data.rows.length > 0) {
              newAlert('danger', 'Patient with given phone number already exist.');
              $('html, body').animate({scrollTop: 0}, 'slow');              
            }else {
              saveUserandDoAction(doAction);
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key : [$("#fd_appointment_patient_phone").val(),$("#fd_appointment_patient_first_name").val()]
        })
      }else{
        $.couch.db(personal_details_db).view("tamsa/getPatientEmail",{
          success: function(data){
            if(data.rows.length > 0) {
              newAlert('danger', 'Email ID is already in use.');
              $('html, body').animate({scrollTop: 0}, 'slow');
            }else {
              $.couch.db(replicated_db).view("tamsa/getUserInfo",{
                success: function(data2){
                  if (data2.rows.length > 0) {
                    newAlert('danger', 'Email ID is already in use.');
                    $('html, body').animate({scrollTop: 0}, 'slow');
                  }
                  else {
                    saveUserandDoAction(doAction);
                  }
                },
                error: function(data){
                },
                key : $("#fd_appointment_patient_email").val()
              });  
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key : $("#fd_appointment_patient_email").val()
        });
      }
    }else {
      doAction($("#fd_appointment_patient_list").data("user_id"));
    }
  }

  // function saveSinglePatientFromNewAppointmentFrontDesk(doAction){
  //   var patient_dhp_id = "SHS-"+getInvitationcode();
  //   var user_id = $.couch.newUUID();

  //   var isu_pi_data = {
  //     MaritalStatus:  "",
  //     address1:       "",
  //     address2:       "",
  //     bloodgroup:     "",
  //     city:           pd_data.city,
  //     country:        pd_data.country,
  //     doctype:        "UserInfo",
  //     ename:          "",
  //     ephone:         "",
  //     erelation:      "",
  //     first_nm:       $("#fd_appointment_patient_first_name").val(),
  //     last_nm:        $("#fd_appointment_patient_last_name").val(),
  //     gender:         "",
  //     initial:        false,
  //     update_ts:      d,
  //     patient_dhp_id: patient_dhp_id,
  //     phone:          $("#fd_appointment_patient_phone").val(),
  //     user_email:     $("#fd_appointment_patient_email").val(),
  //     pincode:        pd_data.pincode ? pd_data.pincode : "",
  //     state:          pd_data.state,
  //     user_id:        user_id,
  //     added_by:       "Front_Desk",
  //     adder_id:       pd_data._id,
  //     partial:        true
  //   };
    
  //   var isu_contactdata = {
  //     _id:            user_id,
  //     doctype:        "UserInfo",
  //     user_id:        user_id,
  //     patient_dhp_id: patient_dhp_id,
  //     user_email:     $("#fd_appointment_patient_email").val(),
  //     update_ts:      d,
  //     insert_ts:      d,
  //     height:         "",
  //     waist:          "",
  //     weight:         "",
  //     Procedure:      "",
  //     Medication:     "",
  //     Condition:      "",
  //     Allergies:      "",
  //     initial:        "",
  //     Diastolic_bp:   "",
  //     Pulse:          "",
  //     Systolic_bp:    "",
  //     alcohol:        "",
  //     hdl:            "",
  //     ldl:            "",
  //     mobile_id:      "",
  //     smoking:        "",
  //     tgl:            "",
  //     added_by:       "Front_Desk",
  //     adder_id:       pd_data._id,
  //     partial:        true
  //   };
    
  //   var isu_subscriber_doc = {
  //     Designation:     "",
  //     Name:            $("#fd_appointment_physician_list").val(),
  //     Email:           $("#fd_appointment_physician_list").data("doctor_email"),
  //     doctor_id:       $("#fd_appointment_physician_list").data("doctor_id"),
  //     Phone:           $("#fd_appointment_physician_list").data("doctor_phone"),
  //     Relation:        "Doctor",
  //     "Select Report": "All conditions",
  //     doctype:         "Subscriber",
  //     insert_ts:       d,
  //     user_id:         user_id,
  //     User_firstname:  $("#fd_appointment_patient_first_name").val(),
  //     User_lastname:   $("#fd_appointment_patient_last_name").val(),
  //     patient_dhp_id:  patient_dhp_id,
  //     dhp_code:        pd_data.dhp_code,
  //     added_by:        "Front_Desk",
  //     frequency:       "",
  //     payment_status:  "unpaid",
  //     adder_id:        pd_data._id,
  //     report_freq:     "",
  //     alerts:          "",
  //     added_by:        "Front_Desk",
  //     adder_id:        pd_data._id,
  //     partial:         true
  //   };

  //   var isu_cron_record_doc = {
  //     doctype:        'cronRecords',
  //     operation_case: '6',
  //     processed:      'No',
  //     first_nm:       $("#fd_appointment_patient_first_name").val(),
  //     last_nm:        $("#fd_appointment_patient_last_name").val(),
  //     user_email:     $("#fd_appointment_patient_email").val(),
  //     phone:          $("#fd_appointment_patient_phone").val(),
  //     address1:       "",
  //     address2:       "",
  //     ename:          "",
  //     ephone:         "",
  //     user_id:        user_id,
  //     gender:         "",
  //     country:        pd_data.country,
  //     state:          pd_data.state,
  //     city:           pd_data.city,
  //     pincode:        pd_data.pincode ? pd_data.pincode : "",
  //     status:         "",
  //     erelation:      "",
  //     height:         "",
  //     weight:         "",
  //     waist:          "",
  //     bloodgroup:     "",
  //     Procedure:      "",
  //     Medication:     "",
  //     Condition:      "",
  //     Allergies:      "",
  //     patient_dhp_id: patient_dhp_id,
  //     update_ts:      d,
  //     insert_ts:      d,
  //     added_by:       "Front_Desk",
  //     adder_id:       pd_data._id,
  //     partial:        true
  //   }
  //   var bulk_data = [];
  //   bulk_data.push(isu_contactdata);
  //   bulk_data.push(isu_subscriber_doc);
  //   bulk_data.push(isu_cron_record_doc);
  //   $.couch.db(personal_details_db).saveDoc(isu_pi_data,{
  //     success:function(data){
  //       $.couch.db(db).bulkSave({"docs":bulk_data},{
  //         success:function(data){
  //           // doAction(user_id);
  //         },
  //         error:function(data,error,reason){
  //           newAlert("danger",reason);
  //           $("html, body").animate({scrollTop: 0}, 'slow');
  //           return false;
  //         }
  //       });
  //     },
  //     error:function(data,error,reason){
  //       newAlert("danger",reason);
  //       $("html, body").animate({scrollTop: 0}, 'slow');
  //       return false;
  //     }
  //   });
  // }

  function saveAppointmentRequestFromFrontDesk(user_id){
    var d = new Date();
    var doc = {
      insert_ts:           d,
      doctype:             "Appointments",
      reminder_note:       $("#fd_reminder_note").val(),
      reminder_type:       "Alerts",
      reminder_start:      setDateForNewAppointment($("#fd_start_time_hour").val(),$("#fd_start_time_minute").val()),
      reminder_end:        setDateForNewAppointment($("#fd_end_time_hour").val(),$("#fd_end_time_minute").val()),
      notification_type:   "Appointment",
      status:              "scheduled",
      read_receipt:        "N",
      doctor_id:           $("#fd_appointment_physician_list").data("doctor_id"),
      dhp_code:            pd_data.dhp_code,
      color_code:          $("#fd_color_code_value:first-child").css("background-color"),
      color_preference:    $("#fd_color_code_value:first-child").text(),
      tentative:           $("#is_fd_appointment_tentative").prop("checked"),
      master_recurring_id: "",
      hospital_document:   $('#fd_hospital_document_list').val(),
      service_name:        $('#fd_service_list :selected').text(),
      service_documents:   $('#fd_service_list').val().split(","),
      user_id:             user_id ? user_id : $("#fd_appointment_patient_list").data("user_id")
    };
    if($("#fd_consultant_list").val() == "noselect"){
      if(doc.consultant_id) delete doc.consultant_id
    }else{
      doc.consultant_id = $("#fd_consultant_list").val()
    }
    $.couch.db(db).saveDoc(doc,{
      success:function(data){
        getTodaysScheduleForFrontDesk($("#fd_scheduled_patients_label"),"scheduled",$("#fd_locations").val());
        newAlert("success","Appointment Successfully created.");
        $("html, body").animate({scrollTop: 0},false);
        clearFrontDeskAppointment();
        return false;
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop : 0}, "slow");
        return false;
      }
    });
  }

  function uploadFilesFromFrontDesk (user_id) {
    if($("#fd_new_patient").prop("checked")) {
      var patient_name = $("#fd_appointment_patient_first_name").val() + " " + $("#fd_appointment_patient_last_name").val();
    }else {
      var patient_name = $("#fd_appointment_patient_list").val();      
    }
    showUploadFilesModal(user_id,patient_name);
  }

  function clearFrontDeskAppointment(){
    $("#fd_appointment_physician_list, #fd_appointment_patient_list, #fd_appointment_patient_email, #fd_appointment_patient_phone, #fd_appointment_date, #fd_reminder_note").val("");
    $("#fd_appointment_patient_list").show();
    $("#fd_appointment_patient_first_name, #fd_appointment_patient_last_name").hide().val("");
    $("#fd_consultant_list").val("noselect");
    $("#fd_hospital_document_list").val("Select Hospital Documents");
    $("#fd_service_list").val("Select Services");
    $("#fd_start_time_hour, #fd_start_time_minute, #fd_end_time_hour, #fd_end_time_minute").val("00");
    $("#selected_patient_fd_profile").hide();
    $("#default_patient_fd_profile").show();
    $("#fd_appointment_patient_phone, #fd_appointment_patient_email").removeAttr("readonly");
  }

  function getTodaysScheduleForFrontDesk($obj,status,city){
    toggleScheduleLabelsOnFrontDesk($obj);
    updateCountForTodayScheduleOnFrontDesk(city);
    $("#fd_today_schedule_table tbody").html("");
    if(status == "scheduled"){
    var startkey = [pd_data.dhp_code,city,moment().format("YYYY-MM-DD")];
    var endkey = [pd_data.dhp_code,city,moment().format("YYYY-MM-DD"),{}];
    }else{
    var startkey = [pd_data.dhp_code,city,moment().format("YYYY-MM-DD")];
    var endkey = [pd_data.dhp_code,city,moment().format("YYYY-MM-DD"),status];
    }
    $.couch.db(db).view("tamsa/getDHPAppointmentByDate",{
      success:function(data){
        if(data.rows.length > 0){
          if(status == "scheduled"){
            paginationConfiguration(data,"today_schedule_front_desk_pagination",5,displayFrontDeskTodaySchedule);
          }else{
            paginationConfiguration(data,"today_schedule_front_desk_pagination",5,displayFrontDeskTodayCheckedIn);
          }
        }else{
          $("#fd_today_schedule_table tbody").html("<tr><td colspan='7'>No Appointment schedule for today.</td></tr>");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:[pd_data.dhp_code,moment().format("YYYY-MM-DD"),city,status],
      include_docs:true
    });
  }

  function displayFrontDeskTodaySchedule(start,end,data){
    $("#fd_today_schedule_table tbody").html("");
    for(var i=start;i<end;i++){
      if(data.rows[i].doc.status != "checked_in"){
        getDetailsForFrontDeskTodaySchedule(data.rows[i].doc);
      }
    } 
  }

  function displayFrontDeskTodayCheckedIn(start,end,data){
    $("#fd_today_schedule_table tbody").html("");
    for(var i=start;i<end;i++){
      if(data.rows[i].doc.status == "checked_in"){
        getDetailsForFrontDeskTodaySchedule(data.rows[i].doc);
      }
    } 
  }

  function getDetailsForFrontDeskTodaySchedule(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          $.couch.db(db).view("tamsa/getPatientConditionBySeverity", {
            success: function(condata) {
              var schedule_data= [];
              schedule_data.push('<tr data-user_id="'+data.user_id+'" data-index="'+data._id+'">');
              schedule_data.push('<td><span class="pointer get-patient-details-fd hovercolor" data-user_id="'+pdata.rows[0].doc.user_id+'">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</span></td>');
              schedule_data.push('<td>'+data.color_preference+'</td>');
              if ($("#fd_scheduled_patients_label").hasClass("dd-list-hover")) {
                  if(data.status == "no_show"){
                    schedule_data.push('<td><select class="fd_appointment_status form-control"><option>Select</option><option>Check-in</option><option selected="selected">No-Show</option><option>Cancelled</option></select></td>');
                    schedule_data.push('<td>NA</td>');
                  }else if(data.status == "cancelled"){
                    schedule_data.push('<td><select class="fd_appointment_status form-control" disabled="disabled"><option>Select</option><option>Check-in</option><option>No-Show</option><option selected="selected">Cancelled</option></select></td>');
                    schedule_data.push('<td>NA</td>');  
                  }else{
                    schedule_data.push('<td><select class="fd_appointment_status form-control"><option>Select</option><option>Check-in</option><option>No-Show</option><option>Cancelled</option></select></td>');  
                    schedule_data.push('<td>NA</td>');
                  }
              }else if ($("#fd_checkedin_patients_label").hasClass("dd-list-hover")) {
                schedule_data.push('<td>');
                if(data.checked_in_status){
                  if(data.checked_in_status == "In exam room") schedule_data.push('<select title="In exam room" class="fd_checked_in_status form-control"><option>Select</option><option selected="selected">In exam room</option><option>Waiting for doctor</option>');
                  else if(data.checked_in_status == "Waiting for doctor") schedule_data.push('<select title="Waiting for doctor" class="fd_checked_in_status form-control"><option>Select</option><option>In exam room</option><option selected="selected">Waiting for doctor</option>');
                  else schedule_data.push('<select class="fd_checked_in_status form-control" title="select option"><option selected="selected">Select</option><option>In exam room</option><option>Waiting for doctor</option>');
                }else{
                  schedule_data.push('<select class="fd_checked_in_status form-control" title="select option"><option selected="selected">Select</option><option>In exam room</option><option>Waiting for doctor</option>');
                }
                schedule_data.push('</select></td>');
                schedule_data.push('<td>'+data.checked_in_time+'</td>');
              }else{
                schedule_data.push('<td><select class="fd_appointment_status form-control"><option>Select</option><option>Check-in</option><option>No-Show</option><option>Cancelled</option></select></td>');
              }
              var temp_random = getPcode(5,"numeric");
              if (condata.rows.length > 0) {
                schedule_data.push('<td><input type="checkbox" class="cmn-toggle cmn-toggle-round fd_condition_flag" id="fd_condition_flag_'+temp_random+'" checked="checked"><label for="fd_condition_flag_'+temp_random+'"></label></td>');
              } else {
                schedule_data.push('<td><input type="checkbox" class="cmn-toggle cmn-toggle-round fd_condition_flag" id="fd_condition_flag_'+temp_random+'"><label for="fd_condition_flag_'+temp_random+'"></label></td>');
              }
              schedule_data.push('<td>');
              console.log(data.tag);
              if(data.tag && data.tag.length > 0) {
                schedule_data.push('<span class="fd_current_patient_tags">'+data.tag+'</span>');
              }else {
                schedule_data.push('<span class="fd_current_patient_tags">NA</span>');
              }
              schedule_data.push('<br><br><span class="label label-warning pointer fd_edit_patient_tags">Edit</span></td>');
              schedule_data.push('<td><span class="glyphicon glyphicon-th-list fd_appointment_notes"></span></td>');
              schedule_data.push('</tr>');
              $("#fd_today_schedule_table tbody").append(schedule_data.join(''));
            },
            error: function(data, error, reason) {
              newAlert('danger', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            },
            key: ["High", data.user_id, "From Doctor Note", pd_data._id],
            reduce: true,
            group: true
          });
        }
      },
      error:function(udata,error,reason){
        console.log(data);
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;      
      },
      key:          data.user_id,
      include_docs: true
    });
  }


  function editPatientTagsForFrontDesk($obj) {
    createModal("fd_edit_patient_tags_modal");
    $("#fd_update_patient_tags").data("index",$obj.closest("tr").data("index"));
    $("#fd_update_patient_tags").data("user_id",$obj.closest("tr").data("user_id"));
    $("#fd_update_patient_tags").data("$objEle",$obj);
    $.couch.db(db).view("tamsa/getPatientCategoryTags",{
      success:function(tdata) {
        if(tdata.rows.length > 0 && tdata.rows[0].value.tag_list.length > 0){
          $('#fd_appointment_tag_status').tokenfield({
            autocomplete: {
              source: tdata.rows[0].value.tag_list,
              delay: 100
            },
            showAutocompleteOnFocus: true,
            beautify:false
          });  
          if($obj.closest("td").find(".fd_current_patient_tags").html() !== "NA") {
            var arr = $obj.closest("td").find(".fd_current_patient_tags").html();
            $('#fd_appointment_tag_status').tokenfield("setTokens",arr);
          }else {
            $('#fd_appointment_tag_status').tokenfield("setTokens",[]);
          }
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0},'slow');
        return false;
      },
      key:pd_data.dhp_code
    });
  }

  function updatePatientTagsForFrontDesk() {
    $("#fd_edit_patient_tags_modal").modal("hide");
    if($("#fd_update_patient_tags").data("index")) {
      $.couch.db(db).openDoc($("#fd_update_patient_tags").data("index"),{
        success:function(data) {
          if($('#fd_appointment_tag_status').tokenfield("getTokens").length > 0) {
            var arr = $('#fd_appointment_tag_status').tokenfield("getTokensList").split(",");
            data.tag = arr;
          }else {
            data.tag = [];
          }
          $.couch.db(db).saveDoc(data,{
            success: function(data) {
              $.couch.db(db).view("tamsa/testPatientsInfo", {
                success:function(mdata) {
                  if(mdata.rows.length > 0) {
                    mdata.rows[0].doc.patient_tags = arr;
                    $.couch.db(db).saveDoc(mdata.rows[0].doc, {
                      success:function(sdata){
                        var $ele = $("#fd_update_patient_tags").data("$objEle");
                        if($('#fd_appointment_tag_status').tokenfield("getTokens").length > 0) {
                          $ele.closest("td").find(".fd_current_patient_tags").text($('#fd_appointment_tag_status').tokenfield("getTokensList").split(","));
                        }else {
                          $ele.closest("td").find(".fd_current_patient_tags").text("NA");
                        }
                      },
                      error:function(data,error,reason){
                        newAlert("danger",reason);
                        $("html, body").animate({scrollTop: 0}, 'slow');
                        return false;
                      }
                    });
                  }else {
                    console.log("No user medical Information Found.");
                  }
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                },
                key:$("#fd_update_patient_tags").data("user_id"),
                include_docs:true
              });
              console.log("successfully updated.");
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
    }else {
      console.log("something wrong. No appointment ID.");
    }
  }

  function getCurrentTaskPatientListForFrontDesk(){
    $.couch.db(db).view("tamsa/getDoctorTaskForCurrentDate", {
      success: function(data) {
        if(data.rows.length > 0){
          $("#fd_select_patient_task option").remove();
          $("#fd_select_patient_task").html("<option value='noselect'>Select Patient</option>")
          var tempusers = [];
          for(var i=0;i<data.rows.length;i++){
            if(tempusers.indexOf(data.rows[i].doc.user_id) < 0){
              getPatientInformationForFDCurrentTask(data.rows[i]);
              tempusers.push(data.rows[i].doc.user_id);
            }
          }
        }
      },
      error: function(data, error, reason){
        newAlert('danger',reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [pd_data._id],
      endkey:   [pd_data._id,{},{},{}],
      reduce:   false,
      group:    false,
      include_docs:true
    });
  }

  function getPatientInformationForFDCurrentTask(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          $("#fd_select_patient_task").append('<option value="'+pdata.rows[0].doc.user_id+'">'+pdata.rows[0].doc.first_nm+"<br>"+pdata.rows[0].doc.last_nm+'</option>');
        }else{
          newAlert("danger","No Patient Found.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        console.log("in 1");
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;      
      },
      key:          data.doc.user_id,
      include_docs: true
    });
  }

  function getCurrentTaskForFrontDesk(task_type,user_id){
    var tempstart,tempend;
    if(task_type == "noselect" && user_id == "noselect"){
      tempstart = [pd_data._id];
      tempend   = [pd_data._id,{},{},{}];
    }else if(task_type != "noselect" && user_id == "noselect"){
      tempstart = [pd_data._id,task_type];
      tempend   = [pd_data._id,task_type,{},{}];
    }else if(task_type == "noselect" && user_id != "noselect"){
      tempstart = [1,pd_data._id,user_id];
      tempend   = [1,pd_data._id,user_id,{},{}];
    }else {
      tempstart = [2,pd_data._id,task_type,user_id];
      tempend   = [2,pd_data._id,task_type,user_id,{},{}];
    }
    $.couch.db(db).view("tamsa/getDoctorTaskForCurrentDate", {
      success: function(data) {
        if(data.rows.length > 0){
          $("#fd_no_of_current_task").html(data.rows.length);
          paginationConfiguration(data,"current_task_front_desk_pagination",5,displayFrontDeskCurrentTaskList);
          
        }else{
          $("#fd_current_task_table tbody").html('<tr><td colspan="6">No task is Due.</td></tr>');
        }
      },
      error: function(data, error, reason){
        newAlert('danger',reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: tempstart,
      endkey:   tempend,
      reduce:   false,
      group:    false,
      include_docs:true
    });
  }

  function displayFrontDeskCurrentTaskList(start,end,data){
    $("#fd_current_task_table tbody").html('');
    for(var i=start;i<end;i++){
      getUserDetailsForFDCurrentTask(data.rows[i]);
    }
  }

  function getUserDetailsForFDCurrentTask(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          var current_task_Data= [];
          current_task_Data.push('<tr>');
          current_task_Data.push('<td><span class="glyphicon glyphicon-dashboard"></span></td>');
          current_task_Data.push('<td><a target="_blank" class="anchor-color hovercolor pointer view_task" ui-sref="daily_dashboard_task_manager({user_id:\''+data.doc.user_id+'\', attachment_id:\''+data.doc.document_id+'\', action:\''+data.doc.task+'\'})">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</a></td>');
          current_task_Data.push('<td>'+data.doc.task+'</td>');
          current_task_Data.push('<td>NA</td>');
          current_task_Data.push('<td>NA</td>');
          if(data.key[0] == 1){
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="frontDesk" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[3]+'" index="'+data.doc._id+'">');
            if(data.key[3] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>')
            if(data.key[3] == "Completed") current_task_Data.push('<option>Under Review</option><option selected="selected">Completed</option><option>Reassign</option>')
            if(data.key[3] == "Reassign") current_task_Data.push('<option>Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }else if(data.key[0] == 2){
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="frontDesk" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[4]+'" index="'+data.doc._id+'">');
            if(data.key[4] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>')
            if(data.key[4] == "Completed") current_task_Data.push('<option>Under Review</option><option selected="selected">Completed</option><option>Reassign</option>')
            if(data.key[4] == "Reassign") current_task_Data.push('<option>Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }else{
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="frontDesk" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[2]+'" index="'+data.doc._id+'">');
            if(data.key[2] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>')
            if(data.key[2] == "Completed") current_task_Data.push('<option>Under Review</option><option selected="selected">Completed</option><option>Reassign</option>')
            if(data.key[2] == "Reassign") current_task_Data.push('<option>Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }
          current_task_Data.push('</select>');

          if(data.key[0] == 1){
            if(data.key[3] == "Reassign") current_task_Data.push('<br><strong>To:</strong>'+data.doc.reassign_doctor[data.key[4]].name)
          }else if(data.key[0] == 2){
            if(data.key[4] == "Reassign") current_task_Data.push('<br><strong>To:</strong>'+data.doc.reassign_doctor[data.key[5]].name)
          }else{
            if(data.key[2] == "Reassign") current_task_Data.push('<br><strong>To:</strong>'+data.doc.reassign_doctor[data.key[3]].name) 
          }
          
          
          current_task_Data.push('</tr>');
          $("#fd_current_task_table tbody").append(current_task_Data.join(''));
          $compile($(".view_task"))($scope);
        }else{
          console.log(data.doc.user_id);
          newAlert("danger","No Patient Found.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;      
      },
      key:          data.doc.user_id,
      include_docs: true
    });
  }

  function toggleMoreOptionOnFrontDeskAppointment(){
    if($("#moreoption").html() == "Less Options"){
      $("#is_fd_appointment_tentative_parent, #fd_color_code_value_parent").hide("fast");
      $("#moreoption").html("More Options");
    }else{
      $("#is_fd_appointment_tentative_parent, #fd_color_code_value_parent").show("fast");
      $("#moreoption").html("Less Options");
    }
  }

  function fdPickAColorPreference($obj){
    $("#fd_color_code_value:first-child").text($obj.text());
    $("#fd_color_code_value:first-child").val($obj.text());
    $("#fd_color_code_value:first-child").css("background-color",$obj.attr("backcolor"));
  }

  function emailNotProvidToggle($obj){
    if($obj.html() == "not Having EmailId."){
      $obj.html("Having Emailid.");
      $("#fd_appointment_patient_email").val("emailnotprovided@digitalhealthpulse.com").attr("readonly","readonly");
    }else{
      $obj.html("not Having EmailId.");
      $("#fd_appointment_patient_email").val("").removeAttr("readonly");
    }
  }

  function toggleScheduleLabelsOnFrontDesk($obj){
    // $(".fd-schedule-label").addClass("sl-hover");
    // $obj.removeClass("sl-hover");
    // $(".fd-schedule-label").addClass("label-warning");
    // $obj.removeClass("label-warning");
    // $(".fd-schedule-label").removeClass("label-default");
    // $obj.addClass("label-default");
    $(".dd-list-buttons").removeClass("dd-list-hover");
    $obj.addClass("dd-list-hover");
  }

  function updateCountForTodayScheduleOnFrontDesk(city){
    $.couch.db(db).view("tamsa/getDHPAppointmentByDate",{
      success:function(data){
        if(data.rows.length > 0){
          updateCountIncrementValueOnFrontDesk(data);
        }else{
          $("#fd_todays_scheduled_patients, #fd_todays_checkedin_patients, #fd_todays_remaining_patients").html(0);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data.dhp_code,moment().format("YYYY-MM-DD"),city],
      endkey:[pd_data.dhp_code,moment().format("YYYY-MM-DD"),city,{}],
      include_docs:true
    }); 
  }

  function updateCountIncrementValueOnFrontDesk(data){
    var cnt_scheduled = 0,cnt_checked_in = 0;
    for(var i=0;i<data.rows.length;i++){
      if(data.rows[i].doc.status == "checked_in"){
        cnt_checked_in++;
      }else {
        cnt_scheduled++;
      }
    }
    $("#fd_todays_scheduled_patients").html(cnt_scheduled);
    $("#fd_todays_checkedin_patients").html(cnt_checked_in);
    $("#fd_todays_remaining_patients").html(Number(data.rows.length) - Number(cnt_checked_in));
  }

  function changeAppointmentStatusAtFrontDesk($obj){
    $.couch.db(db).openDoc($obj.parent().parent().data("index"),{
      success:function(data){
        if($obj.val() == "Check-in"){
          data.status = "checked_in";
          data.checked_in_time = moment().format("HH:mm");
        }else if($obj.val() == "No-Show"){
          data.status = "cancelled";
        }else if($obj.val() == "Cancelled"){
          data.status = "cancelled";
        }
        $.couch.db(db).saveDoc(data,{
          success:function(data){
            newAlert("success","successfully changed.");
            $("html, body").animate({scrollTop: 0}, 'slow');
            getTodaysScheduleForFrontDesk($("#fd_scheduled_patients_label"),"scheduled",$("#fd_locations").val());
            return false;
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
  }

  function changeCheckedInStatusAtFrontDesk($obj){
    $.couch.db(db).openDoc($obj.parent().parent().data("index"),{
      success:function(data){
        data.checked_in_status = $obj.val();
        saveDataWithSuccessMsgOnlyAtFrontDesk(data);
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function saveDataWithSuccessMsgOnlyAtFrontDesk(data){
    $.couch.db(db).saveDoc(data,{
      success:function(data){
        newAlert("success","successfully changed.");
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;    
      }
    });
  }

  function getAppointmentNotesForFrontDesk(index){
    $.couch.db(db).openDoc(index,{
      success:function(data){
        $("#fd_appointment_notes_modal").modal("show");
        $("#save_fd_appointment_notes").data("index",data._id);
        if(data.doctor_notes && data.doctor_notes.length > 0){
          var doc_note = [];
          $("#fd_appointment_notes_histories").html('');
          for(var i=0;i<data.doctor_notes.length;i++){
            doc_note.push('<div class="col-lg-12">');
              doc_note.push('<ul class="lab_result_previous_comment"><li><div>'+data.doctor_notes[i].comments+'</div><div class="fd-notes"> Commented on : '+moment(data.doctor_notes[i].time).format("DD-MM-YYYY HH:mm")+'</div></li></ul>');
            doc_note.push('</div>');
          }
          $("#fd_appointment_notes_histories").append(doc_note.join(''));
        }else{
          $("#fd_appointment_notes_histories").html("No Past Notes are Found.");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function saveAppointmentNotesForFrontDesk() {
    $.couch.db(db).openDoc($("#save_fd_appointment_notes").data("index"),{
      success:function(data){
        var temp_data = data.doctor_notes ? data.doctor_notes : [] ;
        temp_data.push({
          comments: $("#fd_doctor_appointment_notes").val(),
          time: new Date()
        });
        data.doctor_notes = temp_data;
        $.couch.db(db).saveDoc(data,{
          success:function(data){
            newAlert("success","Notes Successfully Added.")
            $("html, body").animate({scrollTop: 0}, 'slow');
            $("#fd_appointment_notes_modal").modal('hide');
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
  }


  function changePatientConditionInTodayScheduleForFrontDesk($obj){
    $.couch.db(db).view("tamsa/getPatientConditionBySeverity", {
      success: function(data) {
        if (data.rows.length > 0) {
        var bulk_data= [];
        for(var i=0;i<data.rows.length;i++){
          if($obj.prop("checked")){
            data.rows[i].doc.CONDITION_SEVERITY = "High";
          }else{
            data.rows[i].doc.CONDITION_SEVERITY = "Low";
          }
          bulk_data.push(data.rows[i].doc);
        } 
        $.couch.db(db).bulkSave({"docs":bulk_data},{
          success:function(data){
            if($obj.prop("checked")) newAlert("success","Patient is mark as Critical successfully.");
            else newAlert("danger","Patient is mark as Not Critical successfully.")
            $("html, body").animate({scrollTop: 0}, 'slow');
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
        }
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: ["High", data.user_id, "From Doctor Note"],
      startkey: ["High", data.user_id, "From Doctor Note",{}],
      reduce: false,
      group: false,
      include_docs:true
    });
  }

  function setAppointmentFieldsForNewPatient() {
    if($("#fd_new_patient").prop("checked")) {
      $("#fd_appointment_patient_list").hide().val();
      $("#fd_appointment_patient_first_name, #fd_appointment_patient_last_name").show().val();
      $("#fd_appointment_patient_email, #fd_appointment_patient_phone").val("").removeAttr("readonly");
      $("#default_patient_fd_profile").show();
      $("#selected_patient_fd_profile").hide();
      //removeAutocompleterFromElement("fd_appointment_patient_list");
    }else {
      $("#fd_appointment_patient_list").show().val();
      $("#fd_appointment_patient_email, #fd_appointment_patient_phone").val("").attr("readonly","readonly");
      searchDHPPatientByNameAutocompleter("fd_appointment_patient_list",autocompleterSelectEventForSubscriberListOnFrontDeskAppointment,false,pd_data.dhp_code);
      $("#fd_appointment_patient_first_name, #fd_appointment_patient_last_name").hide().val();
    }
  }

  function autocompleterSelectEventForSubscriberListOnFrontDeskAppointment(ui,search_id){
    if(ui.item.key[1] == "No results found"){
      return false;
    }else{
      getPatientDetailsFrontDesk(ui.item.key[2]);
      $("#"+search_id).val(ui.item.key[1]);
      $("#"+search_id).data("user_id",ui.item.key[2]);
      getUSerDetailsFromUserID(ui.item.key[2]);
    }
    return false;
  }

  function getPatientDetailsFrontDesk(user_id,$obj){
    $("#fd_edit_profile").html('<a target="_blank" class="hovercolor pointer anchor-color fd_edit_profile" ui-sref="practice_info({user_id:\''+user_id+'\'})">Edit Profile</a>');
    $compile($(".fd_edit_profile"))($scope);
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        $.couch.db(db).view("tamsa/testPatientsInfo",{
          success:function(meddata){
            if(data.rows.length > 0){
              $(".get-patient-details-fd").closest("tbody").find("tr").removeClass("warning");
              $obj.closest("tr").addClass("warning");
              if(data.rows[0].doc.initial){
                $("#infosybol").show();
              }else{
                $("#infosybol").hide();
              }
              $("#fd_patient_fname").html(data.rows[0].doc.first_nm);
              $("#fd_patient_lname").html(data.rows[0].doc.last_nm);
              $("#fd_patient_phone").html(data.rows[0].doc.phone);
              if(data.rows[0].doc.gender) $("#fd_patient_gender").html(data.rows[0].doc.gender)
              if(data.rows[0].doc.date_of_birth) $("#fd_patient_date_of_birth").html(data.rows[0].doc.date_of_birth)
              else $("#fd_patient_date_of_birth").html("NA")
              $("#fd_patient_dhp_id").html(data.rows[0].doc.patient_dhp_id);
              if(meddata.rows.length > 0){
                if(meddata.rows[0].doc.height && meddata.rows[0].doc.weight) $("#fd_patient_bmi").html(calculatePatientBMI(meddata.rows[0].doc.height,meddata.rows[0].doc.weight))
                else $("#fd_patient_bmi").html("NA")
              }else{
                $("#fd_patient_bmi").html("NA");
              }
              if(data.rows[0].doc.user_email == "emailnotprovided@digitalhealthpulse.com") $("#fd_patient_email").html("NA")
              else $("#fd_patient_email").html(data.rows[0].doc.user_email)
              if(data.rows[0].doc.imgblob){
                $(".UserPanelThumpNail").html('<img src="'+data.rows[0].doc.imgblob+'" style="width: 112px;border: 1px solid grey;border-radius:55px;">');
              }else if(data.rows[0].doc._attachments){
                url = $.couch.urlPrefix+'/'+ personal_details_db + '/' +data.rows[0].id+'/'+Object.keys(data.rows[0].doc._attachments)[0];
                $(".UserPanelThumpNail").html('<img src="'+url+'" style="width: 112px; border: 1px solid grey;border-radius:55px;">');
              }else{
                $(".UserPanelThumpNail").html('<img src="images/profile-pic.png" style="width: 112px; border: 1px solid grey;border-radius:55px;">');
              }
              $("#default_patient_fd_profile").hide();
              $("#selected_patient_fd_profile").show();
            }else{
              $("#selected_patient_fd_profile").hide();
              $("#default_patient_fd_profile").show();
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          include_docs:true,
          key:user_id
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      include_docs:true,
      key: user_id
    });
  }

  function frontDeskEventBindings() {
    $("#front_desk_parent").on("click",".get-patient-details-fd",function(){
      getPatientDetailsFrontDesk($(this).data("user_id"),$(this));
    });

    $("#front_desk_parent").on("change","#fd_new_patient",function(){
      setAppointmentFieldsForNewPatient();
    });

    $("#front_desk_parent").on("change",".task_list_row", function() {
      changeTaskStatus($(this));
    });

    $("#front_desk_parent").on("change","#fd_select_task_type",function(){
      getCurrentTaskForFrontDesk($(this).val(),$("#fd_select_patient_task").val());
    });

    $("#front_desk_parent").on("change","#fd_select_patient_task",function(){
      getCurrentTaskForFrontDesk($("#fd_select_task_type").val(),$(this).val());
    });

    $("#front_desk_parent").on("click","#create_new_appointment_from_front_desk",function(){
      createAppointmentFromFrontDesk();
    });

    $("#front_desk_parent").on("click","#upload_files_from_front_desk",function(){
      uploadFilesRequestFromFrontDesk();
    });

    $("#front_desk_parent").on("click","#isu_email_not_provid",function(){
      emailNotProvidToggle($(this));
    });

    $("#front_desk_parent").on("click","#moreoption",function(){
      toggleMoreOptionOnFrontDeskAppointment();
    });

    $("#front_desk_parent").on("click","#fd_color_code_dropdown li a",function(){
      fdPickAColorPreference($(this));    
    });
    
    $("#front_desk_parent").on("click","#fd_scheduled_patients_label",function(){
      getTodaysScheduleForFrontDesk($(this),"scheduled",$("#fd_locations").val());
    });

    $("#front_desk_parent").on("click","#fd_checkedin_patients_label",function(){
      getTodaysScheduleForFrontDesk($(this),"checked_in",$("#fd_locations").val());
    });
    
    $("#front_desk_parent").on("change","#fd_locations",function(){
      if($("#fd_scheduled_patients_label").hasClass("dd-list-hover")) {
        getTodaysScheduleForFrontDesk($("#fd_scheduled_patients_label"),"scheduled",$("#fd_locations").val());
      }else if($("#fd_checkedin_patients_label").hasClass("dd-list-hover")){
        getTodaysScheduleForFrontDesk($("#fd_checkedin_patients_label"),"checked_in",$("#fd_locations").val());
      }
    });

    $("#front_desk_parent").on("change",".fd_appointment_status",function(){
      changeAppointmentStatusAtFrontDesk($(this));
    });

    $("#front_desk_parent").on("click",".fd_edit_patient_tags",function(){
      editPatientTagsForFrontDesk($(this));
    });

    $("#front_desk_parent").on("click","#fd_update_patient_tags",function(){
      updatePatientTagsForFrontDesk();
    });

    $("#front_desk_parent").on("change",".fd_checked_in_status",function(){
      changeCheckedInStatusAtFrontDesk($(this));
    });

    $("#front_desk_parent").on("click",".fd_appointment_notes",function(){
      getAppointmentNotesForFrontDesk($(this).parent().parent().data("index"));
    });

    $("#front_desk_parent").on("click","#save_fd_appointment_notes",function(){
      saveAppointmentNotesForFrontDesk();
    });
    $("#front_desk_parent").on("click",".fd_condition_flag",function(){
      changePatientConditionInTodayScheduleForFrontDesk($(this));
    });
  }
});  