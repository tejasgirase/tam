// var pouchdb = new PouchDB('localpouch'),
var document_added_from;
var data = {
  userCtx :{
    "name":"n@n.com"
  }
};
// $.couch.urlPrefix = "https://handiffectleserionythent:3b7d6f6094557af528205e8533f5aeaf7015a2e2@nirmalpatel59.cloudant.com";
$.couch.urlPrefix = "https://nirmalpatel59:nirmalpatel@nirmalpatel59.cloudant.com";
//var remoteCouch = attachments_url;
//syncDom.setAttribute('data-sync-state', 'syncing');
// pouchdb.changes({
//   since: 'now',
//   live: true
// }).on('change', mysync);

// var sync = PouchDB.sync('todos', remoteCouch, {
//   live:         true,
//   retry:        true,
//   filter:       'tamsa/referral_document',
//   query_params: { "doctype": "Referral" }
// });


// pouchdb.sync(remoteCouch, {
//   live: true,
//   retry: true,
//   filter: 'tamsa/referral_document',
//   query_params: { "doctype": "Referral" }
// })


// var rep = PouchDB.replicate(remoteCouch,pouchdb, {
//   live:         true,
//   retry:        true,
//   filter:       'tamsa/referral_document',
//   query_params: { "doctype": "Referral" }
// }).on('change', function (info) {
//   // handle change
// }).on('paused', function () {
//   // replication paused (e.g. user went offline)
// }).on('active', function () {
//   // replicate resumed (e.g. user went back online)
// }).on('denied', function (info) {
//   // a document failed to replicate, e.g. due to permissions
// }).on('complete', function (info) {
//   // handle complete
// }).on('error', function (err) {
//   // handle error
// });


// var sync = PouchDB.sync(pouchdb, 'http://192.168.0.67:5984/'+db, {
//   live: true,
//   retry: true,
//   filter: 'tamsa/referral_document',
//   query_params: { "doctype": "Lab" }
// }).on('change', function (info) {
//   // handle change
// }).on('paused', function () {
//   // replication paused (e.g. user went offline)
// }).on('active', function () {
//   // replicate resumed (e.g. user went back online)
// }).on('denied', function (info) {
//   // a document failed to replicate, e.g. due to permissions
// }).on('complete', function (info) {
//   // handle complete
// }).on('error', function (err) {
//   // handle error
// });

/*pouchdb sync starts*/
//===============================================
// pouchdb.sync(attachments_url, {
//   live: true,
//   retry: true,
//   filter: 'tamsa/referral_document',
//   query_params: { "doctype": "Lab","doctype2": "Imaging" }
// });

// var opts = {
//     live:         true,
//     retry:        true
// };
// pouchdb.replicate.to(attachments_url, opts);
//================================================
/*pouchdb sync ends*/

  // pouchdb.replicate.from(remoteCouch, opts).on("active",function(){
  //   newAlert("success","active");
  // });
  //mysync();

// window.onload = function(){
//   getPD();
// };
$(document).ready(function(){
  var override;
  var fieldArray = [];
  var pd_data;

  $.couch.session({
    success: function(data) {
      if(!data) window.location.href = "index.html";
      else {
        pd_data = data;
        getReplicationMasterSource();
        generateDueTaskNotification();
      }  
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });

  // $("#practice_dashboard_link").click(function () {
  //   $('.pd').hide('slow');
  //   resetmenu();
  //   getNotifications(pd_data._id);
  // });

  // $("body").on("click",".back_to_critical_list", function() {
  //   $(".tab-pane").removeClass("active");
  //   $("#my_account").addClass("active");
  //   $("#personal_details_in").addClass("active");
  //   $("#home").addClass("active");
  //   $("#lab_results_inner").addClass("active");
  //   $('.pd').hide('slow');
  //   resetmenu();
  // });

  // $("#e_prescribe_link").click(function() {
  //   $(".tab-pane").removeClass("active");
  //   $("#e_prescribe").addClass("active");
  //   $("#home").addClass("active");
  //   $("#personal_details_in").addClass("active");
  //   $("#lab_results_inner").addClass("active");
  //   getEprescribe();
  // });

  $("#send_notification").click(function() {
    var d = new Date();
    var doc = {
      insert_ts:         d,
      doctype:           "Appointments",
      reminder_date:     $("#appointment_date").val(),
      reminder_note:     $("#appointment_note").val(),
      reminder_time:     $("#appointment_time").val(),
      reminder_type:     "Alerts",
      user_id:           $("#user_id").val(),
      notification_type: "Appointment",
      read_receipt:      "N",
      doctor_id:         pd_data._id,
      dhp_code:          $("#dhp_code").val(),
      status:            "scheduled"
    };

    $.couch.db(db).saveDoc(doc, {
      success: function(data) {
       $('#notification_modal').modal("hide");
       newAlert('success', 'Appointment notification sent successfully !');
       $('html, body').animate({scrollTop: 0}, 'slow');
      },
      error: function(status) {   
        console.log(status);
      }
    });
  });

  function log( message ) { 
    $( "<div>" ).text( message ).prependTo( "#log" );
    $( "#log" ).scrollTop( 0 );
  }

  $('#personal_details').on('hide.bs.modal', function (e) {
    $("#pdvalidationtext").text("");
  });

  $('#notification_modal').on('hide.bs.modal', function (e) {
    $("#appointment_date").val('');
    $("#appointment_time").val('');
    $("#appointment_note").val('');
    $("#appointment_text").val('');
  });

  $('#createEventModal').on('hide.bs.modal', function (e) {
    $("#reminder_note").val('');
    $("#search_patient_for_appointment").attr("userid","");
  });

  $('#medication_modal').on('hide.bs.modal', function (e) {
    $("#medication_name").val('');
    $("#medication_freq").val('');
    $("#medication_units").val('');
    $("#medication_text").val('');
  });

  $('#reassign_task_modal').on('hide.bs.modal', function (e) {
    $("#reassign_doctor_id").val('');
    $("#reassign_doctor_id").attr('index', '');
    $("#reassign_doctor").val('');
    getTaskList();
    getCompletedTaskList();
  });

  $("body").on("click","#reassign_task",function(){
    reassignTask();
  });

  $("#reassign_doctor").autocomplete({
    search: function(event, ui) {
      $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
        success: function(data) {
          $("#reassign_doctor").removeClass('myloader');
          var newdata = [];
          for(var i = 0;i<data.rows.length;i++){
            if(data.rows[i].id != pd_data._id){
              newdata.push(data.rows[i]);
            }
          }
          response(newdata);
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [pd_data.dhp_code, request.term],
        endkey:   [pd_data.dhp_code, request.term + "\u9999"],
        limit:    5
      });
    },
    minLength: 3,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      $(this).val(ui.item.key[1]);
      $("#reassign_doctor_id").val(ui.item.value);
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { key:['','No results found'],label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.key[1] + "</a>")
      .appendTo(ul);
  };
  $(document).on('focus',".datetime", function(){
    $(this).datepicker({
      dateFormat:      'yy-mm-dd',
      changeMonth:     true,
      changeYear:      true,
      yearRange:       'c-75:c+10',
      showOn:          "both",
      buttonImage:     "images/datetime.gif",
      buttonImageOnly: true,
      buttonText:      "Select date"
    });
    if($(this).attr("id") == "billing_appointment_date"){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"10px",
    	  right:"18px"
    	});
    }else if ($(this).attr("id") == "billing_appointment_date"){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"18px",
    	  right:"6px"
    	});
    }else if ($(this).hasClass('abr_date')){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"17px",
    	  right:"8px"
    	});
    }else if ($(this).hasClass('sbr_date')){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"18px",
    	  right:"5px"
    	});
    }else if ($(this).attr("id") == "drug_start_date" || $(this).attr("id") == "drug_end_date"){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"10px",
    	  right:"-20px"
    	});
    }else if ($(this).attr("id") == "isu_date_of_birth"){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"10px",
    	  right:"-20px"
    	});
    }else if ($(this).attr("id") == "app_start_date" || $(this).attr("id") == "app_end_date"){
    	$(this).parent().css("position","relative");
    	$(this).parent().find("img").css({
    	  position:"absolute",
    	  top:"10px",
    	  right:"-5px"
    	});
    }else{

    }
  });

  $(document).on('focus',".datetime-with-maxdate", function(){
    $(this).datepicker({
      dateFormat:      'yy-mm-dd',
      changeMonth:     true,
      changeYear:      true,
      yearRange:       'c-75:c',
      showOn:          "both",
      buttonImage:     "images/datetime.gif",
      buttonImageOnly: true,
      buttonText:      "Select date",
      maxDate:         0
    });
  });

  $(document).on('focus',".datetime-with-mintoday", function(){
    $(this).datepicker({
      dateFormat:      'yy-mm-dd',
      minDate:         0, 
      changeMonth:     true,
      changeYear:      true,
      yearRange:       "c-75:c+20",
      showOn:          "both",
      buttonImage:     "images/datetime.gif",
      buttonImageOnly: true,
      buttonText:      "Select date",
    });
  });

  $(document).on('focus',".sbr_date", function(){
    $(this).datepicker({
      dateFormat:      'yy-mm-dd',
      changeMonth:     true,
      changeYear:      true,
      yearRange:       "c-75:c+20",
      showOn:          "both",
      buttonImage:     "images/datetime.gif",
      buttonImageOnly: true,
      buttonText:      "Select date",
    });
  });


  //TODO :: create unique format in all datepicker with common function
    $("#billing_due_date").datepicker({
      dateFormat:      'yy-mm-dd',
      minDate:         0,
      changeMonth:     true,
      changeYear:      true,
      yearRange:       'c-75:c+10',      
      showOn:          "both",
      buttonImage:     "images/datetime.gif",
      buttonImageOnly: true,
      buttonText:      "Select date"
    });

    if($("#billing_due_date").attr("id") == "billing_due_date"){
      $("#billing_due_date").datepicker("setDate",new Date());
    }

  $(document).on('focus',".cp-date-range", function(){
    $(this).daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      }
    });
    if($(this).attr("id") == "billing_due_date"){
      $(this).datepicker("setDate",new Date());
    }
    // Since confModal is essentially a nested modal it's enforceFocus method
    // must be no-op'd or the following error results 
    // "Uncaught RangeError: Maximum call stack size exceeded"
    // But then when the nested modal is hidden we reset modal.enforceFocus
  });

  $(document).on('focus',".cp-date-single", function(){
    if(!$('#cp_startdate').val()) {
      newAlert("danger", "Please choose date range First.");
      $("html, body").animate({scrollTop: $("#save_care_plan_tab").offset().top - 50}, 'slow');
      $("#cp_startdate").focus();
      return false;
    }else{
      $(this).daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
        singleDatePicker: true,
        minDate: $('#cp_startdate').data('daterangepicker')? $('#cp_startdate').data('daterangepicker').startDate : new Date(),
        maxDate: $('#cp_startdate').data('daterangepicker')? $('#cp_startdate').data('daterangepicker').endDate: new Date()
      });  
    }
  });
  
  $("#appointment_time").timepicker({ampm: false,hourMin: 0,hourMax: 23});

  $(".generic_report_freq, .report_freq, .cp_report_freq, .patient_cp_report_freq").click(function(){
    $("." + $(this).attr("class")).not($(this)).removeAttr("checked");
  });

  $(document).on('focus',".datetime-with-mintoday-not-img", function(){
    $(this).datepicker({
      dateFormat:      'yy-mm-dd',
      minDate:         0, 
      changeMonth:     true,
      changeYear:      true,
      yearRange:       "c-75:c+20"
    });
  });

  //no element found for below selector
  // $("body").on("click",".timeline_chartnote",function(){
  //   $.couch.db(db).openDoc($(this).attr("index"), {
  //     success: function(data) {
  //      $("#doctor_note_modal").modal("show");
  //      $("#tl_doctor_note_title").html(data.visit_type+"<b>&nbsp;/&nbsp;</b>&nbsp;Dr.&nbsp;"+data.doctor_name);
  //      $("#tl_subjective").html(data.subjective);
  //      $("#tl_objective").html(data.objective);
  //      $("#tl_assessment").html(data.assessment);
  //      $("#tl_plan").html(data.plan);
  //      // $("#tl_complaints").html(data.complaints.toString());
  //      // $("#tl_diagnoses").html(data.diagnoses.toString());
  //      $("#tl_doctor_note_time").html(data.insert_ts);
  //     },
  //     error: function(status) {
  //       console.log(status);
  //     }
  //   });
  // });

  //no element found for below selector
  // $("#past_history_new").on("click",".timeline_lab", function(){
  //   $.couch.db(db).openDoc($(this).attr("index"), {
  //       success: function(data) {
  //        $('#lab_result_modal').modal("show");
  //        $("#tl_lab_result_title").html("Lab&nbsp;:&nbsp;"+data.Title);
  //        $("#tl_exam_name").html(data.Exam_Name);
  //        $("#tl_lab_time").html(data.Insert_TS);
  //       },
  //       error: function(status) {
  //         console.log(status);
  //       }
  //   });
  // });

  $("#ia_save").click(function() {
    saveImaging();
  });

  $("#lab_result_pdf").hide();

  //no element found for following selector
  // $("#phs_clear").click(function() {
  //   clearPhSearchForm();
  // });

  // $("#misc_document_form").submit(function(e) {
  //   saveMiscDocument();
  // });

  //Charting Template Js starts Here

  //autocompleter ends
  $("#dc_template_list_parent").on("click",".dc-ctemplate-display-toggle-section",function(){
    $(this).parent().next().slideToggle();
    if($(this).hasClass('glyphicon-minus-sign')){
      $(this).removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
    }else{
      $(this).removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
    }
  });

  //Charting Template Js ends Here
  //no element found for following selector
  $("#past_history_new").on("click",".chk-tl-records",function(e){
    if($(".chk-tl-records").find("input:checked").length > 0){
      $("#tl_print_multiple").show();
    }else{
      $("#tl_print_multiple").hide();
    }
    e.stopPropagation();
  });

  // $("#past_history_tab_link").on('click', function() {
  //   $(".tab-pane").removeClass("active");
  //   $("#home").addClass("active");
  //   $("#personal_details_in").addClass("active");
  //   $("#lab_results_inner").addClass("active");
  //   $("#summary_tab").addClass('active');
  //   $("#timeline_tab").removeClass('active');
  //   $('#past_history_new').addClass('active');
  //   getNewCommunicationHistoryDetails();
  // });

  //no elements found for below selector
  $("body").on("click",".cmn-remove-screening-vaccine",function(){
    $(this).parent().remove();
  });

  // $("#e_billing").on("click","#invoice_print",function(){
  //   invoicePrint();
  // });
  
  $("body").on("change","#single_user_alerts",function(){
    if(this.checked){
      $("#single_user_alerts_option_parent").show();
    }else{
      $("#single_user_alerts_option_parent").hide();
    }
  });

  $("body").on("change","#single_user_reports",function(){
    if(this.checked){
      $("#single_user_reports_frequency_parent").show();
    }else{
      $("#single_user_reports_frequency_parent").hide();
    }
  });

  $("body").on("change","#user_by_dhp_alerts",function(){
    if(this.checked){
      $("#user_by_dhp_alerts_option_parent").show();
    }else{
      $("#user_by_dhp_alerts_option_parent").hide();
    }
  });

  $("body").on("change","#user_by_dhp_reports",function(){
    if(this.checked){
      $("#user_by_dhp_reports_frequency_parent").show();
    }else{
      $("#user_by_dhp_reports_frequency_parent").hide();
    }
  });

  $("#userpic_edit").on("click", function() {
    $('#userpic_edit_modal').modal("show");
  });

  $("#userpic_edit_modal").submit(function(e) {
    $("#userpic_edit_save").attr("disabled","disabled");
    e.preventDefault();
    if($("#profile_pic_flag").val() == "upload-picture"){
      saveUserPic();
    }else if($("#profile_pic_flag").val() == "take-a-picture"){
      saveUserPicFromWebcam();
    }else{
      $("#userpic_edit_save").removeAttr("disabled");
      newAlert("danger","Please select option for upload Picture");
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  });

  $("#userpic_edit_modal").on("click",".take-picture",function(){
    enableWebCam("my_camera", 150, 150, 150, 150, 150, 150, userProfilePicWebCamOn, userProfilePicWebCamError);
  });

  $("body").on("click","#upload_files_from_webcam",function(){
    enableWebCam("upload_file_camera", 300, 240, 640, 480, 640, 480, uploadFilesWebCamOn, uploadFilesWebCamError);
  });
 
  $("#userpic_edit_modal").on("click",".upload-picture",function(){
    showInputForProfilePicUpload($(this));
  });

  $('#userpic_edit_modal').on('hide.bs.modal', function (e) {
    resetUserPicModal();
  });

  $('body').on("show.bs.modal","#subscriber_alerts_reports_modal",function(){
    subscriberAlertsReportsModal();
  });

  $("#tir_send").on("click", function() {
    saveTelemedicineResponse();
  })

  $("#my_account").on("click","#search_click_toggle",function(){
    togglePatientSearch();
  });

  $('.modal-backdrop').click(function(){
    $(this).hide();
  });
  
  $('#downarrow').click(function(){
    $('#signmenu').toggleClass('slow');
   // $('#signmenu').slideToggle('slow');
  });

  $("#consultant_details").on("click","#add_consultant, .edit_consultant",function(){
    openConsultantModal($(this));
  });

  $("#add_consultant_modal").on("click","#save_consultant",function(){
    createSaveRequestForConsultant();
  });

  $("#consultant_details").on("click",".remove_consultant",function(){
    removeConsultantModal($(this));
  });

  $("body").on("click","#delete_consultant_confirm",function(){
    removeConsultant($(this));
  });

  $('#add_consultant_modal').on('hide.bs.modal', function (e) {
    clearAddConsultantDetails();
  });

  $(window).resize(function() {
    if($(window).innerWidth() <= 320){
      $('#mytabs').css('top','523px');
    }
  });

  $('#charting_medicalinfo_model').on('show.bs.modal', function (e) {
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
  });
  
  window.setInterval(function(){ getNotificationsMassege(); }, 60000);

  // $("body").on("click","#upload_files_modal",function(){
  //   showUploadFilesModal();
  // });

  $("body").on("click","#upload_patient_files",function(){
    uploadPatientFiles();
  });

  $("body").on("change","#patient_uploaded_file",function(){
    getPatientUploadedImage(this);
  });

  $("body").on("change","#patient_upload_file_preference",function(){
    displayPatientReportsInputs();
  });

  $("body").on("change","#upload_document_type",function(){
    toggleCategoryForPatientReportsInputs();
  });
  
  $("body").on("click", "#upload_files_from_computer", function(){
    showInputToUploadFile();
  });

  $("body").on('show.bs.modal', '#upload_files_modal', function (e) {
    clearUploadFilesModal();
  });

  $("body").on('hide.bs.modal', '#upload_files_modal', function (e) {
    if($("#upload_file_pre_take_buttons_parent").css("display") != "none"){
      Webcam.reset();
    }

    if($("#critical_patient_link").hasClass("ChoiceTextActive")) {
      $(".action_to_patient").val("Select Action");
    }
    $(".action_to_patient").val("Select Action");
  });

  $("body").on("click" ,"#health_management_click", function(){
    //getNotificationsMassege();
    //notificationConfiguration("","","","Appointment");
  });
  // $('ul.charts-tabs li a').click(function(){
  //   tabDisplayInPatientDashboard($(this));
  // });
  
  //no element found for below selector
  // $("#imagingbycity").on("click",".imagingcity",function(){
  //   getSelectedImagedata($(this));
  // });   

  // $("body").on("click","#daily_dashboard",function(){
  //   getDailyDashboardDetails();
  // });
  
  
  Number.prototype.between = function(a, b, inclusive) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return inclusive ? this >= min && this <= max : this > min && this < max;
  };

});