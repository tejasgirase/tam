var d    = new Date();
var pd_data = {};
var plController = {};
app.controller("dailyDasboardController",function($scope,$state,$compile,tamsaFactories,$stateParams){
  console.log("4"); 
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db(replicated_db).openDoc("org.couchdb.user:n@n.com", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            displayDailyDashboard();
            dailyDashboardEventBindings();
            tamsaFactories.pdBack();
            tamsaFactories.sharedBindings();
            tamsaFactories.displayDoctorInformation(data);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
  //     }
  //   }
  // });

  function displayDailyDashboard(){
    getTelemedicineSummaryForDailyDashboard("Show From All Category");
    getChatingTemplatesForDailyDashboard();
    plController.getCriticalPatientsForDailyDashboard();
    getCurrentTaskForDailyDashboard("noselect","noselect");
    getCurrentTaskPatientListForDailyDashboard();
    $('#dr_daily_dashboard').show();
    $(".tab-pane").removeClass("active");
    $("#dr_daily_dashboard").addClass("active");
    tamsaFactories.selectLocationForAppointment("dd_locations",pd_data.city);
    getTodaysScheduleForDailyDashboard($("#dd_scheduled_patients_label"),"scheduled",pd_data.city);
  }

  function getCurrentTaskPatientListForDailyDashboard(){
    $.couch.db(db).view("tamsa/getDoctorTaskForCurrentDate", {
      success: function(data) {
        if(data.rows.length > 0){
          $("#dd_select_patient_task option").remove();
          $("#dd_select_patient_task").html("<option value='noselect'>Select Patient</option>")
          var tempusers = [];
          for(var i=0;i<data.rows.length;i++){
            if(tempusers.indexOf(data.rows[i].doc.user_id) < 0){
              getPatientInformationForDDCurrentTask(data.rows[i])
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

  function getCurrentTaskForDailyDashboard(task_type,user_id){
    if(task_type == "noselect" && user_id == "noselect"){
      var tempstart = [pd_data._id];
      var tempend   = [pd_data._id,{},{},{}];
    }else if(task_type != "noselect" && user_id == "noselect"){
      var tempstart = [pd_data._id,task_type];
      var tempend   = [pd_data._id,task_type,{},{}];
    }else if(task_type == "noselect" && user_id != "noselect"){
      var tempstart = [1,pd_data._id,user_id];
      var tempend   = [1,pd_data._id,user_id,{},{}];
    }else {
      var tempstart = [2,pd_data._id,task_type,user_id];
      var tempend   = [2,pd_data._id,task_type,user_id,{},{}];
    }
    $.couch.db(db).view("tamsa/getDoctorTaskForCurrentDate", {
      success: function(data) {
        if(data.rows.length > 0){
          $("#no_of_current_task").html(data.rows.length);
          paginationConfiguration(data,"current_task_daily_dashboard_pagination",5,displayCurrentTaskList);
          
        }else{
          $("#dd_current_task_table tbody").html('<tr><td colspan="6">No task is Due.</td></tr>');
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

  function displayCurrentTaskList(start,end,data){
    $("#dd_current_task_table tbody").html('');
    for(var i=start;i<end;i++){
      getUserDetailsForDDCurrentTask(data.rows[i]);
    }
  }

  function getUserDetailsForDDCurrentTask(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          var current_task_Data= [];
          current_task_Data.push('<tr>');
          if(data.doc.task == "Other"){
            current_task_Data.push('<td><a target="" class="anchor-color hovercolor pointer view_task">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</a></td>');
          }else{
            current_task_Data.push('<td><a target="_blank" class="anchor-color hovercolor pointer view_task" ui-sref="daily_dashboard_task_manager({user_id:\''+data.doc.user_id+'\', attachment_id:\''+data.doc.document_id+'\', action:\''+data.doc.task+'\'})">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</a></td>');
          }
          current_task_Data.push('<td>'+data.doc.task+'</td>');
          current_task_Data.push('<td>'+moment(data.doc.insert_ts).format("YYYY-MM-DD")+'</td>');
          current_task_Data.push('<td>NA</td>');
          current_task_Data.push('<td>NA</td>');
          if(data.key[0] == 1) {
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="daliyDashboard" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[3]+'" index="'+data.doc._id+'">');
            if(data.key[3] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>');
            if(data.key[3] == "Completed") current_task_Data.push('<option value="Review">Under Review</option><option selected="selected">Completed</option><option>Reassign</option>');
            if(data.key[3] == "Reassign") current_task_Data.push('<option value="Review">Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }else if(data.key[0] == 2) {
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="daliyDashboard" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[4]+'" index="'+data.doc._id+'">');
            if(data.key[4] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>');
            if(data.key[4] == "Completed") current_task_Data.push('<option value="Review">Under Review</option><option selected="selected">Completed</option><option>Reassign</option>');
            if(data.key[4] == "Reassign") current_task_Data.push('<option value="Review">Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }else {
            current_task_Data.push('<td><select class="form-control task_list_row" data-action="daliyDashboard" user_id="'+data.doc.user_id+'" data-main-val="'+data.key[2]+'" index="'+data.doc._id+'">');
            if(data.key[2] == "Review") current_task_Data.push('<option value="Review" selected="selected">Under Review</option><option>Completed</option><option>Reassign</option>');
            if(data.key[2] == "Completed") current_task_Data.push('<option value="Review">Under Review</option><option selected="selected">Completed</option><option>Reassign</option>');
            if(data.key[2] == "Reassign") current_task_Data.push('<option value="Review">Under Review</option><option>Completed</option><option selected="selected">Reassign</option>');
          }
          current_task_Data.push('</select>');

          if(data.key[0] == 1) {
            if(data.key[3] == "Reassign") current_task_Data.push('<strong>To:</strong>'+data.doc.reassign_doctor[data.key[4]].name);
          }else if(data.key[0] == 2) {
            if(data.key[4] == "Reassign") current_task_Data.push('<strong>To:</strong>'+data.doc.reassign_doctor[data.key[5]].name);
          }else {
            if(data.key[2] == "Reassign") current_task_Data.push('<strong>To:</strong>'+data.doc.reassign_doctor[data.key[3]].name); 
          }
          current_task_Data.push('</td></tr>');
          $("#dd_current_task_table tbody").append(current_task_Data.join(''));
          $compile($(".view_task"))($scope);
        }else{
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

  function getPatientInformationForDDCurrentTask(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          $("#dd_select_patient_task").append('<option value="'+pdata.rows[0].doc.user_id+'">'+pdata.rows[0].doc.first_nm+"<br>"+pdata.rows[0].doc.last_nm+'</option>');
        }else{
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

  function getTodaysScheduleForDailyDashboard($obj,status,city) {
    toggleScheduleLabels($obj);
    updateCountForTodayScheduleOnDailyDashboard(city);
    $("#dd_today_schedule_table tbody").html("");
    $.couch.db(db).view("tamsa/getAppointmentByDate",{
      success:function(data){
        if(data.rows.length > 0) {
          $("#dd_today_schedule_table tbody").css("height","");
          if(status == "scheduled"){
            paginationConfiguration(data,"today_schedule_daily_dashboard_pagination",5,displayDailyDashboardTodaySchedule);
          }else{
            paginationConfiguration(data,"today_schedule_daily_dashboard_pagination",5,displayDailyDashboardTodayScheduleAndCheckeIn);
          }
        }else{  
          $("#today_schedule_daily_dashboard_pagination").html("");
          $("#dd_today_schedule_table tbody").css("background-color","white");
          $("#dd_today_schedule_table tbody").html("<tr><td colspan='7' class='text-center'>No Appointment schedule for today.</td></tr>").css("height","250px");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:[pd_data._id,moment().utc().format("YYYY-MM-DD"),city,status],
      include_docs:true
    });
  }

  function displayDailyDashboardTodaySchedule(start,end,data){
    for(var i=start;i<end;i++){
      if(data.rows[i].doc.status != "checked_in"){
        getUserDetailsForDDTodaySchedule(data.rows[i].doc);
      }
    }
  }

  function displayDailyDashboardTodayScheduleAndCheckeIn(start,end,data){
    for(var i=start;i<end;i++){
      if(data.rows[i].doc.status == "checked_in"){
        getUserDetailsForDDTodaySchedule(data.rows[i].doc);
      }
    }
  }

  function getUserDetailsForDDTodaySchedule(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          $.couch.db(db).view("tamsa/getPatientConditionBySeverity", {
            success: function(condata) {
              var schedule_data= [];
              schedule_data.push('<tr data-user_id="'+data.user_id+'" data-index="'+data._id+'">');
              schedule_data.push('<td><span class="pointer get-patient-details-dd hovercolor">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</span></td>');
              schedule_data.push('<td>'+data.color_preference+'</td>');
              if ($("#dd_scheduled_patients_label").hasClass("dd-list-hover")) {
                if(data.status == "no_show"){
                  schedule_data.push('<td><select class="form-control appointment_status cuswidth100"><option>Select</option><option>Check-in</option><option selected="selected">No-Show</option><option>Cancelled</option></select></td>');
                  schedule_data.push('<td>NA</td>');
                }else if(data.status == "cancelled"){
                  schedule_data.push('<td><select class="form-control appointment_status cuswidth100" disabled="disabled"><option>Select</option><option>Check-in</option><option>No-Show</option><option selected="selected">Cancelled</option></select></td>');
                  schedule_data.push('<td>NA</td>');  
                }else{
                  schedule_data.push('<td><select class="form-control appointment_status cuswidth100"><option>Select</option><option>Check-in</option><option>No-Show</option><option>Cancelled</option></select></td>');  
                  schedule_data.push('<td>NA</td>');
                }  
              }else if ($("#dd_checkedin_patients_label").hasClass("dd-list-hover")) {
                schedule_data.push('<td>');
                if(data.checked_in_status){
                  if(data.checked_in_status == "In exam room") schedule_data.push('<select title="In exam room" class="form-control checked_in_status cuswidth100"><option>Select</option><option selected="selected">In exam room</option><option>Waiting for doctor</option>');
                  else if(data.checked_in_status == "Waiting for doctor") schedule_data.push('<select title="Waiting for doctor" class="checked_in_status cuswidth100"><option>Select</option><option>In exam room</option><option selected="selected">Waiting for doctor</option>');
                  else schedule_data.push('<select class="form-control checked_in_status cuswidth100" title="select option"><option selected="selected">Select</option><option>In exam room</option><option>Waiting for doctor</option>');
                }else{
                  schedule_data.push('<select class="form-control checked_in_status cuswidth100" title="select option"><option selected="selected">Select</option><option>In exam room</option><option>Waiting for doctor</option>');
                }
                schedule_data.push('</select></td>');
                schedule_data.push('<td>'+data.checked_in_time+'</td>');
              }else{
                schedule_data.push('<td><select class="appointment_status cuswidth100"><option>Select</option><option>Check-in</option><option>No-Show</option><option>Cancelled</option></select></td>');
              }
              var temp_random = getPcode(5,"numeric");
              if (condata.rows.length > 0) {
                schedule_data.push('<td><input type="checkbox" class="cmn-toggle cmn-toggle-round dd_condition_flag" id="dd_condition_flag_'+temp_random+'" checked="checked"><label for="dd_condition_flag_'+temp_random+'"></label></td>');
              } else {
                schedule_data.push('<td><input type="checkbox" class="cmn-toggle cmn-toggle-round dd_condition_flag" id="dd_condition_flag_'+temp_random+'"><label for="dd_condition_flag_'+temp_random+'"></label></td>');
              }

              // schedule_data.push('<td>');
              
              schedule_data.push('<td>');
                if(data.tag) {
                  schedule_data.push('<span class="current_patient_tags">'+data.tag+'</span>');
                }else {
                  schedule_data.push('<span class="current_patient_tags">NA</span>');
                }
                schedule_data.push('<br><br><span class="label label-warning pointer edit_patient_tags">Edit</span>');
              schedule_data.push('</td>');
              schedule_data.push('<td><span class="glyphicon glyphicon-th-list dd_appointment_notes"></span></td>');
              schedule_data.push('<td><span class="pointer"><a target="_blank" class="anchor-color hovercolor pointer dd-view-patient-profile" ui-sref="medical_history({user_id:\''+data.user_id+'\'})"><img src="images/patients_info.png" class="dd-medicinfo"></a></span></td>');
              schedule_data.push('</tr>');
              $("#dd_today_schedule_table tbody").append(schedule_data.join(''));
              $compile($(".dd-view-patient-profile"))($scope);
              // $("#dd_today_schedule_table tbody").css("height","245px");
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
      error:function(data,error,reason,status){
        newAlert("danger",reason,status,error);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;      
      },
      key:          data.user_id,
      include_docs: true
    });
  }

  function editPatientTags($obj) {
    createModal("edit_patient_tags_modal");
    $("#update_patient_tags").data("index",$obj.closest("tr").data("index"));
    $("#update_patient_tags").data("user_id",$obj.closest("tr").data("user_id"));
    $("#update_patient_tags").data("$objEle",$obj);
    $.couch.db(db).view("tamsa/getPatientCategoryTags",{
      success:function(tdata) {
        if(tdata.rows.length > 0 && tdata.rows[0].value.tag_list.length > 0){
          $('#appointment_tag_status').tokenfield({
            autocomplete: {
              source: tdata.rows[0].value.tag_list,
              delay: 100
            },
            showAutocompleteOnFocus: true,
            beautify:false
          });  
          if($obj.closest("td").find(".current_patient_tags").html() !== "NA") {
            var arr = ($obj.closest("td").find(".current_patient_tags").html());
            $('#appointment_tag_status').tokenfield("setTokens",arr);
          }else {
            $('#appointment_tag_status').tokenfield("setTokens",[]);
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

  function updatePatientTags() {
    $("#edit_patient_tags_modal").modal("hide");
    if($("#update_patient_tags").data("index")) {
      $.couch.db(db).openDoc($("#update_patient_tags").data("index"),{
        success:function(data) {
          if($('#fd_appointment_tag_status').tokenfield("getTokens").length > 0) {
            var arr = $('#appointment_tag_status').tokenfield("getTokensList").split(",");
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
                        var $ele = $("#update_patient_tags").data("$objEle");
                        if($('#appointment_tag_status').tokenfield("getTokens").length > 0) {
                          $ele.closest("td").find(".current_patient_tags").text($('#appointment_tag_status').tokenfield("getTokensList").split(","));
                        }else {
                          $ele.closest("td").find(".current_patient_tags").text("NA");
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
                key:$("#update_patient_tags").data("user_id"),
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

  plController.getCriticalPatientsForDailyDashboard = function(){
    $.couch.db(db).list("tamsa/criticalPatientsDoctorList", "getDoctorSubscriberNew", {
    doctor_id:pd_data._id,
    source:"dashboard"
    }).success(function(data){
      if(data.rows.length > 0){
        paginationConfiguration(data,"critical_patient_daily_dashboard_pagination",5,displayDailyDashboardCriticalPatients);
      }else{
        $("#dd_critical_patient_table tbody").html('<tr><td colspan="5">No Records Found.</td></tr>');
      }
    });
  };

  function displayDailyDashboardCriticalPatients(start,end,data){
    var cp_data = [];
    $.couch.db(db).view("tamsa/getEprescribe", {
      success: function(edata) {
        for(var i=start;i<end;i++){
          cp_data.push('<tr><td><a target="_blank" class="anchor-color hovercolor pointer view_patient_profile name_'+data.rows[i].user_id+'" ui-sref="medical_history({user_id:\''+data.rows[i].user_id+'\'})">'+data.rows[i].User_firstname+' '+data.rows[i].User_lastname+'</a></td><td>'+data.rows[i].patient_dhp_id+'</td><td>'+moment(data.rows[i].condition_ts).format("YYYY-MM-DD hh:mm")+'</td><td>Notes</td><td><select user_id="'+data.rows[i].user_id+'" class="form-control dd-critical-patient-action action_to_patient"><option>Select Action</option><option>Send notification (Appointment)</option>');
        
          if(edata.rows.length > 0 && (edata.rows[0].value.push_medications || edata.rows[0].value.send_an_rx_directly || edata.rows[0].value.update_existing_medications)) cp_data.push('<option>Update Medications</option>');

          cp_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option><b>Patient not critical</b></option><option>Upload Files</option></select>');
        }
        $("#dd_critical_patient_table tbody").html(cp_data.join(''));
        $compile($(".view_patient_profile"))($scope);
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      key: pd_data._id
    });
  }

  function criticalPatientActions($obj,$state){
    var action_type = $obj.val();
    if (action_type == "Send notification (Appointment)") {
      $state.go("patient_appointments",{user_id:$obj.attr("user_id")});
    }
    else if (action_type == "Update Medications") {
      $state.go("medical_history",{user_id:$obj.attr("user_id"),tab_id:"medication"});
      $obj.val("Select Action");
    }
    else if (action_type == "Start a chart note") {
      openStratChartnoteModel($obj);
    }
    else if (action_type == "Referral complete") {
      completeRefferal($obj.attr('doc_id'));
    }else if (action_type == "New eLab & Imaging Order") {
      $state.go("medical_history",{user_id:$obj.attr("user_id"),tab_id:"elab order"});
      $obj.val("Select Action");
    }else if (action_type == "Add Task") {
      openAddPatientTaskModal($obj);
    }else if(action_type == "Upload Files") {
      showUploadFilesModal($obj.attr("user_id"),$obj.closest(".ListContatiner").find(".Username").html());
    }else if(action_type == "Patient not critical") {
      var  id="daily_dashboard_tab";
      tamsaFactories.makePatientCritical(false,id,$obj.attr("user_id"),pd_data._id);
    }else if(action_type == "Patient critical") {
      var  id="daily_dashboard_tab";
      tamsaFactories.makePatientCritical(true,id,$obj.attr("user_id"),pd_data._id);
    }
  }

  function getChatingTemplatesForDailyDashboard(){
    $.couch.db(db).view("tamsa/getChartingTemplatesForDoctorDashboard",{
      success:function(data){
        if(data.rows.length > 0){
          paginationConfiguration(data,"chart_notes_daily_dashboard_pagination",5,displayDailyDashboardChartingTemplates);
        }else{
          $("#dd_charting_template_table tbody").html("<tr><td colspan='6'>No Records Found.</td></tr>");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0},'slow');
        return false;
      },
      startkey:[pd_data._id,{}],
      endkey:[pd_data._id],
      include_docs:true,
      descending:true
    });
  }

  function displayDailyDashboardChartingTemplates(start,end,data) {
    var chart_data = [];
    for(var i=start;i<end;i++){
      if(!data.rows[i].doc.patient_first_name) console.log(data.rows[i].doc);
      // var cc_data = data.rows[i].doc.chief_complaint?data.rows[i].doc.chief_complaint:'NA';
      // <td>'+cc_data+'</td>
      chart_data.push('<tr><td>'+data.rows[i].doc.patient_first_name+' '+data.rows[i].doc.patient_last_name+'</td><td>'+data.rows[i].doc.visit_type+'</td><td>'+moment(data.rows[i].doc.update_ts).format("YYYY/MM/DD")+'</td><td><select data-index="'+data.rows[i].doc._id+'" data-user_id="'+data.rows[i].doc.user_id+'" class="form-control dd-chart-notes-action"><option>select option</option><option>View/Edit</option><option>Save and Finalize</option></select></td></tr>');
    }
    $("#dd_charting_template_table tbody").html(chart_data.join(''));
  }

  function dailyDashboardChartNotesAction($obj) {
    if($obj.val() == "Save and Finalize") {
      finalizeChartingTemplateFromDD($obj.data("index"));
    }else if($obj.val() == "View/Edit") {
      viewEditPartiallySavedChartingTemplate($obj);
    }
  }

  function viewEditPartiallySavedChartingTemplate($obj) {
    createModal("partial_charting_template_confirm");
    $("#view_edit_partial_charting_template").html('<a target="_blank" ui-sref="patient_charting_templates({user_id:\''+$obj.data('user_id')+'\',template_id:\''+$obj.data('index')+'\', template_state:\'choose\'})" class="hovercolor pointer anchor-color"><button class="btn btn-warning">Continue</button></a>');
    $compile($("#view_edit_partial_charting_template"))($scope);
    // $state.go("patient_charting_templates",{user_id:$obj.data('user_id'),template_id:$obj.data('index'),template_state:"choose"});
  }

  function finalizeChartingTemplateFromDD(index) {
    $.couch.db(db).openDoc(index, {
      success:function (data) {
        data.finalize     = "Yes";
        data.update_ts    = new Date();
        for(var i=0; i<data.sections.length; i++){
          for(var j=0; j<data.sections[i].fields.length; j++){
            data.sections[i].fields[j].field_name = data.sections[i].fields[j].f_name || "";
            if(data.sections[i].fields[j].f_name) {
              delete data.sections[i].fields[j].f_name;
            }
          }
          data.sections[i].section_name = data.sections[i].s_name || "";
          if(data.sections[i].s_name) {
            delete data.sections[i].s_name;
          }
        }
        $.couch.db(db).saveDoc(data, {
          success:function(sdata) {
            newAlert("success","Charting Template Successfully Finalized.");
            $("html, body").animate({scrollTop: 0}, 'slow');
            getChatingTemplatesForDailyDashboard();
            if(data.vital_sings_data) {
              var bmi = (Number(data.vital_sings_data.height) && data.vital_sings_data.height != 0 && data.vital_sings_data.height != "") ? calculatePatientBMI(data.vital_sings_data.height,data.vital_sings_data.value_weight) : "",
              selfcare_doc = {
                Fasting_Glucose:    data.vital_sings_data.fasting_glucose,
                HeartRate:          data.vital_sings_data.heart_rate,
                O2:                 data.vital_sings_data.o2,
                OutOfRange:         data.vital_sings_data.normal_condition,
                Respiration_Rate:   data.vital_sings_data.respiration,
                Time_BP:            "Time",
                Time_Fasting:       "Time",
                Time_HeartRate:     "Time",
                Time_Oxygen:        "Time",
                Time_Respiration:   "Time",
                Time_Weight:        "Time",
                Value_Diastolic_BP: data.vital_sings_data.diastolic_bp,
                Value_Systolic_BP:  data.vital_sings_data.systolic_bp,
                Value_MAP:          calculateMAP(Number(data.vital_sings_data.systolic_bp),Number(data.vital_sings_data.diastolic_bp)),
                Value_temp:         data.vital_sings_data.temprature,
                Value_weight:       data.vital_sings_data.value_weight,
                height:             data.vital_sings_data.height,
                bmi:                bmi,
                waist:              data.vital_sings_data.waist,
                doctype:            "SelfCare",
                insert_ts:          new Date(),
                insert_ts_int:      "",
                user_id:            userinfo.user_id
              };
              $.couch.db(db).saveDoc(selfcare_doc, {
                success:function(savedata) {
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                }
              });
            }
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
  function getTelemedicineSummaryForDailyDashboard(health_category){
    var tempstart;
    var tempend;
    if(health_category == "Show From All Category"){
      tempstart = [pd_data.random_code];
      tempend   = [pd_data.random_code,{}];
    }else{
      tempstart = [pd_data.random_code,health_category];
      tempend   = [pd_data.random_code,health_category];
    }
    $.couch.db(db).view("tamsa/getDoctorTelemedicineInqueries", {
      success: function(data) {
        if(data.rows.length > 0){
          paginationConfiguration(data,"telemedicine_daily_dashboard_pagination",5,displayDailyDashboardTelemedicineInqueiries);
        }else{
          $("#dd_telemedicine tbody").html('<tr><td colspan="6">No Inquiries are Found.</td></tr>');  
        }
      },
      error: function(data,error,reason) {
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0},'slow');
        return false;
      },
      startkey: tempstart,
      endkey: tempend,
      include_docs: true
    });
  }

  function displayDailyDashboardTelemedicineInqueiries(start,end,data){
    $("#dd_telemedicine tbody").html('');
    for(var i=start;i<end;i++){
      getPatientNameForTelemedicineInquiries(data.rows[i].doc);
    }
  }

  function getPatientNameForTelemedicineInquiries(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(pdata){
        if(pdata.rows.length > 0){
          $.couch.db(db).view("tamsa/getPatientConditionBySeverity",{
            success:function(condata){
              var telemedicine_inq = [];
              telemedicine_inq.push('<tr>');
              telemedicine_inq.push('<td><a target="_blank" class="hovercolor pointer anchor-color dd_telemedicine_request" ui-sref="telemedicine({doc_id:\''+data._id+'\'})">'+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+'</a></td>');
              telemedicine_inq.push('<td>'+data.Health_Issue_Description+'</td>');
              telemedicine_inq.push('<td class="text-align"><span class="pointer dd_telemedicine_row">'+data.update_ts.substring(0, 10)+'</span></td>');
              if(condata.rows.length > 0){
                telemedicine_inq.push('<td class="text-align">Yes</td>');
              }else{
                telemedicine_inq.push('<td class="text-align">No</td>');
              }
              
              telemedicine_inq.push('<td class="text-align">Paid</td>');
              telemedicine_inq.push('<td class="text-align" data-doc_id="'+data._id+'"><select class="form-control dd-telemedicine-action"><option>Select Action</option><option>View Communication History</option><option>View Symptoms</option><option>View Patient History/Timeline</option><option>Respond</option></select></td></tr>');
              $("#dd_telemedicine tbody").append(telemedicine_inq.join(''));
              $compile($(".dd_telemedicine_request"))($scope);
            },
            error:function(data,error,reason){
              newAlert('danger', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
            },
            startkey:["High",data.user_id],
            endkey:["High",data.user_id,{},{}],
            reduce:true,
            group:true
          });
        }else{
          newAlert("danger","No Patient Found.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert('danger', reason,error);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      include_docs:true,
      key:data.user_id
    });
  }

  function openDailyDashboardModal(){
    $("#daily_dashboard_details_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
  }

  function dailyDashboardTelemedicineAction($obj){
    if($obj.val() == "View Communication History"){
      $.couch.db(db).openDoc($obj.parent().data("doc_id"),{
        success:function(data){
          openDailyDashboardModal();
          var history_data = [];
          history_data.push('<table class="table tbl-border"><thead><tr><th>Past Response</th><th>Date</th></tr></thead><tbody>');
          for(var i=0;i<data.Response.length;i++){
            history_data.push('<tr><td>'+(data.Response[i].response ? data.Response[i].response : "NA")+'</td><td>'+(data.Response[i].time ? moment(data.Response[i].time).format("DD-MM-YYYY hh:mm a") : "NA")+'</td></tr>');
          }
          history_data.push('</tbody></table>');
          $("#daily_dashboard_details_modal .modal-title").html("Communication History");
          $("#daily_dashboard_details_modal_body").html(history_data.join(''));
          $("#daily_dashboard_details_modal_footer").html('');
        },
        error:function(data,error,reason){
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });
    }else if($obj.val() == "View Symptoms"){
      $.couch.db(db).openDoc($obj.parent().data("doc_id"),{
        success:function(data){
          var history_data = [];
          openDailyDashboardModal();
          $("#daily_dashboard_details_modal .modal-title").html("List Of Symptoms");
          history_data.push('<ul>');
          for(var i=0;i<data.symptoms.length;i++){
            history_data.push('<li>'+data.symptoms[i]+'</li>');
          }    
          history_data.push('</ul>');
          $("#daily_dashboard_details_modal_body").html(history_data.join(''));
          $("#daily_dashboard_details_modal_footer").html('');
        },
        error:function(data,error,reason){
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });
    }else if($obj.val() == "View Patient History/Timeline"){
      $.couch.db(db).openDoc($obj.parent().data("doc_id"),{
        success:function(data){
          $.couch.db(db).view("tamsa/testPatientsInfo",{
            success:function(meddata){
              $.couch.db(db).view("tamsa/getTimeLineRecords", {
                success: function(tldata) {
                  var history_data = [];
                  $("#daily_dashboard_medical_history_modal").modal({
                    show:true,
                    backdrop:'static',
                    keyboard:false
                  });
                  activateMedicalInfoAtDailyDashboard($("#dd_medical_info_tab_link"));
                  history_data.push('<tr>');
                  history_data.push('<td><ul>');
                  if(typeof(meddata.rows[0].doc.Medication) == "string"){
                    history_data.push('<li>'+meddata.rows[0].doc.Medication+'</li>');
                  }else{
                    for(var i=0;i<meddata.rows[0].doc.Medication.length;i++){
                      history_data.push('<li>'+meddata.rows[0].doc.Medication[i]+'</li>');  
                    }
                  }
                  history_data.push('</ul></td><td><ul>');
                  if(typeof(meddata.rows[0].doc.Condition) == "string"){
                    history_data.push('<li>'+meddata.rows[0].doc.Condition+'</li>');  
                  }else{
                    for(var i=0;i<meddata.rows[0].doc.Condition.length;i++){
                      history_data.push('<li>'+meddata.rows[0].doc.Condition[i]+'</li>');  
                    }             
                  }
                  history_data.push('</ul></td><td><ul>');
                  if(meddata.rows[0].doc.Allergies){
                    if(typeof(meddata.rows[0].doc.Allergies) == "string"){
                      history_data.push('<li>'+meddata.rows[0].doc.Allergies+'</li>');
                    }else{
                      for(var i=0;i<meddata.rows[0].doc.Allergies.length;i++){
                          history_data.push('<li>'+meddata.rows[0].doc.Allergies[i]+'</li>');  
                      }
                    }
                  }else{
                    history_data.push('<li>NA</li>');
                  }  
                  history_data.push('</ul></td><td><ul>');
                  if(typeof(meddata.rows[0].doc.Medication) == "string"){
                    history_data.push('<li>'+meddata.rows[0].doc.Procedure.trim()+'</li>');  
                  }else{
                    for(var i=0;i<meddata.rows[0].doc.Procedure.length;i++){
                      history_data.push('<li>'+meddata.rows[0].doc.Procedure[i].trim()+'</li>');  
                    }  
                  }
                  history_data.push('</ul></td></tr>');
                  getAnalyticsRangeForCharting(data.user_id);
                  $("#daily_dashboard_medical_history_tabel tbody").html(history_data.join(''));
                  displayTimelineRecordsAtDailyDashboard(tldata);
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                },
                startkey: [data.user_id,{},{}],
                endkey: [data.user_id],
                descending : true,
                limit:10
              });
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:data.user_id,
            include_docs:true
          });
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    }else if($obj.val() == "Respond"){
      $.couch.db(db).openDoc($obj.parent().data("doc_id"),{
        success:function(data){
          var history_data = [];
          openDailyDashboardModal();
          $("#daily_dashboard_details_modal .modal-title").html("Enter Response for Query::");
          history_data.push('<div class="row">');
          history_data.push('<div class="col-lg-3">');
          history_data.push('<label class="theme-color">Subject::</label>');
          history_data.push('</div>');
          history_data.push('<div class="col-lg-9"><span>'+data.subject+'</span></div>');
          history_data.push('</div>');
          history_data.push('<div class="row">');
          history_data.push('<div class="col-lg-3">');
          history_data.push('<label class="theme-color">Issue Description::</label>');
          history_data.push('</div>');
          history_data.push('<div class="col-lg-9"><span>'+data.Health_Issue_Description+'</span></div>');
          history_data.push('</div>');
          history_data.push('<div class="row">');
          history_data.push('<div class="col-lg-3">');
          history_data.push('<label class="theme-color">Symptoms::</label>');
          history_data.push('</div>');
          history_data.push('<div class="col-lg-9"><span>'+data.symptoms+'</span></div>');
          history_data.push('</div>');
          history_data.push('<div class="row mrgtop1">');
          history_data.push('<div class="col-lg-12">');
          history_data.push('<textarea id="dd_telemedicine_response" placeholder="Enter your response here" class="form-control"></textarea>');
          history_data.push('</div>');
          history_data.push('</div>');
          $("#daily_dashboard_details_modal_body").html(history_data.join(''));
          $("#daily_dashboard_details_modal_footer").html('<button class="btn btn-warning" id="dd_save_close_telemedicine_inquiry">Save and Close</button><button id="dd_save_save_telemedicine_inquiry" class="btn btn-warning">Save and Send</button>');
        },
        error:function(data,error,reason){
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });  
    }
  }

  function displayTimelineRecordsAtDailyDashboard(data){
    var timeline = [];
    $("#dd_timeline_list").html("");
    for (var i=0; i<data.rows.length; i++){
      var insdate = moment(data.rows[i].value.insert_ts);
      if (data.rows[i].value.doctype == "PhysicianNotes") {
        timeline.push("<div class='timelinesection'>");
        timeline.push("<h2 style='background:#43A047;'>"+data.rows[i].value.visit_type+" : Dr."+data.rows[i].value.doctor_name+"<span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data.rows[i].id+"'></span><span class='time'>"+insdate.format("DD MMM YYYY hh:mm:ss A")+"</span></h2><div class='timelinecontents'><div><div>"+data.rows[i].value.subjective+"</div><div class='asses'></div>");
          timeline.push("</div></div></div>");
      }
      else if(data.rows[i].value.doctype == "patient_charting_template"){
        var updatedate = moment(data.rows[i].value.update_ts);
        timeline.push("<div class='timelinesection'>");
        timeline.push("<h2 style='background:#be1b57;'><span>"+data.rows[i].value.template_name+"</span><span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' user_id ='"+data.rows[i].value.user_id+"' index='"+data.rows[i].id+"'></span><span class='time'>"+updatedate.format("DD MMM YYYY hh:mm:ss A")+"</span></h2><div class='timelinecontents'>");
          timeline.push("<div><div index='"+data.rows[i].id+"'></div>");
        // timeline.push('<div class="cc-timeline-charting-template-display row"><div class="col-lg-3">Chief Complaint</div><div class="col-lg-9">'+data.chief_complaint ? data.chief_complaint : "NA"+'</div></div>');
        for(var j=0;j<data.rows[i].value.sections.length;j++){
          timeline.push('<div class="timeline-charting-template-display mrgtop1"><span class="" style="font-weight:bold !important;">'+data.rows[i].value.sections[j].section_name+'</span></div><table class="table tbl-border"><thead><tr class="response_header"><th>Field Name</th><th>Response</th></tr></thead><tbody>');
            for(var k=0;k<data.rows[i].value.sections[j].fields.length;k++){
              if(data.rows[i].value.sections[j].fields[k].response_format_pair[0].response == "soapnote"){
                timeline.push('<tr><td colspan="2" class="newdesign_label" style="font-weight:bold !important;">');    
              }else{
                timeline.push('<tr><td class="newdesign_label" style="font-weight:bold !important;">'+data.rows[i].value.sections[j].fields[k].field_name+'</td><td><table class="table tbl-border">');
              }
              for(var p=0;p<data.rows[i].value.sections[j].fields[k].response_format_pair.length;p++){
                timeline.push(tlChartingTemplateResponseDisplay(data.rows[i].value.sections[j].fields[k].response_format_pair[p]));
              }
              if(data.rows[i].value.sections[j].fields[k].response_format_pair == "soapnote"){
                timeline.push('</td>');
              }else{
                timeline.push('</table></td>');
              }  
            } 
            timeline.push('</tbody></table>'); 
        }
        timeline.push("</div></div></div>");
      }
      else{
        timeline.push("<div class='timelinesection'>");
        timeline.push("<h2 style='color:#333;margin-bottom:2px;'><span class='title'>Lab Tests</span><span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data.rows[i].id+"'></span><span class='time'>"+insdate.format('DD MMM YYYY hh:mm:ss A')+"</span></h2><div class='timelinecontents' id='container"+i+"'><div><div class='lab'>");

        if(data.rows[i].value._attachments){
          timeline.push("<div style='float:left;width:74%;color:rgb(167, 195, 152); font-weight: bold;'>"+data.rows[i].value.document_name);
          if(data.rows[i].value.usermedhis_docid && data.rows[i].value.selfcare_docid && data.rows[i].value.patientnotes_docid){
           timeline.push("<table id='lab_result_medical_details_timeline' border='1' class='table lab_result_medical_details_timeline'></table>");
          }
          if(data.rows[i].value.comments){          
            if(data.rows[i].value.comments.length > 0){
              timeline.push('<span class="comment-title">Comments</span><ul>');
              for(var l=data.rows[i].value.comments.length-1;l>=0;l--){
                timeline.push('<li>'+data.rows[i].value.comments[l].comment+' <span class="comment-date"> - Commented on : '+moment(data.rows[i].value.comments[l].date).format('DD-MM-YYYY')+'</span></li>');
              }
              timeline.push('</ul>');
            }
          }
          timeline.push('</div>');
          var url = "";
          url     = '/'+db+'/'+data.rows[i].value._id+'/'+Object.keys(data.rows[i].value._attachments)[0];
          if (data.rows[i].value.Format == "PDF" || data.rows[i].value._attachments[Object.keys(data.rows[i].value._attachments)[0]].content_type == "application/pdf") {
            timeline.push("<div class=''><iframe width='220' height='160' class='media' src='"+url+"' scrolling='no'></iframe><div class='pdfcontainer' pdfurl='"+url+"'>Preview</div></div>");
          }else{
           timeline.push("<div class='imgcontainer'><img src='"+url+"' height='128px'></div>");
          }
        }else{
           timeline.push("<div style='float: left; margin-right: 499px;'><span class='label'>Exam Name : </span><span>"+data.rows[i].value.Exam_Name+"</span></div>");
        }
        if(i==0){
            $('#timeline_year').html(insdate.format('YYYY'));    
        }
        timeline.push("</div></div>");
        timeline.push("</div></div>");
      }
    }
    $("#dd_timeline_list").append(timeline.join(''));
  }

  function uniqueArray(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

  function uniqueJSON(list){
    var userids = [];
    $.each(list, function(index, value) {
      if ($.inArray(value.user_id, userids)==-1) {
        userids.push({
          name:value.name,
          user_id:value.user_id
        });
      }
    });
    return userids;
  }

  function toggleScheduleLabels($obj){
    $(".dd-list-buttons").removeClass("dd-list-hover");
    $obj.addClass("dd-list-hover");
  }

  function updateCountForTodayScheduleOnDailyDashboard(city){
    $.couch.db(db).view("tamsa/getAppointmentByDate",{
      success:function(data){
        if(data.rows.length > 0){
          updateCountIncrementValue(data);
        }else{
          $("#todays_scheduled_patients, #todays_checkedin_patients, #todays_remaining_patients").html(0);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data._id,moment().utc().format("YYYY-MM-DD"),city],
      endkey:[pd_data._id,moment().utc().format("YYYY-MM-DD"),city,{}],
      include_docs:true
    }); 
  }

  function updateCountIncrementValue(data){
    var cnt_scheduled = 0,cnt_checked_in = 0;
    for(var i=0;i<data.rows.length;i++){
      if(data.rows[i].doc.status == "checked_in"){
        cnt_checked_in++;
      }else{
        cnt_scheduled++;
      }
    }
    $("#todays_scheduled_patients").html(cnt_scheduled);
    $("#todays_checkedin_patients").html(cnt_checked_in);
    //var cnt_remaining = Number(data.rows.length) - Number(cnt_checked_in);
    $("#todays_remaining_patients").html(Number(data.rows.length) - Number(cnt_checked_in));
  }

  function changeAppointmentStatus($obj) {
    $.couch.db(db).openDoc($obj.parent().parent().data("index"),{
      success:function(data){
        if($obj.val() == "Check-in") {
          data.status = "checked_in";
          data.checked_in_time = moment().format("HH:mm");
        }else if($obj.val() == "No-Show") {
          data.status = "no_show";
        }else if($obj.val() == "Cancelled") {
          data.status = "cancelled";
        }
        $.couch.db(db).saveDoc(data,{
          success:function(data){
            newAlert("success","successfully changed.");
            $("html, body").animate({scrollTop: 0}, 'slow');
            getTodaysScheduleForDailyDashboard($("#dd_scheduled_patients_label"),"all",$("#dd_locations").val());
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

  function changePatientConditionInTodayScheduleForDailyDashboard($obj){
    var condition_severity;
    if($obj.prop("checked")){
      condition_severity = "High";
    }else{
      condition_severity = "Low";
    }
    $.couch.db(db).view("tamsa/getHighCondition", {
      success: function(data) {
        if (data.rows.length > 0) {
          data.rows[0].doc.CONDITION_SEVERITY = condition_severity;
          $.couch.db(db).saveDoc(data.rows[0].doc, {
            success:function(data){
              if($obj.prop("checked")) newAlert("success","Patient is mark as Critical successfully.");
              else newAlert("success","Patient is mark as Not Critical successfully.")
              $("html, body").animate({scrollTop: 0}, 'slow');
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          });
        } else {
          var newcondition = {
            CONDITION:          'From Doctor Note',
            CONDITION_SEVERITY: condition_severity,
            doctype:            'Conditions',
            user_id:            $obj.closest("tr").data("user_id"),
            doctor_id:          pd_data._id,
            insert_ts:          new Date()
          }
          $.couch.db(db).saveDoc(newcondition, {
            success: function(data) {
              if($obj.prop("checked")) newAlert("success","Patient is mark as Critical successfully.");
              else newAlert("success","Patient is mark as Not Critical successfully.")
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
      key: [pd_data._id, "From Doctor Note", $obj.closest("tr").data("user_id")],
      reduce: false,
      group: false,
      include_docs:true
    });
  }

  function updateFlagOnAppointmentDailyDashboard(index,flag_status){
    $.couch.db(db).openDoc(index,{
      success:function(data){
        data.flag = flag_status;
        saveDataWithSuccessMsgOnly(data);
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function changeCheckedInStatusAtDailyDashboard($obj){
    $.couch.db(db).openDoc($obj.parent().parent().data("index"),{
      success:function(data){
        data.checked_in_status = $obj.val();
        saveDataWithSuccessMsgOnly(data);
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function saveDataWithSuccessMsgOnly(data){
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

  function getAppointmentNotesForDailyDashboard(index){
    $.couch.db(db).openDoc(index,{
      success:function(data){
        $("#dd_appointment_notes_modal").modal("show");
        $("#save_dd_appointment_notes").data("index",data._id);
        if(data.doctor_notes && data.doctor_notes.length > 0){
          var doc_note = [];
          $("#dd_appointment_notes_histories").html('');
          for(var i=data.doctor_notes.length -1;i>=0;i--){
            doc_note.push('<div class="col-lg-12">');
              doc_note.push('<ul class="lab_result_previous_comment"><li><div>'+data.doctor_notes[i].comments+'</div><div class="dd-notes"> Commented on : '+moment(data.doctor_notes[i].time).format("DD-MM-YYYY HH:mm")+'</div></li></ul>');
            doc_note.push('</div>');
          }
          $("#dd_appointment_notes_histories").append(doc_note.join(''));
        }else{
          $("#dd_appointment_notes_histories").html("No Past Notes are Found.");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function saveAppointmentNotesForDailyDashboard(){
    $.couch.db(db).openDoc($("#save_dd_appointment_notes").data("index"),{
      success:function(data){
        var temp_data = data.doctor_notes ? data.doctor_notes : [] ;
        temp_data.push({
          comments: $("#dd_doctor_appointment_notes").val(),
          time: new Date()
        });
        data.doctor_notes = temp_data;
        $.couch.db(db).saveDoc(data,{
          success:function(data){
            newAlert("success","Notes Successfully Added.")
            $("html, body").animate({scrollTop: 0}, 'slow');
            $("#dd_appointment_notes_modal").modal('hide');
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

  function activateMedicalInfoAtDailyDashboard($obj){
    $("#dd_vital_sign_parent, #dd_timeline_list").hide("slow");
    $("#daily_dashboard_medical_history_tabel").show("slow");
    $obj.parent().parent().find("li").removeClass("active");
    $obj.parent().addClass("active");
  }

  function activateVitalSignsAtDailyDashboard($obj){
    $("#daily_dashboard_medical_history_tabel,#dd_timeline_list").hide("slow");
    $("#dd_vital_sign_parent").show("slow");
    $obj.parent().parent().find("li").removeClass("active");
    $obj.parent().addClass("active");
    $("#charting_vital_sign_inputs").find("tr:first").hide();
    $("#charting_vital_sign_inputs").find(".recent-vital-values:last").hide();
  }

  function activateTimelineAtDailyDashboard($obj){
    $("#dd_vital_sign_parent,#daily_dashboard_medical_history_tabel").hide("slow");
    $("#dd_timeline_list").show("slow");
    $obj.parent().parent().find("li").removeClass("active");
    $obj.parent().addClass("active");
  }

  function getUserDataForTimelineRecordsPrint($obj) {
    $.couch.db(db).view("tamsa/getPrintSetting",{
      success:function(hdata){
        if(hdata.rows.length > 0) {
          $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
            success:function (data) {
              if(data.rows.length > 0) {
                printTimelineRecords($obj,data,hdata);
              }else {
                console.log("no patient found with given details.");
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:$obj.attr("user_id")
          });
        }else{
          newAlert("danger", "Please Set Invoice Setting First.");
          $("#savebill, #savebill_print").removeAttr("disabled");
          $('html, body').animate({scrollTop: 0}, 1000);
          return false;
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
  }

  function partialChartingTemplateModalClose() {
    $(".dd-chart-notes-action").val('select option');
  }

  function dailyDashboardEventBindings(){
    $("#daily_dashboard_parent").on("change","#dd_locations",function(){
      if($("#dd_scheduled_patients_label").hasClass("dd-list-hover")) {
        getTodaysScheduleForDailyDashboard($("#dd_scheduled_patients_label"),"scheduled",$("#dd_locations").val());
      }else if($("#dd_checkedin_patients_label").hasClass("dd-list-hover")) {
        getTodaysScheduleForDailyDashboard($("#dd_checkedin_patients_label"),"checked_in",$("#dd_locations").val());
      }
    });

    $("#daily_dashboard_parent").on("click","#view_edit_partial_charting_template a",function(){
      $("#partial_charting_template_confirm").modal("hide");
    });

    $("#daily_dashboard_parent").on("change",".action_to_patient",function() {
     criticalPatientActions($(this),$state);
    });
    
    $("#add_patient_task_modal").on("click","#save_patient_add_task",function(){
      savePatientTask();
    });

    $("#start_chartnote_model").on("click","#charting_template_default",function(){
      $("#start_chartnote_model").modal("hide"); 
      $("#start_chartnote_model").on("hidden.bs.modal",function(){
        $state.go("patient_charting_templates",{user_id:$("#charting_template_default").attr('user_id'),template_state:"choose"});
      });
    });
    
    $("#start_chartnote_model").on("click","#recently_chatrtion_template",function(){
      $("#start_chartnote_model").modal("hide");
      $("#start_chartnote_model").on("hidden.bs.modal",function(){
        $state.go("patient_charting_templates",{user_id:$("#recently_chatrtion_template").attr('_id'),template_id:$("#recently_chatrtion_template").attr('temp_id'),template_state:"choose"});
      });
    });

    $("#daily_dashboard_parent").on("click",".get-patient-details-dd",function(){
      var user_id = $(this).closest("tr").data("user_id");
      var $obj = $(this);
      $("#dd_edit_profile").html('<a target="_blank" class="hovercolor pointer anchor-color dd_edit_profile" ui-sref="practice_info({user_id:\''+user_id+'\'})">Edit Profile</a>');
      $compile($(".dd_edit_profile"))($scope);
      // $state.go("patientinfo",{user_id:$(this).data("user_id")});
      // $("#dd_edit_profile").data("user_id",user_id);
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
        success:function(data){
          $.couch.db(db).view("tamsa/testPatientsInfo",{
            success:function(meddata){
              $(".get-patient-details-dd").closest("tbody").find("tr").removeClass("warning");
              $obj.closest("tr").addClass("warning");
              if(data.rows.length > 0){
                $("#dd_patient_fname").html(data.rows[0].doc.first_nm);
                $("#dd_patient_lname").html(data.rows[0].doc.last_nm);
                $("#dd_patient_phone").html(data.rows[0].doc.phone);
                if(data.rows[0].doc.gender) $("#dd_patient_gender").html(data.rows[0].doc.gender)
                if(data.rows[0].doc.date_of_birth) $("#dd_patient_date_of_birth").html(data.rows[0].doc.date_of_birth)
                else $("#dd_patient_date_of_birth").html("NA")
                $("#dd_patient_dhp_id").html(data.rows[0].doc.patient_dhp_id);
                if(meddata.rows.length > 0){
                  if(meddata.rows[0].doc.height && meddata.rows[0].doc.weight) $("#dd_patient_bmi").html(calculatePatientBMI(meddata.rows[0].doc.height,meddata.rows[0].doc.weight))
                  else $("#dd_patient_bmi").html("NA")
                }else{
                  $("#dd_patient_bmi").html("NA");
                }
                if(data.rows[0].doc.user_email == "emailnotprovided@digitalhealthpulse.com") $("#dd_patient_email").html("NA")
                else $("#dd_patient_email").html(data.rows[0].doc.user_email)

                if(data.rows[0].doc.imgblob){
                  $(".UserPanelThumpNail").html('<img src="'+data.rows[0].doc.imgblob+'" style="width: 112px;border: 1px solid grey;border-radius:55px;">');
                }else if(data.rows[0].doc._attachments){
                  url = '/'+personal_details_db+'/'+data.rows[0].id+'/'+Object.keys(data.rows[0].doc._attachments)[0];
                  $(".UserPanelThumpNail").html('<img src="'+url+'" style="width: 112px; border: 1px solid grey;border-radius:55px;">');
                }else{
                  $(".UserPanelThumpNail").html('<img src="images/profile-pic.png" style="width: 112px; border: 1px solid grey;border-radius:55px;">');
                }
                $("#default_patient_dd_profile").hide();
                $("#selected_patient_dd_profile").show();
              }else{
                $("#selected_patient_dd_profile").hide();
                $("#default_patient_dd_profile").show();
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
      // $state.go("medical_history",{user_id:$(this).data("user_id")});
    });

    $("#daily_dashboard_parent").on("click","#partial_charting_template_modal_close",function(){
      partialChartingTemplateModalClose();
    });

    $("#daily_dashboard_parent").on("change",".dd-chart-notes-action",function(){
      dailyDashboardChartNotesAction($(this));
    });

    $("#daily_dashboard_parent").on("click",".timeline-toggle",function(){
      timelineToggleDisplay($(this));
    });

    $("#daily_dashboard_parent").on("click",".tl-print-selected",function(){
      // printTimelineRecords($(this));
      getUserDataForTimelineRecordsPrint($(this));
    });

    // $("#daily_dashboard_parent").on("click","#dd_edit_profile",function(){
    //   $state.go("patientinfo",{user_id:$(this).data("user_id")});
    // });
    $("#daily_dashboard_medical_history_modal").on("click","#dd_medical_info_tab_link",function(){
      activateMedicalInfoAtDailyDashboard($(this));
    });

    $("#daily_dashboard_medical_history_modal").on("click","#dd_vital_signs_tab_link",function(){
      activateVitalSignsAtDailyDashboard($(this));
    });

    $("#daily_dashboard_medical_history_modal").on("click","#dd_timeline_tab_link",function(){
      activateTimelineAtDailyDashboard($(this));
    });

    $("#daily_dashboard_medical_history_modal").on("hide.bs.modal",function(){
      $(".dd-telemedicine-action").val("Select Action");
    });

    $("#daily_dashboard_details_modal").on("hide.bs.modal",function(){
      $(".dd-telemedicine-action").val("Select Action");
    });

    $("#daily_dashboard_parent").on("change",".task_list_row", function() {
      changeTaskStatus($(this));
    });
    
    $("#daily_dashboard_parent").on("change","#dd_select_task_type",function(){
      getCurrentTaskForDailyDashboard($(this).val(),$("#dd_select_patient_task").val());
    });

    $("#daily_dashboard_parent").on("change","#dd_select_patient_task",function(){
      getCurrentTaskForDailyDashboard($("#dd_select_task_type").val(),$(this).val());
    });
    
    $("#daily_dashboard_parent").on("change","#dd_telemedicine_health_category",function(){
      getTelemedicineSummaryForDailyDashboard($("#dd_telemedicine_health_category").val());
    });

    $("#daily_dashboard_parent").on("change",".dd-telemedicine-action",function(){
      dailyDashboardTelemedicineAction($(this));
    });

    $("#daily_dashboard_parent").on("click","#dd_scheduled_patients_label",function(){
      getTodaysScheduleForDailyDashboard($(this),"scheduled",$("#dd_locations").val());
    });

    $("#daily_dashboard_parent").on("click","#dd_checkedin_patients_label",function(){
      getTodaysScheduleForDailyDashboard($(this),"checked_in",$("#dd_locations").val());
    });

    $("#daily_dashboard_parent").on("click",".edit_patient_tags",function(){
      editPatientTags($(this));
    });

    $("#daily_dashboard_parent").on("click","#update_patient_tags",function(){
      updatePatientTags();
    });

    $("#daily_dashboard_parent").on("change",".appointment_status",function(){
      changeAppointmentStatus($(this));
    });

    $("#daily_dashboard_parent").on("change",".checked_in_status",function(){
      changeCheckedInStatusAtDailyDashboard($(this));
    });

    $("#daily_dashboard_parent").on("click",".dd_appointment_notes",function(){
      getAppointmentNotesForDailyDashboard($(this).parent().parent().data("index"));
    });

    $("#daily_dashboard_parent").on("click","#save_dd_appointment_notes",function(){
      saveAppointmentNotesForDailyDashboard();
    });
    $("#daily_dashboard_parent").on("click",".dd_condition_flag",function(){
      changePatientConditionInTodayScheduleForDailyDashboard($(this));
    });
  }
});  
