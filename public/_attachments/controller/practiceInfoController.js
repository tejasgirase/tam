var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};
var plController = {};

app.controller("practiceInfoController",function($scope,$state,$stateParams,$location,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(!data) window.location.href = "index.html";
      else {
        $("#personal_details_in_link").closest(".panel").block({message: "Please Wait..."});
        pd_data = data;
        $scope.level = data.level;
        $scope.admin = data.admin;
        $scope.$apply();
        displayPracticeInfo();
        tamsaFactories.displayDoctorInformation(pd_data);
        if($stateParams.user_id){
          displaySearchPatient($stateParams.user_id);
        }  
        tamsaFactories.pdBack();
        eventBindingsForPracticeInfo();
        tamsaFactories.sharedBindings();
        $("#personal_details_in_link").closest(".panel").unblock();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });

  function setPD(name) {
    pd_data = data;
    displayPracticeInfo();
    // tamsaFactories.displayDoctorInformation(pd_data);
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
  }

  function displayPracticeInfo(){
    activatePersonalDetails();
  }

  function activatePersonalDetails(){
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#personal_details_in_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#personal_details_in_link").addClass("ChoiceTextActive");
    $("#personal_details_in").addClass("active");
    $("#first_name").val(pd_data.first_name);
    $("#last_name").val(pd_data.last_name);
    $("#pdemail").val(pd_data.email);
    $("#pdemailalert").val(pd_data.alert_email);
    $("#pdphone").val(pd_data.phone);
    $("#pdphone").data("userphoneval",pd_data.phone)
    $("#pdphonealert").val(pd_data.alert_phone);
    $("#pdqualification").val(pd_data.qualification ? pd_data.qualification : "");
    $("#pdexperience").val(pd_data.experience ? pd_data.experience : "");
    getAllExistingSpecializationList("pdspecialization");
    $("#critical_alerts_medium").val(pd_data.critical_alerts_medium);
    $("#reports_medium").val(pd_data.reports_medium);
    $("#pdspecialization").val(pd_data.specialization);
    $("#pdhospital").val(pd_data.hospital_affiliated);
    $("#pdhospitaltype").val(pd_data.hospital_type);
    $("#pdcity").val(pd_data.city);
    $("#pdcountry").val(pd_data.country);
    $("#pdstate").val(pd_data.state);
    $("#dhp_code").val(pd_data.dhp_code);
    $("#pdhospital_phone").val((pd_data.hospital_phone?pd_data.hospital_phone:""));
    $("#pdhospital_email").val((pd_data.hospital_email?pd_data.hospital_email:""));
    $("#pdhospital, #pdhospitaltype, #pdcity, #pdcountry, #pdstate, #dhp_code").attr('readonly','readonly');
    $("#hospital_type").attr('disabled','disabled');
    $("#pdnetwork").prop("checked",pd_data.doctors_network);
    $("#pdsave").data("index",pd_data._id);
    $("#pdsave").data("rev",pd_data._rev);
  }

  function activateSubUserDetails(){
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#sub_users_list").addClass("active");
    $("#users_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#users_link").addClass("ChoiceTextActive");
      clearSubUserFilter();
      getSubUsers();
  }

  function clearSubUserFilter(){
      $("#filter_by_level").val("Select");
      $("#filter_by_active").val("Select");
      $("#filter_by_admin").val("Select");
      $("#filter_by_insert_ts").val("");
      $("#filter_by_update_ts").val("");
  }

  function activateDocumentsList(){
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#documents").addClass("active");
    $("#documents_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#documents_link").addClass("ChoiceTextActive");
    getDocuments();
  }

  function activateMiscDocumentsList(){
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#misc_document").addClass("active");
    $("#misc_document_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#misc_document_link").addClass("ChoiceTextActive");
    getMiscDocuments();
  }

  function activateAudit() {
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#audit_tab").addClass("active");
    $("#audit_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#audit_link").addClass("ChoiceTextActive");
    getAuditRecords("5","0");
  }

  function activatePracticeInfoSettings(){
    $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#settings_tab").addClass("active");
    $("#practice_info_settings_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#practice_info_settings_link").addClass("ChoiceTextActive");
    $("#setting_results_inner").show();
     $("#setting_results_inner_category").hide();
    $(".setting_hide").hide();

    $(".settings-section-name").parent().next().hide();
    if($(".settings-section-name").hasClass('glyphicon-minus-sign')){
      $(".settings-section-name").removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
    }
  }

  function clearAuditFilter(){
    $("#filter_by_audit_area, #filter_by_audit_action").val("Select");
    $("#filter_by_audit_date, #filter_by_audit_doctor, #filter_by_audit_patient").val('');
    getAuditRecords("5","0");
  }
  function getSubUserRecords(){
    $("#subuser_pagination").html('');
    $.couch.db(replicated_db).list("tamsa/getSubUserRecordsByFilter" , "getSubUsers",{
      startkey:         [pd_data._id,{}],
      endkey:           [pd_data._id],
      descending:       true,
      include_docs:     true,
      filter_level:     $("#filter_by_level").val(),
      filter_admin:     $("#filter_by_admin").val(),
      filter_active:    $("#filter_by_active").val(),
      filter_insert_ts: $("#filter_by_insert_ts").val(),
      filter_update_ts: $("#filter_by_update_ts").val()
    }).success(function(data) {
        if(data.rows.length > 0){
          paginationConfiguration(data,"subuser_pagination",10,displaySubUsers); 
        }else{
          var sub_users_table = [];  
          sub_users_table.push('<tr><td colspan="8">No Sub User are Found.</td></tr>');
          $("#sub_users_table tbody").html(sub_users_table.join(''));
        }
    });
  }
   
  function eventBindingsForPracticeInfo(){
    patientInfoEventBindings();
    showBSModalEvent("add_charting_template_images_modal",clearAddChartingTemplateImagesModal);
    $("#personal_details_tab").on("change","#la_state",function(){
      getCities($("#la_state").val(), "la_city");
    });
    
    $("#personal_details_tab").on("click","#clear_audit_filter",function(){
      clearAuditFilter();
    });
    

    $("#personal_details_tab").on("click","#click_toggle_last",function(){
      if($("#clk_toggle_lbl_last").html() == "Specialization list"){
        $("#pdspecialization").show();
        $("#pdspecializationatext").hide();
        $("#clk_toggle_lbl_last").html("Add New Specialization");
      }else{
        $("#pdspecialization").hide();
        $("#pdspecializationatext").show().val("");
        $("#clk_toggle_lbl_last").html("Specialization list");
      }
    });

    $("#personal_details_tab").on("change","#filter_by_audit_area, #filter_by_audit_action, #filter_by_audit_date",function(){
      getAuditRecords("5","0");
    });
    $("#personal_details_tab").on("change","#filter_by_active, #filter_by_admin,#filter_by_insert_ts,#filter_by_update_ts,#filter_by_level",function(){
      getSubUserRecords();
    });

    searchDHPDoctorsList("filter_by_audit_doctor",autocompleterSelectForDoctorsListOnAuditRecords,pd_data.dhp_code);
    searchDHPPatientByNameAutocompleter("filter_by_audit_patient",autocompleterSelectEventForSubscriberListOnAuditRecords,false,pd_data.dhp_code);
    
    $("#personal_details_tab").on("change",".d-type",function(){
      toggleLabResultCategory($(this));
    });

    // if (pd_data.admin && pd_data.admin.toUpperCase() != "YES") {
    //   $("#sub_users_list").remove();
    //   $("#users_link").parent().remove();
    //   // if (pd_data.admin.toUpperCase() == "YES") {
    //   //   getSubUsers();
    //   // }
    // }

     

    $("#personal_details_tab").on("click","#practice_info, #personal_details_in_link",function(){
      activatePersonalDetails();
    });

    $("#personal_details_tab").on("click","#documents_link",function(){
      activateDocumentsList();
    });

    $("#personal_details_tab").on("click","#pdsave",function(){
      if (validatePdSave()) {
        $("#pdsave").attr("disabled","disabled");
        var specialization = "";
        if($("#pdspecialization").val() != "Select Specialization"){
          specialization = $("#pdspecialization").val();
        }else{
          specialization = $("#pdspecializationatext").val();
        }
        var doc = {
          doc_id:                 pd_data._id,
          alert_email:            $("#pdemailalert").val(),
          alert_phone:            $("#pdphonealert").val(),
          city:                   $("#pdcity").val(),
          country:                $("#pdcountry").val(),
          doctors_network:        $("#pdnetwork").is(':checked'),
          email:                  $("#pdemail").val(),
          dhp_code:               $("#dhp_code").val(),
          hospital_affiliated:    $("#pdhospital").val(),
          hospital_type:          $("#pdhospitaltype").val(),
          hospital_phone:         $("#pdhospital_phone").val(),
          hospital_email:         $("#pdhospital_email").val(),
          name:                   $("#pdemail").val(),
          first_name:             $("#first_name").val(),
          last_name:              $("#last_name").val(),
          derived_key:            pd_data.derived_key,
          phone:                  $("#pdphone").val(),
          roles:                  [],
          password_scheme:        pd_data.password_scheme,
          specialization:         specialization,
          qualification:          $("#pdqualification").val(),
          experience:             $("#pdexperience").val(),
          state:                  $("#pdstate").val(),
          salt:                   pd_data.salt,
          iterations:             pd_data.iterations,
          type:                   'user',
          critical_alerts_medium: $("#critical_alerts_medium").val(),
          reports_medium:         $("#reports_medium").val(),
          random_code:            pd_data.random_code
        };

        if($("#pdphone").val() != $("#pdphone").data("userphoneval")){
          $.couch.db(replicated_db).view("tamsa/getUserPhone",{
            success: function (data){
              if(data.rows.length > 0){
                newAlert("danger", "User with given Phone number is already exist.");
                $('html, body').animate({scrollTop: $("#pdphone").offset().top - 100}, 1000);
                $("#pdsave").removeAttr("disabled");
                return false;
              }else{
                $("#pdsave").removeAttr("disabled");
                saveAccountDetails(doc);
              }
            },
            error: function (data,error,reason){
              newAlert("danger", reason);
              $('html, body').animate({scrollTop: $("#pdphone").offset().top - 100}, 1000);
              $("#pdsave").removeAttr("disabled");
              return false;
            },
            key:$("#pdphone").val().trim()
          });
        }else{
          saveAccountDetails(doc);
          $("#pdsave").removeAttr("disabled");
        }
      }
    });

    $("#personal_details_tab").on("click","#users_link",function(){
      activateSubUserDetails();
    });
    //setting page event bindings
    var zone = new FileDrop('zbasic');
    zone.event('send', function (files) {
      files.images().each(function (file) {
        file.readDataURI(function (uri) {
          document.getElementById("preview_image").style.display = "block";
          document.getElementById("preview_image").src = uri;
        });
      });
    });

    $("#personal_details_tab").on("change","#su_level", function(){
      onChangeCheckboxDesiable();
    });

    $("#personal_details_tab").on("click","#su_save",function(){
      $("#su_save").attr("disabled","disabled");
      var pwd = $("#su_password").val();
      var nospace = /\s/g;
      
      if ($("#su_save").attr('index') && $("#su_save").attr('rev')) {
        if(subUserValidation("edit")){
          saveSubUser("edit");
          $("#su_save").removeAttr("disabled");
        }else{
          $("#su_save").removeAttr("disabled");
          return false;
        }
      }else{
        if(subUserValidation("save")){
          saveSubUser("save");
          $("#su_save").removeAttr("disabled");
        }else{
          $("#su_save").removeAttr("disabled");
          return false;
        }
      }
    });

    $("#personal_details_tab").on("click",".edit_sub_user",function() {
     $.couch.db(replicated_db).openDoc($(this).attr("index"), {
          success: function(data) {
            $("#su_passform").hide();
            $("#su_first_name").val(data.first_name);
            $("#su_last_name").val(data.last_name);
            $("#su_phone_number").val(data.phone);
            $("#su_phone_number").data("phoneval",data.phone);
            $("#su_email").val(data.email);
            $("#su_email").attr("emailval",data.email);
            $("#su_level").val(data.level);
            if(data.level == "Front Desk"){
              $("#su_admin").val("No");
              $("#su_admin").attr("disabled","disabled");
            }else{
              $("#su_admin").val(data.admin);
              $("#su_admin").prop("disabled",false);
            }
            $("#su_active").val(data.active);
            $("#su_save").attr("index", data._id);
            $("#su_save").attr("rev", data._rev);
          },
          error: function(status) {
            console.log(status);
          }
      });
    });

    $("#personal_details_tab").on("click","#delete_sub_user_confirm",function(){
      deleteSubUser();
    });

    $("#personal_details_tab").on("click",".delete_sub_user", function() {
      deleteSubUserSetIndex($(this));
    });

    $("#personal_details_tab").on("click", ".password_reset_user", function(event) {
      $("#rp_sub_user_save").attr("index", $(this).attr("index"));
    });

    $("#personal_details_tab").on("click","#rp_sub_user_save",function(){
      resetPasswordSubUser();
    });
    
    $("#personal_details_tab").on("click","#add_sub_user",function(){
      $("#su_email").data("emailval","");
      $("#su_phone_number").data("phoneval","");
    });

    $("#personal_details_tab").on("click","#clear_user_filtere",function(){
      clearSubUserFilter();
      $("#filter_by_insert_ts").trigger("change");  
    });

    $("#personal_details_tab").on("click","#save_document",function(){
      $("#save_document").attr("disabled","disabled");
      createSaveDocument();
    });

    $("#personal_details_tab").on("click","#add_document",function(){
      openAddDocumentModal();
    });  

    $('#add_document_modal').on('hide.bs.modal', function (e) {
      clearDocumentForm();
    });

    $("#add_document_modal").on("show.bs.modal",function () {
      $("#save_document").data( { uploadDocsId: [], uploadDocsRev:[], uploadTaskId:[], uploadTaskRev:[]} );
    });

    $("#document_modal_close").click(function() {
      $("#save_document").removeClass("ajax-loader-large");
      $("#document_save_label").css("visibility","visible");
      deleteHalfSavedDoc();
    });

    $("#personal_details_tab").on("change",".task_list_row", function() {
      changeTaskStatus($(this));
    });

    $("#personal_details_tab").on("click","#d_patient_click_toggle",function(){
      toggleSearchForPatientDocument();
    });

    $("#personal_details_tab").on("click",".add-more-documents", function(){
      addMoreDocuments();
    });

    $("#personal_details_tab").on("click",".delete-document", function() {
      deleteDocuments($(this),"add-more-documents-parent");
    });

    $("#personal_details_tab").on("click","#add_misc_document",function(){
      $('#add_misc_document_modal').modal({
        show:true,
        backdrop:'static',
        keyboard:false
      });
    });
   
    $("#personal_details_tab").on("click","#misc_document_modal_close",function(){
      deleteHalfSavedMiscDoc();
    }); 

    $("#personal_details_tab").on("click","#misc_document_link",function(){
      activateMiscDocumentsList();
    });

    $("#personal_details_tab").on("click",".remove-misc-doc",function(){
      removeMiscDocumentsConfirm($(this));
    });

    $("#personal_details_tab").on("click","#delete_mics_document_confirm",function(){
      removeMiscDocuments($(this)); 
    });

    $("#personal_details_tab").on("click","#misc_document_save",function(){
      $("#misc_document_save").attr("disabled","disabled");
      createMiscDocument();
    });

    $('#add_misc_document_modal').on('hide.bs.modal', function (e) {
      clearMiscDocumentForm();
    });

    $("#add_misc_document_modal").on("show.bs.modal",function () {
      $("#misc_document_save").data( { uploadMiscDocsId: [], uploadMiscDocsRev:[]} );
    });

    $("#personal_details_tab").on("click",".add-more-misc-documents", function() {
      addMoreMISCDocuments();
    });

    $("#personal_details_tab").on("click",".delete-misc-document", function() {
      deleteDocuments($(this),"add-more-misc-documents-parent");
    });

    $("#personal_details_tab").on("click","#audit_link", function() {
      activateAudit();
    });

    //setting tab event bindings start
    $("#personal_details_tab").on("click","#practice_info_settings_link",function(){
      activatePracticeInfoSettings();
    });

    $("#personal_details_tab").on("click", ".setting_section_row", function(){
      toggleSettingSectionRow($(this));
    });

    $("#personal_details_tab").on("click","#add_favourite_medication",function(){
      $("#add_new_favourite_medication").data("index","");
      $("#more_medication_add").show();
      clearMedicationModule();
      createModal("add_favourite_medication_modal");
    });

    $("#personal_details_tab").on("click","#add_new_favourite_medication",function(){
      addNewFavouriteMedication($(this).attr("index"));
    });

    $("#personal_details_tab").on("click","#more_medication_add",function(e){
      e.preventDefault();
      addMoreMedicationHtml();
    });

    $("#personal_details_tab").on("focus","#search_medication_by_name",function(e){
      e.preventDefault();
      drugNameAutocompleter($(this));
    });
    $("#personal_details_tab").on("click",".edit_favourite_medication",function(e){
      e.preventDefault();
      clearMedicationModule();
      $("#more_medication_add").hide();
      $("#medication_name").val($(this).parent().parent().find(".name_medication").html());
      $("#medication_disperse").val($(this).parent().parent().find(".disperse_medication").html());
      $("#medication_unit").val($(this).parent().parent().find(".unit_medication").html());
      $("#medication_doce").val($(this).parent().parent().find(".dose_medication").html());
      if($(this).parent().parent().find(".route_medication").html() != "NA"){
        $("#medic_route").val($(this).parent().parent().find(".route_medication").html());
      }
      var index = $(this).attr("index");
      $("#add_new_favourite_medication").data("index",index);
      createModal("add_favourite_medication_modal");
    });

    $("#personal_details_tab").on("click",".delete_favourite_medication",function(e){
      e.preventDefault();
      var index = $(this).attr("index");
      createModal("medication_delete_modal"); 
      $("#medication_delete_confirm").data("index",index);
    });

    $("#personal_details_tab").on("click","#medication_delete_confirm",function(e){
      e.preventDefault();
      $.blockUI({
        message: '<h1>Please Wait........</h1>',
        css:{
          color: "#f2bb5c"
        }
      });
      var index = $(this).data("index");
      deleteFavouriteMedication(index);

    });



    $("#personal_details_tab").on("click","#setting_back_button",function(){
      $(".tab-pane").removeClass("active");
    $("#personal_details_tab").addClass("active");
    $("#settings_tab").addClass("active");
    $("#practice_info_settings_link").parent().parent().find("li").removeClass("active");
    $("#practice_info_settings_link").parent().addClass("active");
    $("#setting_results_inner").show();
    $("#setting_results_inner_category").hide();
    $(".setting_hide").hide();

    $(".settings-section-name").parent().next().hide();
    if($(".settings-section-name").hasClass('glyphicon-minus-sign')){
      $(".settings-section-name").removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
    }
    });

    $("#personal_details_tab").on("click","#change_password",function(){
      changeUserPassword();
    });

    $("#personal_details_tab").on("click","#is_save", function() {
      initiateSaveInvoiceSettings();
    });

    $("#personal_details_tab").on("click","#is_save_print", function() {
      initialSavePrintSetting();
    });

    $("#personal_details_tab").on("click", "#is_preview", function() {
      previewInvoiceSetting();
    });

    $("#personal_details_tab").on("change","#include_logo",function(){
      showUploadLogoInput();
    });

    $("#personal_details_tab").on("change","#include_header",function(){
      getIncludeHeaderValue();
    });
    
    $("#personal_details_tab").on("change", "#invoice_address_states", function() {
      getCities($(this).val(),"invoice_address_city","select city");
    });

    $("#personal_details_tab").on("change","#choose_diagnosis_procedure",function(){
      displayDiagnosisProcedure($(this).val());
    });

    $("#personal_details_tab").on("click","#add_more_diagnosis_procedure",function(){
      addMoreDiagnosisProcedure();
    });

    $("#personal_details_tab").on("click",".remove-procedure-diagnosis",function(){
      removeProcedureDiagnosis($(this));
    });

    $("#personal_details_tab").on("click",".edit-procedure-diagnosis",function(){
      editProcedureDiagnosis($(this));
    });

    $("#personal_details_tab").on("click","#save_procedure_diagonosis",function(){
      saveEditedProcedureDiagnosis($(this));
    });

    $("#personal_details_tab").on("click",".send_hospital_doc",function(){
      sendHospitalDocumentToDoctor($(this));
    });

    $("#personal_details_tab").on("click","#save_communication_setting",function(e){
      e.preventDefault();
      saveCommunicationSetting();
    });

    $("#personal_details_tab").on("change","#immunization_name",function(){
      getImmunizationDetails($(this));
    });

    $("#personal_details_tab").on("click","#set_default_rules",function(){
      setSelectedImmunizationRuleToDefault();
    });
    $("#personal_details_tab").on("click","#save_immunization_setting",function(){
      saveImmunizationSetting();
    });

    $("#personal_details_tab").on("change","#show_template",function(){
      if($("#show_template").is(":checked")){
        getDoctorListForChartnote();
      }else{
        $(".show_doctor_list_template").hide();
      }
    });

    $("#personal_details_tab").on("click","#add_new_charting_templates_images",function(){
      addChartingImageConfiguration();
    });

    
    $("#personal_details_tab").on("click","#click_toggle_third",function(){
      if($("#clk_toggle_lbl_third").html() == "to add new"){
        if($("#save_charting_template_images").data("rowObj") != ""){
          $("#charting_template_image_specialization_by_text").show();
          $("#charting_template_image_specialization").hide();
          $("#clk_toggle_lbl_third").html("select form list");  
        }else{
          $("#charting_template_image_specialization").hide();
          $("#charting_template_image_specialization_by_text").show();
          $("#clk_toggle_lbl_third").html("select form list");  
        }
        
      }else{
        if($("#save_charting_template_images").data("rowObj") != ""){
          $("#charting_template_image_specialization_by_text").hide();
          $("#charting_template_image_specialization").show();
          $("#clk_toggle_lbl_third").html("to add new");
        }else{
          $("#charting_template_image_specialization_by_text").hide().val("");
          $("#charting_template_image_specialization").show();
          $("#clk_toggle_lbl_third").html("to add new");
        }
        
      }
    });

    $("#personal_details_tab").on("click","#save_charting_template_images",function(e){
      e.preventDefault();
      addChartingTemplateImage();
    });

    $("#personal_details_tab").on("click","#more_medication_remove",function(e){
      e.preventDefault();
      $(this).parent().parent().parent().

      remove();
    });
    
    $("#personal_details_tab").on("keypress","#charting_template_image_width, #charting_template_image_height",function(e){
      return allowOnlyNumbers(e);
    });
    
    $("#personal_details_tab").on("click",".edit-charting-image",function(){
      editChartingImageConfiguration($(this));
    });

    $("#personal_details_tab").on("click",".remove-charting-image",function(){
      removeChartingImageConfiguration($(this));
    });

    $("#personal_details_tab").on("click","#save_charting_template_setting",function(e){
      e.preventDefault();
      saveChartingTemplateSetting();
    });

    $("#personal_details_tab").on("change","#charting_template_image_file",function(){
      getImageDataURIForChartingTemplateImage(this);
    });

    $("#personal_details_tab").on("click","#increment_dose",function(){
      generateNewDoseInImmunization();
    });

    $("#personal_details_tab").on("click","#decrement_dose",function(){
      removeDoseInImmunization();
    });

    $("#personal_details_tab").on("click","#save_e_prescribe",function(){
      saveEprescribe();
    });

    $("#personal_details_tab").on("click","#save_e_billing",function(){
      saveEBilling();
    });

    $("#personal_details_tab").on("click","#save_telemedicine_setting",function(){
      saveTelemedicineSetting();
    });

    $("#personal_details_tab").on("click","#save_misc_setting",function(){
      saveMiscSetting();
    });

    $("#personal_details_tab").on("click","#add_health_alerts",function(){
      addHealthAlertsConfiguration();
    });

    $("#personal_details_tab").on("click","#save_health_alerts_configuration",function(){
      saveHealthAlertsConfiguration();
    });

    $("#personal_details_tab").on("click",".edit-health-alert",function(){
      addHealthAlertsConfiguration($(this));
    });

    $("#personal_details_tab").on("click",".remove-health-alert",function(){
      confirmRemoveAlertConfiguration($(this))
    });

    $("#personal_details_tab").on("click","#include_risk_factors",function(){
      getRiskFactorsForHealthAlerts();
    });

    $("#personal_details_tab").on("change","#health_alert_risk_factors",function(){
      selectRiskFactorsForHealthAlerts();
    });

    $("#personal_details_tab").on("click","#add_health_risk_factor",function(){
      addHealthRiskFactor();
    });

    $("#personal_details_tab").on("click","#back_to_alert_configuration",function(){
      backToAlertConfiguration();
    });

    $("#personal_details_tab").on("click","#set_to_default_health_alerts",function(){
      confirmSetToDefaultHealthAlerts();
    });

    $("#personal_details_tab").on("click","#set_to_default_alerts_yes",function(){
      chooseConfirmActionOnHealthAlerts();
    });

    $("#personal_details_tab").on("click","#set_to_default_alerts_no",function(){
      $("#set_to_default_alerts_modal").modal("hide");
    });

    $("#personal_details_tab").on("click","#save_task_manager_setting",function(){
      saveTaskManagerSettings();
    });

    $("#personal_details_tab").on("click","#add_tags_in_input",function(){
      addTagsIntoPatientTagList();
    });

    $("#personal_details_tab").on("keydown","#taginput_val",function(e){
      if (e.keyCode == 13) addTagsIntoPatientTagList()
    });

    $("#personal_details_tab").on("click","#save_patient_category_tags",function(){
      savePatientCategoryTags();
    });

    $("#personal_details_tab").on("click",".search-result-box",function(){
      getSelectedLabdata($(this));
    });

    $("#personal_details_tab").on("change","#addlab_cities",function(){
      getLabsByCity();
    });

    $("#personal_details_tab").on("click","#addimaging_cities",function(){
      getImagingByCity();
    });

    $("#personal_details_tab").on("change","#lab_imaging_type",function(){
      changeLabImagingType();
    });

    $("#personal_details_tab").on("click","#la_save",function(){
      saveLab();
    });
    
    $('#add_sub_user_modal').on('hide.bs.modal', function (e) {
      clearSubUserForm();
    });

    $("#personal_details_tab").on("click","#add_new_location",function(){
      openModalForAddNewLocation();
    });

    $("#personal_details_tab").on("change","#location_state",function(){
      getCities($("#location_state").val(), "location_city");
    });

    $("#personal_details_tab").on("click","#location_save",function(){
      saveNewLocation();
    });

    $("#personal_details_tab").on("click",".edit-location",function(){
      editLocation($(this).closest("tr"));
    });

    $("#personal_details_tab").on("click",".remove-location",function(){
      removeLocation($(this));
    });

    $("#personal_details_tab").on("click","#remove_location_confirm",function(){
      removeLocationConfirm($(this));
    });

    //Patients Info bindings starts
    $("#personal_details_tab").on("click",".remove-fmh", function() {
      $(this).parents(".fmh-parent").remove();
    });
    
    $("#personal_details_tab").on("click","#save_by_dhp_id",function(){
      addByDhpId();
    });
    
    $("#personal_details_tab").on("click",".add_more_fmh", function() {
      addMoreFMHInAddNewPatient();
    });

    $("#personal_details_tab").on("click","#import_patients_link",function(){
      activateImportPatient();
    });

    $("#personal_details_tab").on("click","#search_patient_link",function(){
      activateSearchPatient();
    });

    $("#personal_details_tab").on("click","#single_user_add",function() {
      activateSingleUserAdd($(this));
    });

    $("#personal_details_tab").on("click","#single_user_by_dhp_id",function() {
      $(this).addClass("btn-warning");
      $("#single_user_add, #import_from_csv").addClass("btn-default").removeClass("btn-warning");
      $("#single_user_by_dhp_id_parent").show();
      $("#import_from_csv_parent,#single_user_add_parent").hide();
      $("#physicians_by_dhp_id option").remove();

      $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
        success: function(data){
          for(var i=0; i<data.rows.length;i++){
            if( data.rows[i].value == pd_data._id || pd_data.level != "Doctor"){
              $("#physicians_by_dhp_id").append("<option selected='selected' value ='"+data.rows[i].value+"'>"+data.rows[i].key[1]+"</option>");
              $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
              $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
            }else{
              $("#physicians_by_dhp_id").append("<option value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
              $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
              $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
            }
          }
        },error: function(data,error,reason){
          console.log(data);
        },
        startkey: [pd_data.dhp_code],
        endkey: [pd_data.dhp_code,{}],
        include_docs:true
      });
    });

    $("#personal_details_tab").on("click","#import_from_csv",function(){
      $(this).addClass("btn-warning").removeClass("btn-default");
      $("#single_user_by_dhp_id, #single_user_add").addClass("btn-default").removeClass("btn-warning");
      $("#import_from_csv_parent").show();
      $("#single_user_by_dhp_id_parent, #single_user_add_parent").hide();
    });

    $("#personal_details_tab").on("focusout","#isu_height, #isu_weight",function(){
      if(isNaN(calculatePatientBMI($("#isu_height").val(),$("#isu_weight").val()))){
        $("#isu_BMI").val("");
      }else{
        $("#isu_BMI").val(calculatePatientBMI($("#isu_height").val(),$("#isu_weight").val()));
      }
    });
    
    $("#personal_details_tab").on("click","#isu_email_not_provided",function(){
      emailNotProvidedToggle($(this));
    });

    searchPatientsByNameOrDHPIdAutocompleter("search_patients_update_profile",autocompleterSelectEventForOnPatientSearch,true,pd_data._id,pd_data.dhp_code,"searchDoctorPatientsByNameOrDHPId", "searchDHPPatientsByNameOrDHPId");

    $("#personal_details_tab").on("click","#update_patient_profile",function(){
      updatePatientProfile();
    });

    $("#personal_details_tab").on("change","#isu_state", function() {
      getCities($("#isu_state").val(), "isu_city", "select city");
    });

    $("#personal_details_tab").on("change","#edit_patient_state", function() {
      getCities($("#edit_patient_state").val(), "edit_patient_city", "select city");
    });

    $("#personal_details_tab").on("click","#age_link",function(){
      if($(this).html() == "Enter Age"){
        $(this).html("Date Of Birth");
        $("#db_label").html("Age*");
        $("#isu_date_of_birth").val("").hide().datepicker("destroy");
        $("#isu_age").show();
      }else{
        $("#db_label").html("Date Of Birth*");
        $("#isu_date_of_birth").show();
        $("#isu_age").hide();
        $(this).html("Enter Age");
      }
    });

    $("#personal_details_tab").on("click","#edit_link",function(){
      if($(this).html() == "Enter Age"){
        $(this).html("Date Of Birth");
        $("#dbl_label").html("Age*");
        $("#issu_date_of_birth").hide().datepicker("destroy");
        $("#issu_age").show();
      }else{
        $("#dbl_label").html("Date Of Birth*");
        $("#issu_date_of_birth").show();
        $("#issu_age").hide();
        $(this).html("Enter Age");
      }
    });

    $('#personal_details_tab').on('click','#import_patient', function(){
      uploadfile();
    });

    $('#personal_details_tab').on('click','#skipped_rows_parent1', function(){
      downloadPatientSkippedRowsCSV($("#skipped_rows_link_patient").data("skip_row"));
    });

    $('#personal_details_tab').on('click','#isu_upload', function(){
      saveSinglePatient($(this),print);
    });

    $('#personal_details_tab').on('click','#isu_save_and_print', function(){
      var print = "print_file";
      saveSinglePatient($(this),print);
    });

    $("#personal_details_tab").on("click","#add_new_one_allergies",function(){
      addOneNewAllergies();
    });

    $("#personal_details_tab").on("click","#remove_add_new_allergiess",function(){
      $(this).parent().remove();
    });

    generateMultiSelect("isu_allergies");
    

    // $("#la_city").autocomplete({
    //   search: function(event, ui) { 
    //      //$('.spinner').show();
    //      $(this).addClass('myloader');
    //   },
    //   source: function( request, response ) {
    //     // pouchdb.query({map:labmap,reduce:"_count"}, {startkey: [$("#lab_imaging_type").val(),pd_data._id,request.term],endkey: [$("#lab_imaging_type").val(),pd_data._id,request.term + "\u9999"],reduce:true,group:true,limit:5}).then(function (data) {
    //     //   $("#la_city").removeClass('myloader');
    //     //   response(data.rows);
    //     // }).catch(function (err) {
    //     //   console.log(err);
    //     // });
    //     $.couch.db(db).view("tamsa/getLabsByCity", {
    //       success: function(data) {
    //         $("#la_city").removeClass('myloader');
    //         response(data.rows);
    //       },
    //       error: function(status) {
    //         console.log(status);
    //       },
    //       startkey: [$("#lab_imaging_type").val(), pd_data._id, request.term],
    //       endkey: [$("#lab_imaging_type").val(), pd_data._id, request.term + "\u9999"],
    //       reduce : true,
    //       group : true,
    //       limit: 5
    //     });
    //   },
    //   minLength: 1,
    //   focus: function(event, ui) {
    //     return false;
    //   },
    //   select: function( event, ui ) {
    //     if( ui.item.key[2] == "No results found"){
    //       $(this).val("").focus();
    //     }else{
    //       $(this).val(ui.item.key[2]);
    //       return false;
    //     }
    //   },
    //   response: function(event, ui) {
    //     if (!ui.content.length) {
    //       var noResult = { key:['','','No results found'],label:"No results found" };
    //       ui.content.push(noResult);
    //       //$("#message").text("No results found");
    //     }
    //   }
    // }).
    // data("uiAutocomplete")._renderItem = function(ul, item) {
    //   return $("<li></li>")
    //     .data("item.autocomplete", item)
    //     .append("<a>" + item.key[2] + "</a>")
    //     .appendTo(ul);
    // };
    //setting tab event bindings end
    getAllExistingSpecializationList("charting_template_image_specialization");
  }

  function getDoctorListForChartnote(udata){
    $("#doctor_list_template").html('');
    $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
      success: function(data){
        if(data.rows.length > 0){
          var doc_list = [];
          for(var i=0; i<data.rows.length;i++){
            if(pd_data.level == "Doctor"){
              doc_list.push("<option value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
            }
          }
          $("#doctor_list_template").html(doc_list.join(''));
          $("#doctor_list_template").multiselect({
             selectedList: 2,
             noneSelectedText: "Select Doctors"
          });
          $("#doctor_list_template").multiselect("refresh");
          $(".show_doctor_list_template").show();
          if(udata){
            if(udata.rows[0].value.chartnote_doctor_list){
              for (var i = 0; i < udata.rows[0].value.chartnote_doctor_list.length; i++){
                  $("#doctor_list_template").multiselect("widget").find(":checkbox[value='"+udata.rows[0].value.chartnote_doctor_list[i]+"']").trigger("click");
              };
            }
          }
        }else{
          newAlert("danger","No doctor available for this hospital");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code,{}],
      include_docs:true
    });
  }

  function addMoreMedicationHtml(){
    var html = [];
    html.push('<div class="row medication_add_section"><div class="col-lg-12"><div style="padding-right: 0px; padding-left: 5px;" class="col-lg-3">Medication Name</div><div class="col-lg-3">Dispered form</div><div class="col-lg-2">Dose</div><div class="col-lg-2">Units</div><div class="col-lg-2">Route</div></div><div class="col-lg-12"><div style="padding-right: 0px; padding-left: 5px;" class="col-lg-3"><input type="text" placeholder="Medication name" id="medication_name" class="form-control medication_name"></div><div class="col-lg-3" style="padding-right: 0px;"><select id="medication_disperse" class="form-control medication_disperse"><option value="">Select</option><option value="Tablet">Tablet</option><option value="Capsule">Capsule</option><option value="Vaccine">Vaccine</option><option value="Syrup">Syrup</option><option value="Other">Other</option></select></div><div class="col-lg-2" style="padding-right: 0px;"><input type="text" placeholder="dose" id="medication_doce" class="form-control medication_doce"></div><div class="col-lg-2" style="padding-right: 0px;"><select style="padding-right: 15px;" id="medication_unit" class="form-control medication_unit" style="padding-right: 9px;"><option value="Select">Select</option><option value="mg">mg</option><option Inteval_valuee="ml">ml</option><option value="drops">drops</option><option value="mcg">mcg</option></select></div><div class="col-lg-2" style="padding-right: 4px;"><input type="text" id="medic_route" class="form-control medic_route" placeholder="Route"></div><small><span class="pointer theme-color" id="more_medication_remove" style="margin-left: 23px">Remove</span><span id="clk_toggle_lbl_third"></span></small></div></div>');
    $("#medication_add_parent ").append(html.join(''));
  }

  function addNewFavouriteMedication(index){
    if(validationSaveFavouriteMedication()){
      $.blockUI({
        message: '<h1>Please Wait........</h1>',
        css:{
          color: "#f2bb5c"
        }
      });
      var medication_doc = generateBulkFavouriteMedication();
      console.log(medication_doc);
      $("#add_favourite_medication_modal").modal("hide");
      saveMedicationBulksDocs(medication_doc,"favourite");
      plController.getMedicationList();
    }
  }

  function generateBulkFavouriteMedication(){
    var medication_bulk_docs = [];
    $(".medication_add_section").each(function(){
      if($("#add_new_favourite_medication").data("index")){
        var medication_doc       = {};
        medication_doc.drug_name = $(this).find(".medication_name").val();
        medication_doc.type      = $(this).find(".medication_disperse").val();
        medication_doc.strength  = $(this).find(".medication_doce").val();
        medication_doc.units     = $(this).find(".medication_unit").val();
        medication_doc.route     = $(this).find(".medic_route").val();
        medication_doc.index     = $("#add_new_favourite_medication").data("index");
        medication_bulk_docs.push(medication_doc);
      }else{
        var medication_doc       = {};
        medication_doc.drug_name = $(this).find(".medication_name").val();
        medication_doc.type      = $(this).find(".medication_disperse").val();
        medication_doc.strength  = $(this).find(".medication_doce").val();
        medication_doc.units     = $(this).find(".medication_unit").val();
        medication_doc.route     = $(this).find(".medic_route").val();
        medication_bulk_docs.push(medication_doc);
      }
    });
  return medication_bulk_docs;
  }

  function onChangeCheckboxDesiable(){
   if($("#su_level").val() == "Front Desk"){
        $("#su_admin").val("No");
        $("#su_admin").attr("disabled","true");
      }else{
        $('#su_admin').prop("disabled", false);
      }
  }

  function autocompleterSelectForDoctorsListOnAuditRecords(ui,search_id){
    if(ui.item.key[1] == "No results found"){
      $("#"+search_id).val("");
    }else{
      $("#"+search_id).val(ui.item.key[1]);
      //$("#"+search_id).data("doctor_id",ui.item.value);
    }
    getAuditRecords("5","0");
  }

  function autocompleterSelectEventForSubscriberListOnAuditRecords(ui,search_id){
    if(ui.item.key[1] == "No results found"){
      return false;
    }else{
      $("#"+search_id).val(ui.item.key[1]);
      // $("#"+search_id).data("user_id",ui.item.key[2]);
      // getUSerDetailsFromUserID(ui.item.key[2]);
    }
    getAuditRecords("5","0");
    return false;
  }

  function saveAccountDetails(doc){
    doc.operation_case = "22";
    doc.processed      = "No";
    doc.doctype        = "cronRecords";
   
    $.couch.db(db).saveDoc(doc, {
      success: function(data) {
        if($("#pdspecialization") == "Select Specialization" && $("#pdspecializationatext").val().trim() != ""){
          updateSpecializationList($("#pdspecializationatext").val().trim());
        }
        newAlert('success', 'Details Saved Successfully');
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#Logedin").text(pd_data.first_name);
        //setPD(pd_data.name);
      },
      error: function(data, error, reason) {
        if (data == '409') {
          newAlert('danger', 'Details were updated already on other device.');
          $('html, body').animate({scrollTop: 0}, 'slow');
        }else if (data == '403'){
          backafter();
          window.location = "index.html";
          setPD(pd_data.name);
        }
        else {
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          setPD(pd_data.name);
        }
      }
    });
  }

  function createMiscDocument(){
    if(validateMiscDocuments()){
      $("#misc_document_save").addClass("ajax-loader-large");
      $("#m_document_save_label").css("visibility","hidden");
      //var n = $(".add-more-misc-documents-parent").length;
      msg = true;
      $(".add-more-misc-documents-parent").each(function(i){
        var d = new Date();
        var document_doc = {
          doctype:           "misc_document",
          insert_ts:         d,
          doctor_id:         pd_data._id,
          dhp_code:          pd_data.dhp_code,
          document_name:     $(this).find(".misc-document-name").val().trim(),
          document_category: $(this).find(".misc-document-category").val()
        };
        saveMiscDocument(document_doc,$(this).find(".misc-document-form"));
      });
    }else{
      $("#misc_document_save").removeClass("ajax-loader-large");
      $("#m_document_save_label").css("visibility", "visible");
      return false;
    }
  }

  function saveMiscDocument(document_doc,$form) {
    $.couch.db(db).saveDoc(document_doc, {
      success: function(data) {
        $("#misc_document_save").data("uploadMiscDocsId").push(data.id);
        $("#misc_document_save").data("uploadMiscDocsRev").push(data.rev);

        $form.find(".misc-document-id").val(data.id);
        $form.find(".misc-document-rev").val(data.rev);
        $("#m_doctor_id").val(pd_data._id);
        $("#m_dhp_code").val(pd_data.dhp_code);

        $form.ajaxSubmit({
          url: "/"+ db + "/" + data.id,
          success: function(response) {
            if($("#add_misc_document_modal").hasClass('in')){
              var id_index = $("#misc_document_save").data("uploadMiscDocsId").indexOf(data.id);
              $("#misc_document_save").data("uploadMiscDocsId").splice(id_index,1);

              var rev_index = $("#misc_document_save").data("uploadMiscDocsRev").indexOf(data.rev);
              $("#misc_document_save").data("uploadMiscDocsRev").splice(rev_index,1);

              if($("#misc_document_save").data("uploadMiscDocsId").length == 0){
                getMiscDocuments();
                successMessage();
              }  
            }
          },
          error: function(data, error, reason) {
            $("#misc_document_save").removeAttr("disabled");
            $("#misc_document_save").removeClass("ajax-loader-large");
            $("#m_document_save_label").css("visibility","visible");
            newAlertForModal('danger', reason, 'add_misc_document_modal');
          }
        });
      },
      error: function(data, error, reason) {
        $("#misc_document_save").removeAttr("disabled");
        $("#misc_document_save").removeClass("ajax-loader-large");
        $("#m_document_save_label").css("visibility","visible");
        newAlertForModal('danger', reason, 'add_misc_document_modal');
      }
    });
  }

  function successMessage(){
    // if(msg){
      $("#misc_document_save").removeClass("ajax-loader-large");
      $("#m_document_save_label").css("visibility", "visible");
      $("#add_misc_document_modal").modal("hide");
        //clearMiscDocumentForm();
      $("#misc_document_save").removeAttr("disabled");
      newAlert('success', 'Saved successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');  
      msg = false;
    //}
  }

  function clearMiscDocumentForm() {
    $(".misc-document-name").val("");
    $(".misc-document-category").val("Legal");
    $(".delete-misc-document").trigger("click");
    $(".misc-document-userfile").val("");
    $(".misc-document-id").val("");
    $(".misc-document-rev").val("");
  }

  function getMiscDocuments() {
    $.couch.db(db).view("tamsa/getMiscDocuments", {
      success: function(data) {
        if(data.rows.length > 0){
          paginationConfiguration(data,"misc_documents_pagination",5,displayMiscDocuments);
        }else{
          var misc_document_table = [];
          misc_document_table.push('<tr><td colspan="2">No Hospital Documents are Found.</td></tr>');
          $("#misc_document_table tbody").html(misc_document_table.join(''));
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code, {}],
      include_docs: true
    });
  }

  function displayMiscDocuments(start,end,data){
    var misc_document_table = [];
    for (var i = start; i < end; i++) {
        var url = "/api/attachment?attachment_name="+Object.keys(data.rows[i].doc._attachments)[0]+"&db="+db+"&id="+data.rows[i].id;
        misc_document_table.push('<tr><td>'+data.rows[i].doc.document_name+'</td><td>'+data.rows[i].doc.document_category+'</td><td align="center"><a href="'+url+'" target="blank"><span class="label label-warning">View</span></a><span class="label label-danger remove-misc-doc pointer" style = "margin-left:10px;" index="'+data.rows[i].doc._id+'" rev ="'+data.rows[i].doc._rev+'">Delete</span></td></tr>');
    };
    $("#misc_document_table tbody").html(misc_document_table.join(''));
  }

  function removeMiscDocumentsConfirm($obj){
    $('#delete_mics_document_confirm').attr('index',$obj.attr('index'));
    $('#delete_mics_document_confirm').attr('rev',$obj.attr('rev'));
    createModal("delete_mics_document_modal");
  }

  function removeMiscDocuments($obj){
    var doc = {
      _id:  $obj.attr("index"),
      _rev: $obj.attr("rev")
    };
    tamsaFactories.deleteDocumentWithCallBack("delete_mics_document_modal",doc,getMiscDocuments);
    /*$.couch.db(db).removeDoc(doc, {
      success: function(data) {
        newAlert('success', 'Document removed Successfully!');
        $('html, body').animate({scrollTop: 0}, 'slow');
        $('#').modal("hide");
        getMiscDocuments();
      },
      error: function(data, error, reason) {
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });*/
  }

  function deleteHalfSavedMiscDoc() {
    if($("#misc_document_save").data("uploadMiscDocsId").length == 0){
      return true;
    }else{
      var len = $("#misc_document_save").data("uploadMiscDocsId").length;
      var docs = [];
      
      for(var i=0;i<len;i++){
        docs.push({
          _id:  $("#misc_document_save").data("uploadMiscDocsId")[i],
          _rev: $("#misc_document_save").data("uploadMiscDocsRev")[i]
        });
      }

      $.couch.db(db).bulkRemove({"docs": docs}, {
        success: function(data) {
          $("#misc_document_save").removeAttr("disabled");
          $("#misc_document_save").removeClass("ajax-loader-large");
          $("#m_document_save_label").css("visibility","visible");
          getMiscDocuments();
        },
        error: function(status) {
          newAlert("danger",reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    }
  }

  function toggleSettingSectionRow($obj) {
    $("#setting_results_inner").hide();
    $("#setting_results_inner_category").show();
    $(".setting_hide").hide();
    $("#old_password_change").val('');
    $("#new_password_change").val('');
    $("#confirm_password_change").val('');
    switch($obj.find('h4').text()) {
      case "Change Password" :
        $('#settingmain_title').html("Change Password");
        $("#setting_change_password").show(); 
        break;
      case "Invoice Settings" :
        $('#settingmain_title').html("Invoice Settings");
        $("#setting_invoice").show();
        getInvoicesettings();
        break;
      case "Communication Settings" :
        $('#settingmain_title').html("Communication Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_communication").show();
        getCommunicationSettings();
        break;
      case "Vaccination Rule" :
        $('#settingmain_title').html("Vaccination Rule");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_vaccination_rule").show();
        getImmunizationSetting();
        break;
      case "Charting Template Settings" :
        $('#settingmain_title').html("Charting Template Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_charting_template").show();
        getChartingTemplateSetting();
        break;
      case "E-Prescribe Settings" :
        $('#settingmain_title').html("E-Prescribe Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_e_prescribe").show();
        getEprescribeSettings();
        break;
      case "Billing Preferance Settings" :
        $('#settingmain_title').html("Billing Preferance Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_billing_preferance").show();
        getEbillingSettings();
        break;
      case "Health Maintenance Alert" :
        $('#settingmain_title').html("Health Maintenance Alert");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_health_alert").show();
        getHealthAlertsConfiguration();
        break;
      case "Task Manager Settings" :
        $('#settingmain_title').html("Task Manager Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_task_manager").show();
        getTaskManagerSettings();
      break;
      case "Tags for Patient categorization" :
        $('#settingmain_title').html("Tags for Patient categorization");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_patient_category_tags").show();
        getPatientCategoryTags();
      break;
      case "Integrations Tab" :
        $('#settingmain_title').html("Integrations Tab");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_integrations_tab").show();
        getIntergrationTabDetails();
      break;
      case "Misc Settings" :
        $('#settingmain_title').html("Misc Setting");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#misc_setting_tab").show();
        getMiscSettings();
      break;
      case "Print Settings" :
        $('#settingmain_title').html("Print Setting");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#print_setting_tab").show();
        printSetting();
      break;
      case "Locations" :
        $('#settingmain_title').html("Location Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#location_setting_tab").show();
        getLocationSettings();
      break;
      case "Telemedicine Settings" :
        $('#settingmain_title').html("Telemedicine Setting");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#setting_telemedicine").show();
        getTelemedicineSettings();
      break;
      case "Medication Settings" :
        $('#settingmain_title').html("Medication Settings");
        $('.OtherExamsTitle').css("margin-bottom","10px");
        $("#medication_tab").show();
        plController.getMedicationList();
      break;
    }
  }

  function clearMedicationModule(){
    $("#medication_add_parent").html("");
    var html = '<div class="row medication_add_section"><div class="col-lg-12"><div style="padding-right: 0px; padding-left: 5px;" class="col-lg-3">Medication Name</div><div class="col-lg-3">Dispered form</div><div class="col-lg-2">Dose</div><div class="col-lg-2">Units</div><div class="col-lg-2">Route</div></div><div class="col-lg-12"><div style="padding-right: 0px; padding-left: 5px;" class="col-lg-3"><input type="text" placeholder="Medication name" id="medication_name" class="form-control medication_name"></div><div class="col-lg-3" style="padding-right: 0px;"><select id="medication_disperse" class="form-control medication_disperse"><option value="">Select</option><option value="Tablet">Tablet</option><option value="Capsule">Capsule</option><option value="Vaccine">Vaccine</option><option value="Syrup">Syrup</option><option value="Other">Other</option></select></div><div class="col-lg-2" style="padding-right: 0px;"><input type="text" placeholder="dose" id="medication_doce" class="form-control medication_doce"></div><div class="col-lg-2" style="padding-right: 0px;"><select style="padding-right: 15px;" id="medication_unit" class="form-control medication_unit" style="padding-right: 9px;"><option value="Select">Select</option><option value="mg">mg</option><option value="ml">ml</option><option value="drops">drops</option><option value="mcg">mcg</option></select></div><div class="col-lg-2" style="padding-right: 4px;"><input type="text" id="medic_route" class="form-control medic_route" placeholder="Route"></div></div></div>'
    $("#medication_add_parent").html(html);
  }

  plController.getMedicationList = function(){
    $("#medication_table tbody").html('');
    $.couch.db(db).view("tamsa/getMedicationList", {
      success: function(data) {
        if(data.rows.length > 0){
          var skip_row = 0;
          var html = [];
          paginationConfigurationMedication(data.rows.length,"medication_records_pagination",15,displayMedicationRecords);
          for (var i = 0; i < 15; i++) {
            html.push('<tr><td class="text-center name_medication">'+data.rows[i].key[1]+'</td><td class="text-center disperse_medication">'+(data.rows[i].key[4] ? data.rows[i].key[4] : "NA")+'</td><td class="text-center dose_medication">'+(data.rows[i].key[2] ? data.rows[i].key[2] : "NA")+'</td><td class="text-center unit_medication">'+(data.rows[i].key[3] ? data.rows[i].key[3] : "NA")+'</td><td class="text-center route_medication">'+(data.rows[i].key[5] ? data.rows[i].key[5] : "NA")+'</td><td class="text-center"><span title="Delete Medication" index="'+data.rows[i].key[6]+'" role="button" class="glyphicon glyphicon-trash delete_favourite_medication"></span><span index="'+data.rows[i].key[6]+'" title="Edit Medication" role="button" class="glyphicon glyphicon-pencil edit_favourite_medication"></span></td></tr>');
          };         
          $("#medication_table tbody").html(html.join(''));
        }else{
          $("#medication_table tbody").html("<tr><td colspan='6'>No record found</td></tr>");
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code,{}, {}, {}],
      reduce : true,
      group : true
    });    
  }

 function paginationConfigurationMedication(len,pagination_div_id,rows_per_page,displayWithPagination,id){
    var limit = rows_per_page;
    $("#"+pagination_div_id).unbind('page');
    var total_rows = parseInt(len / rows_per_page);
    if(len % rows_per_page > 0) total_rows += 1;
    $("#"+pagination_div_id).bootpag({
      total: total_rows,
      maxVisible: rows_per_page
    }).on("page", function(event, /* page number here */ num){
      event.stopPropagation();
      if(id){
        displayWithPagination(rows_per_page*(num -1),rows_per_page,id);
      }else{
        displayWithPagination(rows_per_page*(num -1),rows_per_page);
      }
    });
  }

  function displayMedicationRecords(skip_row,limit){
    var html = [];
    $.couch.db(db).view("tamsa/getMedicationList", {
      success: function(data) {
        if(data.rows.length > 0){
          for (var i = 0; i < data.rows.length; i++) {
            html.push('<tr><td class="text-center name_medication">'+data.rows[i].key[1]+'</td><td class="text-center disperse_medication">'+(data.rows[i].key[4] ? data.rows[i].key[4] : "NA")+'</td><td class="text-center dose_medication">'+(data.rows[i].key[2] ? data.rows[i].key[2] : "NA")+'</td><td class="text-center unit_medication">'+(data.rows[i].key[3] ? data.rows[i].key[3] : "NA")+'</td><td class="text-center route_medication">'+(data.rows[i].key[5] ? data.rows[i].key[5] : "NA")+'</td><td class="text-center"><span title="Delete Medication" index="'+data.rows[i].key[6]+'" role="button" class="glyphicon glyphicon-trash delete_favourite_medication"></span><span index="'+data.rows[i].key[6]+'" title="Edit Medication" role="button" class="glyphicon glyphicon-pencil edit_favourite_medication"></span></td></tr>');
          };         
          $("#medication_table tbody").html(html.join(''));
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [pd_data.dhp_code],
      endkey:   [pd_data.dhp_code,{}, {}, {}],
      skip:     skip_row,
      limit:    limit,
      reduce:   true,
      group:    true
    });
  }

  function deleteFavouriteMedication(index){
    $("#medication_delete_modal").modal("hide");
    $.couch.db(db).view("tamsa/getMedicationList", {
      success: function(data) {
        if(data.rows.length > 0){
          var medicationslist;
          for (var i = 0; i < data.rows[0].doc.medication_list.length; i++) {
            if(i == index){
              data.rows[0].doc.medication_list.splice(i, 1);
              medicationslist = data.rows[0].doc.medication_list;
              break;
            }
          }
          console.log(medicationslist);
          $.unblockUI();
          saveMedication(data,medicationslist);
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey:     [pd_data.dhp_code],
      endkey:       [pd_data.dhp_code,{}, {}, {}],
      reduce:       false,
      include_docs: true
    });
  }

  function getTelemedicineSettings(){
    $.couch.db(db).view("tamsa/getTelemedicineSettings", {
      success:function(data) {
        if(data.rows.length > 0){
          if(data.rows[0].value.vcm_enable){
            $("#vcm_enable").attr("checked","checked");
          }else{
            $("#vcm_enable").removeAttr("checked");
          }
        }else{
          var d    = new Date();
          var doc = {
            insert_ts: d,
            last_update_by:pd_data._id,
            doctype:"telemedicine_setting",
            dhp_code:pd_data.dhp_code,
            vcm_enable:true
          };
          $.couch.db(db).saveDoc(doc,{
            success:function(data){
              console.log(data);
              getTelemedicineSettings();
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
      },
      key:pd_data.dhp_code
    });

  }

  function saveTelemedicineSetting(){
    $.couch.db(db).view("tamsa/getTelemedicineSettings", {
      success:function(data) {
        if(data.rows.length > 0){
          var d   = new Date();
          var doc = {
            _id:        data.rows[0].value._id,
            _rev:       data.rows[0].value._rev,
            insert_ts:  data.rows[0].value.insert_ts,
            last_update_by:  pd_data._id,
            dhp_code:   data.rows[0].value.dhp_code,
            doctype:    data.rows[0].value.doctype,
            update_ts:  d,
            vcm_enable: $("#vcm_enable").is(':checked'),
          }
          $.couch.db(db).saveDoc(doc,{
            success:function(data){
              getTelemedicineSettings();
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
      },
      key:pd_data.dhp_code
    });
  }

  function openModalForAddNewLocation() {
    createModal("add_location_modal");
    clearAddLocationModal();
    getStates("location_state");
    $("#location_save").data("objEle","");
  }

  function clearAddLocationModal() {
    $("#location_primary_address, #location_secondary_address, #location_pincode, #location_email, #location_phone").val("");
    $("#location_state").val("select state");
    $("#location_city").val("select city");
  }

  function saveNewLocation() {
    if(validateNewLocation()) {
      if($("#location_save").data("objEle")) {
        $.couch.db(db).view("tamsa/getLocationSettings", {
          success:function(data) {
            if(data.rows.length > 0) {
              var initialset = $("#location_save").data("initialset");
              var location_data = data.rows[0].doc.location_data;

              data.rows[0].doc.update_ts = new Date();

              for(var i=0;i<location_data.length;i++){
                if(location_data[i].primary_address == initialset.primary_address && location_data[i].secondary_address == initialset.secondary_address && location_data[i].city == initialset.city && location_data[i].state == initialset.state && location_data[i].pincode == initialset.pincode && location_data[i].email == initialset.email && location_data[i].phone == initialset.phone) {
                  location_data[i].primary_address   = $("#location_primary_address").val(),
                  location_data[i].secondary_address = $("#location_secondary_address").val(),
                  location_data[i].city              = $("#location_city").val(),
                  location_data[i].state             = $("#location_state").val(),
                  location_data[i].pincode           = $("#location_pincode").val(),
                  location_data[i].email             = $("#location_email").val(),
                  location_data[i].phone             = $("#location_phone").val(),
                  location_data[i].main_office       = $("#location_main_office").prop("checked")
                  break;
                }
              }
              data.rows[0].doc.location_data = location_data;
              data.rows[0].doc.update_ts     = new Date();
              $.couch.db(db).saveDoc(data.rows[0].doc, {
                success:function(data) {
                  newAlert("success","Successfully Updated");
                  $("html, body").animate({scrollTop : 0}, 'slow');
                  $("#add_location_modal").modal("hide");
                  getLocationSettings();
                },
                error:function(data,error,reason) {
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
          },
          key:pd_data.dhp_code,
          include_docs:true
        });
      }else {
        $.couch.db(db).view("tamsa/getLocationSettings", {
          success:function(data) {
            var location_doc = {
              doctype: "location",
              dhp_code:pd_data.dhp_code,
              insert_ts: new Date()
            };
            if(data.rows.length == 0) {
              var location_data = [];
            }
            else if(data.rows.length == 1) {
              var location_data = data.rows[0].doc.location_data;
              location_doc._id = data.rows[0].doc._id;
              location_doc._rev = data.rows[0].doc._rev;
            }
            else {
              var location_data = [];  
              console.log("multiple location settings are found.");
            }
            location_data.push({
              primary_address:$("#location_primary_address").val(),
              secondary_address:$("#location_secondary_address").val(),
              city:$("#location_city").val(),
              state:$("#location_state").val(),
              pincode:$("#location_pincode").val(),
              email:$("#location_email").val(),
              phone:$("#location_phone").val(),
              main_office:$("#location_main_office").prop("checked")
            });
            location_doc.location_data = location_data;
            
            $.couch.db(db).saveDoc(location_doc, {
              success: function(data) {
                newAlert("success","Location Successfully added.");
                $("html, body").animate({scrollTop: 0}, 'slow');
                getLocationSettings();
                $("#add_location_modal").modal("hide");
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
          },
          key:pd_data.dhp_code,
          include_docs:true
        });
      }
    }else {
      console.log("in else");
    }
  }

  function editLocation($obj) {
    createModal("add_location_modal");
    $("#location_primary_address").val($obj.find(".location-address").data("primary"));
    $("#location_secondary_address").val($obj.find(".location-address").data("secondary"));
    getStates("location_state",$obj.find(".location-state").html());
    getCities($obj.find(".location-state").text(), "location_city",$obj.find(".location-city").text());
    $("#location_pincode").val($obj.find(".location-pincode").html());
    $("#location_email").val($obj.find(".location-email").html());
    $("#location_phone").val($obj.find(".location-phone").html());
    $("#location_main_office").prop("checked",$obj.hasClass("danger"));
    $("#location_save").data("objEle",$obj);
    var initialset = {
      primary_address:   $obj.find(".location-address").data("primary"),
      secondary_address: $obj.find(".location-address").data("secondary"),
      state:             $obj.find(".location-state").html(),
      city:              $obj.find(".location-city").html(),
      pincode:           $obj.find(".location-pincode").html(),
      email:             $obj.find(".location-email").html(),
      phone:             $obj.find(".location-phone").html(),
      main_office:       $obj.hasClass("danger")
    }
    $("#location_save").data("initialset",initialset);
  }

  function removeLocation($obj) {
    $('#remove_location_confirm').data('index',$obj.data('index'));
    createModal("remove_location_modal");
    $("#remove_location_confirm").data("objEle",$obj.closest("tr"));
  }

  function removeLocationConfirm($obj) {
    $.couch.db(db).view("tamsa/getLocationSettings", {
      success:function(data) {
        if(data.rows.length) {
          var location_data = data.rows[0].doc.location_data;
          var $ele = $obj.data("objEle");
          var remove_data = {
            primary_address: $ele.find(".location-address").data("primary"),
            secondary_address: $ele.find(".location-address").data("secondary"),
            city: $ele.find(".location-city").html(),
            state: $ele.find(".location-state").html(),
            pincode: $ele.find(".location-pincode").html(),
            email: $ele.find(".location-email").html(),
            phone: $ele.find(".location-phone").html(),
            main_office: $ele.hasClass("danger")
          }
          var tempdata = location_data.filter(function (entry) {
            return !(
                    entry.primary_address == remove_data.primary_address &&
                    entry.secondary_address == remove_data.secondary_address &&
                    entry.city == remove_data.city &&
                    entry.state == remove_data.state &&
                    entry.pincode == remove_data.pincode &&
                    entry.email == remove_data.email &&
                    entry.phone == remove_data.phone
                    )
            });
          data.rows[0].doc.location_data = tempdata;
          $.couch.db(db).saveDoc(data.rows[0].doc, {
            success:function(data) {
              newAlert("success","Successfully Removed");
              $("html, body").animate({scrollTop : 0}, 'slow');
              $("#remove_location_modal").modal("hide");
              getLocationSettings();
            },
            error:function(data,error,reason) {
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          });
        }else {
          console.log("multiple settings or no settings are found.");
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

  function getLocationSettings() {
    $.couch.db(db).view("tamsa/getLocationSettings", {
      success:function(data) {
        if(data.rows.length > 0) {
          $scope.location_data = data.rows[0].doc.location_data;
          $scope.$apply();
        }else {
          $("#location_setting_tab tbody").html('<tr><td colspan="7">No Records are Found.</td></tr>');
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

  function getEbillingSettings() {
    $.couch.db(db).view("tamsa/getEbilling", {
      success: function(data) {
        if(data.rows.length > 0) {
          $("#enable_billing").attr("checked", data.rows[0].value.enable_billing);
          $("#save_e_billing").attr("index", data.rows[0].value._id);
          $("#save_e_billing").attr("rev", data.rows[0].value._rev);
        }else {
          $("#enable_billing").attr("checked", false);
        }
        
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key: pd_data.dhp_code
    });
  }

  function getHealthAlertsConfiguration(){
    $.couch.db(db).view("tamsa/getHealthMaintenanceAlerts",{
      success:function(data){
        if(data.rows.length > 0){
          var health_alerts = [];
          for(var i=0;i<data.rows.length;i++){
            health_alerts.push('<tr>');
            health_alerts.push('<td>'+data.rows[i].doc.alert_name+'</td>');
            health_alerts.push('<td>'+data.rows[i].doc.gender+'</td>');
            health_alerts.push('<td>'+data.rows[i].doc.type+'</td>');
            var temp_status = data.rows[i].doc.is_status_active == true ? "Active": "Inactive"
            health_alerts.push('<td>'+temp_status+'</td>');
            health_alerts.push('<td>'+data.rows[i].doc.min_age+' '+data.rows[i].doc.min_age_choice+'</td>');
            health_alerts.push('<td>'+data.rows[i].doc.max_age+' '+data.rows[i].doc.max_age_choice+'</td>');
            health_alerts.push('<td>'+data.rows[i].doc.test_interval+' '+data.rows[i].doc.test_interval_choice+'</td>');
            health_alerts.push('<td><span class="label label-warning pointer edit-health-alert" data-index="'+data.rows[i].doc._id+'">Edit</span>&nbsp;<span class="label label-warning pointer remove-health-alert" data-index="'+data.rows[i].doc._id+'" data-rev="'+data.rows[i].doc._rev+'">remove</span></td>');
            health_alerts.push('</tr>');
          }
          $("#health_alerts_table tbody").html(health_alerts.join(''));
        }else{
          $.couch.db(db).view("tamsa/getHospitalPreInfo",{
            success:function(data){
              if(data.rows.length > 0){
                if(data.rows[0].doc.default_screening_alerts){
                  $("#health_alerts_table tbody").html('<tr><td colspan="6">No Records Found.</td></tr>');
                }else{
                  getDefaultScreeningAlerts();
                }
              }else{
                getDefaultScreeningAlerts();
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:pd_data.dhp_code,
            include_docs: true
          });
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data.dhp_code],
      endkey:[pd_data.dhp_code,{}],
      include_docs:true
    });
  }

  function getDefaultScreeningAlerts(){
    $.couch.db(db).openDoc("screening_default_rules",{
      success:function(data){
        var alert_array = [];
        for(var i=0;i<data.screening_details.length;i++){
          var alert_data = {
            "insert_ts": "2016-01-11T11:14:58.381Z",
            "dhp_code": pd_data.dhp_code,
            "doctype": "health_maintenance_alerts",
            "alert_name": data.screening_details[i].screening_name,
            "type": "Recommendation",
            "gender": data.screening_details[i].gender,
            "min_age": data.screening_details[i].recommended_age[0],
            "min_age_choice": "Years",
            "max_age": data.screening_details[i].recommended_age[data.screening_details[i].recommended_age.length -1],
            "max_age_choice": "Years",
            "is_every_visit": true,
            "is_status_active": true,
            "risk_factors": [],
            "grade": "",
            "alert_code": "",
            "recommendation": "",
            "url": "",
            "source": "",
            "test_interval": "5",
            "test_interval_choice": "Years"
          }
          alert_array.push(alert_data);
        }
        $.couch.db(db).bulkSave({"docs":alert_array},{
          success:function(data){
            $.couch.db(db).view("tamsa/getHospitalPreInfo",{
              success:function(data){
                if(data.rows.length > 0) {
                }else{
                  var hospital_pre_info_data = {
                    "dhp_code": pd_data.dhp_code,
                    "default_screening_alerts":true,
                    "doctype": "hospital_pre_info"
                  };
                  $.couch.db(db).saveDoc(hospital_pre_info_data,{
                    success:function(data){
                    },
                    error:function(data,error,reason){
                      newAlert("danger",reason);
                      $("html, body").animate({scrollTop: 0}, 'slow');
                      return false;
                    }
                  });
                }
                getHealthAlertsConfiguration();
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
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function getTaskManagerSettings(){
    $.couch.db(db).view("tamsa/getTaskManagerSettings",{
      success:function(data){
        if(data.rows.length > 0){
          $("#task_manager_autoremove_request").val(data.rows[0].doc.request_autoremove_duration);
          $("#save_task_manager_setting").data("index",data.rows[0].doc._id);
          $("#save_task_manager_setting").data("rev",data.rows[0].doc._rev);
        }else{
          $("#task_manager_autoremove_request").val(7);
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

  function saveTaskManagerSettings(){
    if(validateTaskManagerSetting()){
      var task_manager_setting_data = {
        request_autoremove_duration: $("#task_manager_autoremove_request").val(),
        insert_ts:                   d,
        dhp_code:                    pd_data.dhp_code,
        doctor_id:                   pd_data._id,
        doctype:                     "task_manager_settings"
      };
      if($("#save_task_manager_setting").data("index")){
        task_manager_setting_data._id = $("#save_task_manager_setting").data("index");
        task_manager_setting_data._rev = $("#save_task_manager_setting").data("rev");
      }
      $.couch.db(db).saveDoc(task_manager_setting_data,{
        success:function(data){
          $("#save_task_manager_setting").data("index",data.id);
          $("#save_task_manager_setting").data("rev",data.rev);
          newAlert("success","Task Manager Settings Successfully saved.");
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
  }

  function getPatientCategoryTags(){
    $('#patient_tags_list').tagsinput({
      trimValue: true
    })
    var $elt = $('#patient_tags_list').tagsinput('input');
    $elt.parent().addClass("form-control");
    $.couch.db(db).view("tamsa/getPatientCategoryTags",{
      success:function(data){
        if(data.rows.length > 0){
          $("#save_patient_category_tags").data("index",data.rows[0].value._id);
          $("#save_patient_category_tags").data("rev",data.rows[0].value._rev);
          for(var i=0;i<data.rows[0].value.tag_list.length;i++){
            $("#patient_tags_list").tagsinput('add', data.rows[0].value.tag_list[i]);
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
  }

  function addTagsIntoPatientTagList(){
    $("#patient_tags_list").tagsinput('add', $("#taginput_val").val());
  }

  function savePatientCategoryTags(){
    $("#save_patient_category_tags").attr("disabled","disabled");
    var tag_data = {
      insert_ts: new Date(),
      doctype: "patient_category_tags",
      dhp_code: pd_data.dhp_code,
      tag_list: $("#patient_tags_list").val(),
      doctor_id: pd_data._id
    }
    if($("#save_patient_category_tags").data("index")){
      tag_data._id = $("#save_patient_category_tags").data("index");
      tag_data._rev = $("#save_patient_category_tags").data("rev");
    }
    $.couch.db(db).saveDoc(tag_data,{
      success:function(data){
        newAlert("success","Tags saved Successfully.");
        $("html, body").animate({scrollTop: 0}, 'slow');
        $("#save_patient_category_tags").data("index",data.id);
        $("#save_patient_category_tags").data("rev",data.rev);
        $("#save_patient_category_tags").removeAttr("disabled");
      },
      error:function(data,errror,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        $("#save_patient_category_tags").removeAttr("disabled");
        return false;
      }
    });
  }

  function getIntergrationTabDetails() {
    clearSaveLabForm();
    getLabCities();
    getStates("la_state");
  }

  function changeLabImagingType(){
    clearSaveLabForm();
    getLabCities();
  }

  function labmap(doc) {
    if(doc.doctype =='Lab'){
      emit([doc.doctype, doc.doctor_id, doc.city], doc.lab_name);
    }
    if(doc.doctype =='Imaging'){
      emit([doc.doctype, doc.doctor_id, doc.city], doc.imaging_name);
    }
  }

  function getLabCities() {
    // pouchdb.query({map:labmap,reduce:"_count"}, {startkey: [$("#lab_imaging_type").val(),pd_data._id],endkey:[$("#lab_imaging_type").val(),pd_data._id, {}],reduce:true,group:true}).then(function (data) {
    //   var addlab_cities = '';
    //   for (var i = 0; i < data.rows.length; i++) {
    //     addlab_cities += '<option>'+data.rows[i].key[2]+'</option>';
    //   };
    //   $("#addlab_cities").html(addlab_cities);
    //   getLabsByCity();
    // }).catch(function (err) {
    //   console.log(err);
    // });
    $.couch.db(db).view("tamsa/getLabsByCity", {
      success: function(data) {
        var addlab_cities = '';
        if(data.rows.length > 0){
          for (var i = 0; i < data.rows.length; i++) {
            addlab_cities += '<option>'+data.rows[i].key[2]+'</option>';
          };
          $("#addlab_cities").html(addlab_cities);
          $("#cityByLabPagination").show();
          getLabsByCity();
        }else{
          $("#addlab_cities").html('<option>Select City</option>');
          $("#labsbycity").html('<div class="msg-search-result-box"><ul><li><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="data-search">No Data Found.</div></div></li></ul></div>');
          $("#cityByLabPagination").hide();
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [$("#lab_imaging_type").val(), pd_data.dhp_code],
      endkey:   [$("#lab_imaging_type").val(), pd_data.dhp_code, {}],
      reduce:   true,
      group:    true
    });
  }

  function getLabsByCity() {
    // pouchdb.query({map:labmap,reduce:"_count"}, {key: [$("#lab_imaging_type").val(), pd_data._id, $("#addlab_cities").val()],reduce:false,group:false}).then(function (data) {
    //   if(data.rows.length > 0){
    //      paginationConfiguration(data,"cityByLabPagination",5,displayLabByCity)  
    //   }else{
    //     $("#labsbycity").html('<div class="search-result-box"><ul><li><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="data-search">No Data Found.</div></div></li></ul></div>');
    //   }
    // }).catch(function (err) {
    //   console.log(err);
    // });

    $.couch.db(db).view("tamsa/getLabsByCity", {
      success: function(data) {
        if(data.rows.length > 0) {
           $("#cityByLabPagination").show();
           paginationConfiguration(data,"cityByLabPagination",5,displayLabByCity);
        }else{
          $("#labsbycity").html('<div class="msg-search-result-box"><ul><li><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="data-search">No Data Found.</div></div></li></ul></div>');
          $("#cityByLabPagination").hide();
        }
      },
      error: function(status) {
        console.log(status);
      },
      key:    [$("#lab_imaging_type").val(), pd_data.dhp_code, $("#addlab_cities").val()],
      reduce: false,
      group:  false
    });
  }

  function displayLabByCity(start,end,data){
    var labsbycity = '<label style="color:rgb(242, 187, 92);font-weight:bold;">Lab Names</label>';
    for (var i = start; i< end; i++) {
      labsbycity += '<div class="search-result-box" doc_id="'+data.rows[i].id+'"><ul><li><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="data-search">'+data.rows[i].value+'</div></div></li></ul></div>';
    };
    $("#labsbycity").html(labsbycity);
  }

  function clearSaveLabForm(){
    $("#la_lab_name").val('');
    $("#la_state").val('select state');
    $("#la_city").val('select city');
    $("#la_address").val('');
    $("#la_reference").val('');
    $("#la_contact_person_name").val('');
    $("#la_contact_person_email").val('');
    $("#la_contact_person_phone").val('');
    $("#la_services").val('');
    $("#la_website").val('');
  }

  function getAllImagings() {
    // pouchdb.query({map:labmap,reduce:"_count"}, {startkey: ["Imaging", pd_data._id],endkey:["Imaging", pd_data._id, {}],reduce:false,group:false}).then(function (data) {
    //   var labs = '';
    //   for (var i = 0; i < data.rows.length; i++) {
    //     labs += '<option value="'+data.rows[i].id+'">'+data.rows[i].value+'</option>';
    //   };
    //   $("#io_imaging_center").html(labs);
    // }).catch(function (err) {
    //   newAlert("danger",err);
    //   $("html, body").animate({scrollTop: 0}, 'slow');
    //   return false;
    // });
    $.couch.db(db).view("tamsa/getImagingByCity", {
      success: function(data) {
        var imaging = '';
        for (var i = 0; i < data.rows.length; i++) {
          imaging += '<option value="'+data.rows[i].id+'">'+data.rows[i].value+'</option>';
        };
        $("#io_imaging_center").html(imaging);
      },
      error: function(status) {
        console.log(status);
      },
      startkey: ["Imaging", pd_data._id],
      endkey:   ["Imaging", pd_data._id, {}],
      reduce:   false,
      group:    false
    });
  }

  function saveLab() {
    if(validateSaveLabDocument()){
      $("#la_save").attr("disabled","disabled");
      var d          = new Date();
      var lab_dhp_id = "SHS-L"+getInvitationcode();
      var lab_doc    = {
        _id:                          "SHS-L"+getInvitationcode(),
        insert_ts:                    d,
        doctype:                      $("#lab_imaging_type").val(),
        doctor_id:                    pd_data._id,
        dhp_code:                     pd_data.dhp_code,
        city:                         $("#la_city").val(),
        state:                        $("#la_state").val(),
        address:                      $("#la_address").val(),
        doctor_reference_id_with_lab: $("#la_reference").val(),
        contact_person_name:          $("#la_contact_person_name").val(),
        contact_person_email:         $("#la_contact_person_email").val(),
        contact_person_phone:         $("#la_contact_person_phone").val(),
        lab_dhp_id:                   lab_dhp_id
      };

      var cron_lab_record = {
        processed:                    "No",
        doctype:                      "cronRecords",
        doctor_id:                    pd_data._id,
        dhp_code:                     pd_data.dhp_code,
        lab_name:                     $("#la_lab_name").val(),
        city:                         $("#la_city").val(),
        state:                        $("#la_state").val(),
        address:                      $("#la_address").val(),
        doctor_reference_id_with_lab: $("#la_reference").val(),
        contact_person_name:          $("#la_contact_person_name").val(),
        contact_person_email:         $("#la_contact_person_email").val(),
        contact_person_phone:         $("#la_contact_person_phone").val(),
        type:                         $("#lab_imaging_type").val(),
        lab_dhp_id:                   lab_dhp_id,
        insert_ts:                    d
      }

      if($("#la_website").val()){
        lab_doc.website = $("#la_website").val();
        cron_lab_record.website = $("#la_website").val();
      }
      if($("#la_services").val()){
        lab_doc.services = $("#la_services").val();
        cron_lab_record.services = $("#la_services").val();
      }

      if($("#lab_imaging_type").val() == "Lab"){
        cron_lab_record.operation_case = "3";
        lab_doc.lab_name               = $("#la_lab_name").val();
        cron_lab_record.lab_name       = $("#la_lab_name").val();
      }
      else {
        cron_lab_record.operation_case = "4";
        lab_doc.imaging_name           = $("#la_lab_name").val();
        cron_lab_record.imaging_name   = $("#la_lab_name").val();
      }

      if($('#la_save').data('index')){
        lab_doc._id  = $('#la_save').data('index');
        lab_doc._rev = $('#la_save').data('rev');
        $.couch.db(db).saveDoc(lab_doc,{
          success:function(data){
            newAlert('success', 'Lab saved successfully !');
            $('html, body').animate({scrollTop: 0}, 'slow');
            clearSaveLabForm();
            $("#la_save").removeAttr("disabled");
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
        // pouchdb.put(lab_doc).then(function(response) {
        //   newAlert('success', 'Lab saved successfully !');
        //   $('html, body').animate({scrollTop: 0}, 'slow');
        //   clearSaveLabForm();
        //   $("#la_save").removeAttr("disabled");
        // }).catch(function (err) {
        //   console.log(err);
        // });
      }else{
        $.couch.db(db).saveDoc(lab_doc,{
          success:function(data){
            $.couch.db(db).saveDoc(cron_lab_record,{
              success:function(data){
                newAlert('success', 'Lab saved successfully !');
                $('html, body').animate({scrollTop: 0}, 'slow');
                clearSaveLabForm();
                getLabCities();
                getAllLabs();
                $("#la_save").removeAttr("disabled");
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
        // pouchdb.post(lab_doc).then(function (response) {
        //   newAlert('success', 'Lab added successfully !');
        //   $('html, body').animate({scrollTop: 0}, 'slow');
        //   clearSaveLabForm();
        //   getLabCities();
        //   getAllLabs();
        //   pouchdb.post(cron_lab_record).then(function(response){
        //   $("#la_save").removeAttr("disabled");
        //   }).catch(function (err){
        //     console.log(err);
        //   })
        // }).catch(function (err) {
        //   console.log(err);
        // });
      }
    }
  }

  function clearSaveImagingForm() {
    $("#ia_imaging_name").val('');
    $("#ia_city").val('');
    $("#ia_address").val('');
    $("#ia_reference").val('');
    $("#ia_contact_person_name").val('');
    $("#ia_contact_person_email").val('');
    $("#ia_contact_person_phone").val('');
  }

  function getMiscSettings() {
    $.couch.db(db).view("tamsa/getMiscSetting", {
      success: function(data) {
        if(data.rows.length > 0) {
          $("#misc_front_disk").attr("checked", data.rows[0].value.enable_front_disk);
          $("#save_misc_setting").attr("index", data.rows[0].value._id);
          $("#save_misc_setting").attr("rev", data.rows[0].value._rev);
        }else {
          $("#misc_front_disk").attr("checked", false);
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
  }

  function printSetting(){
    $.couch.db(db).view("tamsa/getPrintSetting", {
      success: function(data) {
        if(data.rows.length > 0){
          $("#invoice_address_val").val(data.rows[0].doc.hospital_address);
          $("#invoice_sec_address_val").val(data.rows[0].doc.hospital_secondary_address);
          // $("#invoice_address_states").val(data.rows[0].doc.hospital_state);
          getStates("invoice_address_states",data.rows[0].doc.hospital_state);
          getCities(data.rows[0].doc.hospital_state, "invoice_address_city",data.rows[0].doc.hospital_city);
          $("#invoice_address_zip").val(data.rows[0].doc.hospital_postal_zip_code);
          $("#is_display_logo").prop("checked",data.rows[0].doc.is_display_logo);
          $("#is_display_chartnote_logo").prop("checked",data.rows[0].doc.is_display_chartnote_logo);
          $("#authorised_signatory").val(data.rows[0].doc.authorised_signatory);
          $("#invoice_footer").val(data.rows[0].doc.footer);
          $("#invoice_standard_memo").val(data.rows[0].doc.standard_memo);
          $("#preview_image").show().attr("src",data.rows[0].doc.invoice_image);
          $("#invoice_hospital_website").val(data.rows[0].doc.hospital_website);
          $("#invoice_hospital_email").val(data.rows[0].doc.hospital_email);
          $("#invoice_hospital_phone").val(data.rows[0].doc.hospital_phone ? data.rows[0].doc.hospital_phone : "");
          $("#invoice_hospital_name").val((data.rows[0].doc.hospital_name ? data.rows[0].doc.hospital_name : pd_data.hospital_affiliated));
          $("#is_save_print").data({
            "print_index": data.rows[0].doc._id,
            "print_rev": data.rows[0].doc._rev
          });
        }else{
          if(pd_data.state) getStates("invoice_address_states", pd_data.state)
          else getStates("invoice_address_states")

          if(pd_data.state && pd_data.city) getCities(pd_data.state, "invoice_address_city",pd_data.city);
          
          $("#invoice_hospital_email").val(pd_data.hospital_email ? pd_data.hospital_email : "");
          $("#invoice_hospital_name").val(pd_data.hospital_affiliated ? pd_data.hospital_affiliated : "");
          $("#invoice_hospital_phone").val(pd_data.hospital_phone ? pd_data.hospital_phone : "");
        }
      },
      error: function(data,error,reason) {
        newAlert('danger','reason');
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:pd_data.dhp_code,
      include_docs: true
    });  
  }

  function initiateSaveInvoiceSettings() {
    $("#is_display_logo_save").attr("disabled","disabled");
    $("#is_save").addClass("ajax-loader-large");
    var d = new Date();
    var diagnosis_doc = {
      doctype:              "diagnosis_procedures",
      update_ts:            d,
      dhp_code:             pd_data.dhp_code,
      last_change_username: pd_data.first_name  + " " + pd_data.last_name,
      last_change_userid:   pd_data._id
    };

    var diagnosis_data = [];
    var procedure_data = [];
    var service_data = [];
    $("#list_of_procedure_diagnosis tbody tr").each(function() {
      if($(this).find("td:nth-child(1)").text() == "Diagnosis"){
        diagnosis_data.push({
          diagnosis_name:          $(this).find("td:nth-child(2)").text(),
          hospital_diagnosis_code: $(this).find("td:nth-child(3)").text(),
          hospital_billing_code:   $(this).find("td:nth-child(4)").text(),
          icd_10_code:             $(this).find("td:nth-child(5)").text(),
          description:             $(this).find("td:nth-child(6)").text(),
          charges:                 $(this).find("td:nth-child(7)").text()
        });
      }else if($(this).find("td:nth-child(1)").text() == "Procedure"){
        procedure_data.push({
          procedure_name:          $(this).find("td:nth-child(2)").text(),
          hospital_procedure_code: $(this).find("td:nth-child(3)").text(),
          hospital_billing_code:   $(this).find("td:nth-child(4)").text(),
          icd_10_pc_code:          $(this).find("td:nth-child(5)").text(),
          description:             $(this).find("td:nth-child(6)").text(),
          charges:                 $(this).find("td:nth-child(7)").text()
        });
      }else{
        if($(this).find("td:nth-child(1)").find(".save_form_id").data("misc_form_id")){
            service_data.push({
            session_duration:      $(this).find("td:nth-child(1)").find(".save_duration").html(),
            form_id:               $(this).find("td:nth-child(1)").find(".save_form_id").data("misc_form_id").split(","),
            location:              $(this).find("td:nth-child(1)").find(".save_location").html(),
            service_name:          $(this).find("td:nth-child(2)").text(),
            hospital_service_code: $(this).find("td:nth-child(3)").text(),
            hospital_billing_code: $(this).find("td:nth-child(4)").text(),
            icd_10_code:           $(this).find("td:nth-child(5)").text(),
            description:           $(this).find("td:nth-child(6)").text(),
            charges:               $(this).find("td:nth-child(7)").text()
          });  
        }else{
          service_data.push({
            session_duration:      $(this).find("td:nth-child(1)").find(".save_duration").html(),
            location:              $(this).find("td:nth-child(1)").find(".save_location").html(),
            service_name:          $(this).find("td:nth-child(2)").text(),
            hospital_service_code: $(this).find("td:nth-child(3)").text(),
            hospital_billing_code: $(this).find("td:nth-child(4)").text(),
            icd_10_code:           $(this).find("td:nth-child(5)").text(),
            description:           $(this).find("td:nth-child(6)").text(),
            charges:               $(this).find("td:nth-child(7)").text()
          });
        }
      }
    });

    diagnosis_doc.diagnosis  = diagnosis_data; 
    diagnosis_doc.procedures = procedure_data;
    diagnosis_doc.services   = service_data ;
    if ($("#is_save").data("invoice_index") && $("#is_save").data("invoice_rev")) {
      // doc._id            = $("#is_save").data("invoice_index");
      // doc._rev           = $("#is_save").data("invoice_rev");
      diagnosis_doc._id  = $("#is_save").data("diagnosis_index");
      diagnosis_doc._rev = $("#is_save").data("diagnosis_rev");
      saveInvoiceSettings(diagnosis_doc);
    }
    else {
      saveInvoiceSettings(diagnosis_doc);
    }
  }

  function saveInvoiceSettings(dia_doc) {
    $.couch.db(db).saveDoc(dia_doc,{
      success:function(data){
        $("#is_save").removeClass("ajax-loader-large");
        $("#is_save").removeAttr("disabled");
        $("#is_save").data("diagnosis_index",data.id);
        $("#is_save").data("diagnosis_rev",data.rev);
        newAlert('success', "Invoice Preference Successfully saved.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      error:function(data,error,reason){
        $("#is_save").removeAttr("disabled");
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function initialSavePrintSetting(){
    if(validateInvoiceSettingPreview()){
      $("#is_display_logo_save").attr("disabled","disabled");
      $("#is_save_print").addClass("ajax-loader-large");
      var d = new Date();
      var doc = {
        doctype:                    "print_settings",
        update_ts:                  d,
        hospital_address:           $("#invoice_address_val").val(),
        hospital_secondary_address: $("#invoice_sec_address_val").val(),
        hospital_state:             $("#invoice_address_states").val(),
        hospital_city:              $("#invoice_address_city").val(),
        hospital_postal_zip_code:   $("#invoice_address_zip").val(),
        is_display_logo:            $("#is_display_logo").prop("checked"),
        footer:                     $("#invoice_footer").val(),
        standard_memo:              $("#invoice_standard_memo").val(),
        dhp_code:                   pd_data.dhp_code,
        last_change_username:       pd_data.first_name  + " " + pd_data.last_name,
        last_change_userid:         pd_data._id,
        invoice_image:              $("#preview_image").attr("src"),
        hospital_website:           $("#invoice_hospital_website").val(),
        hospital_phone:             $("#invoice_hospital_phone").val(),
        hospital_email:             $("#invoice_hospital_email").val(),
        hospital_name:              $("#invoice_hospital_name").val(),
        authorised_signatory:       $("#authorised_signatory").val(),
        is_display_chartnote_logo:  $("#is_display_chartnote_logo").prop("checked")
      };
      if ($("#is_save_print").data("print_index") && $("#is_save_print").data("print_rev")) {
        doc._id            = $("#is_save_print").data("print_index");
        doc._rev           = $("#is_save_print").data("print_rev");
        savePrintSettings(doc);
      }else {
        savePrintSettings(doc);
      }
    }
  }

  function savePrintSettings(doc){
    $.couch.db(db).saveDoc(doc,{
      success: function(data) {
        $("#is_save_print").data("print_index",data.id);
        $("#is_save_print").data("print_rev",data.rev);
        $("#is_save_print").removeClass("ajax-loader-large");
        $("#is_save_print").removeAttr("disabled");
        newAlert('success', "Print Setting Successfully saved.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      error: function(data,error,reason) {
        $("#is_save_print").removeAttr("disabled");
        newAlert('danger','reason');
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function getAuditRecords(limit,skip) {
    $("#audit_table").block({"msg": "Please Wait...."});
    $.couch.db(db).list("tamsa/getAuditRecordsByFilter", "getAuditRecords", {
      startkey:            [pd_data.dhp_code,{}],
      endkey:              [pd_data.dhp_code],
      descending:          true,
      include_docs:        true,
      limit_rows:          limit,
      skip_rows:           skip,
      filter_area:         $("#filter_by_audit_area").val(),
      filter_action:       $("#filter_by_audit_action").val(),
      filter_date:         $("#filter_by_audit_date").val(),
      filter_doctor_name:  $("#filter_by_audit_doctor").val(),
      filter_patient_name: $("#filter_by_audit_patient").val()
    }).success(function(data){
      if(data.rows.length > 0){
        $("#audit_records_pagination").html("");
        paginationConfigurationMedication(data.length,"audit_records_pagination",5,displayNewAuditRecord);
        var audit_records_data = [];
        for(var i=0;i<5;i++){
          if(data.rows[i] != null){
            audit_records_data.push("<tr class='text-center'>");
            audit_records_data.push("<td>"+data.rows[i].doc.audit_area+"</td>");
            audit_records_data.push("<td>"+data.rows[i].doc.action_type+"</td>");
            audit_records_data.push("<td>"+moment(data.rows[i].doc.insert_ts).format("DD-MM-YYYY hh:mm")+"</td>");
            audit_records_data.push("<td data-doctor_id="+data.rows[i].doc.doctor_id+">"+data.rows[i].doc.doctor_name+"</td>");
            audit_records_data.push("<td data-user_id="+data.rows[i].doc.user_id+">"+data.rows[i].doc.patient_name+"</td>");
            audit_records_data.push("<td>"+data.rows[i].doc.comments+"</td>");
            audit_records_data.push("</tr>");  
          }
        }
        $("#audit_table tbody").html(audit_records_data.join(''));
      }else{
        $("#audit_table tbody").html("<tr><td colspan='6'>No Records Are Found.</td></tr>");
      }
      $("#audit_table").unblock();
    });
  }

  // function displayAuditRecords(start,end,data){
  //   var audit_records_data = [];
  //   for(var i=start;i<end;i++){
  //     audit_records_data.push("<tr class='text-center'>");
  //     audit_records_data.push("<td>"+data.rows[i].doc.audit_area+"</td>");
  //     audit_records_data.push("<td>"+data.rows[i].doc.action_type+"</td>");
  //     audit_records_data.push("<td>"+moment(data.rows[i].doc.insert_ts).format("DD-MM-YYYY hh:mm")+"</td>");
  //     audit_records_data.push("<td data-doctor_id="+data.rows[i].doc.doctor_id+">"+data.rows[i].doc.doctor_name+"</td>");
  //     audit_records_data.push("<td data-user_id="+data.rows[i].doc.user_id+">"+data.rows[i].doc.patient_name+"</td>");
  //     audit_records_data.push("<td>"+data.rows[i].doc.comments+"</td>");
  //     audit_records_data.push("</tr>");  
  //   }
  //   $("#audit_table tbody").html(audit_records_data.join(''));  
  // }

  function displayNewAuditRecord(skip,limit){
    $("#audit_table").block({"msg": "Please Wait...."});
    $.couch.db(db).list("tamsa/getAuditRecordsByFilter", "getAuditRecords", {
    startkey:            [pd_data.dhp_code,{}],
    endkey:              [pd_data.dhp_code],
    descending:          true,
    include_docs:        true,
    limit_rows:          skip + 5,
    skip_rows:           skip,
    filter_area:         $("#filter_by_audit_area").val(),
    filter_action:       $("#filter_by_audit_action").val(),
    filter_date:         $("#filter_by_audit_date").val(),
    filter_doctor_name:  $("#filter_by_audit_doctor").val(),
    filter_patient_name: $("#filter_by_audit_patient").val()
    }).success(function(data){
      if(data.rows.length > 0){
        var audit_records_data = [];
        for(var i=0;i<data.rows.length;i++){
          if(data.rows[i] != null){
            audit_records_data.push("<tr class='text-center'>");
            audit_records_data.push("<td>"+data.rows[i].doc.audit_area+"</td>");
            audit_records_data.push("<td>"+data.rows[i].doc.action_type+"</td>");
            audit_records_data.push("<td>"+moment(data.rows[i].doc.insert_ts).format("DD-MM-YYYY hh:mm")+"</td>");
            audit_records_data.push("<td data-doctor_id="+data.rows[i].doc.doctor_id+">"+data.rows[i].doc.doctor_name+"</td>");
            audit_records_data.push("<td data-user_id="+data.rows[i].doc.user_id+">"+data.rows[i].doc.patient_name+"</td>");
            audit_records_data.push("<td>"+data.rows[i].doc.comments+"</td>");
            audit_records_data.push("</tr>");  
          }
        }
        $("#audit_table tbody").html(audit_records_data.join(''));
      }else{
        $("#audit_table tbody").html("<tr><td colspan='6'>No Records Are Found.</td></tr>");
      }
      $("#audit_table").unblock();
    });
  }

  // function personalDetailsSPecialization(){
  //   // $("#pdspecialization").autocomplete({
  //   //   source: function( request, response ) {
  //   //     $.couch.db(replicated_db).view("tamsa/getSpecialization", {
  //   //       success: function(data) {
  //   //           response(data.rows);
  //   //       },
  //   //       error: function(status) {
  //   //           console.log(status);
  //   //       },
  //   //       startkey: request.term,
  //   //       endkey: request.term + "\u9999",
  //   //       reduce : true,
  //   //       group : true,
  //   //       limit: 5
  //   //     });
  //   //   },
  //   //   minLength: 2,
  //   //   focus: function(event, ui) {
  //   //     return false;
  //   //   },
  //   //   select: function( event, ui ) {
  //   //     $( this ).val(ui.item.key);
  //   //     return false;
  //   //   }
  //   // }).
  //   // data("uiAutocomplete")._renderItem = function(ul, item) {
  //   //   return $("<li></li>")
  //   //     .data("item.autocomplete", item)
  //   //     .append("<a>" + item.key + "</a>")
  //   //     .appendTo(ul);
  //   // };
  // }

  function confirmSetToDefaultHealthAlerts(){
    $("#set_to_default_alerts_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("#set_to_default_alerts_yes").data("action","default");
    $("#alert_modal_message").html("Are You Sure you want to set Default configuration?<br>This will reset all customized rule for alerts.");
  }

  function confirmRemoveAlertConfiguration($obj){
    $("#set_to_default_alerts_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    console.log($obj.data("index"));
    $("#set_to_default_alerts_yes").data("action","remove");
    $("#set_to_default_alerts_yes").data("index",$obj.data("index"));
    $("#set_to_default_alerts_yes").data("rev",$obj.data("rev"));
    $("#alert_modal_message").html("Are You Sure you want to delete this User?");
  }

  function chooseConfirmActionOnHealthAlerts(){
    if($("#set_to_default_alerts_yes").data("action") == "default") setDefaultHealthAlerts()
    else if($("#set_to_default_alerts_yes").data("action") == "remove") removeHealthAlertsConfiguration()
  }

  function setDefaultHealthAlerts(){
    $.couch.db(db).view("tamsa/getHealthMaintenanceAlerts",{
      success:function(data){
        if(data.rows.length){
          var remove_bulk =[];
          for(var i=0;i<data.rows.length;i++){
            var remove_data = {
              _id:data.rows[i].doc._id,
              _rev:data.rows[i].doc._rev
            }
            remove_bulk.push(remove_data);
          }
          $.couch.db(db).bulkRemove({"docs":remove_bulk},{
            success:function(data){
              $("#set_to_default_alerts_modal").modal("hide");
              getDefaultScreeningAlerts();
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          });
        }else{

        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data.dhp_code],
      endkey:[pd_data.dhp_code,{}],
      include_docs:true
    });
  }

  function removeHealthAlertsConfiguration(){
    var remove_doc = {
      _id:  $("#set_to_default_alerts_yes").data("index"),
      _rev: $("#set_to_default_alerts_yes").data("rev")
    }
    $.couch.db(db).removeDoc(remove_doc,{
      success:function(data){
        newAlert("success","Health Maintenance Alert has successfully removed.");
        getHealthAlertsConfiguration();
        clearHealthAlertConfigurationForm();
        $("#set_to_default_alerts_modal").modal("hide");
        $('html, body').animate({scrollTop: 0}, 1000);
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 1000);
        return false;
      }
    });
  }    

  function addHealthAlertsConfiguration($obj){
    $("#add_health_alerts_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false    
    });
    $.couch.db(db).view("tamsa/getRiskFactors",{
      success:function(rdata){
        $("#risk_factor_list").html("");
        if(rdata.rows.length > 0){
          for(var i=0;i<rdata.rows.length;i++){
            if(i%3 == 0) {
              var risk_factor_data = [];
              risk_factor_data.push('<div class="row"><div class="col-lg-4"><input type="checkbox" class="checkshow" value="'+rdata.rows[i].key+'"><span>'+rdata.rows[i].key+'</span></div></div>');
              $("#risk_factor_list").append(risk_factor_data.join(''));
            }else{
              var risk_factor_data = [];
              risk_factor_data.push('<div class="col-lg-4"><input type="checkbox" class="checkshow" value="'+rdata.rows[i].key+'"><span>'+rdata.rows[i].key+'</span></div>');
             $("#risk_factor_list").find(".row:last").append(risk_factor_data.join(''));
            }
          }
        }else{
          $("#risk_factor_list").html('<div class="row"><div class="col-lg-12">No Risk Factors Found.</div></div>')
        }
        if($obj && $obj.data("index")){
          $.couch.db(db).openDoc($obj.data("index"),{
            success:function(data){
              $("#health_alert_name").val(data.alert_name);
              $("#health_alert_type").val(data.type);
              $("#health_alert_gender").val(data.gender);
              $("#health_alert_min_age").val(data.min_age);
              $("#health_alert_min_age_choice").val(data.min_age_choice);
              $("#health_alert_max_age").val(data.max_age);
              $("#health_alert_max_age_choice").val(data.max_age_choice);
              data.grade ? $("#health_alert_grade").val(data.grade): $("#health_alert_grade").val("noselect");
              data.alert_code ? $("#health_alert_code").val(data.alert_code): $("#health_alert_code").val("");
              data.recommendation ? $("#health_alert_recommendation").val(data.recommendation) : $("#health_alert_recommendation").val("");
              data.url ? $("#health_alert_url").val(data.url) : $("#health_alert_url").val("");
              data.source ? $("#health_alert_source").val(data.source):$("#health_alert_source").val("");
              data.test_interval ? $("#health_alert_test_interval").val(data.test_interval) : $("#health_alert_test_interval").val("");
              data.test_interval_choice ? $("#health_alert_test_interval_choice").val(data.test_interval_choice) : $("#health_alert_test_interval_choice").val("noselect");
              $("#health_alert_every_visit").prop("checked",data.is_every_visit);
              $("#health_alert_status_active").prop("checked",data.is_status_active);
              $("#save_health_alerts_configuration").data("index",data._id);
              $("#save_health_alerts_configuration").data("rev",data._rev);
              for(var i=0;i<data.risk_factors.length;i++){
                $("#risk_factor_list").find(".checkshow").each(function(){
                  if($(this).attr("value") == data.risk_factors[i]){
                    $(this).prop("checked",true);
                    return;
                  }
                })
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $('html, body').animate({scrollTop: 0}, 1000);
              return false;
            }
          });
        }else{
          clearHealthAlertConfigurationForm();
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 1000);
        return false;
      },
      reduce:true,
      group:true
    });
  }

  function saveHealthAlertsConfiguration(){
    $("#save_health_alerts_configuration").attr("disabled","disabled");
    if(validateAlertConfiguration()){
      var health_alert_configuration_data = {
        insert_ts:            new Date(),
        dhp_code:             pd_data.dhp_code,
        doctype:              "health_maintenance_alerts",
        alert_name:           $("#health_alert_name").val(),
        type:                 $("#health_alert_type").val(),
        gender:               $("#health_alert_gender").val(),
        min_age:              $("#health_alert_min_age").val(),
        min_age_choice:       $("#health_alert_min_age_choice").val(),
        max_age:              $("#health_alert_max_age").val(),
        max_age_choice:       $("#health_alert_max_age_choice").val(),
        is_every_visit:       $("#health_alert_every_visit").prop("checked"),
        is_status_active:     $("#health_alert_status_active").prop("checked")
      };
      var tmp_risk_factors = [];
      $("#risk_factor_list").find(".checkshow:checked").each(function(){
        tmp_risk_factors.push($(this).attr("value"));
      });
      if(tmp_risk_factors.length > 0) health_alert_configuration_data.risk_factors = tmp_risk_factors
      if($("#health_alert_grade").val() != "noselect") health_alert_configuration_data.grade=$("#health_alert_grade").val()
      if($("#health_alert_code").val() != "") health_alert_configuration_data.alert_code = $("#health_alert_code").val()
      if($("#health_alert_recommendation").val() != "") health_alert_configuration_data.recommendation = $("#health_alert_recommendation").val()
      if($("#health_alert_url").val() != "") health_alert_configuration_data.url = $("#health_alert_url").val()
      if($("#health_alert_source").val() != "") health_alert_configuration_data.source = $("#health_alert_source").val()
      if($("#health_alert_test_interval").val() != "") health_alert_configuration_data.test_interval = $("#health_alert_test_interval").val()
      if($("#health_alert_test_interval_choice").val() != "noselect") health_alert_configuration_data.test_interval_choice = $("#health_alert_test_interval_choice").val()

      if($("#save_health_alerts_configuration").data("index")){
        health_alert_configuration_data._id  = $("#save_health_alerts_configuration").data("index");
        health_alert_configuration_data._rev = $("#save_health_alerts_configuration").data("rev");
      }
      $.couch.db(db).saveDoc(health_alert_configuration_data,{
        success:function(data){
          $("#add_health_alerts_modal").modal("hide");
          newAlert("success","Alert configuration successfully saved.");
          $("#save_health_alerts_configuration").removeAttr("disabled");
          $("html, body").animate({scrollTop:0},1000);
          getHealthAlertsConfiguration();
          clearHealthAlertConfigurationForm();
          return false;
        },
        error:function(data,error,reason){
          $("#add_health_alerts_modal").modal("hide");
          newAlert("danger",reason);
          $("html, body").animate({scrollTop:0},1000);
          $("#save_health_alerts_configuration").removeAttr("disabled");
          return false;
        }
      });
    }
  }

  function clearHealthAlertConfigurationForm(){
    $("#health_alert_name").val("");
    $("#health_alert_grade").val("noselect");
    $("#health_alert_type").val("noselect");
    $("#health_alert_code").val("");
    $("#health_alert_gender").val("noselect");
    $("#health_alert_recommendation").val("");
    $("#health_alert_url").val("");
    $("#health_alert_source").val("");
    $("#health_alert_min_age").val("");
    $("#health_alert_min_age_choice").val("noselect");
    $("#health_alert_max_age").val("");
    $("#health_alert_max_age_choice").val("noselect");
    $("#health_alert_test_interval").val("");
    $("#health_alert_test_interval_choice").val("noselect");
    $("#health_alert_every_visit").prop("checked",false);
    $("#health_alert_status_active").prop("checked",false);
  }

  function getRiskFactorsForHealthAlerts(){
    // if($("#include_risk_factors").html() == "Include Risk Factors"){
    //   $("#health_alert_risk_factors").show();
    //   $("#include_risk_factors").html("Exclude Risk Factors")
    // }else{
    //   $("#health_alert_risk_factors").hide();
    //   $("#include_risk_factors").html("Include Risk Factors")
    // }
    $("#risk_factor_form, #back_to_alert_configuration").show();
    $("#health_alert_form, #save_health_alerts_configuration, #close_health_alert_modal").hide();
    $("#add_health_alerts_modal").find("h4").html("Risk Factors");
  }

  function selectRiskFactorsForHealthAlerts(){
    if($("#health_alert_risk_factors").val() == "Add New Risk Factors"){
      $("#risk_factor_form, #back_to_alert_configuration").show();
      $("#health_alert_form, #save_health_alerts_configuration, #close_health_alert_modal").hide();
    }
  }

  function backToAlertConfiguration(){
    $("#risk_factor_form, #back_to_alert_configuration").hide();
    $("#health_alert_form, #save_health_alerts_configuration, #close_health_alert_modal").show();
    $("#add_health_alerts_modal").find("h4").html("Alert configuration");
  }

  function addHealthRiskFactor(){
    if($("#risk_factor_list").find(".row:last").find(".checkshow").length == 0){
      $("#risk_factor_list").find(".row:last").html('<div class="col-lg-4"><input type="checkbox" checked class="checkshow" value="'+$("#health_risk_factor_val").val()+'"><span>'+$("#health_risk_factor_val").val()+'</span></div></div>');
    }else{
      if($("#risk_factor_list").find(".row:last").find(".checkshow").length < 3){
        $("#risk_factor_list").find(".row:last").append('<div class="col-lg-4"><input type="checkbox" checked class="checkshow" value="'+$("#health_risk_factor_val").val()+'"><span>'+$("#health_risk_factor_val").val()+'</span></div></div>');
      }else{
        $("#risk_factor_list").append('<div class="row"><div class="col-lg-4"><input type="checkbox" checked class="checkshow" value="'+$("#health_risk_factor_val").val()+'"><span>'+$("#health_risk_factor_val").val()+'</span></div></div>');
      }
    }
    $("#health_risk_factor_val").val('');
  }


  function getChartingTemplateSetting(){
    tamsaFactories.blockScreen("Please wait...");
    $.couch.db(db).view("tamsa/getChartingTemplateSettings",{
      success:function(data){
        if(data.rows.length > 0){
          $("#save_charting_template_setting").data("index",data.rows[0].doc._id);
          $("#save_charting_template_setting").data("rev",data.rows[0].doc._rev);
          $("#charting_template_24").val(data.rows[0].doc.one_day_preference);
          $("#charting_template_48").val(data.rows[0].doc.two_days_preference);
          if(data.rows[0].value.chartnote_checked){
            $("#show_template").attr("checked","checked");
            getDoctorListForChartnote(data);
          }else{
            $("#show_template").removeAttr("checked");
            $(".show_doctor_list_template").hide();
          }
          var output = [];
          if(data.rows[0].doc.image_details && data.rows[0].doc.image_details.length > 0){
            for(var i=0;i<data.rows[0].doc.image_details.length;i++){
              output.push('<tr class="ct-image-configuration">');
              output.push('<td class="ct-image-specialization">'+data.rows[0].doc.image_details[i].specialization+'</td>');
              output.push('<td class="ct-image-name">'+data.rows[0].doc.image_details[i].image_name+'</td>');
              // output.push('<td class="ct-image-width">'+data.rows[0].doc.image_details[i].image_width+'</td>');
              // output.push('<td class="ct-image-height">'+data.rows[0].doc.image_details[i].image_height+'</td>');
              output.push('<td data-image-height="'+data.rows[0].doc.image_details[i].image_height+'" data-image-width="'+data.rows[0].doc.image_details[i].image_width+'" class="ct-image-data"><img width="100" height="100" src='+data.rows[0].doc.image_details[i].image_data+'></td>');
              output.push('<td><span class="label label-warning mrgright1 edit-charting-image pointer">Edit</span><span class="label label-warning remove-charting-image pointer">Remove</span></td>');
              output.push('</tr>');
            }
            $("#charting_template_images_configuration tbody").html(output.join(''));
            tamsaFactories.unblockScreen();
          }else{
            $("#charting_template_images_configuration tbody").html('<tr><td colspan="7" class="no-records">No records Found.</td></tr>');
            tamsaFactories.unblockScreen();
          }
        }else{
          unblockScreen();
          $("#charting_template_images_configuration tbody").html('<tr><td colspan="7" class="no-records">No records Found.</td></tr>');
        }
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

  function saveChartingTemplateSetting(){
    tamsaFactories.blockScreen("Please wait...");
    var image_details = [];
    $(".ct-image-configuration").each(function(){
      var img_data = {
        specialization: $(this).find(".ct-image-specialization").html(),
        image_name:     $(this).find(".ct-image-name").html(),
        image_width:    600,
        image_height:   430,
        // image_width:    $(this).find(".ct-image-data").data("image-width"),
        // image_height:   $(this).find(".ct-image-data").data("image-height"),
        image_data:     $(this).find(".ct-image-data img").attr("src")
      }
      image_details.push(img_data);
    });

    var save_charting_template_data = {
      doctype:               "charting_template_settings",
      update_ts:             new Date(),
      dhp_code:              pd_data.dhp_code,
      doctor_id:             pd_data._id,
      chartnote_checked:     $("#show_template").is(":checked"),
      chartnote_doctor_list: $("#doctor_list_template").val(),
      one_day_preference:    $("#charting_template_24").val(),
      two_days_preference:   $("#charting_template_48").val(),
      image_details:         image_details
    };

    if($("#save_charting_template_setting").data("index")){
      save_charting_template_data._id = $("#save_charting_template_setting").data("index");
      save_charting_template_data._rev = $("#save_charting_template_setting").data("rev");
    }
    $.couch.db(db).saveDoc(save_charting_template_data,{
      success:function(data){
        $("#save_charting_template_setting").data("index",data.id);
        $("#save_charting_template_setting").data("rev",data.rev);
        newAlert("success", "Charting Template Settings saved Successfully.");
        $('body,html').animate({scrollTop: 0}, 'slow');
        getSpecializationDocStore();
        tamsaFactories.unblockScreen();
      },
      error:function(data,error,reason){
        newAlert("danger", reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function getSpecializationDocStore(){
    $.couch.db(db).view("tamsa/getSpecializationList", {
        success:function(data){
          if(data.rows.length > 0){
            var new_list = data.rows[0].value.specialization;
            if($("#save_charting_template_setting").data("special_name")){
              $.each($("#save_charting_template_setting").data("special_name"),function(index,spevalue){
                if($.inArray(spevalue, new_list ) == -1){
                  new_list.push(spevalue);
                }    
              }); 
              var doc = {
                _id:            data.rows[0].value._id,
                _rev:           data.rows[0].value._rev,
                doctype:        data.rows[0].value.doctype,
                specialization: new_list
              } 
              $.couch.db(db).saveDoc(doc,{
                success:function(data){
                  console.log(data);
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                }
              });
            }  
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:"specialization_list",
        include_docs:true
      });
   
  }

  function addChartingTemplateImage(){
    if(validateChartingTemplateImage()) {
      if($("#save_charting_template_images").data("rowObj")) {
        var $ele = $("#save_charting_template_images").data("rowObj");
        if(!$("#charting_template_image_specialization").val()){
          if($("#charting_template_image_specialization_by_text").val().trim() != ""){
          $ele.closest("tr").find(".ct-image-specialization").html($("#charting_template_image_specialization_by_text").val());  
          }
        }else{
          $ele.closest("tr").find(".ct-image-specialization").html($("#charting_template_image_specialization").val());
        }
        $ele.closest("tr").find(".ct-image-name").html($("#charting_template_image_name").val());
        $ele.closest("tr").find(".ct-image-data").find("img").attr("src",$("#charting_template_image_file").data("img-data"));
        $ele.closest("tr").find(".ct-image-data").data("image-width",$("#charting_template_image_width").val());
        $ele.closest("tr").find(".ct-image-data").data("image-height",$("#charting_template_image_height").val());
        $("#add_charting_template_images_modal").modal("hide");
      }else {
        var output = [];
        output.push('<tr class="ct-image-configuration">');
        if(!$("#charting_template_image_specialization").val()){
          if($("#charting_template_image_specialization_by_text").val().trim() != ""){
          output.push('<td class="ct-image-specialization">'+$("#charting_template_image_specialization_by_text").val()+'</td>');
            var aryy = $("#save_charting_template_setting").data("special_name") || [];
            aryy.push($("#charting_template_image_specialization_by_text").val());
            $("#save_charting_template_setting").data("special_name",aryy);
          }
        }else{
          output.push('<td class="ct-image-specialization">'+$("#charting_template_image_specialization").val()+'</td>');
        }
        output.push('<td class="ct-image-name">'+$("#charting_template_image_name").val()+'</td>');
        // output.push('<td class="ct-image-width">'+$("#charting_template_image_width").val()+'</td>');
        // output.push('<td class="ct-image-height">'+$("#charting_template_image_height").val()+'</td>');
        output.push('<td data-image-width="'+$("#charting_template_image_width").val()+'" data-image-height="'+$("#charting_template_image_height").val()+'" class="ct-image-data"><img src="'+$("#charting_template_image_file").data("img-data")+'" width="100" height="100"></td>');
        output.push('<td><span class="label label-warning mrgright1 edit-charting-image pointer">Edit</span><span class="label label-warning remove-charting-image pointer">Remove</span></td>');
        output.push('</tr>');
        $("#add_charting_template_images_modal").modal("hide");
        if($("#charting_template_images_configuration tbody").find(".no-records").length > 0) {
          $("#charting_template_images_configuration tbody").find(".no-records").remove();
          $("#charting_template_images_configuration tbody").append(output.join(''));
        }else{
          $("#charting_template_images_configuration tbody").append(output.join(''));
        }  
      }
    }
  }

  function getImageDataURIForChartingTemplateImage(obj){
    if(validateImageFile(obj)) {
      var width = obj.clientWidth;
      var height = obj.clientHeight;
      $("#charting_template_image_width").val(width);
      $("#charting_template_image_height").val(height);
      returnImageURI(obj);
    }else{
      return false;
    }
  }

  function addChartingImageConfiguration() {
    $("#charting_template_image_specialization").val("");
    getAllExistingSpecializationList("charting_template_image_specialization");
    $("#charting_template_image_specialization_by_text").val("");
    createModal("add_charting_template_images_modal");
    $("#charting_template_image_file").parent().find("img").remove();
    $("#save_charting_template_images").data("rowObj", "");
  }

  function editChartingImageConfiguration($obj) {
    createModal("add_charting_template_images_modal");
    $("#charting_template_image_specialization_by_text").val("").hide();
    $("#save_charting_template_images").data("rowObj", $obj);
    var special = $obj.closest("tr").find(".ct-image-specialization").html();
    var special_value = [];
    $('#charting_template_image_specialization option').each(function(index,value){
      special_value.push(this.value);
    });
    if($.inArray(special, special_value)==-1){
      $("#charting_template_image_specialization").hide();
      $("#charting_template_image_specialization_by_text").val(special);
      $("#charting_template_image_specialization_by_text").show();
      $("#clk_toggle_lbl_third").html("select form list");
    }else{
      $("#charting_template_image_specialization_by_text").hide();
      $("#charting_template_image_specialization").val(special);
      $("#charting_template_image_specialization").show();
      $("#clk_toggle_lbl_third").html("to add new");
    }

   $("#charting_template_image_name").val($obj.closest("tr").find(".ct-image-name").html());
    $("#charting_template_image_width").val($obj.closest("tr").find(".ct-image-data").data("image-width"));
    $("#charting_template_image_height").val($obj.closest("tr").find(".ct-image-data").data("image-height"));
    $("#charting_template_image_file").data("img-data", $obj.closest("tr").find(".ct-image-data img").attr("src"));
    var src = $("#charting_template_image_file").data("img-data");
    $("#charting_template_image_file").parent().find("img").remove();
    $("#charting_template_image_file").parent().append("<img height='100' width='100' src='"+src+"'>");
  }

  function removeChartingImageConfiguration($obj) {
    if($obj.closest("#charting_template_images_configuration").find("tr").length == 1) { 
      newAlert("danger","Atleast One Prepopulated image is required. You can not remove prepopulated images.");
      return false;
    }else {
      $obj.closest("tr").remove();
    }
  }

  function clearAddChartingTemplateImagesModal() {
    $("#charting_template_image_specialization").val("");
    $("#charting_template_image_name").val("");
    $("#charting_template_image_width").val("");
    $("#charting_template_image_height").val("");
    $("#charting_template_image_file").val("").data("img-data", "");
  }

  function changeUserPassword() {
    $("#change_password").attr("disabled","disabled");
    if (validateResetPassword()) {
      $.ajax({
        url:"/api/change_password",
        type:"POST",
        data:{
          password:$("#old_password_change").val(),
          db:replicated_db,
          new_password:$("#new_password_change").val()
        },
        success:function(data){
          if(data) {
            newAlert("success", "You will shortly receive password chnage confirmation mail.");
            $("#old_password_change").val("");
            $("#confirm_password_change").val("");
            $("#new_password_change").val("");
            $("#change_password").removeAttr("disabled");
          }else {
            console.log("something wrong with API.");
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      })
      // $.couch.login({
      //   name: $("#pdemail").val(),
      //   password: $("#old_password_change").val(),
      //   success: function(data) {   
      //     var reset_password = {
      //       user_id:      pd_data._id,
      //       new_password: $("#new_password_change").val(),
      //       operation_case: "16",
      //       doctype:        "cronRecords",
      //       processed:      "No"
      //     }
      //     $.couch.db(db).saveDoc(reset_password, {
      //       success: function(data) {
      //           newAlert("success", "You will shortly receive password chnage confirmation mail.");
      //           $("#old_password_change").val("");
      //           $("#confirm_password_change").val("");
      //           $("#new_password_change").val("");
      //           $("#change_password").removeAttr("disabled");
      //       },
      //       error: function(data, error, reason) {
      //         newAlert("danger", error);
      //         $("#change_password").removeAttr("disabled");
      //       }
      //     });
      //   },
      //   error: function(data, error, reason) {
      //     newAlert("danger", "Old password is wrong.");
      //     $("#change_password").removeAttr("disabled");
      //     return false;
      //   }
      // });
    }else{
      $("#change_password").removeAttr("disabled");
      return false;
    }
  }

  function getInvoicesettings() {
    console.log("call");
    $.couch.db(db).view("tamsa/getDiagnosisProcedures",{
      success:function(udata){
        if(udata.rows.length > 0){
          $("#is_save").data({
            "diagnosis_index": udata.rows[0].doc._id,
            "diagnosis_rev": udata.rows[0].doc._rev
          });
          var diagnosis_procedure_data = [];
          $("#list_of_procedure_diagnosis tbody").html("");
          if(udata.rows[0].doc.diagnosis.length > 0){
            for(var i=0;i<udata.rows[0].doc.diagnosis.length;i++){
              diagnosis_procedure_data.push("<tr>");
              diagnosis_procedure_data.push("<td>Diagnosis</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].diagnosis_name+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].hospital_diagnosis_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].hospital_billing_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].icd_10_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].description+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.diagnosis[i].charges+"</td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning edit-procedure-diagnosis pointer'>Edit</span></td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning remove-procedure-diagnosis pointer'>remove</span></td>");
              diagnosis_procedure_data.push("</tr>");            
            }
          }

          if(udata.rows[0].doc.procedures.length > 0){
            for(var j=0;j<udata.rows[0].doc.procedures.length;j++){
              diagnosis_procedure_data.push("<tr>");
              diagnosis_procedure_data.push("<td>Procedure</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].procedure_name+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].hospital_procedure_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].hospital_billing_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].icd_10_pc_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].description+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.procedures[j].charges+"</td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning edit-procedure-diagnosis pointer'>Edit</span></td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning remove-procedure-diagnosis pointer'>remove</span></td>");
              diagnosis_procedure_data.push("</tr>");
            }  
          }

          if(udata.rows[0].doc.services && udata.rows[0].doc.services.length > 0){
            for(var j=0;j<udata.rows[0].doc.services.length;j++){
              diagnosis_procedure_data.push("<tr>");
              diagnosis_procedure_data.push("<td>Service<div style='display:none;'><span class='save_duration'>"+udata.rows[0].doc.services[j].session_duration+"</span><span class='save_form_id' data-misc_form_id='"+udata.rows[0].doc.services[j].form_id+"'></span><span class='save_location'>"+udata.rows[0].doc.services[j].location+"</span></div></td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].service_name+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].hospital_service_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].hospital_billing_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].icd_10_code+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].description+"</td>");
              diagnosis_procedure_data.push("<td>"+udata.rows[0].doc.services[j].charges+"</td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning edit-procedure-diagnosis pointer'>Edit</span></td>");
              diagnosis_procedure_data.push("<td><span class='label label-warning remove-procedure-diagnosis pointer'>Remove</span></td>");
              diagnosis_procedure_data.push("</tr>");
            }
          }  

          $("#list_of_procedure_diagnosis tbody").append(diagnosis_procedure_data.join(''));
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

  // Display image uploaded via input type image
  function getLogoFromUpload(obj){
    if($(obj).disabled) return alert('File upload not supported!');
    var F = obj.files;
    readImage(F[0]);
  }

  function readImage(file) {
    var reader = new FileReader();
    var image  = new Image();

    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
      image.src    = _file.target.result;              // url.createObjectURL(file);
      image.onload = function() {
        $('#uploaded_logo_preview, #preview_invoice_logo').html('<img style="width:250px;height:110px;" src="'+ this.src +'">');
        $("#myDrop").hide().children().remove();
      };
      image.onerror= function() {
        alert('Invalid file type: '+ file.type);
      };      
    };
  }

  function displayDiagnosisProcedure(value){
    if(value == "Diagnosis"){
      $("#diagnosis_procedure_name").text("Diagnosis Name");
      $("#diagnosis_procedure_code").text("Hospital Diagnosis Code");
      $("#diagnosis_procedure_icd").text("ICD-10 Code");
      $("#diagnosis_procedure_parent").show();
      $("#service_location, #service_location_val, #service_location_val_parent, #service_duration_parent").hide();
    }else if(value == "Procedure"){
      $("#diagnosis_procedure_name").text("Procedure Name");
      $("#diagnosis_procedure_code").text("Hospital Procedure Code");
      $("#diagnosis_procedure_icd").text("ICD-10 PC Code");
      $("#diagnosis_procedure_parent").show();
      $("#service_location, #service_location_val, #service_location_val_parent, #service_duration_parent").hide();
    }else if(value == "Service"){
      $("#diagnosis_procedure_name").text("Service Name");
      $("#diagnosis_procedure_code").text("Hospital Service Code");
      $("#diagnosis_procedure_icd").text("ICD-10 Code");
      $("#diagnosis_procedure_parent, #service_location, #service_location_val, #service_location_val_parent, #service_duration_parent").show();
      appendHospitalDocumentsInServiceForms();
    }else{
      $("#diagnosis_procedure_parent, #service_location, #service_location_val, #service_location_val_parent, #service_duration_parent").hide();
    }
  }

  function appendHospitalDocumentsInServiceForms(){
    $.couch.db(db).view("tamsa/getMiscDocuments", {
      success: function(data) {
        if(data.rows.length > 0){
          var document_table = "";
          for (var i = data.rows.length - 1; i >= 0; i--) {
            $("#service_form").append("<option value='"+data.rows[i].doc._id+"'>"+data.rows[i].doc.document_name+"</option>");
          };
          $("#service_form").multiselect({
            selectedList: 1,
            noneSelectedText: "Select Multiple",
            header:false,
            click: function(event, ui){
              var tempval = [];
              if(ui.checked){
                for(var i=0;i<data.rows.length;i++){
                  if(data.rows[i].doc._id == ui.value){
                    var url = "/api/attachment?attachment_name="+Object.keys(data.rows[i].doc._attachments)[0]+"&db="+personal_details_db+"&id="+data.rows[i].id;
                    tempval.push('<tr>');
                    tempval.push('<td docid = "'+ui.value+'">'+ui.text+'</td>');
                    tempval.push('<td align="center"><a href="'+url+'" target="_blank"><span class="label label-warning">View</span></a><span class="label label-warning send_hospital_doc">Send</span>');
                    tempval.push('</tr>');
                  }
                }
                $("#view_invoice_services tbody").append(tempval.join(''));
              // console.log(ui.value);
              // $callback.text(ui.value + ' ' + (ui.checked ? 'checked' : 'unchecked') );
              }else{
                $("#view_invoice_services tbody tr").find("td:contains('"+ui.text+"')").parent().remove();
              }
            }
          });
          $("#service_form").next().css("width","unset");
        }else{
          $("#service_form").append("<option>No Document Found</option>");
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code, {}],
      include_docs: true
    });
  }

  function addMoreDiagnosisProcedure(){
    if(validateDiagnosisProcedureInvoiceSetting()){
      var diagnosis_procedure_data = [];
      diagnosis_procedure_data.push("<tr>");
      diagnosis_procedure_data.push("<td>"+$("#choose_diagnosis_procedure").val());
      if($("#choose_diagnosis_procedure").val() == "Service"){
        diagnosis_procedure_data.push("<div style='display:none;'><span class='save_location'>"+$("#service_location_val").val()+"</span><span class='save_duration'>"+$("#service_duration_val").val()+"</span><span class='save_form_id' data-misc_form_id='"+$("#service_form").val()+"'></span></div></td>");
      }else{
        diagnosis_procedure_data.push("</td>");  
      }
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_name_val").val()+"</td>");
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_billcode_val").val()+"</td>");
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_code_val").val()+"</td>");
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_icd_val").val()+"</td>");
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_description_val").val()+"</td>");
      diagnosis_procedure_data.push("<td>"+$("#diagnosis_procedure_charges_val").val()+"</td>");
      diagnosis_procedure_data.push("<td><span class='label label-warning edit-procedure-diagnosis pointer'>Edit</span></td>");
      diagnosis_procedure_data.push("<td><span class='label label-warning remove-procedure-diagnosis pointer'>remove</span></td>");
      diagnosis_procedure_data.push("</tr>");
      $("#list_of_procedure_diagnosis tbody").append(diagnosis_procedure_data.join(''));
      clearaddMoreDiagnosisProcedure();
      return true;
    }else{
      return false;
    }
  }

  function removeProcedureDiagnosis($obj){
    $obj.parents("tr").remove();
  }

  function editProcedureDiagnosis($obj){
   // edit_procedure_diagnosis

      $("#edit_procedure_diagnosis").modal({
                  show:true,
                  backdrop:'static',
                  keyboard:false
                });
      $('#edit_pd_type').val($obj.parent().parent().find("td:nth-child(1)").text());
      $('#edit_pd_name').val($obj.parent().parent().find("td:nth-child(2)").text());
      $('#edit_hospital_pd_code').val($obj.parent().parent().find("td:nth-child(3)").text());
      $('#edit_hospital_billcode').val($obj.parent().parent().find("td:nth-child(4)").text());
      $('#edit_icd_code').val($obj.parent().parent().find("td:nth-child(5)").text());
      $('#edit_description').val($obj.parent().parent().find("td:nth-child(6)").text());
      $('#edit_charge').val($obj.parent().parent().find("td:nth-child(7)").text());
      $('#save_procedure_diagonosis').data("obj",$obj); 
  }

  function saveEditedProcedureDiagnosis(){
    var $ele = $('#save_procedure_diagonosis').data("obj").parents("tr");
    $ele.find("td:nth-child(1)").text($('#edit_pd_type').val());
    $ele.find("td:nth-child(2)").text($('#edit_pd_name').val());
    $ele.find("td:nth-child(3)").text($('#edit_hospital_pd_code').val());
    $ele.find("td:nth-child(4)").text($('#edit_hospital_billcode').val());
    $ele.find("td:nth-child(5)").text($('#edit_icd_code').val());
    $ele.find("td:nth-child(6)").text($('#edit_description').val());
    $ele.find("td:nth-child(7)").text($('#edit_charge').val());
    $("#edit_procedure_diagnosis").modal("hide");
  }

  function clearaddMoreDiagnosisProcedure(){
    // $("#choose_diagnosis_procedure").val("Please Select");
    $("#diagnosis_procedure_name_val").val("");
    $("#diagnosis_procedure_billcode_val").val("");
    $("#diagnosis_procedure_code_val").val("");
    $("#diagnosis_procedure_icd_val").val("");
    $("#diagnosis_procedure_charges_val").val("");
    $("#diagnosis_procedure_description_val").val("");
    $("#service_duration_val").val("");
    $("#service_location_val").val("");
    $("#service_form").multiselect("uncheckAll");
    $("#view_invoice_services tbody tr").remove();
  }

  function sendHospitalDocumentToDoctor($obj){
    var cron_send_hospital_doc = {
      doctype:        "cronRecords",
      operation_case: "25",
      processed:      "No",
      document_name:  $obj.parent().prev().html(),
      dhp_code:       pd_data.dhp_code,
      doctor_id:      pd_data._id,
      doctor_email:   $("#pdemailalert").val()?$("#pdemailalert").val():$("#pdemail").val(),
      doctor_name:    pd_data.first_name  +" "+pd_data.last_name,
      doctor_level:   $("#pd_level").val(),
      document_id:    $obj.parent().prev().attr("docid")
    };
    $.couch.db(db).saveDoc(cron_send_hospital_doc,{
      success:function(data){
        newAlert("success","Document(Form) Successfully Sent.Please check your registered Email.");
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;        
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;
      }  
    });
  }

  function previewInvoiceSetting(){
    if(validateInvoiceSettingPreview()){
      $("#preview_invoice_setting_modal").modal({
        show:true,
        backdrop:'static',
        keyboard:false
      });

      $("#preview_address").text($("#invoice_address_val").val());
      $("#preview_sec_address").text($("#invoice_sec_address_val").val());
      $("#preview_city_state_pincode").text($("#invoice_address_city").val() +", "+ $("#invoice_address_states").val() +", " +$("#invoice_address_zip").val());
      //$("#preview_phone").text();
      $("#preview_DHP_code").text(pd_data.dhp_code);
      $("#preview_invoice_footer_content").text($("#invoice_footer").val());
      $("#preview_hospital_email").html($("#invoice_hospital_email").val());
      $("#preview_hospital_website").html($("#invoice_hospital_website").val());
      if($("#is_display_logo").prop("checked")){
        $("#preview_invoice_logo").find("img").show().attr("src",$("#preview_image").attr("src"));
      }else{
        $("#preview_invoice_logo").find("img").hide().attr("src","");
      }
    }
  }

  function getCommunicationSettings(){
    $.couch.db(db).view("tamsa/getCommunicationSettings",{
      success:function(data){
        if(data.rows.length > 0){
          //$("#default_calendar_office").val(data.rows[0].doc.calender_setting.default_office);
          //$("#default_duration_exam").val(data.rows[0].doc.calender_setting.default_duration);
          $("#default_calendar_increment").val(data.rows[0].doc.calender_setting.exam_increment);
          $("#appointment_overlap").prop("checked",data.rows[0].doc.calender_setting.appointment_overlap);

          $("#daily_agenda_mail").prop("checked",data.rows[0].doc.email_setting.daily_agenda_mails);
          $("#daily_billing_problem_mail").prop("checked",data.rows[0].doc.email_setting.daily_billing_problems_mails);
          $("#online_scheduling_email").prop("checked",data.rows[0].doc.email_setting.online_scheduling_emails);
          $("#include_notes_in_email").prop("checked",data.rows[0].doc.email_setting.include_notes_in_emails);

          $("#sms_to_doctor").find(".new_appointment").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.new_appointment);
          $("#sms_to_doctor").find(".appointment_rescheduling").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.appointment_rescheduling);
          $("#sms_to_doctor").find(".appointment_cancellation").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.appointment_cancellation);
          $("#sms_to_doctor").find(".lab_new_order").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.lab_new_order);
          $("#sms_to_doctor").find(".lab_upload_doctor").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.lab_upload_doctor);
          // $("#sms_to_doctor").find(".pharmacy_new_order").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.pharmacy_new_order);
          // $("#sms_to_doctor").find(".pharmacist_medic_pickup").prop("checked",data.rows[0].doc.sms_setting.sms_to_doctor.pharmacist_medic_pickup);

          $("#sms_to_hospital_admin").find(".new_appointment").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.new_appointment);
          $("#sms_to_hospital_admin").find(".appointment_rescheduling").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.appointment_rescheduling);
          $("#sms_to_hospital_admin").find(".appointment_cancellation").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.appointment_cancellation);
          $("#sms_to_hospital_admin").find(".lab_new_order").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.lab_new_order);
          $("#sms_to_hospital_admin").find(".lab_upload_doctor").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.lab_upload_doctor);
          // $("#sms_to_hospital_admin").find(".pharmacy_new_order").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.pharmacy_new_order);
          // $("#sms_to_hospital_admin").find(".pharmacist_medic_pickup").prop("checked",data.rows[0].doc.sms_setting.sms_to_hospital_admin.pharmacist_medic_pickup);

          $("#remainder_to_doctor_hours").find(".new_appointment").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.new_appointment);
          $("#remainder_to_doctor_hours").find(".appointment_rescheduling").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.appointment_rescheduling);
          $("#remainder_to_doctor_hours").find(".appointment_cancellation").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.appointment_cancellation);
          $("#remainder_to_doctor_hours").find(".lab_new_order").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.lab_new_order);
          $("#remainder_to_doctor_hours").find(".lab_upload_doctor").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.lab_upload_doctor);
          // $("#remainder_to_doctor_hours").find(".pharmacy_new_order").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.pharmacy_new_order);
          // $("#remainder_to_doctor_hours").find(".pharmacist_medic_pickup").prop("checked",data.rows[0].doc.sms_setting.remainder_to_doctor_hours.pharmacist_medic_pickup);
          $("#appointment_remainder_to_client_email").val(data.rows[0].doc.sms_to_patient_setting.appointment_remainder_email);
          $("#sms_freq_appointment_remainder_sms").val(data.rows[0].doc.sms_to_patient_setting.sms_freq_appointment_remainder);
          $("#appointment_rescheduling_sms").val(data.rows[0].doc.sms_to_patient_setting.appointment_rescheduling);
          $("#appointment_cancellation_sms").val(data.rows[0].doc.sms_to_patient_setting.appointemnt_cancellation);
          $("#new_lab_result_order_sms").val(data.rows[0].doc.sms_to_patient_setting.new_lab_order_results_availabel);
          $("#save_communication_setting").data("index",data.rows[0].doc._id);
          $("#save_communication_setting").data("rev",data.rows[0].doc._rev);
          $("#save_communication_setting").data("rev",data.rows[0].doc._rev);
          $("#missed_appointment_request_message").val(data.rows[0].doc.missed_appointment_request_message);
          $("#due_task_notification_popup").val(data.rows[0].doc.due_task_notification_hours ? data.rows[0].doc.due_task_notification_hours: "4");
        }else{
          $("#sms_to_doctor").find(".new_appointment").prop("checked","checked");
          $("#sms_to_doctor").find(".appointment_rescheduling").prop("checked","checked");
          $("#sms_to_doctor").find(".appointment_cancellation").prop("checked","checked");
          $("#sms_to_doctor").find(".lab_upload_doctor").prop("checked","checked");

          $("#remainder_to_doctor_hours").find(".new_appointment").prop("checked","checked");
          $("#remainder_to_doctor_hours").find(".appointment_rescheduling").prop("checked","checked");
          $("#remainder_to_doctor_hours").find(".appointment_cancellation").prop("checked","checked");
          $("#remainder_to_doctor_hours").find(".lab_upload_doctor").prop("checked","checked");
          saveCommunicationSetting();
        }
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

  function saveCommunicationSetting(){
    // default_office:      $("#default_calendar_office").val(),
    // default_duration:    $("#default_duration_exam").val(),
    var calendar_setting_data = {
      exam_increment:      $("#default_calendar_increment").val(),
      appointment_overlap: $("#appointment_overlap").prop("checked")
    };

    var email_setting_data = {
      daily_agenda_mails:           $("#daily_agenda_mail").prop("checked"),
      daily_billing_problems_mails: $("#daily_billing_problem_mail").prop("checked"),
      online_scheduling_emails:     $("#online_scheduling_email").prop("checked"),
      include_notes_in_emails:      $("#include_notes_in_email").prop("checked")
    };

    var sms_to_doctor_data = {
      new_appointment:          $("#sms_to_doctor").find(".new_appointment").prop("checked"),
      appointment_rescheduling: $("#sms_to_doctor").find(".appointment_rescheduling").prop("checked"),
      appointment_cancellation: $("#sms_to_doctor").find(".appointment_cancellation").prop("checked"),
      lab_new_order:            $("#sms_to_doctor").find(".lab_new_order").prop("checked"),
      lab_upload_doctor:        $("#sms_to_doctor").find(".lab_upload_doctor").prop("checked"),
      // pharmacy_new_order:       $("#sms_to_doctor").find(".pharmacy_new_order").prop("checked"),
      // pharmacist_medic_pickup:  $("#sms_to_doctor").find(".pharmacist_medic_pickup").prop("checked")
    };

    var sms_to_hospital_admin_data = {
      new_appointment:          $("#sms_to_hospital_admin").find(".new_appointment").prop("checked"),
      appointment_rescheduling: $("#sms_to_hospital_admin").find(".appointment_rescheduling").prop("checked"),
      appointment_cancellation: $("#sms_to_hospital_admin").find(".appointment_cancellation").prop("checked"),
      lab_new_order:            $("#sms_to_hospital_admin").find(".lab_new_order").prop("checked"),
      lab_upload_doctor:        $("#sms_to_hospital_admin").find(".lab_upload_doctor").prop("checked"),
      // pharmacy_new_order:       $("#sms_to_hospital_admin").find(".pharmacy_new_order").prop("checked"),
      // pharmacist_medic_pickup:  $("#sms_to_hospital_admin").find(".pharmacist_medic_pickup").prop("checked")
    };

    var remainder_to_doctor_hours_data = {
      new_appointment:          $("#remainder_to_doctor_hours").find(".new_appointment").prop("checked"),
      appointment_rescheduling: $("#remainder_to_doctor_hours").find(".appointment_rescheduling").prop("checked"),
      appointment_cancellation: $("#remainder_to_doctor_hours").find(".appointment_cancellation").prop("checked"),
      lab_new_order:            $("#remainder_to_doctor_hours").find(".lab_new_order").prop("checked"),
      lab_upload_doctor:        $("#remainder_to_doctor_hours").find(".lab_upload_doctor").prop("checked"),
      // pharmacy_new_order:       $("#remainder_to_doctor_hours").find(".pharmacy_new_order").prop("checked"),
      // pharmacist_medic_pickup:  $("#remainder_to_doctor_hours").find(".pharmacist_medic_pickup").prop("checked")
    };

    var sms_stting_data = {
      sms_to_doctor:             sms_to_doctor_data,
      sms_to_hospital_admin:     sms_to_hospital_admin_data,
      remainder_to_doctor_hours: remainder_to_doctor_hours_data 
    };

    var sms_to_patient_data = {
      appointment_remainder_email:     $("#appointment_remainder_to_client_email").val(),
      sms_freq_appointment_remainder:  $("#sms_freq_appointment_remainder_sms").val(),
      appointment_rescheduling:        $("#appointment_rescheduling_sms").val(),
      appointemnt_cancellation:        $("#appointment_cancellation_sms").val(),
      new_lab_order_results_availabel: $("#new_lab_result_order_sms").val()
    };

    var d  = new Date();

    var save_communication_setting_data = {
      doctype:                            "communication_setting",
      update_ts:                          d,
      doctor_id:                          pd_data._id,
      dhp_code:                           pd_data.dhp_code,
      calender_setting:                   calendar_setting_data,
      email_setting:                      email_setting_data,
      sms_setting:                        sms_stting_data,
      sms_to_patient_setting:             sms_to_patient_data,
      due_task_notification_hours:        $("#due_task_notification_popup").val(),
      missed_appointment_request_message: $("#missed_appointment_request_message").val()
    };

    if($("#save_communication_setting").data("index")){
      save_communication_setting_data._id  = $("#save_communication_setting").data("index");
      save_communication_setting_data._rev = $("#save_communication_setting").data("rev");
    }
    $.couch.db(db).saveDoc(save_communication_setting_data,{
      success:function(data){
        newAlert("success", "Communication Settings successfully saved");
        $('body,html').animate({scrollTop: 0}, 'slow');
        $("#save_communication_setting").data("index",data.id);
        $("#save_communication_setting").data("rev",data.rev);
        return false;
      },
      error:function(data,error,reason){
        newAlert("danger", reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function generateNewDoseInImmunization(){
    $("#dose_number").val(Number($("#dose_number").val()) + 1);
    $(".no-dose-details").remove();
    var immunization_details = [];
    immunization_details.push('<tr class="immunization-dose-row">');
      immunization_details.push('<td width="10%" class="dose-no">Dose '+$("#dose_number").val()+'</td>');
      immunization_details.push('<td width="15%" class="dose-name"><input class="form-control" type="text"></td>');
      immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control min-age-value" type="text"></div><div class="col-lg-8"><select class="form-control min-age-type"><option>Days</option><option>Months</option><option>Years</option></select></div></td>');
      immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control max-age-value" type="text"></div><div class="col-lg-8"><select class="form-control max-age-type"><option>Days</option><option>Months</option><option>Years</option></select></div></td>');
      immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control dose-interval-value" type="text"></div><div class="col-lg-8"><select class="form-control dose-interval-type"><option>Days</option><option>Months</option><option>Years</option></select></div></td>');
    immunization_details.push('</tr>');
    $("#immunization_details_table tbody").append(immunization_details.join(''));
  }

  function removeDoseInImmunization(){
    if($("#dose_number").val() != "0"){
      $("#dose_number").val(Number($("#dose_number").val()) - 1);
      $(".immunization-dose-row:last").remove();
    }
    if($("#dose_number").val() == "0") $("#immunization_details_table tbody").html('<tr class="no-dose-details"><td colspan="4">No Dose has been added. Please Add No of Dose.</td></tr>');
  }

  function clearImmunizationSetting(){
    $("#immunization_name option").remove();
    $("#immunization_details_table tbody").html("");
    $("#dose_number").val("0").attr("readonly","readonly");
  }

  function getImmunizationSetting(){
    clearImmunizationSetting();
    $("#immunization_no_of_dose, #immunization_dose_details_label, #immunization_details_table").hide();
    $("#immunization_name").append('<option>Select Vaccination</option>');
    $.couch.db(db).openDoc("vaccination_default_rules",{
      success:function(data){
        for(var i=0;i<data.vaccination_details.length;i++){
          $("#immunization_name").append('<option>'+data.vaccination_details[i].vaccination_name+'</option>');
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function displayImmunizationRule(data){
    var immunization_details = [];
    $("#dose_number").val(data.length);
    for(var i=0;i<data.length;i++){
      immunization_details.push('<tr class="immunization-dose-row">');
        immunization_details.push('<td width="10%" class="dose-no">'+data[i].dose_no+'</td>');
        immunization_details.push('<td width="15%" class="dose-name"><input class="form-control" type="text" value="'+data[i].dose_name+'"></td>');
        immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control min-age-value" value="'+data[i].min_age_value+'" type="text"></div><div class="col-lg-8"><select class="form-control min-age-type">'+selectedTypeinDoseDetails(data[i].min_age_type)+'</select></div></td>');
        immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control max-age-value" value="'+data[i].max_age_value+'" type="text"></div><div class="col-lg-8"><select class="form-control max-age-type">'+selectedTypeinDoseDetails(data[i].max_age_type)+'</select></div></td>');
        immunization_details.push('<td width="25%"><div class="col-lg-4"><input class="form-control dose-interval-value" type="text" value="'+data[i].dose_interval_value+'"></div><div class="col-lg-8"><select class="form-control dose-interval-type">'+selectedTypeinDoseDetails(data[i].dose_interval_type)+'</select></div></td>');
      immunization_details.push('</tr>');
    }
    $("#immunization_details_table tbody").html(immunization_details.join(''));
  }

  function getImmunizationDetails($obj){
    if($obj.val() == "noselect"){
      $("#immunization_no_of_dose, #immunization_dose_details_label, #immunization_details_table").hide();
      $("#dose_number").val("0");
    }else{
      $.couch.db(db).view("tamsa/getImmunizationDetails",{
        success:function(data){
          $("#immunization_no_of_dose, #immunization_dose_details_label, #immunization_details_table").show();
          $("#dose_number").val("0");
          if(data.rows.length > 0){
            $("#save_immunization_setting").data("index",data.rows[0].doc._id);
            $("#save_immunization_setting").data("rev",data.rows[0].doc._rev);
            if(data.rows[0].doc.default_dose) $("#save_immunization_setting").data("default_dose",data.rows[0].doc.default_dose);
            displayImmunizationRule(data.rows[0].doc.custom_dose);
          }else{
            $.couch.db(db).openDoc("vaccination_default_rules",{
              success:function(data){
                for(var i=0;i<data.vaccination_details.length;i++){
                  if(data.vaccination_details[i].vaccination_name == $("#immunization_name").val()){
                    displayImmunizationRule(data.vaccination_details[i].default_dose);
                  }
                }
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
          newAlert(danger,reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;   
        },
        key:[pd_data.dhp_code,$obj.val()],
        include_docs:true
      });
    }
  }

  function setSelectedImmunizationRuleToDefault() {
    $.couch.db(db).openDoc("vaccination_default_rules",{
      success:function(data){
        if(data.vaccination_details.length > 0){
          for(var i=0;i<data.vaccination_details.length;i++){
            if(data.vaccination_details[i].vaccination_name == $("#immunization_name").val()){
              displayImmunizationRule(data.vaccination_details[i].default_dose);
            }
          }
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
    // $.couch.db(db).openDoc($("#save_immunization_setting").data("index"),{
    //   success:function(data){
    //     displayImmunizationRule(data.default_dose);
    //   },
    //   error:function(data,error,reason){
    //     newAlert("danger",reason);
    //     $("html, body").animate({scrollTop: 0}, 'slow');
    //     return false;
    //   }
    // });  
  }

  function selectedTypeinDoseDetails(type){
    if(type == "Days")return '<option>Days</option><option>Months</option><option>Years</option>'
    else if(type == "Months") return '<option>Days</option><option selected="selected">Months</option><option>Years</option>'
    else return '<option>Days</option><option>Months</option><option selected="selected">Years</option>'
  }

  function saveImmunizationSetting(){
    if(validateImmunizationSetting()){
      var temp_dose_details = [];
      $(".immunization-dose-row").each(function(){
        temp_dose_details.push({
          dose_no:             $(this).find(".dose-no").text(),
          dose_name:           $(this).find(".dose-name").find("input").val(),
          min_age_value:       $(this).find(".min-age-value").val(),
          min_age_type:        $(this).find(".min-age-type").val(),
          max_age_value:       $(this).find(".max-age-value").val(),
          max_age_type:        $(this).find(".max-age-type").val(),
          dose_interval_value: $(this).find(".dose-interval-value").val(),
          dose_interval_type:  $(this).find(".dose-interval-type").val(),
        });
      });
      var save_immunization_data = {
        doctype:           "immunization_details",
        update_ts:         new Date(),
        dhp_code:          pd_data.dhp_code,
        immunization_name: $("#immunization_name").val(),
        doctor_id:         pd_data._id,
        custom_dose:      temp_dose_details
      };
      if($("#save_immunization_setting").data("index")){
        save_immunization_data._id = $("#save_immunization_setting").data("index");
        save_immunization_data._rev = $("#save_immunization_setting").data("rev");
      }
      $.couch.db(db).saveDoc(save_immunization_data,{
        success:function(data){
          $("#save_immunization_setting").data("index",data.id);
          $("#save_immunization_setting").data("rev",data.rev);
          newAlert("success", "Immunization Details Successfully saved.");
          $('body,html').animate({scrollTop: 0}, 'slow');
        },
        error:function(data,error,reason){
          newAlert("danger", reason);
          $('body,html').animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    }else{
      console.log("invalid");
    }
  }

  function getEprescribeSettings() {
    $.couch.db(db).view("tamsa/getEprescribe", {
      success: function(data) {
        if(data.rows.length > 0) {
          $("#push_medications").attr("checked", data.rows[0].value.push_medications);
          $("#send_an_rx_directly").attr("checked", data.rows[0].value.send_an_rx_directly);
          $("#update_existing_medications").attr("checked", data.rows[0].value.update_existing_medications);
          $("#save_e_prescribe").attr("index", data.rows[0].value._id);
          $("#save_e_prescribe").attr("rev", data.rows[0].value._rev);

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

  function saveEBilling() {
    $("#save_e_billing").attr("disabled","disabled");
    var d  = new Date();
    var ebilling = {
      update_ts:      d,
      doctype:        "EBilling",
      dhp_code:       pd_data.dhp_code,
      doctor_id:      pd_data._id,
      enable_billing: $("#enable_billing").is(':checked')
    };

    if ($("#save_e_billing").attr("index") && $("#save_e_billing").attr("rev")) {
      ebilling._rev = $("#save_e_billing").attr("rev");
      ebilling._id  = $("#save_e_billing").attr("index");
    }

    $.couch.db(db).saveDoc(ebilling, {
      success: function(data) {
        $("#save_e_billing").attr("index",data.id);
        $("#save_e_billing").attr("rev",data.rev);
        newAlert('success', 'Saved successfully !');
        $('html, body').animate({scrollTop: 0}, 'slow');
        getEbilling();
        $("#save_e_billing").removeAttr("disabled");
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#save_e_billing").removeAttr("disabled");
      }
    })
  }

  function saveEprescribe() {
    $("#save_e_prescribe").attr("disabled","disabled");
    var d  = new Date();
    var eprescribe = {
      update_ts:             d,
      doctype:                     "Eprescribe",
      doctor_id:                   pd_data._id,
      push_medications:            $("#push_medications").is(':checked'),
      send_an_rx_directly:         $("#send_an_rx_directly").is(':checked'),
      update_existing_medications: $("#update_existing_medications").is(':checked')
    };

    if ($("#save_e_prescribe").attr("index") && $("#save_e_prescribe").attr("rev")) {
      eprescribe._rev = $("#save_e_prescribe").attr("rev");
      eprescribe._id  = $("#save_e_prescribe").attr("index");
    }

    $.couch.db(db).saveDoc(eprescribe, {
      success: function(data) {
        newAlert('success', 'Saved successfully !');
        $('html, body').animate({scrollTop: 0}, 'slow');
        getEprescribeSettings();
        $("#save_e_prescribe").removeAttr("disabled");
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#save_e_prescribe").removeAttr("disabled");
      }
    });
  }

  function showBSModalEvent(modal_id,callback) {
    $('#'+modal_id).on('show.bs.modal', function (e) {
       callback();
    });
  }

  function displaySearchPatient(user_id) {
    $(".tab-pane").removeClass("active");
    clearPatientProfileDetails();
    activateSearchPatient();
    updateSearchPatientWithUserDetails(user_id);
  }

  function updateSearchPatientWithUserDetails(user_id){
    var view = "";
    var keyval = "";
    if(pd_data.level == "Doctor" || pd_data.level == ""){
      view = "tamsa/getDoctorSubscribers";
      keyval = pd_data._id;
    }else{
      view = "tamsa/getDHPSubscribers";
      keyval  = pd_data.dhp_code;
    }
    $.couch.db(db).view(view, {
      success: function(data) {
        if(data.rows.length > 0){
          $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
            success:function(persoal_info){
              $.couch.db(db).view("tamsa/testPatientsInfo",{
                success:function(medical_info){
                  if(persoal_info.rows.length > 0){
                    getPatientProfileDetails(persoal_info,medical_info);
                  }
                },
                error:function(medical_info,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                },
                key: user_id,
                include_docs:true
              });
            },
            error:function(persoal_info,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key: user_id,
            include_docs:true
          });
        }
        else{
          newAlert("danger","Patient is not a subscriber. You can not edit.");
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error: function(status) {
        console.log(status);
      },
      key: [keyval,user_id],
      reduce:true,
      group:true
    });
  }

  function displayPatientInfo() {
    $(".tab-pane").removeClass("active");
    $("#single_user").addClass("active");
    $("#import_patient_tab").addClass("active");
    clearPatientProfileDetails();
    activateImportPatient();
  }

  function activateImportPatient(){
    $(".tab-pane").removeClass("active");
    $("#import_patient_tab").addClass("active");
    $("#import_patients_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#import_patients_link").addClass("ChoiceTextActive");
    // $("#single_user").find("#single_user_add").trigger("click");
    activateSingleUserAdd($("#single_user_add"));
  }

  function activateSearchPatient(){
    $(".tab-pane").removeClass("active");
    $("#search_patient_tab").addClass("active");
    $("#search_patient_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#search_patient_link").addClass("ChoiceTextActive");
  }

  function activateSingleUserAdd($obj){
    $obj.addClass("btn-warning");
    $("#single_user_by_dhp_id, #import_from_csv").addClass("btn-default").removeClass("btn-warning");
    $("#single_user_add_parent").show();
    $("#import_from_csv_parent,#single_user_by_dhp_id_parent").hide();
    $("#isu_physicians option").remove();
    getStates("isu_state","select state");
    $("#isu_city").html('<option selected="selected" value="select city">Select city</option>');

    $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
      success: function(data){
        for(var i=0; i<data.rows.length;i++){
          if( data.rows[i].value == pd_data._id || pd_data.level != "Doctor"){
            $("#isu_physicians").append("<option selected='selected' value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
            $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
            $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
          }else{
            $("#isu_physicians").append("<option email = "+data.rows[i].doc.email+" phone="+data.rows[i].doc.phone+" value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
            $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
            $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
          }
        }
      },error: function(data,error,reason){
        console.log(data);
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code,{}],
      include_docs:true
    });
    $.couch.db(db).openDoc("procedure_list",{
      success:function(data){
        if(data.procedures.length > 0){
          var proce=[];
          for (var i = 0; i < data.procedures.length; i++) {
            proce.push('<option value="'+data.procedures[i]+'">'+data.procedures[i]+'</option>');
          }
        }
        $("#isu_procedure").html(proce.join(''));
        $("#isu_procedure").multiselect({
          selectedList:2
        }).multiselectfilter({
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });

    $.couch.db(db).openDoc("condition_list",{
      success:function(data){
        if(data.conditions.length > 0){
          var cond=[];
          for (var i = 0; i < data.conditions.length; i++) {
            cond.push('<option value="'+data.conditions[i]+'">'+data.conditions[i]+'</option>');
          }
        }
        $("#isu_condition").html(cond.join(''));
        $("#isu_condition").multiselect({
          selectedList:2
        }).multiselectfilter({
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
    getAllergiesFromDoc("issu_name_allergies","issu_name_severe","issu_name_reaction");
  }

  function autocompleterSelectEventForOnPatientSearch(ui,search_id){
    $('#timeline_list').html('');
    if(ui.item.key[1] == "No results found"){
      return false;
    }else{
      getPatientProfileForUpdate(ui.item.key[2]);
    }
    return false;
  }

  function patientInfoEventBindings(){
  }

});