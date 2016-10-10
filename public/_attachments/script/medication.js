function stopMedication($obj,action){
  if(action == "delete") $("#careplan_stop_delete_label").text("Delete");
  else $("#careplan_stop_delete_label").text("Stop");
  createModal("delete_medication_modal");
  $("#reason_for_stop_medication").val("");
  $("#delete_medication_confirm").data("index",$obj.attr("index"));
}

function deleteMedicationMessage(){
  $("#medication_delete_message").html('<span>Delete not allowed as Its been more than a day since the medication has been created. Please use&nbsp;<span class="glyphicon glyphicon-ban-circle padding-reset" title="Stop"></span><span class="or-font">/</span><span class="glyphicon glyphicon-refresh padding-reset" title="Update"></span>&nbsp;to modify.</span>');
  createModal("delete_medication_message_modal");
}

function openDeleteMedicationModal($obj){
  $.couch.db(db).openDoc($obj.attr("index"),{
    success:function(data){
      if((data.insert_ts && moment().diff(moment(data.insert_ts),"hours") >= 24) || (data.update_ts && moment().diff(moment(data.update_ts),"hours") >= 24)){
        deleteMedicationMessage();
      }else{
        stopMedication($obj,"delete");
      }
    },
    error: function(data, error, reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  });
}

function deleteMedication() {
  if(validateStopMedication()){
    var index = $("#delete_medication_confirm").data("index");
    
    $.couch.db(db).openDoc(index, {
      success: function(data) {
        newdata = data;
        newdata.update_ts= new Date();
        newdata.reason_for_stop_medication=$("#reason_for_stop_medication").val();
        // if($("#save_medication_new").data("ispartial") == "Yes") {
        //   newdata.drug_start_date = moment().format("YYYY-MM-DD");  
        // }
        newdata.drug_stop_date = moment().format("YYYY-MM-DD");
        newdata.stop_medication_doctor_name = pd_data.first_name + " " + pd_data.last_name;
        newdata.stop_medication_doctor_id = pd_data._id;

        $.couch.db(db).saveDoc(newdata,{
          success:function(data){
            $('#delete_medication_modal').modal("hide");
            newAlert('success', 'Medication Deleted successfully !');
            $('html, body').animate({scrollTop: 0}, 'slow');
            getMedicationOnPatientDashboard();
            getMedications();
          },
          error:function(data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
          }
        });
      },
      error: function(data, error, reason) {
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    });
  }else{
    return false;
  }
}

function getMedications() {
  $("#current_medication_parent").addClass("active");
  $('#current_medications_list tbody').html('');
  if(userinfo.user_id){
    getMedicationDetails("current_medications_list", "past_medications_list", "current_medication_pagination",displayCurrentMedication,"past_medication_pagination",displayPastMedication);
  }else{
    $('#current_medications_list tbody,#past_medications_list tbody').html('<tr><td align="center" colspan="7">No Patient is selected.</td></tr>');
  }
}

function getMedicationDetails(current_id, past_id, cur_pagination_id,displayCurrentfunction,past_pagination_id,displayPastFunction){
  $.couch.db(db).view("tamsa/getPatientMedications", {
    success: function(data) {
      if(data.rows.length > 0) paginationConfiguration(data,cur_pagination_id,8,displayCurrentfunction)
      else  $('#'+current_id+' tbody').html('<tr><td colspan="7">No Medication Found.</td></tr>')
    },
    error: function(data,error,reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    startkey:   [userinfo.user_id,1,{}],
    endkey:     [userinfo.user_id,1],
    descending: true
  });
  
  if(past_id != "") {
    $.couch.db(db).view("tamsa/getPatientMedications", {
      success: function(data) {
        if(data.rows.length > 0) paginationConfiguration(data,past_pagination_id,8,displayPastFunction)
        else  $('#'+past_id+' tbody').html('<tr><td colspan="7">No Medication Found.</td></tr>')
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
}

function displayCurrentMedication(start,end,data){
  var medication_tbody = [];
  for (var i = start; i < end; i++) {
    if(data.rows[i].value.medications_added_from_addNewPatient == "Yes"){
      medication_tbody.push('<tr class="danger" data-new_patient_medic="Yes"><td>'+data.rows[i].value.drug+'</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td>');
    }else{
    // medication_tbody.push('<tr><td>'+data.rows[i].value.drug+'</td><td>'+data.rows[i].value.drug_strength+'</td><td>'+data.rows[i].value.drug_unit+'</td><td>'+data.rows[i].value.drug_start_date+'</td><td>'+data.rows[i].value.drug_end_date+'</td>');
    medication_tbody.push('<tr><td>'+data.rows[i].value.drug+'</td><td>'+data.rows[i].value.drug_strength+ " " +(data.rows[i].value.drug_unit).toLowerCase() +'</td><td>'+data.rows[i].value.medication_time+'</td><td>'+data.rows[i].value.drug_start_date+'</td><td>'+data.rows[i].value.drug_end_date+'</td>');
    }
    // if (data.rows[i].value.doctor_id == pd_data._id) {
    if (pd_data.level == "Doctor") {
      medication_tbody.push('<td ng-if="level == \'Doctor\'"><a title="Stop" data-toggle="tab" class="mrgright1 link stop_medication" index="'+data.rows[i].id+'"><span class="glyphicon glyphicon-ban-circle" role="button" class="dropdown-toggle"></span></a><a title="Update" data-toggle="tab" class="mrgright1 link update_medication" index="'+data.rows[i].id+'"><span class="glyphicon glyphicon-refresh" role="button" class="dropdown-toggle"></span></a><a title="Edit" data-toggle="tab" class="mrgright1 link edit_medication" index="'+data.rows[i].id+'"><span class="glyphicon glyphicon-edit" role="button" class="dropdown-toggle"></span></a><a title="Delete" data-toggle="tab" class="mrgright1 link delete_medication" index="'+data.rows[i].id+'" rev="'+data.rows[i].value._rev+'"><span class="glyphicon glyphicon-trash" role="button" class="dropdown-toggle" data-toggle="modal"></span></a>');
        // if(data.rows[i].value.medications_added_from_addNewPatient == "Yes"){ medication_tbody.push('<a title="fields are blank" data-toggle="tab" class="mrgright1 link" index="'+data.rows[i].id+'" rev="'+data.rows[i].value._rev+'"><span class="glyphicon glyphicon-info-sign" role="button" class="dropdown-toggle" data-toggle="modal"></span></a>'); }
     medication_tbody.push('</td></tr>');
    }
    else {
      medication_tbody.push('</tr>');
    }
  };
  $("#current_medications_list tbody").html(medication_tbody.join(''));
}

function displayPastMedication(start,end,data){
  var past_medication_tbody = [];
  for (var i = start; i < end; i++) {
    var stop_end_date = data.rows[i].value.drug_stop_date ? data.rows[i].value.drug_stop_date : data.rows[i].value.drug_end_date
    if(data.rows[i].value.medications_added_from_addNewPatient == "Yes"){
      past_medication_tbody.push('<tr class="danger" data-new_patient_medic="Yes"><td>'+data.rows[i].value.drug+'</td><td>N/A</td><td>N/A</td><td>N/A</td><td>'+stop_end_date+'</td>');
    }else {
      // past_medication_tbody.push('<tr><td>'+data.rows[i].value.drug+'</td><td>'+data.rows[i].value.drug_strength+'</td><td>'+data.rows[i].value.drug_unit+'</td><td>'+data.rows[i].value.drug_start_date+'</td><td>'+stop_end_date+'</td></tr>');
      past_medication_tbody.push('<tr><td>'+data.rows[i].value.drug+'</td><td>'+data.rows[i].value.drug_strength+ " " +data.rows[i].value.drug_unit+ '</td><td>'+data.rows[i].value.medication_time+'</td><td>'+data.rows[i].value.drug_start_date+'</td><td>'+stop_end_date+'</td></tr>');  
    }
  };
  $("#past_medications_list tbody").html(past_medication_tbody.join(''));
}

function generalizeSaveMedicationData(){
  var $element = $("#medication_common_form_parent");
  var d = new Date();
  
  // if($("#save_medication_new").data("prescribe_id")) {
  //   var prescribe_date = $("#save_medication_new").data("prescribe_date",data.prescription_date);
  //   var prescribe_id   = $("#save_medication_new").data("prescribe_id",data.prescription_id);
  // }else {
    var prescribe_date = moment().format("YYYY-MM-DD");
    var prescribe_id = $.couch.newUUID();
  // }

  var doc = {
    doctype:           "currentMedications",
    update_ts:         d,
    user_id:           userinfo.user_id,
    doctor_id:         pd_data._id,
    dhp_code:          pd_data.dhp_code,
    doctor_name:       pd_data.first_name+'  '+pd_data.last_name,
    Notified:          "N",
    Medication_Taken:  "N",
    prescription_date: prescribe_date,
    prescription_id:   prescribe_id
  };

  if($("#save_medication_new").data("old_medication_name")) {
    doc.current_drug_switched_from = $("#save_medication_new").data("old_medication_name");
  }else {
  }

  doc.medication_chart_note = ($element.find(".medication_chart_notes").val() != "No Chart Note" ? $element.find(".medication_chart_notes").val() : "");
  if($("#save_medication_new").data("ispartial","Yes") && $("#save_medication_new").attr("index") && $("#save_medication_new").attr("rev")) {
    doc._id = $("#save_medication_new").attr("index");
    doc._rev = $("#save_medication_new").attr("rev");
  }
  if($element.find(".pharmacy").val() != "" && $element.find(".pharmacy").val() != null) {
    doc.pharmacy              = $element.find(".pharmacy").find(":selected").text();
    var pharmacy_details      = $element.find(".pharmacy").find(":selected").text().split("--");
    doc.pharmacy_name         = pharmacy_details[0].trim();
    doc.pharmacy_phone        = pharmacy_details[1].trim();
    doc.pharmacy_doc_id       = $element.find(".pharmacy").val();
    doc.pharmacy_instructions = ($element.find(".pharmacy_instructions").val() ? $element.find(".pharmacy_instructions").val() : "");
  }
  var medication_bulk_docs = [];
  $(".medication_details_parent").each(function(){
    var medication_doc                      = {};
    medication_doc.drug                     = $(this).find(".drug").val();
    medication_doc.favorite_drug            = $(this).find(".favorite_drug").prop('checked');
    medication_doc.medication_instructions  = $(this).find(".medication_instructions").val();
    medication_doc.drug_quantity            = $(this).find(".drug_quantity").val();
    medication_doc.desperse_form            = $(this).find(".desperse_form").val();
    medication_doc.substitution             = $(this).find(".substitution").is(':checked');
    medication_doc.drug_strength            = $(this).find(".drug_strength").val();
    medication_doc.drug_unit                = $(this).find(".drug_unit").val();
    medication_doc.drug_start_date          = $(this).find(".drug_start_date").data('daterangepicker').startDate.format("YYYY-MM-DD");
    medication_doc.drug_end_date            = $(this).find(".drug_start_date").data('daterangepicker').endDate.format("YYYY-MM-DD");
    medication_doc.medication_time          = [];
    medication_doc.medication_time_quantity = [];

    if($(this).find(".medication_route").val() != "") {
      medication_doc.route = $(this).find(".medication_route").val();
    }
    if ($(this).find(".mt_morning").prop('checked')) {
      medication_doc.medication_time_quantity.push($(this).find(".morning-dose").val() ? Number($(this).find(".morning-dose").val()) : 1);
      medication_doc.medication_time.push('morning');
    }
    if ($(this).find(".mt_afternoon").prop('checked')) {
      medication_doc.medication_time_quantity.push($(this).find(".afternoon-dose").val() ? Number($(this).find(".afternoon-dose").val()) : 1);
      medication_doc.medication_time.push('afternoon');
    }
    if ($(this).find(".mt_evening").prop('checked')) {
      medication_doc.medication_time_quantity.push($(this).find(".evening-dose").val() ? Number($(this).find(".evening-dose").val()) : 1);
      medication_doc.medication_time.push('evening');
    }
    if ($(this).find(".mt_night").prop('checked')) {
      medication_doc.medication_time_quantity.push($(this).find(".night-dose").val() ? Number($(this).find(".night-dose").val()) : 1);
      medication_doc.medication_time.push('night');
    }
    if($("#save_medication_new").attr('index') && $("#save_medication_new").attr('rev')) {
      medication_doc._id       = $("#save_medication_new").attr('index');
      medication_doc._rev      = $("#save_medication_new").attr('rev');
      medication_doc.update_ts = d;
      medication_doc.insert_ts = $("#save_medication_new").data('insert_ts');
    }
    else {
      medication_doc.insert_ts = d;
    }
    medication_bulk_docs.push($.extend({},doc,medication_doc));
  });
  return medication_bulk_docs;
}

function generalizeSaveMedicationCronData(action,prescribe_id){
  var $element = $("#medication_common_form_parent");
  var cron_doc = {
    operation_case:        "9",
    processed:             "No",
    doctype:               "cronRecords",
    update_ts:             d,
    user_id:               userinfo.user_id,
    doctor_name:           pd_data.first_name+'  '+pd_data.last_name,
    doctor_id:             pd_data._id,
    prescription_id:       prescribe_id,
    prescription_date:     moment().format("YYYY-MM-DD"),
    Notified:              "N",
    Medication_Taken:      "N"
  };
  if($element.find(".pharmacy").val() != "" && $element.find(".pharmacy").val() != null) {
    cron_doc.pharmacy              = $element.find(".pharmacy").find(":selected").text();
    var pharmacy_details           = $element.find(".pharmacy").find(":selected").text().split("--");
    cron_doc.pharmacy_name         = pharmacy_details[0].trim();
    cron_doc.pharmacy_phone        = pharmacy_details[1].trim();
    cron_doc.pharmacy_doc_id       = $element.find(".pharmacy").val();
    cron_doc.pharmacy_instructions = ($element.find(".pharmacy_instructions").val() ? $element.find(".pharmacy_instructions").val() : "");
  }
  if(action != "Patient_Only") cron_doc.send_ERx_to_pharmacy = true;
  return cron_doc;
}

function getMedicationDetailsForPrint(data) {
  var medTime = {},
      morning_arr = [],
      afternoon_arr = [],
      evening_arr = [],
      night_arr = [],
      med_arr = [];
  for(var i=0;i<data.length;i++){
    med_arr.push({
      drug_name:data[i].drug,
      quantity:data[i].drug_quantity
    });
    // console.log(data[i]);
    if($.inArray("morning", data[i].medication_time ) >= 0){
      // console.log("in morning");
      // console.log(data[i].medication_time);
      morning_arr.push({
        start_date:data[i].drug_start_date,
        end_date:data[i].drug_end_date,
        drug_name:data[i].drug,
        drug_strength:data[i].drug_strength + "" + (data[i].drug_unit).toLowerCase(),
        drug_type:data[i].desperse_form,
        instruction:data[i].medication_instructions,
        route:(data[i].route ? data[i].route : "NA"),
        drug_count:data[i].medication_time.length
      });
    }
    if($.inArray("afternoon", data[i].medication_time ) >= 0){
      // console.log("in afternoon");
      // console.log(data[i].medication_time);
      afternoon_arr.push({
        start_date:data[i].drug_start_date,
        end_date:data[i].drug_end_date,
        drug_name:data[i].drug,
        drug_strength:data[i].drug_strength + "" + (data[i].drug_unit).toLowerCase(),
        drug_type:data[i].desperse_form,
        instruction:data[i].medication_instructions,
        route:(data[i].route ? data[i].route : "NA"),
        drug_count:data[i].medication_time.length
      });
    }
    if($.inArray("evening", data[i].medication_time ) >= 0){
      // console.log("in evening");
      // console.log(data[i].medication_time);
      evening_arr.push({
        start_date:data[i].drug_start_date,
        end_date:data[i].drug_end_date,
        drug_name:data[i].drug,
        drug_strength:data[i].drug_strength + "" + (data[i].drug_unit).toLowerCase(),
        drug_type:data[i].desperse_form,
        instruction:data[i].medication_instructions,
        route:(data[i].route ? data[i].route : "NA"),
        drug_count:data[i].medication_time.length
      });
    }
    if($.inArray("night", data[i].medication_time ) >= 0){
      // console.log("in night");
      // console.log(data[i].medication_time);
      night_arr.push({
        start_date:data[i].drug_start_date,
        end_date:data[i].drug_end_date,
        drug_name:data[i].drug,
        drug_strength:data[i].drug_strength + "" + (data[i].drug_unit).toLowerCase(),
        drug_type:data[i].desperse_form,
        instruction:data[i].medication_instructions,
        route:(data[i].route ? data[i].route : "NA"),
        drug_count:data[i].medication_time.length
      });
    }
  }

  medTime.morning_med   = morning_arr;
  medTime.afternoon_med = afternoon_arr;
  medTime.evening_med   = evening_arr;
  medTime.night_med     = night_arr;
  medTime.medlist       = med_arr
  console.log(medTime);
  if(data[0].pharmacy_name) {
    medTime.pharmacy_name              = data[0].pharmacy_name;
    medTime.pharmacy_phone        = data[0].pharmacy_phone;
    medTime.pharmacy_instructions = data[0].pharmacy_instructions;
  }
  return medTime;
}

function generalizeSaveMedication(doc,cron_doc,action,medication_doc,print_flag) {
  // var medication_print_data = newmedicationPrint(); 
  // printNewHtml(medication_print_data);
  // $("#save_new_medication, #save_medication_new, #save_medication_for_patient_only").removeAttr("disabled");
  // return false;
  $.unblockUI();
  // return true;
  $.couch.db(db).bulkSave({"docs":doc}, {
    success: function(bulk_saved_data) {
      console.log(bulk_saved_data);
      if(action == "Pharmacy"){
        $.couch.db(db).saveDoc(cron_doc,{
          success: function (data){
            if($("#save_medication_new").data("old_medication_index")) saveOldMedication($("#save_medication_new").data("old_medication_index"),doc[0].drug);
            if($("#save_medication_new").attr('index')){
              newAlert('success', 'Medication Updated successfully !');
              saveAuditRecord("Medication","Update","Medication updated Successfully.");
            }else{
              newAlert('success', 'Medication added successfully !');
              saveAuditRecord("Medication","Insert","Medication added Successfully.");
            }
            $('html, body').animate({scrollTop: 0}, 'slow');
            getMedicationOnPatientDashboard();
            getMedications();
            clearMedicationForm();
            printMedication(doc[0].prescription_id);
            if($("#past_history_tab_link").parent().hasClass("active")){
              backToMedicationList();
            }else{
              getMedicationDetails("charting_current_medication_list", "", "charting_current_medication_pagination",displayChartingCurrentMedication,"","");
              closeChartingMedicationModal();
              if($("#save_patient_charting_template").data("meddata") && $("#save_patient_charting_template").data("meddata").length > 0) {
                var tempmed_data = $("#save_patient_charting_template").data("meddata");
                var final_med_ids = tempmed_data.concat(doc);
                $("#save_patient_charting_template").data("meddata",final_med_ids);
              }else {
                $("#save_patient_charting_template").data("meddata",doc);  
              }
              
              if($("#save_patient_charting_template").data("meddata_ids") && $("#save_patient_charting_template").data("meddata_ids").length > 0) {
                var tempmed_data = $("#save_patient_charting_template").data("meddata_ids");
                var final_med_ids = tempmed_data.concat(bulk_saved_data);
                $("#save_patient_charting_template").data("meddata_ids", final_med_ids);
              }else {
                $("#save_patient_charting_template").data("meddata_ids",bulk_saved_data);
              }
            }
          },
          error: function (data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            if($("#save_medication_new").attr('index')){
              newAlert('success', 'Medication Updated successfully !');
              saveAuditRecord("Medication","Update","Error While updating Medication.");
            }else{
              newAlert('success', 'Medication added successfully !');
              saveAuditRecord("Medication","Insert","Error While adding Medication.");
            }
          }
        });
      }else {
        if($("#save_medication_new").data("old_medication_index")) saveOldMedication($("#save_medication_new").data("old_medication_index"),doc[0].drug);
        if($("#save_medication_new").attr('index')){
          newAlert('success', 'Medication Updated successfully !');
          saveAuditRecord("Medication","Update","Medication updated Successfully.");
        }else{
          newAlert('success', 'Medication added successfully !');
          saveAuditRecord("Medication","Insert","Medication added Successfully.");
        }
        $('html, body').animate({scrollTop: 0}, 'slow');
        getMedicationOnPatientDashboard();
        getMedications();
        clearMedicationForm();
        printMedication(doc[0].prescription_id);
        if($("#past_history_tab_link").parent().hasClass("active")){
          backToMedicationList();
        }else{
          getMedicationDetails("charting_current_medication_list", "", "charting_current_medication_pagination",displayChartingCurrentMedication,"","");
          closeChartingMedicationModal();
          if($("#save_patient_charting_template").data("meddata") && $("#save_patient_charting_template").data("meddata").length > 0) {
            var tempmed_data = $("#save_patient_charting_template").data("meddata");
            var final_med_ids = tempmed_data.concat(doc);
            $("#save_patient_charting_template").data("meddata",final_med_ids);
          }else {
            $("#save_patient_charting_template").data("meddata",doc);  
          }
          if($("#save_patient_charting_template").data("meddata_ids") && $("#save_patient_charting_template").data("meddata_ids").length > 0) {
            var tempmed_data = $("#save_patient_charting_template").data("meddata_ids");
            var final_med_ids = tempmed_data.concat(bulk_saved_data);
            $("#save_patient_charting_template").data("meddata_ids", final_med_ids);
          }else {
            $("#save_patient_charting_template").data("meddata_ids",bulk_saved_data);
          }
        }
      }
      saveMedicationBulksDocs(medication_doc);
      $("#save_new_medication, #save_medication_new, #save_medication_for_patient_only").removeAttr("disabled");
      $("#add_medication_from_charting_modal").modal("hide");
    },
    error: function(data, error, reason) {
      if (data == '409') {
        newAlert('danger', 'Details were updated already on other device.');
        tamsaFactories.getSearchPatient(userinfo.user_id);
      }
      else {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
      $("#save_new_medication, #save_medication_new, #save_medication_for_patient_only").removeAttr("disabled");
      if($("#save_medication_new").attr('index')){
        saveAuditRecord("Medication","Update","Error While updating Medication.");
      }else{
        saveAuditRecord("Medication","Insert","Error While adding Medication.");
      }
    }
  });
}

function printMedication(prescription_id) {
  console.log(prescription_id);
  // var ids = ['e4e3880147bbadc03acaa29ded004a5d','e4e3880147bbadc03acaa29ded0042fc','0fa9a735ee6eed360714a314e144d592'];
  try{
    var open_link = window.open('','_blank');
    open_link.document.open();
    open_link.document.write("<iframe width='1100' height='1000' src='/_print/medications?ids="+prescription_id+"'></iframe>");
    open_link.document.close();
    // var printMedicationArray = getMedicationDetailsForPrint(doc);
    // console.log(printMedicationArray);
  }catch(e) {
    console.log(e);
  }
}

function saveMedicationBulksDocs(medication_doc,favourite){
  if(medication_doc != '') {
    $.couch.db(db).view("tamsa/getMedicationList", {
      success: function(data) {
        if(data.rows.length > 0) {
          var medication_bulk = [];
          if(medication_doc[0].index){
            for (var i = 0; i < data.rows[0].doc.medication_list.length; i++) {
              for(var j = 0 ; j < medication_doc.length;j++){
                if(i == medication_doc[j].index){
                  if(data.rows[0].doc.medication_list[i].drug_name == medication_doc[j].drug_name && data.rows[0].doc.medication_list[i].strength == medication_doc[j].strength){
                    data.rows[0].doc.medication_list[i].drug_name =  medication_doc[j].drug_name;
                    data.rows[0].doc.medication_list[i].strength =  medication_doc[j].strength;
                    data.rows[0].doc.medication_list[i].type =  medication_doc[j].type;
                    data.rows[0].doc.medication_list[i].units =  medication_doc[j].units;
                    data.rows[0].doc.medication_list[i].route =  medication_doc[j].route;
                  }else{
                    var doc = {
                      drug_name :medication_doc[j].drug_name,
                      type :medication_doc[j].type,
                      strength :medication_doc[j].strength,
                      units :medication_doc[j].units,
                      route :medication_doc[j].route
                    };
                     medication_bulk.push(doc);
                  }
                }
              }  
            }
            if(medication_bulk.length > 0){
              var medicationslist1 = data.rows[0].doc.medication_list.concat(medication_bulk);
            }else{
              var medicationslist1 = data.rows[0].doc.medication_list;
            }
            saveMedication(data,medicationslist1,favourite);
          }else{
            var m_list = data.rows[0].doc.medication_list;
            var medicationslist1 =  m_list.concat(medication_doc);  
            saveMedication(data,medicationslist1,favourite);
          }
        } else {
          var docSave = [];
          for(var j = 0 ; j < medication_doc.length;j++){
            var doc = {
              drug_name :medication_doc[j].drug_name,
              type :medication_doc[j].type,
              strength :medication_doc[j].strength,
              units :medication_doc[j].units,
              route :medication_doc[j].route
            };
            docSave.push(doc);
          }
          saveMedication(data,docSave,favourite);
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code,{}, {}, {}],
      reduce : false,
      include_docs:true
    });
  }
}

function saveMedication(data,medicationslist,favourite){
  if(data != ""){
    var docSave = {
      _id : data.rows[0].doc._id,
      _rev : data.rows[0].doc._rev,
      dhp_code:data.rows[0].doc.dhp_code,
      doctype: data.rows[0].doc.doctype,
      medication_list: medicationslist
    }
  }else{
    var docSave = {
      dhp_code:data.rows[0].doc.dhp_code,
      doctype: data.rows[0].doc.doctype,
      medication_list: medicationslist
    }  
  }  
  $.couch.db(db).saveDoc(docSave,{
    success:function(data){
      if(favourite){
        $.unblockUI();
        plController.getMedicationList();
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    }
  });
}

function savecurrentMedication(action) {
  //$("#save_new_medication, #save_medication_new, #save_medication_for_patient_only").attr("disabled","disabled");
  $("#confirm_medication_edit_update_modal").modal("hide");
  var doc            = generalizeSaveMedicationData(action);
  var medication_doc = saveMedicationInList(action);
  var cron_doc       = generalizeSaveMedicationCronData(action,doc[0].prescription_id);
  // console.log(doc);
  // console.log(cron_doc);
  if(action == "Print"){
    generalizeSaveMedication(doc,cron_doc,action,medication_doc,"Print");
    // getMedicationForPrint(doc,action);
  }else{
    generalizeSaveMedication(doc,cron_doc,action,medication_doc);
  }
}

function saveMedicationInList() {
  var medication_bulk_docs = [];
  $(".medication_details_parent").each(function(){
    if($(this).find(".favorite_drug").prop('checked')) {
      if($(this).find(".hideCheckbox").data("index")){
        console.log($(this).find(".hideCheckbox").data("index"));
        var medication_doc       = {};
        medication_doc.drug_name = $(this).find(".drug").val();
        medication_doc.type      = $(this).find(".desperse_form").val();
        medication_doc.strength  = $(this).find(".drug_strength").val();
        medication_doc.units     = $(this).find(".drug_unit").val();
        medication_doc.route     = $(this).find(".medication_route").val();
        medication_doc.index     = $(this).find(".hideCheckbox").data("index");
        medication_bulk_docs.push(medication_doc);
      }else{
        var medication_doc       = {};
        medication_doc.drug_name = $(this).find(".drug").val();
        medication_doc.type      = $(this).find(".desperse_form").val();
        medication_doc.strength  = $(this).find(".drug_strength").val();
        medication_doc.units     = $(this).find(".drug_unit").val();
        medication_doc.route     = $(this).find(".medication_route").val();
        medication_bulk_docs.push(medication_doc);
      }
    }
  });
  return medication_bulk_docs;
}

function getMedicationForPrint(doc,action){
  $.unblockUI();
  try{
    // var print_table = '';
    // for(var i=0;i<doc.length;i++){
    //   print_table += '<table class="table tbl-border" style="border:1px solid grey;"><thead><th colspan="2" style="border:1px solid grey;">Rx</th></thead><tbody><tr><td style="border:1px solid grey">Doctor Name:</td><td style="border:1px solid grey">'+doc[i].doctor_name+'</td></tr><tr><td style="border:1px solid grey">Drug:</td><td style="border:1px solid grey">'+doc[i].drug+'</td></tr><tr><td style="border:1px solid grey">Medication Instructions:</td><td style="border:1px solid grey">'+doc[i].medication_instructions+'</td></tr><tr><td style="border:1px solid grey">Drug quantity:</td><td style="border:1px solid grey">'+doc[i].drug_quantity+'</td></tr><tr><td style="border:1px solid grey">Disperse form:</td><td style="border:1px solid grey">'+doc[i].desperse_form+'</td></tr><tr><td style="border:1px solid grey">Substitution:</td><td style="border:1px solid grey">'+doc[i].substitution+'</td></tr><tr><td style="border:1px solid grey">Pharmacy:</td><td style="border:1px solid grey">'+doc[i].pharmacy+'</td></tr><tr><td style="border:1px solid grey">Pharmacy Instructions:</td><td style="border:1px solid grey">'+doc[i].pharmacy_instructions+'</td></tr></tbody></table>';  
    // }
    
    $.couch.db(db).view("tamsa/getPrintSetting",{
      success:function(hdata){
        if(hdata.rows.length > 0) {
          $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
            success:function(pdata) {
              if(pdata.rows.length > 0) {
                var medication_print_data = generatePrintForMedication(hdata,doc,pdata);
                //var printMedicationArray = getMedicationDetailsForPrint(doc);
                //var medication_print_data = newmedicationPrint(hdata,pdata,printMedicationArray); 
                //printMedication(medication_print_data);
                printNewHtml(medication_print_data);
                // if($("#save_medication_new").data("old_medication_index")) saveOldMedication($("#save_medication_new").data("old_medication_index"));
                // if($("#save_medication_new").attr('index')){
                //   newAlert('success', 'Medication Updated successfully !');
                //   saveAuditRecord("Medication","Update","Medication updated Successfully.");
                // }else{
                //   newAlert('success', 'Medication added successfully !');
                //   saveAuditRecord("Medication","Insert","Medication added Successfully.");
                // }
                // $('html, body').animate({scrollTop: 0}, 'slow');
                // getMedicationOnPatientDashboard();
                // getMedications();
                // clearMedicationForm();
                // if($("#past_history_tab_link").parent().hasClass("active")){
                //   backToMedicationList();
                // }else{
                //   getMedicationDetails("charting_current_medication_pagination",displayChartingCurrentMedication,"charting_past_medication_pagination",displayChartingPastMedication);
                //   closeChartingMedicationModal();
                //   $("#save_patient_charting_template").data("meddata",doc);
                // }
              }else{
                newAlert("danger","Patient Details Not Found.");
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            },
            key:userinfo.user_id
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
  }
  catch(err){
    // if($("#save_medication_new").data("old_medication_index")) saveOldMedication($("#save_medication_new").data("old_medication_index"));
    // if($("#save_medication_new").attr('index')){
    //   newAlert('success', 'Medication Updated successfully !');
    //   saveAuditRecord("Medication","Update","Error While printing Updated Medication.");
    // }else{
    //   newAlert('success', 'Medication added successfully !');
    //   saveAuditRecord("Medication","Insert","Error While printing Inserting Medication.");
    // }
    // $('html, body').animate({scrollTop: 0}, 'slow');
    // getMedicationOnPatientDashboard();
    // getMedications();
    // clearMedicationForm();
    // if($("#past_history_tab_link").parent().hasClass("active")){
    //   backToMedicationList();
    // }else{
    //   getMedicationDetails("charting_current_medication_pagination",displayChartingCurrentMedication,"charting_past_medication_pagination",displayChartingPastMedication);
    //   closeChartingMedicationModal();
    //   $("#save_patient_charting_template").data("meddata",doc);
    // }
  }
}

function saveOldMedication(old_data_index,new_drug_name){
  $.couch.db(db).openDoc(old_data_index,{
    success:function(data){
      var newdata                      = data;
      newdata.drug_stop_date           = moment().format("YYYY-MM-DD");
      newdata.current_drug_switched_to = new_drug_name;
      $.couch.db(db).saveDoc(newdata,{
        success:function(data){
          getMedicationOnPatientDashboard();
          getMedications();
        },
        error:function(data,error,reason){
          console.log(reason);
        }
      });
    },
    error:function(data,error,reason){
      console.log(reason);
    }
  });
}

function clearMedicationForm() {
  $(".drug").val('').removeAttr("readonly");
  $(".favorite_drug").prop("checked", false).removeAttr("disabled");
  $(".dose-common").addClass("no-display");
  $(".medication_instructions").val('').removeAttr("disabled");
  $(".drug_quantity").val('');
  $(".desperse_form").val('').removeAttr("disabled");
  $(".substitution").prop("checked", false).removeAttr("disabled");
  $(".pharmacy").val('').removeAttr("disabled");
  $(".pharmacy_instructions").val('').removeAttr("readonly");
  $(".save_medication_new").attr('index', '');
  $(".save_medication_new").attr('rev', '');
  $("#save_medication_new").data('insert_ts', '');
  $("#save_medication_new").data("ispartial","No");
  $(".drug_strength").val('').removeAttr("disabled");
  $(".drug_unit").val('').removeAttr("disabled");
  $(".drug_start_date").val('').removeAttr("disabled");
  $(".drug_end_date").val('').removeAttr("disabled");
  $(".mt_morning").prop("checked", false).removeAttr("disabled");
  $(".mt_afternoon").prop("checked", false).removeAttr("disabled");
  $(".mt_evening").prop("checked", false).removeAttr("disabled");
  $(".mt_night").prop("checked", false).removeAttr("disabled");
  $(".pharmacy_search_btn").removeAttr("disabled");
  $("#medication_route").val("").removeAttr("readonly");
  $(".medication_details_parent").not("[id='default_medication']").remove();
  $("#medication_name_tabs").find("li").not(":first").not(":last").remove();
  $("#medication_name_tabs").find("li:first").find("a").html("Medication").trigger("click");
}

function openAddNewMedication(){
  openNewMedicationForm();
  $("#save_medication_for_patient_only").hide();
  $("#save_medication_new").show();
  $("#medication_name_tabs").find("li:last").show();
  $("#save_medication_new").data("ispartial","No");
  showAllergiesAtMedication();
  getChartNotesForMedication();
}

function showAllergiesAtMedication() {
  var mh_allergies = getPatientAllergies("current");
  $("#medication_allergies").html(mh_allergies.join(''));
}
function openNewMedicationForm(){
  clearMedicationForm();
  //$(".drug_start_date, .drug_end_date").removeClass("zindex1151");
  $("#add_new_medication_parent").show();
  $(".medication_allergies").show();
  $("#current_medications,#add_new_pharmacy").hide("fast");
  $("#save_medication_new").data("old_medication_index","");
}

function backToMedicationList(){
  $("#add_new_medication_parent,#add_new_pharmacy").hide();
  $("#current_medications").show("fast");
}

function backToAddNewMedicationForm(){
  $("#add_new_medication_parent").show();
  $("#add_new_pharmacy, #current_medications").hide("fast");
}

function openAddPharmacy(){
  $("#pharmacy_search_modal").modal("hide");
  $("#add_new_medication_parent,#current_medications").hide();
  $("#add_new_pharmacy").show();
}

function openEditMedicationForm(index,partial_medication) {
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      openNewMedicationForm();
      $("#medication_name_tabs").find("li:first").find("a").html(data.drug);
      $("#drug").val(data.drug).attr("readonly","readonly");
      $("#save_medication_new").attr("index", data._id);
      $("#save_medication_new").attr("rev", data._rev);
      $("#save_medication_new").data("insert_ts", (data.insert_ts ? data.insert_ts : data.update_ts));
      if(partial_medication == "Yes") {
        $("#favorite_drug, #desperse_form, #substitution, #pharmacy, #drug_start_date, #drug_end_date, #medication_chart_notes, #pharmacy_search_btn, .medication-time").removeAttr("disabled");
        $("#pharmacy_instructions, .medication_route").removeAttr("readonly");
        $("#save_medication_new").data("ispartial","Yes");
        $("#save_medication_for_patient_only").hide();
        $("#save_medication_new").show();
        $("#medication_name_tabs").find("li:last").hide();
      }else{
        $("#favorite_drug").prop("checked",data.favorite_drug).attr("disabled","disabled");
        $("#medication_instructions").val(data.medication_instructions);
        $("#drug_quantity").val(data.drug_quantity);
        $("#desperse_form").val(data.desperse_form).attr("disabled","disabled");
        $("#substitution").prop("checked",data.substitution).attr("disabled","disabled");
        $("#pharmacy").val($("#pharmacy option:contains('"+data.pharmacy+"')").attr("value"));
        $("#pharmacy").attr("disabled","disabled");
        $("#pharmacy_instructions").val(data.pharmacy_instructions).attr("readonly","readonly");
        $("#drug_strength").val(data.drug_strength);
        $("#drug_unit").val(data.drug_unit.toLowerCase());
        $("#medication_route").val(data.route ? data.route : "").attr("readonly","readonly");

        $('#drug_start_date').daterangepicker(
        {
            locale: {
              format: 'YYYY-MM-DD'
            },
            startDate: data.drug_start_date ,
            endDate: data.drug_end_date
        }, 
        function(start, end, label) {
            $("#drug_start_date").val(+ start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        });

        $("#drug_start_date").val(data.drug_start_date + " - " + data.drug_end_date).attr("disabled","disabled");
        $("#drug_end_date").val(data.drug_end_date).attr("disabled","disabled");
        $("#medication_chart_notes").val(data.medication_chart_note).attr("disabled","disabled");
        $("#pharmacy_search_btn").attr("disabled","disabled");
        if (data.medication_time) {
          for (var i = data.medication_time.length - 1; i >= 0; i--) {
            $("#mt_"+data.medication_time[i]).prop("checked", true);
            $("."+data.medication_time[i]+"-dose")
            .val((data.medication_time_quantity) ? (data.medication_time_quantity[i]) : 1)
            .removeClass("no-display")
            .attr("readonly","readonly");
          };
        }
        $(".medication-time").attr("disabled","disabled");
        $("#save_medication_for_patient_only").show();
        $("#save_medication_new").hide();
        $("#medication_name_tabs").find("li:last").hide();
        $("#save_medication_new").data("ispartial","No");
      }
      showAllergiesAtMedication();
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function openEditMedicationFrequencyForm(index){
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      openNewMedicationForm();
      $("#save_medication_new").data("prescribe_date",data.prescription_date);
      $("#save_medication_new").data("prescribe_id",data.prescription_id);
      $("#drug_strength").val(data.drug_strength);
      $("#drug_unit").val(data.drug_unit.toLowerCase());
      $("#medication_route").val( data.route ? data.route : "").attr("readonly","readonly");
      $('#drug_start_date').daterangepicker(
        {
            locale: {
              format: 'YYYY-MM-DD'
            },
            startDate: data.drug_start_date ,
            endDate: data.drug_end_date
        }, 
        function(start, end, label) {
            $("#drug_start_date").val(+ start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        });
      // $("#drug_start_date").val(data.drug_start_date);
      // $("#drug_end_date").val(data.drug_end_date);
      $("#drug").val(data.drug).attr("readonly","readonly");
      $("#medication_name_tabs").find("li:first").find("a").html(data.drug);
      $("#favorite_drug").prop("checked",data.favorite_drug).attr("disabled","disabled");
      $("#medication_instructions").val(data.medication_instructions).attr("disabled","disabled");
      $("#drug_quantity").val(data.drug_quantity).attr("readonly","readonly");
      $("#desperse_form").val(data.desperse_form).attr("disabled","disabled");
      $("#substitution").prop("checked",data.substitution).attr("disabled","disabled");
      $("#pharmacy").val($("#pharmacy option:contains('"+data.pharmacy+"')").attr("value"));
      $("#pharmacy").attr("disabled","disabled");
      $("#pharmacy_instructions").val(data.pharmacy_instructions).attr("readonly","readonly");
      $("#medication_chart_notes").val(data.medication_chart_note).attr("disabled","disabled");
      $("#pharmacy_search_btn").attr("disabled","disabled");
      $("#save_medication_new").attr("index", data._id);
      $("#save_medication_new").attr("rev", data._rev);
      $("#save_medication_new").data("insert_ts", (data.insert_ts ? data.insert_ts : data.update_ts));
      $("#medication_name_tabs").find("li:last").hide();
      $("#save_medication_new").data("ispartial","No");
      showAllergiesAtMedication();
      if (data.medication_time) {
        for (var i = data.medication_time.length - 1; i >= 0; i--) {
          $("#mt_"+data.medication_time[i]).prop("checked", true);
          $("."+data.medication_time[i]+"-dose")
          .val((data.medication_time_quantity) ? (data.medication_time_quantity[i]) : 1)
          .removeClass("no-display")
          .removeAttr("readonly");
        };
      }

      var duration = moment.duration(moment().diff(moment(data.insert_ts)));
      var hours = duration.asHours();
      if(hours > 2){
        $("#save_medication_for_patient_only").show();
        $("#save_medication_new").hide();
      }
      else{
        $("#save_medication_for_patient_only").hide();
        $("#save_medication_new").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function clearUpdateMedicationModal() {
  $("#change_medication_label").val("Yes").trigger("change");
}

function openUpdateMedicationModal($obj) {
  if($obj.closest("tr").data("new_patient_medic") == "Yes") {
    newAlert("danger","Not having enough info. Please Edit medication details first.")
    $("html, body").animate({scrollTop: 0}, 'slow');
    return false;
  }
  clearUpdateMedicationModal();
  $("#update_medication_modal").modal({
    show:true,
    backdrop:'static',
    keyboard:'false'
  });
  $("#update_medication_name").text($obj.parent().parent().find("td:first").text());
  $("#medication_update_btn").data("index",$obj.attr("index"));
  $("#medication_update_btn").data("old_medication_name",$obj.closest("tr").find("td:first").html());
}

function toggleUpdateMedicationFrequency($obj){
  if($obj.val() == "Yes"){
    $("#update_medication_frequency_parent").hide();
  }else{
    $("#medication_update_btn").data("old_medication_name", "");
    $("#update_medication_frequency_parent").show();
  }
}

function updateMedication($obj){
  var medication_new = $("#change_medication_label").val();
  var medication_frequency_new = $("#change_medication_frequency_label").val();
  $("#update_medication_modal").modal("hide");
  if(medication_new == "Yes"){
    updateAsNewMedicationForm($obj.data("index"),$obj.data("old_medication_name"));
  }else{
    if(medication_frequency_new == "Yes"){
      openEditMedicationFrequencyForm($obj.data("index"));
    }else{
      openEditMedicationForm($obj.data("index"));
    }
  }
}

function updateAsNewMedicationForm(index,old_medication_name){
  openAddNewMedication();
  $("#save_medication_new").data("old_medication_index",index);
  $("#save_medication_new").data("old_medication_name",old_medication_name);
}

function openConfirmEditUpdateModal(action){
  $.unblockUI();
  if($("#save_medication_new").data("old_medication_index")){
    $.couch.db(db).view("tamsa/getExistingMedicationForPatient", {
      success:function (exdata) {
        //TODO from Here
        if(exdata.rows.length > 0) {
          $("#medication_delete_message").html('<span>Medication is currently prescribed to the patient.To Modify the medication details, Please use&nbsp;<span class="glyphicon glyphicon-ban-circle padding-reset" title="Stop"></span><span class="or-font">/</span><span class="glyphicon glyphicon-refresh padding-reset" title="Update"></span>&nbsp;from Medication List.</span>');
          createModal("delete_medication_message_modal");
          setTimeout(function() {
            $("#delete_medication_message_modal").modal("hide");
          },5000);
          return false;
        }else {
          createModal("confirm_medication_edit_update_modal");
          $("#confirm_medication_edit_update").data("action",action);
          $.couch.db(db).openDoc($("#save_medication_new").data("old_medication_index"),{
            success:function(data) {
              var summary_data = [];
               summary_data.push('<tr><td>Drug Name</td><td>'+data.drug+'</td><td>'+$("#drug").val()+'</td></tr>');
               summary_data.push('<tr><td>Drug Start Date</td><td>'+data.drug_start_date+'</td><td>'+$("#drug_start_date").val()+'</td></tr>');
               summary_data.push('<tr><td>Drug End Date</td><td>'+data.drug_end_date+'</td><td>'+$("#drug_end_date").val()+'</td></tr>');
               summary_data.push('<tr><td>Patient Instruction</td><td>'+data.medication_instructions+'</td><td>'+$("#medication_instructions").val()+'</td></tr>');
               summary_data.push('<tr><td>Drug Strength</td><td>'+data.drug_strength+' '+data.drug_unit+'</td><td>'+$("#drug_strength").val()+' '+$("#drug_unit").val()+'</td></tr>');
               summary_data.push('<tr><td>Route</td><td>'+(data.route? data.route: "")+'</td><td>'+$("#medication_route").val()+'</td></tr>');
              summary_data.push('<tr><td>Drug Quantity</td><td>'+data.drug_quantity+'</td><td>'+$("#drug_quantity").val()+'</td></tr>');
              summary_data.push('<tr><td>Drug added to Favourite</td><td>'+data.favorite_drug+'</td><td>'+$("#favorite_drug").prop("checked")+'</td></tr>');
              summary_data.push('<tr><td>Disperse Form</td><td>'+data.desperse_form+'</td><td>'+$("#desperse_form").val()+'</td></tr>');
              summary_data.push('<tr><td>Allow Substitution</td><td>'+data.substitution+'</td><td>'+$("#substitution").prop("checked")+'</td></tr>');
              summary_data.push('<tr><td>Pharmacy</td><td>'+data.pharmacy+'</td><td>'+$("#pharmacy :selected").text()+'</td></tr>');
              summary_data.push('<tr><td>Pharmacy Instruction</td><td>'+data.pharmacy_instructions+'</td><td>'+$("#pharmacy_instructions").val()+'</td></tr>');
              summary_data.push('<tr><td>Medication Time</td><td>'+data.medication_time+'</td><td>');
                if($("#mt_morning").prop("checked")) summary_data.push($("#mt_morning").val()+ " ")
                else if($("#mt_afternoon").prop("checked")) summary_data.push($("#mt_afternoon").val()+ " ")
                else if($("#mt_evening").prop("checked")) summary_data.push($("#mt_evening").val()+ " ")
                else if($("#mt_night").prop("checked")) summary_data.push($("#mt_night").val()+ " ")
                summary_data.push('</td></tr>');

              $("#medication_edit_update_summary_table tbody").html(summary_data.join(''));
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
      key:[userinfo.user_id,$("#drug").val().trim()]
    });
  }else if($("#save_medication_new").attr("index")){
    createModal("confirm_medication_edit_update_modal");
    $("#confirm_medication_edit_update").data("action",action);
    $.couch.db(db).openDoc($("#save_medication_new").attr("index"),{
      success:function(data){
        var summary_data = [];
        var date = ""+data.drug_start_date + " - " + data.drug_end_date+"";
        if(date != $("#drug_start_date").val()) summary_data.push('<tr><td>Drug Start And Date</td><td>'+data.drug_start_date+'</td><td>'+$("#drug_start_date").val()+'</td></tr>')

        // if(data.drug_end_date != $("#drug_end_date").val()) summary_data.push('<tr><td>Drug End Date</td><td>'+data.drug_end_date+'</td><td>'+$("#drug_end_date").val()+'</td>') 
        
        if(data.medication_instructions != $("#medication_instructions").val()) summary_data.push('<tr><td>Patient Instruction</td><td>'+data.medication_instructions+'</td><td>'+$("#medication_instructions").val()+'</td></tr>')

        if(data.drug_strength != $("#drug_strength").val() || data.drug_unit != $("#drug_unit").val()) summary_data.push('<tr><td>Drug Strength</td><td>'+data.drug_strength+' '+data.drug_unit.toLowerCase()+'</td><td>'+$("#drug_strength").val()+' '+$("#drug_unit").val()+'</td></tr>')

        if(data.drug_quantity != $("#drug_quantity").val()) summary_data.push('<tr><td>Drug Quantity</td><td>'+data.drug_quantity+'</td><td>'+$("#drug_quantity").val()+'</td></tr>')

        var checked_medication = [];
        $(".medication-time").each(function(){
          if($(this).prop("checked")) checked_medication.push($(this).val())
        })
        if(data.medication_time.length == checked_medication.length){
          for(var i=0;i<checked_medication.length;i++){
            if($.inArray(checked_medication[i],data.medication_time) < 0){
              summary_data.push('<tr><td>Medication Time</td><td>'+data.medication_time.toString()+'</td><td>'+checked_medication.toString()+'</td></tr>');
              break;
            }
          }
        }else{
          summary_data.push('<tr><td>Medication Time</td><td>'+data.medication_time.toString()+'</td><td>'+checked_medication.toString()+'</td></tr>');
        }

        $("#medication_edit_update_summary_table tbody").html(summary_data.join(''));
        if($("#medication_edit_update_summary_table tbody tr").length == 0) $("#medication_edit_update_summary_table tbody").html('<tr><td colspan="3">No Changes are Done.</td></tr>');
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }
}

function showSummaryChangesBeforeSaveMedication($obj){
  if(validateNewMedicationForm()){
    $.blockUI({
      message: '<h1>Please Wait........</h1>',
      css:{
        color: "#f2bb5c"
      }
    });
    if(($("#save_medication_new").data("ispartial") == "No") && ($("#save_medication_new").attr("index") || $("#save_medication_new").data("old_medication_index"))){
      if($obj.hasClass("save_new_medication")) openConfirmEditUpdateModal("New")
      else if($obj.hasClass("save_medication_for_patient_only")) openConfirmEditUpdateModal("Patient_Only")
      else if($obj.hasClass("save_new_print_medication")) openConfirmEditUpdateModal("Print")
      else openConfirmEditUpdateModal("New")
    }else{
      if($("#save_medication_new").data("ispartial") != "Yes") {
        $.couch.db(db).view("tamsa/getExistingMedicationForPatient", {
          success:function (exdata) {
            if(exdata.rows.length > 0) {
              $.unblockUI();  
              $("#medication_delete_message").html('<span>Medication is currently prescribed to the patient.To Modify the medication details, Please use&nbsp;<span class="glyphicon glyphicon-ban-circle padding-reset" title="Stop"></span><span class="or-font">/</span><span class="glyphicon glyphicon-refresh padding-reset" title="Update"></span>&nbsp;from Medication List.</span>');
              createModal("delete_medication_message_modal");
              setTimeout(function() {
                $("#delete_medication_message_modal").modal("hide");
              },5000);
              return false;
            }else {
              if($obj.hasClass("save_medication_new")) savecurrentMedication("Pharmacy")
              else if($obj.hasClass("save_medication_for_patient_only ")) savecurrentMedication("Patient_Only")
              else if($obj.hasClass("save_new_print_medication")) savecurrentMedication("Print")
              else if($obj.hasClass("save_new_medication")) savecurrentMedication("New")  
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key:[userinfo.user_id,$("#drug").val().trim()]
        });
      }else {
        if($obj.hasClass("save_medication_new")) savecurrentMedication("Pharmacy")
        else if($obj.hasClass("save_medication_for_patient_only ")) savecurrentMedication("Patient_Only")
        else if($obj.hasClass("save_new_print_medication")) savecurrentMedication("Print")
        else if($obj.hasClass("save_new_medication")) savecurrentMedication("New")  
      }
    }
  }
}

function newmedicationPrint(hdata,pdata,medTime) {
  var output  = [];
  output.push('<!DOCTYPE html>');
  output.push('<html lang="en">');
    output.push('<head>');
      output.push('<meta charset="utf-8">');
      output.push('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
      output.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
      output.push('<title>Medication</title>');
      output.push('<link href="css/bootstrap.min.css" rel="stylesheet" media="all">');
      output.push('<link href="css/medication-print.css" rel="stylesheet" type="text/css" media="all">');
      output.push('<link href="css/gistfile1.css" rel="stylesheet" type="text/css" media="all">');
    output.push('</head>');
    output.push('<body>');
      output.push('<header id="site-header">');
        output.push('<div class="container-fluid">');
          output.push('<div class="row">');
            output.push('<div class="col-sm-4">');
            if(hdata.rows[0].doc.is_display_logo){
              output.push('<a title="Sensory Health Systems" class="logo"><img src="'+hdata.rows[0].doc.invoice_image+'" alt="Sensory Health Systems"></a>');
            }else{
              output.push('<a title="Sensory Health Systems" class="logo"><img src="images/logo-transparent.png" alt="Sensory Health Systems"></a>');
            }
            output.push('</div>');
            output.push('<div class="col-sm-8">');
              output.push('<article id="site-info">');
                output.push('<ul>');
                  output.push('<li>');
                    output.push('<i class="glyphicon glyphicon-map-marker"></i>');
                    output.push('<span>'+pd_data.hospital_affiliated+'</span><br>');
                    output.push('<span>'+hdata.rows[0].doc.hospital_address+'</span><br>');
                    if(hdata.rows[0].doc.hospital_secondary_address) {
                      output.push('<span>'+hdata.rows[0].doc.hospital_secondary_address+'</span><br>');  
                    }
                    output.push('<span>'+hdata.rows[0].doc.hospital_city+'</span><br>');
                    output.push('<span>'+hdata.rows[0].doc.hospital_state+', '+hdata.rows[0].doc.hospital_postal_zip_code+'</span><br>');
                    output.push('<span>India</span><br>');
                  output.push('</li>');
                  output.push('<li>');
                    output.push('<i class="glyphicon glyphicon-earphone"></i>');
                    output.push('<span>'+pd_data.hospital_phone+'</span><br/>');
                    // output.push('<span>011-2552565656</span>');
                  output.push('</li>');
                  output.push('<li class="remove-bdr">');
                    output.push('<i class="glyphicon glyphicon-globe"></i>');
                        output.push('<span>'+hdata.rows[0].doc.hospital_email+'</span></br>');
                        output.push('<span>'+hdata.rows[0].doc.hospital_website+'</span></br>');
                        output.push('<span>DHP Code:<span class="small_size">'+hdata.rows[0].doc.dhp_code+'</span></span></br>');
                        output.push('<span>Doctor Name:<span class="small_size">'+pd_data.first_name+ ' '+ pd_data.last_name+'</span></span>');
                  output.push('</li>');
                  output.push('<div class="clearfix"></div>');
                output.push('</ul>');
              output.push('</article>');
            output.push('</div>');
          output.push('</div>');
          output.push('<div class="row">');
            output.push('<div class="col-sm-4">');
              output.push('<article id="addres-detail">');
                output.push('<h1 class="mrgtop5 mrgbtm">Patient Details</h1>');
                output.push('<h2 class="heading2 mrgtop5 mrgbtm">'+pdata.rows[0].value.first_nm+' '+pdata.rows[0].value.last_nm+' ('+pdata.rows[0].value.patient_dhp_id+')</h2>');
                output.push('<i class="glyphicon glyphicon-map-marker"></i><span>'+pdata.rows[0].value.address1+', '+(pdata.rows[0].value.address2 ? pdata.rows[0].value.address2 : "")+'</span>');
                  output.push('<br><span>India</span><br>');
                  // output.push('<br><span>'+pdata.rows[0].value.city+', '+pdata.rows[0].value.state+', India</span><br>');
                output.push('<i class="glyphicon glyphicon-earphone"></i><span>'+pdata.rows[0].value.phone+'</span><br>');
                output.push('<i class="glyphicon glyphicon-envelope"></i><span>'+pdata.rows[0].value.user_email+'</span><br>');
                // output.push('<i class="glyphicon glyphicon-globe"></i><span>NA</span><br>');
              output.push('</article>');
            output.push('</div>');  
            output.push('<div class="col-sm-8">');
              output.push('<article id="medi-sumry">');
                output.push('<div class="row">');
                  output.push('<div class="col-sm-3">');
                    // output.push('<h2 class="mrgtop5">Medications</h2>');
                    // output.push('<span class="txt">#25879</span>');
                    output.push('<h2 class="mrgtop5">Date</h2>');
                    output.push('<span class="txt">19, May 2016</span>');
                  output.push('</div>');
                  output.push('<div class="col-sm-9">');
                    output.push('<h3 class="heading3 mrgtop5">Medications summary</h3>');
                    output.push('<aside class="smury-detail">');
                      output.push('<ol>');
                        for(var i=0;i<medTime.medlist.length;i++){
                          output.push('<li>'+medTime.medlist[i].drug_name+' - QTY '+ medTime.medlist[i].quantity +'</li>');
                        }
                      output.push('</ol>');
                    output.push('</aside>');
                  output.push('</div>');
                output.push('</div>');
              output.push('</article>');
            output.push('</div>');  
          output.push('</div>');
        output.push('</div>');
      output.push('</header>');
      output.push('<div class="container-fluid">');
        output.push('<main id="main-sitecon">');
          output.push('<div class="row">');
            output.push('<div class="col-sm-3">');
              output.push('<section class="items-sec">');

                for(var i=0;i<medTime.morning_med.length;i++){
                  output.push('<article class="item-art">');
                    output.push('<div class="head-sec">');
                      output.push('<div class="row">');
                        output.push('<div class="col-sm-6"><img src="images/sun1.png" alt="" title=""></div>');
                        output.push('<div class="col-sm-6"><h4>Morning</h4><p style="font-size:8px;">'+medTime.morning_med[i].start_date+' TO '+medTime.morning_med[i].end_date+'</p></div>');
                      output.push('</div>');
                    output.push('</div>');
                    output.push('<div class="con-part1">');
                      output.push('<span class="txt-lg">'+medTime.morning_med[i].drug_name+' <span class="txt-sm">'+medTime.morning_med[i].drug_strength+'</span></span>');
                      output.push('<small class="pull-right small_size">'+medTime.morning_med[i].drug_type+'</small>');
                    output.push('</div>');
                    output.push('<div class="con-part2" style="font-size:8px;">');
                      output.push('<span class="digit">'+medTime.morning_med[i].drug_count+'</span>');
                      output.push('<span class="txt">times a day</span>');
                    output.push('</div>');
                    output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Route:</strong>'+(medTime.morning_med[i].route ? medTime.morning_med[i].route : "NA")+'</div>');
                    output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Note:</strong>'+medTime.morning_med[i].instruction+'</div>');
                  output.push('</article>');  
                }

              output.push('</section>');
            output.push('</div>');
            output.push('<div class="col-sm-3">');
              output.push('<section class="items-sec">');
                for(var i=0;i<medTime.afternoon_med.length;i++){
                  output.push('<article class="item-art">');
                  output.push('<div class="head-sec">');
                    output.push('<div class="row">');
                      output.push('<div class="col-sm-6 "><img src="images/sun2.png" alt="" title=""></div>');
                      output.push('<div class="col-sm-6"><h4>Afternoon</h4><p style="font-size:8px;">'+medTime.afternoon_med[i].start_date+' TO '+medTime.afternoon_med[i].end_date+'</p>');
                      output.push('</div>');
                    output.push('</div>');
                  output.push('</div>');
                  output.push('<div class="con-part1">');
                    output.push('<span class="txt-lg">'+medTime.afternoon_med[i].drug_name+'</span><br>');
                    output.push('<span class="txt-sm" style="float:left">'+medTime.afternoon_med[i].drug_strength+'</span>');
                    output.push('<small class="pull-right">'+medTime.afternoon_med[i].drug_type+'</small>');
                  output.push('</div>');
                  output.push('<div class="con-part2" style="font-size:8px;">');
                    output.push('<span class="digit">'+medTime.afternoon_med[i].drug_count+'</span>');
                    output.push('<span class="txt">times a day</span>');
                  output.push('</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Route:</strong>'+(medTime.afternoon_med[i].route ? medTime.afternoon_med[i].route : "NA")+'</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Note:</strong> '+medTime.afternoon_med[i].instruction+'</div>');
                output.push('</article>');  
                }
                

              output.push('</section>');
            output.push('</div>');
            output.push('<div class="col-sm-3">');
              output.push('<section class="items-sec">');
                for(var i=0;i<medTime.evening_med.length;i++){
                  output.push('<article class="item-art">');
                  output.push('<div class="head-sec">');
                    output.push('<div class="row">');
                      output.push('<div class="col-sm-6"><img src="images/sun3.png" alt="" title=""></div>');
                      output.push('<div class="col-sm-6"><h4>Evening</h4><p style="font-size:8px;">'+medTime.evening_med[i].start_date+' TO '+medTime.evening_med[i].end_date+'</p>');
                      output.push('</div>');
                    output.push('</div>');
                  output.push('</div>');
                  output.push('<div class="con-part1">');
                    output.push('<span class="txt-lg">'+medTime.evening_med[i].drug_name+' <span class="txt-sm">'+medTime.evening_med[i].drug_strength+'</span></span>');
                    output.push('<small class="pull-right">'+medTime.evening_med[i].drug_type+'</small>');
                  output.push('</div>');
                  output.push('<div class="con-part2" style="font-size:8px;">');
                    output.push('<span class="digit">'+medTime.evening_med[i].drug_count+'</span>');
                    output.push('<span class="txt">times a day</span>');
                  output.push('</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Route:</strong>'+(medTime.evening_med[i].route ? medTime.evening_med[i].route : "NA")+'</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Note:</strong> '+medTime.evening_med[i].instruction+'</div>');
                output.push('</article>');  
                }
                
              output.push('</section>');
            output.push('</div>');
            output.push('<div class="col-sm-3">');
              output.push('<section class="items-sec remove-bdr">');
              for(var i=0;i<medTime.night_med.length;i++){
                output.push('<article class="item-art">');
                  output.push('<div class="head-sec">');
                    output.push('<div class="row">');
                      output.push('<div class="col-sm-6"><img src="images/moon.png" alt="" title=""></div>');
                      output.push('<div class="col-sm-6"><h4>Night</h4><p style="font-size:8px;">'+medTime.night_med[i].start_date+' TO '+medTime.night_med[i].end_date+'</p>');
                      output.push('</div>');
                    output.push('</div>');
                  output.push('</div>');
                  output.push('<div class="con-part1">');
                    output.push('<span class="txt-lg">'+medTime.night_med[i].drug_name+' <span class="txt-sm">'+medTime.night_med[i].drug_strength+'</span></span>');
                    output.push('<small class="pull-right">'+medTime.night_med[i].drug_type+'</small>');
                  output.push('</div>');
                  output.push('<div class="con-part2" style="font-size:8px !important;">');
                    output.push('<span class="digit">'+medTime.night_med[i].drug_count+'</span>');
                    output.push('<span class="txt">times a day</span>');
                  output.push('</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Route:</strong>'+(medTime.night_med[i].route ? medTime.night_med[i].route : "NA")+'</div>');
                  output.push('<div class="ft-sec" style="padding-left:3px;text-align:left !important;"><strong>Note:</strong> '+medTime.night_med[i].instruction+'</div>');
                output.push('</article>');
              }
              output.push('</section>');
            output.push('</div>');
          output.push('</div>');
        output.push('</main>');
      output.push('</div>');
      //for phrmacy details -- starts
      if(medTime.pharmacy_name) {
        output.push('<section id="white-sec">');
          output.push('<div class="container-fluid">');
            output.push('<div class="row">');
              output.push('<div class="col-sm-1">');
                output.push('<h4 class="site-heading4">Pharmacy Name:</h4>');
              output.push('</div>');
              output.push('<div class="col-sm-2">');
                output.push('<div class="default-col">');
                  output.push('<span>'+medTime.pharmacy_name+'</span>');
                output.push('</div>');
              output.push('</div>');
              output.push('<div class="col-sm-3">');
                output.push('<h4 class="site-heading4">Contact No:</h4>');
              output.push('</div>');
              output.push('<div class="col-sm-3">');
                output.push('<div class="default-col">');
                  output.push('<span>'+medTime.pharmacy_phone+'</span>');
                output.push('</div>');
              output.push('</div>');
            output.push('</div>');
            output.push('<div class="row">');
              output.push('<div class="col-sm-3">');
                output.push('<h4 class="site-heading4">Pharmacy Instruction:</h4>');
              output.push('</div>');
              output.push('<div class="col-sm-9">');
                output.push('<div class="default-col">');
                  output.push('<span>'+medTime.pharmacy_instructions+'</span>');
                output.push('</div>');
              output.push('</div>');
            output.push('</div>');
            output.push('<div class="row">');
              output.push('<div class="col-sm-12">');
                output.push('<h4 class="site-heading4 mrgbtm">Do you know:</h4>');
                output.push('<span class="site-para">Download myDHP app and connect with your doctor/hospital. You can request appoinments, get medication reminders, track & monitor your health and many other benefits</span>');
              output.push('</div>');
            output.push('</div>');
          output.push('</div>');
        output.push('</section>');  
      }
      //for phrmacy details -- ends
      // output.push('<div style="page-break-after:always"></div>');
      output.push('<section id="white-sec">');
        output.push('<div class="container-fluid">');
          output.push('<div class="row">');
            output.push('<div class="col-sm-2">');
              output.push('<h4 class="site-heading4">Additional Notes:</h4>');
            output.push('</div>');
            output.push('<div class="col-sm-2">');
              output.push('<div class="default-col">');
                output.push('<p>NA</p>');
              output.push('</div>');
            output.push('</div>');

            output.push('<div class="col-sm-8">');
              output.push('<div class="row">');
                output.push('<div class="col-sm-6">');
                  output.push('<a class="scan"><img src="images/scan.png" alt="" title=""></a>');
                  output.push('<h5 class="site-h5">Scan the QR Code</h5>');
                output.push('</div>');
                output.push('<div class="col-sm-6">');
                  output.push('<a class="btn-gugplay"><img src="images/google-play.png" alt="" title=""></a>');
                  output.push('<div class="row">');
                    output.push('<div class="col-sm-6">');
                      output.push('<span class="or">OR</span>');
                    output.push('</div>');
                    output.push('<div class="col-sm-6">');
                      output.push('<center><h5 class="site-h5">Download from Play Store goo.gl/myDHP</h5></center>');
                    output.push('</div>');
                  output.push('</div>');
                output.push('</div>');
              output.push('</div>');
            output.push('</div>');
          output.push('</div>');
          output.push('<div class="row">');
            output.push('<div class="col-sm-12">');
              output.push('<h4 class="site-heading4">Do you know:</h4>');
              output.push('<p class="site-para">Download myDHP app and connect with your doctor/hospital. You can request appoinments, get medication reminders, track & monitor your health and many other benefits</p>');
            output.push('</div>');
          output.push('</div>');
        output.push('</div>');
      output.push('</section>');
      output.push('<footer id="site-footer">');
        output.push('<div class="container-fluid">');
            output.push('<div class="row">');
              output.push('<div class="col-sm-2">');
                output.push('<a class="ftr-logosm"><img src="images/logo-sm.png" alt="Sensory Health Systems" title="Sensory Health Systems"></a>');
              output.push('</div>');
              output.push('<div class="col-sm-6">');
                output.push('<div class="row">');
                  output.push('<div class="col-sm-2"><i class="glyphicon glyphicon-map-marker contact-icon"></i></div>');
                  output.push('<div class="col-sm-10 ">');
                    output.push('<p>'+pd_data.hospital_affiliated+', '+ hdata.rows[0].doc.hospital_address +', '+ hdata.rows[0].doc.hospital_secondary_address+'<br>'+hdata.rows[0].doc.city+', '+hdata.rows[0].doc.state+', '+hdata.rows[0].doc.zip_code+' &nbsp;India</p>');
                  output.push('</div>');
                output.push('</div>');
              output.push('</div>');
              output.push('<div class="col-sm-4">');
                output.push('<div class="row">');
                  output.push('<div class="col-sm-1"><i class="glyphicon glyphicon-earphone contact-icon"></i></div>');
                  output.push('<div class="col-sm-9">');
                    output.push('<p>');
                    output.push('<a>'+pd_data.hospital_phone+'</a>');
                    output.push('</p>');
                  output.push('</div>');
                output.push('</div>');
              output.push('</div>');
              output.push('<div class="col-sm-6">');
                output.push('<div class="row">');
                  output.push('<div class="col-sm-1"><i class="glyphicon glyphicon-globe contact-icon"></i></div>');
                  output.push('<div class="col-sm-9">');
                    output.push('<p>');
                    output.push('<a>'+hdata.rows[0].doc.hospital_email+'</a><br/>');
                    output.push('<a>'+hdata.rows[0].doc.hospital_website+'</a>');
                    output.push('</p>');
                  output.push('</div>');
                output.push('</div>');
              output.push('</div>');
            output.push('</div>');
            output.push('<div class="row">');
                
              output.push('</div>');
          output.push('</div>');
      output.push('</footer>');
      output.push('<div class="copy-rt"></div>');
    output.push('</body>');
  output.push('</html>');
  return output.join('');
}

function generatePrintForMedication(hdata,doc,pdata) {
  var print_bill_data = [];
  print_bill_data.push('<style type=text/css>.invoice_phone{border-right: 1px solid rgb(210, 210, 210);float: left; height: 89px;margin-left:6px;margin-top: 7px;padding-right: 12px;} .webaddress{height: 89px; float: left; margin-left: 6px; margin-top: 9px; width: 160px;} .invoice-details b{color: rgb(119, 119, 119); font-size: 15px;} .invoice-details .title{font-size: 19px; font-weight: bold; color: rgb(119, 119, 119); margin-right: 19px;} .invoice-details .invoicetab{background: rgb(242, 187, 92) none repeat scroll 0% 0%; border-radius: 10px 10px 0px 0px; color: rgb(255, 255, 255); text-align: left; float: left; padding: 16px; margin-right: 5px;width:144px;border:1px solid #333;} .medication-table th{background: none !important;color: #67a22d;} .medication-table span{background: rgb(103, 162, 45) none repeat scroll 0% 0%; border-radius: 106px; padding: 6px 11px; color: rgb(255, 255, 255);} table.invoice-display-table tr:nth-child(odd){background:#CCCCCC;} table.invoice-display-table th{background:#fff !important;} .table.patitentAddress tr td{padding-top: 3px;}.invoicetotal td{padding-left: 58px;} .invoice-header td{padding-bottom:3px !important;;padding-top:3px !important;}</style><div class="row" style="padding-top: 0px;">');
    print_bill_data.push('<div class="col-lg-12" style="border-bottom: 1px solid grey;" id="preview_header_parent">');
      print_bill_data.push('<table class="table common-preview-invoice-details">');
        print_bill_data.push('<tbody>');
          print_bill_data.push('<tr>');
            if(hdata.rows[0].doc.is_display_logo){
              print_bill_data.push('<td style="padding:0px;width:29%;"><img src="'+hdata.rows[0].doc.invoice_image+'" alt="Company Logo" title="Company Logo" width="75%"></td>');
            }
            print_bill_data.push('<td style="padding-bottom:0px;">');
              print_bill_data.push('<table style="float: left; width: 43%; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon-map-marker" style="color:#F2BB5C;margin-right:3px;"></span>'+pd_data.hospital_affiliated+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_address+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_secondary_address+', '+hdata.rows[0].doc.hospital_city+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_state+', '+hdata.rows[0].doc.hospital_postal_zip_code+' India</td></tr>');
                  print_bill_data.push('</tbody>');
                  print_bill_data.push('</table><div class="invoice_phone"><span class="glyphicon glyphicon-earphone" style="color:#f2bb5c;margin-right:5px;"></span>'+pd_data.hospital_phone+'</div><div class="webaddress"><span style="float: left; width: 80%; margin-bottom: 10px;"><span class="glyphicon glyphicon-globe" style="height:10px;"></span><span style="margin-left: 18px;">'+hdata.rows[0].doc.hospital_email+'</span></span><span style="float: left; width: 100%; margin-left: 18px; margin-bottom: 10px; word-break:break-all;line-height: 1.45 !important;">'+hdata.rows[0].doc.hospital_website+'</span><br><span style="float: left; margin-left: 18px; margin-bottom: 10px; width:100%; word-break:break-all;">'+hdata.rows[0].doc.dhp_code+'</span></div>');

            print_bill_data.push('</td>');
          print_bill_data.push('</tr>');
        print_bill_data.push('</tbody>');
      print_bill_data.push('</table>');
    print_bill_data.push('</div>');


    print_bill_data.push('<div class="col-lg-12">');
      print_bill_data.push('<table class="table preview-invoice-patient-details common-preview-invoice-details">');
        print_bill_data.push('<tbody>');
          print_bill_data.push('<tr>');
            print_bill_data.push('<td style="line-height: 0.45 !important;width:100%;">');
              print_bill_data.push('<table class="table common-preview-invoice-details patitentAddress">');
                print_bill_data.push('<tbody>');
                 
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><b style="color:rgb(119, 119, 119)">Patient Info:</b></td>');
                  print_bill_data.push('<td style="line-height: 0.45 ! important; padding-left: 25px;font-weight: bold;">'+pdata.rows[0].value.first_nm+' '+pdata.rows[0].value.last_nm+' ('+pdata.rows[0].value.patient_dhp_id+')</td>');
                  if(pdata.rows[0].value.phone){
                    print_bill_data.push('<td style="line-height: 0.45 !important"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-earphone"></span>'+pdata.rows[0].value.phone+'</td>');
                  }
                  if(pdata.rows[0].value.user_email){
                    print_bill_data.push('<td style="line-height: 0.45 !important"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-envelope"></span>'+pdata.rows[0].value.user_email+'</td>');
                  }
                  print_bill_data.push('</tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><b style="color:rgb(119, 119, 119)">Address:</b></td>');
                    print_bill_data.push('<td style="line-height: 0.45 ! important; padding-left: 25px;font-weight: bold;">'+pdata.rows[0].value.address1+'</td>');
                    if(pdata.rows[0].value.address2){
                      print_bill_data.push('<td style="line-height: 0.45 !important">'+pdata.rows[0].value.address2+'</td>');
                    }
                    print_bill_data.push('<td style="line-height: 0.45 !important;padding-left:25px;">'+pdata.rows[0].value.city+', '+pdata.rows[0].value.state+', '+pdata.rows[0].value.pincode+'</td>');
                  print_bill_data.push('</tr>');
                 
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');
          print_bill_data.push('</tr>');
        print_bill_data.push('</tbody>');
      print_bill_data.push('</table>');
    print_bill_data.push('</div>');

    //var printdata = getPrintCommonDetails(hdata,doc,pdata);
    //print_bill_data.push(printdata);
    print_bill_data.push('<div class="row">');
      print_bill_data.push('<div style="padding-left:45px;padding-right:15px;width:810px;">');
        print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="700px" style="padding: 0px; margin: 0px auto;">');
          print_bill_data.push('<tbody>');
            print_bill_data.push('<tr>');
              print_bill_data.push('<td style="line-height: 0.45 !important">');
                print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="790" style="margin: 4px auto;">');
                  print_bill_data.push('<tbody>');
                    print_bill_data.push('<tr>');
                      print_bill_data.push('<td style="line-height: 0.45 !important">');
                        print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="765" style="margin-top: 5px;" class="mrg-top medication-table">');
                          print_bill_data.push('<tbody>');
                          
                            print_bill_data.push('<tr>');
                              print_bill_data.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold; width:100%">');
                                print_bill_data.push('<table class="table invoice-display-table">');
                                  print_bill_data.push('<tbody>');
                                    print_bill_data.push('<tr>');
                                      print_bill_data.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="left"><span>Doctor Name:: '+doc[0].doctor_name+'</span></td>');
                                      print_bill_data.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="right"><span>Date :: '+(doc[0].update_ts ? moment(doc[0].update_ts).format("YYYY-MM-DD") : moment(doc[0].insert_ts).format("YYYY-MM-DD"))+'</span></td>');
                                    print_bill_data.push('</tr>');
                                  print_bill_data.push('</tbody>');
                                print_bill_data.push('</table>');
                              print_bill_data.push('</td>');
                            print_bill_data.push('</tr>');

                            print_bill_data.push('<tr>');
                              print_bill_data.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold;">');
                                print_bill_data.push('<table class="table invoice-display-table">');
                                  print_bill_data.push('<thead>');
                                    print_bill_data.push('<tr>');
                                      print_bill_data.push('<th>No</th><th>Medication Name</th><th>Dose</th><th>Type</th><th>Frequency</th><th>Route</th><th width="13%">Start Date</th><th width="13%">End Date</th><th>Patient Instruction</th>');
                                    print_bill_data.push('</tr>');
                                  print_bill_data.push('</thead>');
                                  print_bill_data.push('<tbody>');

                                  for(var i=0;i<doc.length;i++) {
                                    print_bill_data.push('<tr>');
                                      print_bill_data.push('<td><span>'+(i+1)+'</span></td>');
                                      print_bill_data.push('<td>'+doc[i].drug+'</td>');
                                      print_bill_data.push('<td>'+doc[i].drug_strength+ " " +doc[i].drug_unit.toLowerCase()+'</td>');
                                      print_bill_data.push('<td>'+doc[i].desperse_form+'</td>');
                                      // print_bill_data.push('<td>'+doc[i].drug_quantity+'</td>');
                                      print_bill_data.push('<td>'+doc[i].medication_time.join(", ")+'</td>');
                                      print_bill_data.push('<td>'+(doc[i].route ? doc[i].route : "NA")+'</td>');
                                      print_bill_data.push('<td width="13%">'+doc[i].drug_start_date+'</td>');
                                      print_bill_data.push('<td width="13%">'+doc[i].drug_end_date+'</td>');
                                      print_bill_data.push('<td>'+(doc[i].medication_instructions ? doc[i].medication_instructions : "NA")+'</td>');
                                    print_bill_data.push('</tr>');
                                  }
                                  print_bill_data.push('</tbody>');
                                print_bill_data.push('</table>');
                              print_bill_data.push('</td>');
                            print_bill_data.push('</tr>');

                            if(doc[0].pharmacy || doc[0].pharmacy_name) {
                              print_bill_data.push('<tr>');
                                print_bill_data.push('<td valign="top" align="left" style="font-size: 14px; color: rgb(0, 0, 0); font-family: arial; font-weight: bold; padding-top: 17px; float: left; width: 100%;">');
                                    print_bill_data.push('<h5>Pharmacy Name:: '+doc[0].pharmacy_name +'</h5>');
                                    print_bill_data.push('<h5>Pharmacy Contact No:'+doc[0].pharmacy_phone+'</h5>');
                                print_bill_data.push('</td>');
                              print_bill_data.push('</tr>');  
                            }

                          print_bill_data.push('</tbody>');
                        print_bill_data.push('</table>');
                      print_bill_data.push('</td>');
                    print_bill_data.push('</tr>');
                  print_bill_data.push('</tbody>');
                print_bill_data.push('</table>');
              print_bill_data.push('</td>');
            print_bill_data.push('</tr>');
          print_bill_data.push('</tbody>');
        print_bill_data.push('</table>');
      print_bill_data.push('</div>');
    print_bill_data.push('</div>');
  print_bill_data.push('</div>');
  return print_bill_data.join('');  
}