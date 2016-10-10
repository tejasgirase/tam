function existingCarePlanSearch(id){
  var doctor_id = pd_data._id;
  $('#cplan_current_list thead').html('<tr><th>Care Plan List :</th><th>specialization</th><th>Publish</th></tr>'); 
  $('#cplan_current_list tbody').html('');
  $.couch.db(db).openDoc(id, {
    success: function(data) {
      var careplan_tbody = '';
        careplan_tbody += '<tr><td>'+data.template_name;
        if (data.doctor_id == pd_data._id) {
          careplan_tbody  += '&nbsp; &nbsp; &nbsp;<span class="glyphicon glyphicon-trash delete_cplan pointer" data-target="#delete_cplan_modal" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data._id+'" rev="'+data._rev+'"></span><a data-toggle="tab" class="edit_care_plan" index="'+data._id+'"><span class="glyphicon glyphicon-pencil pointer" role="button" class="dropdown-toggle"></span></a></td><td>'+data.specialization+'</td><td>'+data.publish+'</td></tr>';
        }else {
          careplan_tbody += '</td></tr>';
        }
      $("#cplan_current_list tbody").html(careplan_tbody);
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [doctor_id],
    endkey: [doctor_id, {},{}]
  });
}

function editPatientCarePlan(current_doc_id,current_rev_id,view){
  $.couch.db(db).openDoc(current_doc_id, {
    success: function(data) {
      $('#saved_patient_care_plan_tab').show();
      $("#selected_patient_care_plan_name").html(data.template_name);
      $("#patient_cp_startdate").daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
        startDate: data.cp_startdate,
        endDate:   data.cp_enddate
      });
      // $("#patient_cp_startdate").val(data.cp_startdate);
      // $("#patient_cp_enddate").val(data.cp_enddate);
      // $("#patient_cp_startdate").prop('disabled','disabled');
      // $("#patient_cp_enddate").prop('disabled','disabled');
      $('#cp_update_toggle').hide();
      $('#patient_activity_list tbody').html('');
      $('#patient_activity_list thead').html('<tr><th>Activity Name</th><th>Response Value</th></tr>');
      var activity_data = [];
      for (var i=0; i<data.fields.length; i++) {
        activity_data.push('<tr careplan_section="'+data.fields[i].section_name+'" class="care-plan-section-rows"><td colspan="3"><table class="table tbl-border"><tbody><tr><td colspan="3"><div class="careplan-display-section-parent"><span class="careplan-display-section-name">'+data.fields[i].section_name+'</span></div></td></tr>');
        if(data.fields[i].section_fields){
          for(var j=0; j<data.fields[i].section_fields.length;j++){
            activity_data.push('<tr class="care-plan-field-rows">');
            // if(data.fields[i].section_name == "Nutrition/Dietary"){
            //   activity_data.push('<td><img src="images/icon-1.png" style="margin-right:3px;"><span class="care-plan-field-name">'+data.fields[i].section_fields[j].field_name+'</span></td>');  
            // }
            if(data.fields[i].section_name == "Health Screening" || data.fields[i].section_name == "Fitness" || data.fields[i].section_name == "Patient Education"){
              activity_data.push('<td><table class="careplan-response-format-values"><tbody><tr class="careplan-inner-row" selected_boolean="'+data.fields[i].section_fields[j].boolean_response+'"><td>');
            }else{
              activity_data.push('<td colspan="3"><table class="careplan-response-format-values"><tbody><tr class="careplan-inner-row" occurance="'+data.fields[i].section_fields[j].occurance_days+'"><td>');
            }
            activity_data.push(generateSummaryPatientCarePlan(data.fields[i].section_fields[j].field_name,data.fields[i].section_fields[j],data.fields[i].section_name));
            activity_data.push('</td></tr>');
            activity_data.push('</tbody></table></td></tr>');
          }
        }
        activity_data.push('</tbody></table>');
      }    
      $("#patient_activity_list tbody").html(activity_data.join(''));
      if(view != 'view'){
        $("#care_plan_update_button_parent").html('<div class="col-lg-12 col-sm-12 text-center mrgtop2"><button type="button" class="btn btn-warning btnwidth" id="update_patient_care_plan" doc_id = "'+current_doc_id+'" doc_rev = "'+ current_rev_id +'"title = "Update Care Plan for Patient">Update</button></div>'); 
        $("#patient_cp_startdate").prop('disabled','');
        $("#patient_cp_enddate").prop('disabled',''); 
        $('#cp_update_toggle').show();
      }
      if(data.report_frequancy){
        $("#patient_care_plan_frequency_table").show();
        if(data.report_frequancy  == "DAILY") $("#patient_cp_daily").attr("checked",true)
        if(data.report_frequancy  == "EVERY_THREE_DAYS") $("#patient_cp_three_day_reports").attr("checked",true)
        if(data.report_frequancy  == "WEEKLY") $("#patient_cp_weekly_reports").attr("checked",true)
      }
      else{
        $("#patient_care_plan_frequency_table").hide(); 
      }
      if(data.active == "yes"){
        $("#patient_careplan_summary_checkbox").attr("checked",true);
        $("#patient_careplan_summary_checkbox").attr("doc_id",current_doc_id);
        $("#patient_careplan_summary_checkbox").attr("doc_rev",current_rev_id);
      }else{
        $("#patient_careplan_summary_checkbox").attr("checked",false);
        $("#patient_careplan_summary_checkbox").attr("doc_id",current_doc_id);
        $("#patient_careplan_summary_checkbox").attr("doc_rev",current_rev_id);
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function generateSummaryPatientCarePlan(field_name,savedata,sectionname){
  var responseFormateHTML  = '<span style="color:green;font-weight:bold;">'+field_name+'</span> ';
  var occurance = "";
  var start_end_date = "";
  var temp_occurance = "";
  var doctor_note = "";
  if(savedata.recurrance_in_a_day){
    if(savedata.recurrance_in_a_day == "Twice"){
      occurance += 'At '+savedata.frequency+"/";
      if(savedata.frequency.length == 4){
        var time = Number(savedata.frequency.substring(0, 2));
      }else{
        var time = Number(savedata.frequency.substring(0, 1));
      }
      var ampm = savedata.frequency.slice(-2);  
      var calc_time = time + 12;
      if(calc_time >= 12){
      secound_time = calc_time%12;
      if(ampm == "AM"){
       occurance += secound_time+"PM ";
      }else{
       occurance += secound_time+"AM ";
      }
      }else{
        occurance += calc_time+ampm+" ";
      }
    }else if(savedata.recurrance_in_a_day == "Thrice"){
      occurance += 'At ';
      if(savedata.frequency.length == 4){
        var first_time = Number(savedata.frequency.substring(0, 2));
      }else{
        var first_time = Number(savedata.frequency.substring(0, 1));
      }
      var first_part = savedata.frequency.slice(-2);
      var second_time = first_time + 8;
      var second_part = first_part;
      if(second_time >= 12){
        second_time = second_time%12; 
        second_part =  (first_part == "AM")?"PM":"AM";
      }
      var third_time = second_time + 8;
      var third_part = second_part;
      if(third_time >= 12){
        third_time = third_time%12; 
        third_part =  (second_part == "AM")?"PM":"AM";
      }
      var time_string = first_time +" "+first_part+"/"+second_time +" "+second_part+"/"+third_time +" "+third_part;
      occurance += time_string;
    }else{
      occurance += " Hourly ";
    }
  }
  if(savedata.format_type && savedata.format_type == "Specific Day"){
    temp_occurance += "on ";
    for(var k=0;k<savedata.format_value.length;k++){
      temp_occurance += savedata.format_value[k]+" ";  
    }
  }else if(savedata.format_type && savedata.format_type == "Daily"){
    temp_occurance += " everyday ";
  }else if(savedata.format_type && savedata.format_type == "Weekly"){
    temp_occurance += " every week ";
  }else if(savedata.format_type && savedata.format_type == "Days Before/After"){
    for(var k=0;k<savedata.days_before.length;k++){
      temp_occurance += savedata.days_before[k]+" ";
    }
    temp_occurance += " days before ";
    for(var k=0;k<savedata.days_after.length;k++){
      temp_occurance += savedata.days_after[k]+" ";  
    }
    temp_occurance += " days after ";
  }
  if(savedata.start_date && savedata.end_date){
    start_end_date += " from  "+savedata.start_date+" to including "+savedata.end_date+" ";;
  }

  if(temp_occurance == " everyday " || temp_occurance == " every week "){
    responseFormateHTML += temp_occurance;
    if(occurance){
      responseFormateHTML += occurance+" ";
    }
    if(start_end_date){
      responseFormateHTML += start_end_date+" ";
    }
  }else{
    if(occurance){
      responseFormateHTML += occurance+" ";
    }
    if(temp_occurance){
      responseFormateHTML += temp_occurance+" ";
    }
    if(start_end_date){
      responseFormateHTML += start_end_date+" ";
    }
  }
  if(sectionname == "Medication Management"){
    if(savedata.doctor_notes){
      responseFormateHTML += savedata.doctor_notes;
    }
  }
  return responseFormateHTML;
}

function stopPatientCarePlan(index){
  $.couch.db(db).openDoc(index, {
    success:function(data){
      var newdata = data;
      newdata.active = "No";
      newdata.cp_stopdate = moment(new Date()).format('YYYY-MM-DD');
      $.couch.db(db).saveDoc(newdata, {
        success: function(data) {
          newAlert('success', newdata.template_name+' Care plan has been Stoped successfully.');
          prescribedPatientCarePlanList();
        },
        error: function(status) {
            console.log(status);
        }
      });
    },error:function(data){
      console.log(data);
    }
  });
}

function updateMultipleValue(data,field_name,section_name){
  patient_freq_flag = true;
  for(var i=0;i<data.length;i++){
    var $ele = $('.care-plan-section-rows[careplan_section="'+data[i].section_name+'"]');
    for(var j=0,tt=1;j<data[i].section_fields.length;j++,tt++){
      var $ele_rows = $ele.find(".care-plan-field-rows").parent().find("tr:not('.careplan-inner-row'):eq("+tt+")");
      for(var k=0;k<data[i].section_fields[j].response_format_pair.length;k++){
        var $ele_data = $ele_rows.find(".careplan-response-format-values .careplan-inner-row").find('td:eq('+k+')');
        //boolean
          if(data[i].section_fields[j].response_format_pair[k].response == "Boolean"){
            for(var m=0;m<data[i].section_fields[j].response_format_pair[k].values.length;m++){
              if(data[i].section_fields[j].response_format_pair[k].format == "Yes/No"){
                $ele_data.find('.boolean-notes').val(data[i].section_fields[j].response_format_pair[k].values[m].notes);
                if(data[i].section_fields[j].response_format_pair[k].values[m].choice == "Done"){
                 $ele_data.find('.cmn-toggle-round').prop('checked',true);
                }else{
                 $ele_data.find('.cmn-toggle-round').prop('checked',''); 
                }
              }else if(data[i].section_fields[j].response_format_pair[k].format == "True/False"){
                $ele_data.find('.boolean-notes').val(data[i].section_fields[j].response_format_pair[k].values[m].notes);
                if(data[i].section_fields[j].response_format_pair[k].values[m].choice == "True"){
                 $ele_data.find('.cmn-toggle-round').prop('checked',true);
                }else{
                 $ele_data.find('.cmn-toggle-round').prop('checked',''); 
                }
              }else{
                $ele_data.find('.cmn-toggle-round').prop('checked');
              }
            }
          }
        //Number
        else if(data[i].section_fields[j].response_format_pair[k].response == "Number"){
          $ele_data.find('.number-val').val(data[i].section_fields[j].response_format_pair[k].values);
        }
        //Frequancy
        else if(data[i].section_fields[j].response_format_pair[k].response == "Frequency"){
          if(data[i].section_fields[j].response_format_pair[k].format == "Daily"){
            $ele_data.find('.careplan-time').val(data[i].section_fields[j].response_format_pair[k].values[0].time);
          }else if(data[i].section_fields[j].response_format_pair[k].format == "Weekly"){ 
            $ele_data.find('.careplan-time').val(data[i].section_fields[j].response_format_pair[k].values[0].time);
            for(var m=0;m<data[i].section_fields[j].response_format_pair[k].values[0].week_days.length;m++){
              $ele_data.find('[week_value="'+data[i].section_fields[j].response_format_pair[k].values[0].week_days[m]+'"]').addClass('.clicked');
            }           
          }else if(data[i].section_fields[j].response_format_pair[k].format == "Specific Day"){
            $ele_data.find('.careplan-freq-specific-date').val(data[i].section_fields[j].response_format_pair[k].values[0].date);  
            $ele_data.find('.careplan-time').val(data[i].section_fields[j].response_format_pair[k].values[0].time); 
          }else if(data[i].section_fields[j].response_format_pair[k].format == "Days Before/After"){
            $ele_data.find('.careplan-time').val(data[i].section_fields[j].response_format_pair[k].values[0].time);
            for(var m=0;m<data[i].section_fields[j].response_format_pair[k].values[0].days_before.length;m++){
              $ele_data.find('[db_val="'+data[i].section_fields[j].response_format_pair[k].values[0].days_before[m]+'"]').addClass('.clicked');
            }
            for(var m=0;m<data[i].section_fields[j].response_format_pair[k].values[0].days_after.length;m++){
              $ele_data.find('[da_val="'+data[i].section_fields[j].response_format_pair[k].values[0].days_after[m]+'"]').addClass('.clicked');
            }
          }
          else{
            $ele_data.find('.careplan-startdate').val(data[i].section_fields[j].response_format_pair[k].values[0].start_date);
            $ele_data.find('.careplan-enddate').val(data[i].section_fields[j].response_format_pair[k].values[0].end_date);
            for(var m=0;m<data[i].section_fields[j].response_format_pair[k].values[0].week_days.length;m++){
              $ele_data.find('[week_value="'+data[i].section_fields[j].response_format_pair[k].values[0].week_days[m]+'"]').addClass('.clicked');
            }
          }
        }
      }
    }
  }
  if(patient_freq_flag){
    $("#patient_care_plan_frequency_table").show();
    $("#"+data.report_freq).attr("checked",true);
  }
  else{
    $("#patient_care_plan_frequency_table").hide(); 
  }
}

function createNewCarePlan(){
  $(".tab-pane").removeClass("active");
  $("#new_cplan_tab").addClass('active');
  $("#save_cplan_template").attr("index","");
  $("#save_cplan_template").attr("rev","");
  $("#create_new_careplan_sections_link").attr("index","");
  $("#cplan_name").focus();
  $("#crt_new_lbl").html("Build New");
  $("#create_new_careplan_parent").addClass("active");
  $("#create_new_careplan_parent").parent().removeClass("active");
  getAllExistingSpecializationList("specialization_name");
  clearCarePlanSections();
}

function deleteCarePlan() {
  var delete_index = $("#delete_cplan_confirm").attr("index");
  var delete_rev   = $("#delete_cplan_confirm").attr('rev');

  var doc = {
    _id: delete_index,
    _rev: delete_rev
  };
  
  $.couch.db(db).removeDoc(doc, {
    success: function(data) {
      $('#delete_cplan_modal').modal("hide");
      newAlert('success', 'Care Plan Deleted successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      //getCarePlanList();
    },
    error: function(data, error, reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  })
}
 
//Form Builder for Care Plan Template starts
//New CarePlan ResponseBuilder
function carePlanResponseBuilder(rf_pair,section_name,sname){
  
  var ret_string = '';
  //numeric
  if(rf_pair.response == "numeric"){
    if(format_type == "BloodPressure(mmHg)"){
      ret_string = '<div><span class = "dia-care-plan">Diastolic</span>&nbsp;&nbsp;&nbsp;<input type="text" id = "bp_diastolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label><br></div><div><span class = "sys-care-plan">Systolic</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id = "bp_systolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label><br></div><div><input type="checkbox" style="visibility:visible" id = "cp_reports'+i+'" > Reports <input type="checkbox" style="visibility:visible" id = "cp_alerts'+i+'"> Alerts</div>';
    }else if(format_type  == "Kilometers"){
      ret_string = '<div><input type="text" id = "pf_kilometers'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div>';
    }else if(format_type == "simple_integer"){
      ret_string = '<div><input type="text" id = "pf_simple_integer'+i+'"></div>';
    }
    else{
      ret_string = '<div><input type="text" id = "pf_numeric'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div><div><input type="checkbox" style="visibility:visible" id = "cp_reports'+i+'"> Reports <input type="checkbox" style="visibility:visible" id = "cp_alerts'+i+'"> Alerts</div>';
    }
  }
  //string
  else if(rf_pair.response == "string"){
    if(value){
      ret_string = '<input type = "text" value = "'+value+'" id = "pf_string'+i+'">&nbsp;<label>'+carePlanFormatBuilder(rf_pair.format)+'</label>';
    }else{
      ret_string = '<input type = "text"  id = "pf_string'+i+'">&nbsp;<label>'+carePlanFormatBuilder(rf_pair.format)+'</label>';
    } 
  }
  //Boolean
  else if(rf_pair.response == "Boolean"){
    ret_string = carePlanBooleanInputs(rf_pair);
  }
  //Number
  else if(rf_pair.response == "Number"){
    ret_string = '<td response_type="'+rf_pair.response+'" format_type = "'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><input class="form-control padd-width number-val" type="Number" placeholder="';
    if(section_name == "Record body weight"){
      ret_string += 'Enter Here (Kg)">';
    }else if (section_name == "Record body temp") {
      ret_string += 'Enter Here &deg;C">';
    }else{
       ret_string += 'Enter Here">';
    }
    if(sname == "Biometrics"){
       ret_string += '<span style="margin-top:5px;float: left;"><input type="checkbox" id="" class="checkshow care_chk">SMS alerts when readings are above the limits</span>';
    }
    ret_string +='</td>';  
    
  }
  //multiple
  else if(rf_pair.response == "multiple"){
    if(rf_pair.format == "daysBeforeAfter"){ret_string = daysBeforeAfter(i);}
    else if(rf_pair.format == "weekly"){ret_string = weekly(i);}
    else{ret_string = timeOfTheDay(i);}  
  }
  //Frequency
  else if(rf_pair.response == "Frequency"){
    return carePlanFrequency(rf_pair);
  }
  //Start Date/End Date
  else if(rf_pair.response == "start-end-date"){
    if(value){
      ret_string = '<label> Start Date ::</label><input type = "text" class = "datetime cust-date" value="'+value+'" id="pf_start_date'+i+'"><br><label> End Date &nbsp;&nbsp;::<input type = "text" class = "datetime cust-date" value="'+value+'" id="pf_end_date'+i+'">';
    }else{
      ret_string = '<label> Start Date ::</label><input type = "text"  class = "datetime cust-date" id = "pf_start_date'+i+'"><label> End Date &nbsp;&nbsp;::</label><input type = "text"  class = "datetime cust-date" id = "pf_end_date'+i+'">';
    }
  }
  //no response
  else{
    ret_string = "not found";
  }
return ret_string;
}
function carePlanBooleanInputs(rf_pair){
  var random_no = getPcode(4,"numeric");
  var switch_string = '<input type="checkbox" id="boolean_'+random_no+'" class="cmn-toggle cmn-toggle-round boolean-val"><label for="boolean_'+random_no+'" style="display:inline-block;"></label>';
  if(rf_pair.format == "Yes/No"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">No</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">Yes</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }else if(rf_pair.format == "True/False"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">False</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">True</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }else{
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">Not Done</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">Done</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }
}

function updateCarePlanBooleanInputs(rf_pair){
  var random_no = getPcode(4,"numeric");
  var switch_string = '<input type="checkbox" id="boolean_'+random_no+'" class="cmn-toggle cmn-toggle-round boolean-val"><label for="boolean_'+random_no+'" style="display:inline-block;"></label>';
  if(rf_pair.format == "Yes/No"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">No</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">Yes</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }else if(rf_pair.format == "True/False"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">False</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">True</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }else{
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="switch"><span style="position:relative;left:-3px;top:-12px;">Not Done</span>'+switch_string+'<span style="right:-3px;position:relative;top:-12px;">Done</span><br><br><input type="text" placeholder="Add Your Notes Here" style="display:inline;margin-top: 0px; padding-top: 6px; width: 250px ! important; position: relative; bottom: 9px; right: -15px;" class="form-control boolean-notes"></div></td>';
  }
}
function carePlanFrequency(rf_pair){
  var tmpstring='Every &nbsp;<select style="width:60px !important;display:inline-block !important;" class="form-control careplan-time"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select> &nbsp; Hours';
  if(rf_pair.format == "Daily"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-2" style="padding-top: 8px;"><span class="careplan-freq-val">Daily</span></div><div class="col-lg-10">'+tmpstring+'</div></td>';
  }else if(rf_pair.format == "Weekly"){ 
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="btn-toolbar col-lg-7 careplan-freq-val" role="toolbar"><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist-first" role="group" week_value="sun">Sun</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="mon">Mon</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="tue">Tue</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="wed">Wed</div><div week_value="thu" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Thu</div><div week_value="fri" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Fri</div><div week_value="sat" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist-last" style="">Sat</div></div><div class="col-lg-5">'+tmpstring+'</div></td>';
  }else if(rf_pair.format == "Specific Day"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-6 padd-left-right"><span>Specific Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime form-control padd-width careplan-freq-specific-date"></div><div class="col-lg-6 padd-left-right">'+tmpstring+'</div></td>';
  }else if(rf_pair.format == "Days Before/After"){
    return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data padd-left-right"><div class="col-lg-3">'+tmpstring+'</div><div class="col-lg-9" style="text-align: left;"><span style="margin-left: 6px;">Days Before</span><span style="margin-left: 195px;">Days After</span><div class="btn-toolbar careplan-freq-val" role="toolbar" style="margin-left: 0px;"><div style="" class="btn-group d-before-cmn d-before-click weeklist-first" role="group" db_val="7">7</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="6">6</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="5">5</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="4">4</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="3">3</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="2">2</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="1">1</div><div role="group" class="btn-group patient-btn-group" style="padding: 5px 7px; height: 30px; border-right: 1px solid grey; margin-left: 0px; background-color: rgb(235, 134, 19);">N</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "1">1</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "2">2</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "3">3</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "4">4</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "5">5</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "6">6</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist-last" style="" da_val = "7">7</div></div></div></td>';
  }else{
    se_date = '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-6"><span>Start Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime careplan-startdate form-control"></div><div class="col-lg-6"><span>End Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime careplan-enddate form-control"></div></td><td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm"><div class="btn-toolbar careplan-freq-val" role="toolbar"><div class="btn-group template-btn-group template-btn-click week-val weeklist-first" role="group" week_value="sun">Sun</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="mon">Mon</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="tue">Tue</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="wed">Wed</div><div week_value="thu" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Thu</div><div week_value="fri" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Fri</div><div week_value="sat" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist-last" style="">Sat</div></div></td>';
    return se_date;
  }
}

function updateCarePlanFrequency(rf_pair){
  if(rf_pair.values.length > 0){
      for(var r=0;r<rf_pair.values.length;r++){
        var tmpstring='Every &nbsp;<select style="width:60px !important;display:inline-block !important;" class="form-control careplan-time"><option >1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select> &nbsp; Hours';
        if(rf_pair.format == "Daily"){
          return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-2" style="padding-top: 8px;"><span class="careplan-freq-val">Daily</span></div><div class="col-lg-10">'+tmpstring+'</div></td>';
         // $('')
        }else if(rf_pair.format == "Weekly"){ 
          return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="btn-toolbar col-lg-7 careplan-freq-val" role="toolbar"><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist-first" role="group" week_value="sun">Sun</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="mon">Mon</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="tue">Tue</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="wed">Wed</div><div week_value="thu" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Thu</div><div week_value="fri" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Fri</div><div week_value="sat" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist-last" style="">Sat</div></div><div class="col-lg-5">'+tmpstring+'</div></td>';
        }else if(rf_pair.format == "Specific Day"){
          return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-6 padd-left-right"><span>Specific Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime form-control padd-width careplan-freq-specific-date"></div><div class="col-lg-6 padd-left-right">'+tmpstring+'</div></td>';
        }else if(rf_pair.format == "Days Before/After"){
          return '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data padd-left-right"><div class="col-lg-3">'+tmpstring+'</div><div class="col-lg-9" style="text-align: left;"><span style="margin-left: 6px;">Days Before</span><span style="margin-left: 195px;">Days After</span><div class="btn-toolbar careplan-freq-val" role="toolbar" style="margin-left: 0px;"><div style="" class="btn-group d-before-cmn d-before-click weeklist-first" role="group" db_val="7">7</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="6">6</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="5">5</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="4">4</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="3">3</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="2">2</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="1">1</div><div role="group" class="btn-group patient-btn-group" style="padding: 5px 7px; height: 30px; border-right: 1px solid grey; margin-left: 0px; background-color: rgb(235, 134, 19);">N</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "1">1</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "2">2</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "3">3</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "4">4</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "5">5</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "6">6</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist-last" style="" da_val = "7">7</div></div></div></td>';
        }else{
          se_date = '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm careplan-response-format-data"><div class="col-lg-6"><span>Start Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime careplan-startdate form-control"></div><div class="col-lg-6"><span>End Date</span><input type="text" placeholder="YYYY-MM-DD" class="datetime careplan-enddate form-control"></div></td><td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm"><div class="btn-toolbar careplan-freq-val" role="toolbar"><div class="btn-group template-btn-group template-btn-click week-val weeklist-first" role="group" week_value="sun">Sun</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="mon">Mon</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="tue">Tue</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="wed">Wed</div><div week_value="thu" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Thu</div><div week_value="fri" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Fri</div><div week_value="sat" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist-last" style="">Sat</div></div></td>';
          return se_date;
        }
      }
  }
}
function startDateEndDate(rf_pair){
  se_date = '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm"><span>Start Date</span><input type="text" class="datetime"><span>End Date</span><input type="text" class="datetime"></td>';
  return se_date;
}

function daysBeforeAfter(rf_pair){
  day_string = '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm"><div style="text-align: left;"><span style="margin-left: 6px;">Days Before</span><span style="margin-left: 195px;">Days After</span></div><div class="btn-toolbar" role="toolbar" style="margin-left: 0px;"><div style="" class="btn-group d-before-cmn d-before-click weeklist-first" role="group" db_val="7">7</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="6">6</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="5">5</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="4">4</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="3">3</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="2">2</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="1">1</div><div role="group" class="btn-group patient-btn-group" style="padding: 5px 7px; height: 30px; border-right: 1px solid grey; margin-left: 0px; background-color: rgb(235, 134, 19);">N</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "1">1</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "2">2</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "3">3</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "4">4</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "5">5</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "6">6</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist-last" style="" da_val = "7">7</div></div><br></td>';
  return day_string;
}

function weekly(rf_pair){
  temp_string = '<td response_type="'+rf_pair.response+'" format_type="'+rf_pair.format+'" class="padd-top-btm"><div class="btn-toolbar" role="toolbar"><div style="" class="btn-group template-btn-group template-btn-click weeklist-first" role="group" week_value="sun">Sun</div><div style="" class="btn-group template-btn-group template-btn-click weeklist" role="group" week_value="mon">Mon</div><div style="" class="btn-group template-btn-group template-btn-click weeklist" role="group" week_value="tue">Tue</div><div style="" class="btn-group template-btn-group template-btn-click weeklist" role="group" week_value="wed">Wed</div><div week_value="thu" role="group" class="btn-group template-btn-group template-btn-click weeklist" style="">Thu</div><div week_value="fri" role="group" class="btn-group template-btn-group template-btn-click weeklist" style="">Fri</div><div week_value="sat" role="group" class="btn-group template-btn-group template-btn-click weeklist-last" style="">Sat</div></div></td>';
  return temp_string;
}

function timeOfTheDay(i){
  temp_string = '<input type="checkbox" class = "chk'+i+'" value = "morning">&nbsp;Morning &nbsp;<input type="checkbox" class = "chk'+i+'" value = "afternoon">&nbsp;Afternoon &nbsp;<input type="checkbox" class = "chk'+i+'" value = "evening">&nbsp;Evening &nbsp;<input type="checkbox" class = "chk'+i+'" value = "night">&nbsp;Night<br>';
  return temp_string;
}

function carePlanFormatBuilder(format_type){
  if(format_type == "HeartRate(bpm)"){ return "bpm"}
  else if(format_type == "BloodPressure(mmHg)"){ return "mm Hg"}
  else if(format_type == "Glucose"){return "glucose"}
  else if(format_type == "Kilogram(kg)"){return "kg"}  
  else if(format_type == "Respiration_Rate(bpm)"){return "bpm"}
  else if(format_type == "Oxygen_Sat(%)"){return "%"}
  else if(format_type == "Kilometers"){return "kms"}
  else{ return "";}
}

function getNumericResponseImage(format_type){
  if(format_type == "HeartRate(bpm)"){ return "<img src = 'images/icon-4.png' height='25' width = '25' />"}
  else if(format_type == "BloodPressure(mmHg)"){ return "<img src = 'images/icon-1.png' height='25' width = '25' />"}
  else if(format_type == "Glucose"){return "<img src = 'images/icon-2.png' height='25' width = '25' />"}
  else if(format_type == "Kilogram(kg)"){return "<img src = 'images/icon-3.png' height='25' width = '25' />"}  
  else if(format_type == "Respiration_Rate(bpm)"){return "<img src = 'images/icon-6.png' height='25' width = '25' />"}
  else if(format_type == "Oxygen_Sat(%)"){return "<img src = 'images/icon-5.png' height='25' width = '25' />"}
  else{ return "";}
}
//Form Builder for Care Plan Template ends

//Form Builder for Patient Care Plan starts
function patientCarePlanResponseBuilder(response_type,i,format_type,value){
  var ret_string = '';
  //numeric
  if(response_type == "numeric"){
    if(value){
      if(format_type == "BloodPressure(mmHg)"){
        ret_string = '<div><span class = "dia-care-plan">Diastolic</span>&nbsp;&nbsp;&nbsp;<input type="text" value = "'+value.bp_diastolic+'" id = "patient_bp_diastolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div><div><span class = "sys-care-plan">Systolic</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value = "'+value.bp_systolic+'" id = "patient_bp_systolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div><br><div><input type="checkbox" style="visibility:visible" id = "patient_cp_reports'+i+'"> Reports <input type="checkbox" style="visibility:visible" id = "patient_cp_alerts'+i+'"> Alerts</div>';
      }else{
        ret_string = '<div><input type="text" value = "'+value+'" id = "patient_pf_numeric'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div><div><input type="checkbox" style="visibility:visible" id = "patient_cp_reports'+i+'"> Reports <input type="checkbox" style="visibility:visible" id = "patient_cp_alerts'+i+'"> Alerts</div>';
      }
    }else{
      if(format_type == "BloodPressure(mmHg)"){
        ret_string = '<div><span class = "dia-care-plan">Diastolic</span>&nbsp;&nbsp;&nbsp;<input type="text" id = "patient_bp_diastolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label><br></div><div><span class = "sys-care-plan">Systolic</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id = "patient_bp_systolic'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label><br></div><div><input type="checkbox" style="visibility:visible" id = "patient_cp_reports'+i+'"> Reports <input type="checkbox" style="visibility:visible" id = "patient_cp_alerts'+i+'"> Alerts</div>';
      }else if(format_type == "Kilometers"){
          ret_string = '<div><input type="text" id = "patient_pf_numeric'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div>';
      }
      else{
        ret_string = '<div><input type="text" id = "patient_pf_numeric'+i+'">&nbsp;<label>'+carePlanFormatBuilder(format_type)+'</label></div><div><input type="checkbox" style="visibility:visible" id = "patient_cp_reports"> Reports <input type="checkbox" style="visibility:visible" id = "patient_cp_alerts"> Alerts</div>';
      }
    }
  }
  //string
  else if(response_type == "string"){
    if(value){
      ret_string = '<input type = "text" value = "'+value+'" id = "patient_pf_string'+i+'">&nbsp;<label>'+patientCarePlanFormatBuilder(format_type)+'</label>';
    }else{
      ret_string = '<input type = "text"  class = "pf_response'+i+'" id = "patient_pf_string'+i+'">&nbsp;<label>'+patientCarePlanFormatBuilder(format_type)+'</label>';
    } 
  }
  //Boolean
  else if(response_type == "boolean"){
    if(format_type == "on-off"){ret_string = patientCarePlanBooleanInputs("on-off",i,value);}
    else if(format_type == "true-false"){ret_string = patientCarePlanBooleanInputs("true-false",i,value);}
    else {ret_string = patientCarePlanBooleanInputs("yes-no",i,value);}
  }
  //multiple
  else if(response_type == "multiple"){
    if(format_type == "daysBeforeAfter"){ret_string = patientDaysBeforeAfter(i);}
    else if(format_type == "weekly"){ret_string = patientWeekly(i);}
    else{ret_string = patientTimeOfTheDay(i);}
  }
  //Time
  else if(response_type == "time"){
    ret_string = '<label>Time</label><input type = "time" id = "patient_pf_time'+i+'">';
  }
  //Start Date/End Date
  else if(response_type == "start-end-date"){
    ret_string = '<label> Start Date ::</label><input type = "text"  class = "datetime cust-date" id = "patient_pf_start_date'+i+'"><label> End Date &nbsp;&nbsp;::</label><input type = "text"  class = "datetime cust-date" id = "patient_pf_end_date'+i+'">';
  }
  //no response  
  else{
    ret_string = "not found";
  }
return ret_string;
}

function patientCarePlanBooleanInputs(response,i,value){
  if(response == "yes-no"){
    if(value == "yes"){temp_string = '<input type="radio" name="patient_radio'+i+'" value = "yes" checked = "checked">Yes &nbsp;<input type="radio" id="" name="patient_radio'+i+'" value = "no" >No';}
    else{temp_string = '<input type="radio" name="patient_radio'+i+'" value = "yes">Yes &nbsp;<input type="radio" id="" name="patient_radio'+i+'" checked = "checked" value = "no">No';}  
  }else if(response == "on-off"){
    if(value == "on"){temp_string = '<input type="radio" name="patient_radio'+i+'" value = "on" checked = "checked">On &nbsp;<input type="radio" id="" name="patient_radio'+i+'" value = "off" >Off';}
    else{temp_string = '<input type="radio" name="patient_radio'+i+'" value = "on">On &nbsp;<input type="radio" id="" name="patient_radio'+i+'" checked = "checked" value = "Off">Off';}  
  }else{
    if(value == "true"){temp_string = '<input type="radio" name="patient_radio'+i+'" value = "true" checked = "checked">True &nbsp;<input type="radio" id="" name="patient_radio'+i+'" value = "false" >False';}
    else{temp_string = '<input type="radio" name="patient_radio'+i+'" value = "true">True &nbsp;<input type="radio" id="" name="patient_radio'+i+'" checked = "checked" value = "false">False';}  
  }
  return temp_string;
}

function patientDaysBeforeAfter(i){
  temp_string = '<div style="text-align: left;"><span style="margin-left: 6px;">Days Before</span><span style="margin-left: 195px;">Days After</span></div><div class="btn-toolbar" role="toolbar" style="margin-left: 0px;"><div style="" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist-first" role="group" db_update_value="7">7</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" style="" db_update_value="6">6</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" db_update_value="5">5</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" db_update_value="4">4</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" db_update_value="3">3</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" db_update_value="2">2</div><div role="group" class="btn-group pd-before-cmn'+i+' pd-before-click weeklist" db_update_value="1">1</div><div role="group" class="btn-group patient-btn-group" style="padding: 5px 7px; height: 30px; border-right: 1px solid grey; margin-left: 0px; background-color: rgb(235, 134, 19);">N</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "1">1</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "2">2</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "3">3</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "4">4</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "5">5</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist" da_update_value = "6">6</div><div role="group" class="btn-group pd-after-cmn'+i+' pd-after-click weeklist-last" da_update_value = "7">7</div></div><br>';
  return temp_string;
}

function patientWeekly(i){
  temp_string = '<div class="btn-toolbar" role="toolbar" style="margin-left: 60px;"><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist-first" role="group" week_update_value = "sun">Sun</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist" role="group" week_update_value = "mon">Mon</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist" role="group" week_update_value = "tue">Tue</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist" role="group" week_update_value = "wed">Wed</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist" role="group" week_update_value = "thu">Thu</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist" role="group" week_update_value = "fri">Fri</div><div class="btn-group patient-btn-group'+i+' patient-btn-click weeklist-last" role="group" week_update_value = "sat">Sat</div></div><br>';
  return temp_string;
}

function patientTimeOfTheDay(i){
  temp_string = '<input type="checkbox" class = "patient_chk'+i+'" value = "morning">Morning &nbsp;<input type="checkbox" class = "patient_chk'+i+'" value = "afternoon">Afternoon &nbsp;<input type="checkbox" class = "patient_chk'+i+'" value = "evening">Evening &nbsp;<input type="checkbox" class = "patient_chk'+i+'" value = "night">Night<br>';
  return temp_string;
}

function patientCarePlanFormatBuilder(format_type){
  if(format_type == "HeartRate(bpm)"){ return "bpm"}
  else if(format_type == "BloodPressure(mmHg)"){ return "mm Hg"}
  else if(format_type == "Glucose"){return "glucose"}
  else if(format_type == "Kilogram(kg)"){return "kg"}
  else if(format_type == "Respiration_Rate(bpm)"){return "bpm"}
  else if(format_type == "Oxygen_Sat(%)"){return "%"}
  else if(format_type == "Kilometers"){return "kms"}
  else{ return "";}
  
}

function generateRFPairArray () {
  var temp_array = [];
  $(".rf-pair-cmn").each(function(){
    temp_array.push({
      format_type :$(this).attr('format_val'),
      response_type : $(this).attr('response_val')
    });
  });
  return temp_array;
}

function generateRFPairCombobox(){
  var count = new Number($(".rf-pair-cmn:last").attr("count")) + 1;
    var rf_pair_data = '';

    rf_pair_data +='<tr class = "rf-pair-cmn" response_val = "boolean" format_val = "on-off" count = "'+count+'"><td><select count = "'+count+ '" class = "form-control cmn-rf-pair-res"><option value = "boolean" >boolean</option><option value = "string">string</option><option value = "numeric">numeric</option><option value = "multiple">multiple</option><option value = "time">Time</option><option value = "start-end-date">Start Date/End Date</option></select></td><td><select id = "frmt_cp_id'+count+'" count = "'+count+'" class = "form-control cmn-rf-pair-frmt"><option value="on-off">On/Off</option><option value = "true-false">true/false</option><option value = "yes-no">Yes-No</option></select></td><td><span class="label label-warning pointer remove-rf-pair" count = "'+count+'">Delete</span></td></tr>';
      
    $("#rf_pair_table tbody").append(rf_pair_data);
}

function AddItem(Text,Value,frmtid){
  $("#"+frmtid).append("<option value = "+Value+">"+Text+"</option>")
}

function getCarePlanList(){
  var doctor_id = pd_data._id;
  $('#cplan_current_list thead').html('<tr><th>Care Plan List :</th><th>specialization</th><th>Publish</th></tr>'); 
  $('#cplan_current_list tbody').html('');
  $.couch.db(db).view("tamsa/getCarePlans", {
    success: function(data) {
      var careplan_tbody = '';

      for (var i = 0; i < data.rows.length; i++) {
        careplan_tbody += '<tr><td>'+data.rows[i].value.template_name;

        if (data.rows[i].value.doctor_id == pd_data._id) {
          careplan_tbody  += '&nbsp; &nbsp; &nbsp;<span class="glyphicon glyphicon-trash delete_cplan pointer" data-target="#delete_cplan_modal" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data.rows[i].id+'" rev="'+data.rows[i].value._rev+'"></span><a data-toggle="tab" class="edit_care_plan" index="'+data.rows[i].id+'"><span class="glyphicon glyphicon-pencil pointer" role="button" class="dropdown-toggle"></span></a></td><td>'+data.rows[i].value.specialization+'</td><td>'+data.rows[i].value.publish+'</td></tr>';
        }
        else {
          careplan_tbody += '</td></tr>';
        }
      };
      $("#cplan_current_list tbody").html(careplan_tbody);
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [doctor_id],
    endkey: [doctor_id, {},{}]
  });
}

function chooseCarePlanList(id){
  $.couch.db(db).view("tamsa/getCarePlans", {
    success: function(data) {
      if (data.rows.length > 0) {
        paginationConfiguration(data,"mypractise_careplan_pagination",15,displayCarePlanList);
      }
      else {
        var all_practise_care_plans=[];
        all_practise_care_plans.push('<tr><td colspan="2">No Care Plans Found</td></tr>');
        $("#all_practise_care_plans tbody").html(all_practise_care_plans.join(''));
      }
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [pd_data._id],
    endkey:   [pd_data._id,{},{}]
  }); 
}

function displayCarePlanList(start,end,data){
  var all_practise_care_plans=[];
  for (var i = start; i<end; i++) {
    all_practise_care_plans.push('<tr><td class="hovercolor pointer care_plan_results text-align" doc_id="'+data.rows[i].id+'">'+data.rows[i].value.template_name+'</td><td class="list-group-item col-md-6 text-align" doc_id="'+data.rows[i].id+'">'+data.rows[i].value.specialization+'</td><td class="text-align">');
    if(data.rows[i].value.careplan_description){
      all_practise_care_plans.push(''+data.rows[i].value.careplan_description+'</td></tr>');  
    }else{
      all_practise_care_plans.push('N/A</td></tr>');  
    }
    
  }
  $("#all_practise_care_plans tbody").html(all_practise_care_plans.join(''));
}

function chooseCommunityCarePlanList(id){
  $.couch.db(db).view("tamsa/getCommunityCarePlans", {
    success: function(data) {
      if (data.rows.length > 0) {
        paginationConfiguration(data,"community_careplan_pagination",15,displayCommunityCarePlanList);
      }
      else {
        var all_community_care_plans = [];

        all_community_care_plans.push('<tr><td id="thresholds_link" class="hoverme pointer text-align">Heart Failure Care Plan</td><td class="text-align">NA</td><td class="text-align">NA</td></tr>');
        all_community_care_plans.push('<tr><td id="thresholds_generic_care_link" class="hoverme pointer text-align">Generic care plan</td><td class="text-align">NA</td><td class="text-align">NA</td></tr>');
        
        $("#all_community_care_plans tbody").html(all_community_care_plans.join(''));
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  }); 
}

function displayCommunityCarePlanList(start,end,data){
  var all_community_care_plans = [];
  all_community_care_plans.push('<tr><td id="thresholds_link" class="hoverme pointer text-align">Heart Failure Care Plan</td><td class="text-align">NA</td><td class="text-align">NA</td></tr>');
  all_community_care_plans.push('<tr><td id="thresholds_generic_care_link" class="hoverme pointer text-align">Generic care plan</td><td class="text-align">NA</td><td class="text-align">NA</td></tr>');
  for (var i=start; i<end; i++) {
    all_community_care_plans.push('<tr><td class="hoverme pointer care_plan_results text-align" doc_id="'+data.rows[i].id+'">'+data.rows[i].value.template_name+'</td><td class="text-align" doc_id="'+data.rows[i].id+'">'+data.rows[i].value.specialization+'</td><td class="text-align">');
    if(data.rows[i].value.careplan_description){
      all_community_care_plans.push(''+data.rows[i].value.careplan_description+'</td></tr>');  
    }else{
      all_community_care_plans.push('N/A</td></tr>');  
    }
  }
  $("#all_community_care_plans tbody").html(all_community_care_plans.join(''));
}

function prescribedPatientPastCarePlanList(){
  console.log("call");
  // $.couch.db(db).view("tamsa/getPatientCarePlan", {
  //   success: function(data) {
  //     var all_practise_care_plans_list = [];
      
  //   },
  //   error: function(status) {
  //     console.log(status);
  //   },
  //   startkey: [userinfo.user_id,0],
  //   endkey:   [userinfo.user_id,0,{}]
  // });
}

function prescribedPatientCarePlanList(charting_care_plans,charting_past_care_plans){
  $("#patient_care_plans_summary").find(".careplanlist").block({'msg':"Please Wait...."});
  $.couch.db(db).list("tamsa/getAdherenceForPatientCareplan", "getPatientCarePlanDetails", {
  startkey:[userinfo.user_id],
  endkey:[userinfo.user_id,{}],
  include_docs:true
  }).success(function(data){
    $("#patient_care_plans_summary").find(".careplanlist").unblock();
    if(data.rows.length > 0) {
      if (data.rows.length > 0) {
        if(charting_care_plans){
          paginationConfiguration(data,"current_prescribed_care_plan_chart",15,displayCurrentlyPrecribedPatientCarePlan,charting_care_plans);
        }else{
          paginationConfiguration(data,"currently_prescribed_care_plan",15,displayCurrentlyPrecribedPatientCarePlan);  
        }
      }else {
        if(charting_care_plans){
        $("#"+charting_care_plans+" tbody").html('<tr><td colspan="5"><span class="list-group-item">No Care Plans Found.</span></td></tr>');
        }else{
          $("#prescribed_patient_care_plans tbody").html('<tr><td colspan="7"><span class="list-group-item">No Care Plans Found.</span></td></tr>');
        }
      }
      if(data.past_rows.length > 0) {
        if(charting_past_care_plans){
          var my_data = {"rows":data.past_rows};
          paginationConfiguration(my_data,"past_prescribed_care_plan_chart",15,displayPastPrecribedPatientCarePlan,charting_past_care_plans);
        }else{
          var my_data = {"rows":data.past_rows};
          paginationConfiguration(my_data,"past_prescribed_care_plan",15,displayPastPrecribedPatientCarePlan);
        }
      }else {
        if(charting_past_care_plans){
          $("#"+charting_past_care_plans+" tbody").html('<tr><td colspan="5"><span class="list-group-item">No Care Plans Found.</span></td></tr>');
        }else{
          $("#prescribed_patient_care_plans_past tbody").html('<tr><td colspan="7"><span class="list-group-item">No Care Plans Found.</span></td></tr>');
        }
      }
    }else {
      if(charting_past_care_plans){
        $("#"+charting_care_plans+" tbody, #"+charting_past_care_plans+" tbody").html('<tr><td colspan="5"><span class="list-group-item">No Care Plans Found.</span></td></tr>');  
      }else{
        $("#prescribed_patient_care_plans tbody, #prescribed_patient_care_plans_past tbody").html('<tr><td colspan="7"><span class="list-group-item">No Care Plans Found.</span></td></tr>');  
      }
    }
  });
}

function displayCurrentlyPrecribedPatientCarePlan(start,end,data,chart_current_id) {
  var all_practise_care_plans_list = [];
  for (var i=start; i<end; i++) {
    if(chart_current_id){
      all_practise_care_plans_list.push('<tr><td><span class="text-align">'+data.rows[i].value.template_name+'</span></td><td id="doctorid_'+data.rows[i].value._id+'"></td><td>'+data.rows[i].value.specialization+'</td><td>'+data.rows[i].value.cp_startdate+'</td><td>'+data.rows[i].value.cp_enddate+'</td>');
    }else{
      all_practise_care_plans_list.push('<tr data-doc_id="'+data.rows[i].value._id+'" data-doc_rev="'+data.rows[i].value._rev+'"><td><span class="patient_care_plan text-align pointer hovercolor">'+data.rows[i].value.template_name+'</span></td><td>'+data.rows[i].value.cp_startdate+'</td><td>'+data.rows[i].value.cp_enddate+'</td>');
      if(data.rows[i].value.sync_status) {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-ok" style="cursor:auto;color:green"></span></td>');
      }else{
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-remove" style="cursor:auto;color:red"></span></td>');
      }
      all_practise_care_plans_list.push('<td>'+ (data.rows[i].adherence ? ('<span title="'+data.rows[i].adherence_title+'" style="color:'+data.rows[i].adherence.toLowerCase()+'" class="glyphicon glyphicon-flag"></span>') : "NA")+'</td>');
      if(data.rows[i].value.engagement_status) {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-ok" style="cursor:auto;color:green"></span></td>');
      }else {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-remove" style="cursor:auto;color:red"></span></td>');
      }
      all_practise_care_plans_list.push('<td style="text-align:center;"><span class="label label-warning summary-view" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">view</span><span class="label label-warning summary-stop" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">Stop</span><span class="label label-warning summary-update" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">Update</span><span class="label label-warning summary-visulize" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">Visulize</span></td>');
    }
  }
  if(chart_current_id){
    $("#"+chart_current_id+" tbody").html(all_practise_care_plans_list.join(''));
    for (var i=start; i<end; i++) {
      getDoctorName(data.rows[i].value.doctor_id,data.rows[i].value._id)
    }
  }else{
    $("#prescribed_patient_care_plans tbody").html(all_practise_care_plans_list.join(''));
  }
}

function displayPastPrecribedPatientCarePlan(start,end,data,charting_id) {
  var all_practise_care_plans_list = [];
  for (var i=start; i<end; i++) {
    if(charting_id){
      all_practise_care_plans_list.push('<tr><td><span class="text-align">'+data.rows[i].value.template_name+'</span></td><td id="doctorid_'+data.rows[i].value._id+'"></td><td>'+data.rows[i].value.specialization+'</td><td>'+data.rows[i].value.cp_startdate+'</td><td>'+data.rows[i].value.cp_enddate+'</td>');
    }else{
      all_practise_care_plans_list.push('<tr data-doc_id="'+data.rows[i].value._id+'" data-doc_rev="'+data.rows[i].value._rev+'"><td><span class="patient_care_plan text-align pointer hovercolor">'+data.rows[i].value.template_name+'</span></td><td>'+data.rows[i].value.cp_startdate+'</td><td>'+data.rows[i].value.cp_enddate+'</td>');
      if(data.rows[i].value.sync_status) {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-ok" style="cursor:auto;color:green"></span></td>');
      }else {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-remove" style="cursor:auto;color:red"></span></td>');
      }
      all_practise_care_plans_list.push('<td>'+ (data.rows[i].adherence ? ('<span title="'+data.rows[i].adherence_title+'" style="color:'+data.rows[i].adherence.toLowerCase()+'" class="glyphicon glyphicon-flag"></span>') : "NA")+'</td>');
      if(data.rows[i].value.engagement_status) {
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-ok" style="cursor:auto;color:green"></span></td>');
      }else{
        all_practise_care_plans_list.push('<td><span class="glyphicon glyphicon-remove" style="cursor:auto;color:red"></span></td>');
      }
      all_practise_care_plans_list.push('<td style="text-align:center;"><span class="label label-warning summary-view">view</span><span class="label label-warning summary-update" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">Update</span><span class="label label-warning summary-visulize" doc_id="'+data.rows[i].value._id+'" doc_rev="'+data.rows[i].value._rev+'">Visulize</span></td>');
    } 
  }
  if(charting_id){
    $("#"+charting_id+" tbody").html(all_practise_care_plans_list.join(''));
    for (var i=start; i<end; i++) {
      getDoctorName(data.rows[i].value.doctor_id,data.rows[i].value._id)
    }
  }else{
    $("#prescribed_patient_care_plans_past tbody").html(all_practise_care_plans_list.join(''));
  }
}

function getDoctorName(id,div_id){
  $.couch.db(replicated_db).openDoc(id, {
    success:function(doctor_info){
      var name = doctor_info.first_name+" "+doctor_info.last_name;
      $("#doctorid_"+div_id).html(name);
    },
    error:function(data,status){
      console.log(data);
    }
  });
}

function openChooseCarePlans(){
  $(".tab-pane").removeClass("active");
  $('#search_practise_care_plan').val('');
  $("#choose_care_plan_list").addClass("active");
  $("#saved_patient_care_plan_tab, #thresholds, #save_care_plan_tab, #thresholds_generic_care").hide();
  $("#search_care_plan_tab").show();
  $("#back_to_choose_care_plan").show();
  activateMyPracticeCareplan();
}

function activateMyPracticeCareplan(){
  $("#community_tab, #patient_care_plans_summary").removeClass("active");
  $("#my_practise_tab").addClass('active');
  $("#my_practise_link").parent().find("div").removeClass('ChoiceTextActive');
  $("#my_practise_link").addClass('ChoiceTextActive');
  chooseCarePlanList("all_practise_care_plans");
}

function activateCommunityCareplan(){
  $("#my_practise_tab, #patient_care_plans_summary").removeClass("active");
  $("#community_tab").addClass('active');
  $("#careplan_community_link").parent().find("div").removeClass('ChoiceTextActive');
  $("#careplan_community_link").addClass('ChoiceTextActive');
  chooseCommunityCarePlanList("all_community_care_plans");
}

function getPrescribedDoctorNamesForCarePlans(id){
  $(".careplan-doctor-name").each(function(){
    $.couch.db(replicated_db).openDoc($(this).attr("doctorid"),{
      success:function(data){
        $("#"+id+" tbody").find("td[doctorid = '"+data._id+"']").html(data.first_name + " " + data.last_name);
      },
      error:function(data,error,reason){
        newAlert('danger',"doctor data is missing.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  });
}

function checkExistingCarePlans(data){
  for(var i=0;i < data.rows.length; i++){
    if((data.rows[i].value.template_name == $("#cplan_name").val()) && (data.rows[i].value.specialization_name == $("#specialization_name").val())){
      newAlert('success', 'Care Plan already exists in Community');
      $('html, body').animate({scrollTop: 0}, 'slow');
      chk_exisitng = true;
      return true;
    }else{
      return false;
    }
  }
}

function generatefieldArray(){
  var tempfieldArray = [];
  $("#care_plan_field_table .section-table").each(function(){
    var section_name = $(this).attr("sname");
    var field_list   = [];
      $(this).find(".careplan-rows").each(function(){
          var field_response={};
          if($(this).find(".cp_boolean").find('select')){  
            field_response.boolean_response = $(this).find(".cp_boolean").find('select').val();
          }
          if($(this).find(".cp-response-val").val() != "Select Response"){
            field_response.frequency = $(this).find(".cp-response-val").val();
            if(section_name != "Health Screening" && section_name != "Patient Education" && section_name != "Fitness"){
              field_response.response_format_pair = {};        
              field_response.response_format_pair.include_2x3x_hourly = true;
              field_response.response_format_pair.start_end_date = true;
              field_response.response_format_pair.occurance_days = $(this).find(".cp_freqency_days_select").val();
              if($(this).find('.chk_include').prop('checked') == true){
                field_response.response_format_pair.include_2x3x_hourly = true;
              }else{
                field_response.response_format_pair.include_2x3x_hourly = false; 
              }
              if($(this).find('.include_text').prop('checked') == true){
                field_response.response_format_pair.include_textbox = true;
              }else{
                field_response.response_format_pair.include_textbox = false;
              }
            }
            
          }
          field_list.push({
              field_name : $(this).find(".careplan_label").val(),
              field_response: field_response
          })
      });
      tempfieldArray.push({
        section_name: section_name,
        section_fields: field_list
      });
  });
  return tempfieldArray;
}

function displayCarePlan(current_doc_id){
  $("#search_care_plan_tab, #saved_patient_care_plan_tab, #thresholds, #thresholds_generic_care").hide();
  $("#save_care_plan_tab").show();
  $("#cp_daily").attr("checked","checked");
  $.couch.db(db).openDoc(current_doc_id, {
    success: function(data) {
      $("#selected_care_plan_name").val(data.template_name);
      $('#activity_list thead').html('<tr><th>Include</th><th>Activity Name</th><th>Response Value</th></tr>');
      $('#activity_list .careplan-tbody').html('');
      var freq_flag     = true;
      var activity_data = [];

      for (var i=0; i<data.fields.length; i++) {
        activity_data.push('<tr careplan_section="'+data.fields[i].section_name+'" class="care-plan-section-rows"><td colspan="3"><table class="table tbl-border"><tbody><tr><td colspan="3"><div class="careplan-display-section-parent"><span class="careplan-display-section-name">'+data.fields[i].section_name+'</span></div></td></tr>');
        if(data.fields[i].section_fields){
          for(var j=0; j<data.fields[i].section_fields.length;j++){
            activity_data.push('<tr class="care-plan-field-rows"><td style="width:4%;"><input c_id="'+i+'" type="checkbox" checked="checked" class="checkshow cmn_chk"></td>');
            if(data.fields[i].section_name == "Nutrition/Dietary"){
              activity_data.push('<td><img src="images/icon-1.png" style="margin-right:3px;"><span class="care-plan-field-name">'+data.fields[i].section_fields[j].field_name+'</span></td>');  
            }else{
              activity_data.push('<td class="care-plan-field-name" style="width:17%;">'+data.fields[i].section_fields[j].field_name+'</td>');
            }
            if(data.fields[i].section_name == "Health Screening" || data.fields[i].section_name == "Fitness" || data.fields[i].section_name == "Patient Education" || data.fields[i].section_name == "Nutrition/Dietary"){
              activity_data.push('<td><table class="careplan-response-format-values"><tbody><tr class="careplan-inner-row" selected_boolean="'+data.fields[i].section_fields[j].field_response.boolean_response+'"><td>');
            }else{
              if(data.fields[i].section_name != "Health Screening" && data.fields[i].section_name != "Patient Education" && data.fields[i].section_name != "Fitness" && data.fields[i].section_name != "Nutrition/Dietary"){
                  activity_data.push('<td><table class="careplan-response-format-values"><tbody><tr class="careplan-inner-row" occurance="'+data.fields[i].section_fields[j].field_response.response_format_pair.occurance_days+'"><td>');  
              }
            }
            
            activity_data.push(generateCarePlanResponseFormate1(data.fields[i].section_fields[j],data.fields[i].section_name));
            
            activity_data.push('</td></tr>');
            activity_data.push('</tbody></table></td></tr>');
          }
        }
        activity_data.push('</tbody></table>');
      }  
      $("#activity_list .careplan-tbody").html(activity_data.join(''));
      $("#care_plan_save_button_parent").html('<div class="col-lg-12"><label class="label label-warning pointer" style="margin-left: 20px; margin-top: 19px; float: left; padding: 9px;" id="save_toggle_careplan_summary">Show Summary</label><label class="label label-warning pointer" style="margin-left: 20px; margin-top: 19px; float: left; padding: 9px;display:none;" id="save_refresh_careplan_summary">Refresh Summary</label></div><div class="col-lg-12"><ol style="display:none; float: left; width: 100%;" id="save_careplan_summary_list"></ol></div><div class="col-lg-12 col-sm-12 text-center mrgtop2"><button type="button" class="btn btn-warning btnwidth" id="save_patient_care_plan" template_doc_id = "'+current_doc_id+'" doc_id = "" doc_rev = "" title = "Save Care Plan for Patient">Save</button></div>');
      $("#selected_care_plan_name").html(data.template_name);
    },
    error: function(status) {
      console.log(status);
    }
  });
}

function saveCarePlan(publish,specialization){
  if($("#specialization_name_by_text").val() != ""){
    var specialization_value = $("#specialization_name_by_text").val().trim();
  }else {
    var specialization_value = $("#specialization_name").val().toString().trim();
  }
  var d = new Date();
  var cplan_doc = {
    doctor_id:            pd_data._id,
    template_name:        $("#cplan_name").val(),
    doctype:              "careplan_template",
    update_ts:            d,
    publish:              publish,
    specialization:       specialization_value,
    careplan_description: $("#careplan_description").val(),
    fields:               generatefieldArray()
  };
  //return false;
  if($("#save_cplan_template").attr("index") &&  $("#save_cplan_template").attr("rev")){
    cplan_doc._id  = $("#save_cplan_template").attr("index"),
    cplan_doc._rev = $("#save_cplan_template").attr("rev")

    $.couch.db(db).openDoc($("#save_cplan_template").attr("index"), {
      success: function(data) {
        $.couch.db(db).saveDoc(cplan_doc, {
          success: function(data) {
            $("#save_cplan_template").attr("index","");
            $("#save_cplan_template").attr("rev","");
            $("#save_cplan_template").attr("newindex","");
            $("#save_cplan_template").attr("newrev","");
            $('#cplan_field_modal').modal("hide");
            $("#back_to_cplan_list").trigger('click');
            newAlert("success", "care plan updated successfully.");
            $('html, body').animate({scrollTop: $("#new_cplan_tab").offset().top - 100}, 1000);
            existingCarePlanSearch(data.id);
            $('.cplan_current_list').hide();
            saveAuditRecord("Careplan","Update","Careplan Updated Successfully.");
            updateSpecializationList(specialization_value);
          },
          error: function(data, error, reason) {
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            saveAuditRecord("Careplan","Update","Error while Updating Careplan.");
            return false;
          }
        });
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        saveAuditRecord("Careplan","Update","Error while Updating Careplan.");
        return false;
      }
    });
  }else{
    $.couch.db(db).saveDoc(cplan_doc, {
      success: function(data) {
        newAlert("success", "care plan saved successfully.");
        $('html, body').animate({scrollTop: $("#new_cplan_tab").offset().top - 100}, 1000);
        $("#back_to_cplan_list").trigger('click');
        saveAuditRecord("Careplan","Insert","Careplan Build Successfully.");
        updateSpecializationList(specialization_value);
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: $("#new_cplan_tab").offset().top - 100}, 1000);
        saveAuditRecord("Careplan","Insert","Error while Updating Careplan.");
        updateSpecializationList(specialization_value);
        return false;
      }
    });
  }
}
function updateSpecializationList(specialization_value){
  var specialization_key = specialization_value.toLowerCase();
  $.couch.db(db).view("tamsa/getSpecializationList", {
    success:function(data){
      if(data.rows.length > 0){
      }else{
        $.couch.db(db).view("tamsa/getSpecializationList", {
          success:function(data){
            if(data.rows.length > 0){
              var new_list = data.rows[0].value.specialization;
              new_list.push(specialization_key);
              var doc = {
                _id:            data.rows[0].value._id,
                _rev:           data.rows[0].value._rev,
                doctype:        data.rows[0].value.doctype,
                specialization: new_list
              }
              $.couch.db(db).saveDoc(doc,{
                success:function(data){
                },
                error:function(status){
                  console.log(status);
                }
              });
            }
          },
          error:function(status){
            console.log(status);
          },
          key:"specialization_list",
          include_docs:true     
        });
      }  
    },
    error:function(status){
      console.log(status);
    },
    key:specialization_key 
  });      
}

function editCarePlan(index,copy){
  createNewCarePlan();
  $("#toggle_careplan_summary").show();
  $("#toggle_careplan_summary").html("Show Summary");
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      fieldArray = data.fields;
      if(copy == "copy"){
        $("#crt_new_lbl").html("Save Copied");
        $("#cplan_name").val(data.template_name);
        $("#specialization_name").val(data.specialization);
        $("#careplan_description").val(data.careplan_description);
        $("#save_cplan_template").attr("index","");
        $("#save_cplan_template").attr("rev","");
      }else{
        $("#cplan_name").val(data.template_name);
        $("#crt_new_lbl").html("Edit");
        $("#create_new_careplan_link").parent().parent().addClass("active");
        $("#create_new_careplan_sections_parent").parent().removeClass("active");
        $("#create_new_careplan_link").parent().addClass("active");
        $("#specialization_name").val(data.specialization);
        $("#careplan_description").val(data.careplan_description);
        $("#save_cplan_template").attr("index",data._id);
        $("#save_cplan_template").attr("rev",data._rev);  
      }
      var edit_care_plan_tempate = "";
      $("#care_plan_section_name").multiselect("uncheckAll");
      for (var i = 0;i < fieldArray.length;i++) {
        $("#care_plan_section_name").multiselect("widget").find(":checkbox[value='"+fieldArray[i].section_name+"']").trigger("click");
        $("#care_plan_section_name").multiselect("refresh");
      }
      $("#create_new_careplan_sections_link").attr("index",data._id);
   },
    error: function(data,error,reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  });
}

//careplan v2 start here
function updateCarePlanDetails(index){
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      for (var i = 0;i < data.fields.length;i++) {
        $ele = $('#care_plan_field_table').find("[sname='"+data.fields[i].section_name+"']");
          console.log($('#care_plan_field_table').html());
        for(var j=0;j<data.fields[i].section_fields.length;j++){
          if(j!=0){
            $ele.parent().find('.add-more-careplan-section-fields').trigger('click');
          }
          console.log(data.fields[i].section_fields[j].field_name);
          $ele.find('.careplan-rows:last').find('.careplan_label').val(data.fields[i].section_fields[j].field_name);
          if(data.fields[i].section_fields[j].field_response.boolean_response){
            $ele.find('.careplan-rows:last').find('.cp_boolean select').val(data.fields[i].section_fields[j].field_response.boolean_response);
          }
          if(data.fields[i].section_fields[j].field_response.frequency == "Specific Time"){
            $ele.find('.careplan-rows:last').find('.cp-response-val').val('Specific Time').trigger('change');
            if(data.fields[i].section_fields[j].field_response.response_format_pair.include_2x3x_hourly == true){
             $ele.find('.careplan-rows:last').find('.chk_include').prop('checked',true);
             $ele.find('.careplan-rows:last').find('.chk_include').trigger('change');
            }
            $ele.find('.careplan-rows:last').find('.cp_freqency_days_select').val(data.fields[i].section_fields[j].field_response.response_format_pair.occurance_days);
            $ele.find('.careplan-rows:last').find('.cp_freqency_days_select').trigger('change');
            if(data.fields[i].section_fields[j].field_response.response_format_pair.include_textbox == true){
              $ele.find('.careplan-rows:last').find('.include_text').prop('checked',true);
              $ele.find('.careplan-rows:last').find('.include_text').trigger('change');
            }
          }
        }
      }  
    },
    error: function(data,error,reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  });
}

function createSaveRequestForPatientCarePlan($obj){
  if(validationOnSaveCarePlan()){
    $("#save_patient_care_plan").attr("disabled","disabled");
    $.couch.db(db).openDoc($obj.attr("template_doc_id"), {
      success: function(data) {
        $.couch.db(db).view("tamsa/getExistingPatientCarePlan",{
          success:function(exdata){
            if(exdata.rows.length > 0){
              // var new_start_date = $('#cp_startdate').data('daterangepicker').startDate;
              // var new_end_date = $('#cp_startdate').data('daterangepicker').endDate;
              // for(var i=0;i<exdata.rows.length;i++){
              //   checkExistingPatientCarePlans(exdata.rows[i].doc,new_start_date,new_end_date);
              // }
              newAlert("danger","This CarePlan is already beed prescribed to this patient from "+moment(exdata.rows[0].doc.cp_startdate).format("YYYY-MM-DD")+" to "+moment(exdata.rows[0].doc.cp_enddate).format("YYYY-MM-DD"));
              $("html, body").animate({scrollTop :0}, 'slow');
              $("#save_patient_care_plan").removeAttr("disabled");
              return false;
            }else{
              savePatientCarePlan(data);          
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop : 0}, 'slow');
            $("#save_patient_care_plan").removeAttr("disabled");
            return false;
          },
          key:[data.template_name,data.specialization,userinfo.user_id],
          include_docs:true
        });        
      },
      error: function(status) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#save_patient_care_plan").removeAttr("disabled");
        return false;
      }
    });
  }
}

function checkExistingPatientCarePlans(exdata,new_start_date,new_end_date,data){
  var start_date = moment(exdata.cp_startdate)
  var end_date = moment(exdata.cp_enddate)
  if(new_start_date == start_date){
    newAlert("danger","This CarePlan is already beed prescribed to this patient from "+start_date.format("YYYY-MM-DD")+"to"+end_date.format("YYYY-MM-DD"));
    $("html, body").animate({scrollTop :0}, 'slow');
    $("#save_patient_care_plan").removeAttr("disabled");
    return false;
  }else if(new_end_date == end_date){
    newAlert("danger","This CarePlan is already beed prescribed to this patient from "+start_date.format("YYYY-MM-DD")+"to"+end_date.format("YYYY-MM-DD"));
    $("html, body").animate({scrollTop :0}, 'slow');
    $("#save_patient_care_plan").removeAttr("disabled");
    return false;
  }else if(new_start_date >= start_date && new_start_date < end_date){
    newAlert("danger","This CarePlan is already beed prescribed to this patient from "+start_date.format("YYYY-MM-DD")+"to"+end_date.format("YYYY-MM-DD"));
    $("html, body").animate({scrollTop :0}, 'slow');
    $("#save_patient_care_plan").removeAttr("disabled");
    return false;
  }else if(new_end_date > start_date && new_end_date <= end_date){
    newAlert("danger","This CarePlan is already beed prescribed to this patient from "+start_date.format("YYYY-MM-DD")+"to"+end_date.format("YYYY-MM-DD"));
    $("html, body").animate({scrollTop :0}, 'slow');
    $("#save_patient_care_plan").removeAttr("disabled");
    return false;
  }else if(new_start_date < start_date && new_end_date > end_date){
    newAlert("danger","This CarePlan is already beed prescribed to this patient from "+start_date.format("YYYY-MM-DD")+"to"+end_date.format("YYYY-MM-DD"));
    $("html, body").animate({scrollTop :0}, 'slow');
    $("#save_patient_care_plan").removeAttr("disabled");
    return false;
  }else{
    savePatientCarePlan(data);
  }
}

function savePatientCarePlan(data){
  var d = new Date();
  var savefieldsArray = [];
  var chk_freq = false;
  var patient_cplan_doc = {
    doctor_id:         pd_data._id,
    template_name:     data.template_name,
    doctype:           "patient_careplan",
    update_ts:         d,
    publish:           data.publish,
    specialization:    data.specialization,
    user_id:           userinfo.user_id,
    active:            "yes",
    sync_status:       false,
    engagement_status: false,
    fields:            generatePatientCarePlanFiledArray()
  }
  // console.log(patient_cplan_doc);
  if($('#cp_weekly_reports').prop('checked') == true) {
    patient_cplan_doc.report_frequancy = $('#cp_weekly_reports').val();
  }else if($('#cp_three_day_reports').prop('checked') == true){
    patient_cplan_doc.report_frequancy =  $('#cp_three_day_reports').val();
  }else if ($('#cp_daily').prop('checked') == true) {
    patient_cplan_doc.report_frequancy =  $('#cp_daily').val();
  }
  patient_cplan_doc.cp_startdate = $('#cp_startdate').data('daterangepicker').startDate.format("YYYY-MM-DD");
  patient_cplan_doc.cp_enddate   = $('#cp_startdate').data('daterangepicker').endDate.format("YYYY-MM-DD");
  if($("#save_patient_care_plan").attr("doc_rev")){
    patient_cplan_doc._id  = $("#save_patient_care_plan").attr("doc_id");
    patient_cplan_doc._rev = $("#save_patient_care_plan").attr("doc_rev");
  }
  if(chk_freq){
    patient_cplan_doc.report_freq = cp_freq;
  }
  $.couch.db(db).saveDoc(patient_cplan_doc,{
    success: function(data){
      if($("#save_patient_care_plan").attr("doc_rev")){
        newAlert('success', 'Care Plan updated successfully!');  
        $("#choose_care_plan_link").trigger("click");
      }else{
        newAlert('success', 'Care Plan added successfully!');
      }
      $("#save_patient_care_plan").removeAttr("doc_rev");
      $('html, body').animate({scrollTop: 0}, 'slow');
      prescribedPatientCarePlanList();
      $("#save_patient_care_plan").removeAttr("disabled");
      $("#cp_startdate").val("");
      $("#back_to_choose_care_plan").trigger("click");
      return false;
    },
    error:function(data,error,reason){
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#save_patient_care_plan").removeAttr("disabled");
      return false;
    }
  });
}

function generatePatientCarePlanFiledArray(){
  var temp_patients_fields = [];
  $(".care-plan-section-rows").each(function(){
    var section_name = $(this).attr("careplan_section");
    var field_list = [];
    $(this).find(".care-plan-field-rows").each(function(){
      if($(this).find(".cmn_chk").prop("checked")){
        var field_response={};
        var field_name = $(this).find(".care-plan-field-name").html();    
        var response_format_pair = [];
        field_response.field_name = field_name;
        $(this).find(".careplan-response-format-values").each(function(){
          if($(this).find(".cp-boolean-response").length > 0 && $(this).find(".cp-boolean-response").html() != ""){  
            field_response.boolean_response = $(this).find(".cp-boolean-response").html();
          }
          if($(this).find(".save_notes").val() && $(this).find(".save_notes").val() != ""){  
            field_response.doctor_notes = $(this).find(".save_notes").val();
          }
          if($(this).find(".cp_select_time").length > 0 && $(this).find(".select_ampm").length > 0){
            field_response.frequency = $(this).find(".cp_select_time").val()+$(this).find(".select_ampm").val();  
          }
          if($(this).find(".cp-startdate").length > 0 && $(this).find(".cp-startdate").val() != ''){
            field_response.start_date = $(this).find(".cp-startdate").val();
          }
          if($(this).find(".cp-enddate").length > 0 && $(this).find(".cp-enddate").val() != ''){
            field_response.end_date = $(this).find(".cp-enddate").val();
          }
          if($(this).find(".cp_hourly_select").length > 0 && $(this).find(".cp_hourly_select").val() != ''){
            field_response.recurrance_in_a_day = $(this).find(".cp_hourly_select").val();
          }
          if($(this).find('.careplan-inner-row').length > 0){
            if($(this).find('.careplan-inner-row').attr('occurance') == "Specific Day"){
              field_response.format_type = "Specific Day";
              var week_val = [];
              $(this).find(".week-val").each(function(){
                if($(this).hasClass('clicked')){
                  week_val.push($(this).html());
                }
              });
              if(week_val.length > 0){
                field_response.format_value = week_val;
              }
            }else if($(this).find('.careplan-inner-row').attr('occurance') == "Daily"){
              field_response.format_type = "Daily";
              // field_response.format_value = "Everyday";
            }else if($(this).find('.careplan-inner-row').attr('occurance') == "Weekly"){
              field_response.format_type = "Weekly";
              // field_response.format_value = "Every Week";
            }else if($(this).find('.careplan-inner-row').attr('occurance') == "Days Before/After"){
              var days_before = [],days_after = [];
              $(this).find(".d-before-click").each(function(){
                if($(this).hasClass('clicked')){
                  days_before.push($(this).html());
                }
              });
              $(this).find(".d-after-click").each(function(){
                if($(this).hasClass('clicked')){
                  days_after.push($(this).html());
                }
              });
              if(days_before.length > 0 || days_after.length > 0){
                var fields_value = [];
                fields_value.push($(this).find(".cp-ndate").val());
                field_response.format_type = "Days Before/After";
                field_response.format_value = fields_value;
                field_response.days_before = days_before;
                field_response.days_after = days_after
              }
            }
          }
          if($(this).find(".chk_sms_alert").length > 0){
            field_response.field_alert            = $(this).find(".chk_sms_alert").prop("checked");
            field_response.field_alert_low_limit  = ($(this).find(".sms_alerts_low").val() ? $(this).find(".sms_alerts_low").val() : "");
            field_response.field_alert_high_limit = ($(this).find(".sms_alerts_high").val() ? $(this).find(".sms_alerts_high").val() : "");
          }
        });
        // if(section_name != "Health Screening" && section_name != "Patient Education" && section_name != "Fitness"){
        //   field_response.response_format_pair = response_format_pair;
        // }

        field_list.push(field_response);
      }
    });
    if(field_list.length > 0){
      temp_patients_fields.push({
        section_name:section_name,
        section_fields:field_list
      });
    }  
  });
  return temp_patients_fields;
}

function getCarePlanResponseFormatValues($obj){
  var temp_array = [];
  if($obj.attr("response_type") == "Number"){  
    return $obj.find(".number-val").val(); 
  }else if($obj.attr("response_type") == "Boolean"){
    if($obj.attr("format_type") == "Yes/No") {
      temp_array.push({
        choice: $obj.find(".boolean-val").prop("checked") ? "Yes":"No",
        notes: $obj.find(".boolean-notes").val()
      });
    }else if($obj.attr("format_type") == "True/False"){
      temp_array.push({
        choice: $obj.find(".boolean-val").prop("checked") ? "True":"False",
        notes: $obj.find(".boolean-notes").val()
      });
    }else {
      temp_array.push({
        choice: $obj.find(".boolean-val").prop("checked") ? "Done":"Not Done",
        notes: $obj.find(".boolean-notes").val()
      });
    }
  }else if($obj.attr("response_type") == "Frequency"){
    if($obj.attr("format_type") == "Daily") {
      temp_array.push({
        time:$obj.find(".careplan-time").val()
      });
    }else if($obj.attr("format_type") == "Weekly"){
      var choices = [];
      $obj.find(".careplan-freq-val").find(".week-val").each(function(){
        if($(this).hasClass("clicked")){
          choices.push($(this).html());
        }
      });
      temp_array.push({
        time:$obj.find(".careplan-time").val(),
        week_days:choices
      });
    }else if($obj.attr("format_type") == "Specific Day"){
      temp_array.push({
        date:$obj.find(".careplan-freq-specific-date").val(),
        time:$obj.find(".careplan-time").val()
      });
    }else if($obj.attr("format_type") == "Start Date/End Date"){
      var choices = [];
      $obj.find(".careplan-freq-val").find(".week-val").each(function(){
        if($(this).hasClass("clicked")){
          choices.push($(this).html());
        }
      });
      temp_array.push({
        start_date:$obj.find(".careplan-startdate").val(),
        end_date:$obj.find(".careplan-enddate").val(),
        time:$obj.find(".careplan-time").val(),
        week_days:choices  
      });
    }else if($obj.attr("format_type") == "Days Before/After"){
      var tmp_day_before = [];
      var tmp_day_after = [];
      $obj.find(".careplan-freq-val").find(".d-before-cmn").each(function (){
        if($(this).hasClass('clicked')){tmp_day_before.push($(this).html())}
      });
      $obj.find(".careplan-freq-val").find(".d-after-cmn").each(function (){
        if($(this).hasClass('clicked')){tmp_day_after.push($(this).html())}
      }); 
      temp_array.push({
        time:$obj.find(".careplan-time").val(),
        days_before:tmp_day_before,
        days_after:tmp_day_after
      });
    }else{
      console.log("no format found");
    }
  }else{
    console.log("no response found");
  }
  return temp_array;
}

function generateCarePlanSection(selected_sections,$obj){
  $('#toggle_careplan_summary').show();
  var careplan_data = [];
  if(careplan_data){
    $.couch.db(db).openDoc("careplan_section_list", {
      success:function(data) {
        for(var i=0;i<data.sections.length;i++){
          if(selected_sections.indexOf(data.sections[i].name) > -1){ 
            careplan_data.push('<div class="mrgtop1"><table sname="'+data.sections[i].name+'" class="mrg-top5 table tbl-border section-table"><thead><th class="careplan-section-name" colspan="3">'+data.sections[i].name+'<span class="glyphicon glyphicon-minus toggle-careplan-section-details"></span></th></thead><tbody>');
            careplan_data.push('<tr class="careplan-rows"><td width="30%"><select class="form-control careplan_label">');
            for (var k = 0; k < data.sections[i].fields.length; k++) {
              careplan_data.push('<option>'+data.sections[i].fields[k]+'</option>');
            }
             careplan_data.push('</select></td><td><label style="float: right; padding-bottom: 2px;" class="label label-warning delete-careplan-section pointer" section_name="'+data.sections[i].name+'">Remove</label><div class="">');
            if(data.sections[i].response_type.indexOf("boolean") > -1){
              var boolea = getCarePlanBoolean();
              careplan_data.push(''+boolea+'');
            }
            if(data.sections[i].response_type.indexOf("frequency") > -1){
              var frequency = getCarePlanFrequency();
              careplan_data.push(''+frequency+'');
            }
            if(data.sections[i].response_type.indexOf("notes") > -1){
              var text = getCarePlanTextbox();
              careplan_data.push(''+text+'');
            }
            careplan_data.push('</div></tbody></table><div style="text-align: right; margin-top: 8px;"><label section_name="'+data.sections[i].name+'" class="label label-warning add-more-careplan-section-fields pointer">Add More</label></div></div>');
          }
        }
        $("#care_plan_field_table").html(careplan_data.join(''));
        if($obj.attr("index")){
          updateCarePlanDetails($("#create_new_careplan_sections_link").attr("index"));
        }
      },
      error:function(data,error,reason){
        if(data == 404) {
          $("#current_sections").append("<option value=''>No Sections is availabel.</option>"); 
          console.log("What !!! change in section without any sections leads u here.");
        }else {
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      }
    });
  }else{
    $("#care_plan_field_table").html();
  }
}

function removeCarePlanSection(unselected_section){
  if(unselected_section  == null){
    $("#care_plan_field_table table").parent().remove();
    $('#toggle_careplan_summary').hide(); 
  }else{
    for(var i=0;i<unselected_section.length;i++){
      $("#care_plan_field_table").find("[sname='"+unselected_section[i]+"']").parent().remove();
    }
    if($("#care_plan_field_table table").length == 0) $('#toggle_careplan_summary').hide(); 
    else $('#toggle_careplan_summary').show();
  }
}

function generateCarePlanResponseFormate(section){
  var responseFormateHTML  = '<label style="float: right; padding-bottom: 2px;" class="label label-warning delete-careplan-section pointer" section_name="Medication Management">Remove</label><div class="">';
  if(section == "Biometrics"){
    responseFormateHTML += getCarePlanFrequency();
  }else if (section == "Medication Management") {
    responseFormateHTML += getCarePlanBoolean()+getCarePlanFrequency()+getCarePlanTextbox();
  }else if (section == "Nutrition/Dietary") {
    responseFormateHTML += getCarePlanBoolean()+getCarePlanFrequency();
  }else if (section == "Therapy") {
    responseFormateHTML += getCarePlanBoolean()+getCarePlanFrequency();
  }else if (section == "Health Screening") {
    responseFormateHTML += getCarePlanBoolean();
  }else if (section == "Fitness") {
    responseFormateHTML += getCarePlanBoolean();
  }else if (section == "Patient Education") {
    responseFormateHTML += getCarePlanBoolean();
  }else{
    responseFormateHTML += getCarePlanBoolean();
  }
  responseFormateHTML += "</div>";
  return responseFormateHTML;
}

function generateCarePlanResponseFormate1(savedata,sectionname){
  var responseFormateHTML  = '';
  if(sectionname != "Biometrics") responseFormateHTML += '<span style="margin-left:15px;" value="'+savedata.field_response.boolean_response+'" class="cp-boolean-response">'+savedata.field_response.boolean_response+'</span>';
  if(sectionname != "Health Screening" && sectionname != "Patient Education" && sectionname != "Fitness"){
    if(savedata.field_response.response_format_pair != undefined && (savedata.field_response.response_format_pair.include_textbox != undefined) && (savedata.field_response.response_format_pair.include_textbox == true)){
      responseFormateHTML += '<div class="col-lg-12" style="margin-bottom:7px;"><input type="text" placeholder="Add Your text note here" class="form-control save_notes"></div>';
    }
    if(savedata.field_response.frequency == "Specific Time"){
      responseFormateHTML += '<div class="col-lg-12"><div class="Frequency" style="float:left;width:320px;margin-top:5px;"><select class="form-control cp_select_time" style="float: left; margin-right: 13px; width: 57% ! important;"><option>select time</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select><select class="form-control select_ampm" style="width:31% !important;"><option>AM</option><option>PM</option></select></div><div class="cp_sedate" style="margin-top: 6px;"><div style="float: left; margin-right: 6px; margin-bottom: 7px;"><label>Start Date</label><input type="New Lab" placeholder="YYYY-MM-DD" class="cp-startdate cp-date-single"></div><div style="float:left;"><label>End Date</label><input type="New Lab" placeholder="YYYY-MM-DD" class="cp-enddate cp-date-single" ></div></div>';
      responseFormateHTML += '</div><div class="col-lg-12">';
      if(savedata.field_response.response_format_pair.include_2x3x_hourly == true){
        responseFormateHTML += '<div style="float:left; width: 23%;"><select class="form-control cp_hourly_select" style="display:block;"><option>Twice</option><option>Thrice</option><option>Hourly</option></select></div>';
      }
      if(savedata.field_response.response_format_pair.occurance_days == "Weekly"){
        responseFormateHTML += '<div style="float: left;margin-right: 3px; margin-top: 9px;" class="everyweek">Occurance : Every Week</div>';
      }else if(savedata.field_response.response_format_pair.occurance_days == "Daily"){
        responseFormateHTML += '<div style="float: left;margin-right: 3px; margin-top: 9px;" class="everyday">Occurance : Everyday</div>';
      }else if(savedata.field_response.response_format_pair.occurance_days == "Specific Day"){
        responseFormateHTML += '<div><div role="toolbar" class="btn-toolbar col-lg-7 careplan-freq-val"><div week_value="sun" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist-first" style="">Sun</div><div week_value="mon" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Mon</div><div week_value="tue" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Tue</div><div week_value="wed" role="group" class="btn-group template-btn-group template-btn-click week-val weeklist" style="">Wed</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="thu">Thu</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist" role="group" week_value="fri">Fri</div><div style="" class="btn-group template-btn-group template-btn-click week-val weeklist-last" role="group" week_value="sat">Sat</div></div></div>';
      }else if(savedata.field_response.response_format_pair.occurance_days == "Days Before/After"){
        responseFormateHTML += '<div style="float: left;margin-left: 13px;"><input type="New Lab" placeholder="YYYY-MM-DD" class="cp-ndate cp-date-single"></div><div class="btn-toolbar" role="toolbar" style="float: left; margin-left: 75px;"><span style="margin-left: 6px;">Days Before</span><span style="margin-left: 195px;">Days After</span><div class="btn-toolbar careplan-freq-val" role="toolbar" style=""><div style="" class="btn-group d-before-cmn d-before-click weeklist-first" role="group" db_val="7">7</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="6">6</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="5">5</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="4">4</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="3">3</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="2">2</div><div role="group" class="btn-group d-before-cmn d-before-click weeklist" style="" db_val="1">1</div><div role="group" class="btn-group patient-btn-group" style="padding: 5px 7px; height: 30px; border-right: 1px solid grey; margin-left: 0px; background-color: rgb(235, 134, 19);">N</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "1">1</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "2">2</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "3">3</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "4">4</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "5">5</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist" style="" da_val = "6">6</div><div role="group" class="btn-group d-after-cmn d-after-click weeklist-last" style="" da_val = "7">7</div></div>';
      }
      responseFormateHTML += '</div>';
       if(sectionname == "Biometrics"){
        responseFormateHTML += '<div class="col-lg-5 mrg-top5"><input type="checkbox" style="margin-right: 4px;margin-top:9px;" class="checkshow chk_sms_alert">SMS alerts when readings are above the limits</div><div class="col-lg-2 mrg-top5"><input placeholder="Low" class="form-control sms_alerts_low hidden-lg"></div><div class="col-lg-2 mrg-top5"><input placeholder="High" class="form-control sms_alerts_high hidden-lg"></div>';
      }
    }
  } 
  return responseFormateHTML;
}
function getCarePlanFrequency(){
return '<div class="Frequency"><div class="cp_response"><select class="form-control cp-response-val"><option>Select Response</option><option>Specific Time</option></select></div><div class="cp_include" style="display:none;"><div><input type="checkbox" class="checkshow chk_include" style="margin-right: 4px;"><span style="font-size: 14px;">Include 2X/3X/Hourly</span></div><div><select class="form-control hourly_select" style="display:none;"><option>2X</option><option>3X</option><option>Hourly</option></select></div></div><div class="cp_sedate" style="display:none;"><div><div style="float: left; margin-right: 6px; margin-bottom: 7px;"><label>Start Date</label><input type="text" disabled="disabled" placeholder="YYYY-MM-DD" class="cpstart-date"></div><div style="float:left;"><label>End Date</label><input type="text" disabled="disabled" placeholder="YYYY-MM-DD" class="cpend-date"></div></div><div class="cp_time" style="display:none;"><select class="form-control cp_freqency_days_select" style="width:100% !important;"><option>Daily</option><option>Weekly</option><option>Specific Day</option><option>Days Before/After</option></select><div><div role="toolbar" class="btn-toolbar selected-careplan-freq-val" style="margin-bottom:7px; margin-left: 0px;display:none;"><div week_value="sun" role="group" class="btn-group template-btn-group week-val weeklist-first">Sun</div><div week_value="mon" role="group" class="btn-group template-btn-group week-val weeklist" style="">Mon</div>            <div week_value="tue" role="group" class="btn-group template-btn-group week-val weeklist" style="">Tue</div>            <div week_value="wed" role="group" class="btn-group template-btn-group week-val weeklist" style="">Wed</div><div style="" class="btn-group template-btn-group week-val weeklist" role="group" week_value="thu">Thu</div>            <div style="" class="btn-group template-btn-group week-val weeklist" role="group" week_value="fri">Fri</div>            <div style="" class="btn-group template-btn-group week-val weeklist-last" role="group" week_value="sat">Sat</div></div><div><input type="text" class="datetime selected-careplan-specificdate form-control hasDatepicker" placeholder="YYYY-MM-DD" style="display:none;" disabled="disabled"></div></div></div></div></div>';
}
function getCarePlanBoolean(){
  return '<div class="boolean"><div class="cp_boolean" style="width: 100%; margin-top: 13px;"><select class="form-control" style="margin-bottom:8px;"><option>Yes/No</option><option>True/False</option><option>Done/Not Done</option></select></div>';
}
function getCarePlanTextbox(){
return '<div class="textbox"><input type="checkbox" class="checkshow include_text" style="margin-right:4px;"><span style="font-size: 14px;">Include TextBox</span><input type="text" placeholder="Add Your text note here" disabled="disabled"></div>';
}


function getPatientEducationResponseType(){
  return '<select class="boolean careplan-response form-control"><option>Boolean</option></select>';
}

function getPatientEducationFormatType(){
  return '<select class="boolean careplan-format form-control"><option>Done/Not Done</option><option>Yes/No</option><option>True/False</option></select>'
}

function getBiometricResponseType(){
  return '<select class="boolean careplan-response form-control"><option>Number</option><option>Frequency</option></select>';
}

function getBiometricFormatType(){
  return '<select class="boolean careplan-format form-control"><option>Number</option></select>'
}

function getMedicationManagementResponseType(){
  return '<select class="boolean careplan-response form-control"><option>Boolean</option><option>Frequency</option></select>';
}

function getMedicationManagementFormatType(){
  return '<select class="boolean careplan-format form-control"><option>Done/Not Done</option><option>Yes/No</option><option>True/False</option></select>'
}

function clearCarePlanSections(){
  $("#care_plan_section_name").multiselect("uncheckAll");
  $("#care_plan_field_table table").remove();
  $("#toggle_careplan_summary").hide();
  $("#careplan_summary_list").hide();
}

function toggleCarePlanSectionDetails($obj){
  if($obj.hasClass("glyphicon-plus")){
    $obj.removeClass("glyphicon-plus").addClass("glyphicon-minus");
    $obj.parents("table").find("tbody").show();
  }else{
    $obj.removeClass("glyphicon-minus").addClass("glyphicon-plus");
    $obj.parents("table").find("tbody").hide();
  }
}

function addMoreCarePlanResponseFormat($obj){
  var $ele = $obj.parent().parent().find(".response-format-row:last-child").clone();
  $ele.find(".careplan-response").val($ele.find(".careplan-response").find("option:first").val());
  $ele.find(".remove-careplan-response-format").parent().remove();
  $ele.append('<td><span class="label label-warning remove-careplan-response-format pointer" style="font-size:10px;">Delete</span></td>');
  $obj.parent().parent().find(".response-format-table tbody").append($ele);
  $ele.find(".careplan-response").trigger("change");
}

function removeCarePlanResponseFormat($obj){
  if($obj.parents(".response-format-table").find(".response-format-row").length > 1){
    $obj.parent().parent().remove();
  }
}

function changeCarePlanResponse($obj){
  $frmtobj = $obj.parent().parent().find(".careplan-format");
  $frmtobj.find("option").remove();
  switch($obj.val()){
    case "Boolean" :
      $frmtobj.append('<option>Done/Not Done</option><option>Yes/No</option><option>True/False</option>');
      break;
    case "Add Note" :
      $frmtobj.append('<option>TextBox</option>');
      break;
    case "Frequency" :
      $frmtobj.append('<option>Daily</option><option>Weekly</option><option>Specific Day</option><option>Days Before/After</option><option>Start Date/End Date</option>');
      break;
    case "Number" :
      $frmtobj.append('<option>Number</option>');
      break; 
  }
}

function getVisualizationGraph($obj){
  $("#care_plan_visualization_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  var field_name = $obj.attr("data");
  var sdate = $("#selected_care_plan_name_visulize").attr("data-sdate");
  var edate = $("#selected_care_plan_name_visulize").attr("data-edate");
  var specialization = $("#selected_care_plan_name_visulize").attr("data-special");
  var temp = $("#selected_care_plan_name_visulize").attr("data-temp");
  $("#careplan_visualization_information").html("<div id='careplan_visualization_statistics' style='min-width: 850px; height: 400px; margin: 0 auto'></div>");
  $.couch.db(db).view("tamsa/getPatientCarePlanResponseNew", {
    success:function (data) {
      if(data.rows.length > 0){
        var statistics_value = [];
        var statistics_date = [];
        for(var i=0;i<data.rows.length;i++){
          if(data.rows[i].value[0].field_name == field_name){
            var text = field_name;
            var subtext = "completed";
            if(Number(data.rows[i].value[0].value) && moment(data.rows[i].value[0].date).format("DD-MMM") != "Invalid date"){
              statistics_value.push(Number(data.rows[i].value[0].value));
              statistics_date.push(moment(data.rows[i].value[0].date).format("DD-MM-YYYY"));
            }
          }
        }
        if(statistics_date.length == 0 || statistics_value.length == 0){
            $("#careplan_visualization_information").html("No Records are Found.");
            return false;
        }    
      }
      $('#careplan_visualization_statistics').highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: text
        },
        subtitle: {
          html: subtext
        },
        xAxis: {
          categories: statistics_date,
          crosshair: true,
          labels: {
            rotation: -45,
            style: {
              fontSize: '10px'
            }
          }
        },
        yAxis: {
            min: 0,
            title: {
                text: text + " (" + subtext + ")"
            }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="padding:0"><b>{point.y:.1f} '+subtext+'</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
        },
        series: [{
          name: "Reading Date",
          data: statistics_value
        }]
      });
    },
    error:function (status) {
      console.log(status);
    },
    startkey:     [1,pd_data._id,userinfo.user_id,temp,specialization,sdate],
    endkey:       [1,pd_data._id,userinfo.user_id,temp,specialization,edate],
    reduce:       false,
    group:        false,
    include_docs: true
  });
}

function getAllVisualizationGraph($obj){
  $("#care_plan_visualization_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  var specialization = $("#selected_care_plan_name_visulize").attr("data-special");
  var temp = $("#selected_care_plan_name_visulize").attr("data-temp");
  var edate = $("#selected_care_plan_name_visulize").attr("data-edate");
  var sdate = $("#selected_care_plan_name_visulize").attr("data-sdate");
  $("#careplan_visualization_information").html("<div id='careplan_visualization_statistics' style='min-width: 850px; height: 400px; margin: 0 auto'></div>");
  $.couch.db(db).view("tamsa/getPatientCarePlanResponseNew", {
    success:function (data) {
      var fixed_value = [];
      if(data.rows.length > 0){
        var statistics_value      = [];
        var statistics_date       = [];
        var statistics_field_name = [];
        for(var j = 0;j < data.rows.length;j++){
          if(data.rows[j].value[0].field_name){
            if(Number(data.rows[j].value[0].value) && moment(data.rows[j].value[0].date).format("DD-MMM") != "Invalid date"){
                statistics_field_name.push(data.rows[j].value[0].field_name);
            }
          }
        }
        var text        = "All Visualizations";
        var subtext     = "Graph";
        //get Unique fields 
        var unique_fields = statistics_field_name.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
        for (var k = 0; k < unique_fields.length; k++) {
          var temp = {
            name: unique_fields[k],
            data: getDateAndValue(data,unique_fields[k])
          }
          fixed_value.push(temp); 
        };  
      }
      
      if(fixed_value.length == 0){
        $("#careplan_visualization_information").html("No Records are Found.");
        return false;
      }

     $('#careplan_visualization_statistics').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: text
        },
        subtitle: {
            text: subtext
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Measurement In (m)'
            },
            min: 0
        },
        tooltip: {
           shared: false,
          formatter: function() {
              var text  = '';
              if(this.series.name == "Drink 48oz of water") {
                  text = '<b>' + this.series.name +
                   '</b><br>'+Highcharts.dateFormat('%e %b',this.x)+":"+Highcharts.numberFormat(this.y,2)+' ml';
              }else if(this.series.name == "Record body temp") {
                  text = '<b>' + this.series.name +
                   '</b><br>'+Highcharts.dateFormat('%e %b',this.x)+":"+Highcharts.numberFormat(this.y,2)+' .F';
              }else if(this.series.name == "Record body weight") {
                  text = '<b>' + this.series.name +
                   '</b><br>'+Highcharts.dateFormat('%e %b',this.x)+":"+Highcharts.numberFormat(this.y,2)+' kg';
              }else if(this.series.name == "Record hours slept") {
                  text = '<b>' + this.series.name +
                   '</b><br>'+Highcharts.dateFormat('%e %b',this.x)+":"+Highcharts.numberFormat(this.y,2)+' hrs';
              }
              return text;
          }
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series: fixed_value
      });
    },
    error:function (status) {
      console.log(status);
    },
    startkey:     [1,pd_data._id,userinfo.user_id,temp,specialization,sdate],
    endkey:       [1 ,pd_data._id,userinfo.user_id,temp,specialization,edate],
    reduce:       false,
    group:        false,
    include_docs: true
  });
}

function getDateAndValue(data,field_name){
   var data_array= [];
   for(var i=0;i<data.rows.length;i++){
    if(data.rows[i].value[0].field_name == field_name){
      if(Number(data.rows[i].value[0].value) && moment(data.rows[i].value[0].date).format("DD-MMM") != "Invalid date"){
        var date_value = data.rows[i].value[0].date;
        var date_milisecond    = new Date(date_value).getTime();;
        data_array.push([date_milisecond,Number(data.rows[i].value[0].value)]);
      }
    }
  }
  return data_array;
}

function careplanVisulization(current_doc_id,current_rev_id){
  $.couch.db(db).openDoc(current_doc_id, {
    success: function(data) {
      $("#summary_care_plan_panel").hide();
      $('#careplan_visulization').show();
      $("#view_all_task").html("");
        $("#completed_task_tab").html("");
        $("#incompleted_task_tab").html("");
      $("#selected_care_plan_name_visulize").html(data.template_name);
      $("#selected_care_plan_name_visulize").attr({
        "data-temp":data.template_name,
        "data-special":data.specialization,
        "data-sdate":data.cp_startdate,
        "data-edate":data.cp_enddate
      });
      $('#selected_care_plan_name_visulize').show();
      $("#selected_patient_care_plan_name").html(data.template_name);
      activateViewAllTaskAtCareplanVisualize();
      displayAllVisualization(moment(data.cp_startdate).format("YYYY-MM-DD"),moment(data.cp_enddate).format("YYYY-MM-DD"),data.template_name,data.specialization);
      displayCompletedVisualization(moment(data.cp_startdate).format("YYYY-MM-DD"),moment(data.cp_enddate).format("YYYY-MM-DD"));
      displayIncompletedVisualization(moment(data.cp_startdate).format("YYYY-MM-DD"),moment(data.cp_enddate).format("YYYY-MM-DD"));
      var activity_data = [];
      cb(moment(data.cp_startdate),moment(data.cp_enddate));
      $('#reportrange').daterangepicker({
        startDate: moment(data.cp_startdate),
        endDate: moment(data.cp_enddate),
        minDate: moment(data.cp_startdate),
        maxDate: moment(data.cp_enddate),
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      },cb);
      $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        $("#view_all_task").html("");
        $("#completed_task_tab").html("");
        $("#incompleted_task_tab").html("");
        displayAllVisualization(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'),data.template_name,data.specialization);
        
        displayCompletedVisualization(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'));
        displayIncompletedVisualization(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'));
        });
    },
    error: function(status) {
      console.log(status);
    }
  });

}

function careplanVisulizationCompleted(data,msg,id){
  if(data.rows.length > 0){
    for (var i = 0; i < data.rows.length; i++) {
      var $element = $("#"+id).find('.visualization-blocks[data="'+data.rows[i].value[0].date+'"]');
      if($element.length > 0 ){
        var get = getVasualizationBlockCantent(data.rows[i].value[0],data.rows[i].value[1]);  
        $element.find(".fields-value-block").append(get);
      }else{
        var datesa =  getVasualizationBlock(data.rows[i].value[0],data.rows[i].value[1]);
        $("#"+id).append(datesa);
      }
    };  
  }else{
    $("#"+id).html(msg);
  }
}

function displayAllVisualization (startdate,enddate,template_name,specialization) {
  $("#view_all_task").html("");
  $.couch.db(db).view("tamsa/getPatientCarePlanResponseNew", {
    success:function (data) {
      var msg = "No Record found for all activity";
      var id = "view_all_task";
      careplanVisulizationCompleted(data,msg,id);
    },
    error:function (status) {
      console.log(status);
    },
    startkey:     [1,pd_data._id,userinfo.user_id,template_name,specialization,startdate],
    endkey:       [1,pd_data._id,userinfo.user_id,template_name,specialization,enddate],
    reduce:       false,
    group:        false,
    include_docs: true
  });
}

function displayCompletedVisualization (startdate,enddate) {
  if(startdate != "" || enddate != ""){
   var sdate = startdate;
   var edate = enddate;
  }else{
   var sdate = $("#selected_care_plan_name_visulize").attr("data-sdate");
   var edate = $("#selected_care_plan_name_visulize").attr("data-edate");
  }
  $("#completed_task_tab").html("");
  var specialization = $("#selected_care_plan_name_visulize").attr("data-special");
  var temp = $("#selected_care_plan_name_visulize").attr("data-temp");
  $.couch.db(db).view("tamsa/getPatientCarePlanResponseNew", {
    success:function (data) {
      var msg = "No Record found for Complete activity";
      var id = "completed_task_tab";
      careplanVisulizationCompleted(data,msg,id);
    },
    error:function (status) {
      console.log(status);
    },
    startkey:     [2,pd_data._id,userinfo.user_id,temp,specialization,sdate],
    endkey:       [2,pd_data._id,userinfo.user_id,temp,specialization,edate],
    reduce:       false,
    group:        false,
    include_docs: true
  });
}

function displayIncompletedVisualization (startdate,enddate) {
  if(startdate != "" || enddate != ""){
   var sdate = startdate;
   var edate = enddate;
  }else{
   var sdate = $("#selected_care_plan_name_visulize").attr("data-sdate");
   var edate = $("#selected_care_plan_name_visulize").attr("data-edate");
  }
  $("#incompleted_task_tab").html("");
  var specialization = $("#selected_care_plan_name_visulize").attr("data-special");
  var temp = $("#selected_care_plan_name_visulize").attr("data-temp");
  $.couch.db(db).view("tamsa/getPatientCarePlanResponseNew", {
    success:function (data) {
      var msg = "No Record found for Incompleted activity";
      var id = "incompleted_task_tab";
      careplanVisulizationCompleted(data,msg,id);
    },
    error:function (status) {
      console.log(status);
    },
    startkey:     [3,pd_data._id,userinfo.user_id,temp,specialization,sdate],
    endkey:       [3,pd_data._id,userinfo.user_id,temp,specialization,edate],
    reduce:       false,
    group:        false,
    include_docs: true
  });
}

function getVasualizationBlock (data,section_name) {
  var dates = [];
  
  dates.push("<div class='row' >");
    dates.push('<div class="visualization-blocks col-lg-5" data="'+data.date+'" style="margin-left:18px;float:left">');
      dates.push('<div style="margin-top: 21px;">');
        dates.push('<div style="border: 1px solid rgb(204, 204, 204); float: left; width: 125px; padding: 9px;">')
          dates.push('<div style="width:112px;text-align: center; padding-right:4px">');
            dates.push('<span style="font-size: 20px;">'+moment(data.date).format("dddd")+'</span>');
          dates.push('</div>');
          dates.push('<span style="font-size: 17px; background: rgb(38, 154, 212) none repeat scroll 0% 0%; color: rgb(255, 255, 255); width: 104px; float: left; text-align: center; border-radius: 8px; padding: 1px;">'+moment(data.date).format("MMMM")+'</span>');
          dates.push('<span style="float: left; width: 100%; text-align: center; font-size: 25px;">'+moment(data.date).format("D")+ '</span>');
        dates.push('</div>');
        dates.push('<div class="fields-value-block" style="float: left; width: 66%; margin-left: 11px;">');
          dates.push('<div>');
            dates.push('<div>');
              if(data.response == "No" || data.response == "Not Done" || data.response == "False") {
                dates.push('<span style="cursor:auto;color:#269AD4;" class="glyphicon glyphicon-remove"></span>');
              }else {
                dates.push('<span style="cursor:auto;color:#269AD4;" class="glyphicon glyphicon-ok"></span>');
              }
              dates.push(''+data.field_name+'');
              if(section_name == "Biometrics" || section_name == "Medication Management") {
                dates.push('<span style="margin-left: 5px;" data="'+data.field_name+'" class="glyphicon glyphicon-stats visualization_section"></span>');  
              }
              if(section_name == "Nutrition/Dietary" && data.field_name == "Drink 48oz of water") {
                dates.push('<span style="margin-left: 5px;" data="'+data.field_name+'" class="glyphicon glyphicon-stats visualization_section"></span>');
              }
            dates.push('</div>');
            dates.push('<div style="margin-left:23px;">');
              dates.push('<span style="color: rgb(38, 154, 212); font-weight: bold; font-size: 15px; width: 100%; float: left;">'+(data.value ? data.value : "")+'</span>');
              dates.push('<span style="color: gray;">'+data.notes+'</span>');
            dates.push('</div>');
          dates.push('</div>');
        dates.push('</div>');
      dates.push('</div>');
    dates.push('</div>');
  dates.push("</div>");
  
  return dates.join('');
}

function getVasualizationBlockCantent(data,section_name) {
  var dass = [];
  dass.push('<div>');
    dass.push('<div>');
      if(data.response == "No" || data.response == "Not Done" || data.response == "False"){
        dass.push('<span style="cursor:auto;color:#269AD4;" class="glyphicon glyphicon-remove"></span>');
      }else{  
        dass.push('<span style="cursor:auto;color:#269AD4;" class="glyphicon glyphicon-ok"></span>');
      }
      dass.push(''+data.field_name+'');
      if(section_name == "Biometrics" || section_name == "Medication Management"){
        dass.push('<span style="margin-left: 5px;" data="'+data.field_name+'" class="glyphicon glyphicon-stats visualization_section"></span>');  
      }
      if(section_name == "Nutrition/Dietary" && data.field_name == "Drink 48oz of water"){
        dass.push('<span style="margin-left: 5px;" data="'+data.field_name+'" class="glyphicon glyphicon-stats visualization_section"></span>');
      }
    dass.push('</div>');
    dass.push('<div style="margin-left:23px;">');
      dass.push('<span style="color: rgb(38, 154, 212); font-weight: bold; font-size: 15px; width: 100%; float: left;">'+(data.value ? data.value : "")+'</span>');
      dass.push('<span style="color: gray;">'+data.notes+'</span>');
    dass.push('</div>');
  dass.push('</div>');

  return dass.join('');
}

function toggleCarePlanSummary(save_arg){
  if(save_arg == 'save'){
   $('#save_careplan_summary_list').toggle(function(){
    if($('#save_toggle_careplan_summary').html() == "Show Summary"){
      $('#save_toggle_careplan_summary').html('Hide Summary');
      $('#save_toggle_careplan_summary').show();
      $('#save_refresh_careplan_summary').show();
      $('#save_careplan_summary_list').show();
    }else{
      $('#save_toggle_careplan_summary').html('Show Summary');
      $('#save_refresh_careplan_summary').hide();
      $('#save_careplan_summary_list').hide();
      $('#save_refresh_careplan_summary').hide();
    }
  });
  }else{
    $('#careplan_summary_list').toggle(function(){
      if($('#toggle_careplan_summary').html() == "Show Summary"){
        $('#toggle_careplan_summary').html('Hide Summary');
        $('#toggle_careplan_summary').show();
        $('#refresh_careplan_summary').show();
      }else{
        $('#toggle_careplan_summary').html('Show Summary');
        $('#refresh_careplan_summary').hide();
      }
    });
  }
}

function generateCarePlanSummaryList(save){
  if(save){
    if(!$('#cp_startdate').val()) {
      newAlert("danger", "Please choose date range First.");
      $("html, body").animate({scrollTop: $("#save_care_plan_tab").offset().top - 50}, 'slow');
      $("#cp_startdate").focus();
      return false;
    }else{
      generateCarePlanSummarySave();
      toggleCarePlanSummary('save');
    }
  }else{
    generateCarePlanSummary();
    toggleCarePlanSummary();
  }
}

function generateCarePlanSummary(){
  var patientnoteHTML = '';
  $('.section-table').each(function(){
    if($(this).attr('sname') != "Patient Education" && $(this).attr('sname') != "Health Screening"){
      var sname = $(this).attr('sname');
      $(this).find(".careplan-rows").each(function(){
        patientnoteHTML += '<li>'+$(this).find('.careplan_label').val();
        if(sname == "Medication Management"){
          patientnoteHTML += '&nbsp;&lt;Text Note&gt; ';
        }
        if($(this).find(".cp-response-val").length > 0 && $(this).find(".cp-response-val").val() != "Select Response"){
          patientnoteHTML += '&nbsp;at&nbsp;&lt;specific time&gt;';
        }
        if($(this).find(".chk_include").length > 0 && $(this).find(".chk_include").prop("checked")){
          patientnoteHTML += '&nbsp;&lt;2x/3x/hourly&gt;';
        }
        if($(this).find(".cp-response-val").length > 0 && $(this).find(".cp-response-val").val() != "Select Response"){
          if($(this).find(".cp_freqency_days_select").val() == "Daily") {
            patientnoteHTML += '&nbsp;every day';
          }else if($(this).find(".cp_freqency_days_select").val() == "Weekly"){
            patientnoteHTML += '&nbsp;every week';
          }else if($(this).find(".cp_freqency_days_select").val() == "Specific Day"){
            patientnoteHTML += '&nbsp;on mon/tue/wed/thu/fri/sat/sun&nbsp;';
          }else{
            patientnoteHTML += '&nbsp;1/2/3/4/5/6/7 days before and 1/2/3/4/5/6/7 days after &lt;specific Date&gt;&nbsp;';
          }
        }
        if($(this).find(".cp-response-val").length > 0 && $(this).find(".cp-response-val").val() != "Select Response" && $(this).find(".cp_freqency_days_select").val() != "Days Before/After"){
          patientnoteHTML += '&nbsp;from &lt;start date&gt;&nbsp;to including &lt;end date&gt;';
        }
        if(sname == "Fitness") patientnoteHTML += '&nbsp;from &lt;start date&gt;&nbsp;to including &lt;end date&gt;';
      });
    }
  });
  $('#careplan_summary_list').html(patientnoteHTML);
}

function generateCarePlanSummarySave(){
  var patientnoteHTML = '';
  $('.care-plan-section-rows').each(function(){
    var sname = $(this).attr('careplan_section');
    $(this).find(".care-plan-field-rows").each(function(){
      if($(this).find(".cmn_chk").prop('checked') == true){
        patientnoteHTML += '<li>'+$(this).find('.care-plan-field-name').html()+" ";
        if($(this).find('.careplan-inner-row').attr('occurance') == "Daily"){
          patientnoteHTML += " everyday ";
        }
        if($(this).find('.careplan-inner-row').attr('occurance') == "Weekly"){
          patientnoteHTML += " everyweek ";
        }
        if($(this).find(".cp_hourly_select").val() == "Hourly"){
          patientnoteHTML += " Hourly ";
        }else if($(this).find(".cp_hourly_select").val() == "Twice"){
          if($(this).find(".cp_select_time").val() != "select time"){
            patientnoteHTML += 'at '+$(this).find(".cp_select_time").val()+$(this).find('.select_ampm').val()+"/";
            var time = Number($(this).find(".cp_select_time").val());
            var ampm = $(this).find('.select_ampm').val();
            var calc_time = time + 12;
            if(calc_time >= 12){
              secound_time = calc_time%12;
              if(ampm == "AM"){
                patientnoteHTML += secound_time+"PM ";
              }else{
                patientnoteHTML += secound_time+"AM ";
              }
            }else{
              patientnoteHTML += calc_time+ampm+" ";
            }
          }
        }else if($(this).find(".cp_hourly_select").val() == "Thrice"){
          if($(this).find(".cp_select_time").val() != "select time"){
            patientnoteHTML += 'at ';
            var first_time = Number($(this).find(".cp_select_time").val());
            var first_part = $(this).find('.select_ampm').val();

            var second_time = first_time + 8;
            var second_part = first_part;
            if(second_time >= 12){
              second_time = second_time%12; 
              second_part =  (first_part == "AM")?"PM":"AM";
            }

            var third_time = second_time + 8;
            var third_part = second_part;
            if(third_time >= 12){
              third_time = third_time%12; 
              third_part =  (second_part == "AM")?"PM":"AM";
            }
            var time_string = first_time +" "+first_part+"/"+second_time +" "+second_part+"/"+third_time +" "+third_part;
            patientnoteHTML += time_string;
          }
        }
        if($(this).find('.careplan-inner-row').attr('occurance') == "Specific Day"){
          var week_val = [];
          patientnoteHTML += " on ";
          var temp_week="";
          $(this).find('.careplan-inner-row').find(".week-val").each(function(){
            if($(this).hasClass('clicked')){
              temp_week += $(this).html()+"/";
            }
          });
          if(temp_week != "") patientnoteHTML  += temp_week.substring(0,temp_week.length - 1)
        }else if($(this).find('.careplan-inner-row').attr('occurance') == "Days Before/After"){
          var final_ar = [], days_before = [],days_after = [];
          $(this).find('.careplan-inner-row').find(".d-before-click").each(function(){
            if($(this).hasClass('clicked')){
               patientnoteHTML += $(this).html()+" ";
            }
          });
          patientnoteHTML += " days before "+$(this).find(".cp-ndate").val()+" and ";
          $(this).find('.careplan-inner-row').find(".d-after-click").each(function(){
            if($(this).hasClass('clicked')){
              patientnoteHTML += $(this).html()+" ";
            }
          });
          patientnoteHTML += " days after "+$(this).find(".cp-ndate").val();
        }
        if($(this).find(".cp-startdate").length > 0 && $(this).find(".cp-startdate").val() != "" && $(this).find(".cp-enddate").val() != ""){
          patientnoteHTML += ' from '+moment($(this).find(".cp-startdate").val()).format("DD-MM-YYYY")+"    including  "+moment($(this).find(".cp-enddate").val()).format("DD-MM-YYYY")+".";  
        }else if($(this).find(".cp-startdate").length == 0 && $(this).find(".cp-enddate").length == 0){
          patientnoteHTML += ' from '+moment($('#cp_startdate').data('daterangepicker').startDate).format("DD-MM-YYYY")+"    including  "+moment($('#cp_startdate').data('daterangepicker').endDate).format("DD-MM-YYYY")+".";
        }
        if(sname == "Medication Management"){
          patientnoteHTML += " "+$('.save_notes').val()+".";
        }
        patientnoteHTML += '</li>';
      }
    });
  });
  $('#save_careplan_summary_list').html(patientnoteHTML);
}

function addMoreCareplanSectionFields($obj){
  var section = $obj.attr("section_name");
  $("#care_plan_field_table").find("[sname='"+section+"']").find("tbody").find("tr:first").clone().appendTo($("#care_plan_field_table").find("[sname='"+section+"']").find("tbody"));
}

function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
}
