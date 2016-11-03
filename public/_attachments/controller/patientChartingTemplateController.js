var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};
// app.controller("patientChartingTemplateController",function($scope,$state,$stateParams){
//   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChartingTemplate);
// });

app.controller("patientChartingTemplateController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db(replicated_db).openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.sharedBindings();
            if($stateParams.user_id){
              // if($stateParams.template_state == "generic"){
              //   tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientGenericChartNote); 
              // }
              if($stateParams.template_state == "choose"){
                if($stateParams.template_id && $stateParams.template_parameter){
                  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChartingTemplateRefer); 
                  $.unblockUI();
                }else if($stateParams.template_id){
                  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChartingTemplateWithId);
                  $.unblockUI();
                }else{
                  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChartingTemplate); 
                }
              }else if($stateParams.template_state == "build"){
                tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientBuildTemplate)
              }else{
                $state.go("medical_history");
               // tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientChartingTemplate); 
              }
            }else{
            	displayCommunityTemplates($stateParams.template_id);
              tamsaFactories.pdBack();
            }
            tamsaFactories.displayDoctorInformation(data);
            saveAuditRecord("Charting","Access","Successfully accessed.");
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });

  function displayCommunityTemplates(current_doc_id){
    $("#dc_charting_flag").val("Copy");
    $("#charting_link").addClass("active");
    displayChartingTemplate(current_doc_id,tamsaFactories);
    eventBindingsForPatientChartingTemplates();
    saveAuditRecord("Charting","Access","Successfully accessed.");
  }

  function activatePatientGenericChartNote(){
    $(".tab-pane").removeClass("active");
    $("#start_chart_note").addClass("active");
    $("#start_chart_note_link").parent().parent().find("li").removeClass("active");
    $("#start_chart_note_link").parent().addClass("active");
    $("#charting_link").addClass("active");
    eventBindingsForPatientChartingTemplates();
  }

  function activatePatientChartingTemplate(){
    $("#charting_link").addClass("active");
    activateMyPracticeChartingTemplates();
    //chooseChartingTemplate();
    eventBindingsForPatientChartingTemplates();
  }

  function activatePatientChartingTemplateWithId(){
    $("#charting_link").addClass("active");
    activateMyPracticeChartingTemplates();
    eventBindingsForPatientChartingTemplates();
    $.couch.db(db).openDoc($stateParams.template_id, {
      success:function (data) {
        displayChartingTemplate(data._id,tamsaFactories,data.template_name,data.Specialization);
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function activatePatientChartingTemplateRefer(){
    activatePatientChartingTemplateWithId()
    displayReferDocInformation($stateParams.template_parameter);
  }

  function displayReferDocInformation(id){
    $("#charting_referred_info").show();
    $("#referred_info").show();
    $.couch.db(db).openDoc(id,{
      success:function(data){
        $("#refer_doctor_name").html(data.sender_doctor);
        $.couch.db(replicated_db).openDoc(data.sender_doctor_id, {
          success: function(doc_data) {
            $("#refer_doctor_name").attr("title",doc_data.hospital_affiliated+", "+doc_data.alert_phone);
            $("#charting_referred_info").attr("refer_doc_id",id);
          },
          error:function(data){
            console.log(data);
          }
        });
      },
      error:function(data,status,error){
        console.log(status);
      }
    });
  }

  function activateMyPracticeChartingTemplates(){
    $(".tab-pane").removeClass("active");
    $("#choose_charting_template_list").addClass("active");
    $("#choose_charting_template").parent().parent().find("li").removeClass("active");
    $("#choose_charting_template").parent().addClass("active");
    $("#ctemplate_my_practise_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#ctemplate_my_practise_link").addClass("ChoiceTextActive");
    $("#ctemplate_my_practise_tab").addClass("active");
    $("#dc_charting_flag").val("Source");
    chooseChartingTemplateList();
  }

  function backToChartingBuild(){
    $(".tab-pane").removeClass("active");
    // if($("#dc_charting_flag").val() == "Source" || $("#dc_charting_flag").val() == "Copy" ){
    if($("#dc_charting_flag").val() == "Copy" ){
      $("#choose_charting_template_list").addClass("active");
      $("#search_charting_template_tab, #update_charting_template_tab").hide();
      $("#save_charting_template_tab").show();
    }else if($("#dc_charting_flag").val() == "Source") {
      $state.go("patient_charting_templates",{user_id:userinfo.user_id,template_state:"choose"});
    }else{
      $("#build_charting_template").addClass("active");
    }
    $("#home").addClass("active");
    $("#personal_details_in").addClass("active");
    $("#lab_results_inner").addClass("active");
    //$('#cplan_current_list thead').html(''); 
    //$('#cplan_current_list tbody').html('');
    //$('#existing_care_plan_list').val('');
  }

  function activateCommunityChartingTemplates(){
    $(".tab-pane").removeClass("active");
    $("#choose_charting_template_list").addClass("active");
    $("#choose_charting_template").parent().parent().find("li").removeClass("active");
    $("#choose_charting_template").parent().addClass("active");
    $("#ctemplate_community_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#ctemplate_community_link").addClass("ChoiceTextActive");
    $("#ctemplate_community_tab").addClass("active");
    chooseCommunityChartingTemplateList();
  }

  function activatePatientBuildTemplate(){
    $(".tab-pane").removeClass("active");
    $("#charting_link").addClass("active");
    $("#start_chart_note_link").parent().parent().find("li").removeClass("active");
    $("#build_charting_template_link").parent().addClass("active");
    $("#build_charting_template").addClass("active");
    if($stateParams.template_id) {
      getAllExistingSpecializationList("new_charting_specialization_name",$stateParams.template_id, editChartingTemplate);
      // editChartingTemplate($stateParams.template_id);
    }
    else {
      resetBuildingTemplate();
      getAllExistingSpecializationList("search_and_display_care_plan_list");  
    }
    eventBindingsForPatientChartingTemplates();
  }

  function getImageMarkers() {
    $.couch.db(db).view("tamsa/getImageMarkers",{
      success:function (data){
        var output = [];
        output.push('<div class="col-lg-1"><span>Legend::</span></div>');
        if(data.rows.length > 0){
          output.push('<div class="col-lg-9" id="image_controls">');
            output.push('<div class="row">');
              for(var i=0;i<data.rows.length;i++){
                output.push('<div class="marker col-lg-3 mrgbottom1">');
                  output.push('<button data-marker="'+data.rows[i].doc.image+'" data-mouser="'+data.rows[i].doc.mouser+'" data-type="dentalMarker" class="form-control text-left marker-click marker-action"><img style="height: 24px; width: 24px; display: inline-block; margin-right: 10px;" class="marker-image" src="'+data.rows[i].doc.image+'">'+data.rows[i].doc.label+'</button>');
                output.push('</div>');
              }
            output.push('</div>');  
          output.push('</div>');
        }else{
          output.push('<div class="col-lg-9">No saved marker found. Please add.</div>');
        }
        output.push('<div class="col-lg-2"><button class="btn btn-warning" id="add_new_marker">Add New Marker</button></div>');
        $("#image_legends").html(output.join(''));
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      include_docs:true
    });
  }


  function eventBindingsForPatientChartingTemplates(){
    chartingTemplateAutocompleter();

    $("#patient_charting_template_parent").on("click",".alert_list",function(){
      toggleAlertList($(this));
    });

    $("#patient_charting_template_parent").on("click","#add_new_medication_from_charting",function(){
      addNewMedicationFromCharting();
    });

    $("#patient_charting_template_parent").on("focusout","#ct_systolic_bp, #ct_diastolic_bp",function(){
      $("#ct_map_value").val(calculateMAP(Number($("#ct_systolic_bp").val()),Number($("#ct_diastolic_bp").val())));
    });

    $("#patient_charting_template_parent").on("focusout","#ct_bmi_height, #ct_bmi_weight",function(){
      if(isNaN(calculatePatientBMI($("#ct_bmi_height").val(),$("#ct_bmi_weight").val()))){
        $("#ct_bmi_value").val("");
      }else{
        $("#ct_bmi_value").val(calculatePatientBMI($("#ct_bmi_height").val(),$("#ct_bmi_weight").val()));
      }
    });

    $("#patient_charting_template_parent").on("click",".cmn-soapnote-toggle-link",function(){
      toggleSoapNoteinCharting($(this));
    });

    $("#patient_charting_template_parent").on("click",".remove-soapnote-fmh", function() {
      $(this).parents(".soapnote-fmh-parent").remove();
    });

    $("#patient_charting_template_parent").on("click",".add-more-fmh-in-soapnote", function() {
      addMoreFMHInChartingTemplate();
    });

    $("#patient_charting_template_parent").on("click","#ctemplate_my_practise_link",function(){
      activateMyPracticeChartingTemplates();
    });

    $("#patient_charting_template_parent").on("click","#ctemplate_community_link",function(){
      activateCommunityChartingTemplates();
    });

    $("#patient_charting_template_parent").on("click","#ctemplate_summary_link",function(){
      activateChartingTemplatesSummary();
    });

    $("#patient_charting_template_parent").on("change"," #charting_ns_monitor",function(){
      $element = $("#charting_ns_details")
      if ($(this).is(':checked')) {
        $element.show("slow");
      }else {
        $element.hide("slow");
        $element.find(".ns_device_id").val("");
        $element.find(".ns_monitor_startdate").val("");
        $element.find(".ns_monitor_enddate").val("");
      }
    });

    $(".source_complaint, .target_complaint").sortable({
      connectWith: ".complaint"
    });
    $(".source_diagnosis, .target_diagnosis").sortable({
      connectWith: ".diagnosis"
    });

    $("#patient_charting_template_parent").on("keydown","#search_practise_specialization",function(e){
      if(e.keyCode == 8 && $(this).val().length == 1){
        //chooseChartingTemplate();
      }    
    });

    $("#patient_charting_template_parent").on("click","#add_new_charting_template",function(){
      addNewChartingTemplate();
    });

    $("#patient_charting_template_parent").on("click","#back_to_charting_build",function(){
      backToChartingBuild();
    });

    $("#patient_charting_template_parent").on("click",".remove-section",function(){
      removeSection($(this));
    });
    
    $("#save_new_charting_template").on("click",function(){
      saveNewChartingTemplate($(this).attr("id"));
    });

    $("#save_publish_new_charting_template").on("click",function(){
      saveNewChartingTemplate($(this).attr("id"));
    });

    $("#build_charting_template_modal").on("show.bs.modal",function () {
      chartingTemplateModalDisplay();
    });

    $("#build_charting_template_modal").on("click","#add_charting_response_pair",function(){
      generateChartingResponseCombobox();
    });

    $("#build_charting_template_modal").on("click",".remove-ctemplate-response",function(){
      removeChartingTemplateResponse($(this).attr("count"));
    });

    $("#build_charting_template_modal").on("change",".cmn-ctemplate-response-val",function(){
      generateFormatFromResponse($(this).val(),$(this).attr("count"));
    });

    $("#build_charting_template_modal").on("click",".close-format-options",function(){
      closeFormatOptions($(this));
    });

    $("#build_charting_template_modal").on("click",".add-format-options",function(){
      addFormatOptions($(this));
    });

    $("#build_charting_template_modal").on("click",".add-more-rows",function(){
      addMoreRows($(this));
    });

    $("#build_charting_template_modal").on("click",".add-more-columns",function(){
      addMoreColumns($(this));
    });

    $("#build_charting_template_modal").on("click",".add-more-rows-grid",function(){
      addMoreRowsGrid($(this));
    });

    $("#build_charting_template_modal").on("click",".add-more-columns-grid",function(){
      addMoreColumnsGrid($(this));
    });

    $("#patient_charting_template_parent").on("click",".charting_template_results",function() {
      displayChartingTemplate($(this).attr("doc_id"),tamsaFactories,$(this).parent().find("td:first").html(),$(this).parent().find("td:last").html());
    });

    $("#patient_charting_template_parent").on("click",".prior-btn-soapnote",function(){
      getObjectivePriorChoices($(this));
    });

    $("#patient_charting_template_parent").on("click",".normal-btn-soapnote",function(){
      getObjectiveNormalChoices($(this));
    });

    $("#save_charting_template_tab").on("click",".ctemplate_display_toggle_section",function(){
      $(this).parent().next().slideToggle();
      if($(this).hasClass('glyphicon-minus-sign')){
        $(this).removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
      }else{
        $(this).removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
      }
    });

    $("#save_charting_template_tab").on("click","#text_on_image",function(e){
      e.preventDefault();
      perform({"command": "text"});
    });

    $("#save_charting_template_tab").on("click","#add_new_marker",function(e){
      e.preventDefault();
      $("#text").data("status","inactive");
      editingText = false;
      $("#add_new_marker_modal").modal({
        show:true,
        backdrop:'static',
        keyboard:false
      });
    });

    $("#add_new_marker_modal").on("show.bs.modal","",function() {
      clearAddNewMarkerModal();
    });

    $("#patient_charting_template_parent").on("click","#save_new_marker",function(){
      if(validateNewMarkerDetails()){
        $.couch.db(db).view("tamsa/getImageMarkers", {
          success:function(data) {
            if(data.rows.length > 0) {
              newAlertForModal('danger', 'Marker Label already exist with given name.', 'add_new_marker_modal');
              return false;
            }else{
              var new_marker_data = {
                doctype:   "image_marker",
                label:     $("#new_marker_name").val().trim(),
                image:     $("#new_marker_image").val(),
                mouser:    $("#new_marker_mouser").val(),
                insert_ts: new Date(),
                doctor_id: pd_data._id,
                dhp_code:  pd_data.dhp_code
              };
              $.couch.db(db).saveDoc(new_marker_data,{
                success: function(data){
                  newAlert("success","Marker Successfully added.");
                  $("#add_new_marker_modal").modal("hide");
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  getImageMarkers();
                  return true;
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
          key:$("#new_marker_name").val().trim()
        });
        
      }else{
        return false;
      }
    });
    
    $("#save_charting_template_tab").on("click","#dental",function(){
      getImageMarkers();
    });

    $("body").on("click","#save_image_changes",function(e){
      e.preventDefault();
      editingText = false;
      $("#toolbar span").addClass("label-warning").removeClass("label-default");
      saveImageChanges($(this),"button");
    });

    $("#save_charting_template_tab").on("change",".canvas_images",function(evt){
      var target = evt.target;
      evt.preventDefault();
      if($(this).val() == "Select Image") {
        $("#save_image_changes").hide();
        $("#image_legends").remove();
        $(this).parent().find(".ct-image-parent").remove();
        $(this).parent().parent().parent().find(".canvas-parent").remove();
        $(this).parent().parent().parent().find(".canvas-toolbar-parent").remove();
      }else{
        $(this).parent().next().append('<button class="btn btn-warning pull-right mrgright1" style="display:none;" id="save_image_changes">Save Image Changes</button>');
        $("#save_image_changes").show();
        var output = [];
        // <span class="label label-warning" id="zoomOut">Zoom Out</span><span class="label label-warning" id="zoomIn">Zoom In</span><span class="label label-warning" id="rotate90CW">Rotate 90 Clockwise</span><span class="label label-warning" id="rotate90CCW">Rotate 90 Counter Clockwise</span>
        output.push('<div class="row mrg-top5"><div id="toolbar" class="col-lg-12 canvas-toolbar-parent mrgtop1"><span class="label label-warning" id="reset_drawing_canvas">Reset</span><span class="label label-warning" id="undo">Undo steps</span><span class="label label-warning" id="crop">Crop</span><span class="label label-warning" id="invert">Invert</span><span class="label label-warning" id="flipVertical">Flip Vertical</span><span class="label label-warning" id="flipHorizontal">Flip Horizontal</span><span class="label label-warning" id="line">Line</span><span class="label label-warning" id="text">Text</span><span class="label label-warning" id="rect">Rectangle</span><span class="label label-warning" id="circle">Circle</span><small>Font Color:</small><input type="color" id="canvas_color" class="color canvas-color" value="#ff0000"><span class="label label-warning mrg-left5" id="dental">Dental</span></div></div>');
        output.push('<div class="row mrgtop1" id="image_legends"></div>');
        output.push('<div class="row"><div class="col-lg-12 canvas-parent mrgtop1"><canvas id="drawingCanvas" height="600" width="850" style="border:3px solid rgb(204, 204, 204); border-radius: 10px;">Canvas not supported</canvas></div></div>');

        $(this).parent().find(".ct-image-parent").remove();
        $(this).parent().parent().parent().find(".canvas-parent").remove();
        $(this).parent().parent().parent().find(".canvas-toolbar-parent").remove();
        $("#image_legends").remove();
        $(this).parent().parent().parent().append(output.join(''));
        // $(this).after(output.join(''));
        drawingCanvas = document.getElementById('drawingCanvas');
        drawingContext = drawingCanvas.getContext('2d');
        var section_field = $("#charting_section_selection").find(".section_link").filter(".selected_section").text() +"|"+ $(this).closest(".ctemplate-display-fieldlist").find(".ctemplate-display-fieldname").text();
        console.log(section_field);
        if(($("#charting_section_selection").data(section_field)) && ($(this).find("option:selected").text() == $("#charting_section_selection").data(section_field).image_name)){
          drawingSurfaceImageData = $("#charting_section_selection").data(section_field).image_data;
          drawingContext.putImageData(drawingSurfaceImageData, 0, 0);
        }else{
          var image_url = $(this).val();
          drawDentalImage(drawingContext, drawingCanvas.width, drawingCanvas.height, image_url, $(this).find(':selected').attr("data-width"), $(this).find(':selected').attr("data-height"));
        }
        canvasEditorApp();
        saveImageChanges($("#save_image_changes"),"onload");
      }
      generateScrollPositionForAllSections();
    });

    $("#save_charting_template_tab").on("keypress",".dragtext",function(e){
      if($(this).val() == "") $(this).parent().parent().find(".dragnote-parent").hide();
      if(e.which ==13){
        e.preventDefault();
        $(this).parent().parent().find(".dragnote-parent").append('<div class="col-lg-8 dragnote"><span class="dragval">'+$(this).val()+'</span><span class="closeit" style="position:absolute;top:-15px;right:0px;cursor:pointer;">x</span></div>');
        $(this).parent().parent().find(".dragnote-parent").show();
        generateDraggable($(this));
      }
    });

    $("#save_charting_template_tab").on("click",".closeit",function(){
      $(this).parent().remove();
    });

    $("#save_charting_template_tab").on("click","#partial_save_patient_charting_template",function(){
      saveChartingTemplateForPatient($(this));
    });

    $("#save_charting_template_tab").on("click","#save_patient_charting_template", function(){
      createModal("save_and_print_chart_temp");
      $("#yes_print_and_save").data("index",$(this).data("index"));
      $("#yes_print_and_save").data("obj",$(this));
      $("#yes_print_and_save").data("rev",$(this).data("rev"));
      $("#yes_print_and_save").attr("doc_id",$(this).attr("doc_id"));
      $("#no_print_and_save").data("index",$(this).data("index"));
      $("#no_print_and_save").data("rev",$(this).data("rev"));
      $("#no_print_and_save").attr("doc_id",$(this).attr("doc_id"));
    });

    $("#patient_charting_template_parent").on("click", "#yes_print_and_save",function(){
      var print_value ="print";
      saveChartingTemplateForPatient($(this),print_value);
      printPatientChartingTemplate($("#yes_print_and_save").data("obj"));
      $("#save_and_print_chart_temp").modal("hide");
    });

    $("#patient_charting_template_parent").on("click", "#no_print_and_save",function(){
      saveChartingTemplateForPatient($(this));
      $("#save_and_print_chart_temp").modal("hide");
    });

    $("#save_charting_template_tab").on("click","#print_patient_charting_template",function(){
      createModal("confirm_print_charting_template");
      $("#yes_print_charting_template").data("obj",$(this));
    });

    $("#patient_charting_template_parent").on("click","#yes_print_charting_template",function(){
      saveChartingTemplateForPatient($("#partial_save_patient_charting_template"));
      printPatientChartingTemplate($("#yes_print_charting_template").data("obj"));
      $("#confirm_print_charting_template").modal("hide");
    });

    $("#patient_charting_template_parent").on("click","#no_print_charting_template",function(){
      $("#confirm_print_charting_template").modal("hide");
    });

    $("#save_charting_template_tab").on("click","#yes_print_charting_template",function(){
      printPatientChartingTemplate($("#yes_print_charting_template").data("obj"));
    });

    $("#patient_charting_template_parent").on("click",".form-add-more-sections",function(){
      addMoreSectionsOnForm();
    });

    $("#patient_charting_template_parent").on("click",".edit_charting_template",function(){
      getAllExistingSpecializationList("new_charting_specialization_name");
      editChartingTemplate($(this).attr("index"));
    });

    $("#patient_charting_template_parent").on("click","#back_to_choose_charting_template",function(){
      $('#templatecommunity').show();
      if($("#dc_charting_flag").val() == "Copy"){
        $state.go("community_template");
      }else if($("#dc_publish").css("display") == "block"){
        $(".tab-pane").removeClass("active");
        $("#ctemplate_my_practise_tab, #home, #choose_charting_template_list, #personal_details_in, #lab_results_inner").addClass("active");
        $("#dc_template_list_parent").removeClass("active");
        $("#dc_template_list").hide();
        $("#save_charting_template_tab").hide();
        $("#search_charting_template_tab").show();
        $("#ctemplate_community_link").parent().find("div").removeClass("ChoiceTextActive");
        $("#ctemplate_my_practise_link").addClass("ChoiceTextActive");
        activateMyPracticeChartingTemplates();        
      }else if($("#dc_copy").css("display") == "block"){
        $(".tab-pane").removeClass("active");
        $("#ctemplate_my_practise_tab, #home, #choose_charting_template_list, #personal_details_in, #lab_results_inner").addClass("active");
        $("#dc_template_list_parent").removeClass("active");
        $("#dc_template_list").hide();
        $("#save_charting_template_tab").hide();
        $("#search_charting_template_tab").show();
        $("#ctemplate_my_practise_link").parent().find("div").removeClass("ChoiceTextActive");
        $("#ctemplate_community_link").addClass("ChoiceTextActive");
        activateCommunityChartingTemplates();
      }
      $("#search_practise_charting_template, #search_community_charting_template").val("");
    });

    $("#patient_charting_template_parent").on("click",".delete_charting_template",function(){
      $("#delete_charting_template_confirm").attr("index",$(this).attr("index"));
      $("#delete_charting_template_confirm").attr("rev",$(this).attr("rev"));
    });

    $("#patient_charting_template_parent").on("click","#delete_charting_template_confirm",function(){
      deleteChartingTemplate();
    });

    $("#patient_charting_template_parent").on("click",".delete_charting_template_field",function(){
      deleteChartingTemplateField($(this));
    });

    $("#new_charting_specialization_name").on("focusout",function(){
      //getFieldsFromSpecialization();
    });

    $("#patient_charting_template_parent").on("click",".form-add-more-fields",function(){
      addMoreFieldsOnForm($(this));
    });

    $("#patient_charting_template_parent").on("click",".form-remove-field",function(){
      removeFormField($(this));
    });

    $("#patient_charting_template_parent").on("click","#add_new_fields",function(){
      addChartingTemplateField();
    });

    $("#build_charting_template_modal").on("click","#save_charting_response_field",function(){
      saveChartingResponseField();
    });

    $("#patient_charting_template_parent").on("click",".add-rows-table-form",function(){
      var count = (new Number($(".trows-count:last").attr("count")) + 1) || 0;
      addRowsInTableForm(count,$(this));
    });

    $("#patient_charting_template_parent").on("click",".remove-form-table-row",function(){
      $(this).parent().parent().remove();
    });

    $("#patient_charting_template_parent").on("click",".remove-response",function(){
      var $obj = $(this).parent().parent().parent()
      $(this).parent().parent().remove();
      if($obj.children().length < 1){
        $obj.append('<span class="default-placeholder ui-sortable-handle">Drop Your response here</span>');
      }
    });

    $('body').on('keydown', '.add-charting-soap-value', function(e) {
      if (e.keyCode == 13 && $(this).val().length > 0) {
        $(this).next().append('<li>'+$(this).val()+'</li>');
        $(this).val('');
      }
    });

    $("#patient_charting_template_parent").on("focusout","#new_charting_template_name_by_text",function(){
      if($("#dc_charting_flag").val() == "New"){
        if($(this).val().trim().length > 0){
          if($("#add-new-field-parent").css("display") == "none"){
            $.couch.db(db).view("tamsa/getChartingTemplateSpecialization", {
              success: function(data) {
                if(data.rows.length > 0){
                  existingFieldsFromSpecialization($(this).val().trim());
                }else{
                  getFieldsFromSpecialization();
                }
              },
              error: function(data,error,reason) {
                newAlert('danger', "NS device id can not be blank.");
                $('html, body').animate({scrollTop: 0}, 'slow');
              },
              key: $(this).val().trim(),
              limit: 5,
              reduce:true,
              group:true
            });
          }
        }else{
          $(".charting_template_field_table .maintbody").html("");
          $("#add-new-field-parent").hide();
        }
      }else{

      }
    });

    $("#patient_charting_template_parent").on("click",".statistic_view",function(){
      getVitalSignGraphs($(this));
    });

    $("#patient_charting_template_parent").on("click",".charting_view",function(){
      getVitalSignMoreDetails($(this));
    });

    $("#patient_charting_template_parent").on("click",".summary-stop",function(){
      stopPatientCarePlan($(this).attr('doc_id'));
    });  

    $("#patient_charting_template_parent").on("click",".charting_medicalinfo_div",function(){
      getChartingMedicalInfoModel($(this));
    });

    $("#patient_charting_template_parent").on("click","#add_new_allergies_charting",function(){
      addNewAllergies($(this).attr("text"));
    });

    $("#add_padf_modal").on("click","#add_new_allergiess",function(){
        addNewAllergiesModel();
      });

    $("#add_padf_modal").on("click","#remove_new_allergiess",function(){
      $(this).parent().remove();
    });

    $("#add_padf_modal").on("click","#add_padf",function(){
      addPadf($("#add_padf").attr("operation"),"charting_view");
      getPastAllegies("charting_current_allergies_list");
    });

    $("#patient_charting_template_parent").on("click",".section_link",function() {
      displaySelectedChartingSections($(this));
    });

    $("#patient_charting_template_parent").on("click",".showmedication",function(){
      showhideMedication();
    });
    
    $("#patient_charting_template_parent").on("click","#show_vitals",function(){
      showhideVitalsTable();
    });

    $("#patient_charting_template_parent").on("click",".showlaborder",function(){
      showhideLaborder();
    });
    $("#patient_charting_template_parent").on("click",".showmedicalinfo",function(){
      showhideMedicalinfo();
    });

    $("#patient_charting_template_parent").on("click",".show_referred_info",function(){
      showhideReferredInfo();
    });
    
    $("#patient_charting_template_parent").on("click",".txt-recent-value",function(){
      DisplayRecentValuesForChartingTemplateFields($(this));
    });

    $("#patient_charting_template_parent").on("click","#dc_copy",function(){
      $state.go("patient_charting_templates",{user_id:userinfo.user_id,template_id:$(this).attr('index'),template_state:"build"});
      // copyDCChartingTemplate($(this).attr("index"));
    });

    $("#patient_charting_template_parent").on("click","#dc_publish",function(){
      publishChartingTemplate($(this).attr("index"));
    });

    $("#patient_charting_template_parent").on("click",".edit-existing-field",function(){
      var $elem = $(this).parent().parent();
      if($elem.find(".default-placeholder").length > 0){
        newAlert('danger','Please drag and drop Field name and response before editing them.');
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        addChartingTemplateField();
        $("#save_charting_response_field").attr("count",$(this).attr("count"));
        $("#ctemplate-fieldname").val($elem.find(".form-field-name li").html());
        var erlength = $elem.find(".responsedivs").length;
        var temp_array = [];
        var tempres,tempfrmt;
        $elem.find(".responsedivs").each(function(){
          tempres  = $(this).attr("response_type");
          tempfrmt = generateFormatArray(tempres,$(this));

          temp_array.push({
            response: tempres,
            format:   tempfrmt
          });

        });

        for(var i=0;i<erlength -1;i++ ){
          generateChartingResponseCombobox();
        }
        updateValueForEditingChartingTemplateFieldResponse(temp_array);      
      }
    });

    $("#patient_charting_template_parent").on("click","#click_toggle",function(){
      if($("#clk_toggle_lbl").html() == "Specialization"){
        $("#search_and_display_care_plan_list").show();
        $("#existing_charting_template_list").hide().val("");
        $("#clk_toggle_lbl").html("Template name");
      }else{
        $("#search_and_display_care_plan_list").hide();
        $("#existing_charting_template_list").show().val("");
        $("#clk_toggle_lbl").html("Specialization");
      }
    });

    $("#patient_charting_template_parent").on("click","#click_toggle_first",function(){
      if($("#clk_toggle_lbl_first").html() == "to add new"){
        $("#new_charting_specialization_name").hide();
        $("#new_charting_template_name_by_text").show().val();
        $("#clk_toggle_lbl_first").html("select form list");
      }else{
        $("#new_charting_specialization_name").show();
        $("#new_charting_template_name_by_text").hide().val();
        $("#clk_toggle_lbl_first").html("to add new");
      }
    });

    $("#patient_charting_template_parent").on("change","#new_charting_specialization_name" ,function(){
      getFieldsFromSpecializationMultiselect($(this).val());
    });
  }

  function displaySelectedChartingSections($obj) {
    $(".recent-values-table").remove();
    $(".txt-recent-value").html("Show Recent Value");
    $(".section_link").removeClass("theme-background");
    $obj.addClass("theme-background");
    // var selected_section_name = $obj.text().trim();
    $("#charting_template_activity_list").animate({scrollTop: $obj.data("scrollval")}, 'slow');
    // var offset_top = Number(($("#charting_template_activity_list").offset().top).toFixed());
    // var section_top = Number(($("#charting_template_activity_list").find(".ctemplate-display-section-name[current_section='"+selected_section_name+"']").closest(".ctemplate-display-sectionlist").offset().top).toFixed());

    // // var section_top = Number(($("#charting_template_activity_list").find(".ctemplate-display-section-name[current_section='"+selected_section_name+"']").closest(".ctemplate-display-sectionlist").offset().top).toFixed());

    // console.log(offset_top);
    // console.log(section_top);
    // if(section_top >= offset_top) {
    //   var scrollval = section_top - offset_top;
    // }else {
    //   var scrollval = section_top  + (offset_top - section_top)
    // }
    // console.log(scrollval);
    // $("#charting_template_activity_list").animate({scrollTop: scrollval}, 'slow');
    if(userinfo.user_id) $(".txt-recent-value").show();
    else $(".txt-recent-value").hide()
    //todo
    // if(selected_section_name == "Chief Complaint"){
    //   $("#charting_template_common_activity_list, #soapnote_chief_complaint_parent").show();
    //   $("#charting_template_activity_list, #soapnote_history_of_present_illness_parent, #soapnote_pmh_parent, #soapnote_fmh_parent").hide();
    //   $("#charting_template_common_activity_list").find(".common-display-section-name").html(selected_section_name);
    // }else if(selected_section_name == "History of Presenting Illness"){
    //   $("#charting_template_common_activity_list, #soapnote_history_of_present_illness_parent").show();
    //   $("#charting_template_activity_list, #soapnote_pmh_parent, #soapnote_fmh_parent").hide();
    //   $("#charting_template_common_activity_list").find(".common-display-section-name").html(selected_section_name);
    // }else if(selected_section_name == "Past Medical History"){
    //   $("#charting_template_common_activity_list, #soapnote_pmh_parent").show();
    //   $("#charting_template_activity_list, #soapnote_history_of_present_illness_parent, #soapnote_fmh_parent").hide();
    //   getProcedureList("soapnote_pmh_procedure");
    //   getConditionList("soapnote_pmh_condition");
    //   getPastMedicationHistory("soapnote_pmh_medication");
    //   getPastAllegies("charting_current_allergies_list");
    //   $("#charting_template_common_activity_list").find(".common-display-section-name").html(selected_section_name);
    // }else if(selected_section_name == "Family Medical History"){
    //   $("#charting_template_common_activity_list, #soapnote_fmh_parent").show();
    //   $("#charting_template_activity_list, #soapnote_history_of_present_illness_parent, #soapnote_pmh_parent").hide();
    //   $("#charting_template_common_activity_list").find(".common-display-section-name").html(selected_section_name);
    //   getPastFamilyMedicalHistory("soapnote_fmh_parent","soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition","add-more-fmh-in-soapnote");
    // }else{
    //   if(userinfo.user_id) $(".txt-recent-value").show()
    //   else $(".txt-recent-value").hide()
    //   $("#charting_template_activity_list").show();
    //   $("#charting_template_common_activity_list").hide();
    //   $('.ctemplate-display-section-name').each(function(){
    //     if($(this).attr('current_section') == selected_section_name) {
    //       $(this).parent().parent().show();
    //     }else {
    //       $(this).parent().parent().hide();
    //     }
    //   });
    // }
  }

  function chartingTemplateAutocompleter(){
    getAllExistingSpecializationList("search_practise_specialization");
    getAllExistingSpecializationList("search_community_specialization");
      $("#search_charting_template_tab").on("change" , "#search_community_specialization" , function(){
      if($(this).val() == "Select Specialization"){
        chooseCommunityChartingTemplateList();
      }else{
        chartingTemplateListFromSpecialzation("all_community_charting_templates","Yes",$(this).val());
      }  
    });

    $("#search_charting_template_tab").on("change" , "#search_practise_specialization" , function(){
      if($(this).val() == "Select Specialization"){
        chooseChartingTemplateList();
      }else{
        chartingTemplateListFromSpecialzation("all_practise_charting_templates","No",$(this).val());
      }  
    });
    $("#build_charting_template").on("change","#search_and_display_care_plan_list", function(){
      if($(this).val() == "Select Specialization")  {
      }else{
        existingSpecializationSearch($(this).val());
      }
    });


    // $("#search_practise_specialization").autocomplete({
    //  search: function(event, ui) { 
    //     $(this).addClass('myloader');
    //  },
    //  source: function( request, response ) {
    //    $.couch.db(db).view("tamsa/getTemplatesFromSpecialization", {
    //      success: function(data) {
    //        $("#search_practise_specialization").removeClass('myloader');
    //        response(data.rows);
    //      },
    //      error:function(data,error,reason){
    //        newAlert("danger",reason);
    //        $("html, body").animate({scrollTop: 0}, 'slow');
    //        return false;
    //      },
    //      startkey: [pd_data.dhp_code,"No",request.term],
    //      endkey:   [pd_data.dhp_code,"No",request.term + "\u9999"],
    //      reduce:   true,
    //      group:    true
    //    });
    //  },
    //  minLength: 1,
    //  focus: function(event, ui) {
    //    return false;
    //  },
    //  select: function( event, ui ) {
    //    $(this).val(ui.item.key[2]);
    //    chartingTemplateListFromSpecialzation("all_practise_charting_templates","No",ui.item.key[2]);
    //    return false;
    //  },
    //  response: function(event, ui) {
    //    if (!ui.content.length) {
    //      var noResult = { key:['','No results found'],label:"No results found" };
    //      ui.content.push(noResult);
    //      //$("#message").text("No results found");
    //    }
    //  },
    //  open: function() {
    //      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    //  },
    //  close: function() {
    //      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    //  }
    // }).
    // data("uiAutocomplete")._renderItem = function(ul, item) {
    //  return $("<li></li>")
    //    .data("item.autocomplete", item)
    //    .append("<a>" + item.key[2] + "</a>")
    //    .appendTo(ul);
    // };

    $("#search_practise_charting_template").autocomplete({
     search: function(event, ui) { 
        $(this).addClass('myloader');
     },
     source: function( request, response ) {
       $.couch.db(db).view("tamsa/getChartingTemplates", {
         success: function(data) {
           $("#search_practise_charting_template").removeClass('myloader');
           response(data.rows);
         },
         error: function(status) {
             console.log(status);
         },
         startkey:     [pd_data.dhp_code,"No",request.term],
         endkey:       [pd_data.dhp_code,"No",request.term + "\u9999"],
         limit:        5,
         include_docs: true
       });
     },
     minLength: 1,
     focus: function(event, ui) {
       return false;
     },
     select: function( event, ui ) {
       $(this).val(ui.item.doc.template_name);
       displayChartingTemplate(ui.item.id,tamsaFactories,ui.item.doc.template_name,ui.item.doc.specialization);
       return false;
     },
     response: function(event, ui) {
       if (!ui.content.length) {
         var noResult = { doc:{template_name: 'No results found'},label:"No results found" };
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
       .append("<a>" + item.doc.template_name + "</a>")
       .appendTo(ul);
    };

    $("#search_community_charting_template").autocomplete({
      search: function(event, ui) { 
        $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/getCommunityChartingTemplates", {
          success: function(data) {
            $("#search_community_charting_template").removeClass('myloader');
            response(data.rows);
          },
          error: function(status) {
            console.log(status);
          },
          startkey: [request.term],
          endkey: [request.term + "\u9999",{}],
          limit: 5,
          include_docs:true
        });
      },
      minLength: 3,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        $(this).val(ui.item.doc.template_name);
        displayChartingTemplate(ui.item.id,tamsaFactories);
        return false;
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { doc:{template_name: 'No results found'},label:"No results found" };
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
        .append("<a>" + item.doc.template_name + "</a>")
        .appendTo(ul);
    };

    // $("#search_community_specialization").autocomplete({
    //   search: function(event, ui) { 
    //      $(this).addClass('myloader');
    //   },
    //   source: function( request, response ) {
    //     $.couch.db(db).view("tamsa/getCommunityTemplatesFromSpecialization", {
    //       success: function(data) {
    //         $("#search_community_specialization").removeClass('myloader');
    //         response(data.rows);
    //       },
    //       error:function(data,error,reason){
    //         newAlert("danger",reason);
    //         $("html, body").animate({scrollTop: 0}, 'slow');
    //         return false;
    //       },
    //       startkey: ["Yes",request.term],
    //       endkey:   ["Yes",request.term + "\u9999"],
    //       reduce:   true,
    //       group:    true
    //     });
    //   },
    //   minLength: 1,
    //   focus: function(event, ui) {
    //     return false;
    //   },
    //   select: function( event, ui ) {
    //     $(this).val(ui.item.key[1]);
    //     chartingTemplateListFromSpecialzation("all_community_charting_templates","Yes",ui.item.key[1]);
    //     return false;
    //   },
    //   response: function(event, ui) {
    //     if (!ui.content.length) {
    //       var noResult = { key:['','No results found'],label:"No results found" };
    //       ui.content.push(noResult);
    //       //$("#message").text("No results found");
    //     }
    //   },
    //   open: function() {
    //       $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    //   },
    //   close: function() {
    //       $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    //   }
    // }).
    // data("uiAutocomplete")._renderItem = function(ul, item) {
    //   return $("<li></li>")
    //     .data("item.autocomplete", item)
    //     .append("<a>" + item.key[1] + "</a>")
    //     .appendTo(ul);
    // };

    $("#existing_specialization_list").autocomplete({
      search: function(event, ui) { 
         $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/getExistingSpecialization", {
          success: function(data) {
              $("#existing_specialization_list").removeClass('myloader');
              response(data.rows);
          },
          error: function(status) {
              console.log(status);
          },
           startkey: [pd_data._id,request.term],
           endkey: [pd_data._id,request.term + "\u9999",{}],
           reduce:true,
           group:true
        });
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { key:['','No results found',''],label:"No results found" };
          ui.content.push(noResult);
        }
      },
      minLength: 3,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        if(ui.item.key[1] == "No results found"){
          $(this).val("");
          $('#charting_template_current_list tbody').html('');
        }else{
          existingSpecializationSearch(ui.item.key[1]);
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
        .append("<a><h5>" + item.key[1]+"</a>")
        .appendTo(ul);
    };

    $("#existing_charting_template_list").autocomplete({
      search: function(event, ui) { 
         $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/getExistingChartingTemplates", {
          success: function(data) {
              $("#existing_charting_template_list").removeClass('myloader');
              response(data.rows);
          },
          error: function(status) {
              console.log(status);
          },
           startkey: [pd_data._id,request.term],
           endkey: [pd_data._id,request.term + "\u9999",{}],
           limit: 5,
           include_docs:true
        });
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { doc:{template_name: 'No results found'},label:"No results found" };
          ui.content.push(noResult);
        }
      },
      minLength: 3,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        if(ui.item.doc.template_name == "No results found"){
          $(this).val("");
          $('#charting_template_current_list tbody').html('');
        }else{
          existingChartingTemplateSearch(ui.item.id);  
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
        .append("<a><h5>" + item.doc.template_name+"<small class = 'rght-float'>"+item.doc.specialization+"</small></h5></a>")
        .appendTo(ul);
    };

    // $("#new_charting_specialization_name").autocomplete({
    //   search: function(event, ui) { 
    //     $(this).addClass('myloader');
    //   },
    //   source: function( request, response ) {
    //     $.couch.db(db).view("tamsa/getChartingTemplateSpecialization", {
    //       success: function(data) {
    //           $("#new_charting_specialization_name").removeClass('myloader');
    //           response(data.rows);
    //       },
    //       error: function(status) {
    //           console.log(status);
    //       },
    //        startkey: request.term.trim(),
    //        endkey: request.term.trim() + "\u9999",
    //        limit: 5,
    //        reduce:true,
    //        group:true
    //     });
    //   },
    //   response: function(event, ui) {
    //     if (!ui.content.length) {
    //       var noResult = { key:'Add as a new specialization',label:"Add as a new specialization" };
    //       ui.content.push(noResult);
    //     }
    //   },
    //   minLength: 3,
    //   autoFocus:true,
    //   focus: function(event, ui) {
    //     return false;
    //   },
    //   select: function( event, ui ) {
    //     if($("#dc_charting_flag").val() == "New"){
    //       if(ui.item.key == "Add as a new specialization"){
    //         getFieldsFromSpecialization();
    //       }else{
    //         $(this).val(ui.item.key);
    //         existingFieldsFromSpecialization(ui.item.key);
    //       }  
    //     }else{
    //       if(ui.item.key != "Add as a new specialization"){
    //         $(this).val(ui.item.key);
    //       }
          
    //     }
    //     return false;
    //   },
    //   open: function() {
    //       $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    //   },
    //   close: function() {
    //       $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    //   }
    // }).
    // data("uiAutocomplete")._renderItem = function(ul, item) {
    //   return $("<li></li>")
    //     .data("item.autocomplete", item)
    //     .append("<a>" + item.key + "</a>")
    //     .appendTo(ul);
    // };
  }

  function saveImageChanges($obj,event_type){
    // var imageurl  = drawingCanvas.toDataURL("image/png");
    saveDrawingSurface();
    var image_details = {
      "image_name":  $obj.parent().parent().find(".canvas_images").find("option:selected").text(),
      "image_width": $obj.parent().parent().find(".canvas_images").find("option:selected").data("width"),
      "image_height": $obj.parent().parent().find(".canvas_images").find("option:selected").data("height"),
      "image_data":  drawingSurfaceImageData
    }
    var section_field = $("#charting_section_selection").find(".section_link").filter(".selected_section").text() + "|" + $obj.closest(".ctemplate-display-fieldlist").find(".ctemplate-display-fieldname").text();
    $("#charting_section_selection").data(section_field,image_details);
    if(event_type == "button") newAlert("success","Image saved Successfully.");
  }

  function clearAddNewMarkerModal() {
    $("#new_marker_name").val("");
    $("#new_marker_image").val("Select Image");
    $("#new_marker_mouser").val("Select Mouser");
  }

  function saveChartingTemplateForPatient($obj,print_value){
    tamsaFactories.blockScreen("Please wait...");
    $("#save_patient_charting_template, #partial_save_patient_charting_template").attr("disabled","disabled");
    $.couch.db(db).openDoc($obj.attr("doc_id"), {
      success:function(data) {
        var d               = new Date();
        var vital_active    = data.vital_signs_active;
        var patient_charting_template_doc = {
          doctor_id:                  pd_data._id,
          dhp_code:                   pd_data.dhp_code,
          practice_code:              pd_data.random_code,
          doctor_name:                pd_data.first_name+" "+pd_data.last_name,
          template_name:              data.template_name,
          doctype:                    "patient_charting_template",
          update_ts:                  d,
          publish:                    data.publish,
          specialization:             data.specialization,
          user_id:                    userinfo.user_id,
          visit_type:                 $("#ct_visit_type").val(),
          // chief_complaint:            $("#soapnote_chief_complaint").val().trim(),
          history_of_present_illness: $("#soapnote_history_of_present_illness").val().trim(),
          patient_first_name:         userinfo.first_nm, 
          patient_last_name:          userinfo.last_nm
        };
        
        if($obj.attr("id") == "partial_save_patient_charting_template"){
          patient_charting_template_doc.sections           = cTemplatePartialSaveFieldArray($("#choose_charting_template_list"));
          patient_charting_template_doc.finalize           = "No";
          patient_charting_template_doc.vital_signs_active = data.vital_signs_active || false;
          patient_charting_template_doc.visit_type_active  = data.visit_type_active || false;

          if(vital_active == "Yes" && ($("#ct_Fasting_Glucose").val() || $("#ct_heartrate").val() || $("#ct_O2").val() || $("#ct_temp").val() || $("#ct_respiration_rate").val() || $("#ct_diastolic_bp").val() || $("#ct_systolic_bp").val() || $("#ct_bmi_weight").val() || $("#ct_bmi_height").val() || $("#ct_waist").val())) {
            patient_charting_template_doc.vital_sings_data = {
              systolic_bp:      $("#ct_systolic_bp").val() ? $("#ct_systolic_bp").val() : "" ,
              diastolic_bp:     $("#ct_diastolic_bp").val() ? $("#ct_diastolic_bp").val() : "",
              heart_rate:       $("#ct_heartrate").val() ? $("#ct_heartrate").val() : "",
              fasting_glucose:  $("#ct_Fasting_Glucose").val() ? $("#ct_Fasting_Glucose").val() : "",
              o2:               $("#ct_O2").val() ? $("#ct_O2").val() : "",
              normal_condition: $("#ct_OutOfRange").val() ? $("#ct_OutOfRange").val() : "No",
              temprature:       $("#ct_temp").val() ? $("#ct_temp").val() : "",
              respiration:      $("#ct_respiration_rate").val() ? $("#ct_respiration_rate").val() : "",
              value_weight:     $("#ct_bmi_weight").val() ? $("#ct_bmi_weight").val() : "",
              height:           $("#ct_bmi_height").val() ? $("#ct_bmi_height").val() : "",
              waist:            $("#ct_waist").val() ? $("#ct_waist").val() : ""
            }
          }
          patient_charting_template_doc._id      = $("#partial_save_patient_charting_template").data("index");
          patient_charting_template_doc._rev     = $("#partial_save_patient_charting_template").data("rev");
        }else{
          patient_charting_template_doc.finalize = "Yes";
          patient_charting_template_doc._id      = $obj.data("index");
          patient_charting_template_doc._rev     = $obj.data("rev");
          patient_charting_template_doc.sections = cTemplateSaveFieldArray($("#choose_charting_template_list"));
        }
        
        if(vital_active == "Yes"){
          var selfcare_doc = {
            Fasting_Glucose:    $("#ct_Fasting_Glucose").val(),
            HeartRate:          $("#ct_heartrate").val(),
            O2:                 $("#ct_O2").val(),
            OutOfRange:         $("#ct_OutOfRange").val(),
            Respiration_Rate:   $("#ct_respiration_rate").val(),
            Time_BP:            "Time",
            Time_Fasting:       "Time",
            Time_HeartRate:     "Time",
            Time_Oxygen:        "Time",
            Time_Respiration:   "Time",
            Time_Weight:        "Time",
            Value_Diastolic_BP: $("#ct_diastolic_bp").val(),
            Value_Systolic_BP:  $("#ct_systolic_bp").val(),
            Value_MAP:          calculateMAP(Number($("#ct_systolic_bp").val()),Number($("#ct_diastolic_bp").val())),
            Value_temp:         $("#ct_temp").val(),
            // Value_weight:    $("#ct_Value_weight").val(),
            Value_weight:       $("#ct_bmi_weight").val(),
            height:             $("#ct_bmi_height").val(),
            bmi:                $("#ct_bmi_value").val(),
            waist:              $("#ct_waist").val(),
            doctype:            "SelfCare",
            insert_ts:          d,
            insert_ts_int:      "",
            user_id:            userinfo.user_id
          };
        }
        
        if(vital_active == "Yes" && patient_charting_template_doc.finalize == "Yes" && ($("#ct_Fasting_Glucose").val() || $("#ct_heartrate").val() || $("#ct_O2").val() || $("#ct_temp").val() || $("#ct_respiration_rate").val() || $("#ct_diastolic_bp").val() || $("#ct_systolic_bp").val() || $("#ct_bmi_weight").val() || $("#ct_bmi_height").val() || $("#ct_waist").val())) {
          patient_charting_template_doc.saved_vital_data = selfcare_doc;
          if($("#save_patient_charting_template").data("meddata")) {
            patient_charting_template_doc.saved_medication_data = $("#save_patient_charting_template").data("meddata");
            patient_charting_template_doc.added_medications_list = $("#save_patient_charting_template").data("meddata_ids");
          }
        }else {
          if($("#save_patient_charting_template").data("meddata")) {
              patient_charting_template_doc.saved_medication_data = $("#save_patient_charting_template").data("meddata");
              patient_charting_template_doc.added_medications_list = $("#save_patient_charting_template").data("meddata_ids");
          }
        }

        if($("#charting_referred_info").css("display") != "none" && $("#charting_referred_info").attr("refer_doc_id")){
          if($("#referred_doctor_notes").val() != ""){
            patient_charting_template_doc.referral_note = $("#referred_doctor_notes").val();
          }
        }

        if(patient_charting_template_doc.finalize == "Yes") {
          $.couch.db(db).saveDoc(patient_charting_template_doc,{
            success: function(chartdata){
              if(patient_charting_template_doc.added_medications_list) updateMedicationWithChartNote(patient_charting_template_doc.added_medications_list,chartdata.id)
                // $("#save_and_print_chart_temp").modal("hide");
                // if(print_value == 'print'){
                //   printPatientChartingTemplate($obj);
                // }
              removePartiallySavedChartingTemplate(patient_charting_template_doc);
              saveNSMonitoring("charting_ns_monitor");
              tamsaFactories.makePatientCritical($("#charting_critical_checkbox").is(':checked'),"charting_critical_checkbox",userinfo.user_id,pd_data._id,userinfo.patient_dhp_id); 
              if(vital_active == "Yes" && ($("#ct_Fasting_Glucose").val() || $("#ct_heartrate").val() || $("#ct_O2").val() || $("#ct_temp").val() || $("#ct_respiration_rate").val() || $("#ct_diastolic_bp").val() || $("#ct_systolic_bp").val() || $("#ct_bmi_weight").val() || $("#ct_bmi_height").val() || $("#ct_waist").val())) {
                $.couch.db(db).saveDoc(selfcare_doc, {
                  success: function(selfcare_data) {
                    $.couch.db(db).view("tamsa/testPatientsInfo",{
                      success:function(data){
                        if(data.rows.length == 1){
                          var newdata = data.rows[0].value;
                          if($("#ct_bmi_height").val().trim()){newdata.height = $("#ct_bmi_height").val();}
                          if($("#ct_bmi_weight").val().trim()){newdata.weight = $("#ct_bmi_weight").val();}
                          if($("#ct_waist").val().trim()){newdata.waist = $("#ct_waist").val();}
                          if($("#soapnote_pmh_procedure").val() != null) newdata.Procedure = $("#soapnote_pmh_procedure").val();
                          // if($("#soapnote_pmh_medication").val().trim() != "") newdata.Medication.push($("#soapnote_pmh_medication").val().trim());
                          if($("#soapnote_pmh_condition").val() != null) newdata.Condition = $("#soapnote_pmh_condition").val();
                          // if($("#soapnote_pmh_allergies").val().trim() != "") newdata.Allergies.push($("#soapnote_pmh_allergies").val().trim())

                          if(verifyFMHAtChartingTemplate("soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition") && validateFamilyMedicalHistory("soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition","chart")) {
                            tamsaFactories.saveRequestForFMH("","soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition");
                          }

                          $.couch.db(db).saveDoc(newdata,{
                            success:function(data){
                              saveBiometricsAndMedicalHistory(data);
                              if($("#ct_bmi_value").val() && $("#ct_bmi_value").val() > 0){
                                $("#mh_BMI").html($("#ct_bmi_value").val());
                              }
                              newAlert('success', 'Charting Template added successfully!');
                              $('html, body').animate({scrollTop: 0}, 'slow');
                              $("#back_to_choose_charting_template").trigger("click");
                              clearChartingTemplatesVitalSings();
                            },
                            error:function(data,error,reason){
                              newAlert('danger', reason);
                              $('html, body').animate({scrollTop: 0}, 'slow');
                              $("#back_to_choose_charting_template").trigger("click");
                              clearChartingTemplatesVitalSings();
                            }
                          });
                        }else{
                          //To Do :: remove. this part will never execute as we have user id is unique validation
                          newAlert('danger', 'multiple users found with given id.');
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          $("#back_to_choose_charting_template").trigger("click");
                          clearChartingTemplatesVitalSings();
                          return false;
                        }
                        $("#search_practise_charting_template, #search_community_charting_template").val("");
                        tamsaFactories.unblockScreen();
                      },
                      error:function(data,error,reason){
                        newAlert("danger",reason);
                        $("html, body").animate({scrollTop: 0}, 'slow');
                        return false;
                      },
                      key:userinfo.user_id
                    });
                  },
                  error: function(data,status,reason) {
                    $("#save_patient_charting_template, #partial_save_patient_charting_template").removeAttr("disabled");
                    newAlert('danger',reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  }
                });
              }
              else {
                $.couch.db(db).view("tamsa/testPatientsInfo",{
                  success:function(data){
                    if(data.rows.length == 1){
                      var newdata = data.rows[0].value;
                      if($("#ct_bmi_height").val().trim()){newdata.height = $("#ct_bmi_height").val();}
                      if($("#ct_bmi_weight").val().trim()){newdata.weight = $("#ct_bmi_weight").val();}
                      if($("#ct_waist").val().trim()){newdata.waist = $("#ct_waist").val();}
                      if($("#soapnote_pmh_procedure").val() != null) newdata.Procedure = $("#soapnote_pmh_procedure").val();
                      // if($("#soapnote_pmh_medication").val().trim() != "") newdata.Medication.push($("#soapnote_pmh_medication").val().trim())
                      if($("#soapnote_pmh_condition").val() != null) newdata.Condition = $("#soapnote_pmh_condition").val();
                      // if($("#soapnote_pmh_allergies").val().trim() != "") newdata.Allergies.push($("#soapnote_pmh_allergies").val().trim())
                      
                      if(verifyFMHAtChartingTemplate("soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition") && validateFamilyMedicalHistory("soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition","chart")) {
                        tamsaFactories.saveRequestForFMH("","soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition");
                      }

                      $.couch.db(db).saveDoc(newdata,{
                        success:function(data){
                          saveBiometricsAndMedicalHistory(data);
                          if($("#ct_bmi_value").val() && $("#ct_bmi_value").val() > 0){
                            $("#mh_BMI").html($("#ct_bmi_value").val());
                          }
                          newAlert('success', 'Charting Template added successfully!');
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          $("#back_to_choose_charting_template").trigger("click");
                          clearChartingTemplatesVitalSings();
                        },
                        error:function(data,error,reason){
                          newAlert('danger', reason);
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          $("#back_to_choose_charting_template").trigger("click");
                          clearChartingTemplatesVitalSings();
                        }
                      });
                    }else{
                      //To Do :: remove. this part will never execute as we have user id unique validation
                      newAlert('danger', 'multiple users found with given id.');
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      $("#back_to_choose_charting_template").trigger("click");
                      clearChartingTemplatesVitalSings();
                      return false;
                    }
                    $("#search_practise_charting_template, #search_community_charting_template").val("");
                    tamsaFactories.unblockScreen();
                  },
                  error:function(data,error,reason){
                    console.log(reason);
                  },
                  key: userinfo.user_id
                });
              }
              $("#save_patient_charting_template, #partial_save_patient_charting_template").removeAttr("disabled");
              saveAuditRecord("Charting","Insert","Charting Successfully assign to Patient.");
              tamsaFactories.unblockScreen();
            },
            error:function(data,error,reason){
              $("#save_patient_charting_template, #partial_save_patient_charting_template").removeAttr("disabled");
              newAlert('danger',error);
              $('html, body').animate({scrollTop: 0}, 'slow');
              saveAuditRecord("Charting","Insert","Error While assigning Charting to Patient.");
              return false;
            }
          });
        }else if (patient_charting_template_doc.finalize == "No"){
          $.couch.db(db).saveDoc(patient_charting_template_doc,{
            success:function(partdata) {
              $("#save_patient_charting_template, #partial_save_patient_charting_template").removeAttr("disabled");
              newAlert("success","Charting Template is partially Saved.");
              $("html, body").animate({scrollTop: 0}, 'slow');
              $("#back_to_choose_charting_template").trigger("click");
              tamsaFactories.unblockScreen();
              return false;
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          });
        }else {
          tamsaFactories.unblockScreen();
          console.log("save is not pressed.");  
        }
        if($("#charting_referred_info").css("display") != "none" && $("#charting_referred_info").attr("refer_doc_id")){
          if($("#referred_doctor_notes").val() != ""){
            var refer_doc = $("#charting_referred_info").attr("refer_doc_id");
            $.couch.db(db).openDoc(refer_doc,{
              success:function(data_refer){
                data_refer.referral_note = $("#referred_doctor_notes").val();
                $.couch.db(db).saveDoc(data_refer,{
                  success:function(data){
                    console.log(data);
                    tamsaFactories.unblockScreen();
                  },
                  error:function(data){
                    console.log(data);
                  }
                }); 
              },
              error:function(data){
                console.log(data);
              }
            });
          }
        }
      },
      error:function(data,error,reason){
        $("#save_patient_charting_template, #partial_save_patient_charting_template").removeAttr("disabled");
        newAlert('danger',error);
        $('html, body').animate({scrollTop: 0}, 'slow');
        saveAuditRecord("Charting","Insert","Error While assigning Charting to Patient.");
        return false;
      }
    });
  }

  function toggleAlertList($obj) {
    if($obj.closest(".alert_name_parent").find(".alert_name").html() == "Immunization Alerts") {
      if($obj.hasClass("glyphicon-plus-sign")) {
        $("#immmunization_alerts").show();
        $obj.addClass("glyphicon-minus-sign");
        $obj.removeClass("glyphicon-plus-sign");
      }else {
        $("#immmunization_alerts").hide();
        $obj.addClass("glyphicon-plus-sign");
        $obj.removeClass("glyphicon-minus-sign");
      }
    }else if($obj.closest(".alert_name_parent").find(".alert_name").html() == "Screening Alerts") {
      if($obj.hasClass("glyphicon-plus-sign")) {
        $("#screening_alerts").show();
        $obj.addClass("glyphicon-minus-sign");
        $obj.removeClass("glyphicon-plus-sign");
      }else {
        $("#screening_alerts").hide();
        $obj.addClass("glyphicon-plus-sign");
        $obj.removeClass("glyphicon-minus-sign");
      }
    }else {
      console.log("in else");
    }
  }

});

function getPastAllegies(id){
  if(userinfo_medical && userinfo_medical.Allergies){
    var allg = [];
    if(userinfo_medical.Allergies.String){
      $("#"+id+" tbody").html(userinfo_medical.Allergies);  
    }else{
      var data = {"rows":userinfo_medical.Allergies};
      paginationConfiguration(data,"charting_current_allergies_list_pagination",5,displayPastAllegies);
    }
  }else{
    $("#"+id).html("No allgies found");
  }
}

function displayPastAllegies(start,end,data){
  $("#charting_current_allergies_list tbody").html('');
  for(var i=start;i<end;i++){
    getPastAllegiesArray(data.rows[i]);
  }
}

function getPastAllegiesArray(element){
  var allg = [];
  var arry =element.split(",");
    allg.push("<tr><td>"+arry[0]+"</td><td>"+(arry[1] ? arry[1] : "N/A")+"</td><td>"+(arry[2] ? arry[2] : "N/A")+"</td></tr>");
    $("#charting_current_allergies_list tbody").append(allg.join(''));
}

function getPastMedicationHistory(id){
  $.couch.db(db).view("tamsa/getPatientMedications", {
    success: function(data) {
      var past_medication = "";
      if(data.rows.length > 0){
        for (var i = 0; i < data.rows.length; i++) {
          if(data.rows.length == 1){
            past_medication += data.rows[i].value.drug;
          }else if((data.rows.length - 1) == i){
            past_medication += data.rows[i].value.drug;
          }else{
            past_medication += data.rows[i].value.drug+",";
          } 
        }
      }
      $('#'+id).val(past_medication);  
    },
    error: function(data,error,reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    startkey: [userinfo.user_id,0,{}],
    endkey: [userinfo.user_id,0],
    descending:true
  }); 
}

function getProcedureList(id){
  var proce = [];
  $.couch.db(db).openDoc("procedure_list",{
    success:function(data){
      if(data.procedures.length > 0){
        for (var i = 0; i < data.procedures.length; i++) {
          proce.push('<option value="'+data.procedures[i]+'">'+data.procedures[i]+'</option>');
        }
      }
      $("#soapnote_pmh_procedure").html(proce.join(''));
      $("#soapnote_pmh_procedure").multiselect({
        selectedList:6
      }).multiselectfilter({
      });
      if(userinfo_medical.Procedure){
        if(userinfo_medical.Procedure.length > 0){
          $("#soapnote_pmh_procedure").val(userinfo_medical.Procedure);
          $("#soapnote_pmh_procedure").multiselect("refresh");
        }
      }
    },
    error:function(status){
      console.log(status);
    }
  });
}

function getConditionList(id){
  var proce = [];
  $.couch.db(db).openDoc("condition_list",{
    success:function(data){
      if(data.conditions.length > 0){
        for (var i = 0; i < data.conditions.length; i++) {
          proce.push('<option value="'+data.conditions[i]+'">'+data.conditions[i]+'</option>');
        }
      }
      $("#soapnote_pmh_condition").html(proce.join(''));
      $("#soapnote_pmh_condition").multiselect({
        selectedList:6
      }).multiselectfilter({
      });
      if(userinfo_medical.Condition){
        if(userinfo_medical.Condition.length > 0){
          $("#soapnote_pmh_condition").val(userinfo_medical.Condition);
          $("#soapnote_pmh_condition").multiselect("refresh");
        }
      }
    },
    error:function(status){
      console.log(status);
    }
  });
}
