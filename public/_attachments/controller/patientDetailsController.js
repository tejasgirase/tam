var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

// $.couch.session({
//   success: function(data) {
//     if(data.userCtx.name == null) {
//       //backafter();
//       window.location.href = "index.html";
//     }
//     else {
      // $.couch.urlPrefix = "https://handiffectleserionythent:3b7d6f6094557af528205e8533f5aeaf7015a2e2@nirmalpatel59.cloudant.com";
      // $.couch.db(replicated_db).openDoc("org.couchdb.user:n@n.com", {
      //   success: function(data) {
      //     pd_data = data;
      //   },
      //   error:function(data,error,reason){
      //     console.log(error);
      //     // newAlert("danger",reason);
      //     // $("html, body").animate({scrollTop: 0}, 'slow');
      //     return false;
      //   }
      // });
//     }
//   }
// });

app.controller("patientDetailsController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.sharedBindings();
  tamsaFactories.displayLoggedInUserDetails(pd_data);
  $scope.level = pd_data.level;
  $scope.patient_id = $stateParams.user_id;
  //$scope.$apply();
  $("body").on("click","#my_account_tab_link",function(){
    $state.go("patientlist",{user_id:$stateParams.user_id});
  });

  $("body").on("click","#past_history_tab_link",function(){
    $state.go("medical_history",{user_id:$stateParams.user_id});
  }); 
  
  $("body").on("click","#prepare_referral_link",function(){
    $state.go("patient_referral",{user_id:$stateParams.user_id});
  });

  $("body").on("click", "#clinical_risk_calculator_link", function(){
    $state.go("risk_calculator",{user_id:$stateParams.user_id});
  });

  $("body").on("click", "#appointment_link", function(){
    $state.go("patient_appointments",{user_id:$stateParams.user_id});
  });

  $("body").on("click", "#patinet_billing", function(){
    $state.go("patient_billing",{user_id:$stateParams.user_id});
  });

  $("body").on("click", "#patient_alerts_link", function(){
    $state.go("patient_diagnosis",{user_id:$stateParams.user_id});
  });
  
  $("body").on("click", "#diagnosis", function(){
    $state.go("patient_ecgresults",{user_id:$stateParams.user_id});
  });
  
  $("body").on("click", "#choose_care_plan_link", function(){
    $state.go("patient_choose_careplan",{user_id:$stateParams.user_id});
  });

  $("body").on("click", "#build_cplan_link", function(){
    $state.go("patient_build_careplan",{user_id:$stateParams.user_id});
  });

  $("body").on("click","#start_chart_note_link",function(){
    $state.go("patient_charting_templates",{user_id:$stateParams.user_id,template_state:"generic"});
  });

  $("body").on("click","#choose_charting_template",function(){
    $state.go("patient_charting_templates",{user_id:$stateParams.user_id,template_state:"choose"});
  });
  
  $("#mytabs").on("click","#dicom_link",function(){
    $(this).focusout();
    window.open("/orthanc/app/explorer.html"); 
  });

  $("#upload_files_link").click(function(){
    showUploadFilesModal(userinfo.user_id, userinfo.first_nm+" "+userinfo.last_nm);
  });

  $("body").on("click","#build_charting_template_link",function(){
    $state.go("patient_charting_templates",{user_id:$stateParams.user_id,template_state:"build"});
  });

  $("#mytabs li").mouseenter(function(){
    if($(this).find('ul')){
      $(this).find('ul').stop().slideDown('fast');
    }
  });

  $("#mytabs li").mouseleave(function() {
    if($(this).find('ul')){
      $(this).find('ul').stop().slideUp('fast');  
    }
  });

});

app.controller("patientMedicalHistoryController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null) {
  //       //backafter();
  //       window.location.href = "index.html";
  //     }
  //     else {
        $.couch.db(replicated_db).openDoc("org.couchdb.user:n@n.com", {
          success: function(data) {
            pd_data = data;
            $scope.level = pd_data.level;
            $scope.patient_id = $stateParams.user_id;
            tamsaFactories.pdBack();
            tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activePatientMedicalHistoryTab);
            $scope.$apply();
            function eventBindingsForPatientMedicalHistory(tamsaFactories){
              $("body").on("click","#add_new_procedures",function(){
                addNewProcedures($(this).attr("text"));
              });
              
              $("body").on("click","#add_new_condition",function(){
                addNewCondition($(this).attr("text"));
              });
              
              $("#past_history_new").on("click","#add_new_allergies",function(){
                addNewAllergies($(this).attr("text"));
              });

              $("#past_history_new").on("click",".pdfcontainer",function(){
                viewEnlargeForPdf($(this));
              });
              
              $("#timeline_list").on("click",".imgcontainer",function(){
                imageEnlargeUtility($(this));
              });
              
              $("#past_history_new").on("click","#customize_vital_graphs",function(){
                getCvg();  
              });

              $("#add_padf_modal").on("click","#add_padf",function(){
                addPadf($("#add_padf").attr("operation"));
              });

              $("#add_padf_modal").on("click","#add_new_allergiess",function(){
                addNewAllergiesModel();
              });

              $("#add_padf_modal").on("click","#remove_new_allergiess",function(){
                $(this).parent().remove();
              });

              $("#past_history_new").on("click","#add_fmh",function(){
                saveFamilyMedicalHistory(tamsaFactories);
              });
              
              $("#past_history_new").on("click",".tl-print-record", function(){
                $("#print_patient_details_parent").show();
                var par_id = $(this).attr("parentid");
                $("#print_division").html($("#"+par_id).html());
                $("#print_division").find(".print-close-btn").remove();
                $("#print_division").find(".tbl-border").css("border","1px solid grey");
                $("#print_division").find(".tl-objective-parent").removeClass("tl-objective-parent");
                printNewHtml($("#print_division").find(".modal-content").html());
                $("#print_patient_details_parent").hide();
              });

              $("#past_history_new").on("click",".get-communication-more-details",function(){
                getCommunicationHistoryMoreDetails($(this));
              });

              $("#past_history_new").on("click",".remove-comm-history-more-details",function(){
                removeCommunicationHistoryMoreDetails($(this));
              });

              $("#past_history_new").on("click","#add_fmh_model_id",function(){
                getPastFamilyMedicalHistory("mh_fmh_relation","mh_fmh_field_parent","fmh_relation","fmh_condition","add-family-medication");
              });

              $("#past_history_new").on("click",".tl-print-selected",function(){
                $obj = $(this);
                $.couch.db(db).view("tamsa/getPrintSetting",{
                  success:function(hdata){
                    if(hdata.rows.length > 0) {
                      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
                        success:function(pdata){
                          if(pdata.rows.length > 0) {
                            printTimelineRecords($obj,pdata,hdata);
                          }
                        },
                        error:function(data,error,reason){
                          newAlert("danger",reason);
                          $("html, body").animate({scrollTop: 0}, 'slow');
                          return false;
                        },
                        key:userinfo.user_id,
                        include_docs:true
                      });
                    }else {
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
              });

              //Below element is not present anywhere :: Need to Remove
              $("#past_history_new").on("click",".timeline-charting-template",function(){//check and if not used then remove event for this element
                $.couch.db(db).openDoc($(this).attr("index"), {
                    success: function(data) {
                      $('#saved_charting_template_modal').modal("show");
                      $("#tl_charting_template_name").html(data.template_name);
                      var tl_charting_template_data = "";
                      // tl_charting_template_data += '<div class="timeline-charting-template-display row"><div class="col-lg-3">Chief Complaint</div><div class="col-lg-9">'+data.chief_complaint ? data.chief_complaint : "NA"+'</div></div>';
                      for (var i = 0; i < data.sections.length; i++) {
                        tl_charting_template_data += '<div class="timeline-charting-template-display mrgtop1"><span class="">'+data.sections[i].section_name+'</span><span class="glyphicon glyphicon-minus-sign timeline-charting-template-section-name"></span></div>';

                        tl_charting_template_data += '<table class="table tbl-border"><thead><th>Field Name</th><th>Response</th></thead><tbody>';
                        for(var j = 0; j< data.sections[i].fields.length;j++){
                          if(data.sections[i].fields[j].response_format_pair[0].response == "soapnote") {
                            tl_charting_template_data += '<tr><td colspan="2">';
                          }else{
                            tl_charting_template_data += '<tr><td>'+data.sections[i].fields[j].field_name+'</td><td><table class="table tbl-border">';
                          }
                          
                          for(var k = 0;k< data.sections[i].fields[j].response_format_pair.length;k++){
                            tl_charting_template_data += tlChartingTemplateResponseDisplay(data.sections[i].fields[j].response_format_pair[k]);
                          }
                          if(data.sections[i].fields[j].response_format_pair[0].response == "soapnote") {
                            tl_charting_template_data += '</td>';
                          }else {
                            tl_charting_template_data += '</table></td>';
                          }
                        }
                        tl_charting_template_data += '</tbody></table>';
                      }
                      $("#tl_charting_template_parent").html(tl_charting_template_data);
                      addPatientDetailsWithChartingTemplatePrint();
                    },
                    error: function(status) {
                      console.log(status);
                    }
                });
              });

              $("#past_history_new").on("click",".timeline-charting-template-section-name",function(){
                $(this).parent().next().slideToggle("fast");
                if($(this).hasClass('glyphicon-minus-sign')){
                  $(this).removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
                }else{
                  $(this).removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
                }
              });

              $("#past_history_new").on("click","#summary_tab",function(){
                $.blockUI({
                  message: '<h1>Please Wait........</h1>',
                  css:{
                    color: "#f2bb5c"
                  }
                });
                activatePatientMedicalSummary();
              });

              $("#past_history_new").on("click","#timeline_tab",function(){
                activatePatientMedicalTimeLine();
              });
              $("#past_history_new").on("click","#medication_tab",function(){
                activatePatientMedication();
              });
              $("#past_history_new").on("click","#elabs_tab",function(){
                activatePatientELabs();
              });

              $(window).scroll(function() {
                scrollingUtilities()
              });

              $("#past_history_new").on("click",".seemore",function(){
                getTimelineRecordsSeemore($(this));
              });

              $("#past_history_new").on("click","#seemore_phy",function(){
                getTimelineRecordsSeemorePhy();
              });

              $("#past_history_new").on("click","#seemore_lab",function(){
                getTimelineRecordsSeemoreLab();
              });

              $("#past_history_new").on("click","#seemore_chart",function(){
                getTimelineRecordsSeemoreChart();
              });

              $("#past_history_new").on("click",".filter-toggle",function(){
                getTimeLineRecordsByFilter($(this));
              });

              $("#past_history_new").on("click",".timeline-toggle",function(){
                timelineToggleDisplay($(this));
              });

              $("#past_history_new").on("click","#expand_collapse_toggle",function(){
                expandCollapseToggleTimeline();
              });

              $("#past_history_new").on("click",".timeline-preview-image",function(){

              });

              $("#past_history_new").on("click","#more_labs",function(){
                activateLabsOnMedicalSummary();
              });

              $("#past_history_new").on("click","#mh_vital_signs",function(){
                activateVitalSignsOnMedicalSummary();
              });

              $("#past_history_new").on("click","#more_event",function(){
                activateMoreEventOnMedicalSummary();
              });

              $("#past_history_new").on("click","#com_history",function(){
                activateCommunicationHistoryOnMedicalSummary();
              });

              $("#past_history_new").on("click","#cvg_save",function(){
                saveCvg();
              }); 
              
              $("#past_history_new").on("click","#telemedicine_history",function(){
                activeTelemedicineHistory();
              });

              $("#past_history_new").on("click","#Patient_notes_tab",function(){
                getPatientNotes();
              });

              $("#past_history_new").on("click","#Patient_immunization",function(){
                activatePatientImmunizations();
              });

              $("#past_history_new").on("click",".add-family-medication",function(){
                addNewFamilyMedication();
              });

              $("#past_history_new").on("click",".remove-family-medication",function(){
                $(this).parent().parent().remove(); 
              });

              $("#add_fmh_modal").on("hide.bs.modal", function(){
                $(".delete_rel_cond").remove();
              });
            }

            function activatePatientImmunizations(){
              // $(".menu_items").removeClass("active");
              // $("#immunization_link").parent().addClass('active');
              $("#Patient_immunization").parent().find("div").removeClass("CategTextActive");
              $("#Patient_immunization").addClass("CategTextActive");
              $(".mh-summary-info").hide();
              $("#chart-section8").show();
              getPatientImmunizations();
              eventBindingsForPatientImmunizations();
            }

            function activePatientMedicalHistoryTab(){
              $(".tab-pane").removeClass("active");
              $('#past_history_new').addClass('active');
              $(".menu_items").removeClass("active");
              $("#past_history_tab_link").parent().addClass('active');
              $(".demo").mCustomScrollbar({
                theme:"minimal"
              });
              checkedEprecribedSetting();
              activatePatientMedicalSummary();
              $.unblockUI();
              eventBindingsForPatientMedicalHistory(tamsaFactories);
              eventBindingsForPatientELabs();
              eventBindingsForMedications();
              saveAuditRecord("Medical History","Access","Successfully accessed.");
              if($stateParams.tab_id == "medication"){
                activatePatientMedication();
              }
              if($stateParams.tab_id != null && $stateParams.tab_id != "medication" ){
                if ($stateParams.tab_id == "imaging order") activatePatientELabs("ImagingOrder");
                else if ($stateParams.tab_id == "elab order") activatePatientELabs("LabOrder");
                else if($stateParams.tab_id == "other") activateOtherVideosDoc($("#other_doc_link"));
                else if($stateParams.tab_id == "eLabResults" || $stateParams.tab_id == "eImagingResults") labResultLink($stateParams.attachment_id)
                else activatePatientELabs();
              }
            }
            function checkedEprecribedSetting(){
              $.couch.db(db).view("tamsa/getEprescribe", {
                success: function(data) {
                  if(data.rows.length > 0) {
                    if(data.rows[0].value.push_medications || data.rows[0].value.send_an_rx_directly || data.rows[0].value.update_existing_medications) {
                      $scope.medication_show = true;
                    }else {
                      $scope.medication_show = false;
                    }
                  }else{
                    $scope.medication_show = true;
                  }
                  $scope.$apply();
                },
                error: function(data, error, reason) {
                  newAlert('danger', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                },
                key: pd_data._id
              });
            }
            function eventBindingsForPatientImmunizations(){
              $("#past_history_new").on("click","#add_new_immunization_record",function(){
                openAddNewImmunizationRecord($(this));
              });
              
              $("#past_history_new").on("click","#back_to_immunization_records",function(){
                backToImmunizationRecords();
              });

              $("#past_history_new").on("click","#save_patient_immunization",function(){
                saveRequestForPatientImmunizationRecord();
              });

              $("#past_history_new").on("click",".delete_immunization_record",function(){
                confirmDeleteImmunizationRecords($(this).closest("tr"));
              });

              $("#past_history_new").on("click","#yes_delete_immunization_confirm",function(){
                deleteImmunizationRecord($("#yes_delete_immunization_confirm").data("objEle"));
              });

              $("#past_history_new").on("click","#no_delete_immunization_confirm",function(){
                $("#confirm_delete_immunization_record").modal("hide");
              });

              $("#past_history_new").on("click",".edit_immunization_record",function(){
                openAddNewImmunizationRecord($(this));
              });

              $("#past_history_new").on("click","#immunization_history_record",function(){
                toggleImmunizationHistoryRecordSource();
              });

              $("#past_history_new").on("keypress","#immunization_lot_no",function(){
                // getInventoryDetailsFromLotNo();
                autoCompleterForLot("immunization_lot_no",getLotDetailsManufacture,pd_data.dhp_code)
              });

              $("#past_history_new").on("change","#patient_immunization_name",function(){
                getVaccineNames();
              });
            }

            function openAddNewImmunizationRecord($obj){
              $("#add_new_immunization_parent").show();
              $("#immunization_records").hide();
              if($obj.data("action") == "Add") {
                clearAddPatientImmunizationRecordForm();
                $("#patient_immunization_name option, #immunization_vaccine_name option, #immunization_dose option").remove();
                $("#patient_immunization_name").append('<option value="">Select Vaccination</option>');
                $("#immunization_vaccine_name").append('<option value="">Select Vaccine Name</option>');
                $("#immunization_dose").append('<option value="">Select Dose</option>');
                $("#save_patient_immunization").data("action", "Add");
              }
              if($("#add_new_immunization_record").data("index")) {
                $("#save_patient_immunization").data("index",$("#add_new_immunization_record").data("index"));
                $("#save_patient_immunization").data("rev",$("#add_new_immunization_record").data("rev"));
              }
              $.couch.db(db).openDoc("vaccination_default_rules",{
                success:function(data){
                  for(var i=0;i<data.vaccination_details.length;i++){
                    $("#patient_immunization_name").append('<option>'+data.vaccination_details[i].vaccination_name+'</option>');
                  }
                  $.couch.db(replicated_db).view("tamsa/getDoctorsList",{
                    success:function(data){
                      for(var i=0;i<data.rows.length;i++) {
                        $("#immunization_injected_by").append("<option value='"+data.rows[i].value+"'>"+data.rows[i].key[1]+"</option>");
                      }
                      if($obj.data("action") == "Edit") {
                        var $objEle = $obj.closest("tr");
                        $("#save_patient_immunization").data("action", "Edit");
                        $("#save_patient_immunization").data("edit_name",$objEle.find(".immunization-name").text());
                        $("#save_patient_immunization").data("edit_dose",$objEle.find(".immunization-dose").text());
                        $.couch.db(db).openDoc($("#add_new_immunization_record").data("index"), {
                          success:function(data) {
                            var immunization_info = data.immunization_info;
                            var tempdata = immunization_info.filter(function (entry) {
                              return (
                                      entry.immunization_name ==  $objEle.find(".immunization-name").text() &&
                                      entry.dose == $objEle.find(".immunization-dose").text()
                                     )
                              });
                            if(tempdata.length > 0)  {
                              $("#patient_immunization_name").val(tempdata[0].immunization_name.trim());
                              if(tempdata[0].vaccine_name) {
                                getVaccineNames(tempdata[0].vaccine_name,tempdata[0].dose);
                              }else {
                                getVaccineNames("",tempdata[0].dose);
                              }
                              $("#immunization_history_record").prop("checked",tempdata[0].history_records);
                              $("#immunization_injected_on").val(tempdata[0].date);
                              $("#immunization_injected_by").val(tempdata[0].injected_by);
                              $("#immunization_notes").val(tempdata[0].notes);
                              $("#immunization_dose_unit").val(tempdata[0].dose_unit);
                              $("#immunization_body_site").val(tempdata[0].body_site);
                              $("#immunization_manufacturer").val(tempdata[0].manufacturer);
                              $("#immunization_lot_no").val(tempdata[0].lot_no);
                              $("#immunization_route").val(tempdata[0].route)
                              $("#save_patient_immunization").data("index",data._id);
                              $("#save_patient_immunization").data("rev",data._rev);
                              if(tempdata[0].history_records == true) $("#immunization_history_record_source").val(tempdata[0].history_records_source).show()
                              else $("#immunization_history_record_source").val("").hide()
                            }
                          },
                          error:function(data,error,reason) {
                            newAlert('error', reason);
                            $('html, body').animate({scrollTop: 0}, 'slow');
                          }
                        });
                      }
                    },
                    error:function(data,error,reason){
                      newAlert('danger',reason);
                      $('html, body').animate({scrollTop: 0}, 'slow');
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

            function backToImmunizationRecords(){
              $("#add_new_immunization_parent").hide();
              $("#immunization_records").show();
            }

            function saveRequestForPatientImmunizationRecord(){
              if(validatePatientImmunizationRecord()) {
                if($("#save_patient_immunization").data("action") == "Add") {
                  $.couch.db(db).view("tamsa/getPatientImmunizations", {
                    success:function(data) {
                      if(data.rows.length > 0) {
                        newAlert("danger","Vaccine Details for given is already exist in records.")
                        $("html, body").animate({scrollTop: 0}, 'slow');
                        return false; 
                      }else {
                        savePatientImmunizationRecord();
                      }
                    },
                    error:function(data,error,reason){
                      newAlert("danger",reason);
                      $("html, body").animate({scrollTop: 0}, 'slow');
                      return false;
                    },
                    key:[userinfo.user_id, $("#patient_immunization_name").val(), $("#immunization_dose").val()],
                    include_docs:true
                  });
                }else {
                  savePatientImmunizationRecord();                  
                }
              }
            }

            function savePatientImmunizationRecord() {
              var new_immunization_data = {
                immunization_name:      $("#patient_immunization_name").val(),
                vaccine_name:           ($("#immunization_vaccine_name").val() ? $("#immunization_vaccine_name").val() : ""),
                dose:                   $("#immunization_dose").val(),
                dose_name:              $("#immunization_dose").find("option:selected").text(),
                status:                 "Taken",
                date:                   $("#immunization_injected_on").val(),
                injected_by:            $("#immunization_injected_by").val(),
                injected_name:          $("#immunization_injected_by").find("option:selected").text(),
                lot_no:                 $("#immunization_lot_no").val(),
                manufacturer:           $("#immunization_manufacturer").val(),
                body_site:              $("#immunization_body_site").val(),
                route:                  $("#immunization_route").val(),
                dose_unit:              $("#immunization_dose_unit").val(),
                notes:                  $("#immunization_notes").val(),
                history_records:        $("#immunization_history_record").prop("checked"),
                history_records_source: $("#immunization_history_record_source").val(),
                doctor_id:              pd_data._id,
                doctor_name:            pd_data.first_name+ "" + pd_data.last_name,
                dhp_code:               pd_data.dhp_code
              };

              if($("#save_patient_immunization").data("action") == "Add") {
                if($("#save_patient_immunization").data("immunizataion_data")) {
                  var save_immunization_data = $("#save_patient_immunization").data("immunizataion_data");
                  save_immunization_data.immunization_info.push(new_immunization_data);
                }else {
                  var save_immunization_data = {
                    doctype:           "patient_immunization_details",
                    insert_ts:         new Date(),
                    user_id:           userinfo.user_id,
                    user_email:        userinfo.user_email,
                    immunization_info: [new_immunization_data]
                  };
                }
                saveCallbackForPatientImmunization(save_immunization_data);
              }else if($("#save_patient_immunization").data("action") == "Edit") {
                if($("#save_patient_immunization").data("immunizataion_data")) {
                  var save_immunization_data = $("#save_patient_immunization").data("immunizataion_data");
                  if(new_immunization_data.immunization_name == $("#save_patient_immunization").data("edit_name") && 
                    new_immunization_data.dose == $("#save_patient_immunization").data("edit_dose")) {
                    for(var i=0; i<save_immunization_data.immunization_info.length; i++) {
                      if(save_immunization_data.immunization_info[i].immunization_name == $("#save_patient_immunization").data("edit_name") && save_immunization_data.immunization_info[i].dose == $("#save_patient_immunization").data("edit_dose")) {
                        save_immunization_data.immunization_info[i] = new_immunization_data;
                      }
                    }
                    saveCallbackForPatientImmunization(save_immunization_data);
                  }else {
                    var tflag=false;
                    for(var i=0; i<save_immunization_data.immunization_info.length; i++) {
                      if(new_immunization_data.immunization_name == save_immunization_data.immunization_info[i].immunization_name
                         && new_immunization_data.dose == save_immunization_data.immunization_info[i].dose
                        ) {
                        tflag = true;
                        break;
                      }
                    }
                    if(tflag) {
                      newAlert("danger","Vaccination details are already exists.");
                      return false;
                    }else {
                      for(var i=0; i<save_immunization_data.immunization_info.length; i++) {
                        if(save_immunization_data.immunization_info[i].immunization_name == $("#save_patient_immunization").data("edit_name") && save_immunization_data.immunization_info[i].dose == $("#save_patient_immunization").data("edit_dose")) {
                          save_immunization_data.immunization_info[i] = new_immunization_data;
                        }
                      }
                      saveCallbackForPatientImmunization(save_immunization_data);
                    }
                  }
                }
              }
            }

            function saveCallbackForPatientImmunization(save_immunization_data) {
              if($("#save_patient_immunization").data("index")){
                save_immunization_data._id  = $("#save_patient_immunization").data("index");
                save_immunization_data._rev = $("#save_patient_immunization").data("rev");
              }
              $.couch.db(db).saveDoc(save_immunization_data,{
                success:function(data){
                  newAlert('success',"Record Successfully saved.");
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  getPatientImmunizations();
                  $("#back_to_immunization_records").trigger("click");
                },
                error:function(data,error,reason){
                  newAlert('danger',reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  return false;
                }
              });
            }

            function getPatientImmunizations(){
              $.couch.db(db).view("tamsa/getPatientImmunizations",{
                success:function(data){
                  if(data.rows.length > 0){
                    $("#add_new_immunization_record").data("index", data.rows[0].doc._id);
                    $("#add_new_immunization_record").data("rev", data.rows[0].doc._rev);
                    $("#save_patient_immunization").data("immunizataion_data",data.rows[0].doc);
                    $scope.immunizataion_data = data.rows[0].doc.immunization_info;
                    $scope.immunizataion_data_len = true;
                    $scope.immunizataion_nodata = false;
                  }else{
                    $("#save_patient_immunization").data("immunizataion_data","");
                    $scope.immunizataion_data_len = false;
                    $scope.immunizataion_nodata = true;
                  }
                  $scope.$apply();
                },
                error:function(data,error,reason){
                  newAlert('danger',reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  return false;
                },
                startkey:[userinfo.user_id],
                endkey:[userinfo.user_id, {}, {}],
                include_docs:true
              });
            }

            function autoCompleterForLot(search_id,selectEvent,dhpcode){
              $("#"+search_id).autocomplete({
                search: function(event, ui) { 
                   $("#"+search_id).addClass('myloader');
                },
                source: function( request, response ) {
                  var view = "";
                  var keyval = "";
                    view = "tamsa/getInventoryDetailsFromLotNo";
                    keyval  = dhpcode;
                  $.couch.db(db).view(view, {
                    success: function(data) {
                      response(data.rows);
                      $("#"+search_id).removeClass('myloader');
                    },
                    error: function(status) {
                      console.log(status);
                    },
                    startkey: [keyval,$("#"+search_id).val().trim()],
                    endkey: [keyval,$("#"+search_id).val().trim()+"\u9999"],
                    reduce:true,
                    group:true
                  });
                },
                focus: function(event, ui) {
                  $("#"+search_id).val(ui.item.key[1]);
                  return false;
                },
                minLength: 1,
                select: function( event, ui ) {
                  selectEvent(ui.item.key[2],"immunization_manufacturer");
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
                  //$("#"+search_id).removeClass('myloader');
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
                    .append("<a>" +  + "</a>")
                    .appendTo(ul);
                }else{
                  getLotDetailsManufacture(item.key[2],"manufacture_"+item.key[2]);
                    return $("<li></li>")
                      .data("item.autocomplete", item)
                      .append("<a><span class='pull-right' id='manufacture_"+item.key[2]+"'></span>"+item.key[1]+"</a>")
                      .appendTo(ul);
                }
              };
            }

            function getLotDetailsManufacture(id,search_id){
              $.couch.db(db).openDoc(id,{
                success:function(data){
                  $('#'+search_id).html(data.manufacturer_name);
                  $('#'+search_id).val(data.manufacturer_name);
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $('body,html').animate({scrollTop: 0}, 'slow');
                  return false;
                }
              });
            }

            function confirmDeleteImmunizationRecords($obj) {
              createModal("confirm_delete_immunization_record");
              $("#yes_delete_immunization_confirm").data("objEle",$obj);
            }

            function deleteImmunizationRecord($ele){
              $.couch.db(db).openDoc($("#add_new_immunization_record").data("index"), {
                success:function(data) {
                  var immunization_data  = data.immunization_info;
                  var remove_data = {
                    immunization_name: $ele.find(".immunization-name").text(),
                    dose:              $ele.find(".immunization-dose").text(),
                    status:            $ele.find(".immunization-status").text(),
                    date:              $ele.find(".immunization-date").text()
                  }
                  var tempdata = immunization_data.filter(function (entry) {
                    return !(
                            entry.immunization_name == remove_data.immunization_name &&
                            entry.dose == remove_data.dose &&
                            entry.status == remove_data.status &&
                            entry.date == remove_data.date
                            )
                    });
                  data.immunization_info = tempdata;
                  $.couch.db(db).saveDoc(data, {
                    success:function(data) {
                      newAlert('success', 'Record Successfully Removed.');
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      $("#confirm_delete_immunization_record").modal("hide");
                      getPatientImmunizations();
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

            function toggleImmunizationHistoryRecordSource(){
              if($("#immunization_history_record").prop("checked")) $("#immunization_history_record_source").show()
              else $("#immunization_history_record_source").hide()
            }

            function clearAddPatientImmunizationRecordForm(){
              $("#patient_immunization_name").val("");
              $("#immunization_vaccine_name").val("");
              $("#immunization_dose").val("");
              $("#immunization_body_site").val("");
              $("#immunization_route").val("");
              $("#immunization_history_record").prop("checked",false);
              $("#immunization_history_record_source").hide();
              $("#immunization_injected_on").val("");
              $("#immunization_injected_by").val("");
              $("#immunization_manufacturer").val("");
              $("#immunization_lot_no").val("");
              $("#immunization_dose_unit").val("");
              $("#immunization_notes").val("");
              $("#save_patient_immunization").data("index","");
              $("#save_patient_immunization").data("rev","");
            }

            function getInventoryDetailsFromLotNo(){
              $.couch.db(db).view("tamsa/getInventoryDetailsFromLotNo",{
                success:function(data){
                  if(data.rows.length>0){
                    $("#immunization_manufacturer").val(data.rows[0].doc.manufacturer_name);
                  }else{
                    $("#immunization_manufacturer").val("");
                  }
                },
                error:function(data,error,reason){
                  newAlert('error', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  return false;
                },
                key:[pd_data.dhp_code,$("#immunization_lot_no").val().trim()],
                include_docs:true
              });
            }
            /*
            input:  Vaccination name form select box
            output: Vaccine name and Dose 
            */
            function getVaccineNames(selected_vaccine,selected_dose){
              console.log(selected_vaccine);
              var patient_immunization_name = $("#patient_immunization_name").val();
              $("#immunization_vaccine_name option, #immunization_dose option").remove();
              $("#immunization_vaccine_name").append('<option value="">Select Vaccine Name</option>');
              $("#immunization_dose").append('<option value="">Select Dose</option>');
              var id="vaccination_default_rules";
              $.couch.db(db).openDoc(id, {
                success:function(vaccine_data){
                  for(var i=0;i<vaccine_data.vaccination_details.length;i++){
                    if(patient_immunization_name == vaccine_data.vaccination_details[i].vaccination_name){
                      if(vaccine_data.vaccination_details[i].vaccine_names.length > 0) {
                        for(var j=0;j<vaccine_data.vaccination_details[i].vaccine_names.length;j++){
                          $("#immunization_vaccine_name").append('<option>'+vaccine_data.vaccination_details[i].vaccine_names[j]+'</option>');
                        }
                      }else {
                        $("#immunization_vaccine_name").html('<option value="">No Vaccine available</option>');
                      }
                    }
                  }
                  // $.each(vaccine_data['vaccination_details'],function(key ,val){
                  //   if(patient_immunization_name == val.vaccination_name ){
                  //     if(val.vaccine_names.length > 0) {
                  //       $.each(val.vaccine_names,function(key, val){
                  //         $("#immunization_vaccine_name").append('<option>'+val+'</option>');
                  //       });
                  //     }else {
                  //       $("#immunization_vaccine_name").html('<option value="">No Vaccine available</option>');
                  //     }
                  //   }
                  // });
                  $("#immunization_vaccine_name").val((selected_vaccine) ? selected_vaccine : "");
                  $.couch.db(db).view("tamsa/getImmunizationDetails",{
                    success:function(data){
                      if(data.rows.length > 0){
                        for(var i=0; i<data.rows[0].doc.custom_dose.length;i++){
                          $("#immunization_dose").append('<option value="'+data.rows[0].doc.custom_dose[i].dose_no+'">'+data.rows[0].doc.custom_dose[i].dose_name+'</option>');
                        } 
                      }else{
                        $.each(vaccine_data['vaccination_details'],function(key ,val){
                          if(patient_immunization_name == val.vaccination_name ){
                            $.each(val.default_dose,function(key, val){
                              $("#immunization_dose").append('<option>'+val.dose_name+'</option>');
                            });
                          }
                        });
                      }
                      $("#immunization_dose").val((selected_dose) ? selected_dose : "");
                    },
                    error:function(data,error,reason){
                      newAlert("danger",reason);
                      $("html, body").animate({scrollTop: 0}, 'slow');
                      return false;
                    },
                    key:[pd_data.dhp_code,patient_immunization_name],
                    include_docs:true
                  });
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
  //     }
  //   }
  // });
});

// app.controller("patientReferralController",function($scope,$state,$stateParams,tamsaFactories){
//   tamsaFactories.pdBack();
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientReferralTab);
// });

// app.controller("riskCalculatorController",function($scope,$state,$stateParams,tamsaFactories){
//   tamsaFactories.pdBack();
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activateRiskCalculator);
// });

app.controller("patientBillingController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  if($stateParams.index){
    activateBillViewFromDashboard($stateParams.user_id,$stateParams.index);
  }else{
    tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientBilling);
  }
});

app.controller("patientDiagnosisController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientDiagnosis);
});

app.controller("patientECGResultsController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientECGResults);
});

// app.controller("patientThresholdsController",function($scope,$state,$stateParams,tamsaFactories){
//   tamsaFactories.pdBack();
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientThreshold);
// });

// app.controller("patientGenericThresholdsController",function($scope,$state,$stateParams,tamsaFactories){
//   tamsaFactories.pdBack();
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientGenericThreshold);
// });

app.controller("patientCarePlanSummaryController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientCarePlanSummary);
});

app.controller("patientChooseCarePlanController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChooseCarePlans);
  $("#choose_care_plan_list").on("click", "#copy_care_plan", function(){
    $state.go("patient_build_careplan",{user_id:$stateParams.user_id, template_id: $("#save_patient_care_plan").attr("template_doc_id")});
  });
});

app.controller("patientBuildCarePlanController",function($scope,$state,$stateParams,tamsaFactories){
  if($stateParams.template_id) tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientEditCarePlan) 
  else tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientBuildCarePlan)

  function activatePatientEditCarePlan(){
    $(".menu_items").removeClass("active");
    $("#careplan_link").addClass("active");
    $("#build_cplan_link").parent().parent().find("li").removeClass("active");
    $("#build_cplan_link").addClass("active");
    eventBindingsForBuildCarePlan();
    editCarePlan($stateParams.template_id, "copy");
  }
});

function activatePatientELabs(type){
    $(".tab-pane").removeClass("active");
    $(".menu_items").removeClass("active");
    $("#past_history_tab_link").parent().addClass('active');
    $(".main-menu-hide").hide();
    $("#elabs_tab").parent().find("div").removeClass("ChoiceTextActive");
    $("#elabs_tab").addClass('ChoiceTextActive');
    $("#currentElabs").show();
    // $("#electronic_lab_ordering_link").parent().addClass('active');
    // if ($stateParams.tab_id == "imaging order") activateELabOrdering("ImagingOrder");
    // else if ($stateParams.tab_id == "elab order") activateELabOrdering();
    // else if($stateParams.tab_id == "other") activateOtherVideosDoc($("#other_doc_link"));
    // else if($stateParams.tab_id == "eLabResults" || $stateParams.tab_id == "eImagingResults") labResultLink($stateParams.attachment_id)
    //else 
    activateELabOrdering(type);  
}
 
function activateChartingTemplatesSummary(){
    $(".tab-pane").removeClass("active");
    $("#choose_charting_template_list").addClass("active");
    $("#choose_charting_template").parent().parent().find("li").removeClass("active");
    $("#choose_charting_template").parent().addClass("active");
    $("#ctemplate_summary_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#ctemplate_summary_link").addClass("ChoiceTextActive");
    $("#ctemplate_summary_tab").addClass("active");
    generateConsultantListInCharting();
}

function activateBillViewFromDashboard(userid,index){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success: function(data) {
      $.couch.db(db).view("tamsa/testPatientsInfo",{
        success:function(meddata){
          if(data.rows.length == 1){
            userinfo = data.rows[0].doc;
            userinfo_medical = meddata.rows[0].doc;
            getBillList();
            eventBindingsForPatientBilling();
            getInvoiceSummaryView(index);
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
        key:userid,
        include_docs:true
      });
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:userid,
    include_docs:true
  });    
}

function getTelemedicineInqueries() {
  $.couch.db(db).view("tamsa/getTelemedicineInqueries", {
    success: function(data) {
      if(data.rows.length > 0) {
        paginationConfiguration(data,"tele_inquiries_pagination",5,displayPatientTelemedicineInquiries);
      }else {
        $("#telemedicine_table tbody").html('<tr><td colspan="4">No Records are Found.</td></tr>');
      }
    },
    error: function(status) {
      console.log(status);
    },
    key: userinfo.user_id,
    include_docs: true
  });
}

function displayPatientTelemedicineInquiries(start,end,data) {
  var telemedicine_data = [];
  for(var i=start;i<end;i++) {
    var subdate;
    if(data.rows[i].doc.update_ts){
      subdate = data.rows[i].doc.update_ts.substr(0,10);
    }else {
      subdate = data.rows[i].doc.insert_ts.substr(0,10);
    }
    telemedicine_data.push('<tr><td>'+subdate+'</td><td>'+data.rows[i].doc.Health_Category+'</td><td>'+data.rows[i].doc.Health_Issue_Description+'</td><td></td></tr>');
  }
  $("#telemedicine_table tbody").html(telemedicine_data.join(''));
}

function activatePatientMedicalSummary(){
  $(".tab-pane").removeClass("active");
  $("#home").addClass("active");
  $(".main-menu-hide").hide();
  $("#summary_tab").parent().find("div").removeClass('ChoiceTextActive');
  $("#summary_tab").addClass('ChoiceTextActive');
  //$("#timeline_tab").hide();
  getMedicationOnPatientDashboard();
  getPersonalDetailsMedicalHistory();
  activateLabsOnMedicalSummary();
  $.unblockUI();
}

function activatePatientMedicalTimeLine(){
  $(".tab-pane").removeClass("active");
  $(".main-menu-hide").hide();
  $("#profile").addClass("active");
  $("#timeline_tab").parent().find("div").removeClass('ChoiceTextActive');
  $("#timeline_tab").addClass('ChoiceTextActive');
  //$("#timeline_tab").show();
  $('#filters').addClass("active");
  $('.norecord_msg1').html('');
  $('.filter-toggle').each(function(){
    $(this).removeClass("on");
  });
  $('.seeAll').addClass('on');
  $('#seemore').data("skip_value",0);
  getPatientTimeLineRecords();
  saveAuditRecord("Timeline","Access","Successfully accessed.");
}

function addNewAllergies(textval) {
  $(".alert-test").stop().fadeOut(1);
  createModal("add_padf_modal");
  $("#add_padf_modal_title").html("Add "+ textval);
  $("#add_padf").attr("operation", textval);
  $("#add_padf_item_parent").html('<div class="col-sm-12 add-allergies"><div style="float: left"><select id="add_padf_item_allergies" type="text" class="add_padf_item_allergies form-control my-select placeholder-no-fix"></select></div><div style="float: left"><select id="add_padf_item_severity" type="text" class="form-control my-select placeholder-no-fix add_padf_item_severity"></select></div><div style="float: left"><select id="add_padf_item_reaction" type="text" class="form-control my-select placeholder-no-fix add_padf_item_reaction"></select></div><span style="margin-left:4px;margin-top:15px" class="glyphicon glyphicon-plus theme-color" id="add_new_allergiess"></span></div>');
  var allergies_list = [];
  getAllergiesFromDoc("add_padf_item_allergies","add_padf_item_severity","add_padf_item_reaction");
}
 
function getAllergiesFromDoc(aller_name_id,aller_sever_id,aller_reaction_id){
  $.couch.db(db).openDoc("allergies_list", {
    success:function(data){
      if(data){
        var allergies_name = [];
        allergies_name.push('<optgroup label="Food"><option selected="selected">Select Allergies</option>');
        for (var i = 0; i < data.allergies_name[0].Food.length; i++) {
          allergies_name.push('<option>'+data.allergies_name[0].Food[i]+'</option>');
        }
        allergies_name.push('</optgroup><optgroup label="Drug">');
        for (var i = 0; i < data.allergies_name[0].Drug.length; i++) {
          allergies_name.push('<option>'+data.allergies_name[0].Drug[i]+'</option>'); 
        }
        allergies_name.push('</optgroup><optgroup label="Environmental">');
        for (var i = 0; i < data.allergies_name[0].Environmental.length; i++) {
          allergies_name.push('<option>'+data.allergies_name[0].Environmental[i]+'</option>');
        }
        allergies_name.push('</optgroup>');
        var allergies_sever = [];
        allergies_sever.push('<option selected="selected">Select Severe</option>');
        for (var i = 0; i < data.allergies_sever.length; i++) {
          allergies_sever.push('<option>'+data.allergies_sever[i]+'</option>');
        }
        var allergies_reaction = [];
        allergies_reaction.push('<option selected="selected">Select Reaction</option>');
        for (var i = 0; i < data.allergies_reaction.length; i++) {
          allergies_reaction.push('<option>'+data.allergies_reaction[i]+'</option>');
        }
        $("."+aller_name_id+":last").html(allergies_name.join(''));
        $("."+aller_sever_id+":last").html(allergies_sever.join(''));
        $("."+aller_reaction_id+":last").html(allergies_reaction.join(''));
      }
    },
    error:function(data){
      console.log(data);
    }
  });
} 

function addNewAllergiesModel(argument) {
  $(".add-allergies:first").clone().appendTo("#add_padf_item_parent");
  $(".add-allergies:last").append('<span id = "remove_new_allergiess" class="glyphicon glyphicon-minus theme-color" style = "margin-left:19px;margin-top:-14px;float: left;"></span>');
}

function addNewCondition(textval) {
  $(".alert-test").stop().fadeOut(1);
  createModal("add_padf_modal");
  $("#add_padf_modal_title").html("Add "+ textval);
  $("#add_padf").attr("operation", textval);
  var proce = [];
  $.couch.db(db).openDoc("condition_list",{
    success:function(data){
      if(data.conditions.length > 0){
        proce.push('<div class="col-lg-12"><select multiple="multiple" class="form-control multiselect-width" id="add_padf_item"><option>Select Procedure</option>');
        for (var i = 0; i < data.conditions.length; i++) {
          proce.push('<option value="'+data.conditions[i]+'">'+data.conditions[i]+'</option>');
        }
        proce.push('</select><div>');
      }
      $("#add_padf_item_parent").html(proce.join(''));
      $("#add_padf_item").multiselect({
        selectedList:4
      }).multiselectfilter({
      });
      if(userinfo_medical.Condition){
        if(userinfo_medical.Condition.length > 0){
          $("#add_padf_item").val(userinfo_medical.Condition);
          $("#add_padf_item").multiselect("refresh");
        }
      }
    },
    error:function(status){
      console.log(status);
    }
  });
  
  $("#add_padf_item").multiselect({
    selectedList: 4
  }).multiselectfilter({
  });
  if(userinfo_medical.Condition){
    if(userinfo_medical.Condition.length > 0) {
      $("#add_padf_item").val(userinfo_medical.Condition);
      $("#add_padf_item").multiselect("refresh");
    }
  }  
}

function addNewProcedures(textval) {
  $(".alert-test").stop().fadeOut(1);
  createModal("add_padf_modal");
  $("#add_padf_modal_title").html("Add "+ textval);
  $("#add_padf").attr("operation", textval);
  var proce = [];
  $.couch.db(db).openDoc("procedure_list",{
    success:function(data){
      if(data.procedures.length > 0){
        proce.push('<div class="col-lg-12"><select multiple="multiple" class="form-control multiselect-width" id="add_padf_item"><option>Select Procedure</option>');
        for (var i = 0; i < data.procedures.length; i++) {
          proce.push('<option value="'+data.procedures[i]+'">'+data.procedures[i]+'</option>');
        }
        proce.push('</select><div>');
      }
      $("#add_padf_item_parent").html(proce.join(''));
      $("#add_padf_item").multiselect({
        selectedList:4
      }).multiselectfilter({
      });
      if(userinfo_medical.Procedure){
        if(userinfo_medical.Procedure.length > 0){
          $("#add_padf_item").val(userinfo_medical.Procedure);
          $("#add_padf_item").multiselect("refresh");
        }
      }
    },
    error:function(status){
      console.log(status);
    }
  });
}

function saveAllergies() {
  //$("#add_padf").attr("disabled","disabled");
  var bulk_allergies = [];
  var allr2 = [];
  if(validatioOnAllergies()){
    $(".add-allergies").each( function(){
      var allergies_list = '';
      if(userinfo_medical.Allergies){
        if(userinfo_medical.Allergies.String){
        }else if(userinfo_medical.Allergies.length > 0){
          for (var i = 0; i < userinfo_medical.Allergies.length; i++) {
              var element = userinfo_medical.Allergies[i];
              var allergis_arrya = userinfo_medical.Allergies[i].split(",");
              if(allergis_arrya[0] == $(this).find(".add_padf_item_allergies").val()){
                if(allergis_arrya[2] == $(this).find(".add_padf_item_reaction").  val()){
                  
                  var allr = $(this).find(".add_padf_item_allergies").val()+","+$(this).find(".add_padf_item_severity").val()+","+$(this).find(".add_padf_item_reaction").val();
                  userinfo_medical.Allergies[i] = allr;
                  duplicacy = true;
                  break;
                }else{
                  duplicacy = false;
                }
              }else{
                duplicacy = false;
              }
          }
          if(duplicacy){
          }else {
            allr2.push($(this).find(".add_padf_item_allergies").val()+","+$(this).find(".add_padf_item_severity").val()+","+$(this).find(".add_padf_item_reaction").val());
          }
        }
      }
      bulk_allergies.push(allergies_list);
    });
    $.merge(userinfo_medical.Allergies,allr2);
  return userinfo_medical;
  }else{
  return bulk_allergies;  
  }
}  

function addNewFamilyMedication(){
  var familyMedication = [];
  familyMedication.push('<div class="mh_fmh_field_parent row mrgtop1 delete_rel_cond"><div class="col-sm-5 mh_fmh_relation_field"><select class="form-control fmh_relation" id="fmh_relation"><option selected="selected">Select Relation</option><option>Sister</option><option>Brother</option><option>Father</option><option>Mother</option><option>Paternal Grand Father</option><option>Paternal Grand Mother</option><option>Maternal Grand Father</option><option>Maternal Grand Mother</option><option>Uncle</option><option>Aunt</option></select></div><div class="col-sm-5 mh_fmh_condition_field"><select class="form-control fmh_condition" id="fmh_condition"><option selected="selected">Select Condition</option><option>Cancer</option><option>Clotting Disorder</option><option>Diabetes</option><option>Dementia/Alzheimers</option><option>Heart Disease</option><option>Gastro Intestinal Disorders</option><option>High Cholesterol</option><option>Hypertension</option><option>Kidney Disease</option><option>Lung Disease</option><option>Osteoporosis</option><option>Psychological Disorders</option><option>Stroke/Brain attack</option><option>Sudden Death Infant Syndrome (SIDS)</option><option>Unknown Disease</option></select></div><div class="col-sm-2 mh_fmh_add_remove"><span class="theme-color add-family-medication glyphicon glyphicon-plus"></span><span class="theme-color remove-family-medication glyphicon glyphicon-minus"></span></div></div>');
  $("#mh_fmh_relation").append(familyMedication.join(''));
}

function updatedPastFamilyMedicalHistory(){

}

function getPastFamilyMedicalHistory(parent_id,parent_class,relation_id,condition_id,add_new){
  $.couch.db(db).view("tamsa/testFamilyMedicalHistory", {
    success: function(data) {
      if(data.rows.length > 0){
        var mh_family_new = [];
        for (var i = 0; i < data.rows[0].doc.relations.length; i++) {
          // updatedPastFamilyMedicalHistory(data.rows[0].doc.relations);
          $ele = $('#'+parent_id);
            if(i!=0){
              if(parent_id == "soapnote_fmh_parent"){
                $ele.find('.'+add_new).trigger('click');
              }else if(parent_id == "family_medical_history_mets"){
                $ele.find('.'+add_new).trigger('click');
              }else{
                $ele.find('.'+parent_class+':last').find('.'+add_new).trigger('click');
              }  
            } 
            $ele.find('.'+parent_class+':last').find('.'+relation_id).val(data.rows[0].doc.relations[i].relation);
            
            $ele.find('.'+parent_class+':last').find('.'+condition_id).val(data.rows[0].doc.relations[i].condition);
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey : [userinfo.user_id],
    endkey: [userinfo.user_id, {}, {}],
    include_docs:true
  });
}

function activateLabsOnMedicalSummary(){
  // $(".mh-summary-info-links").removeClass("active");
  // $("#more_labs").addClass("active");
  $("#more_labs").parent().find("div").removeClass("CategTextActive");
  $("#more_labs").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section3").show();
  getLabAndDiagnostics();
}

function activateVitalSignsOnMedicalSummary(){
  // $(".mh-summary-info-links").removeClass("active");
  // $("#mh_vital_signs").addClass("active");
  $("#mh_vital_signs").parent().find("div").removeClass("CategTextActive");
  $("#mh_vital_signs").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section1").show();
  getCvg();
}

function activateMoreEventOnMedicalSummary(){
  // $(".mh-summary-info-links").removeClass("active");
  // $("#more_event").addClass("active");
  $("#more_event").parent().find("div").removeClass("CategTextActive");
  $("#more_event").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section4").show();
  getRiskScoreDetails();
}

function getRiskScoreDetails(){
  $.couch.db(db).view("tamsa/getRiskAnalysisScores", {
    success: function(data) {
      var framingham = 0;
      var metabolic  = 0;
      var nutrition  = 0;
      var insert_ts  = 0;

      if(data.rows.length > 0) riskScore(data.rows[0].value)
      else riskScore()
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id,"metabolic",{}],
    endkey: [userinfo.user_id],
    descending:true
  });
  $.couch.db(db).view("tamsa/getRiskAnalysisScores", {
    success: function(data) {
      var framingham = 0;
      var metabolic  = 0;
      var nutrition  = 0;
      var insert_ts  = 0;

      if(data.rows.length > 0) displayCVDScoreOnChart(data.rows[0].value)
      else displayCVDScoreOnChart()
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id,"cvd",{}],
    endkey: [userinfo.user_id],
    descending:true
  });
}

function activateCommunicationHistoryOnMedicalSummary(){
  // $(".mh-summary-info-links").removeClass("active");
  // $("#com_history").addClass("active");
  $("#com_history").parent().find("div").removeClass("CategTextActive");
  $("#com_history").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section5").show();
}

function activeTelemedicineHistory(){
  // $(".mh-summary-info-links").removeClass("active");
  // $("#com_history").addClass("active");
  $("#telemedicine_history").parent().find("div").removeClass("CategTextActive");
  $("#telemedicine_history").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section6").show();
  getTelemedicineInqueries();
}

function getPatientTimeLineRecords(){
  $.couch.db(db).view("tamsa/getTimeLineRecords", {
    success: function(data) {
      if(data.rows.length == 0){
         $("#profile").show();
         $('.norecord_msg1').show();
         $("#timeline_year").html(moment().format("YYYY"));
      }
      if(data.rows.length < 10){
        $('#seemore').hide();
      }else{
        $('#seemore').attr("datalen",data.rows.length);  
      }
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [userinfo.user_id,{},{}],
    endkey: [userinfo.user_id],
    descending : true,
  });
  getTimeLineRecords(0,""); 
}

function getNewCommunicationHistoryDetails(){
    $.couch.db(db).view("tamsa/getPatientCommunicationHistory",{
    success:function(data){
      if(data.rows.length > 0){
        paginationConfiguration(data,"communication_pagination",5,displayCommunicationHistory);
        $("#communication_pagination").show();
      }else{
        var patient_communication_data = [];
        patient_communication_data.push("<tr><td colspan='4'>No Communication History Found.</td></tr>");
        $("#patient_communication_history tbody").html(patient_communication_data.join('')); 
        $("#communication_pagination").hide().html("");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    endkey:       [userinfo.user_id],
    startkey:     [userinfo.user_id,{}],
    descending:   true,
    include_docs: true,
    reduce:       false
  }); 
}

function getPatientNotes(){
  // $(".mh-summary-info").removeClass("active");
  // $("#patient_note").parent().addClass('active');
  $("#Patient_notes_tab").parent().find("div").removeClass("CategTextActive");
  $("#Patient_notes_tab").addClass("CategTextActive");
  $(".mh-summary-info").hide();
  $("#chart-section7").show();
  if(userinfo_medical.Condition.length > 0){
    $("#patient_note_recent_condition").html(userinfo_medical.Condition[userinfo_medical.Condition.length - 1]);    
  }else{
    $("#patient_note_recent_condition").html("NA");    
  }
  $.couch.db(db).view("tamsa/getMostRecentAssessment",{
    success:function(data){
      if(data.rows.length > 0){
        $("#patient_note_recent_diagnosis").html(data.rows[0].value);
      }else{
        $("#patient_note_recent_diagnosis").html($("#patient_note_recent_condition").html());
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey:[userinfo.user_id,{}],
    endkey:[userinfo.user_id],
    descending:true,
    limit:1
  });
  $.couch.db(db).view("tamsa/getPatientRecentMedications",{
    success:function(data){
      if(data.rows.length > 0){
        var output = "";
        for(var i=0;i<data.rows.length;i++){
          if(i != 0) output += ", "
          output += data.rows[i].doc.drug;       
        }
        $("#patient_note_recent_medication").html(output);
      }else{
        $("#patient_note_recent_medication").html("NA");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:[userinfo.user_id],
    include_docs:true
  });
  $.couch.db(db).view("tamsa/mGetPatientNotes", {
    success: function(data) {
      if (data.rows.length > 0) {
        $("#patient_notes_table thead").html('<tr><th>Note</th><th>Date</th></tr>');
        $('#patient_notes_table tbody').html('');
        for (var i = 0; i < data.rows.length; i++) {
          $('#patient_notes_table tbody').append('<tr><td>'+data.rows[i].value.reminder_note+'</td><td>'+data.rows[i].value.insert_ts+'</td></tr>');
        }
      }
      else {
        $("#patient_notes_table thead").html('<tr><th>No Notes Found</th></tr>');
        $('#patient_notes_table tbody').html('');
      }
    },
    error: function(status) {
      consultant_practice_code.log(status);
    },
    key: ['PatientNotes',userinfo.user_id]
  });
}

function addNewFamilyMedicationOnRisk(){
  var rele_cond = [];
    rele_cond.push('<div class="row mets_fmh_risk_score hide_mets_fmh"><div class="col-md-2"><label>Relation</label></div><div class="col-md-3"><select class="form-control mets_fmh_relation"><option>Select</option><option>Sister</option><option>Brother</option><option>Father</option><option>Mother</option><option>Paternal Grand Father</option><option>Paternal Grand Mother</option><option>Maternal Grand Father</option><option>Maternal Grand Mother</option><option>Uncle</option><option>Aunt</option></select></div><div class="col-md-2"><label>Condition</label></div><div class="col-md-3"><select class="form-control mets_fmh_condition"><option>Select</option><option>Cancer</option><option>Clotting Disorder</option><option>Diabetes</option><option>Dementia/Alzheimers</option><option>Heart Disease</option><option>Gastro Intestinal Disorders</option><option>High Cholesterol</option><option>Hypertension</option><option>Kidney Disease</option><option>Lung Disease</option><option>Osteoporosis</option><option>Psychological Disorders</option><option>Stroke/Brain attack</option><option>Sudden Death Infant Syndrome (SIDS)</option><option>Unknown Disease</option></select></div><div class="col-md-1 paddtop1"><label class="label label-warning remove-metabolic-fmh pointer">remove</label></div></div>');
  $("#family_medical_history_mets").append(rele_cond.join(''));
}
function activatePatientMedication(){
  $(".tab-pane").removeClass("active");
  $(".main-menu-hide").hide();
  $("#medication_tab").parent().find("div").removeClass('ChoiceTextActive');
  $("#medication_tab").addClass('ChoiceTextActive');
  $("#currentMedication").show();
  $(".menu_items").removeClass("active");
  $("#past_history_tab_link").parent().addClass('active');
  activateCurrentMedicationTab();
  getMedications();
  saveAuditRecord("Medication","Access","Successfully accessed.");
}

function eventBindingsForMedications(){
  $("#patient_medications").on("click","#pharmacy_save",function(){
    savePharmacy();
  });

  $("body").on("click","#phs_search",function(){
    PhSearch();
  });

  $("body").on("click",".pharmacy_select", function() {
    $("#pharmacy").val($(this).attr("val"));
    $("#pharmacy_search_modal").modal("hide");
  });

  $("#pharmacy_search_modal").on('show.bs.modal', function (e) {
    $("#phs_city").val("");
    getPharmacy();
  });

  $("#past_history_new").on("click",".stop_medication",function(){
    stopMedication($(this));
  });

  $("#past_history_new").on("click",".delete_medication",function(){
    openDeleteMedicationModal($(this));
  });

  $("#past_history_new").on("click","#delete_medication_confirm",function(){
    deleteMedication(); 
  });

  $("#past_history_new").on("click","#add_new_medication",function(){
    openAddNewMedication();
  });

  $("#past_history_new").on("click","#confirm_medication_edit_update",function(){
    savecurrentMedication($(this).data("action"));
  });

  $("#past_history_new").on("click",".back_to_medication_list",function(){
    backToMedicationList();
  });

  $("#past_history_new").on("click",".back_to_add_new_medication_form",function(){
    backToAddNewMedicationForm();
  });

  $("body").on("click","#add_pharmacy_link",function(){
    $("#pharmacy_dhp_code").val(pd_data.dhp_code).attr("readonly","readonly");
    getStates("pharmacy_state");
    openAddPharmacy();
  });

  $("body").on("change","#pharmacy_state",function(){
    getCities($("#pharmacy_state").val(), "pharmacy_city", "select city");
  });

  $("#past_history_new").on("click",".edit_medication", function() {
    openEditMedicationForm($(this).attr("index"),$(this).closest("tr").data("new_patient_medic"));
  });

  $("#past_history_new").on("click",".update_medication",function(){
    openUpdateMedicationModal($(this));
  });

  $("#past_history_new").on("change","#change_medication_label",function(){
    toggleUpdateMedicationFrequency($(this));
  });

  $("#past_history_new").on("click","#medication_update_btn",function(){
    updateMedication($(this));
  });

  $("#past_history_new").on("click","#current_medication_tab",function(){
    activateCurrentMedicationTab();
  });

  $("#past_history_new").on("click","#past_medication_tab",function(){
    activatePastMedicationTab();
  });

  $("#past_history_new").on("click","#uploaded_medication_tab",function(){
    activeUploadedMedicationTab();
  });
}

function activateCurrentMedicationTab(){
  $(".tab-pane").removeClass("active");
  $("#current_medication_tab").parent().find("div").removeClass("CategTextActive");
  $("#current_medication_tab").addClass("CategTextActive");
  $("#current_medication_parent").addClass("active");
  // $("#current_medication_tab").parent().addClass("active");
  // $("#past_medication_tab").parent().removeClass("active");
}

function activatePastMedicationTab(){
  $(".tab-pane").removeClass("active");
  $("#past_medication_parent").addClass("active");
  $("#past_medication_tab").parent().find("div").removeClass("CategTextActive");
  $("#past_medication_tab").addClass("CategTextActive");
}

function activeUploadedMedicationTab() {
  $(".tab-pane").removeClass("active");
  $("#uploaded_medication_parent").addClass("active");
  $("#uploaded_medication_tab").parent().find("div").removeClass("CategTextActive");
  $("#uploaded_medication_tab").addClass("CategTextActive");
  getUploadedMedicationList(userinfo.user_id);
}

function getUploadedMedicationList(user_id) {
  $.couch.db(db).view("tamsa/getUploadedPatientMedication", {
    success:function(data) {
      if(data.rows.length > 0 ) {
        paginationConfiguration(data,"uploaded_medication_pagination",5,displayUploadedMedication);
      }else {
        $("#uploaded_medication_list tbody").html('<tr><td colspan="4">No Records Found.</td></tr>');
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
}

function displayUploadedMedication(start,end,data) {
  var output = [];
  for(var i=start;i<end;i++){
    output.push('<tr>');
      output.push('<td>'+Object.keys(data.rows[i].doc._attachments)[0]+'</td>');
      output.push('<td>'+((data.rows[i].doc.comments && data.rows[i].doc.comments.length > 0) ? data.rows[i].doc.comments[0].comment : "NA")+'</td>');
      output.push('<td>'+moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD hh:mm a")+'</td>');
      output.push('<td><a class="dwnld-hover mrgright1" href="'+'/'+ db+ '/'+data.rows[i].id+'/'+Object.keys(data.rows[i].doc._attachments)[0]+'" target="blank"><span doc_id='+data.rows[i].id+' class="label label-warning">View</span></a><a class="dwnld-hover" href="'+'/'+ db+ '/'+data.rows[i].id+'/'+Object.keys(data.rows[i].doc._attachments)[0]+'" target="blank" download><span doc_id='+data.rows[i].id+' class="label label-warning">Download</span></a></td>');
    output.push('</tr>');
  }
  $("#uploaded_medication_list tbody").html(output.join(''));
}

function activatePatientBilling(){
  $(".menu_items").removeClass("active");
  $(".tab-pane").removeClass("active");
  $("#patinet_billing").addClass('active');
  if($("#create_bill").find("#back_to_bill_summary_list").length > 0){
    $("#back_to_bill_summary_list").attr("id","back_to_billing_list");
  }
  $("#billing_list").addClass("active");
  getBillList();
  eventBindingsForPatientBilling();
}

function eventBindingsForPatientBilling(){
  $("#billing_list").on("click", ".bill_view", function() {
    getBillView($(this).attr("index"));
  });

  $("#billing_list").on("click", ".bill_edit", function() {
    getBillEdit($(this).attr("index"));
  });

  $("#billing_list").on("click","#create_bill_link",function(){
    activateNewBill();
  });

  $("#create_bill").on("click","#back_to_billing_list",function() {
    $(".tab-pane").removeClass("active");
    $("#billing_list").addClass("active");
    $("#add_assessment_billrecords, #add_subjective_billrecords").show();
    $(".cmn-subjective-bill, .billrecord").remove();
    $(".no_records, .no_ass_records").show();
    clearBillForm();
  });
}

function activateNewBill(){
  $(".tab-pane").removeClass("active");
  $("#create_bill_parent").addClass("active");
  checkInvoiceSetting();
  clearBillForm();
}

function eventBindingsForPatientELabs(){
  $("#cancel_lab_imaging_order").on("click","#delete_lab_imaging_order",function(){
    $.couch.db(db).openDoc($(this).attr("index"),{
      success: function(data){
        var cancel_order_doc = data;
        cancel_order_doc.cancelled = "yes";
        $.couch.db(db).saveDoc(cancel_order_doc,{
          success: function(data){
            var cancel_order_cron_doc = cancel_order_doc;
                cancel_order_cron_doc.doctype = 'cronRecords';
                cancel_order_cron_doc.operation_case = '13';
                cancel_order_cron_doc.processed = 'No';
                delete cancel_order_cron_doc._id;
                delete cancel_order_cron_doc._rev;
            $.couch.db(db).saveDoc(cancel_order_cron_doc,{
              success: function(data){
                newAlert('success','Order has been cancelled !!!');
                $('html, body').animate({scrollTop: 0}, 'slow');
                viewLabImagingOrders('');
                $("#cancel_lab_imaging_order").modal('hide');
              },
              error:function(data){
                console.log(data);
              }
            });  
          },
          error: function(data,error,reason){
            console.log(data);
          }
        });
      },
      error: function(data){
        
      }
    });
  });

  $("#lab_result_search").autocomplete({
    search: function(event, ui) { 
       //$('.spinner').show();
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(db).view("tamsa/testLabResults", {
        success: function(data) {
          $("#lab_result_search").removeClass('myloader');
          response(data.rows);
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [userinfo.user_id, $('#labmain_title').text(), request.term],
        endkey: [userinfo.user_id, $('#labmain_title').text(), request.term + "\u9999"],
        limit: 5
      });
    },
    minLength: 3,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      if(ui.item.value == "No results found"){
        $(this).val("").focus();
        $("#all_lab_results_options").val("noselect").trigger("change");
        return false;
      }else{
        $(this).val(ui.item.value);
        openLabReport(ui.item.id);
        return false;
      }
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { value:'No results found',label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.value + "</a>")
      .appendTo(ul);
  };

  $("#lab_results").on("click","#lo_save",function(){
    saveLabOrder("e-order");
  });

  $("#lab_results").on("click","#lo_save_print",function(){
    saveLabOrder("paper");
  });

  $("#lab_results").on("change","#all_lab_results_options",function(){
    openLabReport($("#all_lab_results_options").val());
  });

  $("#lab_results").on("click",".section_row",function(){
    openCategorySection($(this));
  });

  $("#lab_results").on("click",".lab_results_recent",function() {
    recentLabResultSelect($(this));
  });

  $("#lab_results").on("click","#lab_result_image",function(){
    $('#lab_result_modal_image').attr('src', $("#lab_result_image").attr('src'));
    $('#lab_result_image_modal').modal("show");
  });

  $("#lab_results").on("click",".back_lab_category",function(){
    $('#lab_results_inner_category').removeClass('active');
    $('#lab_results_inner').addClass('active');
  });

  $("#lab_results").on("click","#lab_results_inner_link, #lab_results_back_button",function(){
    $(".tab-pane").removeClass("active");
    // $(this).parent().parent().find("li").removeClass("active");
    $("#lab_results_inner_link").parent().find("div").removeClass("CategTextActive");
    // $(this).parent().addClass("active");
    $("#lab_results_inner_link").addClass("CategTextActive");
    $("#lab_results_inner").addClass("active");
  });

  // $("#lab_results").on("click","#other_doc_link",function(){
  //   activateOtherVideosDoc($(this));
  // });
 
  $("#lab_results").on("click","#electronic_lab_ordering_link",function(){
    activateELabOrdering();
  });

  // $("#lab_results").on("click","#electronic_lab_imaging_link",function(){
  //   $(".tab-pane").removeClass("active");
  //   $(this).parent().parent().find("li").removeClass("active");
  //   $(this).parent().addClass("active");
  //   $("#electronic_lab_imaging").addClass("active");
  //   getAllDetailsForImagingsOrdering();
  // });

  $("#lab_results").on("click","#view_orders_link",function(){
    $(".tab-pane").removeClass("active");
    // $(this).parent().parent().find("li").removeClass("active");
    // $(this).parent().addClass("active");
    $(this).parent().find("div").removeClass("CategTextActive");
    $(this).addClass("CategTextActive");
    $("#view_orders_content").addClass("active");
    viewLabImagingOrders('');
  });

  $("#lab_results").on("click",".cancel-order", function(){
    $("#cancel_lab_imaging_order").modal('show');
    $("#delete_lab_imaging_order").attr("index",$(this).attr("index"));
    $("#delete_lab_imaging_order").attr("rev",$(this).attr("rev"));
  });

  $("#lab_results").on("click","#doctor_comment_save",function(){
    labResultComments();
  });

  $("#lo_tests").multiselect({
    header: "Select Test",
    maxWidth : 100,
    position: {
      at: 'center'
    }
  });
}

function activateOtherVideosDoc($obj){
  $(".tab-pane").removeClass("active");
  // $(this).parent().parent().find("li").removeClass("active");
  //$(this).parent().addClass("active");
  $obj.parent().find("div").removeClass("ChoiceTextActive");
  $obj.addClass("ChoiceTextActive");
  $("#other_doc").addClass("active");
  getOtherVideoDocuments();
}

function activateELabOrdering(type){
  $(".tab-pane").removeClass("active");
  //$("#electronic_lab_ordering_link").parent().parent().find("li").removeClass("active");
  //$("#electronic_lab_ordering_link").parent().addClass("active");
  $("#electronic_lab_ordering_link").parent().find("div").removeClass("CategTextActive");
  $("#electronic_lab_ordering_link").addClass("CategTextActive");
  $("#electronic_lab_ordering").addClass("active");
  getAllDetailsForElabsOrdering(type);
}

function getAllDetailsForElabsOrdering(type){
  clearLabOrderForm();
  $("#lo_order_number").val(getPcode(5,"numeric")).attr("readonly",true);
  $("#lo_patient_name").val(userinfo.first_nm + " "+  userinfo.last_nm);
  $("#lo_gender").val(userinfo.gender);
  $("#lo_referred_by").val(pd_data.first_name + " " + pd_data.last_name);
  $("#lo_patient_dhp_id").val(userinfo.patient_dhp_id);
  if(type) $("#lo_type").val(type);
  if(userinfo.age) {
    $("#lo_age").val(userinfo.age);
  }else if(userinfo.date_of_birth) {
    $("#lo_age").val(getAgeFromDOB(userinfo.date_of_birth));
  }else {
    $("#lo_age").val("");
  }
  getAllLabs();
}

function activatePatientDiagnosis(){
  $(".menu_items").removeClass("active");
  $("#diagnosis_link").addClass("active");
  getAlerts();
}

function activatePatientECGResults(){
  $(".menu_items").removeClass("active");
  $("#diagnosis_link").addClass("active");
}

function activatePatientCarePlanSummary(){
  $(".menu_items").removeClass("active");
  $("#careplan_link").addClass("active");
  $("#choose_care_plan_link").parent().parent().find("li").removeClass("active");
  $("#care_plan_summary_id").parent().addClass("active");
  prescribedPatientCarePlanList();
  eventBindingsForPatientCarePlans();
}

function activatePatientChooseCarePlans(){
  $(".menu_items").removeClass("active");
  $("#careplan_link").addClass("active");
  $("#choose_care_plan_link").parent().find("div").removeClass("ChoiceTextActive");
  $("#choose_care_plan_link").addClass("ChoiceTextActive");
  openChooseCarePlans();
  eventBindingsForPatientChooseCarePlans();
  saveAuditRecord("Careplan","Access","Successfully accessed.");
}

function activateViewAllTaskAtCareplanVisualize() {
  $(".visualization-hide").hide();
  $("#visualize_viewall_tab").parent().find("div").removeClass("ChoiceTextActive");
  $("#visualize_viewall_tab").addClass("ChoiceTextActive");
  $("#viewall_task_tab").parent().find("div").removeClass("active");
  $("#viewall_task_tab").addClass("active");
  $("#viewall_task_tab").show();
}

function activateViewCompletedTaskAtCareplanVisualize() {
  $(".visualization-hide").hide();
  $("#visualize_completed_tab").parent().find("div").removeClass("ChoiceTextActive");
  $("#visualize_completed_tab").addClass("ChoiceTextActive");
  $("#completed_task_tab").parent().find("div").removeClass("active");
  $("#completed_task_tab").addClass("active");
  $("#completed_task_tab").show();
}

// function activateViewSkippedTaskAtCareplanVisualize() {
//   $(".visualization-hide").hide();
//   $("#visualize_skipped_tab").parent().parent().find("li").removeClass("active");
//   $("#visualize_skipped_tab").parent().addClass("active");
//   $("#skipped_task_tab").parent().find("div").removeClass("active");
//   $("#skipped_task_tab").addClass("active");
//   $("#skipped_task_tab").show();
// }

function activateViewIncompletedTaskAtCareplanVisualize() {
  $(".visualization-hide").hide();
  $("#visualize_incompleted_tab").parent().find("div").removeClass("ChoiceTextActive");
  $("#visualize_incompleted_tab").addClass("ChoiceTextActive");
  $("#incompleted_task_tab").parent().find("div").removeClass("active");
  $("#incompleted_task_tab").addClass("active");
  $("#incompleted_task_tab").show();
}

function eventBindingsForPatientCarePlans() {
  $("#summary_care_plan_tab").on("click","#visualize_viewall_tab",function(){
    activateViewAllTaskAtCareplanVisualize();
  });

  $("#summary_care_plan_tab").on("click","#visualize_completed_tab",function(){
    activateViewCompletedTaskAtCareplanVisualize();
    //displayCompletedVisualization($("#selected_care_plan_name_visulize").attr("data-sdate"),$("#selected_care_plan_name_visulize").attr("data-edate"));
  });

  // $("#summary_care_plan_tab").on("click","#visualize_skipped_tab",function(){
  //   activateViewSkippedTaskAtCareplanVisualize();
    
  // });

  $("#summary_care_plan_tab").on("click","#visualize_incompleted_tab",function(){
    activateViewIncompletedTaskAtCareplanVisualize();
    $("#selected_care_plan_name_visulize").attr("data-sdate");
    //displayIncompletedVisualization($("#selected_care_plan_name_visulize").attr("data-sdate"),$("#selected_care_plan_name_visulize").attr("data-edate"));
  });
 

  $("#choose_care_plan_list").on("click",".patient-btn-click", function() {
    $(this).toggleClass('update_clicked');
  });

  $("#choose_care_plan_list").on("click",".pd-before-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click",".pd-after-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#summary_care_plan_tab").on("click",".patient_care_plan",function(){
    $("#search_care_plan_tab").hide();
    $("#save_care_plan_tab").hide();
    $("#saved_patient_care_plan_tab").show();
    var current_doc_id = $(this).closest("tr").data("doc_id");  
    var current_rev_id = $(this).closest("tr").data("doc_rev");
    $("#patient_careplan_checkbox").val(current_doc_id);
    $("#patient_careplan_checkbox").attr("rev",current_rev_id);
    editPatientCarePlan(current_doc_id,current_rev_id);
  });

  $(".sidebar-offcanvas").on("click",".summary-visulize",function(){
    var current_doc_id = $(this).attr("doc_id");  
    var current_rev_id = $(this).attr("doc_rev");
    careplanVisulization(current_doc_id,current_rev_id);
  });

  $(".sidebar-offcanvas").on("click",".summary-view",function(){
    $('#summary_care_plan_panel').hide();
    var current_doc_id = $(this).closest("tr").data("doc_id");  
    var current_rev_id = $(this).closest("tr").data("doc_rev");
    editPatientCarePlan(current_doc_id,current_rev_id,"view");
  });

  $(".sidebar-offcanvas").on("click",".summary-update",function(){
    $('#prescribed_patient_care_plans').hide();
    $("#summary_care_plan_panel").hide();
    var current_doc_id = $(this).closest("tr").data("doc_id");  
    var current_rev_id = $(this).closest("tr").data("doc_rev");
    editPatientCarePlan(current_doc_id,current_rev_id);
    //displayCarePlan(current_doc_id);
  });
  $("#summary_care_plan_tab").on("click",".visualization_section",function(){
    getVisualizationGraph($(this));
  });

  $("#summary_care_plan_tab").on("click","#show_graph_all",function(){
    getAllVisualizationGraph($(this));
  });

  $("#summary_care_plan_tab").on("click","#back_to_summary_care_plan_new",function(){
    $('#summary_care_plan_panel').show();
    $("#save_care_plan_tab").hide();
    $("#saved_patient_care_plan_tab").hide();
    $('#search_practise_care_plan').val('');
    $("#search_care_plan_tab").show();
    $('#prescribed_patient_care_plans').show();
    $('#care_plan_update_button_parent').html('');
    $('#careplan_visulization').hide(); 
  });

  $("#summary_care_plan_tab").on("change","#patient_careplan_summary_checkbox",function(){
    var doc_id  = $("#patient_careplan_summary_checkbox").attr("doc_id");
    var doc_rev = $("#patient_careplan_summary_checkbox").attr("doc_rev");
    var active_val = '';
    var d = new Date();
    if($("#patient_careplan_summary_checkbox").is(':checked')){
      active_val = "yes";
    }else{
      active_val = "no";
    }
  $.couch.db(db).openDoc(doc_id,{
    success: function(data){
      data.active = active_val  
      $.couch.db(db).saveDoc(data,{
        success: function(data){
          newAlert('success', 'Your Care plan has been Disabled.');
          $('html, body').animate({scrollTop: 0}, 'slow');
          $("#update_patient_care_plan").attr("doc_rev",data.rev);
        },
        error: function(data,error,reason){
          newAlert('error', reason);
        }
      });
    },
    error: function(data,error,reason){
      newAlert('error', reason);
    }
  });
  });

  $("#summary_care_plan_tab").on("click","#update_patient_care_plan",function(){
    var d = new Date();
    var t_name = $("#selected_patient_care_plan_name").html();
    $.couch.db(db).openDoc($(this).attr("doc_id"), {
      success: function(data) {
        if($('#patient_careplan_checkbox').prop('checked') == true){
         data.active = "yes";   
        }else{
         data.active = "no";    
        }
        data.cp_startdate =   $("#patient_cp_startdate").data('daterangepicker').startDate.format('YYYY-MM-DD');
        data.cp_enddate   =   $("#patient_cp_startdate").data('daterangepicker').endDate.format('YYYY-MM-DD');
        $.couch.db(db).saveDoc(data,{
          success: function(data){
            if($("#update_patient_care_plan").attr("doc_rev")){
              newAlert('success', 'Care Plan updated successfully!');  
              $("#care_plan_summary_id").trigger("click");
            }else{
              newAlert('success', 'Care Plan added successfully!');
            }
            $("#update_patient_care_plan").removeAttr("doc_rev");
            $('html, body').animate({scrollTop: 0}, 'slow');
            prescribedPatientCarePlanList();
            $("#patient_cp_startdate").val("");
            $("#patient_cp_enddate").val("");
            $("#back_to_choose_care_plan").trigger("click");
            $('#patient_care_plans_summary').show();
            $('.nav-tabs li:eq(0)').removeClass('active');
            $('#my_practise_tab').hide();
          },
          error:function(data,error,reason){
            console.log(data);
          }
        });
      },
      error: function(status) {
        console.log(status);
      }
    });
  });

  $("#summary_care_plan_tab").on("click",".patient_care_plan",function(){
    $("#summary_care_plan_panel, #save_care_plan_tab, #thresholds, #thresholds_generic_care").hide();
    $("#saved_patient_care_plan_tab").show();
    var current_doc_id = $(this).closest("tr").data("doc_id");  
    var current_rev_id = $(this).closest("tr").data("doc_rev");
    $("#patient_careplan_checkbox").val(current_doc_id);
    $("#patient_careplan_checkbox").attr("rev",current_rev_id);
    editPatientCarePlan(current_doc_id,current_rev_id);
  });


}

function eventBindingsForPatientChooseCarePlans(){
  $("#choose_care_plan_list").on("click","#thresholds_link",function(){
    $("#save_care_plan_tab, #search_care_plan_tab, #saved_patient_care_plan_tab, #thresholds_generic_care").hide();
    $("#thresholds").show();
    getThresholdAlerts();
  });
  
  $("#choose_care_plan_list").on("click","#thsave",function(){
    saveThresholds();
  });

  $("#choose_care_plan_list").on("click","#thresholds_generic_care_link",function(){
    $("#save_care_plan_tab, #search_care_plan_tab, #saved_patient_care_plan_tab, #thresholds").hide();
    $("#thresholds_generic_care").show();
    getGenericThresholdAlerts();
  });
  
  $("#choose_care_plan_list").on("click","#generic_thsave",function(){
    saveGenericThresholds();
  });

  $("#choose_care_plan_list").on("change",".chk_sms_alert",function(){
    if($(this).prop("checked")) {
      $(this).closest(".careplan-inner-row").find(".sms_alerts_low, .sms_alerts_high").val("").addClass("visible-lg visible-sm visible-xs visible-md").removeClass("hidden-sm hidden-md hidden-lg hidden-xs");
    }else{
      $(this).closest(".careplan-inner-row").find(".sms_alerts_low, .sms_alerts_high").val("").addClass("hidden-sm hidden-md hidden-lg hidden-xs").removeClass("visible-lg visible-sm visible-xs visible-md");
    }
  });
  
  $("#choose_care_plan_list").on("click",".d-before-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click",".d-after-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click",".template-btn-click",function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click","#save_refresh_careplan_summary",function(){
    generateCarePlanSummarySave();
  });

  $("#choose_care_plan_list").on("click","#save_toggle_careplan_summary",function(){
    generateCarePlanSummaryList('save');
  });

  $("#choose_care_plan_list").on("click",".patient-btn-click", function() {
    $(this).toggleClass('update_clicked');
  });

  $("#choose_care_plan_list").on("click",".pd-before-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click",".pd-after-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#choose_care_plan_list").on("click",".patient_care_plan",function(){
    $("#search_care_plan_tab").hide();
    $("#save_care_plan_tab").hide();
    $("#saved_patient_care_plan_tab").show();
    var current_doc_id = $(this).closest("tr").data("doc_id");  
    var current_rev_id = $(this).closest("tr").data("doc_rev");
    $("#patient_careplan_checkbox").val(current_doc_id);
    $("#patient_careplan_checkbox").attr("rev",current_rev_id);
    editPatientCarePlan(current_doc_id,current_rev_id);
  });

  $("#choose_care_plan_list").on("click","#back_to_choose_care_plan_new",function(){
    $("#save_care_plan_tab").hide();
    $("#saved_patient_care_plan_tab").hide();
    $('#search_practise_care_plan').val('');
    $("#search_care_plan_tab").show();
    $('#prescribed_patient_care_plans').show();
    $('#care_plan_update_button_parent').html('');
    $('#careplan_visulization').hide(); 
  });

  $("#choose_care_plan_list").on("change","#patient_careplan_checkbox",function(){
    $("#disable_patient_careplan_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("#yes_patient_care_plan_checkbox").attr("index",$(this).val());
    $("#yes_patient_care_plan_checkbox").attr("rev",$(this).attr("rev"));
    $('#cp_start_end_date').html('<span style="float:left;">Start Date : '+$('#patient_cp_startdate').data("daterangepicker").startDate.format('YYYY-MM-DD')+'</span><span style="float:right;">End Date : '+$('#patient_cp_startdate').data("daterangepicker").endDate.format('YYYY-MM-DD')+'</span>');
  });

  $("#choose_care_plan_list").on("click","#yes_patient_care_plan_checkbox",function(){
    activePatientcarePlan();
  });

  $("#choose_care_plan_list").on("click","#no_patient_care_plan_checkbox",function(){
    $("#patient_careplan_checkbox").attr('checked', !($("#patient_careplan_checkbox").is(':checked')));
  });
  
  $("#choose_care_plan_list").on("click","#my_practise_link",function(){
    activateMyPracticeCareplan();
  });

  $("#choose_care_plan_list").on("click","#careplan_community_link",function(){
    activateCommunityCareplan();
  });

  $("#choose_care_plan_list").on("click",".care_plan_results",function() {
    displayCarePlan($(this).attr("doc_id"));
  });

  $("#choose_care_plan_list").on("click","#save_patient_care_plan",function(){
    createSaveRequestForPatientCarePlan($(this));
  });

  $("#choose_care_plan_list").on("click","#back_to_choose_care_plan",function(){
    $("#saved_patient_care_plan_tab, #save_care_plan_tab, #thresholds, #thresholds_generic_care").hide();
    $('#search_practise_care_plan').val('');
    $("#search_care_plan_tab").show();
    $('#prescribed_patient_care_plans').show();
    $('#care_plan_update_button_parent').html('');
    $('#careplan_visulization').hide(); 
  });

  $("#search_practise_care_plan").autocomplete({
    search: function(event, ui) { 
       //$('.spinner').show();
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(db).view("tamsa/getCarePlans", {
        success: function(data) {
          $("#search_practise_care_plan").removeClass('myloader');
          response(data.rows);
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [pd_data._id,request.term],
        endkey: [pd_data._id,request.term + "\u9999",{}],
        limit: 5
      });
    },
    minLength: 1,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      $('#care_plan_frequency_table').show();
      displayCarePlan(ui.item.id);
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { value:{template_name: 'No results found'},label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.value.template_name + "</a>")
      .appendTo(ul);
  };

  $("#search_community_care_plan").autocomplete({
    search: function(event, ui) { 
       //$('.spinner').show();
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(db).view("tamsa/getCommunityCarePlans", {
        success: function(data) {
          $("#search_community_care_plan").removeClass('myloader');
          response(data.rows);
        },
        error: function(status) {
            console.log(status);
        },
        startkey: request.term,
        endkey: request.term + "\u9999",
        limit: 5
      });
    },
    minLength: 1,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      displayCarePlan(ui.item.id);
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { value:{template_name: 'No results found'},label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    },
    open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.value.template_name + "</a>")
      .appendTo(ul);
  };

  $("#search_patient_care_plan").autocomplete({
    search: function(event, ui) { 
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(db).view("tamsa/getPatientCarePlan", {
        success: function(data) {
          $("#search_patient_care_plan").removeClass('myloader');
          response(data.rows);
        },
        error: function(status) {
            console.log(status);
        },
        startkey: [userinfo.user_id,request.term],
        endkey:   [userinfo.user_id,request.term + "\u9999"],
        limit: 5
      });
    },
    minLength: 1,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      $( ".patient_care_plan[doc_id='"+ui.item.id+"']" ).click();
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { value:{template_name: 'No results found'},label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    },
    open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.value.templatename + "</a>")
      .appendTo(ul);
  };
}

function activatePatientBuildCarePlan(){
  activateNewExistingCarePlan();
  $(".menu_items").removeClass("active");
  $("#careplan_link").addClass("active");
  $("#build_cplan_link").parent().parent().find("li").removeClass("active");
  $("#build_cplan_link").parent().addClass("active");
  eventBindingsForBuildCarePlan();
  saveAuditRecord("Careplan","Access","Successfully accessed.");
}

function activateNewExistingCarePlan(){
  $(".tab-pane").removeClass("active");
  $("#cplan_list").addClass("active");
}

function activateCreateNewCareplanDetails($obj){
  $obj.parent().parent().find("li").removeClass("active");
  $obj.parent().addClass("active");
  $("#create_new_careplan_sections_parent").removeClass("active");
  $("#create_new_careplan_parent").addClass("active");
  $("#save_cplan_template").parent().hide();
}

function activateNewCareplanSectionDetails($obj){
  if($("#care_plan_section_name").val()){ 
    $obj.parent().parent().find("li").removeClass("active");
    $obj.parent().addClass("active");
    $("#create_new_careplan_parent").removeClass("active");
    $("#create_new_careplan_sections_parent").addClass("active");
    $("#care_plan_field_table").find("input, select").removeAttr("disabled");
    $("#care_plan_field_table").find(".delete-careplan-section, .add-more-careplan-section-fields").show();
    $("#save_cplan_template").parent().hide();
    generateCarePlanSection($("#care_plan_section_name").val(),$obj);
  }else{
    newAlert("danger","No Section has been included. Please include at least one section.");
    $("html, body").animate({scrollTop: 0}, 'slow');
    return false;
  }
}

function activateConfirmCareplanSectionDetails($obj){
  if($("#care_plan_section_name").val()){
    $obj.parent().parent().find("li").removeClass("active");
    $obj.parent().addClass("active");
    $("#create_new_careplan_parent").removeClass("active");
    $("#create_new_careplan_sections_parent").addClass("active");
    $("#care_plan_field_table").find("input, select").attr("disabled","disabled");
    $("#care_plan_field_table").find(".delete-careplan-section, .add-more-careplan-section-fields").hide();
    $("#save_cplan_template").parent().show();
  }else{
    newAlert("danger","No Section has been included. Please include at least one section.");
    $("html, body").animate({scrollTop: 0}, 'slow');
    return false;
  }
}

function eventBindingsForBuildCarePlan(){
  $("#build_careplan_parent").on("click","#click_toggle_second",function(){
    if($("#clk_toggle_lbl_second").html() == "to add new"){
      $("#specialization_name_by_text").show().val("");
      $("#specialization_name").hide();
      $("#clk_toggle_lbl_second").html("select form list");
    }else{
      $("#specialization_name_by_text").hide().val("");
      $("#specialization_name").show();
      $("#clk_toggle_lbl_second").html("to add new");
    }
  });
    

  $("#build_careplan_parent").on("click","#create_new_careplan_link",function(){
    activateCreateNewCareplanDetails($(this));
  });

  $("#build_careplan_parent").on("click","#create_new_careplan_sections_link",function(){
    activateNewCareplanSectionDetails($(this));
  });

  $("#build_careplan_parent").on("click","#confirm_new_careplan_link",function(){
    activateConfirmCareplanSectionDetails($(this));
  });

  $("#care_plan_section_name").multiselect({
    selectedList: 7,
    noneSelectedText: "Select Section",
    minWidth : 500
  });
  
  $("#build_careplan_parent").on("click","#back_to_cplan_list",function(){
    backtoCarePlanList();
  });

  $("#build_careplan_parent").on("click","#toggle_careplan_summary",function(){
    generateCarePlanSummaryList();
  });

  $("#build_careplan_parent").on("click","#refresh_careplan_summary",function(){
    generateCarePlanSummary();
  });

  $("#build_careplan_parent").on("click",".add-more-careplan-section-fields",function(){
    addMoreCareplanSectionFields($(this));
  });

  $("#build_careplan_parent").on("click",".delete-careplan-section",function(){
    $(this).parent().parent().remove();
  });

  $("#build_careplan_parent").on("click",".toggle-careplan-section-details",function(){
    toggleCarePlanSectionDetails($(this));
  });

  $("#build_careplan_parent").on("click","#save_cplan_template",function(){
    saveNewCarePlan();
  });

  $("#build_careplan_parent").on("click","#save_publish_cplan_template",function(){
    saveAndPublishNewCareplan();
  });
  $("#new_cplan_tab").on("change",".careplan-response",function(){
    changeCarePlanResponse($(this));
  });

  $("#build_careplan_parent").on("change",".chk_include",function(){
    if($(this).prop("checked") == true){
      $(this).parent().parent().find(".hourly_select").show();
    }else{
      $(this).parent().parent().find(".hourly_select").hide();
    }
  });
  
  $("#build_careplan_parent").on("change",".cp_freqency_days_select",function(){
    if($(this).val() == "Specific Day"){
      $(this).parent().find('.selected-careplan-freq-val').show();
      $(this).parent().find('.selected-careplan-specificdate').hide();
    }else if($(this).val() == "Days Before/After"){
      $(this).parent().find('.selected-careplan-freq-val').hide();
      $(this).parent().find('.selected-careplan-specificdate').show();
    }else{
      $(this).parent().find('.selected-careplan-freq-val').hide();
      $(this).parent().find('.selected-careplan-specificdate').hide();
    }
  });

  $("#build_careplan_parent").on("change",".cp_response",function(){
    if($(this).find('select').val() != "Select Response"){
      $(this).parent().find('.cp_include').show();
      $(this).parent().find('.cp_sedate').show();
      $(this).parent().find('.cp_time').show();  
    }else{
      $(this).parent().find('.cp_include').hide();
      $(this).parent().find('.cp_sedate').hide();
      $(this).parent().find('.cp_time').hide();
    }
  });

  $("#build_careplan_parent").on("click","#create_new_cplan", function(){
    createNewCarePlan();
  });

  $('#cplan_field_modal').on('hide.bs.modal', function (e) {
    $("#cplan_fieldname").val('');
    $("#cplan_field_response").val('');
    $("cplan_field_format options").empty();
  });

  $("#build_careplan_parent").on("click",".template-btn-click",function() {
    $(this).toggleClass('clicked');
  });

  $("#build_careplan_parent").on("click",".d-before-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#build_careplan_parent").on("click",".d-after-click", function() {
    $(this).toggleClass('clicked');
  });

  $("#add_cplan_field").click(function(){
    $("#cplan_field_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("#save_cplan_field").attr("edit","");
  });

  $("#rf_pair_table").on("click","#add_response_format_pair",function(){
    generateRFPairCombobox();
  });

  $("#build_careplan_parent").on("change",".cmn-rf-pair-res",function(){
    var temp_count = $(this).attr("count");
    temp_frmt  = "frmt_cp_id"+temp_count;
    $("#"+temp_frmt+" option").remove();
    response_value = $(this).val();
    $("tr[count='"+temp_count+"']").attr("response_val",response_value);
    if(response_value == "boolean"){
      AddItem('On/Off','on-off',temp_frmt);
      AddItem('true/false','true-false',temp_frmt);
      AddItem('Yes-No','yes-no',temp_frmt);
    }else if(response_value == "string"){
      AddItem('String','string',temp_frmt);
    }else if(response_value == "numeric"){
      AddItem('Simple Integer','Simple_Integer',temp_frmt);
      AddItem('HeartRate(bpm)','HeartRate(bpm)',temp_frmt);
      AddItem('Blood Pressure(mm Hg)','BloodPressure(mmHg)',temp_frmt);
      AddItem('Glucose','Glucose',temp_frmt);
      AddItem('Weight(kg)','Kilogram(kg)',temp_frmt);
      AddItem('Respiration Rate(bpm)','Respiration_Rate(bpm)',temp_frmt);
      AddItem('Oxygen Sat(%)','Oxygen_Sat(%)',temp_frmt);
      AddItem('Kilometers','Kilometers',temp_frmt);
    }else if(response_value == "multiple"){
      AddItem('Days Before/after','daysBeforeAfter',temp_frmt);
      AddItem('Weekly','weekly',temp_frmt);
      AddItem('Time Of The day','timeOfTheDay',temp_frmt);
    }else if(response_value == "time"){
      AddItem('Time','time',temp_frmt);
    }else if(response_value == "start-end-date"){
      AddItem('Start Date/ End Date','start-end-date',temp_frmt);
    }
    $("tr[count='"+temp_count+"']").attr("format_val",$("#"+temp_frmt).val());
  });

  $("#build_careplan_parent").on("change",".cmn-rf-pair-frmt",function(){
    var temp_count = $(this).attr("count");
    $("tr[count='"+temp_count+"']").attr("format_val",$(this).val());
  });  

  $("#build_careplan_parent").on("click",".remove-rf-pair",function(){
    if($(".rf-pair-cmn").length == "1"){
      alert("only one record !! can not removed");
    }else{
      $("tr[count='"+$(this).attr("count")+"']").remove();
    }
  });
  
  $("#build_careplan_parent").on("click",".delete_cplan", function() {
    $("#delete_cplan_confirm").attr("index",$(this).attr("index"));
    $("#delete_cplan_confirm").attr("rev",$(this).attr("rev"));
  });

  $("#delete_cplan_confirm").click(function () {
   deleteCarePlan();
  });

  $("#build_careplan_parent").on("click","#save_cplan_field",function(){
    var rf_array = generateRFPairArray();
    if ($("#cplan_fieldname").val().trim().length == 0) {
      newAlertForModal('error', "Field name can not be blank.",'cplan_field_modal');
    }
    else {
      if($(this).attr("edit")){
        var edit_count = $(this).attr("edit");
        var edit_data  = "";
        edit_data += '<td id = "field_name'+edit_count+'" class = "field-name">'+$("#cplan_fieldname").val()+'</td><td colspan="2"><table class="table tbl-border rf-field-table" id="rf_field_table'+edit_count+'"><tbody>'

        for(var i = 0; i<rf_array.length; i++){
          edit_data += '<tr><td class="response-type">'+rf_array[i].response_type+'</td><td class="format-type">'+rf_array[i].format_type+'</td></tr>';
        }

        edit_data += '</tbody></table></td><td><span rev="revision" delete="'+edit_count+'" data-toggle="modal" role="button" class="glyphicon glyphicon-trash delete_cplan_field pointer"></span></td><td><span edit="'+edit_count+'" data-toggle="modal" role="button" class="glyphicon glyphicon-pencil edit_cplan_field pointer"></span></td>';

        $("#main_row"+edit_count).html(edit_data);
      }else{
        fieldArray = [];
        
        var cplan_fields_table = "";

        if(!($(this).attr("edit"))){
          fieldArray.push({
            "fieldname":            $("#cplan_fieldname").val(),
            "response_format_pair": rf_array
          });
        }
          var  i = $(".main-row").length;
          cplan_fields_table += '<tr class = "main-row" id = "main_row'+i+'"><td class = "field-name" id = "field_name'+i+'">'+fieldArray[0].fieldname+'</td><td colspan = "2"><table id = "rf_field_table'+i+'" class = "table tbl-border rf-field-table">';
          for(var j=0;j< fieldArray[0].response_format_pair.length;j++){
            cplan_fields_table += '<tr><td class = "response-type">'+fieldArray[0].response_format_pair[j].response_type+'</td><td class = "format-type">'+fieldArray[0].response_format_pair[j].format_type+'</td></tr>';
          }
          cplan_fields_table += '</table></td><td><span class="glyphicon glyphicon-trash delete_cplan_field pointer" role="button" class="dropdown-toggle" data-toggle="modal" delete="'+i+'" rev="revision"></span></td><td><span class="glyphicon glyphicon-pencil edit_cplan_field pointer" role="button" class="dropdown-toggle" data-toggle="modal" edit="'+i+'"></span>'+'</td></tr>'; 
        $("#cplan_field_table .cp-tbody").append(cplan_fields_table);
      }
      $('#cplan_field_modal').modal("hide");
    }
  });

  $("#build_careplan_parent").on("click",".edit_cplan_field",function() {
    edit_row_num = $(this).attr("edit");
    $("#cplan_field_modal").modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("#cplan_fieldname").val($("#field_name" + edit_row_num).text());
    var tr_length = $("#rf_field_table"+edit_row_num+" tr").length;

    for(i = 0;i<tr_length - 1;i++){
      generateRFPairCombobox();
    }
    var tmp_rf_array = [];

    $("#rf_field_table"+edit_row_num).find("tr").each(function(){
      tmp_rf_array.push({
        tmpres:$(this).find(".response-type").html(),
        tmpfrmt:$(this).find(".format-type").html()
      });
    });
    $(".rf-pair-cmn").each(function(j){
      $(this).attr("response_val",tmp_rf_array[j].tmpres);
      $(this).attr("format_val",tmp_rf_array[j].tmpfrmt);
      $(this).find(".cmn-rf-pair-res").val(tmp_rf_array[j].tmpres).trigger("change");
      $(this).find(".cmn-rf-pair-frmt").val(tmp_rf_array[j].tmpfrmt).trigger("change");
    });

    $("#save_cplan_field").attr("edit",edit_row_num);
  });

  $("#build_careplan_parent").on("click",".delete_cplan_field", function() {
    $(this).parent().parent().remove();
  });

//Update Care plan Template
  $("#build_careplan_parent").on("click",".edit_care_plan",function(){
    editCarePlan($(this).attr("index"));
  });
  
  $("#override_care_plan").on("click","#yes_override_care_plan",function(){
    if($("#save_cplan_template").attr("newindex") && $("#save_cplan_template").attr("newrev")){
      rem_doc  = {
        _id:  $("#save_cplan_template").attr("index"),
        _rev: $("#save_cplan_template").attr("rev")
      };

      var newind = $("#save_cplan_template").attr("newindex");
      var newrev = $("#save_cplan_template").attr("newrev");

      $("#save_cplan_template").attr("index",newind);
      $("#save_cplan_template").attr("rev",newrev);
      saveCarePlan("No");
      $.couch.db(db).removeDoc(rem_doc,{
        success:function(data){
        },
        error:function(data,error,reason){
          newAlert('danger',reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });  
    }else{
      saveCarePlan("No");
    }
    $("#override_care_plan").modal("hide");
  });

  $("#override_care_plan").on("click","#no_override_care_plan",function(){
    $("#save_cplan_template").attr("index","");
    $("#save_cplan_template").attr("rev","");
    $("#save_cplan_template").attr("newindex","");
    $("#save_cplan_template").attr("newrev","");
    $("#cplan_save").focus();
    $("#override_care_plan").modal("hide");
  });

  // $("#build_careplan_parent").on("click","#back_to_choose_care_plan_new",function(){
  //   $("#save_care_plan_tab").hide();
  //   $("#saved_patient_care_plan_tab").hide();
  //   $('#search_practise_care_plan').val('');
  //   $("#search_care_plan_tab").show();
  //   $('#prescribed_patient_care_plans').show();
  //   $('#care_plan_update_button_parent').html('');
  //   $('#careplan_visulization').hide(); 
  // });

  $("#existing_care_plan_list").autocomplete({
    search: function(event, ui) { 
       //$('.spinner').show();
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(db).view("tamsa/getExistingCarePlan", {
        success: function(data) {
            $("#existing_care_plan_list").removeClass('myloader');
            response(data.rows);
        },
        error: function(status) {
            console.log(status);
        },
        //key:[pd_data._id,"Yes",request.term]
         startkey: [pd_data._id,request.term],
         endkey: [pd_data._id,request.term + "\u9999",{}],
         limit: 5
      });
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { value:{template_name: 'No results found'},label:"No results found" };
        ui.content.push(noResult);
        //$("#message").text("No results found");
      }
    },
    minLength: 1,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      if (ui.item.value == "No results found"){
        return;
      }else{
        existingCarePlanSearch(ui.item.id);
      }
      return false;
    },
    open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.value.template_name + "</a>")
      .appendTo(ul);
  };

  $("#build_careplan_parent").on("blur","#existing_care_plan_list",function(){
    if($(this).val().length == 0){
      $('#cplan_current_list thead').html(''); 
      $('#cplan_current_list tbody').html('');
    }
  });

  $("#build_careplan_parent").on("click",".add-careplan-section-fields",function(){
    addCarePlanFields($(this));
  });

  $("#build_careplan_parent").on("change",".careplan-response-type",function(){
    generateFormateForSelectedResponse($(this).val());
  });

  $("#build_careplan_parent").on("click",".add-more-careplan-response-format",function(){
    addMoreCarePlanResponseFormat($(this));
  });

  $("#build_careplan_parent").on("click",".remove-careplan-response-format",function(){
    removeCarePlanResponseFormat($(this));
  });
}

function saveAndPublishNewCareplan(){
  $("#save_cplan_template, #save_publish_cplan_template").attr("disabled","disabled");
  if (carePlanValidation()){
    if($("#specialization_name_by_text").val != ""){
      var specialization_value = $("#specialization_name_by_text").val().trim();
    }else {
      var specialization_value = $("#specialization_name").val().toString().trim();
    }
    var chk_exisitng      = false;
    var doctor_id         = pd_data._id
    var specialization    = specialization_value;
    var careplan_name     = $.trim($("#cplan_name").val());

    publish = "Yes";
    $.couch.db(db).view("tamsa/getCommunityCarePlans",{
      success:function(data){
        if(data.rows.length > 0){
          for(var i = 0; i<data.rows.length;i++){
            if($("#save_cplan_template").attr("index") && $("#save_cplan_template").attr("rev")){
              if(data.rows[i].value.doctor_id == pd_data._id){
                saveCarePlan(publish);
                return;
              }else{
                newAlert('danger','Care Plan already exist in Community !');
                $('html, body').animate({scrollTop: 0}, 'slow');
                return;
              }
            }else{
              newAlert('danger','Care Plan already exist in Community !');
              $('html, body').animate({scrollTop: 0}, 'slow');
              return;
            }
          }
        }else{
          saveCarePlan(publish);
        }
        $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
      },
      error: function(data, error, reason) {
        $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:careplan_name
    });
  }else{
    $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
    return false;
  }
}

function saveNewCarePlan(){
  $("#save_cplan_template, #save_publish_cplan_template").attr("disabled","disabled");
  if (carePlanValidation()){
    if($("#specialization_name_by_text").val() != ""){
      var specialization_value = $("#specialization_name_by_text").val();
    }else{
      var specialization_value = $("#specialization_name").val();
    }
    var chk_exisitng   = false;
    var doctor_id      = pd_data._id
    var specialization = specialization_value;
    var careplan_name  = $.trim($("#cplan_name").val());
    publish            = "No";
    $.couch.db(db).view("tamsa/getCarePlans", {
      success:function(data){
        if(data.rows.length > 0){
          if($("#save_cplan_template").attr("index") && $("#save_cplan_template").attr("rev")){
              if(data.rows[0].value._id != $("#save_cplan_template").attr("index")){
                $("#save_cplan_template").attr("newindex",data.rows[0].value._id);
                $("#save_cplan_template").attr("newrev",data.rows[0].value._rev);
                $("#override_care_plan").modal("show");
              }else{
                $("#save_cplan_template").attr("newindex","");
                $("#save_cplan_template").attr("newrev","");
                saveCarePlan(publish);
              }
          }else{
            $("#save_cplan_template").attr("index",data.rows[0].value._id);
            $("#save_cplan_template").attr("rev",data.rows[0].value._rev);
            $("#save_cplan_template").attr("newindex","");
            $("#save_cplan_template").attr("newrev","");
            $("#override_care_plan").modal("show");
          }
        }else{
          saveCarePlan(publish);
        }
        $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
      },
      error: function(data,error,reason) {
        $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key: [doctor_id,careplan_name,specialization]
    });
  }else{
    $("#save_cplan_template, #save_publish_cplan_template").removeAttr("disabled");
    return false;
  }
}

function backtoCarePlanList(){
  $(".tab-pane").removeClass("active");
  $("#cplan_list").addClass("active");
  $('#cplan_current_list thead').html(''); 
  $('#cplan_current_list tbody').html('');
  $('#existing_care_plan_list').val('');
  $('#toggle_careplan_summary').hide();
  $('#refresh_careplan_summary').hide();
  $('.add-more-careplan-section-fields').hide();
  $('#cplan_name').val('');
  $('#specialization_name').val('');
}

function printTimelineRecords($obj,userdata,hdata) {
  var pg_print_no = 0;
  var print_page = [];
  $("#print_area_temp").html("<h2 class='print_header'>"+$obj.parent().html()+"</h2>"+$obj.parent().parent().find('.timelinecontents').html()+"</div>")
  $("#print_area_temp").find(".time").remove();
  $("#print_area_temp").find(".glyphicon-chevron-right").remove();
  $("#print_area_temp").find(".glyphicon-chevron-down").remove();
  $("#print_area_temp").find(".tl-print-selected").remove();
  $("#print_area_temp").find("th, td, .print_template_name").css("font-size", "15px");
  $("#print_area_temp").find(".response_header").remove();
  // $("#print_area_temp").find(".newdesign_label").css("font-weight","bold");
  $obj.hide();
  // $obj.parent().find('.time').hide();
  // $obj.parent().find('.glyphicon-chevron-right').hide();
  // $obj.parent().find('.glyphicon-chevron-down').hide();
  // $obj.parent().find('.tl-print-selected').hide();
  // $obj.closest(".timelinesection").find("th, td, .print_template_name").css("font-size", "15px");
  $obj.closest(".timelinesection").append('<div id="print_loading_image" style="z-index: 9999; border: medium none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background-color: rgb(0, 0, 0); opacity: 0.9; cursor: wait; position: fixed;" class="blockUI blockOverlay"><div style="z-index: 1011; position: fixed; padding: 0px; margin: 0px; width: 30%; top: 40%; left: 35%; text-align: center; color: rgb(0, 0, 0); cursor: wait;" class="blockUI blockMsg blockPage"><h3 style="height:auto;font-size:15px;color:#FF9108;margin:0px;margin-bottom:4px;padding:0px;"><br><img style="padding:0px; margin:0px;" alt="" title="Loading..." src="images/ajax-loader-large.gif"><br>'+(msg ? msg : "")+'</h3></div></div>');
    
  var printdata = getPrintCommonDetails(hdata,"",userdata,$obj.closest(".timelinesection").find(".timeline_date").data("update_date"));
  print_page.push("<div class='container connew'>");
  print_page.push(printdata);
  print_page.push($("#print_area_temp").html());
  print_page.push("<div class='page-break'></div>");
  printNewHtml(print_page.join(""));
  $obj.show();
  // $obj.parent().find('.time').show();
  // $obj.parent().find('.glyphicon-chevron-right').show();
  // $obj.parent().find('.glyphicon-chevron-down').show();
  // $obj.parent().find('.tl-print-selected').show();
  // $obj.closest(".timelinesection").find("th, td, .print_template_name").css("font-size", "");
  $("#print_loading_image").remove();
  $("#print_area_temp").html('');
}
