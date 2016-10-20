var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};
// app.controller("patientAppointmentsController",function($scope,$state,$stateParams){
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientAppointments);
// });


app.controller("patientAppointmentsController",function($scope,$state,$stateParams,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(!data) window.location.href = "index.html";
      else {
        pd_data = data;
        $scope.level = data.level;
        $scope.$apply();
        tamsaFactories.displayLoggedInUserDetails(pd_data);
        tamsaFactories.sharedBindings();
        tamsaFactories.displayDoctorInformation(data);
        if($stateParams.request_id) {
          activateRequestForPatientAppointments($stateParams.request_id);
          tamsaFactories.pdBack();
          $("#appointment_calendar").on("click",".back_to_request_approval_list", function() {
            $state.go("task_manager");
          });
        }else if($stateParams.user_id) {
        	tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientAppointments);
        }else  {
        	displayDashboardAppointments();
          tamsaFactories.pdBack();
        }
        $.unblockUI();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });

  function activateRequestForPatientAppointments(reqdocid){
    $(".tab-pane").removeClass("active");
    $("#appointment_calendar").addClass("active");
    $("#muliptle_doctors_list_parent").hide();
    $("#muliptle_doctors_list option").remove();
    $("#appointment_hidden_flag").attr("value","general");
    var temp_resources =  [{ id: pd_data._id, title: 'Dr. '+ pd_data.first_name}];
    multipleDoctorList();
    InitializeAppointmentCalendar($("#appointment_link"),temp_resources,"agendaWeek");
    eventBindingsForPatientAppointments();
    $.couch.db(db).openDoc(reqdocid,{
      success:function(data){
        var goto_date = moment(data.appointment_date); 
        $('#calendar').fullCalendar('changeView', 'agendaDay');
        $('#calendar').fullCalendar('gotoDate',goto_date);
        $("#appointment_back").removeClass("pd_back").addClass("back_to_request_approval_list");
        $(".fc-month-button, .fc-agendaWeek-button, .fc-prev-button, .fc-next-button, .fc-today-button").hide();
        $(".fc-agendaDay-button").addClass("fc-corner-left");
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function displayDashboardAppointments(){
    $(".tab-pane").removeClass("active");
    $("#appointment_calendar").addClass("active");
    $("#muliptle_doctors_list_parent").hide();
    $("#muliptle_doctors_list option").remove();
    $("#appointment_hidden_flag").attr("value","general");
    var temp_resources =  [{ id: pd_data._id, title: 'Dr. '+ pd_data.first_name}];
    multipleDoctorList();
    InitializeAppointmentCalendar($("#appointment_link"),temp_resources,"agendaWeek");
    eventBindingsForPatientAppointments();
  }

  function activatePatientAppointments(){
    $(".menu_items").removeClass("active");
    $("#appointment_link").parent().addClass('active');
    $("#appointment_hidden_flag").attr("value","user");  
    initializePatientAppointment();
    eventBindingsForPatientAppointments();
  }

  function initializePatientAppointment(){
    $("#muliptle_doctors_list_parent").hide();
    $("#muliptle_doctors_list option").remove();
    var temp_resources =  [{ id: pd_data._id, title: 'Dr. '+ pd_data.first_name}];
    multipleDoctorList();
    InitializeAppointmentCalendar($("#appointment_link"),temp_resources,"agendaWeek");
  }

  function eventBindingsForPatientAppointments(){
    searchDHPDoctorsList("fd_appointment_physician_list",autocompleterSelectForDoctorsList,pd_data.dhp_code);
    $("#appointment_calendar").on("click","#save_block_time",function(){
      saveBlockTimeDay();
    });

    $("#appointment_calendar").on("click",".fc-next-button, .fc-prev-button, .fc-today-button",function(){
      toggleBlockAllDayCheckbox($(this));
    });

    $("#appointment_calendar").on("click",".block-all-day",function(){
      openModalForAllDayBlock($(this));
    });

    $("#block_time_day_modal").on("hide.bs.modal",function (e){
      clearBlockTimeDayModal();
    });

    $("#appointment_calendar").on("click","#remove_blocked_time",function(){
      removeBlockedTime();
    });

    $('#createEventModal').on('shown.bs.modal', function (e) {
      if($("#appointment_request_hidden").val()){
        var userid = $("#appointment_request_hidden").attr("userid");
        var pname  = $("#appointment_request_hidden").attr("pname");
        var pphone = $("#appointment_request_hidden").attr("pphone");
        var pemail = $("#appointment_request_hidden").attr("pemail");
        $("#search_patient_for_appointment").val(pname).attr("readonly","readonly").attr("userid", userid);
        $("#patient_email_appointment").val(pemail).attr("readonly","readonly");
        $("#patient_phone_appointment").val(pphone).attr("readonly","readonly");
      }
      $('.appointment-popover').remove();
      $("#addNewPatient").attr("checked",false);
      $(".patient-add-new").hide();
    });

    $('#createEventModal').on('show.bs.modal', function (e) {
      $.fn.modal.Constructor.prototype.enforceFocus = function () { };
    });

    $("#appointment_calendar").on("click",".fc-agendaDay-button",function(){
      getDHPDoctorsforMultipleCalendar();
    });

    $("#appointment_calendar").on("click",".fc-agendaWeek-button, .fc-month-button",function(){
      getEventsForAgendaWeekAndMonth();
    });

    $("#search_patient_for_appointment").autocomplete({
      search: function(event, ui) { 
         $("#search_patient_for_appointment").addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/testPatients", {
          success: function(data) {
            response(data.rows);
            $("#search_patient_for_appointment").removeClass('myloader');
          },
          error: function(status) {
            console.log(status);
          },
          startkey: [pd_data._id, request.term],
          endkey: [pd_data._id, request.term + "\u9999",{}],
          reduce:true,
          group:true,
          limit: 5,
        });
      },
      focus: function(event, ui) {
        if(ui.item.key[1] == "No results found"){
          return false;
        }else{
          $("#search_patient_for_appointment").val(ui.item.key[1]);
          return false;
        }
      },
      minLength: 1,
      select: function( event, ui ) {
        if(ui.item.key[1] == "No results found"){
          $("#search_patient_for_appointment").val("");
          return false;
        }else{
          $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
            success: function(data) {
              if(data.rows.length > 0){
                $("#search_patient_for_appointment").val(data.rows[0].value.first_nm + " " + data.rows[0].value.last_nm);
                $("#search_patient_for_appointment").attr("userid",data.rows[0].value.user_id);
                $("#patient_phone_appointment").val(data.rows[0].value.phone).attr("readonly","readonly");
                $("#patient_email_appointment").val(data.rows[0].value.user_email).attr("readonly","readonly");
              }else{
                console.log("remove sibscriber::" + ui.item.key[2]);
              }
            },
            error: function(status) {
              console.log(status);
            },
            key: ui.item.key[2]
          }); 
        }
        //$("#search_patient_for_appointment").addClass('myloader');
        return false;
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { key: ['','No results found',''],label:"No results found" };
          ui.content.push(noResult);
          //$("#message").text("No results found");
        }
      },
      open: function() {
        //$("#search_patient_for_appointment").removeClass('myloader');
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    }).
    data("uiAutocomplete")._renderItem = function(ul, item) {
      if (item.key[1] == "No results found") {
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>" + item.key[1] + "</a>")
          .appendTo(ul);
      }
      else {
        getAutoCompleteImages(item.key[2],"search_patient_for_appointment_pic_");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a><img class='img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='search_patient_for_appointment_pic_"+item.key[2]+"'>  " + item.key[1] + "</a>")
          .appendTo(ul);
      }
    };

    $("#appointment_calendar").on("click","#print_appointment",function() {
      printSelectedAppointment();
    });
    
    $("#appointment_calendar").on("click","#print_calendar",function(){
      $('#print_calendar_modal').modal({
        show:true,
        backdrop:'static',
        keyboard:false
      });
      //printAppointment();
    });

    $("#createEventModal").on("click","#removeAppointment",function(){
      removeAppointment();
    });

    $("#createEventModal").on("change","#addNewPatient",function(){
      // $("#add_patient_document_modal").modal('show');
      toggleAddNewPatient($(this));
    });

    $("#createEventModal").on("click","#toggle_email_id",function(){
      toggleEmailIdPatient($(this));  
    }); 


    $("#createEventModal").on("click","#submitButton",function(){
      saveAppointment();
    });

    $("#appointment_calendar").on("click","#is_block_time_day",function(){
      displayBlockTimeDayMessage();
    });

    $("#createEventModal").on("change","#is_repeat",function(){
      isRepeatAppointment($(this));
    });

    $("#appointment_calendar").on("show.bs.modal","#recurring_appointment_update_modal",function(e){
      resetRecurringAppointmentUpdateModal();
    });

    $("#appointment_calendar").on("click","#update_recurring_appointment",function(){
      updateRecurringAppointment();
    });
    
    $("#appointment_calendar").on("click",".cmn-recur",function(){
      setRecurringValue($(this));
    });

    $("#appointment_calendar").on("click",".close_recurring_appointment_modal",function(){
      closeRecurringAppointmentModal();
    });

    $("#appointment_calendar").on("change","#rpt_end_day",function(){
      toggleRecurringEndDate($(this));    
    });

    $("#appointment_calendar").on("change","#rpt_appoitment_type",function(){
      toggleRecurringCountParent($(this).val());
    });

    $("#appointment_calendar").on("click","#appointment_summary",function(){
      openAppointmentSummaryModal();
    });
    
    $("#createEventModal").on("hide.bs.modal",function(e){
      $("#color_code_value:first-child").css("background-color","#5bc0de");
      $("#color_code_value:first-child").css("border-color","#5bc0de");
      $("#color_code_value:first-child").text("Select Preference");
      $('.appointment-popover').remove();
    });

    $("#createEventModal").on("click","#color_code_dropdown li a",function(){
      $("#color_code_value:first-child").text($(this).text());
      $("#color_code_value:first-child").val($(this).text());
      $("#color_code_value:first-child").css("background-color",$(this).attr("backcolor"));
    });
  }

  function toggleAddNewPatient($obj){
    if($("#addNewPatient").prop("checked")) {
      $(".patient-add-new").show();
      $(".patient-add-hide").hide();
    }else{
      $(".patient-add-new").hide();
      $(".patient-add-hide").show();
    }
  }

  function toggleEmailIdPatient($obj){
    if($obj.html() == "not Having EmailId."){
      $obj.html("Having Emailid.");
      $("#fd_appointment_patient_email").val("emailnotprovided@digitalhealthpulse.com").attr("readonly","readonly");
    }else{
      $obj.html("not Having EmailId.");
      $("#fd_appointment_patient_email").val("").removeAttr("readonly");
    }
  }

  //appointment js code starts
  function InitializeAppointmentCalendar($obj,resource_array,dview){
    var resource_id = "";
    for(var i=0;i<resource_array.length;i++){
      if(i != 0) resource_id += "|"
      resource_id += resource_array[i].id;
    }
    $('#calendar').fullCalendar("destroy");
    $.couch.db(db).view("tamsa/getCommunicationSettings",{
      success:function(data){
        if(data.rows.length > 0){
          var duration = data.rows[0].doc.calender_setting.exam_increment;
          var overlap = data.rows[0].doc.calender_setting.appointment_overlap;
        }else{
          var duration = 30;
          var overlap = false;
        }
        var calendar = $('#calendar').fullCalendar({
          schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
          header:
          {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          
          defaultView: dview,
          allDaySlot: false,
          selectable: true,
          selectHelper: true,
          editable: true,
          slotDuration: "00:"+duration+":00",
          resources: resource_array,
          events: [],
          columnFormat: "ddd YYYY-MM-DD",
          eventOverlap:overlap,
          eventRender: function(event){
            if(event.ranges){
              return (event.ranges.filter(function(range){ // test event against all the ranges

                  return (event.start.isBefore(range.end) &&
                          event.end.isAfter(range.start));

              }).length)>0; //if it isn't in one of the ranges, don't render it (by returning false)
            }else{
              return true;
            }
          },
          aspectRatio: 2,
          timezone:'local',
          eventDrop: function dropEvent(event, delta, revertFunc, jsEvent, ui, view) {
            editEvent(event, delta, revertFunc);
          },
          eventResize: function resizeEvent(event, delta, revertFunc) {
            editEvent(event, delta, revertFunc);
          },
          eventMouseover: function(calEvent, jsEvent) {
            $('.appointment-popover').remove();
            if(calEvent.user_id){
              if($("#createEventModal").css("display") == "none"){
                $obj = $(this);
                $body = $("body");
                $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
                  success:function(data){
                    if(data.rows.length == 1){
                      var top_offset  = jsEvent.pageY + 30;
                      if(jsEvent.pageX>800){
                        var left_offset = jsEvent.pageX - 500;
                      }else{
                        var left_offset = jsEvent.pageX - 300;
                      }
                      var url,age_with_dob;
                      if(data.rows[0].value._attachments){
                        url = $.couch.urlPrefix+'/'+personal_details_db+'/'+data.rows[0].id+'/'+Object.keys(data.rows[0].value._attachments)[0];
                      }else{
                        url = "images/userpic.png";
                      }
                      if(data.rows[0].value.date_of_birth){
                        age_with_dob = data.rows[0].value.age +" ("+data.rows[0].value.date_of_birth+")";
                      }else{
                        age_with_dob = data.rows[0].value.age;
                      }

                      var tooltip = '<div style="position: absolute; opacity: 1.9; z-index: 1000; border: 1px solid grey; border-width: 1px 1px 3px; height: auto; border-radius: 5px;top:'+ top_offset +';left:'+left_offset+'; width: 500px;" class="appointment-popover"><div class="arrow"></div><h3 class="popover-title">'+ calEvent.title +'</h3><div class="popover-content col-lg-12" style="background-color: white;"><div class="col-lg-3 col-md-12"><img src="'+url+'" alt="Logo" title="'+data.rows[0].value.first_nm + " "+  data.rows[0].value.last_nm+'" style="width: 60px; height: 60px;"></div><div class="col-lg-9 col-md-12"><div>'+data.rows[0].value.first_nm + " "+  data.rows[0].value.last_nm+'</div><div>'+age_with_dob+'</div><div>'+data.rows[0].value.user_email+'</div><div>'+data.rows[0].value.phone+'</div></div><div class="col-lg-12 col-md-12" style="padding-left:0px;"><h4 class="theme-color  col-lg-6" style="border-bottom: 1px dotted grey;">Appointment Details</h4><h4 style="border-bottom: 1px dotted grey;" class="theme-color col-lg-6"><span class="pull-right">Location:<span class="theme-green theme-bold">'+(calEvent.location ? calEvent.location: pd_data.city)+'</span></span></h4><div><span class="theme-color">Dr. &nbsp;</span>'+pd_data.first_name + " "+  pd_data.last_name+'</div><div><span class="theme-color">Time:: &nbsp;</span> '+calEvent.start.format("DD-MM-YYYY")+', '+calEvent.start.format("hh:mma")+' to '+calEvent.end.format("hh:mma")+'</div>';

                      if(calEvent.tentative){
                        tooltip += '<div><span class="theme-color">This Appointment is Tentative &nbsp;</span></div></div></div>';
                      }else{
                        tooltip += '</div></div>';
                      }

                      // var tooltip = '<div class="appointment-popover" style="width: 300px; position: absolute; opacity: 1.9; z-index: 1000; border: 1px solid grey; height: auto; border-radius: 5px;top:'+ top_offset +';left:'+left_offset+';"><div class="arrow"></div><h3 class="popover-title">'+ calEvent.title +'</h3><div class="popover-content" style="background-color: white;"><h4 class="theme-color" style="border-bottom: 1px dotted grey;">Patient Details</h4><div><span class="theme-color">Name:: &nbsp;</span>'+data.rows[0].value.first_nm + " "+  data.rows[0].value.last_nm+'</div><div><span class="theme-color">Email::&nbsp;</span>'+data.rows[0].value.user_email+'</div><div><span class="theme-color">Phone::&nbsp;</span>'+data.rows[0].value.phone+'</div><h4 class="theme-color" style="border-bottom: 1px dotted grey;">Appointment Details</h4><div><span class="theme-color">Dr. &nbsp;</span>'+pd_data.first_name + " "+  pd_data.last_name+'</div><div><span class="theme-color">Time:: &nbsp;</span> '+calEvent.start.format("DD-MM-YYYY")+', '+calEvent.start.format("hh:mma")+' to '+calEvent.end.format("hh:mma")+'</div></div></div>';
                      $body.append(tooltip);
                      $obj.mouseover(function(e) {
                        $(this).css('z-index', 10000000);
                        $('.appointment-popover').fadeIn('500');
                        $('.appointment-popover').fadeTo('10', 1.9);
                      }).mousemove(function(e) {
                        if(jsEvent.pageX>800){
                          var left_offset = e.pageX - 500;
                        }else{
                          var left_offset = e.pageX - 300;
                        }
                        $('.appointment-popover').css('top', e.pageY + 30);
                        $('.appointment-popover').css('left', left_offset);
                      });
                    }else{
                      console.log("multiple user with same user id");
                    }
                  },
                  error:function(data,error,reason){

                  },
                  key:calEvent.user_id
                });  
              }  
            }
          },
          eventMouseout: function(calEvent, jsEvent) {
            setTimeout(function (){$('.appointment-popover').remove();}, 1000);
          },
          select: function(start, end, jsevent,view,resource){
            var today     = moment();
            var endtime   = end.format("Do MMMM YYYY, h:mm a");
            var starttime = start.format("Do MMMM YYYY, h:mm a");

            if(start.isBefore(moment())){
              newAlert("danger","You can not Book Appointment for past dates.");
              $('html, body').animate({scrollTop: $("#calendar").offset().top}, 'slow');
              $("#calendar").fullCalendar('unselect');
            }else{
              // TODO ::is block time of the day
              if($("#is_block_time_day").prop("checked")){
                openBlockTimeDayModal(resource);
                $("#remove_blocked_time").hide();
                $('#block_time_day_modal #block_start_time').val(start.utc());
                $('#block_time_day_modal #block_end_time').val(end.utc());
                var mywhen = starttime + ' - ' + endtime;
                $('#blocked_duration').text(mywhen);
                $("#save_block_time").data("index","");
                $("#save_block_time").data("rev","");
                if ($("#appointment_hidden_flag").attr("value") == "user") {
                  $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent,#location_appointment_parent,#add_new_patient_box").hide();
                }
                else {
                  $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent,#location_appointment_parent,#add_new_patient_box").show();
                }
              }else{
                $('#createEventModal').modal('show');
                $('#createEventModal #apptStartTime').val(start.utc());
                $('#createEventModal #apptEndTime').val(end.utc()); 
                if(resource){
                  $("#removeAppointment").data("associated_resource",resource.id);
                }else{
                  $("#removeAppointment").data("associated_resource",pd_data._id);
                }
                var mywhen = starttime + ' - ' + endtime;
                $('#createEventModal #when').text(mywhen);
                $("#submitButton").data("index","").data("rev","").html("Save");
                $("#search_patient_for_appointment").val("").removeAttr("readonly");
                $("#patient_email_appointment").val("").removeAttr("readonly");
                $("#patient_phone_appointment").val("").removeAttr("readonly");
                $("#removeAppointment, #remove_preference").hide();
                $("#myModalLabel1").html("Create Appointment");
                if($("#is_repeat").prop("checked")) $("#is_repeat").trigger("click")
                $("#rpt_start_day, #rpt_end_val, #reminder_note").val("");
                if ($("#appointment_hidden_flag").attr("value") == "user") {
                  $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent,#location_appointment_parent,#add_new_patient_box").hide();
                }
                else {
                  $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent,#location_appointment_parent,#add_new_patient_box").show();
                }
                getConsultanListInAppointment();
                getServicesAndMicsDocuments("","","micsdoc_view","servicedoc_view");
                tamsaFactories.selectLocationForAppointment("location_appointment",pd_data.city);
              }
            }
          },
          eventClick: function(event, element) {
            if(event._start.isBefore(moment())){
              newAlert("danger","You can not update Appointments from past dates.");
              $('html, body').animate({scrollTop: $("#calendar").offset().top}, 'slow');
              return false;
            }else{
              $('.appointment-popover').remove();
              if(event.backgroundColor == "black"){
                openBlockTimeDayModal();
                $('#block_time_day_modal #block_start_time').val(event.start);
                $('#block_time_day_modal #block_end_time').val(event.end);
                // var mywhen = moment($obj.parent().text()).format("DD MM YYYY hh:mm:ss a") + ' - ' + moment($obj.parent().text()).format("DD MM YYYY hh:mm:ss a");
                $('#blocked_duration').html(moment(event.start).format("YYYY-MM-DD") + "&nbsp;<b style='color:black !important;'>(Full Day)</b>");
                $("#reason_for_block_time_day").val(event.title);
                $("#remove_blocked_time").show();
                $("#save_block_time").data("index",event._id);
                $("#save_block_time").data("rev",event.rev);
              }else{
                // $('#createEventModal #apptStartTime').val(start.utc());
                // $('#createEventModal #apptEndTime').val(end.utc());
                // console.log(event._start.utc());
                $('#createEventModal #apptStartTime').val(event._start);
                var starttime  = event._start.format('Do MMMM YYYY, h:mm a');
                if (event._end) {
                  $('#createEventModal #apptEndTime').val(event._end);
                  endtime = event._end.format('Do MMMM YYYY, h:mm a');
                }
                else {
                  $('#createEventModal #apptEndTime').val(event._start);
                  endtime = event._start.format('Do MMMM YYYY, h:mm a');
                }
                var mywhen = starttime + ' - ' + endtime;
                $("#color_code_value:first-child").css("background-color",event.backgroundColor);
                if(event.tentative){
                  $("#color_code_value:first-child").css("border-color","#ffff00");
                }else{
                  $("#color_code_value:first-child").css("border-color",event.borderColor);  
                }
                $("#color_code_value:first-child").text(event.color_preference);
                $('#createEventModal #when').text(mywhen);
                tamsaFactories.selectLocationForAppointment("location_appointment",event.location);
                $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
                  success: function(data) {
                    if(data.rows.length > 0){
                      if(event.master_recurring_id){
                        getConsultanListInAppointment(event.consultant_id);
                        $("#is_repeat").prop("checked",true).trigger("change");
                        $.couch.db(db).openDoc(event.master_recurring_id,{
                          success:function(mdata){
                            $("#rpt_appoitment_type").val(mdata.repeat_type).trigger("change");
                            $("#rpt_start_day").val(mdata.start_date);
                            $("#rpt_end_day").val(mdata.end_type).trigger("change");

                            if(mdata.repeat_type == "Daily") $("#rpt_count_days").val(mdata.repeat_every);
                            if(mdata.repeat_type == "Weekly"){
                              for(var i=0;i<mdata.repeat_every.length;i++){
                                $(".weekly_repeat").filter("value='"+mdata.repeat_every[i]+"'").prop("checked",true);
                              }
                            }
                            if(mdata.repeat_type == "Monthly"){
                              $("input[name='monthly_repeat'][value='"+mdata.repeat_every+"']").prop('checked', true); 
                            }
                            if(mdata.end_type == "On"){
                              $("#rpt_end_val").val(mdata.end_val).show();
                              $("#rpt_end_after_val").hide();
                            }else{
                              $("#rpt_end_val").hide();
                              $("#rpt_end_after_val").val(mdata.end_val).show();
                            }
                            $("#createEventModal").modal('show');                          
                            $("#removeAppointment").data("del_index",event.id).data("del_rev",event.rev).show();
                            $("#removeAppointment").data("master_recurring_id",event.master_recurring_id);
                            $("#removeAppointment").data("associated_resource",event.doctor_id);
                            $("#remove_preference").show();
                            $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent").show();
                            $("#search_patient_for_appointment").val(data.rows[0].value.first_nm +" "+ data.rows[0].value.last_nm).attr("readonly","readonly").attr("userid", data.rows[0].value.user_id);
                            $("#patient_email_appointment").val(data.rows[0].value.user_email).attr("readonly","readonly");
                            $("#patient_phone_appointment").val(data.rows[0].value.phone).attr("readonly","readonly");
                            $("#submitButton").data({
                              "index":event.id,
                              "rev":event.rev
                            }).html("Update");
                            $("#myModalLabel1").html("Update Appointment");
                            $("#reminder_note").val(event.title);
                          },
                          error:function(mdata,error,reason){
                            console.log(reason);
                          }
                        });
                      }else{
                        getConsultanListInAppointment(event.consultant_id);
                        getServicesAndMicsDocuments(event.hospital_document,event.service_name,"micsdoc_view","servicedoc_view");
                        clearAppointmentRepeatData();
                        $("#createEventModal").modal('show');
                        $("#add_new_patient_box").hide();
                        $("#removeAppointment").data("del_index",event.id).data("del_rev",event.rev).show();
                        $("#removeAppointment").data("master_recurring_id","");
                        $("#removeAppointment").data("associated_resource",event.doctor_id);
                        $("#remove_preference").hide();
                        $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent").show();
                        $("#search_patient_for_appointment").val(data.rows[0].value.first_nm +" "+ data.rows[0].value.last_nm).attr("readonly","readonly").attr("userid", data.rows[0].value.user_id);
                        $("#patient_email_appointment").val(data.rows[0].value.user_email).attr("readonly","readonly");
                        $("#patient_phone_appointment").val(data.rows[0].value.phone).attr("readonly","readonly");
                        $("#submitButton").data("index",event.id).data("rev",event.rev).html("Update");
                        $("#myModalLabel1").html("Update Appointment");
                        $("#reminder_note").val(event.title);
                      }
                    }else{
                      newAlert('error', "No data found");
                      $('html, body').animate({scrollTop: 0}, 'slow');
                    }
                  },
                  error: function(status) {
                    console.log(status);
                  },
                  key: event.user_id
                });  
                $('#calendar').fullCalendar('updateEvent', event);
              }
            }
          }
        });
        $('#calendar').fullCalendar('option', 'contentHeight', 1070);        
        $(".tab-pane").removeClass("active");
        $("#home").addClass("active");
        $("#personal_details_in").addClass("active");
        $("#appointment_calendar").addClass("active");
        $("#lab_results_inner").addClass("active");
        $(".fc-today-button").trigger("click");
        // if($obj){
        //   if($obj.attr("id") == "view_schedule"){
        //     userinfo = {};
        //     $("#appointment_back").removeClass("back_to_critical_list").addClass("pd_back").show();
        //     $("#appointment_hidden_flag").attr("value","general");
        //   }else{
        //     $("#appointment_back").hide();
        //     $("#appointment_hidden_flag").attr("value","user");
        //   }
        // }
        getEvents(resource_id);
        $("#calendar").find(".fc-right").prepend('<div><input id="is_block_time_day" type="checkbox" class="checkshow"> Block Time/Day</div>');
        $("#calendar").find(".fc-toolbar").append('<div class="fc-center mrgtop1"><span class="glyphicon glyphicon-stop mrgright"></span><span>Showing Blocked Time. You can not book appointment during this Time.</span></div>');
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:pd_data.dhp_code,
      include_docs:true
    });
  }

  function clearAppointmentRepeatData(){
    $("#rpt_appoitment_type").val("Daily").trigger("change");
    $("#rpt_start_day").val("");
    $("#rpt_end_day").val("On").trigger("change");
    $("#rpt_count_days").val("1");
    $(".weekly_repeat").prop("checked",false);
    $("#rpt_end_val").val("");
    $("#rpt_end_after_val").val("");
  }

  function editEvent(event, delta, revertFunc) {
    if(event.start.isBefore(moment())){
      newAlert("danger","You can not Book Appointment for past dates.");
      $('html, body').animate({scrollTop: $("#calendar").offset().top}, 'slow');
      revertFunc();
      return false;
    }else{
      $("#createEventModal").modal('hide');
      if($("#loading_image").length == 0){
        $('body').append('<div id="loading_image" style="z-index: 9999; border: medium none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background-color: rgb(0, 0, 0); opacity: 0.6; cursor: wait; position: fixed;" class="blockUI blockOverlay"><div style="z-index: 1011; position: fixed; padding: 0px; margin: 0px; width: 30%; top: 40%; left: 35%; text-align: center; color: rgb(0, 0, 0); cursor: wait;" class="blockUI blockMsg blockPage"><h3 style="height:auto;font-size:15px;color:#FF9108;margin:0px;margin-bottom:4px;padding:0px;"><br><img style="padding:0px; margin:0px;" alt="" title="Loading..." src="images/ajax-loader-large.gif"><br></h3></div></div>');  
      }
      if(event.master_recurring_id){
        $('#loading_image').remove();
        $("#recurring_appointment_update_modal").modal({
          show:true,
          backdrop:'static',
          keyboard:false
        });
        $("#update_recurring_appointment").data("associated_resource",event.resourceId);
        $("#update_recurring_appointment").data({
          "event":event,
          "delta":delta,
          "revertFunc":revertFunc
        });
      }else{
        var remend = event.end ? event.end.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ") : event.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
        var remstart = event.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");

        remstart = [remstart.slice(0, 25), "GMT", remstart.slice(25)].join('');
        remend   = [remend.slice(0, 25), "GMT", remend.slice(25)].join('');

        $.couch.db(db).openDoc(event.id, {
          success: function(data) {
            var d = new Date();
            var doc = {
              _id:               event.id,
              _rev:              data._rev,
              insert_ts:         event.insert_ts,
              doctype:           "Appointments",
              reminder_start:    remstart,
              reminder_note:     event.title,
              reminder_end:      remend,
              reminder_type:     "Alerts",
              user_id:           event.user_id,
              notification_type: "Appointment",
              status:            event.status ? event.status:"scheduled",
              read_receipt:      "N",
              doctor_id:         event.resourceId,
              dhp_code:          event.dhp_code?event.dhp_code:"",
              color_code:        event.backgroundColor?event.backgroundColor:"#378006",
              color_preference:  event.color_preference?event.color_preference:"Select Preference",
              tentative:         event.tentative,
              consultant_id:     event.consultant_id,
              hospital_document: event.hospital_document?event.hospital_document:"",
              service_name:      event.service_name?event.service_name:"",
              service_documents: event.service_documents?event.service_documents:"",
              location:          event.location?event.location:pd_data.city
            };
            $.couch.db(db).saveDoc(doc, {
              success: function(data) {
                var cron_record = {
                  doctype:        "cronRecords",
                  processed:      "No",
                  appointment_id: event.id, 
                  operation_case: 19
                }
                if (event.start < d) {
                  var temp_view = $('#calendar').fullCalendar('getView');
                  if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
                  else getEvents(event.resourceId)
                  getTodaysAppointments();
                  $('#loading_image').remove();
                }
                else {
                  $.couch.db(db).saveDoc(cron_record, {
                    success: function(data) {
                      var temp_view = $('#calendar').fullCalendar('getView');
                      if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
                      else getEvents(event.resourceId)
                      getTodaysAppointments();
                      $('#loading_image').remove();
                    },
                    error: function(data,error,reason) {
                      newAlert('error', reason);
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      $('#loading_image').remove();
                    }
                  });
                }
              },
              error: function(data,error,reason) {   
                newAlert('error', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                $('#loading_image').remove();
              }
            });
          },
          error: function(data,error,reason) {   
            newAlert('error', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            $('#loading_image').remove();
          }
        });
      }
    }
  }

  function updateRecurringAppointment(){
    var revent = $("#update_recurring_appointment").data("event");
    var remend = revent.end ? revent.end.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ") : revent.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    var remstart = revent.start.utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");

    remstart = [remstart.slice(0, 25), "GMT", remstart.slice(25)].join(''); 
    remend   = [remend.slice(0, 25), "GMT", remend.slice(25)].join('');

    $.couch.db(db).openDoc(revent.id, {
      success: function(data) {
        var d = new Date();
        var doc = {
          _id:               revent.id,
          _rev:              data._rev,
          insert_ts:         revent.insert_ts,
          doctype:           "Appointments",
          status:            revent.status?revent.status:"scheduled",
          reminder_start:    remstart,
          reminder_end:      remend,
          reminder_note:     revent.title,
          reminder_type:     "Alerts",
          user_id:           revent.user_id,
          notification_type: "Appointment",
          read_receipt:      "N",
          doctor_id:         $("#update_recurring_appointment").data("associated_resource"),
          dhp_code:          pd_data.dhp_code,
          color_code:        revent.backgroundColor?revent.backgroundColor:"#378006",
          color_preference:  revent.color_preference?revent.color_preference:"Select Preference",
          tentative:         revent.tentative,
          location:          revent.location?revent.location:pd_data.city
        };
        if($("#update_recurring_appointment").data("recurring_val") == "Only this Event"){
          doc.master_recurring_id = "";
          $.couch.db(db).saveDoc(doc, {
            success: function(data) {
              var cron_record = {
                doctype:        "cronRecords",
                processed:      "No",
                appointment_id: revent.id, 
                operation_case: 19
              }
              if (revent.start < d) {
                var temp_view = $('#calendar').fullCalendar('getView');
                if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
                else getEvents($("#update_recurring_appointment").data("associated_resource"))
                getTodaysAppointments();
                $('#loading_image').remove();
              }
              else {
                $.couch.db(db).saveDoc(cron_record, {
                  success: function(data) {
                    var temp_view = $('#calendar').fullCalendar('getView');
                    if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
                    else getEvents($("#update_recurring_appointment").data("associated_resource"))
                    getTodaysAppointments();
                    $('#loading_image').remove();
                  },
                  error: function(data,error,reason) {
                    newAlert('error', reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    $('#loading_image').remove();
                  }
                });
              }
            },
            error: function(data,error,reason) {   
              newAlert('error', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              $('#loading_image').remove();
            }
          });
        }else if($("#update_recurring_appointment").data("recurring_val") == "All Events"){
          doc.master_recurring_id = revent.master_recurring_id;
          $.couch.db(db).saveDoc(doc,{
            success:function(sdata){
              $.couch.db(db).view("tamsa/getRecurringAppointments",{
                success:function(data){
                  $("#update_recurring_appointment").data("recurring_length",data.rows.length);
                  for(var i=0;i<data.rows.length;i++){
                    if(data.rows[i].value != doc._id){
                      $.couch.db(db).openDoc(data.rows[i].value,{
                        success:function(udata){
                          var tmpstart = moment(udata.reminder_start).utc().set({
                            "hour":   revent.start.get("hour"),
                            "minute": revent.start.get("minute")
                          });
                          var tmpend   = moment(udata.reminder_end).utc().set({
                            "hour":   revent.end.get("hour"),
                            "minute": revent.end.get("minute")
                          });
                          tmpstart = tmpstart.format("ddd MMM DD YYYY HH:mm:ss ZZ");
                          tmpend   = tmpend.format("ddd MMM DD YYYY HH:mm:ss ZZ");

                          tmpstart = [tmpstart.slice(0, 25), "GMT", tmpstart.slice(25)].join(''); 
                          tmpend   = [tmpend.slice(0, 25), "GMT", tmpend.slice(25)].join('');

                          var newdoc            = udata;
                          newdoc.reminder_start = tmpstart;
                          newdoc.reminder_end   = tmpend;
                          $.couch.db(db).saveDoc(newdoc,{
                            success:function(data){
                              $("#recurring_appointment_update_modal").modal("hide");
                              var recurring_length = $("#update_recurring_appointment").data("recurring_length") - 1;
                              $("#update_recurring_appointment").data("recurring_length",recurring_length);
                              if(recurring_length == 1) {
                                var temp_view = $('#calendar').fullCalendar('getView');
                                if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
                                else getEvents($("#update_recurring_appointment").data("associated_resource")) 
                              }
                              $('html, body').animate({scrollTop: 0}, 'slow');
                              return false;
                            },
                            error:function(data,error,reason){
                              newAlert('danger', reason);
                              $('html, body').animate({scrollTop: 0}, 'slow');
                              return false;
                            }
                          });
                        },
                        error:function(data,erro,reason){
                          newAlert('danger', reason);
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          return false;        
                        }
                      });
                    }
                  }
                },
                error:function(data,error,reason){
                  newAlert('danger', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  return false;
                },
                key:revent.master_recurring_id
              });
            },
            error:function(data,error,reason){
              newAlert('error', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;            
            }
          });
        }
      },
      error: function(data,error,reason) {   
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $('#loading_image').remove();
      }
    });
  }

  function saveAppointment() {
    if(validateAppointment()){
      if($("#addNewPatient").prop("checked")){
        $("#fd_appointment_patient_phone").val($("#patient_phone_appointment").val());
        if(validateAppointmentPatient()){
          if($("#fd_appointment_patient_email").val() == "emailnotprovided@digitalhealthpulse.com"){
            $.couch.db(personal_details_db).view("tamsa/getPatientPhoneNumber",{
              success: function(data){
                if(data.rows.length > 0) {
                  newAlert('danger', 'Patient with given phone number already exist.');
                  $('html, body').animate({scrollTop: 0}, 'slow');              
                }else {
                  var newPatient = true;
                  tamsaFactories.saveSinglePatientFromNewAppointmentFrontDesk(createAppointment,newPatient);
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
                        var newPatient = true;
                        tamsaFactories.saveSinglePatientFromNewAppointmentFrontDesk(createAppointment,newPatient);
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
        }else{
          $("#submitButton").removeAttr("disabled");
          return false;
        }  
      }else{
        if($("#search_patient_for_appointment_parent").css("display") != "none"){
          $.couch.db(db).view("tamsa/testPatients", {
            success: function(data) {
              if(data.rows.length == 0){
                newAlert("danger", "Patient Name not found.");
                $("#search_patient_for_appointment").focus();
                $('#createEventModal').animate({scrollTop: 0}, 'slow');
                $("#submitButton").removeAttr('disabled');
                return false;
              }else{
                createAppointment();
              }
            },
            error:function(data,error,reason){
              newAlert("danger", reason);
              $('#createEventModal').animate({scrollTop: 0}, 'slow');
            },
            startkey: [pd_data._id,$("#search_patient_for_appointment").val()],
            endkey:   [pd_data._id,$("#search_patient_for_appointment").val(),{}]
          });
        }else{
          createAppointment();
        }
      }
    }else{
      $("#submitButton").removeAttr("disabled");
      return false;
    }
  }  

  function getWeeklyRecurringDays(){
    var weekly_days = [];
    $(".weekly_repeat").each(function(){
      if($(this).prop("checked")){
        weekly_days.push($(this).val());
      }
    });
    return weekly_days;
  }

  function createAppointment(){
    if($("#is_repeat").prop("checked")){
      if($("#submitButton").data("index")){
        $.couch.db(db).view("tamsa/getRecurringAppointments",{
          success:function(rdata){
            if(rdata.rows.length>0){
              var remove_app = [];
              for(var i=0;i<rdata.rows.length;i++){
                remove_app.push({
                  _id:  rdata.rows[i].doc._id,
                  _rev: rdata.rows[i].doc._rev
                });
              }
              $.couch.db(db).bulkRemove({"docs":remove_app},{
                success:function(ddata){
                  $.couch.db(db).openDoc($("#removeAppointment").data("master_recurring_id"),{
                    success:function(msdata){
                      var tempdata = msdata;
                      tempdata.repeat_type = $("#rpt_appoitment_type").val();
                      tempdata.repeat_every = ($("#rpt_appoitment_type").val() == "Daily")?$("#rpt_count_days").val():getWeeklyRecurringDays();
                      tempdata.start_date = $("#rpt_start_day").val();
                      tempdata.end_type = $("#rpt_end_day").val();
                      tempdata.end_val = ($("#rpt_end_day").val() == "On")?$("#rpt_end_val").val():$("#rpt_end_after_val").val();
                      $.couch.db(db).saveDoc(tempdata,{
                        success:function(data){
                         var cron_record = {
                            doctype:             "cronRecords",
                            processed:           "No",
                            update_ts:           new Date(),
                            crontype:            "Appointment",
                            operation_case:      19,
                            reminder_note:       $("#reminder_note").val(),
                            appointment_id:      $("#submitButton").data("index"),
                            master_recurring_id: data.id,
                            hospital_document:   ($('#micsdoc_view').val() != "Select Hospital Documents") ? $('#micsdoc_view').val() : "",
                            service_name:        ($('#servicedoc_view :selected').text() != "Select Services") ? $('#servicedoc_view :selected').text() : "",
                            service_documents:   ($('#servicedoc_view').val() != "Select Services") ? $('#servicedoc_view').val().split(",") : ""
                          }
                          $.couch.db(db).saveDoc(cron_record,{
                            success:function(crodata){
                              saveRecurringAppointment(generateRecurringData(data.id));
                            },
                            error:function(data,error,reason){
                              newAlert("danger",reason);
                              $('html, body').animate({scrollTop: 0}, 'slow');
                              return false;
                            }
                          });
                        },
                        error:function(data,error,reason){
                          newAlert("danger",reason);
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          return false;
                        }
                      });
                    },
                    error:function(data,error,reason){
                      newAlert("danger",reason);
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      return false;   
                    }
                  });
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  return false;    
                }
              });
            }else{
              newAlert("danger",reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            }
          },
          error:function(data,erro,reason){
            newAlert("danger",reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            return false;
          },
          key:$("#removeAppointment").data("master_recurring_id"),
          include_docs:true
        });
      }else{
        var master_appointment = {
          doctype:"master_recurring_appointment",
          repeat_type:$("#rpt_appoitment_type").val(),
          start_date:$("#rpt_start_day").val(),
          consultant_id:$("#appointment_consultant_list").val(),
          end_type:$("#rpt_end_day").val(),
          end_val:($("#rpt_end_day").val() == "On")?$("#rpt_end_val").val():$("#rpt_end_after_val").val()
        }
        if($("#rpt_appoitm  ent_type").val() == "Daily") master_appointment.repeat_every = $("#rpt_count_days").val()
        else if($("#rpt_appoitment_type").val() == "Weekly") master_appointment.repeat_every = getWeeklyRecurringDays()
        else master_appointment.repeat_every = $("input[name='monthly_repeat']:checked").val()
        $.couch.db(db).saveDoc(master_appointment,{
          success:function(data){
            var cron_record = {
              doctype:             "cronRecords",
              processed:           "No",
              update_ts:           new Date(),
              crontype:            "Appointment",
              operation_case:      18,
              reminder_note:       $("#reminder_note").val(),
              appointment_id:      $("#submitButton").data("index"),
              master_recurring_id: data.id,  
              hospital_document:   ($('#micsdoc_view').val() != "Select Hospital Documents") ? $('#micsdoc_view').val() : "",
              service_name:        ($('#servicedoc_view :selected').text() != "Select Services") ? $('#servicedoc_view :selected').text() : "",
              service_documents:   ($('#servicedoc_view').val() != "Select Services") ? $('#servicedoc_view').val().split(",") : ""
            }
            $.couch.db(db).saveDoc(cron_record,{
              success:function(crodata){
                saveRecurringAppointment(generateRecurringData(data.id));
              },
              error:function(danger,error,reason){
                newAlert("danger",reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }
    }else{
      var single_appointment_doc = generateNormalAppointmentData();
      var cron_record = {
        doctype:           "cronRecords",
        processed:         "No",
        update_ts:         new Date(),
        crontype:          "Appointment",
        reminder_note:     $("#reminder_note").val(),
        hospital_document: ($('#micsdoc_view').val() != "Select Hospital Documents") ? $('#micsdoc_view').val() : "",
        service_name:      ($('#servicedoc_view :selected').text() != "Select Services") ? $('#servicedoc_view :selected').text() : "",
        service_documents: ($('#servicedoc_view').val() != "Select Services") ? $('#servicedoc_view').val().split(",") : ""
      };
      if($("#appointment_hidden_flag").attr("value") == "user"){
        single_appointment_doc.user_id = userinfo.user_id;
      }else{
        single_appointment_doc.user_id = $("#search_patient_for_appointment").attr("userid");
      }
      if($("#submitButton").data("index")) {
        single_appointment_doc._id  = $("#submitButton").data("index");
        single_appointment_doc._rev = $("#submitButton").data("rev");
        cron_record.appointment_id = $("#submitButton").data("index");
        cron_record.operation_case = 19;
      }
      saveNormalAppointment(single_appointment_doc, cron_record);
    }  
  }

  function toggleRecurringEndDate($obj){
    if($obj.val() == "On"){
      $("#rpt_end_val").show();
      $("#rpt_end_after_val").val("").hide();
      $("#rpt_end_after_label").hide();
    }else{
      $("#rpt_end_after_val").show();
      $("#rpt_end_after_label").show();
      $("#rpt_end_val").val("").hide();
    }  
  }

  function toggleRecurringCountParent(value){
    if(value == "Daily"){
      $("#weekly_repeat_count, #monthly_repeat_count").hide();
      $("#daily_repeat_count").show();
    }else if (value == "Weekly"){
      $("#daily_repeat_count, #monthly_repeat_count").hide();
      $("#weekly_repeat_count").show();
    }else{
      $("#daily_repeat_count, #weekly_repeat_count").hide();
      $("#monthly_repeat_count").show();
    }
  }

  function generateRepeatData(){
    var temp_repeat_data = {};
    var temp_repeat_increment = [];
    temp_repeat_data.start_date = $("#rpt_start_day").val();
    if($("#rpt_appoitment_type").val() == "Daily"){
      temp_repeat_increment.push(Number($("#rpt_count_days").val()));
      temp_repeat_data.rec_increment = temp_repeat_increment;
      if(temp_repeat_data.start_date){
        var tstart = moment($('#apptStartTime').val()).utc().set({
          "year":temp_repeat_data.start_date.substring(0,4),
          "month":temp_repeat_data.start_date.substring(5,7),
          "date":temp_repeat_data.start_date.substring(8,10)
        });
        var tend = moment($('#apptEndTime').val()).utc().set({
          "year":temp_repeat_data.start_date.substring(0,4),
          "month":temp_repeat_data.start_date.substring(5,7),
          "date":temp_repeat_data.start_date.substring(8,10)
        });
        $('#apptStartTime').val(tstart);
        $('#apptEndTime').val(tend);
      }
      if($("#rpt_end_day").val() == "On"){
        var tstart = $('#rpt_start_day').datepicker('getDate');
        var tend   = $('#rpt_end_val').datepicker('getDate');
        var tdays   = (tend - tstart)/1000/60/60/24;
        temp_repeat_data.rec_limit = tdays + 1;
      }else{
        temp_repeat_data.rec_limit = $("#rpt_count_days").val() * $("#rpt_end_after_val").val();
      }
      return temp_repeat_data;
    }else if($("#rpt_appoitment_type").val() == "Weekly"){
      var weekly_repeat_array = [];
      var cur;
      $(".weekly_repeat").each(function(){
        if($(this).prop("checked")) weekly_repeat_array.push($(this).val())
      });
      for(var i=0;i<weekly_repeat_array.length;i++){
        if(moment($('#apptStartTime').val()).day() <= Number(weekly_repeat_array[i])){
          var diffdays = Number(weekly_repeat_array[i]) - moment($('#apptStartTime').val()).day();
          $('#apptStartTime').val(moment($('#apptStartTime').val()).add(diffdays,'d'));
          $('#apptEndTime').val(moment($('#apptEndTime').val()).add(diffdays,'d'));
          cur = i;
          break;
        }
      }
      var tempswap = [];
      for(var i=0;i<weekly_repeat_array.length;i++){
        if(i+1 == weekly_repeat_array.length){
          tempswap.push(7 - (weekly_repeat_array[i] - weekly_repeat_array[0]));
        }else{
          tempswap.push(weekly_repeat_array[i+1] - weekly_repeat_array[i]);
        }
      }
      var final_rdata = [];
      for(var i=0;i<tempswap.length;i++){
        final_rdata[i] = tempswap[cur++];
        if(cur > tempswap.length -1) cur=0;
      }
      temp_repeat_data.rec_increment = final_rdata;
      if($("#rpt_end_day").val() == "On"){
        var tstart = $('#rpt_start_day').datepicker('getDate');
        var tend   = $('#rpt_end_val').datepicker('getDate');
        var tdays   = (tend - tstart)/1000/60/60/24;
        temp_repeat_data.rec_limit = tdays + 1;
      }else{
        var fullweek = parseInt($("#rpt_end_after_val").val()/final_rdata.length);
        var partialweek = ($("#rpt_end_after_val").val()%final_rdata.length);
        var total_week_limit = (fullweek * 7);
        for(var i=0;i<partialweek;i++){
          total_week_limit = total_week_limit + final_rdata[i];
        }
        temp_repeat_data.rec_limit = total_week_limit;
      }
      return temp_repeat_data;
    }
  }

  function generateDailyAndWeeklyRecurringData(masterid){
    var repeat_data = generateRepeatData();
    var bulk_docs = [];
    var a = Number(repeat_data.rec_limit);
    var b = repeat_data.rec_increment;

    for(var i=0,c=0;i<a;i=i+b[(c<b.length)?c++:0]){
      if(c >= b.length){
        c =0;
      }
      var rstart = moment($('#apptStartTime').val()).add(i,'d').utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
      var rend   = moment($('#apptEndTime').val()).add(i,'d').utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
      
      var rem_start = [rstart.slice(0, 25), "GMT", rstart.slice(25)].join('');
      var rem_end = [rend.slice(0, 25), "GMT", rend.slice(25)].join('');
      var d = new Date();
      var newdoc = {
        insert_ts:           d,
        doctype:             "Appointments",
        status:              "scheduled",
        reminder_note:       $("#reminder_note").val(),
        reminder_type:       "Alerts",
        reminder_start:      rem_start,
        reminder_end:        rem_end,
        notification_type:   "Appointment",
        read_receipt:        "N",
        doctor_id:           pd_data._id,
        dhp_code:            pd_data.dhp_code,
        color_code:          $("#color_code_value:first-child").css("background-color"),
        color_preference:    $("#color_code_value:first-child").text(),
        tentative:           $("#is_appointment_tentative").prop("checked"),
        master_recurring_id: masterid,
        consultant_id:       $("#appointment_consultant_list").val()
      };
      if($("#appointment_hidden_flag").attr("value") == "user"){
        newdoc.user_id = userinfo.user_id;
      }else{
        newdoc.user_id = $("#search_patient_for_appointment").attr("userid");
      }
      bulk_docs.push(newdoc);
    }
    return bulk_docs;
  }

  function generateMonthlyRecurringData(masterid){
    if($("input[name='monthly_repeat']:checked").val() == "dMonth"){
      var bulk_docs = [];
      if($("#rpt_end_day").val() == "On"){
        var n = moment($('#rpt_end_val').val()).diff(moment($('#rpt_start_day').val()), 'months') + 1;
      }else{
        var n = $("#rpt_end_after_val").val();
      }
      for(var i=0;i<n;i++){
        var rstart = moment($('#apptStartTime').val()).add(i,'M').utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
        var rend   = moment($('#apptEndTime').val()).add(i,'M').utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
        
        var rem_start = [rstart.slice(0, 25), "GMT", rstart.slice(25)].join('');
        var rem_end = [rend.slice(0, 25), "GMT", rend.slice(25)].join('');
        var d = new Date();
        var newdoc = {
          insert_ts:           d,
          doctype:             "Appointments",
          reminder_note:       $("#reminder_note").val(),
          reminder_type:       "Alerts",
          reminder_start:      rem_start,
          reminder_end:        rem_end,
          status:              "scheduled",
          notification_type:   "Appointment",
          read_receipt:        "N",
          doctor_id:           pd_data._id,
          dhp_code:            pd_data.dhp_code,
          color_code:          $("#color_code_value:first-child").css("background-color"),
          color_preference:    $("#color_code_value:first-child").text(),
          tentative:           $("#is_appointment_tentative").prop("checked"),
          master_recurring_id: masterid
        };
        if($("#appointment_hidden_flag").attr("value") == "user"){
          newdoc.user_id = userinfo.user_id;
        }else{
          newdoc.user_id = $("#search_patient_for_appointment").attr("userid");
        }
        bulk_docs.push(newdoc);
      }
      return bulk_docs;
    }else{

    }
  }

  function generateRecurringData(masterid){
    if($("#rpt_appoitment_type").val() == "Monthly"){
      return generateMonthlyRecurringData(masterid);
    }else{
      return generateDailyAndWeeklyRecurringData(masterid);
    }
  }

  function generateNormalAppointmentData(){
    var d = new Date();
    var rstart = moment($('#apptStartTime').val()).utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    var rend   = moment($('#apptEndTime').val()).utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    
    var rem_start = [rstart.slice(0, 25), "GMT", rstart.slice(25)].join('');
    var rem_end = [rend.slice(0, 25), "GMT", rend.slice(25)].join('');
    var doc = {
      insert_ts:           d,
      doctype:             "Appointments",
      status:              "scheduled",
      reminder_note:       $("#reminder_note").val(),
      reminder_type:       "Alerts",
      reminder_start:      rem_start,
      reminder_end:        rem_end,
      notification_type:   "Appointment",
      read_receipt:        "N",
      doctor_id:           $("#removeAppointment").data("associated_resource"),
      dhp_code:            pd_data.dhp_code,
      color_code:          $("#color_code_value:first-child").css("background-color"),
      color_preference:    $("#color_code_value:first-child").text(),
      tentative:           $("#is_appointment_tentative").prop("checked"),
      master_recurring_id: "",
      hospital_document:   ($('#micsdoc_view').val() != "Select Hospital Documents") ? $('#micsdoc_view').val() : "",
      service_name:        ($('#servicedoc_view :selected').text() != "Select Services") ? $('#servicedoc_view :selected').text() : "",
      service_documents:   ($('#servicedoc_view').val() != "Select Services") ? $('#servicedoc_view').val().split(",") : "",
      location:            $("#location_appointment").val()
    };
    if($("#appointment_consultant_list").val() == "noselect"){
      if(doc.consultant_id) delete doc.consultant_id
    }else{
      doc.consultant_id = $("#appointment_consultant_list").val();
    }
    return doc;
  }

  function saveNormalAppointment(doc, cron_record) {
    $.couch.db(db).saveDoc(doc, {
      success: function(data) {
        if (!cron_record.appointment_id) {
          cron_record.appointment_id = data.id;
          cron_record.operation_case = 18;
        }
        if(new Date(doc.reminder_start) < new Date()) {
          var temp_view = $('#calendar').fullCalendar('getView');
          if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
          else getEvents($("#removeAppointment").data("associated_resource"))
          getTodaysAppointments();
          $("#createEventModal").modal('hide');
          $("#submitButton").removeAttr("disabled");
        }else {
          $.couch.db(db).saveDoc(cron_record, {
            success: function(data) {
              var temp_view = $('#calendar').fullCalendar('getView');
              if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
              else getEvents($("#removeAppointment").data("associated_resource"))
              getTodaysAppointments();
              $("#createEventModal").modal('hide');
              $("#submitButton").removeAttr("disabled");
              if($("#appointment_request_hidden").val()){
                $.couch.db(db).openDoc($("#appointment_request_hidden").val(), {
                  success:function(data){
                    var updateddata = data;
                    updateddata.status = "Completed";
                    $.couch.db(db).saveDoc(updateddata,{
                      success:function(data){
                        // $state.go("task_manager");
                        $state.go("task_manager",{action:"appointment_request"});
                        $("#appointment_request_hidden").val("");
                        $(".fc-month-button, .fc-agendaWeek-button, .fc-prev-button, .fc-next-button, .fc-today-button").show();
                        $(".fc-agendaDay-button").removeClass("fc-corner-left");
                        $(".fc-agendaWeek-button").click();    
                      },
                      error:function(data,error,reason){
                        newAlert('error', reason);
                        $('html, body').animate({scrollTop: 0}, 'slow');
                        $("#submitButton").removeAttr("disabled");
                      }
                    })
                  },
                  error:function(data,error,reason){
                    newAlert('error', reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    $("#submitButton").removeAttr("disabled");
                  }
                });
              }
            },
            error: function(data,error,reason) {   
              newAlert('error', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              $("#submitButton").removeAttr("disabled");
            }
          });
        }
      },
      error: function(data,error,reason) {   
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#submitButton").removeAttr("disabled");
      }
    });
  }

  function saveRecurringAppointment(bulk_docs){
    $.couch.db(db).bulkSave({"docs":bulk_docs},{
      success: function(data) {
        var temp_view = $('#calendar').fullCalendar('getView');
        if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
        else getEvents($("#removeAppointment").data("associated_resource"))
        getTodaysAppointments();
        clearAppointmentRepeatData();
        $("#createEventModal").modal('hide');
        $("#submitButton").removeAttr("disabled");
      },
      error: function(data,error,reason) {   
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    });
  }

  function getEvents(resource_id) {
    $('body').append('<div id="loading_image" style="z-index: 9999; border: medium none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background-color: rgb(0, 0, 0); opacity: 0.6; cursor: wait; position: fixed;" class="blockUI blockOverlay"><div style="z-index: 1011; position: fixed; padding: 0px; margin: 0px; width: 30%; top: 40%; left: 35%; text-align: center; color: rgb(0, 0, 0); cursor: wait;" class="blockUI blockMsg blockPage"><h3 style="height:auto;font-size:15px;color:#FF9108;margin:0px;margin-bottom:4px;padding:0px;"><br><img style="padding:0px; margin:0px;" alt="" title="Loading..." src="images/ajax-loader-large.gif"><br></h3></div></div>');

    //$('#calendar').fullCalendar('option', 'contentHeight', 1070);
    $.couch.db(db).list("tamsa/appointmentsByDoctorsList", "getAppointmentNotification", {
      reduce:       false,
      group:        false,
      include_docs: true,
      docids:       resource_id
    }).success(function(data){
      $('#loading_image').remove();
      events = [];
      for (var i = 0; i < data.rows.length; i++) {
        if(data.rows[i].value.block_start){
          var tmpstart = data.rows[i].value.block_start;
          var tmpend   = data.rows[i].value.block_end;
          events.push({
            id:               data.rows[i].id,
            rev:              data.rows[i].value._rev,
            title:            data.rows[i].value.reason_for_block,
            insert_ts:        data.rows[i].value.insert_ts,
            start:            tmpstart,
            end:              tmpend,
            allDay:           false,
            backgroundColor:  "black",
            startEditable:    false,
            durationEditable: false
          });
        }else{
          var tmpstart = data.rows[i].value.reminder_start;
          var tmpend   = data.rows[i].value.reminder_end;
          events.push({
            id:                  data.rows[i].id,
            rev:                 data.rows[i].value._rev,
            title:               data.rows[i].value.reminder_note,
            insert_ts:           data.rows[i].value.insert_ts,
            user_id:             data.rows[i].value.user_id,
            start:               tmpstart,
            end:                 tmpend,
            allDay:              false,
            backgroundColor:     data.rows[i].value.color_code?data.rows[i].value.color_code:"#378006",
            borderColor:         data.rows[i].value.tentative?"#ffff00": (data.rows[i].value.color_code?data.rows[i].value.color_code:"#378006"),
            color_preference:    data.rows[i].value.color_preference?data.rows[i].value.color_preference:"Select Preference",
            tentative:           data.rows[i].value.tentative?true:false,
            consultant_id:       data.rows[i].value.consultant_id ? data.rows[i].value.consultant_id : "noselect",
            master_recurring_id: data.rows[i].value.master_recurring_id?data.rows[i].value.master_recurring_id:"",
            hospital_document:   data.rows[i].value.hospital_document?data.rows[i].value.hospital_document:"",
            service_name:        data.rows[i].value.service_name?data.rows[i].value.service_name:"",
            service_documents:   data.rows[i].value.service_documents?data.rows[i].value.service_documents:"",
            resourceId:          data.rows[i].value.doctor_id,
            doctor_id:           data.rows[i].value.doctor_id,
            dhp_code:            data.rows[i].value.dhp_code?data.rows[i].value.dhp_code:"",
            status:              data.rows[i].value.status ? data.rows[i].value.status:"scheduled",
            location:            data.rows[i].value.location ? data.rows[i].value.location:pd_data.city
          });
        }
      };
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', events);         
      $('#calendar').fullCalendar('rerenderEvents');
      $('#calendar').fullCalendar('option', 'contentHeight', 1070);
      var cal = ics(); // go through each event from the json and add an event for it to ics 
      $.each(events,function(i,$event){
        cal.addEvent($event.title,'','',$event.start,$event.end);}); 
      // Download iCal button onclick listener
      $("#icaldownload").on('click',function(){
        cal.download('appointments','.ics');
      });
    });
  }

  function printSelectedAppointment() {
    var sd  = moment($("#app_start_date").val()).format("YYYY-MM-DD");
    var ed  = moment($("#app_end_date").val()).format("YYYY-MM-DD");

    if (!$("#app_start_date").val() || !$("#app_end_date").val() || isGte($("#app_start_date").val(), $("#app_end_date").val())) {
      newAlertForModal('danger', "Please select valid start and end date.",'print_calendar_modal');
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    } 
    var open_link = window.open('','_blank');
    open_link.document.open();
    open_link.document.write("<iframe width='1100' height='1000' src='/_print/appointments?id="+pd_data._id+"&start="+sd+"&end="+ed+"&dhp_code="+pd_data.dhp_code+"'></iframe>");
    open_link.document.close();
    /*$.couch.db(db).view("tamsa/getAppointmentNotification", {
      success: function(data) {
        if(data.rows.length > 0){
          $.couch.db(db).view("tamsa/getPrintSetting",{
            success:function(hdata){
              if(hdata.rows.length > 0){
                var commonHtml = getPrintCommonDetailsDoctor(hdata);
                var footer_html = getFotterHtml();
                var print_html = commonHtml;
                print_html += '<table class="table tbl-border" style="border:1px solid #ddd">';
                  print_html += '<thead>';
                    print_html += '<tr>';
                      print_html += '<th><b>Appointment Date</b></th>';
                      print_html += '<th><b>Appointment Time</b></th>';
                      print_html += '<th><b>Patient Name</b></th>';
                      print_html += '<th><b>Patient Email Id</b></th>';
                      print_html += '<th><b>Patient Phone No</b></th>';
                      print_html += '<th><b>Creation Date</b></th>';
                      print_html += '<th><b>Creation Time</b></th>';
                      print_html += '<th><b>Appointment Note</b></th>';
                    print_html += '</tr>';
                  print_html += '</thead>';
                  print_html += '<tbody>';
                  for(var i=0;i<data.rows.length;i++) {
                    var s_date = new Date(data.rows[i].value.reminder_start);
                    var e_date = new Date(data.rows[i].value.reminder_end);
                    var crt_date = new Date(data.rows[i].value.insert_ts);
                    
                    print_html += '<tr class = "p-app-row" userid = "'+data.rows[i].value.user_id+'">';
                      print_html += '<td>'+s_date.toLocaleDateString()+'</td><td>'+s_date.toLocaleTimeString()+' to '+ e_date.toLocaleTimeString() +'</td><td class = "p-name"></td><td class = "p-email"></td><td class = "p-phone"></td><td>'+crt_date.toLocaleDateString()+'</td><td>'+crt_date.toLocaleTimeString()+'</td><td>'+data.rows[i].value.reminder_note+'</td>';
                    print_html += '</tr>';
                  }
                  print_html += '</tbody>';
                print_html += '</table>';
                var temp = print_html.concat(footer_html);
                $("#print_area_temp").html(temp);
                var pg_print_no = 0;
                var chklen = $(".p-app-row").length;
                $(".p-app-row").each(function(index){
                  var tmpuserid = $(this).attr("userid");
                  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
                    success: function(udata) {
                      if(udata.rows.length > 0){
                        $(".p-app-row").filter("[userid = "+tmpuserid+"]").find(".p-name").html(udata.rows[0].value.first_nm+' '+udata.rows[0].value.last_nm);
                        $(".p-app-row").filter("[userid = "+tmpuserid+"]").find(".p-email").html(udata.rows[0].value.user_email);
                        $(".p-app-row").filter("[userid = "+tmpuserid+"]").find(".p-phone").html(udata.rows[0].value.phone);
                        pg_print_no++;
                        if(pg_print_no == chklen){
                          printNewHtml($("#print_area_temp").html());
                          $("#print_calendar_modal").modal("hide");
                          return;
                        }
                      }
                    },
                    error: function(data,error,reason){
                      newAlertForModal('danger', reason,'print_calendar_modal');
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      return false;          
                    },
                    key: tmpuserid
                  });
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
        }else{
          newAlertForModal('danger', "No appointments found between given dates.",'print_calendar_modal');
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }

      },
      error: function(data,error,reason) {   
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      startkey:   [pd_data._id,sd],
      endkey:     [pd_data._id,ed],
      reduce:     false,
      group:      false
    });*/
  }

  function removeAppointment() {
    if($("#removeAppointment").data("master_recurring_id")){
      if($("#remove_preference").val() == "All Events"){
        var bulk_remove = [];
        $.couch.db(db).view("tamsa/getRecurringAppointments",{
          success:function(data){
            for(var i=0;i<data.rows.length;i++){
              var doc = {
                _id:  data.rows[i].doc._id,
                _rev: data.rows[i].doc._rev
              }
              bulk_remove.push(doc);
            }
            removeAppointmentWithData(bulk_remove);
          },
          error:function(data,error,reason){
            console.log(status);
          },
          key:$("#removeAppointment").data("master_recurring_id"),
          include_docs:true
        });
      }else{
        normalAppointmentRemove();
      }
    }else{
      normalAppointmentRemove();
    }
  }

  function normalAppointmentRemove(){
    var bulk_remove = [];
    var doc = {
      _id:  $("#removeAppointment").data("del_index"),
      _rev: $("#removeAppointment").data("del_rev")
    }
    bulk_remove.push(doc);
    removeAppointmentWithData(bulk_remove);
  }

  function removeAppointmentWithData(bulk_remove){
    var rstart = moment($('#apptStartTime').val()).utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    var rend   = moment($('#apptEndTime').val()).utc().format("ddd MMM DD YYYY HH:mm:ss ZZ");
    var rem_start = [rstart.slice(0, 25), "GMT", rstart.slice(25)].join('');
    var rem_end = [rend.slice(0, 25), "GMT", rend.slice(25)].join('');
    var cron_record = {
      doctype:        "cronRecords",
      processed:      "No",
      user_id:        $("#search_patient_for_appointment").attr("userid"),
      time:           $("#when").html(),
      doctor_name:    pd_data.first_name+" "+pd_data.last_name,
      reminder_note:  $("#reminder_note").val(),
      reminder_start: rem_start,
      reminder_end:   rem_end,
      dhp_code:       pd_data.dhp_code,
      doctor_id:      $("#removeAppointment").data("associated_resource"),
      consultant_id:  $("#consultant_id_hidden").val(),
      operation_case: 20
    }
    
    $.couch.db(db).bulkRemove({"docs": bulk_remove}, {
      success: function(data) {
        $.couch.db(db).saveDoc(cron_record, {
          success: function(data) {
            var temp_view = $('#calendar').fullCalendar('getView');
            if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
            else getEvents($("#removeAppointment").data("associated_resource"))
            getTodaysAppointments();
            $("#createEventModal").modal('hide');
            $("#removeAppointment").data("master_recurring_id" , "");
            $("#submitButton").data("index","")
          },
          error: function(data,error,reason) {
            newAlert('error', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');    
          }
        });
      },
      error: function(data, error, reason) {
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    });  
  }

  function removeAppointmentDetailsOnMouseOut($obj){
    $obj.css('z-index', 8);
    $('.appointment-popover').remove();
  }

  function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function setRecurringValue($obj){
    $(".cmn-recur").removeClass("btn-warning").addClass("btn-default");
    $obj.addClass("btn-warning");
    $("#update_recurring_appointment").data("recurring_val",$obj.html());
  }

  function resetRecurringAppointmentUpdateModal(){
    $(".cmn-recur").each(function(){
      if($(this).html() == "Only this Event"){
        $(this).addClass("btn-warning").removeClass("btn-default");
      }else if($(this).html() == "All Events"){
        $(this).removeClass("btn-warning").addClass("btn-default");
      }else{
        console.log("Button Text changed. Please Update.")
      }
      $("#update_recurring_appointment").data("recurring_val","Only this Event");
    });
  }

  function closeRecurringAppointmentModal(){
    var revert = $("#update_recurring_appointment").data("revertFunc");
    revert();
  }

  function isRepeatAppointment($obj){
    if($obj.prop("checked")){
      $("#repeat_app_parent").show("slow");
    }else{
      $("#repeat_app_parent").hide("slow");
    }
    clearAppointmentRepeatData();
  }

  function getConsultanListInAppointment(consultant_id){
    $.couch.db(replicated_db).view("tamsa/getDoctorsList",{
      success:function(data){
        $("#appointment_consultant_list").find("option").remove();
        if(data.rows.length > 0){
          $("#appointment_consultant_list").append("<option value='noselect'>Select Consultant</option>");
          for(var i=0;i<data.rows.length;i++){
            if(pd_data._id != data.rows[i].doc._id){
              $("#appointment_consultant_list").append("<option value='"+data.rows[i].doc._id+"'>"+data.rows[i].doc.first_name+" "+data.rows[i].doc.last_name+"&nbsp;--&nbsp;"+data.rows[i].doc.phone+"</option>");
            }
          }
          if(consultant_id){
            $("#appointment_consultant_list").val(consultant_id);
            $("#consultant_id_hidden").val(consultant_id);  
          }
        }else{
          $("#appointment_consultant_list").append("<option value='noselect'>No Consultants are Found.</option>");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
      },
      startkey:[pd_data.dhp_code],
      endkey:[pd_data.dhp_code,{},{}],
      include_docs:true
    });
  }

  function openBlockTimeDayModal(resource){
    $("#block_time_day_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    if(resource){
      $("#removeAppointment").data("associated_resource",resource.id);
    }else{
      $("#removeAppointment").data("associated_resource",pd_data._id);
    }
  }

  function ISODateString(d) {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
  }

  function openModalForAllDayBlock($obj){
    if (moment().diff(moment($obj.parent().text().substring(4))) > 0) {
      newAlert('danger', "You can not block Time for Past Dates.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    } 
    var sd  = moment($obj.parent().text().substring(4)).format("YYYY-MM-DD");
    var ed  = moment($obj.parent().text().substring(4)).format("YYYY-MM-DD");

    $.couch.db(db).view("tamsa/getAppointmentNotification", {
      success: function(data) {
        if(data.rows.length > 0){
          newAlert('danger', "You can not block the day.There are one or more appointments already had been given.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          $obj.prop("checked",false);
          return false;
        }else{
          openBlockTimeDayModal();
          $('#block_time_day_modal #block_start_time').val(moment($obj.parent().text().substring(4)).utc());
          $('#block_time_day_modal #block_end_time').val(moment($obj.parent().text().substring(4)).add(1,"d").utc());
          // var mywhen = moment($obj.parent().text()).format("DD MM YYYY hh:mm:ss a") + ' - ' + moment($obj.parent().text()).format("DD MM YYYY hh:mm:ss a");
          $('#blocked_duration').html($obj.parent().text() + "&nbsp;<b style='color:black !important;'>(Full Day)</b>");
          $("#remove_blocked_time").hide();
          $("#save_block_time").data("index","");
          $("#save_block_time").data("rev","");
          // if ($("#appointment_hidden_flag").attr("value") == "user") {
          //   $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent").hide();
          // }
          // else {
          //   $("#search_patient_for_appointment_parent, #patient_email_appointment_parent, #patient_phone_appointment_parent").show();
          // }
        }
      },
      error: function(data,error,reason) {   
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      startkey:   [pd_data._id,sd],
      endkey:     [pd_data._id,ed],
      reduce:     false,
      group:      false
    });
  }

  function displayBlockTimeDayMessage(){
    if($("#is_block_time_day").prop("checked")){
      $("#calendar").find(".fc-clear").html("Now You can select any Time/Duration to mark them as a Blocked Time/Day.");
      $("#calendar").find(".fc-clear").css("color","red");
      $(".fc-day-header").append('<input type="checkbox" class="checkshow block-all-day" style="float:right;margin-right:10px;">');
    }else{
      $("#calendar").find(".fc-clear").html("");
      $("#calendar").find(".fc-clear").css("color","");
      $(".block-all-day").remove();
    }
  }

  function clearBlockTimeDayModal(){
    $("#reason_for_block_time_day").val("");
    $("#blocked_duration").html("");
    $(".block-all-day").prop("checked",false);
  }

  function saveBlockTimeDay(){
    var d = new Date();
    var block_time_doc = {
      insert_ts:         d,
      doctype:           "Appointments",
      notification_type: "Appointment",
      reason_for_block:  $("#reason_for_block_time_day").val(),
      block_start:       $('#block_start_time').val(),
      block_end:         $('#block_end_time').val(),
      doctor_id:         $("#removeAppointment").data("associated_resource"),
      dhp_code:          pd_data.dhp_code
    };
    if($("#save_block_time").data("index")) {
      block_time_doc._id  = $("#save_block_time").data("index");
      block_time_doc._rev = $("#save_block_time").data("rev");
    }
    $.couch.db(db).saveDoc(block_time_doc,{
      success:function(data){
        $("#block_time_day_modal").modal("hide");
        var temp_view = $('#calendar').fullCalendar('getView');
        if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
        else getEvents($("#removeAppointment").data("associated_resource"))
        newAlert('danger',"Time Successfuly Blocked for given duration.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      error:function(data,error,reason){
        newAlert('danger',reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function toggleBlockAllDayCheckbox($obj){
    if($("#is_block_time_day").prop("checked")){
      $(".fc-day-header").append('<input type="checkbox" class="checkshow block-all-day" style="float:right;margin-right:10px;">');
    }
    if($obj.hasClass("fc-today-button")){
     $("#is_block_time_day").prop("checked",false);
    }
  }

  function removeBlockedTime(){
    var remove_doc = {
      _id:  $("#save_block_time").data("index"),
      _rev: $("#save_block_time").data("rev")
    }
    $.couch.db(db).removeDoc(remove_doc,{
      success:function(data){
        $("#block_time_day_modal").modal("hide");
        var temp_view = $('#calendar').fullCalendar('getView');
        if(temp_view.name == "agendaDay") getEvents(pd_data._id+ "|" + $("#muliptle_doctors_list").val().join("|"))
        else getEvents($("#removeAppointment").data("associated_resource"))
        newAlert('success','Blocked time Successfuly removed.');
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      error:function(data,error,reason){
        newAlert('danger',reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });

  }

  function getDHPDoctorsforMultipleCalendar(){
    $('#calendar').fullCalendar('addResource', {
        id: pd_data._id,
        title: "Dr" + pd_data.first_name
    });
    $.couch.db(replicated_db).view("tamsa/getDoctorsList",{
      success:function(data){
        $("#muliptle_doctors_list_parent").show();
        // $("#muliptle_doctors_list").append('<option selected="selected" disabled="disabled" value="'+pd_data._id+'">'+pd_data.first_name + " " +pd_data.last_name+'</option>');
        if(data.rows.length > 0){
          for(var i=0;i<data.rows.length;i++){
            if(data.rows[i].doc._id == pd_data._id){
              continue;
            }else{
              $("#muliptle_doctors_list").append('<option value="'+data.rows[i].doc._id+'">'+data.rows[i].doc.first_name+ " " +data.rows[i].doc.last_name+'</option>');
            }
          }
          $("#muliptle_doctors_list").multiselect("refresh");
          var temp_arr = $("#calendar").fullCalendar( 'getResources' );
          var new_temp_arr = '';
          for(var i=0;i<temp_arr.length;i++){
            if(i != 0) new_temp_arr += "|"
            new_temp_arr += temp_arr[i].id;
          }
          getEvents(new_temp_arr);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 1000);
        return false;
      },
      startkey:[pd_data.dhp_code], 
      endkey:[pd_data.dhp_code,{}], 
      include_docs:true
    });
  }

  function getEventsForAgendaWeekAndMonth(){
    $("#muliptle_doctors_list_parent").hide();
    getEvents(pd_data._id)
  }

  function multipleDoctorList(){
    $("#muliptle_doctors_list").multiselect({
      header:false,
      selectedList: 4,
      noneSelectedText: "Select Doctors",
      click: function(event, ui){
        var chk = ui.checked ? 'checked' : 'unchecked';
        if(chk == "checked"){
          $('#calendar').fullCalendar('addResource', {
              id: ui.value,
              title: ui.text
          });
          InitializeAppointmentCalendar("",$("#calendar").fullCalendar('getResources'),"agendaDay");
          //getEvents(ui.value);
        }else{
          $('#calendar').fullCalendar('removeResource',ui.value);
          InitializeAppointmentCalendar("",$("#calendar").fullCalendar('getResources'),"agendaDay");
        }
        $("#muliptle_doctors_list").multiselect("close");
      }
    });
    $("#muliptle_doctors_list").append('<option selected="selected" disabled="disabled" value="'+pd_data._id+'">'+pd_data.first_name + " " +pd_data.last_name+'</option>');
    $("#muliptle_doctors_list").multiselect('refresh');
  }

  function openAppointmentSummaryModal(){
    $("#appointment_summary_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("#appoitnment_summary_table tbody").html('');
    $("#appointment_summary_title").html("<span>Appointment Summary :: "+moment().format("DD/MM/YYYY")+"</span>");
    $.couch.db(db).view("tamsa/getAppointmentByDate",{
      success:function(data){
        if(data.rows.length > 0){
          for(var i=0;i<data.rows.length;i++){
            getUserDetailsForAppoiontmentSummary(data.rows[i].doc);
          }
        }else{
          $("#appoitnment_summary_table tbody").append("<tr><td colspan='5'>No Appointment schedule for today.</td></tr>");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 1000);
        return false;
      },
      startkey:[pd_data._id,moment().format("YYYY-MM-DD")],
      endkey:[pd_data._id,moment().format("YYYY-MM-DD"),{},{}],
      include_docs:true
    });
  }

  function getUserDetailsForAppoiontmentSummary(data){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(udata){
        if(udata.rows.length > 0){
          if(udata.rows.length == 1){
            var summary_data = [];
            summary_data.push('<tr><td>'+udata.rows[0].doc.first_nm+' '+udata.rows[0].doc.last_nm+'</td><td>'+udata.rows[0].doc.patient_dhp_id+'</td><td>'+data.reminder_note+'</td><td>'+moment(data.reminder_start).format("hh:mm a") + ' -- '+ moment(data.reminder_end).format("hh:mm a") +'</td><td>'+(data.location ? data.location : pd_data.city)+'</td></tr>');
            $("#appoitnment_summary_table tbody").append(summary_data.join(''));
          }else{
            newAlert("danger","multiple subscriber found for given patient.");
            $('html, body').animate({scrollTop: 0}, 1000);
            return false;  
          }
        }else{
          newAlert("danger","No Details Found for selected Patient.");
          $('html, body').animate({scrollTop: 0}, 1000);
          return false;  
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 1000);
        return false;
      },
      key:          data.user_id,
      reduce:       false,
      group:        false,
      include_docs: true
    });
  }
//appointment js code ends
});