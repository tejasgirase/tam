var d    = new Date();
var pd_data = {};
app.controller("taskManagerController",function($scope,$state,$stateParams,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(data.userCtx.name == null)
         window.location.href = "index.html";
      else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.displayLoggedInUserDetails(pd_data);
            tamsaFactories.pdBack();
            if($stateParams.user_id) {
              $.blockUI();
              redirectToTask($stateParams.user_id, $stateParams.action, $stateParams.attachment_id);
            }else {
              displayTaskManager($stateParams.action);
            }
            tamsaFactories.sharedBindings();  
            $("body").on("click",".task_link", function() {
              redirectToTask($(this).attr("user_id"), $(this).attr("task"), $(this).attr("doc_id"));
            });
          },
          error: function(status) {
            console.log(status);
          }
        });
      }
    }
  });

  function redirectToTask(user_id, task, attachment_id,category,getSearchPatient) {
    $.couch.db(db).view("tamsa/getDoctorSubscribers",{
      success:function(data){
        if(data.rows.length == 0){
          newAlert("danger", "Task can not be given as Patient is not Found in your subscriberList.");
          return false;
        }else{
          if (task == "Appointment") {
            // $(".tab-pane").removeClass("active");
            // $("#home").addClass("active");
            // $("#personal_details_in").addClass("active");
            // $("#appointment_calendar").addClass("active");
            // $("#lab_results_inner").addClass("active");
            // $(".fc-today-button").click();
            //getEvents();
            // $("#appointment_link").click();
            // j(".fc-today-button").click();
            tamsaFactories.getSearchPatient(user_id,"Appointment");
          }
          else if (task == "eRx") {
            tamsaFactories.getSearchPatient(user_id,"eRx");
            // $("#medication_tab_link").click();
          }
          else if (task == "eImaging") {
            tamsaFactories.getSearchPatient(user_id,"eLab");
            // $("#lab_results_link").trigger('click');
            // $("#electronic_lab_imaging_link").trigger('click');
          }
          else if (task == "eLab") {
            tamsaFactories.getSearchPatient(user_id,"eLab");
            // $("#lab_results_link").trigger('click');
            // $("#electronic_lab_ordering_link").trigger('click');
          }else if(task == "Other"){
            tamsaFactories.getSearchPatient(user_id,"Other");
            // $("#lab_results_link").trigger('click');
            // $("#other_doc_link").trigger('click');
          }else if(task == "eLabResults"){
            tamsaFactories.getSearchPatient(user_id,"eLabResults",attachment_id);
          }else if(task == "eImagingResults"){
            tamsaFactories.getSearchPatient(user_id,"eImagingResults",attachment_id);
          }else if(task == "Charting_Template"){
            tamsaFactories.getSearchPatient(user_id,"Charting_Template",attachment_id);
          }
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:[pd_data._id,user_id]
    });
  }

  function setAppointmentFromSubscriber(data,reqdocid,userid){
    var tmpname = data.rows[0].value.first_nm +" "+ data.rows[0].value.last_nm;
    $("#appointment_request_hidden").val(reqdocid).attr("userid",userid).attr("pname",tmpname).attr("pemail",data.rows[0].value.user_email).attr("pphone",data.rows[0].value.phone);
    $state.go("appointments",{user_id:userid,request_id:reqdocid});
  }

  function approveAppointment(index,patientid) {
    var request_doc_id = index;
    var user_id        = patientid;

    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        if(data.rows.length>0){
          $.couch.db(db).view("tamsa/getDoctorSubscribers",{
            success:function(udata){
              if(udata.rows.length > 0){
               setAppointmentFromSubscriber(data,request_doc_id,user_id); 
              }else{
                $.couch.db(db).openDoc(request_doc_id,{
                  success:function(newdata){
                    var d = new Date();
                    $.couch.db(replicated_db).openDoc(newdata.doctor_id,{
                      success:function(ddata){
                        var subscriber_doc = {
                          Designation:     newdata.doctor_designation,
                          Email:           ddata.email,
                          Name:            newdata.doctor_name,
                          Phone:           ddata.phone,
                          Relation:        "Doctor",
                          "Select Report": "All conditions",
                          doctor_id:       newdata.doctor_id,
                          doctype:         "Subscriber",
                          insert_ts:       d,
                          user_id:         newdata.user_id,
                          User_firstname:  newdata.patient_firstname,
                          User_lastname:   newdata.patient_lastname,
                          patient_dhp_id:  newdata.patient_dhp_id,
                          dhp_code:        newdata.dhp_code,
                          frequency:       ""
                        }
                        if($("#subscription_approval_alerts").is(":checked")){
                         subscriber_doc.report_freq = $("#subscription_approval_alerts_option").val();
                        }
                        if($("#subscription_approval_reports").is(":checked")){
                         subscriber_doc.alerts = $("#subscription_approval_reports_frequency").val();
                        } 
                        $.couch.db(db).saveDoc(subscriber_doc,{
                          success:function(subdata){
                            $("#subscriber_alerts_reports_modal").modal("hide");
                            $.couch.db(db).view("tamsa/getRequestList", {
                              success: function(reqdata) {
                                if(reqdata.rows.length > 0){
                                  var updatesubreq = reqdata.rows[0].doc;
                                  updatesubreq.status = "Completed";
                                  $.couch.db(db).saveDoc(updatesubreq,{
                                    success:function(updata){
                                      getRequestList();
                                      setAppointmentFromSubscriber(data,request_doc_id,user_id);
                                    },
                                    error:function(updata,error,reason){
                                      newAlert('danger',reason);
                                      $('html, body').animate({scrollTop: 0}, 'slow');
                                      return false;
                                    }
                                  });
                                }else{
                                  getRequestList();
                                  setAppointmentFromSubscriber(data,request_doc_id,user_id);
                                }
                              },
                              error: function(data,error,reason) {
                                newAlert('danger',reason);
                                $('html, body').animate({scrollTop: 0}, 'slow');
                                return false;
                              },
                              key:[pd_data._id,subscriber_doc.user_id,"subscription_request"],
                              include_docs: true
                            });
                          },
                          error:function(data,error,reason){
                            newAlert('danger',reason);
                            $('html, body').animate({scrollTop: 0}, 'slow');
                            return false;
                          }
                        });
                      },
                      error:function(data,error,reason){
                        console.log(reason);
                      }
                    });
                  },
                  error:function(data,error,reason){
                    newAlert('danger',reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  }
                });
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:[pd_data._id,user_id]
          });
        }else{
          newAlert("danger","No user found with given details.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:user_id
    });
  }

  function displayTaskManager(action){
    if(action && action == "appointment_request") activateRequestList()
    else activateDueTaskList()
    taskManagerEventBindings();
  }

  function activateDueTaskList(){
    $(".tab-pane").removeClass("active");
    $("#task_list, #task_list_tab").addClass("active");
    $("#completed_task_list_tab_link, #request_list_link").removeClass("active");
    $("#task_list_tab_link").addClass("active");
    $("#add_new_task").css("visibility","visible");
    getTaskList();
  }

  function activateCompletedTaskList(){
    $(".tab-pane").removeClass("active");
    $("#task_list, #completed_task_list_tab").addClass("active");
    $("#task_list_tab_link, #request_list_link").removeClass("active");
    $("#completed_task_list_tab_link").addClass("active");
    $("#add_new_task").css("visibility","visible");
    getCompletedTaskList();
  }

  function activateRequestList(){
    $(".tab-pane").removeClass("active");
    $("#task_list, #request_list").addClass("active");
    $("#completed_task_list_tab_link, #task_list_tab_link").removeClass("active");
    $("#request_list_link").addClass("active");
    $("#add_new_task").css("visibility","hidden");
    getRequestList();
  }

  function getRequestList() {
    $.couch.db(db).view("tamsa/getTaskManagerSettings",{
      success:function(tmdata){
        if(tmdata.rows.length > 0) var temp_autoremove_days = tmdata.rows[0].doc.request_autoremove_duration;
        else var temp_autoremove_days = 7;
        $.couch.db(db).list("tamsa/getLatestRequestList", "getRequestList", {
          startkey:[pd_data._id],
          endkey:[pd_data._id,{},{}],
          include_docs: true,
          autoremove_days:temp_autoremove_days
        }).success(function(data){
          if(data.rows.length > 0){
            paginationConfiguration(data,"request_list_pagination",10,displayRequestList);
          }else{
            $("#request_list_table tbody").html('<tr><td colspan="5" style="text-align:center;">No Requests are pending for approval.</td></tr>');
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

  function displayRequestList(start,end,data){
    var request_list_rows = [];
      for (var i=start; i<end; i++){
        if (data.rows[i].doc.doctype == "subscription_request") {
          request_list_rows.push('<tr><td>'+(i+1)+'</td><td>'+data.rows[i].doc.patient_firstname+' '+data.rows[i].doc.patient_lastname+'</td><td>'+data.rows[i].doc.insert_ts.substring(0, 10)+'</td><td>Subscription</td><td class="text-center"><span class="approve_sub label label-warning pointer" request="subscription_request" index="'+data.rows[i].id+'" patient_id="'+data.rows[i].doc.user_id+'">Approve</span><span class="reject-sub-app-request label label-warning pointer" request="subscription_request" index="'+data.rows[i].id+'" patient_id="'+data.rows[i].doc.user_id+'">Reject</span></td></tr>');
        } else {
          if((moment(data.rows[i].doc.appointment_date).diff(moment(), "days")) < 0){
           request_list_rows.push('<tr><td>'+(i+1)+'</td><td>'+data.rows[i].doc.patient_firstname+' '+data.rows[i].doc.patient_lastname+'</td><td>'+data.rows[i].doc.appointment_date+'</td><td>Appointment</td><td class="text-align"><span style="display:inline-block" class="label label-warning">Request Expired</span><div class="mrg-top5"><b>Please contact user </b>');
           if(data.rows[i].doc.patient_phone) request_list_rows.push('<span class="glyphicon glyphicon-earphone">'+data.rows[i].doc.patient_phone+'</span>');
           if(data.rows[i].doc.patient_email) request_list_rows.push('<span class="glyphicon glyphicon-envelope">'+data.rows[i].doc.patient_email+'</span>');
           request_list_rows.push('</div></td></tr>');
          }else{
            request_list_rows.push('<tr><td>'+(i+1)+'</td><td>'+data.rows[i].doc.patient_firstname+' '+data.rows[i].doc.patient_lastname+'</td><td>'+data.rows[i].doc.appointment_date+'</td><td>Appointment</td><td class="text-center"><span class="approve_app label label-warning pointer" request="appointment_request" index="'+data.rows[i].id+'" patient_id="'+data.rows[i].doc.user_id+'">Approve</span><span class="reject-sub-app-request label label-warning pointer" request="appointment_request" index="'+data.rows[i].id+'" patient_id="'+data.rows[i].doc.user_id+'">Reject</span></td></tr>');
          }
        }
      };
    $("#request_list_table tbody").html(request_list_rows.join(''));
  }

  function approveAppointmentAlertsPreference($obj){
    var request_doc_id = $obj.attr("index");
    var user_id        = $obj.attr("patient_id");
    var request_type   = $obj.attr("request");

    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        if(data.rows.length>0){
          $.couch.db(db).view("tamsa/getDoctorSubscribers",{
            success:function(udata){
              if(udata.rows.length == 0){
                $("#subscriber_alerts_reports_modal").modal({
                  show:true,
                  backdrop:'static',
                  keyboard:false
                });
                $("#patient_subscriber_msg").html("Patient is not currently Subscriber, First Patient will be added as a Subscriber. Please Save Preference for receiving Alerts and Reports.");
                $("#approval_subscription_with_preference").attr("requestdoc",request_doc_id).attr("user_id",user_id).attr("request",request_type);  
              }else{
                //approveAppointment(request_doc_id,user_id);
                setAppointmentFromSubscriber(data,request_doc_id,user_id); 
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:[pd_data._id,user_id]
          });
        }else{
          newAlert("danger","No user found with given details.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:user_id
    });
  }
  function approveSubscriptionAlertsPreference($obj) {
    var request_doc_id = $obj.attr("index");
    var user_id        = $obj.attr("patient_id");
    var request_type   = $obj.attr("request");
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        if(data.rows.length>0){
          $.couch.db(db).view("tamsa/getDoctorSubscribers", {
            success: function(data) {
              if(data.rows.length == 0){
                $("#subscriber_alerts_reports_modal").modal({
                  show:true,
                  backdrop:'static',
                  keyboard:false
                });
                $("#patient_subscriber_msg").html("Patient will be added as a Subscriber. Please Save Preference for receiving Alerts and Reports.");
                $("#approval_subscription_with_preference").attr("requestdoc",request_doc_id).attr("user_id",user_id).attr("request",request_type);
              }else{
                newAlert("danger","Already added to subscribers");
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;      
              }
            },
            error:function(data,error,reason){
              newAlert("danger", reason);
            },
            key:[pd_data._id,user_id] // user_id
          });
        }else{
          newAlert("danger","No user found with given details.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:user_id,
    });
  }

  function approveSubscription(index,patientid) {
    var request_doc_id = index;
    var user_id        = patientid;

    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        if(data.rows.length>0){
          $.couch.db(db).view("tamsa/getDoctorSubscribers", {
            success: function(data) {
              if (data.rows == 0) {
                $.couch.db(db).openDoc(request_doc_id,{
                  success:function(data){
                    var newdata = data;
                    var d = new Date();
                    $.couch.db(replicated_db).openDoc(data.doctor_id,{
                      success:function(ddata){
                        var subscriber_doc = {
                          Designation:     data.doctor_designation,
                          Email:           ddata.email,
                          Name:            ddata.first_name + " " + ddata.last_name,
                          Phone:           ddata.phone,
                          Relation:        "Doctor",
                          "Select Report": "All conditions",
                          doctor_id:       data.doctor_id,
                          doctype:         "Subscriber",
                          insert_ts:       d,
                          user_id:         data.user_id,
                          User_firstname:  data.patient_firstname,
                          User_lastname:   data.patient_lastname,
                          patient_dhp_id:  data.patient_dhp_id,
                          dhp_code:        data.dhp_code,
                          frequency:       ""
                        }
                        if($("#subscription_approval_alerts").is(":checked")){
                          subscriber_doc.report_freq = $("#subscription_approval_alerts_option").val();
                        }
                        if($("#subscription_approval_reports").is(":checked")){
                          subscriber_doc.alerts = $("#subscription_approval_reports_frequency").val();
                        }
                        $.couch.db(db).saveDoc(subscriber_doc,{
                          success:function(data){
                            newdata.status = "Completed";
                            $.couch.db(db).saveDoc(newdata,{
                              success:function(data){
                                newAlert('success','Subscriber added successfully.');
                                $('html, body').animate({scrollTop: 0}, 'slow');
                                $("#subscriber_alerts_reports_modal").modal("hide");
                                getRequestList();
                              },
                              error:function(data,error,reason){
                                newAlert('danger',reason);
                                $('html, body').animate({scrollTop: 0}, 'slow');
                                return false;    
                              }
                            });
                          },
                          error:function(data,error,reason){
                            newAlert('danger',reason);
                            $('html, body').animate({scrollTop: 0}, 'slow');
                            return false;
                          }
                        });
                      },
                      error:function(data,error,reason){
                        console.log(reason);
                      }
                    });
                  },
                  error:function(data,error,reason){
                    newAlert('danger',reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  }
                });
              }
              else {
                newAlert("danger", "Already added to subscribers");
              }
            },
            error:function(data,error,reason){
              newAlert("danger", reason);
            },
            key:[pd_data._id,user_id] // user_id
          });
        }else{
          newAlert("danger","No user found with given details.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:user_id
    });
  }

  function rejectSubAppRequest($obj){
    $.couch.db(db).openDoc($obj.attr("index"),{
      success:function(data){
        var newdata = data;
        newdata.status = "Rejected"
        $.couch.db(db).saveDoc(newdata,{
          success:function(data){
            $("#request_list_link").click();
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
          }
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    });
  }
  
  function taskManagerEventBindings(){
    $("#task_list").on("change","#subscription_approval_alerts",function(){
      if(this.checked){
        $("#subscription_approval_alerts_option_parent").show();
      }else{
        $("#subscription_approval_alerts_option_parent").hide();
      }
    });

    $("#task_list").on("change","#subscription_approval_reports",function(){
      if(this.checked){
        $("#subscription_approval_reports_frequency_parent").show();
      }else{
        $("#subscription_approval_reports_frequency_parent").hide();
      }
    });

    $("#task_list").on("click","#approval_subscription_with_preference",function(){
      if($(this).attr("request") == "subscription_request"){
        approveSubscription($(this).attr("requestdoc"),$(this).attr("user_id"));
      }else{
        approveAppointment($(this).attr("requestdoc"),$(this).attr("user_id"));
      }
    });

    $("#task_list").on("click","#completed_task_list_tab_link",function(){
      activateCompletedTaskList();
    });

    $("#task_list").on("click","#task_list_tab_link",function(){
      activateDueTaskList();
    });

    $("#task_list").on("click","#request_list_link",function(){
      activateRequestList();  
    }); 

    $("#task_list").on("click","#add_new_task",function(){
      openAddNewTask();
    });

    $("#task_list").on("click","#save_new_task",function(){
      saveNewTask();
    });

    $("#request_list_table").on("click", ".approve_sub", function() {
      approveSubscriptionAlertsPreference($(this));
    });

    $("#request_list_table").on("click", ".approve_app", function() {
      approveAppointmentAlertsPreference($(this));
    });

    $("#request_list_table").on("click", ".reject-sub-app-request", function() {
      rejectSubAppRequest($(this));
    });
    
    $("#task_list").on("change",".task_list_row", function() {
      changeTaskStatus($(this));
    });

  }
});
