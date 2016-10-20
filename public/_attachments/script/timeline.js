
function getTimeLineRecordsByCharting(skipvalue,seemoreclicked){
  $('#seemore_lab').hide();
  $('#seemore_chart').show();
  $('#seemore').hide();
  if(skipvalue == 0){
    var limitvalue = 10;
  }
  else{
    var limitvalue = display_value;
  }
  $.couch.db(db).view("tamsa/getTimeLineRecords", {
    success: function(data) {
      if(data.rows.length){
        displayTimeLineRecords(data,"chart",seemoreclicked);
        if(data.rows.length > 10)$('#seemore_chart').show();
      }else{
        var timeline = [];
        $('#seemore_chart').hide();
        if(seemoreclicked == ""){
          timeline.push('<div class="norecord_msg1">No Patitent Charting Records Found.</div>');
          // $('.norecord_msg1').html('No Patitent Charting Records Found.');
          $("#timeline_list").html(timeline.join(''));  
        }
      }
      if(Number($('#seemore_chart').data("count")) > Number($('#seemore_chart').attr("datalen"))){
        counter = 0;
          $("#seemore_chart").hide();
      }
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [0,userinfo.user_id,"patient_charting_template",{}],
    endkey: [0,userinfo.user_id,"patient_charting_template"],
    descending : true,
    skip: skipvalue,
    limit:limitvalue
  });
}

function getTimeLineRecordsByLab(skipvalue,seemoreclicked) {
  $('#seemore_lab').show();
  $('#seemore_chart').hide();
  $('#seemore').hide();
  if(skipvalue == 0){
    var limitvalue = 10;
  }
  else{
    var limitvalue = display_value;
  }
  $.couch.db(db).view("tamsa/getTimeLineRecords", {
      success: function(data) {
       // console.log(data);
        if(data.rows.length){
          displayTimeLineRecords(data,"lab",seemoreclicked);
          if(data.rows.length > 10)$('#seemore_lab').show();
        }else{
          var timeline = [];
          $('#seemore_lab').hide();
          if(seemoreclicked == ""){
            timeline.push('<div class="norecord_msg1">No Lab Records Found.</div>');
            // $('.norecord_msg1').html('No Lab Records Found.');
            $("#timeline_list").html(timeline.join(''));
          }
        }
        if(Number($('#seemore_lab').data("count")) > Number($('#seemore_lab').attr("datalen"))){
        counter = 0;
          $("#seemore_lab").hide();
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [0,userinfo.user_id,"Anual_Exam",{}],
      endkey: [0,userinfo.user_id,"Anual_Exam"],
      descending : true,
      skip: skipvalue,
      limit:limitvalue
  });
}

function getTimeLineRecords(skipvalue,type,seemoreclicked) {
  $('#seemore_lab').hide();
  $('#seemore_chart').hide();
  $('#seemore').show();
  if(skipvalue == 0){
    var limitvalue = 10;
  }
  else{
    var limitvalue = display_value;
  }
  $.couch.db(db).view("tamsa/getTimeLineRecords", {
    success: function(data) {
      if(data.rows.length > 0){
        displayTimeLineRecords(data,"",seemoreclicked);
        if(data.rows.length > 10){
          $('#seemore').show();
        } 
      }else{
        var timeline = [];
        $('#seemore').hide();
        if(type == ""){
          timeline.push('<div class="norecord_msg1">No Records Found.</div>');
          // $('.norecord_msg1').html('No Records Found.');
          $("#timeline_list").html(timeline.join(''));  
        }
      }
      if(Number($('#seemore').data("count")) > Number($('#seemore').attr("datalen"))){
        counter = 0;
        $("#seemore").hide();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id,{},{}],
    endkey: [userinfo.user_id],
    descending : true,
    skip: skipvalue,
    limit:limitvalue
  });
}
//Copy this to charting soapnote display at timeline
function getInnerData(data1,type){
  if(type == 'soapnote'){
    var asshtml = [];
    if(data1.values[0].subjective.length > 0){ 
      asshtml.push("<div class='row mrgtop1'><div class='col-lg-12 paddleft'><h4 class='theme-color'>Subjective :: </h4></div></div>");
      asshtml.push("<div class='row'>");
        asshtml.push("<div class='col-lg-12 alert alert-warning mrgbottom theme-border'>");
        for(var j=0;j<data1.values[0].subjective.length;j++){
          asshtml.push("<div class='row'>");
            asshtml.push("<div class='col-lg-12'>"+data1.values[0].subjective[j]+"</div>");  
          asshtml.push("</div>");
        }
        asshtml.push("</div>");
      asshtml.push("</div>");
    }
    if(data1.values[0].objective[0].fields.length > 0){
      // asshtml.push("<div><span class='label'>Objective : </span><span>"+data1.objective+"</span></div>");
      asshtml.push("<div class='row mrgtop1'><div class='col-lg-2 paddleft'><h4 class='theme-color'>Objective :: </h4></div><div style='padding: 10px;' class='col-lg-10'><span class='label label-success lbl-color'>Patient "+data1.values[0].objective[0].patient_historian+" a reliable historian.</span></div></div>");
      asshtml.push(displayObjectiveSoapNote(data1));
    }else{
      console.log("in else");
    }
    if(data1.values[0].assessment && data1.values[0].assessment.length > 0) {
      asshtml.push("<div class='row mrgtop1'><div class='col-lg-12 paddleft'><h4 class='theme-color'>Assessment :: </h4></div></div>");
      asshtml.push("<div class='row'>");
        asshtml.push("<div class='col-lg-12 alert alert-warning mrgbottom theme-border'>");
        for(var j=0;j<data1.values[0].assessment.length;j++){
          asshtml.push("<div class='row'>");
            asshtml.push("<div class='col-lg-12'>"+data1.values[0].assessment[j]+"</div>");  
          asshtml.push("</div>");
        }
        asshtml.push("</div>");
      asshtml.push("</div>");
    }
    if(data1.values[0].plan != ''){
      asshtml.push("<div class='row mrgtop1'><div class='col-lg-12'><div class='row'><div class='col-lg-12 theme-color paddleft'><h4>Plan ::</h4></div></div></div class='row'><div class='col-lg-12 alert alert-warning mrgbottom theme-border'>"+data1.values[0].plan+"</div></div></div></div>");
    }   
    return (asshtml.join(''));
  }
}
function displayObjectiveSoapNote(data1) {
  var objdata = [];
  objdata.push("<div class='row'>");
    objdata.push("<div class='col-lg-12'>");
      if(data1.values[0].objective[0].fields.length > 0){
        for(var i=0;i<data1.values[0].objective[0].fields.length;i++){
          if(data1.values[0].objective[0].fields[i].choices.length > 0 || data1.values[0].objective[0].fields[i].details_list.length > 0){
            objdata.push("<div class='row alert alert-warning mrgbottom theme-border'>");
              objdata.push("<div class='col-lg-5'>"+data1.values[0].objective[0].fields[i].field_name+"</div>");
              objdata.push("<div class='col-lg-7'>"+((data1.values[0].objective[0].fields[i].choices.length > 0) ? data1.values[0].objective[0].fields[i].choices : "")+"</div>");
              if(data1.values[0].objective[0].fields[i].details_list.length > 0) {
                objdata.push("<div class='col-lg-5'>Details</div>");
                objdata.push("<div class='col-lg-7'>"+data1.values[0].objective[0].fields[i].details_list+"</div>");  
              }
            objdata.push("</div>");  
          }
        }  
      }
    objdata.push("</div>");
  objdata.push("</div>");
  return (objdata.join(''));
}

function generateUploadedChartingTemplateData(data, i,action) {
  var updatedate = moment(data.update_ts);
  var newtimeline = [];
  if(i) {
    if(action != "print"){
      newtimeline.push("<div class='timelinesection'><div class='timeline_date' data-update_date='"+updatedate.format('DD-MM-YYYY')+"' id='timelinedate"+i+"'>"+updatedate.format('MMM DD')+"</div>");  
    }
    newtimeline.push("<h2 style='background:#be1b57;'><span style='line-height:1.15 !important;' class='print_template_name'>"+data.document_name+"</span>");
    if(action != "print") {
      newtimeline.push("<span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data._id+"'></span><span class='time pull-right'>"+updatedate.format("hh:mm:ss A")+"</span>");  
    }
    newtimeline.push("</h2><div class='timelinecontents' id='container"+i+"'>");
    newtimeline.push("<div><div index='"+data._id+"'></div>");

  } else{
    if(action != "print"){
      newtimeline.push("<div class='timelinesection'><div data-update_date='"+updatedate.format('DD-MM-YYYY')+"' class='timeline_date'>"+updatedate.format('MMM DD')+"</div>");
    }
    newtimeline.push("<h2 style='background:#be1b57;'><span style='line-height:1.15 !important;'>"+data.document_name+"</span>");
    if(action != "print") {
      newtimeline.push("<span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data._id+"'></span><span class='time pull-right'>"+updatedate.format("hh:mm:ss A")+"</span></h2>");  
    }
      newtimeline.push("<div class='timelinecontents'>");
      newtimeline.push("<div><div index='"+data._id+"'></div>");
  }
  var image_src = $.couch.urlPrefix +'/'+db+'/'+data._id+'/'+Object.keys(data._attachments)[0];
  newtimeline.push('<div class="cc-timeline-charting-template-display row mrgbottom1" style="line-height:1.15 !important;font-size: 15px !important;"><div class="col-lg-6 theme-color"><h4>Comments::</h4><br><span>');
  newtimeline.push((data.comments && data.comments.length > 0) ? data.comments[0].comment: "NA");
  newtimeline.push('</span></div><div class="col-lg-6 theme-color imgcontainer"><img height="220" width="300" src="'+image_src+'"></div></div>');
  
  $('#timeline_year').html(updatedate.format('YYYY'));  
  if(i) {
    if(i===0) $('#timeline_year').html(updatedate.format('YYYY'));
    else newtimeline.push("<div id='timelineyear"+i+"' style='display:none !important;'>"+updatedate.format('YYYY')+"</div>");      
  }else{
    //newtimeline.push("<div style='display:none;'>"+updatedate.format('YYYY')+"</div>");
  }
  newtimeline.push("</div></div></div>");
  return newtimeline.join('');
}

function generateChartingTemplateData(data, i,action) {
  var updatedate = moment(data.update_ts);
  var newtimeline = [];
  if(i) {
    if(action != "print"){
      newtimeline.push("<div class='timelinesection'><div class='timeline_date' data-update_date='"+updatedate.format('DD-MM-YYYY')+"' id='timelinedate"+i+"'>"+updatedate.format('MMM DD')+"</div>");  
    }
    newtimeline.push("<h2 style='background:#be1b57;'><span style='line-height:1.15 !important;' class='print_template_name'>"+data.template_name+"</span>");
    if(action != "print") {
      newtimeline.push("<span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data._id+"'></span><span class='time pull-right'>"+updatedate.format("hh:mm:ss A")+"</span>");  
    }
    newtimeline.push("</h2><div class='timelinecontents' id='container"+i+"'>");
    newtimeline.push("<div><div index='"+data._id+"'></div>");

  } else{
    if(action != "print"){
      newtimeline.push("<div class='timelinesection'><div data-update_date='"+updatedate.format('DD-MM-YYYY')+"' class='timeline_date'>"+updatedate.format('MMM DD')+"</div>");
    }
    newtimeline.push("<h2 style='background:#be1b57;'><span style='line-height:1.15 !important;'>"+data.template_name+"</span>");
    if(action != "print") {
      newtimeline.push("<span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data._id+"'></span><span class='time pull-right'>"+updatedate.format("hh:mm:ss A")+"</span></h2>");  
    }
      newtimeline.push("<div class='timelinecontents'>");
      newtimeline.push("<div><div index='"+data._id+"'></div>");
  }
  
  if(data.saved_vital_data && Object.keys(data.saved_vital_data).length > 0) {
    newtimeline.push('<div class="cc-timeline-charting-template-display row mrgbottom1 mrgleft1" style="line-height:1.15 !important;">');
      newtimeline.push('<table cellspacing="0" cellpadding="0" width="1000" style="margin-top: 5px;" class="tabel tabel-border mrg-top medication-table">');
        newtimeline.push('<tbody>');
          newtimeline.push('<tr>');
            newtimeline.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold;">');
              newtimeline.push('<table class="table invoice-display-table" width="900">');
                newtimeline.push('<thead>');
                  newtimeline.push('<tr>');
                    newtimeline.push('<th>Sys</th><th>Dias</th><th>MAP</th><th>HeartRate</th><th>Fasting Glucose</th><th>O2</th><th>Normal Condition</th><th>Temp</th><th>Respirations</th><th>Weight</th><th>Height</th><th>BMI</th><th>waist</th>');
                  newtimeline.push('</tr>');
                newtimeline.push('</thead>');
                newtimeline.push('<tbody>');

                  newtimeline.push('<tr>');
                    // newtimeline.push('<td><span>'+moment(data.saved_vital_data.update_ts).format("YYYY-MM-DD")+'</span></td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Value_Systolic_BP ? data.saved_vital_data.Value_Systolic_BP : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Value_Diastolic_BP ? data.saved_vital_data.Value_Diastolic_BP : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Value_MAP ? data.saved_vital_data.Value_MAP : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.HeartRate ? data.saved_vital_data.HeartRate : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Fasting_Glucose ? data.saved_vital_data.Fasting_Glucose : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.O2 ? data.saved_vital_data.O2 : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.OutOfRange ? data.saved_vital_data.OutOfRange : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Value_temp ? data.saved_vital_data.Value_temp : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Respiration_Rate ? data.saved_vital_data.Respiration_Rate : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.Value_weight ? data.saved_vital_data.Value_weight : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.height ? data.saved_vital_data.height : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.bmi ? data.saved_vital_data.bmi : "NA")+'</td>');
                    newtimeline.push('<td>'+(data.saved_vital_data.waist ? data.saved_vital_data.waist : "NA")+'</td>');
                    // newtimeline.push('<td>'+(data.saved_vital_data.user_id ? data.saved_vital_data.user_id : "NA")+'</td>');
                  newtimeline.push('</tr>');

                newtimeline.push('</tbody>');
              newtimeline.push('</table>');
            newtimeline.push('</td>');
          newtimeline.push('</tr>');

        newtimeline.push('</tbody>');
      newtimeline.push('</table>');
    newtimeline.push('</div>');
  }
  
  // newtimeline.push('<div class="cc-timeline-charting-template-display row mrgbottom1" style="line-height:1.15 !important;font-size: 15px !important;"><div class="col-lg-12 theme-color">Chief Complaint :: '+(data.chief_complaint ? data.chief_complaint : "NA")+'</div></div>');
  for(var j=0;j<data.sections.length;j++){
    newtimeline.push('<div class="timeline-charting-template-display mrgtop1 alert alert-warning mrgbottom theme-border" style="padding: 5px;text-align:center;"><span style="line-height:1.15 !important;font-size: 15px !important;font-weight:bold !important;">'+data.sections[j].section_name+'</span></div><table class="table tbl-border"><thead><tr class="response_header"><th>Field Name</th><th style="">Response</th></tr></thead><tbody>');
      for(var k=0;k<data.sections[j].fields.length;k++){
        // newtimeline.push('<tr><td class="newdesign_label" style="line-height:1.15 !important;font-weight:bold !important">'+data.sections[j].fields[k].field_name+'</td><td><table class="table myborder">');
        if(data.sections[j].fields[k].response_format_pair.length > 0){
          if(data.sections[j].fields[k].response_format_pair[0].response == "soapnote") {
            newtimeline.push('<tr><td colspan="2" class="newdesign_label" style="line-height:1.15 !important;font-weight:bold !important">');
          }else{
            newtimeline.push('<tr><td width="25%" class="" style="line-height:1.15 !important;font-weight: bold !important;">'+data.sections[j].fields[k].field_name+'</td><td width="75%"><table class="table myborder">');
          }
        }else{
          newtimeline.push('<tr><td width="25%" class="" style="line-height:1.15 !important;font-weight: bold !important;">'+data.sections[j].fields[k].field_name+'</td><td width="75%"><table class="table myborder">');
        }
          for(var p=0;p<data.sections[j].fields[k].response_format_pair.length;p++){
            newtimeline.push(tlChartingTemplateResponseDisplay(data.sections[j].fields[k].response_format_pair[p]));
          } 
          if(data.sections[j].fields[k].response_format_pair.length > 0){
            if(data.sections[j].fields[k].response_format_pair[0].response == "soapnote") {
              newtimeline.push('</td>');
            }else {
              newtimeline.push('</table></td>');
            }
          }else{
            newtimeline.push('</table></td>');
          }
          
      } 
      newtimeline.push('</tbody></table>'); 
  }
  // console.log(i);
  if(data.saved_medication_data && data.saved_medication_data.length > 0) {
    newtimeline.push('<div class="cc-timeline-charting-template-display row mrgbottom1 mrgleft1" style="line-height:1.15 !important;">');
      newtimeline.push('<table cellspacing="0" cellpadding="0" width="900" style="margin-top: 5px;" class="tabel tabel-border mrg-top medication-table">');
        newtimeline.push('<tbody>');
        
          // newtimeline.push('<tr>');
          //   newtimeline.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold; width:100%">');
          //     newtimeline.push('<table class="table invoice-display-table">');
          //       newtimeline.push('<tbody>');
          //         newtimeline.push('<tr>');
          //           newtimeline.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="left"><span>Doctor Name:: '+data.saved_medication_data[0].doctor_name+'</span></td>');
          //           newtimeline.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="right"><span>Date :: '+(data.saved_medication_data[0].update_ts ? moment(data.saved_medication_data[0].update_ts).format("YYYY-MM-DD") : moment(data.saved_medication_data[0].insert_ts).format("YYYY-MM-DD"))+'</span></td>');
          //         newtimeline.push('</tr>');
          //       newtimeline.push('</tbody>');
          //     newtimeline.push('</table>');
          //   newtimeline.push('</td>');
          // newtimeline.push('</tr>');

          newtimeline.push('<tr>');
            newtimeline.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold;">');
              newtimeline.push('<table class="table invoice-display-table" width="900">');
                newtimeline.push('<thead>');
                  newtimeline.push('<tr>');
                    newtimeline.push('<th>No</th><th>Medication Name</th><th>Dose</th><th>Type</th><th>Frequency</th><th>Route</th><th width="13%">Start Date</th><th width="13%">End Date</th><th>Patient Instruction</th>');
                  newtimeline.push('</tr>');
                newtimeline.push('</thead>');
                newtimeline.push('<tbody>');

                for(var k=0;k<data.saved_medication_data.length;k++) {
                  newtimeline.push('<tr>');
                    newtimeline.push('<td><span>'+(k+1)+'</span></td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].drug+'</td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].drug_strength+" "+data.saved_medication_data[k].drug_unit.toLowerCase()+'</td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].desperse_form+'</td>');
                    // newtimeline.push('<td>'+data.saved_medication_data[k].drug_quantity+'</td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].medication_time.join(", ")+'</td>');
                    newtimeline.push('<td>'+(data.saved_medication_data[k].route ? data.saved_medication_data[k].route : "NA")+'</td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].drug_start_date+'</td>');
                    newtimeline.push('<td>'+data.saved_medication_data[k].drug_end_date+'</td>');
                    newtimeline.push('<td>'+(data.saved_medication_data[k].medication_instructions ?data.saved_medication_data[k].medication_instructions : "NA")+'</td>');
                  newtimeline.push('</tr>');
                }
                newtimeline.push('</tbody>');
              newtimeline.push('</table>');
            newtimeline.push('</td>');
          newtimeline.push('</tr>');

          if(data.saved_medication_data[0].pharmacy || data.saved_medication_data[0].pharmacy_name) {
            newtimeline.push('<tr>');
              newtimeline.push('<td valign="top" align="left" style="font-size: 14px; color: rgb(0, 0, 0); font-family: arial; font-weight: bold; padding-top: 17px; float: left; width: 100%;">');
                  newtimeline.push('<h5 class="print_template_name">Pharmacy Name:: '+data.saved_medication_data[0].pharmacy_name +'</h5>');
                  newtimeline.push('<h5 class="print_template_name">Pharmacy Contact No:'+data.saved_medication_data[0].pharmacy_phone+'</h5>');
              newtimeline.push('</td>');
            newtimeline.push('</tr>');  
          }
        newtimeline.push('</tbody>');
      newtimeline.push('</table>');
    newtimeline.push('</div>');
  }
  $('#timeline_year').html(updatedate.format('YYYY'));  
  if(i) {
    if(i==0) $('#timeline_year').html(updatedate.format('YYYY'));
    else newtimeline.push("<div id='timelineyear"+i+"' style='display:none !important;'>"+updatedate.format('YYYY')+"</div>");      
  }else{
    //newtimeline.push("<div style='display:none;'>"+updatedate.format('YYYY')+"</div>");
  }
  newtimeline.push("</div></div></div>");
  return newtimeline.join('');
}

function displayTimeLineRecords(data,type_view,seemoreclicked){
  var timeline = [];
  for (var i=0; i<data.rows.length; i++){
    var insdate = moment(data.rows[i].value.insert_ts);
    if(data.rows[i].value.doctype == "uploaded_patient_charting_template") {
      timeline.push(generateUploadedChartingTemplateData(data.rows[i].value, i));
    }else if(data.rows[i].value.doctype == "patient_charting_template") {
      timeline.push(generateChartingTemplateData(data.rows[i].value, i));
    }else {
      timeline.push("<div class='timelinesection'>");
      timeline.push("<div class='timeline_date' data-update_date='"+insdate.format('DD-MM-YYYY')+"' id='timelinedate"+i+"'>"+insdate.format('MMM DD')+"</div>");
      timeline.push("<h2 style='color:#333;margin-bottom:2px;'><span class='title'>Lab Tests</span><span class='glyphicon glyphicon-chevron-right timeline-toggle' style='float:right;'></span><span class='glyphicon glyphicon-print tl-print-selected' style='float: right;' index='"+data.rows[i].id+"'></span><span class='time'>"+insdate.format('hh:mm:ss A')+"</span></h2><div class='timelinecontents' id='container"+i+"'><div><div class='lab'>");

      if(data.rows[i].value._attachments) {
        timeline.push("<div class='col-lg-6' style='color:rgb(167, 195, 152); font-weight: bold;'>"+data.rows[i].value.document_name);
        if(data.rows[i].value.usermedhis_docid && data.rows[i].value.selfcare_docid && data.rows[i].value.patientnotes_docid) {
         timeline.push("<table id='lab_result_medical_details_timeline' border='1' class='table lab_result_medical_details_timeline'></table>");
        }
        if(data.rows[i].value.comments) {
          if(data.rows[i].value.comments.length > 0) {
            timeline.push('<span class="comment-title">Comments</span><ul>');
            for(var l=data.rows[i].value.comments.length-1;l>=0;l--){
              timeline.push('<li>'+data.rows[i].value.comments[l].comment+' <span class="comment-date"> - Commented on : '+moment(data.rows[i].value.comments[l].date).format('DD-MM-YYYY')+'</span></li>');
            }
            timeline.push('</ul>');
          }
        }
        timeline.push('</div>');
        var url = "";
        url     = $.couch.urlPrefix +'/'+db+'/'+data.rows[i].value._id+'/'+Object.keys(data.rows[i].value._attachments)[0];
        if (data.rows[i].value.Format == "PDF" || data.rows[i].value._attachments[Object.keys(data.rows[i].value._attachments)[0]].content_type == "application/pdf") {
          timeline.push("<div class='co-lg-6'><iframe width='220' height='160' class='media' src='"+url+"' scrolling='no'></iframe><div class='pdfcontainer' pdfurl='"+url+"'>Preview</div></div>");
        }else{
         timeline.push("<div class='col-lg-6'><div class='imgcontainer'><img src='"+url+"' height='200' height='300'></div></div>");
        }
      }else {
        timeline.push("<div style='float: left; margin-right: 499px;'><span class='label'>Exam Name : </span><span>"+data.rows[i].value.Exam_Name+"</span></div>");
      }
      if(i==0) {
        $('#timeline_year').html(insdate.format('YYYY'));    
      }
      timeline.push("</div></div>");
      //timeline.push("<div id='timelineyear"+i+"' style='display:none;'>"+insdate.format('YYYY')+"</div>");
      timeline.push("</div></div>");
    }
  }
  
  if(seemoreclicked){
    $("#timeline_list").append(timeline.join(''));
  }else{
    $("#timeline_list").html(timeline.join(''));
  }
  for(var i=0;i<data.rows.length;i++){
    if(data.rows[i].value.usermedhis_docid && data.rows[i].value.selfcare_docid && data.rows[i].value.patientnotes_docid){
      var self_care_id = data.rows[i].value.selfcare_docid;
    // lab result display start...
      $.couch.db(db).openDoc(data.rows[i].value.usermedhis_docid,{
        success:function(ldata){
          $.couch.db(db).openDoc(self_care_id,{
            success:function (sdata){
              $.couch.db(db).openDoc("lab_reference_value",{
                success:function(pdata){
                  var lab_data=[];
                  for(var i=0;i<pdata.reference_values.length;i++){ 
                     for(var j=0;j<pdata.reference_values[i].Lipid_Profile.length;j++){ 
                        lab_data.push('<tr><td width="73%">'+pdata.reference_values[i].Lipid_Profile[j].field_name+'</td>');
                        lab_data.push("<td>"+pdata.reference_values[i].Lipid_Profile[j].ranges[0].start+" To "+pdata.reference_values[i].Lipid_Profile[j].ranges[0].end+"</td>");
                        if(pdata.reference_values[i].Lipid_Profile[j].field_name == 'Total Cholesterol'){

                            if((parseFloat(ldata.tc_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.tc_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                              lab_data.push('<td>'+(ldata.tc_reading ? ldata.tc_reading : "NA")+'</td>');
                            }else{
                              ldata.tc_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.tc_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>');                                
                            }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'dHDL') {
                          if((parseFloat(ldata.hdl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.hdl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                             lab_data.push('<td>'+(ldata.hdl_reading ? ldata.hdl_reading : "NA")+'</td>'); 
                          }else{
                            ldata.hdl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.hdl_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>');    
                          }
                          
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'LDL') {
                          if((parseFloat(ldata.ldl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.ldl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.ldl_reading ? ldata.ldl_reading : "NA")+'</td>');
                          }else{
                          ldata.ldl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.ldl_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'TRIGLYCERIDES') {
                          if((parseFloat(ldata.tgl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.tgl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.tgl_reading ? ldata.tgl_reading : "NA")+'</td>');
                          }else{
                            ldata.tgl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.tgl_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'VLDL') {
                           if((parseFloat(ldata.vldl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.vldl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.vldl ? ldata.vldl : "NA")+'</td>');
                          }else{
                             ldata.vldl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.vldl+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'CHOL/dHDL') {
                           if((parseFloat(ldata.chol_dhdl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.chol_dhdl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.chol_dhdl ? ldata.chol_dhdl : "NA")+'</td>');
                          }else{
                             ldata.chol_dhdl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.chol_dhdl+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'dLDL/dHDL') {
                           if((parseFloat(ldata.dldl_dhdl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.dldl_dhdl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.dldl_dhdl ? ldata.dldl_dhdl : "NA")+'</td>');
                          }else{
                             ldata.dldl_dhdl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.dldl_dhdl+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'TOTAL LIPIDS') {

                           if((parseFloat(ldata.total_lipids) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.total_lipids) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.total_lipids ? ldata.total_lipids : "NA")+'</td>');
                          }else{
                             ldata.total_lipids ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.total_lipids+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'DirectLDL') {
                           if((parseFloat(ldata.directL_dL) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.directL_dL) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                            lab_data.push('<td>'+(ldata.directL_dL ? ldata.directL_dL : "NA")+'</td>');
                          }else{
                             ldata.directL_dL ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.directL_dL+'</td>') : lab_data.push('<td colspan="2">NA</td>');   
                          }
                        }else{
                          lab_data.push('<td colspan="2">NA</td>');
                        }

                      }
                      lab_data.push('</tr>');
                      lab_data.push('<tr><td colspan="3" style="font-weight:bold;">Glucose Test</td></tr>');
                      for(var j=0;j<pdata.reference_values[i].Glucose_Test.length;j++){ 
                          lab_data.push('<tr><td>'+pdata.reference_values[i].Glucose_Test[j].field_name+'</td>');
                           if (pdata.reference_values[i].Glucose_Test[j].field_name == 'Random Blood Sugar') {
                             lab_data.push("<td>"+pdata.reference_values[i].Glucose_Test[j].ranges[0].start+" To "+pdata.reference_values[i].Glucose_Test[j].ranges[0].end+"</td>")
                             if((parseFloat(sdata.Fasting_Glucose) > parseFloat(pdata.reference_values[i].Glucose_Test[j].ranges[0].start)) && (parseFloat(sdata.Fasting_Glucose) < parseFloat(pdata.reference_values[i].Glucose_Test[j].ranges[0].end))){
                               lab_data.push('<td>'+(sdata.Fasting_Glucose ? sdata.Fasting_Glucose : "NA")+'</td>');
                             }else{
                               sdata.Fasting_Glucose ? lab_data.push('<td>'+sdata.Fasting_Glucose+'</td>') : lab_data.push('<td colspan="2">NA</td>');  
                             }
                           }else {
                             lab_data.push('<td colspan="2">NA</td>');
                           }
                        
                      }
                      lab_data.push('</tr>');
                      lab_data.push('<tr><td colspan="3" style="font-weight:bold;">Blood Pressure</td></tr>');
                      for(var j=0;j<pdata.reference_values[i].Blood_Pressure.length;j++){ 
                        lab_data.push('<tr><td>'+pdata.reference_values[i].Blood_Pressure[j].field_name+'</td>');
                        if (pdata.reference_values[i].Blood_Pressure[j].field_name == 'Systolic Blood Pressure') {
                          lab_data.push("<td>"+pdata.reference_values[i].Blood_Pressure[j].ranges[0].start+" To "+pdata.reference_values[i].Blood_Pressure[j].ranges[0].end+"</td>")
                          if((parseFloat(ldata.sbp_reading) > parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].start)) && (parseFloat(ldata.sbp_reading) < parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].end))){
                            lab_data.push('<td>'+ldata.sbp_reading ? ldata.sbp_reading : "NA"+'</td>');
                          }else{
                             ldata.sbp_reading ? lab_data.push('<td>'+ldata.sbp_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>'); 
                          }
                        }else if (pdata.reference_values[i].Blood_Pressure[j].field_name == 'Diastolic Blood Pressure') {
                          if((parseFloat(ldata.dbp_reading) > parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].start)) && (parseFloat(ldata.dbp_reading) < parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].end))){
                            lab_data.push('<td>'+ldata.dbp_reading ? ldata.dbp_reading : "NA"+'</td>');
                          }else{
                             ldata.dbp_reading ? lab_data.push('<td style="background:#C43227;color:#fff;" colspan="2">'+ldata.dbp_reading+'</td>') : lab_data.push('<td colspan="2">NA</td>'); 
                          }
                        }else {
                          lab_data.push('<td colspan="2">NA</td>');
                        }
                      }
                      lab_data.push('</tr>');
                      lab_data.push('<tr><td style="font-weight:bold;" colspan="3">Heart Health</td></tr>');
                      lab_data.push('<tr><td>SPO2(%)</td><td>'+sdata.O2+'</td></tr>');
                      lab_data.push('<tr><td>Heart Rate</td><td colspan="2">'+sdata.HeartRate+'</td></tr>');
                        }
                      if(seemoreclicked){
                        $.unblockUI();
                      }
                      $("#lab_result_medical_details_timeline").html('<thead><th>LabTests</th><th>Range</th><th>Information</th></thead>'+lab_data.join(''));
                      $("#lab_result_medical_details_timeline").show();
                },
                error:function(data,error,reason){
                  newAlert('danger',reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                }
              });
            },
            error:function(data,error,reason){
              newAlert('danger',reason);
              $('html, body').animate({scrollTop: 0}, 'slow');   
            }
          });
        },
        error:function(data,error,reason){
          newAlert('danger',reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });
    }else{
      $("#lab_result_medical_details, #labdetails").hide();
      $.unblockUI();
    }
    // lab result display end...
  }
  $('#timeline_list').find('.timelinecontents').each(function(){
      // if($(this).innerHeight() >= 238){
      //  $(this).next().html("Read More");
      // }
  });

  for(var i=1; i<data.rows.length; i++){
    if($('#timelineyear'+i).html() != $('#timelineyear'+(i-1)).html()){
      $('#timelineyear'+i).addClass('newYear');
    }
    if($('#container'+i+' .imgcontainer img').width() > 250){
      $('#container'+i+' .imgcontainer img').width('250px');
      $('#container'+i+' .imgcontainer').css('border','none');
    }
    
  }
}

function getTimeLineRecordsByFilter($obj){
  $('#timeline_list').html('');
  if($obj.find('.filter-circle').css('border-right-color') == "rgb(44, 62, 80)"){
    $.couch.db(db).view("tamsa/getTimeLineRecords", {
      success: function(data) {
        if(data.rows.length < 10){
          $('#seemore').hide();
          $('#seemore').data("skip_value",0);
          $('#seemore').data("count",0);
        }else{
          // $('#seemore').attr("datalen",data.rows.length);  
          $('#seemore').show();
          $('#seemore').data("skip_value",0);
          $('#seemore').data("count",0);
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [userinfo.user_id,{},{}],
      endkey: [userinfo.user_id],
      descending : true,
      skip: 0,
      limit:10
    });
    getTimeLineRecords(0,"");
  }else if($obj.find('.filter-circle').css('border-right-color') == "rgb(253, 216, 53)"){
    $('#seemore_lab').data("skip_value",0);
    $.couch.db(db).view("tamsa/getTimeLineRecords", {
      success: function(data) {
        if(data.rows.length < 10){  
          $('#seemore_lab').hide();  
        }else{
          $('#seemore_lab').show();
          $('#seemore_lab').attr("datalen",data.rows.length);
          $('#seemore_lab').data("skip_value",0);
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [0,userinfo.user_id,"Anual_Exam",{}],
      endkey: [0,userinfo.user_id,"Anual_Exam"],
      descending : true
    });
    getTimeLineRecordsByLab(0,"");
  }else if($obj.find('.filter-circle').css('border-right-color') == "rgb(190, 27, 87)"){//charting-template
    $('#seemore_chart').data("skip_value",0);
    $.couch.db(db).view("tamsa/getTimeLineRecords", {
      success: function(data) {
        if(data.rows.length < 10){
          $('#seemore_chart').hide();  
        }else{
          $('#seemore_chart').show();
          $('#seemore_chart').attr("datalen",data.rows.length);
          $('#seemore_chart').data("skip_value",0);
        }
      },
      error: function(status) {
        console.log(status);
      },
      startkey: [0,userinfo.user_id,"patient_charting_template",{}],
      endkey: [0,userinfo.user_id,"patient_charting_template"],
      descending : true,
    });
    getTimeLineRecordsByCharting(0,"");
  }
  $('.filter-toggle').removeClass('on');
  $('.filter-toggle').parent().removeClass('on');
  $obj.find('.filter-circle').addClass('on');
  $obj.find('.filter-circle').parent().addClass('on');
}

var counter = 0;
function getTimelineRecordsSeemore($object){
    $.blockUI();
    if(counter == 0){
      $('#seemore').data("skip_value",0);
      var skip_value = $('#seemore').data("skip_value")+10;
      getTimeLineRecords(skip_value,"","seemore_clicked");
      $('#seemore').data("skip_value",skip_value);
      $('#seemore').data("count",skip_value+display_value);
    }else{
      var skip_value = $('#seemore').data("skip_value");
      var count      = $('#seemore').data("count");
      getTimeLineRecords(skip_value+display_value,"","seemore_clicked");
      $('#seemore').data("count",count+display_value);
      $('#seemore').data("skip_value",skip_value+display_value);
    }
    counter++;
    if(Number($('#seemore').data("count")) > Number($('#seemore').attr("datalen"))){
      counter = 0;
      $("#seemore").hide();
    }
}

var counter_lab = 0;
function getTimelineRecordsSeemoreLab(){
    $.blockUI();
    if(counter_lab == 0){
      var skip_value = $('#seemore_lab').data("skip_value")+10;
      getTimeLineRecordsByLab(skip_value,"seemore_clicked");
      $('#seemore_lab').data("skip_value",skip_value);
      $('#seemore_lab').data("count",skip_value+display_value);
    }else{
      var skip_value = $('#seemore_lab').data("skip_value");
      var count = $('#seemore_lab').data("count");
      getTimeLineRecordsByLab(skip_value+display_value,"seemore_clicked");
      $('#seemore_lab').data("count",count+display_value);
      $('#seemore_lab').data("skip_value",skip_value+display_value);
    }
    counter_lab++;
    if(Number($('#seemore_lab').data("skip_value")) > Number($('#seemore_lab').attr("datalen"))){
      counter_lab = 0
      $("#seemore_lab").hide();
    }
}

var counter_chart = 0;
function getTimelineRecordsSeemoreChart(){
    $.blockUI();
    if(counter_chart == 0){
      var skip_value = $('#seemore_chart').data("skip_value")+10;
      getTimeLineRecordsByCharting(skip_value,"seemore_clicked");
      $('#seemore_chart').data("skip_value",skip_value);
      $('#seemore_chart').data("count",skip_value+display_value);
    }else{
      var skip_value = $('#seemore_chart').data("skip_value");
      var count      = $('#seemore_chart').data("count");
      getTimeLineRecordsByCharting(skip_value+display_value,"seemore_clicked");
      $('#seemore_chart').data("count",count+display_value);
      $('#seemore_chart').data("skip_value",skip_value+display_value);
    }
    counter_chart++;
    if(Number($('#seemore_chart').data("count")) > Number($('#seemore_chart').attr("datalen"))){
      counter_chart = 0;
      $("#seemore_chart").hide();
    }
}

function showHideSeemore(element){
  if($('#timeline_tab').hasClass('active')){
    $(element).addClass('ajax-loader-large');  
    $(element).trigger('click');
  }
}

function scrollingUtilities(){
  if ($(window).scrollTop() == $(document).height() - window.innerHeight){
    if ($('#seemore').css('display') == "block")
      setTimeout(function(){showHideSeemore('#seemore');}, 3000);
    else if ($('#seemore_chart').css('display') == "block")
      setTimeout(function(){showHideSeemore('#seemore_chart');}, 3000);
    else if ($('#seemore_lab').css('display') == "block")
      setTimeout(function(){showHideSeemore('#seemore_lab');}, 3000);
  }
}

function viewEnlargeForPdf($obj){
  $('#imglayer').html("<iframe width='837' height='871' class='media' src='"+$obj.attr('pdfurl')+"'></iframe>");
  $('#img_enlarge').modal("show");
  $('#img_enlarge .modal-header .modal-title').html("PDF Viewer");
}

function imageEnlargeUtility($obj){
  if($obj.data("width")) {
    $('#imglayer').html('<canvas id="preview_canvas" height="600" width="1200">Canvas not supported</canvas>');

    var previewCanvas  = document.getElementById("preview_canvas");
    var previewContext = previewCanvas.getContext('2d');

    var imageWidth  = Number($obj.data("width"));
    var imageHeight = Number($obj.data("height"));

    drawImageOnCanvas(previewContext, previewCanvas.width, previewCanvas.height, $obj.find("img").attr("src"), imageWidth, imageHeight);
    // $('#imglayer img').attr('width',$obj.data("width"));
    // $('#imglayer img').attr('height',$obj.data("height"));
  }else {
    $obj.find('img').css('width','auto');
    $('#imglayer').html($obj.html());
    $('#imglayer img').height("374px");
    if($obj.children().width() > 871){
      $obj.children().width(871);
    }
  }
	$('#img_enlarge').modal("show");
}

function drawImageOnCanvas(canvasContext, canvasWidth, canvasHeight, url, imageWidth, imageHeight) {
  var canvasPic = new Image();
  canvasContext.clearRect(0,0,canvasWidth,canvasHeight);
  canvasPic.onload = function () {
    console.log((canvasWidth - imageWidth)/2);
    console.log((canvasHeight - imageHeight)/2);
    canvasContext.drawImage(canvasPic, 0, 0);
    //saveDrawingSurface();
  }
  canvasPic.src = url;
}

function expandCollapseToggleTimeline(){
  if($('#expand').html() == "Expand All"){
    $('#expand').html("Collapse All");
    $('.timelinecontents').show();
    $('.iconToggleTimeline').removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
    $('.timeline-toggle').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
  }else{
    $('#expand').html("Expand All");
    $('.timelinecontents').hide();
    $('.iconToggleTimeline').removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
   $('.timeline-toggle').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
  }
}