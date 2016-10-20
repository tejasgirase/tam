var userinfo               = {};
var userinfo_medical       = {};
var thresholdAlerts        = {};
var thresholdGenericAlerts = {};
var msg;
var display_value = 30;

function backbefore() {
  window.onbeforeunload = function() { return "Pressing back button will sign you out of the session. Please use the provided back button in the application to go back or navigate"; };
}
function backafter() {
  window.onbeforeunload = function() {};
}

function bloodPressure() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var Diastolic_BP     = [];
        var Systolic_BP      = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          Diastolic_BP.push(Number(data.rows[i].doc.Value_Diastolic_BP));
          Systolic_BP.push(Number(data.rows[i].doc.Value_Systolic_BP));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));
        }
        if($("#cvg_blood_pressure").is(':checked')) {
          $("#blood_pressure_graph").attr("style", "min-width:500px; height:200px;margin:0 auto;float:left;");
          $("#blood_pressure_graph").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'Blood pressure',

                x: 0 //center
              },
              yAxis: {
                  title: {
                      text: '',
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'Diastolic BP',
                  data: Diastolic_BP
              },
              {
                  name: 'Systolic BP',
                  data: Systolic_BP
              }
              ]
          });
        }
        else {
          $("#blood_pressure_graph").removeAttr("style");
          $("#blood_pressure_graph").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [1,userinfo.user_id,{}],
    endkey: [1,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function weightGraph() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var weight           = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          weight.push(Number(data.rows[i].doc.Value_weight));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));        
        }
        if($("#cvg_weight").is(':checked')) {
          $("#graph_weight").attr("style", "min-width:500px;height: 200px; margin: 0 auto;float:left;");
          $("#graph_weight").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'Weight',
                x: 0 //center
              },
              yAxis: {
                  title: {
                      text: ''
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'Weight',
                  data: weight
              }]
          }); 
        }
        else {
          $("#graph_weight").removeAttr("style");
          $("#graph_weight").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [2,userinfo.user_id,{}],
    endkey: [2,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function heartRateGraph() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var HeartRate        = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          HeartRate.push(Number(data.rows[i].doc.HeartRate));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));        
        }
        if($("#cvg_heart_rate").is(':checked')) {
          $("#graph_heartRate").attr("style", "min-width:500px;height:200px; margin: 0 auto;float:left;");
          $("#graph_heartRate").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'Heart Rate',
                x: 0 //center
              },
              yAxis: {
                  title: {
                      text: ''
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'Heart Rate',
                  data: HeartRate
              }]
          });
        }
        else {
          $("#graph_heartRate").removeAttr("style");
          $("#graph_heartRate").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [3,userinfo.user_id,{}],
    endkey: [3,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function o2Graph() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var O2               = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          O2.push(Number(data.rows[i].doc.O2));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));        
        }
        if($("#cvg_o2").is(':checked')) {
          $("#graph_o2").attr("style", "min-width:500px;height: 200px; margin: 0 auto;float:left;");
          $("#graph_o2").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'O2',
                x: 0 //center
              },
              yAxis: {
                  title: {
                      text: ''
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'O2',
                  data: O2
              }]
          }); 
        }else {
          $("#graph_o2").removeAttr("style");
          $("#graph_o2").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [4,userinfo.user_id,{}],
    endkey: [4,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function respirationRateGraph() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var Respiration_Rate = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          Respiration_Rate.push(Number(data.rows[i].doc.Respiration_Rate));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));        
        }
        if($("#cvg_respiration_rate").is(':checked')) {
          $("#graph_respiration_rate").attr("style", "min-width:500px;height: 200px; margin:0 auto;;float:left;");
          $("#graph_respiration_rate").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'Respiration Rate',
                x: 0 //center
              },
              yAxis: {
                  title: {
                      text: ''
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'Respiration Rate',
                  data: Respiration_Rate
              }]
          }); 
        }
        else {
          $("#graph_respiration_rate").removeAttr("style");
          $("#graph_respiration_rate").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [5,userinfo.user_id,{}],
    endkey: [5,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function fastingGlucoseGraph() {
  $.couch.db(db).view("tamsa/getVitalSignsForGraphs", {
    success: function(data) {
      if(data.rows.length > 0){
        var fasting_glucose  = [];
        var insertDate       = [];
        for (var i = data.rows.length - 1; i >= 0; i--) {
          fasting_glucose.push(Number(data.rows[i].doc.Fasting_Glucose));
          insertDate.push(moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD"));        
        }
        if($("#cvg_fasting_glucose").is(':checked')) {
          $("#graph_fasting_glucose").attr("style", "min-width:500px;height: 200px; margin: 0 auto;float:left;");
          $("#graph_fasting_glucose").highcharts({
              xAxis: {
                categories: insertDate,
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '10px'
                  }
                }
              },
              title: {
                text: 'Glucose',
                x: 0 //center
              },
              yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
              },
              tooltip: {
                  valueSuffix: ''
              },
              series: [{
                  name: 'Glucose',
                  data: fasting_glucose
              }]
          }); 
        }
        else {
          $("#graph_fasting_glucose").removeAttr("style");
          $("#graph_fasting_glucose").html("");
        }
      }else{
        $("#showMsgChartSection4").show();
        $("#showMsgChartSection1").show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [6,userinfo.user_id,{}],
    endkey: [6,userinfo.user_id,],
    descending:true,
    limit:12,
    include_docs:true
  });
}

function labCharts(hdl_reading, ldl_reading, tc_reading, tgl_reading, insertDate) {
  $("#labGraphs").highcharts({
      xAxis: {
          categories: insertDate
      },
      title: {
        text: 'Lab & Diagnostics',
        x: 0 //center
      },
      yAxis: {
          title: {
              text: ''
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          valueSuffix: ''
      },
      series: [{
          name: 'HDL',
          data: hdl_reading
      },
      {
          name: 'LDL',
          data: ldl_reading
      },
      {
          name: 'TC',
          data: tc_reading
      },
      {
          name: 'TGL',
          data: tgl_reading
      }]
  });  
}

function saveThresholds() {
  var reports = [];
  var alerts  = [];
  var freq    = '';
  var tAlerts = [];

  tAlerts.push('HeartRate:'+$("#heartrate_low").val()+':'+$("#heartrate_high").val());
  tAlerts.push('Weight:'+$("#weight_low").val()+':'+$("#weight_high").val());
  tAlerts.push('Glucose:'+$("#glucose_low").val()+':'+$("#glucose_low").val());
  tAlerts.push('BP:'+$("#bp_low").val()+':'+$("#bp_high").val());
  tAlerts.push('Oxygen:'+$("#oxygen_low").val()+':'+$("#oxygen_high").val());
  tAlerts.push('RespirationRate:'+$("#respiration_rate_low").val()+':'+$("#respiration_rate_high").val());
 
  $(".report_checkbox").each(function() {
    if($(this).is(':checked'))
      reports.push($(this).val());
  });

  $(".alert_checkbox").each(function() {
    if($(this).is(':checked'))
      alerts.push($(this).val());
  });

  $(".report_freq").each(function(){
    if($(this).is(':checked'))
      freq = $(this).attr('id');
  });

  var d = new Date();

  if (!thresholdAlerts._id) {
    thresholdAlerts.insert_ts  = d;
    thresholdAlerts.Analytics  = "Heart Failure";
    thresholdAlerts.Conditions = [];
    thresholdAlerts.doctype    = "Analytics";
    thresholdAlerts.user_id    = userinfo.user_id;
  }

  thresholdAlerts.update_ts       = d;
  thresholdAlerts.ThresholdAlerts = tAlerts;
  thresholdAlerts.ReportFrequency = freq;
  thresholdAlerts.ReportFields    = reports;
  thresholdAlerts.AlertFields     = alerts;
  thresholdAlerts.doctor_id       = pd_data._id;

  $.couch.db(db).saveDoc(thresholdAlerts, {
    success: function(data) {
     newAlert('success', 'Care Plans Saved successfully !');
     $('html, body').animate({scrollTop: 0}, 'slow');
     getThresholdAlerts();
    },
    error: function(data, error, reason) {   
      if (data == '409') {
        newAlert('error', 'Details were updated already on other device.');
        $('html, body').animate({scrollTop: 0}, 'slow');
        getThresholdAlerts();
      }
      else {
        newAlert('error', reason);
      }
    }
  });
}

function saveGenericThresholds() {
  var reports = [];
  var alerts  = [];
  var freq    = '';
  var tAlerts = [];

  tAlerts.push('HeartRate:'+$("#generic_heartrate_low").val()+':'+$("#generic_heartrate_high").val());
  tAlerts.push('Weight:'+$("#generic_weight_low").val()+':'+$("#generic_weight_high").val());
  tAlerts.push('Glucose:'+$("#generic_glucose_low").val()+':'+$("#generic_glucose_low").val());
  tAlerts.push('BP:'+$("#generic_bp_low").val()+':'+$("#generic_bp_high").val());
  tAlerts.push('Oxygen:'+$("#generic_oxygen_low").val()+':'+$("#generic_oxygen_high").val());
  tAlerts.push('RespirationRate:'+$("#generic_respiration_rate_low").val()+':'+$("#generic_respiration_rate_high").val());
  
  $(".generic_report_checkbox").each(function() {
    if($(this).is(':checked'))
      reports.push($(this).val());
  });

  $(".generic_alert_checkbox").each(function() {
    if($(this).is(':checked'))
      alerts.push($(this).val());
  });

  $(".generic_report_freq").each(function(){
    if($(this).is(':checked'))
      freq = $(this).val();
  });

  var d = new Date();

  if (!thresholdGenericAlerts._id) {
    thresholdGenericAlerts.insert_ts  = d;
    thresholdGenericAlerts.Analytics  = "Generic";
    thresholdGenericAlerts.Conditions = [];
    thresholdGenericAlerts.doctype    = "Analytics";
    thresholdGenericAlerts.user_id    = userinfo.user_id;
  }

  thresholdGenericAlerts.update_ts       = d;
  thresholdGenericAlerts.ThresholdAlerts = tAlerts;
  thresholdGenericAlerts.ReportFrequency = freq;
  thresholdGenericAlerts.ReportFields    = reports;
  thresholdGenericAlerts.AlertFields     = alerts;
  thresholdGenericAlerts.doctor_id       = pd_data._id;

  $.couch.db(db).saveDoc(thresholdGenericAlerts, {
    success: function(data) {
     newAlert('success', 'Care Plan Saved successfully !');
     $('html, body').animate({scrollTop: 0}, 'slow');
     getGenericThresholdAlerts();
    },
    error: function(data, error, reason) {  
      if (data == '409') {
        newAlert('error', 'Details were updated already on other device.');
        $('html, body').animate({scrollTop: 0}, 'slow');
        getGenericThresholdAlerts();
      }
      else {
        newAlert('error', reason);
      }
    }
  });
}

function getUSerDetailsFromUserID(userid){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(data){
      if(data.rows.length > 0){
        $("#fd_appointment_patient_email").val(data.rows[0].doc.user_email).attr("readonly","readonly");
        $("#fd_appointment_patient_phone").val(data.rows[0].doc.phone).attr("readonly","readonly");
      }else{
        console.log("No patient details in personal information.");
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
}

function autocompleterSelectEventForSubscriberListOnNewTask(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    return false;
  }else{
    $("#"+search_id).val(ui.item.key[1]);
    $("#"+search_id).data("user_id",ui.item.key[2]);
  }
  return false;
}

function autocompleterSelectEventForSubscriberListOnAddDocument(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    return false;
  }else{
    $("#d_patient_name").val(ui.item.key[1]);
    $("#d_patient_id").val(ui.item.key[2]);
  }
  return false;
}

function autocompleterSelectForSubscriberByPatientDHPListOnAddDocument(ui,search_id){
  if(ui.item.key[2] == "No results found"){
    return false;
  }else{
    $("#d_patient_dhpid").val(ui.item.key[2]);
    $("#d_patient_id").val(ui.item.doc.user_id);
    $("#d_patient_name").val(ui.item.doc.User_firstname + " " +ui.item.doc.User_lastname);
  }
}

function showhideloader(arg){
  if(arg == 'show'){
    $('.layers').show();
    $("#btn-loader").show();
  }else{
    $('.layers').hide();
    $("#btn-loader").hide();  
  }
}

function showProcessLoader(msg) {
  $('body').append('<div id="loading_image" style="z-index: 9999; border: medium none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background-color: rgb(0, 0, 0); opacity: 0.6; cursor: wait; position: fixed;" class="blockUI blockOverlay"><div style="z-index: 1011; position: fixed; padding: 0px; margin: 0px; width: 30%; top: 40%; left: 35%; text-align: center; color: rgb(0, 0, 0); cursor: wait;" class="blockUI blockMsg blockPage"><h3 style="height:auto;font-size:15px;color:#FF9108;margin:0px;margin-bottom:4px;padding:0px;"><br><img style="padding:0px; margin:0px;" alt="" title="Loading..." src="images/ajax-loader-large.gif"><br>'+(msg ? msg : "")+'</h3></div></div>');
}

function removeProcessLoader(id) {
  $("#"+id).remove();
}

function searchDHPPatientByNameAutocompleter(search_id,selectEvent,include_image,dhpcode){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
       $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      var view = "";
      var keyval = "";
        view = "tamsa/getDhpSubscriberByName";
        keyval  = dhpcode;
      $.couch.db(db).view(view, {
        success: function(data) {
          response(data.rows);
          $("#"+search_id).removeClass('myloader');
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
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
      selectEvent(ui,search_id);
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
        .append("<a>" + item.key[1] + "</a>")
        .appendTo(ul);
    }
    else {
        getAutoCompleteImages(item.key[2],search_id+"search_pic_");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='"+search_id+"search_pic_"+item.key[2]+"'><span class='pull-right' id='phone_"+item.key[2]+"'></span>" + item.key[1] + "</a>")
          .appendTo(ul);
      // }else{
      //   return $("<li></li>")
      //     .data("item.autocomplete", item)
      //     .append("<a>"+item.key[1]+"</a>")
      //     .appendTo(ul);
      // }
    }
  };
}

function searchPatientsByNameOrDHPIdAutocompleter(search_id,selectEvent,include_image,doctor_id,dhpcode,_view,_viewDHP){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
       $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      var view = "";
      var keyval = "";
      if(pd_data.level == "Doctor" || pd_data.level == ""){
        view = "tamsa/"+_view;
        keyval = doctor_id;
      }else{
        view   = "tamsa/"+_viewDHP;
        keyval = dhpcode;
      }
      $.couch.db(db).view(view, {
        success: function(data) {
          response(data.rows);
          $("#"+search_id).removeClass('myloader');
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        startkey: [keyval,$("#"+search_id).val().trim()],
        endkey: [keyval,$("#"+search_id).val().trim()+"\u9999"],
        reduce:true,
        group:true,
        limit:5
      });
    },
    focus: function(event, ui) {
      $("#"+search_id).val(ui.item.key[3]);
      return false;
    },
    minLength: 1,
    select: function( event, ui ) {
      selectEvent(ui,search_id);
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { key: ['','','','No results found'],label:"No results found" };
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
    if (item.key[3] == "No results found") {
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + item.key[3]+ "</a>")
        .appendTo(ul);
    }
    else {
      if(include_image){
        getAutoCompleteImages(item.key[2],search_id+"search_pic_");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='"+search_id+"search_pic_"+item.key[2]+"'>  " + item.key[3] + "<small class='rght-float pdhp-search-box'>"+item.key[4]+"</small></a>")
          .appendTo(ul);
      }else{
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>"+item.key[3]+"<small class='rght-float pdhp-search-box'>"+item.key[4]+"</small></a>")
          .appendTo(ul);
      }
    }
  };
}

function searchPatientByNameAutocompleter(search_id,selectEvent,include_image,doctor_id,dhpcode){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
       $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      var view = "";
      var keyval = "";
      if($("#pd_level").val() == "Doctor" || $("#pd_level").val() == ""){
        view = "tamsa/testPatients";
        keyval = doctor_id;
      }else{
        view = "tamsa/getDhpSubscriberByName";
        keyval  = dhpcode;
      }
      $.couch.db(db).view(view, {
        success: function(data) {
          response(data.rows);
          $("#"+search_id).removeClass('myloader');
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
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
      selectEvent(ui,search_id);
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
        .append("<a>" + item.key[1] + "</a>")
        .appendTo(ul);
    }
    else {
      if(include_image){
        getAutoCompleteImages(item.key[2],search_id+"search_pic_");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='"+search_id+"search_pic_"+item.key[2]+"'>  " + item.key[1] + "</a>")
          .appendTo(ul);
      }else{
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>"+item.key[1]+"</a>")
          .appendTo(ul);
      }
    }
  };
}

function searchPatientByDHPIdAutocompleter(search_id,selectEvent,include_image,doctor_id,dhpcode){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
      $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      if($("#pd_level").val() == "Doctor" || $("#pd_level").val() == ""){
        $.couch.db(db).view("tamsa/getSubscriberByPatientDhpId", {
          success: function(data) {
            $("#"+search_id).removeClass('myloader');
            response(data.rows);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey:     [dhpcode,doctor_id,$("#"+search_id).val().trim()],
          endkey:       [dhpcode,doctor_id,$("#"+search_id).val().trim()+"\u9999"],
          limit:        5,
          include_docs: true
        });
      }else{
        $.couch.db(db).view("tamsa/getDhpSubscriberByPatientDhpId", {
          success: function(data) {
            $("#"+search_id).removeClass('myloader');
            response(data.rows);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey:     [dhpcode,$("#"+search_id).val().trim()],
          endkey:       [dhpcode,$("#"+search_id).val().trim()+"\u9999"],
          limit:        5,
          include_docs: true
        });
      }
    },
    focus: function(event, ui) {
      return false;
    },
    minLength: 1,
    select: function( event, ui ) {
      selectEvent(ui,search_id);
      //$("#"+search_id).addClass('myloader');
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
        .append("<a>No Patient Found ...</a>")
        .appendTo(ul);
    }
    else {
      if(include_image){
        getAutoCompleteImages(item.doc.user_id,"search_by_patient_dhp_pic_");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='search_by_patient_dhp_pic_"+item.doc.user_id+"'>  " + item.doc.User_firstname + " " +item.doc.User_lastname + "<small class='rght-float pdhp-search-box'>"+item.doc.patient_dhp_id+"</small></a>")
          .appendTo(ul);
      }else{
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>" + item.doc.User_firstname + " " +item.doc.User_lastname + "<small class='rght-float pdhp-search-box'>"+item.doc.patient_dhp_id+"</small></a>")
          .appendTo(ul);
      }
      
    }
  };
}

function searchReferredPatientByNameAutocompleter(search_id,selectEvent,doctor_id){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
      $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      var view = "";
      var keyval = "";
      $.couch.db(db).view("tamsa/getReferredPatientsByName", {
        success: function(data) {
          response(data.rows);
          $("#"+search_id).removeClass('myloader');
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        startkey: ["N",doctor_id,$("#"+search_id).val().trim()],
        endkey: ["N",doctor_id,$("#"+search_id).val().trim()+"\u9999"],
        reduce:true,
        group:true
      });
    },
    focus: function(event, ui) {
      $("#"+search_id).val(ui.item.key[2]);
      return false;
    },
    minLength: 1,
    select: function( event, ui ) {
      selectEvent(ui,search_id);
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { key: ['','','No results found',''],label:"No results found" };
        ui.content.push(noResult);
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
    if (item.key[1] == "No results found") {
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + item.key[2] + "</a>")
        .appendTo(ul);
    }
    else {
      getAutoCompleteImages(item.key[3],search_id+"search_pic_");
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='"+search_id+"search_pic_"+item.key[3]+"'>  " + item.key[2] + "</a>")
        .appendTo(ul);
    }
  };
}

function searchReferredPatientByDHPIdAutocompleter(search_id,selectEvent,doctor_id){
  $("#"+search_id).autocomplete({
    search: function(event, ui) { 
       $("#"+search_id).addClass('myloader');
    },
    source: function( request, response ) {
      //if($("#pd_level").val() == "Doctor" || $("#pd_level").val() == ""){
        $.couch.db(db).view("tamsa/getReferredPatientsByPatientDHPId", {
          success: function(data) {
            $("#"+search_id).removeClass('myloader');
            response(data.rows);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey:     ["N",doctor_id,$("#"+search_id).val().trim()],
          endkey:       ["N",doctor_id,$("#"+search_id).val().trim()+"\u9999"],
          limit:        5,
          include_docs: true
        });
      // }else{
      //   $.couch.db(db).view("tamsa/getDhpSubscriberByPatientDhpId", {
      //     success: function(data) {
      //       $("#"+search_id).removeClass('myloader');
      //       response(data.rows);
      //     },
      //     error: function(status) {
      //       console.log(status);
      //     },
      //     startkey:     [pd_data.dhp_code,$("#"+search_id).val().trim()],
      //     endkey:       [pd_data.dhp_code,$("#"+search_id).val().trim()+"\u9999"],
      //     limit:        5,
      //     include_docs: true
      //   });
      // }
    },
    focus: function(event, ui) {
      return false;
    },
    minLength: 1,
    select: function( event, ui ) {
      selectEvent(ui,search_id);
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
        .append("<a>No Patient Found ...</a>")
        .appendTo(ul);
    }
    else {
      getAutoCompleteImages(item.doc.user_id,"search_by_patient_dhp_pic_");
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='search_by_patient_dhp_pic_"+item.doc.user_id+"'>  " + item.doc.User_firstname + " " +item.doc.User_lastname + "<small class='rght-float pdhp-search-box'>"+item.doc.patient_dhp_id+"</small></a>")
        .appendTo(ul);
    }
  };
}

function autocompleterSelectForDoctorsListOnAddDocument(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    $("#"+search_id).val("");
  }else{
    $("#"+search_id).val(ui.item.key[1]);
    $("#d_doctor_id").val(ui.item.value);  
  }
}

function autocompleterSelectForDoctorsList(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    $("#"+search_id).val("");
  }else{
    $("#"+search_id).val(ui.item.key[1]);
    $("#"+search_id).data("doctor_id",ui.item.value);
    $("#"+search_id).data("doctor_email",ui.item.doc.phone);
    $("#"+search_id).data("doctor_phone",ui.item.doc.email);
  }
}

// function searchDHPConsultantsList(search_id,selectEvent){
//   $("#"+search_id).autocomplete({
//     search: function(event, ui) {
//        $(this).addClass('myloader');
//     },
//     source: function( request, response ) {
//       $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
//         success: function(data) {
//           $("#"+search_id).removeClass('myloader');
//           response(data.rows);
//         },
//         error: function(status) {
//           console.log(status);
//         },
//         startkey: [pd_data.dhp_code, request.term],
//         endkey:   [pd_data.dhp_code, request.term + "\u9999"],
//         limit:    5,
//         include_docs:true
//       });
//     },
//     minLength: 3,
//     focus: function(event, ui) {
//       return false;
//     },
//     select: function( event, ui ) {
//       selectEvent(ui,search_id);
//       return false;
//     },
//     response: function(event, ui) {
//       if (!ui.content.length) {
//         var noResult = { key:['','No results found'],doc:{first_name:"No results Found",last_name:"",phone:""}};
//         ui.content.push(noResult);
//         //$("#message").text("No results found");
//       }
//     }
//   }).
//   data("uiAutocomplete")._renderItem = function(ul, item) {
//     console.log(item);
//     console.log(ul);
//     return $("<li></li>")
//       .data("item.autocomplete", item)
//       .append("<a>" + item.doc.first_name + " " +item.doc.last_name + "<small class='rght-float pdhp-search-box'>"+item.doc.phone+"</small></a>")
//       .appendTo(ul);
//   }
// }

function searchDHPDoctorsList(search_id,selectEvent,dhpcode){
  $("#"+search_id).autocomplete({
    search: function(event, ui) {
       $(this).addClass('myloader');
    },
    source: function( request, response ) {
      $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
        success: function(data) {
          $("#"+search_id).removeClass('myloader');
          response(data.rows);
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        startkey: [dhpcode, request.term],
        endkey:   [dhpcode, request.term + "\u9999"],
        limit:    5,
        include_docs:true
      });
    },
    minLength: 3,
    focus: function(event, ui) {
      return false;
    },
    select: function( event, ui ) {
      selectEvent(ui,search_id);
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
}

function openAddPatientTaskModal($obj){
  $obj.val("Select Action");
  $("#task_user_id").val($obj.attr('user_id'));
  $("#task_user_id").attr('patient_name', $('.name_'+$obj.attr('user_id')).html());
  $(".task_patient_checkbox").not($obj).removeAttr("checked");
  $(".patient-task-priority").val("Regular");
  $(".patient-task-due-date").val("");
  $(".patient-task-comments").val("");
  $(".patient-task-effective-date").val("");
  $(".patient-task-notify").prop("checked",false);
  $("#add_patient_task_modal").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
}

function getPatientProfileForUpdate(user_id){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success: function(personal_info) {
      if(personal_info.rows.length  == 1){
        $.couch.db(db).view("tamsa/testPatientsInfo",{
          success: function(medical_info) {
            if(medical_info.rows.length > 0){
              getPatientProfileDetails(personal_info,medical_info);
            }else{
              getPatientProfileDetails(personal_info);
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key: user_id
        });
      }else if(personal_info.rows.length > 1){
        newAlert("danger","Multiple Personal Information Records Found. Patients Found.Please contact admin.");
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        newAlert("danger","NO Patients Information record Found.");
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: user_id,
  });  
}

function setmenu(){
  $('#signmenu').parent().css({'width':'278px','padding':'0','float':'right'});
  $('#signmenu li').css({'width':'100%','padding':'0px 0px 1px 0px'});
  $('#Logout').parent().css('width','49%');
  $('#help').parent().css('width','19%');
}

function getAnalyticsRangeForCharting(userid){
  $.couch.db(db).view("tamsa/getAnalyticsRange", {
    success: function(data) {
      $("#charting_vital_sign_current_date").html(moment().format("DD-MM-YYYY"));
      if (data.rows.length > 0) {
        $("#vital_signs_doctor_note").show();
        var vital_sign_data = [];
        for(var i=0;i<data.rows.length;i++){
          vital_sign_data.push('<tr class="recent-vital-values">');
          vital_sign_data.push('<td class="text-align" style="padding:8px;">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td>');
          vital_sign_data.push('<td><table class="table" border="0">');
          vital_sign_data.push('<tbody><tr>');
          vital_sign_data.push('<td class="text-align" width="33%" style="padding:8px;">'+(data.rows[i].value.Value_Systolic_BP ? data.rows[i].value.Value_Systolic_BP : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align" width="33%" style="padding:8px;">'+(data.rows[i].value.Value_Diastolic_BP ? data.rows[i].value.Value_Diastolic_BP : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align" width="34%" style="padding:8px;">'+calculateMAP(Number(data.rows[i].value.Value_Systolic_BP),Number(data.rows[i].value.Value_Diastolic_BP))+'</td></tr></tbody>');
          vital_sign_data.push('</table>');
          vital_sign_data.push('</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.HeartRate ? data.rows[i].value.HeartRate : "NA")+'</td>');

          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.Fasting_Glucose ? data.rows[i].value.Fasting_Glucose : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.O2 ? data.rows[i].value.O2 : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.OutOfRange ? data.rows[i].value.OutOfRange : "NA")+'</td>');
          // vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.Value_weight ? data.rows[i].value.Value_weight : "NA")+'</td>');

          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.Value_temp ? data.rows[i].value.Value_temp : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.Respiration_Rate ? data.rows[i].value.Respiration_Rate : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.Value_weight ? data.rows[i].value.Value_weight : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.height ? data.rows[i].value.height : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.bmi ? data.rows[i].value.bmi : "NA")+'</td>');
          vital_sign_data.push('<td class="text-align">'+(data.rows[i].value.waist ? data.rows[i].value.waist : "NA")+'</td>');
          vital_sign_data.push('</tr>');
        }
        $("#charting_vital_sign_inputs").find(".recent-vital-values").remove();
        vitalSignsStatisticsAndGraphs(vital_sign_data);
        $("#charting_vital_sign_inputs").append(vital_sign_data.join(''));
        //$("#ct_vital_signs_doctor_note tbody").html(vital_sign_data);
      }else{
        // $("#vital_signs_doctor_note").hide();
        // $("#ct_vital_signs_doctor_note").hide();
      }
    },
    error:function(data,error,reason){
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    descending:true,
    startkey: ['SelfCare',userid,{}],
    endkey: ['SelfCare',userid],
    limit:3
  });
}

function calculateMAP(sbp,dbp){
  var systolic_bp = Number(sbp),
      diastolic_bp= Number(dbp); 
  if(systolic_bp && diastolic_bp) return Number((((2*diastolic_bp) + systolic_bp)/3).toFixed(2))
  else return "NA"
}

function vitalSignsStatisticsAndGraphs(vital_sign_data){
  vital_sign_data.push('<tr class="recent-vital-values">');
    vital_sign_data.push('<td style="padding:8px;"></td>');
    vital_sign_data.push('<td>');
      vital_sign_data.push('<table class="table tbl-border">');
        vital_sign_data.push('<tbody>');
          vital_sign_data.push('<tr>');
            vital_sign_data.push('<td class="text-center" width="30%" style="padding: 1px; border: medium none;"><span style="color:#1496FE;margin-right:2px;" class="glyphicon glyphicon-stats statistic_view" vtype="systolic_bp"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="systolic_bp"></span></td>');
            vital_sign_data.push('<td class="text-center" width="33%" style="padding: 1px; border: medium none;"><span style="color:#1496FE;margin-right:2px;" class="glyphicon glyphicon-stats statistic_view" vtype="diastolic_bp"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="diastolic_bp"></span></td>');
            vital_sign_data.push('<td class="text-center" width="33%" style="padding: 1px; border: medium none;"><span style="color:#1496FE;margin-right:2px;" class="glyphicon glyphicon-stats statistic_view" vtype="bp_map"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="bp_map"></span></td>');
          vital_sign_data.push('</tr>');
        vital_sign_data.push('</tbody>');
      vital_sign_data.push('</table>');
    vital_sign_data.push('</td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="heartrate"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="heartrate"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="fasting_glucose"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="fasting_glucose"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="o2"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="o2"></span></td>');
    // vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="normal_condition"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="normal_condition"></span></td>');
    vital_sign_data.push('<td class="text-center"></td>');
    // vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="value_weight"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="value_weight"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="temprature"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="temprature"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="respiration"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="respiration"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="weight"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="weight"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="height"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="height"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="bmi"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="bmi"></span></td>');
    vital_sign_data.push('<td class="text-center"><span style="color:#1496FE;" class="glyphicon glyphicon-stats statistic_view" vtype="waist"></span><span style="color:#1496FE;" class="glyphicon glyphicon-eye-open charting_view" vtype="waist"></span></td>');
  vital_sign_data.push('</tr>');
  return vital_sign_data;
}

function getAnalyticsRange(){
  bloodPressure();
  weightGraph();
  heartRateGraph();
  o2Graph();
  respirationRateGraph();
  fastingGlucoseGraph();
}

function setPatientBriefSummary(){
  $("#mh_name_new").html("<span class='glyphicon glyphicon-user cus-glyphicon' title='Patient Name'></span>"+userinfo.first_nm+" "+userinfo.last_nm);
  if(userinfo.user_email == "emailnotprovided@digitalhealthpulse.com"){
    $("#mh_emailid").html("<span class='glyphicon glyphicon-envelope cus-glyphicon cus-glyphicon-inline' title='Email'></span>NA");
  }else{
    $("#mh_emailid").html("<span class='glyphicon glyphicon-envelope cus-glyphicon cus-glyphicon-inline' title='Email'></span>"+((userinfo.user_email) ? userinfo.user_email : "NA" ));
  }
  $("#mh_BloodGroup_new").html("<span class='glyphicon glyphicon-tint' title='Blood Group'></span>"+(userinfo.bloodgroup ? userinfo.bloodgroup : "NA")) ;
  if(userinfo.date_of_birth && moment(userinfo.date_of_birth).isValid()){
    $("#mh_date_of_birth_new").show().html("<span class='glyphicon glyphicon-calendar cus-glyphicon' title='Date of Birth'></span>"+((moment(userinfo.date_of_birth).isValid()) ? moment(userinfo.date_of_birth).format("DD-MM-YYYY") : ""));
    var frmt_age;
    if(userinfo.date_of_birth.match(/[a-z]/i)) {
      frmt_age = getAge(userinfo.date_of_birth)
    }else {
      frmt_age = getAgeFromDOB(userinfo.date_of_birth);
    }
    $("#mh_date_of_birth_new").append("&nbsp;<small>("+frmt_age+" Yrs)</small>");
    $("#mh_age").hide().html("<span class='glyphicon glyphicon-calendar cus-glyphicon'></span>"+frmt_age+ "Yrs");
  }else if(userinfo.age) {
    $("#mh_date_of_birth_new").hide();
    $("#mh_age").show().html("<span class='glyphicon glyphicon-calendar cus-glyphicon' title='Age'></span>"+userinfo.age+ "Yrs");
  }else {
    $("#mh_date_of_birth_new").hide();
    $("#mh_age").show().html("<span class='glyphicon glyphicon-calendar cus-glyphicon' title='Age'></span>NA");
  }
  $("#mh_gender_new").html("<img src='images/gender.png' class='pointer' title='Gender'> </img> "+(userinfo.gender ? userinfo.gender : "NA"));
  $("#mh_phone_no").html("<span class='glyphicon glyphicon-phone cus-glyphicon' title='Phone No.'></span>"+userinfo.phone);
  if(userinfo.patient_dhp_id){
    $("#mh_patient_dhp_id").html("<span class='theme-color pointer' title='DHP ID'>DHP ID:: </span>"+userinfo.patient_dhp_id);
  }else{
    $("#mh_patient_dhp_id").text("No DHP Code");
  }
  var bmi = (userinfo_medical.height ? calculatePatientBMI(userinfo_medical.height,userinfo_medical.weight) : $("#mh_BMI").text("NA"));
  if(Number(bmi)){
    $("#mh_BMI").text(bmi);
  }else{
    $("#mh_BMI").text("NA");
  }
}

function getPersonalDetailsMedicalHistory() {
  setPatientBriefSummary();
  $("#showMsgNotChartSection").hide();
  //ToDo Generate new function for Billing info fill
  $("#bill_patient_name").html(userinfo.first_nm+" "+userinfo.last_nm);
  if(userinfo.age){
    $("#bill_patient_dob_lbl").html("Age");
    $("#bill_patient_dob").html((userinfo.age != "") ? userinfo.age : "NA");
  }else{
    $("#bill_patient_dob_lbl").html("Date Of Birth");
    $("#bill_patient_dob").html((userinfo.date_of_birth) ? userinfo.date_of_birth : "NA");
  }
  if(userinfo.address1 && userinfo.address1 != "") $("#bill_patient_addr").html(userinfo.address1+", "+userinfo.address2)
  else $("#bill_patient_addr").html("NA")
  $("#bill_patient_phone").html(userinfo.phone);
  $("#bill_patient_email").html(userinfo.user_email);

  if (userinfo.patient_dhp_id)
    $("#patient_bill_dhp").html(userinfo.patient_dhp_id);

  var mh_allergies = getPatientAllergies();
  
  //ToDo ::Combine with medication function
  if (mh_allergies.length > 0) $("#mh_allergies_new").html(mh_allergies.join(''))
  else $("#mh_allergies_new").html("<li style='color:#ae6077;border:none;'>No Allergies Found.</li>");

  var mh_conditions = [];
  if (userinfo_medical.Condition) {
    if (typeof(userinfo_medical.Condition) == "string") {
      mh_conditions.push("<li>"+userinfo_medical.Condition+"</li>");
    }
    else {
      for (var i = 0; i < userinfo_medical.Condition.length; i++) {
        mh_conditions.push("<li>"+userinfo_medical.Condition[i]+"</li>");
      }
    }
  }
  if(mh_conditions.length >0){
    $("#mh_conditions_new").html(mh_conditions.join(''));
  }
  else{
    $("#mh_conditions_new").html("<li style='color:#ae6077;border:none;'>No Diagnoses Found.</li>");
  }
  var mh_procedure = [];
  if (userinfo_medical.Procedure) {
    if(typeof(userinfo_medical.Procedure) == "string") {
      if(userinfo_medical.Procedure){
        mh_procedure.push("<li>"+userinfo_medical.Procedure+"</li>");  
      }
    }
    else {
      for (var i = 0; i < userinfo_medical.Procedure.length; i++) {
        if(userinfo_medical.Procedure){
          mh_procedure.push("<li>"+userinfo_medical.Procedure[i]+"</li>");  
        }
      }
    }
  }
  if(mh_procedure.length >0){
    $("#mh_procedure_new").html(mh_procedure.join(''));  
  }
  else{
    $("#mh_procedure_new").html("<li style='color:#ae6077;border:none;'>No Procedure Found.</li>");
  }

  $.couch.db(db).view("tamsa/testFamilyMedicalHistory", {
    success: function(data) {
      if(data.rows.length > 0){
        var mh_family_new = [];
        for (var i = 0; i < data.rows[0].doc.relations.length; i++) {
          mh_family_new.push('<li class="mh_medication_new"><label>Relation: </label>'+data.rows[0].doc.relations[i].relation+'</li>');
          if (data.rows[0].doc.relations[i].age) mh_family_new.push('<li class="mh_medication_new"><label>Age: </label>'+data.rows[0].doc.relations[i].age+'</li>');

          if (data.rows[0].doc.relations[i].alive) mh_family_new.push('<li class="mh_medication_new"><label>Alive: </label>'+data.rows[0].doc.relations[i].alive+'</li>');

          if (data.rows[0].doc.relations[i].dod) mh_family_new.push('<li class="mh_medication_new"><label>DOD: </label>'+data.rows[0].doc.relations[i].dod+'</li>');

          if (data.rows[0].doc.relations[i].cause_of_death) mh_family_new.push('<li class="mh_medication_new"><label>Cause Of Death: </label>'+data.rows[0].doc.relations[i].cause_of_death+'</li>');

          if (data.rows[0].doc.relations[i].condition) mh_family_new.push('<li class="mh_medication_new"><label>Conditions :</label>'+data.rows[0].doc.relations[i].condition+'</li>');

          if (data.rows[0].doc.relations[i].lifestyle_issues) mh_family_new.push('<li class="mh_medication_new"><label>Lifestyle Issues :</label>'+data.rows[0].doc.relations[i].lifestyle_issues+'</li>');
          
          if(mh_family_new.length > 0) $("#mh_family_new").html(mh_family_new.join(''));
          else $("#mh_family_new").html("<li style='color:#ae6077;border:none;'>No Family History Found.</li>");  
        }
      }else{
        $("#mh_family_new").html("<li style='color:#ae6077;border:none;'>No Family History Found.</li>");  
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

  getVaccineDetails("mh_vaccine");
  // getAnalyticsRange();
  getLabAndDiagnostics();
  

  $.couch.db(db).view("tamsa/getTimeLineRecords", {
    success: function(data) {
      if(data.rows.length > 0){
        var recentvisitHTML = [];
        recentvisitHTML.push("<span style='float:right;'>Visit type : "+data.rows[data.rows.length-1].value.visit_type+"</span>");
        recentvisitHTML.push("<div style='float: left;'><span>Subjective : </span><ul style='float:right;list-style:none;padding-left:7px;'><li>"+data.rows[data.rows.length-1].value.subjective+"</li>");
        // for(var i=0;i<data.rows[data.rows.length-1].value.subjective.length;i++){
        //   recentvisitHTML.push("<li>"+data.rows[data.rows.length-1].value.subjective[i]+"</li>");
        // }
        recentvisitHTML.push("</ul></div>");
        $("#most_recent_complaint").html(recentvisitHTML.join(''));
      }else{
        $("#most_recent_complaint").html("<div style='float: left'>No records Found.</div>");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [0,userinfo.user_id,"PhysicianNotes"],
    endkey: [0,userinfo.user_id,"PhysicianNotes",{}],
  });
  // chooseCarePlanList("all_practise_care_plans");
  // chooseCommunityCarePlanList("all_community_care_plans");
  // prescribedPatientCarePlanList();
  // prescribedPatientPastCarePlanList();
  getNewCommunicationHistoryDetails();
}

function getLabAndDiagnostics(){
  $.couch.db(db).view("tamsa/mGetUserMedHis", {
    success: function(data) {
      var ldl_reading = [];
      var hdl_reading = [];
      var tc_reading  = [];
      var tgl_reading = [];
      var insertDate  = [];

      for (var i = 0; i < data.rows.length; i++) {
        
        hdl_reading.push(Number(data.rows[i].value.hdl_reading));
        ldl_reading.push(Number(data.rows[i].value.ldl_reading));
        tc_reading.push(Number(data.rows[i].value.tc_reading));
        tgl_reading.push(Number(data.rows[i].value.tgl_reading));

        insertDate.push(moment(data.rows[i].value.insert_ts).format("YYYY-MM-DD"));
      }
      if(hdl_reading == '' || ldl_reading == '' || tc_reading == '' ||  tgl_reading == ''){
        $("#showMsgNotChartSection").show();
      }else{
        $("#showMsgNotChartSection").hide();
        labCharts(hdl_reading, ldl_reading, tc_reading, tgl_reading, insertDate);
      } 
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id, {}],
    endkey: [userinfo.user_id],
    descending:true,
    limit: 12
  });
}

function getVaccineDetails(id){
  if((userinfo.age || userinfo.date_of_birth) && userinfo.gender && userinfo.user_id) {
    var age;
    if(userinfo.age) {
      age = userinfo.age;
    }else if(userinfo.date_of_birth){
      if((userinfo.date_of_birth).match(/[a-z]/i)) {
        age = getAge(userinfo.date_of_birth);
      }else{
        age = getAgeFromDOB(userinfo.date_of_birth);
      }
    }
    $.couch.db(db).list("tamsa/getHealthMaintenanceNotificationsList", "getHealthMaintenanceAlertsForChartingTemplates", {
    user_age:age,
    user_gender:userinfo.gender,
    user_id:userinfo.user_id
    }).success(function(data){
      if(data.rows.length > 0){
        var  mh_vaccine = [];
        mh_vaccine.push('<ul class="mh_vaccine mh-vaccine">');
        for(var i=0;i<data.rows.length;i++){
          if(data.rows[i].past_screenings.length > 0) {
            if(data.rows[i].past_screenings[0].alert_status == "Not Taken") {
              mh_vaccine.push('<li class="mh_medication_new"><label>Alert  :  </label>'+data.rows[i].alert_name+'</li>');
              mh_vaccine.push('<li class="mh_medication_new"><label>Status : </label>Not Taken</li>');
              mh_vaccine.push('<li class="mh_medication_new"><label>Last Date Taken : '+data.rows[i].past_screenings[0].alert_date+'</label></li>');
            }else if(data.rows[i].past_screenings[0].alert_status == "Taken"){
              var last_screen_date = moment(data.rows[i].past_screenings[0].alert_date);
              var current_diff     = moment().diff(last_screen_date,data.rows[i].interval_type);
              if(current_diff > data.rows[i].interval) {
                mh_vaccine.push('<li class="mh_medication_new"><label>Alert : </label>'+data.rows[i].alert_name+'</li>');
                mh_vaccine.push('<li class="mh_medication_new"><label>Status : </label>OverDue</li>');
                mh_vaccine.push('<li class="mh_medication_new"><label>Last Date Taken : '+data.rows[i].past_screenings[0].alert_date+'</label></li>');
              }else {
              var next_date = last_screen_date.add(data.rows[i].interval,data.rows[i].interval_type).format("YYYY-MM-DD");
                mh_vaccine.push('<li class="mh_medication_new success-color"><label>UpComing : </label>'+data.rows[i].alert_name+'</li>');
                mh_vaccine.push('<li class="mh_medication_new success-color"><label>Last Date Taken : '+data.rows[i].past_screenings[0].alert_date+'</label></li>');
                mh_vaccine.push('<li class="mh_medication_new success-color"><label>Next Due Date : '+next_date+'</label></li>');
              }
            }
          }else {
            mh_vaccine.push('<li class="mh_medication_new"><label>Alert  :  </label>'+data.rows[i].alert_name+'</li>');
            mh_vaccine.push('<li class="mh_medication_new"><label>Status : </label>Not Taken</li>');
            mh_vaccine.push('<li class="mh_medication_new"><label>Last Date Taken : </label>NA</li>');
          }
        }
        mh_vaccine.push('</ul>');
        $("#"+id).html(mh_vaccine.join(''));

      //   for(var i=0;i<data.rows.length;i++){
      //     if(data.rows[i].past_screenings.length > 0){
      //       if(data.rows[i].past_screenings[0].alert_status.trim() == "Taken") {
      //           checkPastScreeningAlerts(data.rows[i],age,reminder);
      //       }else {
      //         screeningAlertMessage(data.rows[i].alert_name,reminder);
      //       }
      //     }else{
      //       screeningAlertMessage(data.rows[i].alert_name,reminder);
      //     }
      //   }
      }else{
        $("#"+id).html("<li style='color:#ae6077;border:none;'>No Vaccine Details Found.</li>");
      }
    }).error(function(reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    });
  }else {
    newAlert("danger","Not Enough Patient Information Found. Please update Patient Personal Information.");
    $("html, body").animate({scrollTop: 0}, 'slow');
  }

  // $.couch.db(db).view("tamsa/getVaccineDetails", {
  //   success: function(data) {
  //     var mh_vaccine = [];
  //     if (data.rows.length > 0) {
  //       var vaccine = data.rows[data.rows.length - 1].value;
  //       mh_vaccine.push('<li class="mh_medication_new"><label>Due/Alert  :  </label>'+vaccine.Vaccine_Name+'</li>');
  //       mh_vaccine.push('<li class="mh_medication_new"><label>Last Date Taken  :  </label>'+vaccine.Vaccine_Date+'</li>');
  //       mh_vaccine.push('<li class="mh_medication_new"><label>Result  :  </label>'+vaccine.Vaccine_Status+'</li>');
  //       mh_vaccine.push('<li class="mh_medication_new"><label>Next due date  :  </label>'+vaccine.Due_Date+'</li>');
  //     }
  //     if(mh_vaccine.length > 0){
  //       $("#"+id).html(mh_vaccine.join(''));
  //     }else{
  //       $("#"+id).html("<li style='color:#ae6077;border:none;'>No Vaccine Details Found.</li>");
  //     }
  //   },
  //   error: function(status) {
  //     console.log(status);
  //   },
  //   key: userinfo.user_id
  // });
}

function paginationConfiguration(data,pagination_div_id,rows_per_page,displayWithPagination,id){
  $("#"+pagination_div_id).unbind('page');
  var total_rows = parseInt(data.rows.length / rows_per_page);
  if(data.rows.length % rows_per_page > 0) total_rows += 1;
  $("#"+pagination_div_id).bootpag({
    total: total_rows,
    maxVisible: rows_per_page
  }).on("page", function(event, /* page number here */ num){
    event.stopPropagation();
    var endval = rows_per_page*num;
    if(endval >= data.rows.length) endval = data.rows.length;
    if(id){
      displayWithPagination(rows_per_page*(num -1),endval,data,id);
    }else{
      displayWithPagination(rows_per_page*(num -1),endval,data);
    }
  });
  $("#"+pagination_div_id).find("[data-lp='1']").removeClass("active").find("a").trigger("click");
}

function displayCommunicationHistory(start,end,data){
  var patient_communication_data = [];
  for(var i=start;i<end;i++){
    patient_communication_data.push("<tr>");
    patient_communication_data.push("<td>"+moment(data.rows[i].value).utc().format("YYYY-MM-DD")+"</td>");
    patient_communication_data.push("<td>"+getCommunicationHistoryType(data.rows[i].doc.operation_case)+"</td>");
    patient_communication_data.push("<td>"+getCommunicationType(data.rows[i].doc.operation_case)+"</td>");
    patient_communication_data.push("<td class='get-communication-more-details' docid='"+data.rows[i].doc._id+"'>"+getCommunicationHistoryDetails(data.rows[i].doc)+"</td>");
    patient_communication_data.push("</tr>");
  }
  $("#patient_communication_history tbody").html(patient_communication_data.join(''));
}

function getCommunicationHistoryType(opcase){
  if(opcase == "18") return "Appointment Request"
  else if(opcase == "23") return "E-Lab"
  else if(opcase == "17") return "Billing"  
  else return "E-Rx"
}

function getCommunicationType(opcase){
  if(opcase == "18") return "Both"
  else return "Email"
}

function getCommunicationHistoryDetails(history_data){
  switch(parseInt(history_data.operation_case)){
    case 18:
      return getCommunicationHistoryDetailsForAppointment(history_data);
    break;
    case 23:
      return getCommunicationHistoryDetailsForELab(history_data);
    break;
    case 9:
      return getCommunicationHistoryDetailsForERx(history_data);
    break;
    case 17:
      return getCommunicationHistoryDetailsForBilling(history_data);
    break;
  }
}

function getCommunicationHistoryDetailsForAppointment(history_data){
  return (history_data.reminder_note ? history_data.reminder_note : "NA");
}

function getCommunicationHistoryDetailsForELab(history_data){
  return (history_data.comment ? history_data.comment : "NA");
}

function getCommunicationHistoryDetailsForERx(history_data){
  return (history_data.medication_instructions ? history_data.medication_instructions: "NA");
}

function getCommunicationHistoryDetailsForBilling(history_data){
  return history_data.total_bill_topay;
}

function removeCommunicationHistoryMoreDetails($obj){
  $obj.parent().parent().parent().parent().parent().parent().remove();
}

function getCommunicationHistoryMoreDetails($obj){
  $.couch.db(db).openDoc($obj.attr("docid"),{
    success:function(data){
      if(data.operation_case == "18"){
        $.couch.db(db).openDoc(data.appointment_id,{
          success:function(data){
            var temp = [];
            temp.push('<tr class="comm-history-more-details-parent"><td class="comm-history-more-details" colspan="4"><table class="table tbl-border"><thead><tr><th>Appointment date</th><th>Start Time</th><th>End Time</th><th>Appointment Note <br><span class="glyphicon glyphicon-remove-circle remove-comm-history-more-details" style="float:right"></span></th></tr></thead><tbody><tr>');
            temp.push('<td>'+moment(data.reminder_start).format("YYYY-MM-DD")+'</td>');
            temp.push('<td>'+moment(data.reminder_start).format("hh:mm")+'</td>');
            temp.push('<td>'+moment(data.reminder_end).format("hh:mm")+'</td>');
            temp.push('<td>'+data.reminder_note+'</td>');
            temp.push('</tr></tbody></table></td></tr>');
            if($obj.parent().next().hasClass("comm-history-more-details-parent")){
              $obj.parent().next().remove();
            }
            $obj.parent().after(temp.join(''));
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('body,html').animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }else if(data.operation_case == "23"){
        $.couch.db(db).openDoc(data.doc_id,{
          success:function(doc_data){
            var temp = [];
            temp.push('<tr class="comm-history-more-details-parent"><td class="comm-history-more-details" colspan="4"><table class="table tbl-border"><thead><tr><th>Document Name</th><th>Doctors comment</th><th><span class="glyphicon glyphicon-remove-circle remove-comm-history-more-details" style="float:right"></span></th></tr></thead><tbody><tr>');

            temp.push('<td>'+doc_data.document_name+'</td>');
            temp.push('<td>'+data.comment+'</td>');
            temp.push('<td><a target="_blank" href="'+$.couch.urlPrefix +'/'+db+'/'+doc_data._id+'/'+Object.keys(doc_data._attachments)[0]+'"><span class="label label-warning">View</span></a></td>');
            temp.push('</tr></tbody></table></td></tr>');
            if($obj.parent().next().hasClass("comm-history-more-details-parent")){
              $obj.parent().next().remove();
            }
            $obj.parent().after(temp.join(''));
          },
          error:function(data,erro,reason){
            newAlert("danger",reason);
            $('body,html').animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }else if(data.operation_case == "17"){
        $.couch.db(db).openDoc(data.bill_id,{
          success:function(data){
            var temp = [];
            temp.push('<tr class="comm-history-more-details-parent"><td class="comm-history-more-details" colspan="4"><table class="table tbl-border"><thead><tr><th>Invoice no</th><th>Billing Date</th><th>Diagnosis/Service/Procedures <span class="glyphicon glyphicon-remove-circle remove-comm-history-more-details" style="float:right"></span></th></tr></thead><tbody><tr>');
            temp.push('<td>'+data.invoice_no+'</td>');
            temp.push('<td>'+data.insert_ts.substring(0,10)+'</td>');
            temp.push('<td><table class="table tbl-border"><thead><th>Code</th><th>Charges</th></thead><tbody>');
            for(var i=0;i<data.bill_history[0].diagnosis_procedures_details.length;i++){
              temp.push('<tr><td>'+data.bill_history[0].diagnosis_procedures_details[i].diagnosis_code+'</td><td>'+data.bill_history[0].diagnosis_procedures_details[i].charges+'</td></tr>');
            }
            temp.push('</tbody></table></td>');
            temp.push('</tr></tbody></table></td></tr>');
            if($obj.parent().next().hasClass("comm-history-more-details-parent")){
              $obj.parent().next().remove();
            }
            $obj.parent().after(temp.join(''));
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('body,html').animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }else{
        var temp = [];
        temp.push('<tr class="comm-history-more-details-parent"><td class="comm-history-more-details" colspan="4"><table class="table tbl-border"><thead><tr><th>Drug Name</th><th>Drug Start Time</th><th>Drug End Time</th><th>Instruction<br><span class="glyphicon glyphicon-remove-circle remove-comm-history-more-details" style="float:right"></span></th></tr></thead><tbody><tr>');
        temp.push('<td>'+data.drug+'</td>');
        temp.push('<td>'+data.drug_start_date+'</td>');
        temp.push('<td>'+data.drug_end_date+'</td>');
        temp.push('<td>'+(data.medication_instructions ? data.medication_instructions : "NA")+'</td>');
        temp.push('</tr></tbody></table></td></tr>');
        if($obj.parent().next().hasClass("comm-history-more-details-parent")){
          $obj.parent().next().remove();
        }
        $obj.parent().after(temp.join(''));
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function labResultLink(action){
  $("#elabs_tab").trigger("click");
  //var action = $("#lab_results_link").data("attachment_id");
  $("#lab_results_link").data("attachment_id","")
  $("#lab_results_inner_link").parent().find("div").removeClass("CategTextActive");
  $(".tab-pane").removeClass("active");
  $("#lab_results_inner_link").addClass("CategTextActive");
  $("#lab_results_inner").addClass("active");
  $("#lab_results_inner_link").trigger("click");
  $("#lab_result_image, #lab_result_pdf, #labdetails, #lab_result_medical_details").hide();
  $("#doctor_comment").val("");
  if(action != "undefined"){
    $.couch.db(db).openDoc(action,{
      success:function(data){
        $("#lab_results_inner").removeClass('active');
        $("#lab_results_inner_category").addClass('active');
        if(data.document_category){
          getLabResults(action,data.document_category);
        }else{
          getLabResults(action,"Other Exams");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
      }
    });
  }
}

function getLabResults(action,type) {
  $.couch.db(db).view("tamsa/getRecentLabResults", {
    success: function(data) {
      // var recent_lab_results      = '<h3 class="list-group-item active">Most Recent Tests</h3>';
      var recent_lab_results      = '';
      var all_lab_results_options = '<option value = "noselect">Select Lab Result</option>';
      $("#lab_result_image, #lab_result_pdf").hide();
      $("#lab_result_pdf").children().remove();
      $("#no_image").show();
      $("#lab_result_medical_details, #labdetails, #lab_result_comment").hide();
      if(data.rows.length > 0){
        if(data.rows.length > 3) var len = 3;
        else var len = data.rows.length;
        for (var i = 0; i < len; i++) {
          if(data.rows[i].doc.doctype == "Anual_Exam"){
            if(data.Format == "PDF" || data.rows[i].doc._attachments[Object.keys(data.rows[i].doc._attachments)[0]].content_type == "application/pdf"){
              recent_lab_results += '<a class="list-group-item lab_results_recent" doc_id="'+data.rows[i].id+'"><span class="glyphicon glyphicon-file"  style="font-size:15px;" title="pdf"> '+data.rows[i].doc.Exam_Name+'</a>';
            }else{
              recent_lab_results += '<a class="list-group-item lab_results_recent" doc_id="'+data.rows[i].id+'"><span class="glyphicon glyphicon-picture" style="font-size:15px;" title="image"> '+data.rows[i].doc.Exam_Name+'</a>';
            }
          }else{
             if(data.Format == "PDF" || data.rows[i].doc._attachments[Object.keys(data.rows[i].doc._attachments)[0]].content_type == "application/pdf"){
              recent_lab_results += '<a class="list-group-item lab_results_recent" doc_id="'+data.rows[i].id+'"><span class="glyphicon glyphicon-file"  style="font-size:15px;" title="pdf"> '+data.rows[i].doc.document_name+'</a>';  
             }else{
              if(data.rows[i].doc.usermedhis_docid && data.rows[i].doc.selfcare_docid && data.rows[i].doc.patientnotes_docid){
                   recent_lab_results += '<a class="list-group-item lab_results_recent" doc_id="'+data.rows[i].id+'"><span class="glyphicon glyphicon-list-alt" style="font-size:15px;" title="Native"> '+data.rows[i].doc.document_name+'</a>'; 
              }else{
                recent_lab_results += '<a class="list-group-item lab_results_recent" doc_id="'+data.rows[i].id+'"><span class="glyphicon glyphicon-picture" style="font-size:15px;" title="image"> '+data.rows[i].doc.document_name+'</a>';     
              }
            }
          }
        }
        for (var i = 0; i < data.rows.length; i++) {
          if(data.rows[i].doc.doctype == "Anual_Exam"){
            all_lab_results_options += "<option value="+data.rows[i].id+">"+data.rows[i].doc.Exam_Name+"</option>"; 
          }else{
              all_lab_results_options += "<option value="+data.rows[i].id+">"+data.rows[i].doc.document_name+"</option>";
          }
        }
      }else{
        recent_lab_results += '<a class="list-group-item">No tests found</a>';
      }
      $("#recent_lab_results").html(recent_lab_results);
      $("#all_lab_results_options").html(all_lab_results_options);
      if(action){
        updateLabResultWithSelectedResult(action);        
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id,type,{}],
    endkey: [userinfo.user_id,type],
    descending:true,
    include_docs:true
  });
}

function openCategorySection($obj){
  $("#lab_results_inner").removeClass('active');
  $("#lab_results_inner_category").addClass('active');
  $(".lab-result-hide").show();
  $("#otherVideoShow").hide();
  if($obj.find('h4').text() == "Blood"){
    $('#labmain_img').html('<img src="images/donate_blood-128.png" height="35px">');
    $('#labmain_title').html("Blood");
    getLabResults("","Blood");
  }else if($obj.find('h4').text() == "Cardiology"){
    $('#labmain_img').html('<img src="images/cardiology.png" height="35px">');
    $('#labmain_title').html("Cardiology");
    getLabResults("","Cardiology");
  }else if($obj.find('h4').text() == "Kidneys & Electrolytes"){
    $('#labmain_img').html('<img src="images/kidney-128.png" height="35px">');
    $('#labmain_title').html("Kidneys & Electrolytes");
    getLabResults("","Kidneys & Electrolytes");
  }else if($obj.find('h4').text() == "Nutrients"){
    $('#labmain_img').html('<img src="images/31-128.png" height="35px">');
    $('#labmain_title').html("Nutrients");
    getLabResults("","Nutrients");
  }else if($obj.find('h4').text() == "Liver"){
    $('#labmain_img').html('<img src="images/85-128.png" height="35px">');
    $('#labmain_title').html("Liver");
    getLabResults("","Liver");
  }else if($obj.find('h4').text() == "Sugars & Digestion"){
    $('#labmain_img').html('<img src="images/body-42-128.png" height="35px">');
    $('#labmain_title').html("Sugars & Digestion");
    getLabResults("","Sugars & Digestion");
  }else if($obj.find('h4').text() == "Hormones"){
    $('#labmain_img').html('<img src="images/1109-brain-128.png" height="35px">');
    $('#labmain_title').html("Hormones");
    getLabResults("","Hormones");
  }else if($obj.find('h4').text() == "Thyroid"){
    $('#labmain_img').html('<img src="images/Disease_bladder-128.png" height="35px">');
    $('#labmain_title').html("Thyroid");
    getLabResults("","Thyroid");
  }else if($obj.find('h4').text() == "Inflammation & Autoimmunity"){
    $('#labmain_img').html('<img src="images/31-128.png" height="35px">');
    $('#labmain_title').html("Inflammation & Autoimmunity");
    getLabResults("","Inflammation & Autoimmunity");
  }else if($obj.find('h4').text() == "Clotting"){
    $('#labmain_img').html('<img src="images/31-128.png" height="35px">');
    $('#labmain_title').html("Clotting");
    getLabResults("","Clotting");
  }else if($obj.find('h4').text() == "Specialized Tests"){
    $('#labmain_img').html('<img src="images/673292-lab_chemistry_test-tube-128.png" height="35px">');
    $('#labmain_title').html("Specialized Tests");
    getLabResults("","Specialized Tests");
  }else if($obj.find('h4').text() == "Infection"){
    $('#labmain_img').html('<img src="images/Virology-128.png" height="35px">');
    $('#labmain_title').html("Infection");
    getLabResults("","Infection");
  }else if($obj.find('h4').text() == "Urine"){
    $('#labmain_img').html('<img src="images/53-128.png" height="35px">');
    $('#labmain_title').html("Urine");
    getLabResults("","Urine");
  }else if($obj.find('h4').text() == "Other Exams"){
    $('#labmain_img').html('<img src="images/folder-128.png" height="35px">');
    $('#labmain_title').html("Other Exams");
    getLabResults("","Other Exams");
  }
  else if($obj.find('h4').text() == "Other / Video"){
    $('#labmain_img').html('<img src="images/folder-128.png" height="35px">');
    $('#labmain_title').html("Other / Video");
    $(".lab-result-hide").hide();
    $("#otherVideoShow").show();
    getOtherVideoDocuments();
  }
}

function getOtherVideoDocuments(){
  $.couch.db(db).view("tamsa/getOtherVideoDocuments", {
    success: function(data) {
      if(data.rows.length > 0){
        paginationConfiguration(data,"other_videos_pagination",10,displayOtherVideos);
      }else{
        var other_docs_table = [];    
        other_docs_table.push('<tr><td colspan="4">No Videos are Found.</td></tr>');
        $("#other_docs_table tbody").html(other_docs_table.join(''));
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: userinfo.user_id,
    include_docs: true
  });
}

function displayOtherVideos(start,end,data){
  var other_docs_table = [];
  for (var i = start; i < end; i++) {
    if (data.rows[i].doc._attachments) {
      other_docs_table.push("<tr><td>"+data.rows[i].doc.document_type+"</td><td>"+data.rows[i].doc.document_name+"</td><td>"+data.rows[i].doc.doctor_name+"</td><td><a href='"+$.couch.urlPrefix +'/'+db+'/'+data.rows[i].id+"/"+Object.keys(data.rows[i].doc._attachments)[0]+"' target='blank'><span class='label label-warning'>Download</span></a></td></tr>");
    }
  }
  $("#other_docs_table tbody").html(other_docs_table.join(''));
}

function getAlerts() {
  $.couch.db(db).view("tamsa/patientConditions", {
    success: function(data) {
      var low_alerts_records    = '';
      var medium_alerts_records = '';
      var high_alerts_records   = '';
      $("#low_alerts_records tbody").html('');
      $("#medium_alerts_records tbody").html('');
      $("#high_alerts_records tbody").html('');
      for (var i = 0; i < data.rows.length; i++) {
        if (data.rows[i].value.CONDITION_SEVERITY == 'High') {
          high_alerts_records += '<tr><td>'+data.rows[i].value.CONDITION+'</td><td>'+data.rows[i].value.CONDITION_DATE+'</td><td>'+data.rows[i].value.CONDITION_STATUS+'</td></tr>';
        }
        else if (data.rows[i].value.CONDITION_SEVERITY == 'Medium') {
          medium_alerts_records += '<tr><td>'+data.rows[i].value.CONDITION+'</td><td>'+data.rows[i].value.CONDITION_DATE+'</td><td>'+data.rows[i].value.CONDITION_STATUS+'</td></tr>';
        }
        else if (data.rows[i].value.CONDITION_SEVERITY == 'Low') {
          low_alerts_records += '<tr><td>'+data.rows[i].value.CONDITION+'</td><td>'+data.rows[i].value.CONDITION_DATE+'</td><td>'+data.rows[i].value.CONDITION_STATUS+'</td></tr>';
        }
      }
      $("#low_alerts_records tbody").html(''+low_alerts_records+'');
      $("#medium_alerts_records tbody").html(''+medium_alerts_records+'');
      $("#high_alerts_records tbody").html(high_alerts_records);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id],
    endkey: [userinfo.user_id, {}, {}]
  });
}

function getThresholdAlerts() {
  $.couch.db(db).view("tamsa/getThresholdAlerts", {
    success: function(data) {
      thresholdAlerts = {};
      $('.heart').val('');
      $('.report_checkbox, .alert_checkbox').removeAttr("checked");
      $(".report_freq").removeAttr("checked");

      if(data.rows[0]) {
        thresholdAlerts = data.rows[0].value;
        for (var i = 0; i < data.rows[0].value.ThresholdAlerts.length; i++) {
          var th = [];
          th = data.rows[0].value.ThresholdAlerts[i].split(":");
          if (th[0] == 'HeartRate') {
            $("#heartrate_low").val(th[1]);
            $("#heartrate_high").val(th[2]);
          }
          else if (th[0] == 'Weight') {
            $("#weight_low").val(th[1]);
            $("#weight_high").val(th[2]); 
          }
          else if (th[0] == 'Glucose') {
            $("#glucose_low").val(th[1]);
            $("#glucose_high").val(th[2]);
          }
          else if (th[0] == 'BP') {
            $("#bp_low").val(th[1]);
            $("#bp_high").val(th[2]);
          }
          else if (th[0] == 'Oxygen') {
            $("#oxygen_low").val(th[1]);
            $("#oxygen_high").val(th[2]);
          }
          else if (th[0] == 'RespirationRate') {
            $("#respiration_rate_low").val(th[1]);
            $("#respiration_rate_high").val(th[2]);
          }
        };

        if (data.rows[0].value.AlertFields) {
          for (var i = 0; i < data.rows[0].value.AlertFields.length; i++) {
            $("#alert_"+data.rows[0].value.AlertFields[i]).prop('checked', true);
          };
        }

        if (data.rows[0].value.ReportFields) {
          for (var i = 0; i < data.rows[0].value.ReportFields.length; i++) {
            $("#report_"+data.rows[0].value.ReportFields[i]).prop('checked', true);
          };
        }

        $("#"+data.rows[0].value.ReportFrequency).prop('checked', true);
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: [pd_data._id, userinfo.user_id, 'Heart Failure']
  });
}

function getGenericThresholdAlerts() {
  $.couch.db(db).view("tamsa/getThresholdAlerts", {
    success: function(data) {
      thresholdGenericAlerts = {};
      $('.generic').val('');
      $('.generic_report_checkbox, .generic_alert_checkbox').removeAttr("checked");
      $(".generic_report_freq").removeAttr("checked");

      if(data.rows[0]) {
        thresholdGenericAlerts = data.rows[0].value;
        for (var i = 0; i < data.rows[0].value.ThresholdAlerts.length; i++) {
          var th = [];
          th = data.rows[0].value.ThresholdAlerts[i].split(":");
          if (th[0] == 'HeartRate') {
            $("#generic_heartrate_low").val(th[1]);
            $("#generic_heartrate_high").val(th[2]);
          }
          else if (th[0] == 'Weight') {
            $("#generic_weight_low").val(th[1]);
            $("#generic_weight_high").val(th[2]); 
          }
          else if (th[0] == 'Glucose') {
            $("#generic_glucose_low").val(th[1]);
            $("#generic_glucose_high").val(th[2]);
          }
          else if (th[0] == 'BP') {
            $("#generic_bp_low").val(th[1]);
            $("#generic_bp_high").val(th[2]);
          }
          else if (th[0] == 'Oxygen') {
            $("#generic_oxygen_low").val(th[1]);
            $("#generic_oxygen_high").val(th[2]);
          }
          else if (th[0] == 'RespirationRate') {
            $("#generic_respiration_rate_low").val(th[1]);
            $("#generic_respiration_rate_high").val(th[2]);
          }
        };

        if (data.rows[0].value.AlertFields) {
          for (var i = 0; i < data.rows[0].value.AlertFields.length; i++) {
            $("#generic_alert_"+data.rows[0].value.AlertFields[i]).prop('checked', true);
          };
        }

        if (data.rows[0].value.ReportFields) {
          for (var i = 0; i < data.rows[0].value.ReportFields.length; i++) {
            $("#generic_report_"+data.rows[0].value.ReportFields[i]).prop('checked', true);
          };
        }

        $("#generic_"+data.rows[0].value.ReportFrequency).prop('checked', true);
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: [pd_data._id, userinfo.user_id, 'Generic']
  });
}

function getUserpicAndInfo(data) {
  $(".userpic").attr("src", "images/userpic.png");
  for (var i = 0; i < data.rows.length; i++) {
//    $('#patient_selected').text(data.rows[i].value.first_nm+" "+data.rows[i].value.last_nm);
    userinfo = data.rows[i].value;
    if(data.rows[i].value.imgblob){
      $(".userpic").attr("src", data.rows[i].value.imgblob);
    }else if(data.rows[i].value._attachments){
      url = $.couch.urlPrefix+'/'+personal_details_db+'/'+data.rows[i].id+'/'+Object.keys(data.rows[i].value._attachments)[0];
      $(".userpic").attr("src",url);
    }else{

    }
  }
}

function getPatientProfileDetails(personal_info,medical_info) {
  $("#edit_profile_parent").show();
  $("#show_profile_name_not").hide();
  $("#patient_profile_pic").attr("src", "images/userpic.png");
  $("#search_patients_update_profile").val(personal_info.rows[0].value.first_nm +" "+personal_info.rows[0].value.last_nm);
  $("#search_patient_profile_by_patient_dhp").val(personal_info.rows[0].value.patient_dhp_id);
  $('#edit_patient_name').val(personal_info.rows[0].value.first_nm+" "+personal_info.rows[0].value.last_nm);
  $('#edit_patient_dhp_id').val(personal_info.rows[0].value.patient_dhp_id);
  $('#edit_patient_emailid').val(personal_info.rows[0].value.user_email);
  $('#edit_patient_phone').val(personal_info.rows[0].value.phone);
  $('#edit_patient_maritalstatus').val(personal_info.rows[0].value.MaritalStatus);
  $("#edit_patient_gender").val(personal_info.rows[0].value.gender);
  $('#edit_patient_height').val(medical_info.rows.length > 0 ? medical_info.rows[0].value.height: "");
  $('#edit_patient_weight').val(medical_info.rows.length > 0 ? medical_info.rows[0].value.weight: "");
  $('#edit_patient_waist').val(medical_info.rows.length > 0 ? medical_info.rows[0].value.waist: "");
  $("#edit_patient_bloodgroup").val(personal_info.rows[0].value.bloodgroup ? personal_info.rows[0].value.bloodgroup :personal_info.rows[0].value.blood_group).attr("selected","selected");
  if(personal_info.rows[0].value.age){
    $("#issu_age").show();
    $("#issu_date_of_birth").hide();
    $('#issu_age').val(personal_info.rows[0].value.age);
    $('#issu_date_of_birth').val(personal_info.rows[0].value.date_of_birth);
  }else{
    $('#issu_date_of_birth').val(personal_info.rows[0].value.date_of_birth);
    $("#issu_date_of_birth").show();
    $("#issu_age").hide();
    $('#issu_age').val(getAgeFromDOB(personal_info.rows[0].value.date_of_birth));
    $('#issu_date_of_birth').val(personal_info.rows[0].value.date_of_birth);
  } 
  $('#edit_patient_emergency_name').val(personal_info.rows[0].value.ename);
  $('#edit_patient_emergency_phone').val(personal_info.rows[0].value.ephone);
  $('#edit_patient_emergency_relation').val(personal_info.rows[0].value.erelation);
  $('#edit_patient_address1').val(personal_info.rows[0].value.address1);
  $('#edit_patient_address2').val(personal_info.rows[0].value.address2);
  $('#edit_patient_pincode').val(personal_info.rows[0].value.pincode);
  $('#edit_patient_country').val(personal_info.rows[0].value.country);
  getStates("edit_patient_state",personal_info.rows[0].value.state);
  getCities(personal_info.rows[0].value.state, "edit_patient_city",personal_info.rows[0].value.city);
  $("#update_patient_profile").data("index",personal_info.rows[0].value.user_id);
  $("#update_patient_profile").data("fname",personal_info.rows[0].value.first_nm);
  $("#update_patient_profile").data("prioremail",personal_info.rows[0].value.user_email);
  $("#update_patient_profile").data("priorphone",personal_info.rows[0].value.phone);
  if(personal_info.rows[0].value.imgblob){
    $("#patient_profile_pic").attr("src", personal_info.rows[0].value.imgblob);
  }else if(personal_info.rows[0].value._attachments){
    url = $.couch.urlPrefix +'/'+personal_details_db+'/'+personal_info.rows[0].id+'/'+Object.keys(personal_info.rows[0].value._attachments)[0];
    $("#patient_profile_pic").attr("src",url);
  } //if(!$("#edit_patient_name").val() == "" || !$("#edit_patient_dhp_id").val() == "" || !$("#edit_patient_emailid").val() == "" || !$("#edit_patient_phone").val() == "" || !$("#edit_patient_maritalstatus").val() == "" || !$("#edit_patient_gender").val() == "" || !$("#edit_patient_height").val() == "" || !$("#edit_patient_emergency_phone").val() == "" || !$("#edit_patient_emergency_relation").val() == "" || !$("#edit_patient_address1").val() == "" || !$("#edit_patient_weight").val() == "" || !$("#edit_patient_waist").val() == "" || !$("#edit_patient_bloodgroup").val() == "" || !$("#issu_age").val() == "" || !$("#edit_patient_emergency_name").val() == "" || !$("#edit_patient_address2").val() == "" || !$("#edit_patient_pincode").val() == "" || !$("#edit_patient_country").val() == "" || !$("#edit_patient_state").val() == "" || !$("#edit_patient_city").val() == "") {
  //   $("#infosybol").hide();
  // }
}

function clearPatientProfileDetails(){
  $("#search_patients_update_profile").val("");
  $("#edit_patient_name").val("");
  $("#edit_patient_dhp_id").val("");
  $("#edit_patient_emailid").val("");
  $("#edit_patient_phone").val("");
  $("#patient_profile_pic").attr("src","")
  $("#edit_profile_parent").hide();
  $("#update_patient_profile").data("index","");
  $("#update_patient_profile").data("fname","");
  $("#update_patient_profile").data("prioremail","");
  $("#update_patient_profile").data("priorphone","");
}

function updatePatientProfile(){
  if(patientUpdateValidation()){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(maindata){
        $.couch.db(db).view("tamsa/testPatientsInfo",{
          success:function(medical_info){
            if($("#edit_patient_emailid").val() == "emailnotprovided@digitalhealthpulse.com"){
              if($("#edit_patient_phone").val().trim() != $("#update_patient_profile").data("priorphone")){
                $.couch.db(personal_details_db).view("tamsa/getPatientPhoneNumber",{
                  success: function(data){
                    if(data.rows.length>0){
                      newAlert('danger', "Phone number already registered.");
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      return false;
                    }else{
                      //save updated userinfo
                      updatePatientdetials(maindata,medical_info);
                    }             
                  },
                  error: function(data,error,reason){
                    newAlert('danger', reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  },
                  key : [$("#edit_patient_phone").val().trim(),$("#update_patient_profile").data("fname")]
                });
              }else{
                //save updated userinfo
               updatePatientdetials(maindata,medical_info)
              }
            }else{
              if($("#edit_patient_emailid").val() != $("#update_patient_profile").data("prioremail")){
                $.couch.db(personal_details_db).view("tamsa/getPatientEmail",{
                  success:function(data){
                    if(data.rows.length>0){
                      newAlert('danger', "Email id is already registered.");
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      return false;
                    }else{
                      //save updated userinfo
                      updatePatientdetials(maindata,medical_info);
                    }
                  },
                  error:function(data,error,reason){
                    newAlert('danger', reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  },
                  key : $("#edit_patient_emailid").val()
                });
              }else{
                //save updated userinfo
                updatePatientdetials(maindata,medical_info);
              }
            }
          },
          error:function(data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            return false;
          },
          key:$("#update_patient_profile").data("index")
        });  
      },
      error:function(data,error,reason){
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:$("#update_patient_profile").data("index"),
    });
  }
}

function updatePatientdetials(maindata,medical_info){
  if(maindata.rows.length == 1 || medical_info.rows.length == 1){
    var dob = $('#issu_date_of_birth').val(),
    t_age = $("#issu_age").val();
    if($('#issu_date_of_birth').val() == "") {
      dob   = calculateDOBFromAge($("#issu_age").val()).format("YYYY-MM-DD");
      t_age = $("#issu_age").val();
    }
    var newdata           = maindata.rows[0].value;
    var medicaldata       = medical_info.rows[0].value;
    newdata.user_email    = $("#edit_patient_emailid").val();
    newdata.phone         = $("#edit_patient_phone").val();
    newdata.MaritalStatus = $("#edit_patient_maritalstatus").val();
    newdata.gender        = $("#edit_patient_gender").val();
    medicaldata.height    = $("#edit_patient_height").val();
    medicaldata.weight    = $("#edit_patient_weight").val();
    medicaldata.waist     = $("#edit_patient_waist").val();
    newdata.bloodgroup    = $("#edit_patient_bloodgroup").val();
    newdata.age           = t_age;
    newdata.date_of_birth = dob;
    newdata.ename         = $("#edit_patient_emergency_name").val();
    newdata.ephone        = $("#edit_patient_emergency_phone").val();
    newdata.erelation     = $("#edit_patient_emergency_relation").val();
    newdata.address1      = $("#edit_patient_address1").val();
    newdata.address2      = $("#edit_patient_address2").val();
    newdata.pincode       = $("#edit_patient_pincode").val();
    newdata.country       = $("#edit_patient_country").val();
    newdata.state         = $("#edit_patient_state").val();
    newdata.city          = $("#edit_patient_city").val();
    updatePatientInDatabase(newdata,medicaldata);  
  }else{
    newAlert('danger', "Multiple entries for given user.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }
}

function updatePatientInDatabase(newdata,medicaldata){
  $.couch.db(personal_details_db).saveDoc(newdata,{
    success:function(data){
      $.couch.db(db).saveDoc(medicaldata,{
        success:function(medical_data){
          $("#update_patient_profile").data("prioremail",$("#edit_patient_emailid").val());
          $("#update_patient_profile").data("priorphone",$("#edit_patient_phone").val());
          $("#update_patient_profile").data("fname",$("#edit_patient_fname").val());
          newAlert('success', "successfully updated");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
          //updateSubscribersFromUserInfo(newdata.user_id);
        },
        error:function(data,error,reason){
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    },
    error:function(data,error,reason){
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function updateSubscribersFromUserInfo(userid){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
    success:function(user_data) {
      if (user_data.rows.length > 0) {
        $.couch.db(db).view("tamsa/getSubscriberFromUserId",{
          success:function(data) {
            if (data.rows.length > 0) {
              changeSubscriberDoc(user_data.rows[0].value, data.rows[0].doc);
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey: [userid],
          endkey: [userid, {}, {}],
          reduce: false,
          include_docs: true
        });
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:userid
  });
}
//TODO remove Email and Phone as those are Doctors details
function changeSubscriberDoc(user_doc, doc) {
  doc.Email          = user_doc.user_email;
  doc.User_firstname = user_doc.first_nm;
  doc.User_lastname  = user_doc.last_nm;
  doc.Phone          = user_doc.phone;
  
  //console.log(doc);
  $.couch.db(db).saveDoc(doc, {
    success: function(data) {
      newAlert('success', "successfully updated");
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function getMedicationOnPatientDashboard(){
  $.couch.db(db).view("tamsa/getPatientMedications", {
    success: function(data) {
      var mh_medication = [];
      for (var i = 0; i < data.rows.length; i++) {
        if(data.rows[i].value.medications_added_from_addNewPatient == "Yes"){
          mh_medication.push('<li>'+data.rows[i].value.drug+'<a title="fields are blank" data-toggle="tab" style="float:right;scrollTop:0;" class="mrgright1 link" id="medication_tab_link" role="button" ui-sref="medical_history({user_id:patient_id,tab_id:"medication"})"><span class="glyphicon glyphicon-info-sign" role="button" class="dropdown-toggle" data-toggle="modal"></span></a></li>');
        }else{ 
          mh_medication.push("<li>"+data.rows[i].value.drug+"</li>");
        }    
      };
      if(mh_medication.length > 0){
       $("#mh_medication_new").html(mh_medication.join(''));   
      }else{
        $("#mh_medication_new").html("<li style='color:#ae6077;border:none;'>No Medications Found.</li>");
      }
     
    },
    error: function(data,error,reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    startkey: [userinfo.user_id,1,{}],
    endkey: [userinfo.user_id,1],
    descending:true
  });
}

function deleteSubUserSetIndex($obj){
  $("#delete_sub_user_confirm").attr("index",$obj.attr("index"));
  $("#delete_sub_user_confirm").attr("rev",$obj.attr("rev"));

}

function deleteSubUser() {
  var delete_index = $("#delete_sub_user_confirm").attr("index");
  var delete_rev   = $("#delete_sub_user_confirm").attr('rev');

  var doc = {
    delete_id:      delete_index,
    delete_rev:     delete_rev,
    operation_case: "15",
    doctype:        "cronRecords",
    processed:      "No"
  };
  
  $.couch.db(db).saveDoc(doc, {
    success: function(data) {
      $('#delete_sub_user').modal("hide");
      newAlert('success', 'User Deleted Successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      //setTimeout(function(){
        $.couch.db(replicated_db).openDoc(delete_index, {
          success: function(data) {
            $.couch.db(replicated_db).removeDoc(data, {
                  success: function(data) {
                    getSubUsers();
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

      //},80000);
    },
    error: function(data, error, reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  });

// added by narendra 23-11-15.


}

function newAlert (type, message) {
  if(message == "Login Required") {
    $("#alert-area").html("");
    $("#alert-area").append($("<div class='suc-err-msg alert alert-"+type+" fade in' data-alert><a class='close' data-dismiss='alert'>&times;</a><p>Session Expired. Please Logged In again.</p></div>"));
    $(".alert").delay(1000).fadeOut("slow", function () {
      $(this).remove();
      window.location.href = "/";
    });
  }else {
    $("#alert-area").html("");
    $("#alert-area").append($("<div class='suc-err-msg alert alert-"+type+" fade in' data-alert><a class='close' data-dismiss='alert'>&times;</a><p> " + message + " </p></div>"));
    $(".alert").delay(4000).fadeOut("slow", function () { $(this).remove(); });  
  }
}

function newAlertForModal (type, message, id) {
  if($(".alert-test").length){
    return;
  }else{
    $("#" + id).find(".alert-msg-box").append($("<div class='alert-test alert-"+type+" fade in' data-alert><p style = 'color:red'> " + message + " </p></div>"));
    $(".alert-test").delay(6000).fadeOut("slow", function () { $(this).remove(); });  
  }
}

function getPatientComplaints(selector) {
  $.couch.db(db).view("tamsa/doctorNotesComplaints", {
    success: function(data) {
      var $complaintsObj = $("."+selector).closest(".charting-template-subjective-response").find(".charting-target"),
          selected_complaints = [];    
      $complaintsObj.find("li").each(function() {
        selected_complaints.push($(this).html());
      });
      for (var i = 0; i < data.rows.length; i++) {
        if(selected_complaints.length > 0) {
          if($.inArray(data.rows[i].key[1],selected_complaints) == -1) {
            $('.'+selector).append('<li>'+data.rows[i].key[1]+'</li>').animate('slow');  
          }
        }else {
          $('.'+selector).append('<li>'+data.rows[i].key[1]+'</li>').animate('slow');
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id],
    endkey: [userinfo.user_id, {}],
    reduce : true,
    group : true
  });
}

function getPatientDiagnoses(selector) {
  $.couch.db(db).view("tamsa/doctorNotesDiagnoses", {
    success: function(data) {
      var $diagnosisObj = $("."+selector).closest(".charting-template-assessment-response").find(".charting-target"),
          selected_diagnosis = [];
      $diagnosisObj.find("li").each(function() {
        selected_diagnosis.push($(this).html());
      });
      for (var i = 0; i < data.rows.length; i++) {
        if(selected_diagnosis.length > 0) {
          if($.inArray(data.rows[i].key[1],selected_diagnosis) == -1) {
            $('.'+selector).append('<li>'+data.rows[i].key[1]+'</li>').animate('slow');
          }
        }else {
          $('.'+selector).append('<li>'+data.rows[i].key[1]+'</li>').animate('slow');
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [userinfo.user_id],
    endkey: [userinfo.user_id, {}],
    reduce : true,
    group : true
  });
}

function activePatientcarePlan(){
  patient_cp_docid = $("#patient_careplan_summary_checkbox").val();
  patient_cp_revision = $("#patient_careplan_summary_checkbox").attr("rev");
    var active_val = '';
    var d = new Date();
    if($("#patient_careplan_summary_checkbox").is(':checked')){
      active_val = "yes";
    }else{
      active_val = "no";
    }
  $.couch.db(db).openDoc(patient_cp_docid,{
    success: function(data){
        var patient_cp_active = {
        _id:             patient_cp_docid,
        _rev:            patient_cp_revision,
        doctor_id:       data.doctor_id,
        template_name:   data.template_name,
        doctype:         "patient_careplan",
        update_ts: d,
        publish:         data.publish,
        specialization:  data.specialization,
        user_id:         data.user_id,
        active:          active_val,
        fields:          data.fields
      }
      $.couch.db(db).saveDoc(patient_cp_active,{
        success: function(data){
          newAlert('success', 'Your Care plan has been Disabled.');
          $('html, body').animate({scrollTop: 0}, 'slow');
          $("#update_patient_care_plan").attr("doc_rev",data.rev);
          $("#patient_careplan_summary_checkbox").attr("rev",data.rev);
          prescribedPatientCarePlanList();
          //appendPatientCarePlan();
          $("#disable_patient_careplan_modal").modal("hide");
          $("#care_plan_summary_id").trigger('click');
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
  
}

function completeRefferal(r_id) {
  $.couch.db(db).openDoc(r_id, {
    success: function(referral) {

      $.couch.db(db).view("tamsa/getDoctorSubscribers", {
        success: function(subscriber_data) {
          if (subscriber_data.rows.length == 0) {
            $.couch.db(replicated_db).openDoc(referral.doctor_id,{
              success:function(ddata){
                var d              = new Date();
                var subscriber_doc = {
                  Designation:     ddata.Designation?ddata.Designation : "",
                  Email:           ddata.email,
                  Name:            referral.doctor,
                  Phone:           ddata.phone,
                  Relation:        "Doctor",
                  "Select Report": "All conditions",
                  doctor_id:       referral.doctor_id,
                  doctype:         "Subscriber",
                  insert_ts:       d,
                  user_id:         referral.user_id,
                  User_firstname:  referral.User_firstname,
                  User_lastname:   referral.User_lastname,
                  patient_dhp_id:  referral.patient_dhp_id,
                  dhp_code:        pd_data.dhp_code,
                  frequency:       ""
                }

                $.couch.db(db).saveDoc(subscriber_doc, {
                  success: function(data) {
                    referral.read_receipt = "Y";
                    referral.update_ts    = d;
                    $.couch.db(db).saveDoc(referral, {
                      success: function(data) {
                       plController.getReferredPatients(); 
                        newAlert('success', 'Referral completed successfully !');
                        $('html, body').animate({scrollTop: 0}, 'slow');
                      },
                      error: function(data, error, reason) {
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
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
              }
            });
          }
          else {
            referral.read_receipt = "Y";
            $.couch.db(db).saveDoc(referral, {
              success: function(data) {
                getDoctorPatients(pd_data._id); 
                newAlert('success', 'Referral completed successfully !');
                $('html, body').animate({scrollTop: 0}, 'slow');
              },
              error: function(data, error, reason) {
                newAlert('error', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
              }
            });
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key: [referral.doctor_id, referral.user_id]
      });
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function savePatientTask() {
  if(validateSavePatientTask()){
    var d = new Date();
    var tasks = [];

    $(".add-patient-task-parent").each(function(){
      if($(this).find(".task_patient_checkbox").prop("checked")){
        var patient_task_data = {
          doctor_id:      pd_data._id,
          doctor_name:    pd_data.first_name,
          patient_name:   $("#task_user_id").attr('patient_name'),
          doctype:        "task",
          insert_ts:      d,
          user_id:        $("#task_user_id").val(),
          status:         "Review",
          effective_date: moment(d).format("YYYY-MM-DD"),
          due_date:       $(this).find(".new-patient-task").val(),
          notify:         $(this).find(".patient-task-notify").prop("checked"),
          comments:       $(this).find(".patient-task-comments").val(),
          priority:       $(this).find(".patient-task-priority").val()
        };
        if($(this).data("task_type") == "eRx")  patient_task_data['task'] = "eRx"
        else if($(this).data("task_type") == "Appointment") patient_task_data['task'] = "Appointment"
        else if($(this).data("task_type") == "eLab") patient_task_data['task'] = "eLab"
        else if($(this).data("task_type") == "eImaging") patient_task_data['task'] = "eImaging"
        else console.log("some error with data")

        tasks.push(patient_task_data);
      }
    });
    $.couch.db(db).bulkSave({"docs": tasks}, {
      success: function(data) {
        newAlert('success', 'Task Saved successfully !');
        $("#add_patient_task_modal").modal("hide");
        $('html, body').animate({scrollTop: 0}, 'slow');
        getDueTasks();
      },
      error: function(data, error, reason) {
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    });
  }
}

function saveLabOrder(saveType) {
  if(validateSaveLabOrder()){
    $("#lo_save, #lo_save_print").attr("disabled","disabled");
    var d  = new Date();
    var lab_order_doc = {
      insert_ts:              d,
      doctype:                "LabImagingOrder",
      doctor_id:              pd_data._id,
      order_number:           $("#lo_order_number").val(),
      patient_name:           $("#lo_patient_name").val(),
      referred_by:            $("#lo_referred_by").val(),
      patient_dhp_id:         $("#lo_patient_dhp_id").val(),
      date:                   $("#lo_date").val(),
      laboratory:             $('#lo_laboratory').find(":selected").text(),
      lab_doc_id:             $("#lo_laboratory").val(),
      age:                    $("#lo_age").val(),
      lab_order_instructions: $("#lo_instructions").val(),
      gender:                 $("#lo_gender").val(),
      tests:                  $("#lo_tests").val(),
      order_type:             $("#lo_type").val(),
      user_id:                userinfo.user_id
    };

    var cron_doc = {
      doctype:                'cronRecords',
      operation_case:         '11',
      processed:              'No',
      doctor_id:              pd_data._id,
      order_number:           $("#lo_order_number").val(),
      patient_name:           $("#lo_patient_name").val(),
      referred_by:            $("#lo_referred_by").val(),
      patient_dhp_id:         $("#lo_patient_dhp_id").val(),
      date:                   $("#lo_date").val(),
      laboratory:             $('#lo_laboratory').find(":selected").text(),
      lab_doc_id:             $("#lo_laboratory").val(),
      age:                    $("#lo_age").val(),
      lab_order_instructions: $("#lo_instructions").val(),
      gender:                 $("#lo_gender").val(),
      tests:                  $("#lo_tests").val(),
      order_type:             $("#lo_type").val(),
      user_id:                userinfo.user_id
    }

    $.couch.db(db).saveDoc(lab_order_doc, {
      success: function(data) {
        newAlert('success', 'Lab order saved successfully !');
        $('html, body').animate({scrollTop: 0}, 'slow');
        clearLabOrderForm();
        if(saveType == "e-order"){
          $.couch.db(db).saveDoc(cron_doc, {
            success: function(data) {
              $("#lo_save, #lo_save_print").removeAttr("disabled");
            },
            error: function(data, error, reason) {
              $("#lo_save, #lo_save_print").removeAttr("disabled");
              newAlert('danger', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            }
          });  
        }else{
          $.couch.db(db).openDoc(data.id,{
            success: function(data){
              print_table = "<table style='border:1px solid grey'><thead><th style='border:1px solid grey'>Order Number</th><th style='border:1px solid grey'>Patient Name</th><th style='border:1px solid grey'>Referred By</th><th style='border:1px solid grey'>Patient DHP ID</th><th style='border:1px solid grey'>Date</th><th style='border:1px solid grey'>Laboratary</th><th style='border:1px solid grey'>Age</th><th style='border:1px solid grey'>Gender</th><th style='border:1px solid grey'>Instructions</th><th style='border:1px solid grey'>Tests</th></thead><tbody><tr><td style='border:1px solid grey'>"+data.order_number+"</td><td style='border:1px solid grey'>"+data.patient_name+"</td><td style='border:1px solid grey'>"+data.referred_by+"</td><td style='border:1px solid grey'>"+data.patient_dhp_id+"</td><td style='border:1px solid grey'>"+data.date+"</td><td style='border:1px solid grey'>"+data.laboratory+"</td><td style='border:1px solid grey'>"+data.age+"</td><td style='border:1px solid grey'>"+data.gender+"</td><td style='border:1px solid grey'>"+data.lab_order_instructions+"</td><td style='border:1px solid grey'>"+data.tests+"</td></tr><tbody></table>";
              printNewHtml(print_table);
              $("#lo_save, #lo_save_print").removeAttr("disabled");
            },
            error: function(data){
              $("#lo_save, #lo_save_print").removeAttr("disabled");
              newAlert('danger', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            }
          });
        }
      },
      error: function(data, error, reason) {
        $("#lo_save, #lo_save_print").removeAttr("disabled");
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    })  
  }
}

function getAllDetailsForImagingsOrdering(){
  clearImagingOrderForm();
  $("#io_order_number").val(getPcode(5,"numeric")).attr("readonly",true);
  $("#io_patient_name").val(userinfo.first_nm + " "+  userinfo.last_nm);
  $("#io_gender").val(userinfo.gender);
  $("#io_referred_by").val(pd_data.first_name + " " + pd_data.last_name);
  $("#io_patient_dhp_id").val(userinfo.patient_dhp_id);
  if(userinfo.age) {
    $("#io_age").val(userinfo.age);
  }else if(userinfo.date_of_birth) {
    $("#io_age").val(getAgeFromDOB(userinfo.date_of_birth));
  }else {
    $("#io_age").val("");
  }
  getAllImagings();
}

function clearLabOrderForm() {
  $("#lo_order_number").val(getPcode(5,"numeric"));
  $("#lo_tests").multiselect("uncheckAll");
  $("#lo_tests").multiselect("refresh");
  $("#lo_date").val("");
  $("#lo_laboratory").val("");
  $("#lo_instructions").val("");
  $("#lo_age").val("");
  $("#lo_tests").val("");
}

function viewLabImagingOrders(type){
  $.couch.db(db).view("tamsa/getLabImagingOrders", {
    success:function(data) {
      if(data.rows.length > 0) {
        if(type != '') {
          paginationConfiguration(data,"view_orders_pagination_charting",5,displayViewOrders_chart);
        }else{
          paginationConfiguration(data,"view_orders_pagination",15,displayViewOrders);
        }
      }else {
        if(type != '') {
          $("#view_orders_table_charting tbody").html('<tr><td colspan="4">No View orders are Found.</td></tr>');
        }else {
          $("#view_orders_table tbody").html('<tr><td colspan="5">No View orders are Found.</td></tr>');
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:[pd_data._id,userinfo.user_id]
  });
}

function displayViewOrders(start,end,data){
  $("#view_orders_table tbody").html("");
  var order_list = [];
  for (var i = start; i < end; i++) {
      order_list.push('<tr><td><span rev = "'+data.rows[i].value._rev+'"index = "'+data.rows[i].id+'" class = "cancel-order label label-warning pointer">Cancel Order</span></td><td>'+data.rows[i].value.doctype+'</td><td>'+data.rows[i].value.order_number+'</td><td>'+data.rows[i].value.order_type+'</td><td>'+data.rows[i].value.tests+'</td></tr>');
  };
  $("#view_orders_table tbody").html(order_list.join(''));
}

function displayViewOrders_chart(start,end,data){
  $("#view_orders_table_charting tbody").html("");
  var order_list = [];
  for (var i = start; i < end; i++) {
      order_list.push('<tr><td>'+data.rows[i].value.doctype+'</td><td>'+data.rows[i].value.order_number+'</td><td>'+data.rows[i].value.order_type+'</td><td>'+data.rows[i].value.tests+'</td></tr>');
  };
  $("#view_orders_table_charting tbody").html(order_list.join(''));
}

function saveSubUser(action) {
  var d  = new Date();
  var signup_user = {
    first_name:             $("#su_first_name").val(),
    last_name:              $("#su_last_name").val(),
    phone:                  $("#su_phone_number").val(),
    alert_phone:            $("#su_phone_number").val(),
    level:                  $("#su_level").val(),
    active:                 $("#su_active").val(),
    admin:                  $("#su_admin").val(),
    action:                 '',
    processed:              "No",
    doctype:                "cronRecords",
  };

  if($("#su_save").attr('index') && $("#su_save").attr('rev')) {
    signup_user.operation_case = "14";
    signup_user.update_id      = $("#su_save").attr('index');
    signup_user.update_rev     = $("#su_save").attr('rev');
    signup_user.update_ts      = d;
  }
  else {
    signup_user.operation_case         = "1";
    signup_user.insert_ts              = d;
    signup_user.update_ts              = d;
    signup_user.random_code            = getPcode(6, "alphabetic");
    signup_user.email                  = $("#su_email").val();
    signup_user.password               = $("#su_password").val();
    signup_user.name                   = $("#su_email").val();
    signup_user.alert_email            = $("#su_email").val();
    signup_user.specialization         = $("#pdspecialization").val();
    signup_user.city                   = $("#pdcity").val();
    signup_user.state                  = $("#pdstate").val();
    signup_user.country                = $("#pdcountry").val();
    signup_user.hospital_affiliated    = $("#pdhospital").val();
    signup_user.hospital_type          = $("#pdhospitaltype").val();
    signup_user.hospital_phone         = $("#pdhospital_phone").val();
    signup_user.hospital_email         = $("#pdhospital_email").val();
    signup_user.doctors_network        = true;
    signup_user.critical_alerts_medium = "Phone";
    signup_user.reports_medium         = "Phone";
    signup_user.type                   = "user";
    signup_user.super_user_id          = pd_data._id;
    signup_user.dhp_code               = pd_data.dhp_code;
  }

  if($("#su_phone_number").val() != $("#su_phone_number").data("phoneval")){
    $.couch.db(replicated_db).view("tamsa/getUserPhone",{
      success: function (data){
        if(data.rows.length > 0){
          newAlertForModal('danger','User with given Phone number is already exist.','add_sub_user_modal');
          $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
          $("#su_password").focus();
          return false;
        }else{
          checkPatientEmailWithSubUserSignup(signup_user);      
        }
      },
      error: function (data,error,reason){
        newAlertForModal('danger',reason,'add_sub_user_modal');
        $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:$("#su_phone_number").val().trim()
    });
  }else{
    checkPatientEmailWithSubUserSignup(signup_user);
  }
}

function checkPatientEmailWithSubUserSignup(signupuser){
  if($("#su_email").val() != $("#su_email").attr("emailval")){
    var tempdocid = "org.couchdb.user:"+$("#su_email").val();
    $.couch.db(replicated_db).openDoc(tempdocid, {
      success: function(data){
        newAlertForModal('danger','User with given email id is already exist.','add_sub_user_modal');
        $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
        $("#su_email").focus();
        return false;
      },
      error: function(data, error, reason) {
        if(data == "404"){
          $.couch.db(db).saveDoc(signupuser, {
            success: function(data) {
              newAlert('success', 'User Saved Successfully !');
              $('html, body').animate({scrollTop: 0}, 'slow');
              $("#add_sub_user_modal").modal("hide");
              setTimeout(function(){
                getSubUsers();
              },80000);
            },
            error: function(data, error, reason) {
              newAlertForModal('danger', reason,'add_sub_user_modal');
              $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
            }
          });
        }else{
          newAlertForModal('danger', reason,'add_sub_user_modal');
          $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');  
        }
      }
    });
  }else{
    $.couch.db(db).saveDoc(signupuser, {
      success: function(data) {
        newAlert('success', 'User Saved Successfully !');
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#add_sub_user_modal").modal("hide");
        setTimeout(function(){
          getSubUsers();
        },80000);
      },
      error: function(data, error, reason) {
        newAlertForModal('danger', reason,'add_sub_user_modal');
        $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
      }
    });
  }
}

function clearSubUserForm() {
  $("#su_first_name").val("");
  $("#su_last_name").val("");
  $("#su_phone_number").val("");
  $("#su_email").val("");
  $("#su_level").val("");
  $("#su_active").val("");
  $("#su_admin").val("");
  $("#su_action").val("");
  $("#su_save").attr('index', '');
  $("#su_save").attr('rev', '');
  $("#su_passform").show();
  $("#su_phone_number").val('');
}

function getSubUsers() {
  $("#sub_users_table tbody").html("");
  $.couch.db(replicated_db).view("tamsa/getSubUsers", {
    success: function(data) {
      if(data.rows.length > 0){
        paginationConfiguration(data,"subuser_pagination",10,displaySubUsers); 
      }else{
        var sub_users_table = [];  
        sub_users_table.push('<tr><td colspan="8">No Sub User are Found.</td></tr>');
        $("#sub_users_table tbody").html(sub_users_table.join(''));
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data._id],
    endkey:   [pd_data._id, {}],
    include_docs: true
  });
}

function displaySubUsers(start,end,data){
  $("#sub_users_table tbody").html('');
  var list_s=[];
  var sub_users_table = [];
  for (var i = start; i < end; i++) {

      sub_users_table.push('<tr class="sub-user-row"><td>'+data.rows[i].doc.first_name+'</td><td>'+data.rows[i].doc.last_name+'</td><td>'+data.rows[i].doc.email+'</td><td>'+data.rows[i].doc.level+'</td><td>'+data.rows[i].doc.active+'</td><td>'+data.rows[i].doc.admin+'</td><td>'+data.rows[i].doc.phone+'</td><td>'+(data.rows[i].doc.insert_ts ? moment(data.rows[i].doc.insert_ts).format("YYYY-MM-DD") : "NA")+'</td><td>'+(data.rows[i].doc.update_ts ? moment(data.rows[i].doc.update_ts).format("YYYY-MM-DD") : "NA")+'</td><td>'+'<span class="glyphicon glyphicon-trash delete_sub_user" data-target="#delete_sub_user" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data.rows[i].id+'" rev="'+data.rows[i].doc._rev+'" title="Delete User"></span><span class="glyphicon glyphicon-pencil edit_sub_user" data-target="#add_sub_user_modal" role="button" class="dropdown-toggle" data-toggle="modal" title="Edit User" index="'+data.rows[i].id+'"></span><span class="glyphicon glyphicon glyphicon-repeat password_reset_user" data-target="#password_reset_user_modal" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data.rows[i].id+'" title="Reset Password"></span><span class="not-update glyphicon glyphicon-warning-sign" id="not_update_'+data.rows[i].doc.first_name+''+data.rows[i].doc.alert_phone+'" title="Data is Pending" style="display:none"></span></td></tr>');
    var list_users = getListdisplaySubUsers(data.rows[i]);
  }
  $("#sub_users_table tbody").html(sub_users_table.join(''));
}

function getListdisplaySubUsers(data){
  $.couch.db(db).view("tamsa/getCronRecords", {
    success:function(pdata){
      var showPending = false;
      for (var j = 0; j < pdata.rows.length; j++) {
        if(pdata.rows[j].value.operation_case == "14"){
          if(pdata.rows[j].value.update_id == data.id){
            showPending = true;
            continue;
          }
        }else if(pdata.rows[j].value.operation_case == "16"){
          if(pdata.rows[j].value.user_id == data.id){
            showPending = true;
            continue;
          }
        }
      } 
      if(showPending){
        $("#not_update_"+data.doc.first_name+""+data.doc.alert_phone).show();
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function getTaskList() {
  showhideloader('show');
  $.couch.db(db).list("tamsa/getTaskListSortByDateCreated", "getDueTasks", {
    startkey: [pd_data._id],
    endkey:   [pd_data._id,{},{},{}],
    reduce:   false,
    group:    false,
    include_docs:true
  }).success(function(data){
    showhideloader('hide');
    if(data.rows.length > 0){
      paginationConfiguration(data,"task_list_pagination",10,displayTaskList);
    }else{
      var tasks = [];
      $("#task_list_table tbody").html('<tr><td colspan="5">No task is Due.</td></tr>');
    }
  });
  
  // $.couch.db(db).view("tamsa/getDueTasks", {
  //   success: function(data) {
  //     showhideloader('hide');
  //     if(data.rows.length > 0){
  //       paginationConfiguration(data,"task_list_pagination",10,displayTaskList);
  //     }else{
  //       var tasks = [];
  //       tasks.push('<tr><td colspan="5">No task is Due.</td></tr>');
  //       $("#task_list_table tbody").html(tasks.join(''));
  //     }
  //   },
  //   error: function(data, error, reason){
  //     showhideloader('hide');
  //     newAlert('danger',reason);
  //   },
  //   startkey: [pd_data._id,{},{},{}],
  //   endkey:   [pd_data._id],
  //   descending:true,
  //   reduce:   false,
  //   group:    false
  // });
}

function getCompletedTaskList() {
  $.couch.db(db).list("tamsa/getTaskListSortByDateCreated", "getDueTasks", {
    startkey: [1,pd_data._id],
    endkey:   [1,pd_data._id,{},{},{}],
    reduce:   false,
    group:    false,
    include_docs:true
  }).success(function(data){
    if(data.rows.length > 0){
      paginationConfiguration(data,"crequest_list_pagination",10,completedDisplayTaskList);
    }else{
      $("#crequest_list_table tbody").html('<tr><td colspan="5">No task is Due.</td></tr>');
    }
  });

  // $.couch.db(db).view("tamsa/getDueTasks", {
  //   success: function(data) {
  //     if(data.rows.length > 0){
  //       paginationConfiguration(data,"crequest_list_pagination",10,completedDisplayTaskList);
  //     }else{
        
  //     }
  //   },
  //   error: function(status) {
  //     console.log(status);
  //   },
  //   startkey: [1,pd_data._id,],
  //   endkey:   [1,pd_data._id,{},{},{}],
  //   reduce:   false,
  //   group:    false
  // });
}

function displayTaskList(start,end,data){
  var tasks = [];
  // var sr_no = 1;
  var doctor_name = '';
  for (var i = start; i < end; i++) {
    if (data.rows[i].key[3] > 1) {
      doctor_name = data.rows[i].value.reassign_doctor[data.rows[i].key[3] -2].name;
    }
    else {
      doctor_name = data.rows[i].value.doctor_name;
    }

    if(data.rows[i].value.task == "Other"){
    tasks.push('<tr><td class="" doc_id="'+(data.rows[i].value.document_id ? data.rows[i].value.document_id : "")+'" user_id="'+data.rows[i].value.user_id+'" task="'+data.rows[i].value.task+'">'+data.rows[i].value.task+'</td>');
    }else{
      tasks.push('<tr><td class="task_link" doc_id="'+(data.rows[i].value.document_id ? data.rows[i].value.document_id : "")+'" user_id="'+data.rows[i].value.user_id+'" task="'+data.rows[i].value.task+'">'+data.rows[i].value.task+'</td>');
    }
    tasks.push('<td>'+data.rows[i].value.patient_name+'</td><td>'+doctor_name+'</td><td>'+data.rows[i].value.insert_ts.substring(0, 10)+'</td><td align="center"><select type="text" data-main-val="'+data.rows[i].key[1]+'" class="form-control task_list_row" user_id="'+data.rows[i].value.user_id+'" index="'+data.rows[i].id+'"><option ');

    if (data.rows[i].key[1] == "Review") {
      tasks.push('selected');
    }
    tasks.push(' value="Review">Under Review</option><option ');

    if (data.rows[i].key[1] == "Completed") {
      tasks.push('selected'); 
    }
    tasks.push(' >Completed</option>');

    if (data.rows[i].key[1] == "Reassign") {
      tasks.push('<option selected >Reassign</option></select><br><strong>To:</strong><br>'+data.rows[i].value.reassign_doctor[data.rows[i].key[3]].name+'</td></tr>');
    }
    else {
      tasks.push('<option>Reassign</option></select></td></tr>');
    }
  };
  $("#task_list_table tbody").html(tasks.join(''));
}

function openAddNewTask(){
  $("#add_new_task_modal").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  clearNewTaskForm();
  searchPatientByNameAutocompleter("task_patient",autocompleterSelectEventForSubscriberListOnNewTask,false,pd_data._id,pd_data.dhp_code);
  searchDHPDoctorsList("task_assignee",autocompleterSelectForDoctorsList,pd_data.dhp_code);
}

function saveNewTask(){
  if(validateNewTask()){
    var task_data = {
      doctor_id:      pd_data._id,
      doctor_name:    pd_data.first_name+" "+pd_data.last_name,
      doctype:        "task",
      insert_ts:      new Date(),
      effective_date: $("#task_effective_date").val(),
      patient_name:   $("#task_patient").val(),
      user_id:        $("#task_patient").data("user_id"),
      task:           $("#task_type").val(),
      priority:       $("#task_priority").val(),
      comments:       $("#task_comments").val(),
      due_date:       $("#task_due_date").val(),
      notify:         $("#task_notify").prop("checked")
    }
    //status:         $("#task_status").val(),
    if($("#task_assignee").data("doctor_id") != pd_data._id){
      task_data.status = "Reassign";
      task_data.reassign_doctor = [{
        "id":   $("#task_assignee").data("doctor_id"),
        "name": $("#task_assignee").val()
      }]
    }else{
      task_data.status = "Review";
    }
    $.couch.db(db).saveDoc(task_data,{
      success:function(data){
        newAlert("success","Task Successfuly created.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        getDueTasks();
        getTaskList();
        $("#add_new_task_modal").modal("hide");
        clearNewTaskForm();
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }
}

function clearNewTaskForm(){
  $("#task_patient").val("");
  $("#task_assignee").val("");
  $("#task_status").val("Review");
  $("#task_type").val("noselect");
  $("#task_priority").val("Regular");
  $("#task_comments").val("");
  $("#task_due_date").val("");
  $("#task_effective_date").val("");
  $("#task_notify").prop("checked",false);
}

function completedDisplayTaskList(start,end,data){
  var tasks = [];
  var doctor_name = '';
  for (var i = start; i < end; i++) {

    if (data.rows[i].key[4] > 1) {
      doctor_name = data.rows[i].value.reassign_doctor[data.rows[i].key[4] -2].name;
    }
    else {
      doctor_name = data.rows[i].value.doctor_name;
    }

    tasks.push('<tr><td class="task_link" doc_id="'+data.rows[i].value.document_id+'" user_id="'+data.rows[i].value.user_id+'" task="'+data.rows[i].value.task+'">'+data.rows[i].value.task+'</td><td>'+data.rows[i].value.patient_name+'</td><td>'+doctor_name+'</td><td>'+data.rows[i].value.insert_ts.substring(0, 10)+'</td><td align="center"><select type="text" data-main-val ="'+data.rows[i].key[1]+'" user_id="'+data.rows[i].value.user_id+'" class="form-control task_list_row" index="'+data.rows[i].id+'"><option ');

    if (data.rows[i].key[2] == "Review") {
      tasks.push('selected');
    }
    tasks.push(' value="Review">Under Review</option><option ');

    if (data.rows[i].key[2] == "Completed") {
      tasks.push('selected'); 
    }
    tasks.push(' >Completed</option>');

    if (data.rows[i].key[2] == "Reassign") {
      tasks.push('<option selected >Reassign</option></select><br><strong>To:</strong><br>'+data.rows[i].value.reassign_doctor[data.rows[i].key[4]].name+'</td></tr>');
    }
    else {
      tasks.push('<option>Reassign</option></select></td></tr>');
    }
  };
  $("#crequest_list_table tbody").html(tasks.join(''));
}

function printAppointment() {
  var WinPrint = window.open('', '', 'letf=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  WinPrint.document.write("<link href='css/fullcalendar.css' rel='stylesheet'/><link href='css/fullcalendar.print.css' rel='stylesheet' media='print' />"+$("#calendar").html());
  setTimeout(function(){
    WinPrint.document.close();
    WinPrint.focus();
    showProcessLoader("Please choose print OR cancel from the print preview window before you proceed.");
    WinPrint.print();
    WinPrint.close();
    removeProcessLoader("loading_image");
  }, 1000);
}

function printMedication(data) {
  try{
    var WinPrint = window.open('', '', 'letf=0,top=0,width=1300,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.open();
    WinPrint.document.write(data);
    // WinPrint.document.write('<html><head><link href="css/bootstrap.css" media="print" rel="stylesheet" type="text/css" /><link href="css/style.css" media="print" rel="stylesheet"/><style> table { page-break-inside:auto } tr { page-break-inside:avoid; page-break-after:auto } thead { display:table-header-group } tfoot { display:table-footer-group }</style></head><body>'+data+'</body></html>');

    setTimeout(function(){
      WinPrint.document.close();
      WinPrint.focus();
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if(isChrome) {
        setTimeout(function (){
          showProcessLoader("Please choose print OR cancel from the print preview window before you proceed.");
          WinPrint.print();
          WinPrint.close();
          removeProcessLoader("loading_image");
        }, 500)  
      }else {
        WinPrint.print();
        WinPrint.close();
      }
    }, 1000);
  }catch(err){
    newAlert("danger","not abel to print. Please make sure you allow popup in the browser.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }
}

function printNewHtml(data) {
  try{
    var WinPrint = window.open('', '', 'letf=0,top=0,width=1300,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.open();
    // WinPrint.document.write(data);
    WinPrint.document.write('<html><head><link href="css/bootstrap.css" media="print" rel="stylesheet" type="text/css" /><link href="css/style.css" media="print" rel="stylesheet"/><style> table { page-break-inside:auto } tr { page-break-inside:avoid; page-break-after:auto } thead { display:table-header-group } tfoot { display:table-footer-group }</style></head><body>'+data+'</body></html>');

    setTimeout(function(){
      WinPrint.document.close();
      WinPrint.focus();
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if(isChrome) {
        setTimeout(function (){
          showProcessLoader("Please choose print OR cancel from the print preview window before you proceed.");
          WinPrint.print();
          WinPrint.close();
          removeProcessLoader("loading_image");
        }, 500)  
      }else {
        WinPrint.print();
        WinPrint.close();
      }
    }, 1000);
  }catch(err){
    newAlert("danger","not abel to print. Please make sure you allow popup in the browser.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }
   
}

function changeTaskStatus($obj) {
  $.couch.db(db).view("tamsa/getDoctorSubscribers",{
    success:function(data){
      var index  = $obj.attr("index");
      var status = $obj.val();
      var default_value = $obj.data("main-val");
      if(data.rows.length == 0){
        newAlert("danger", "Task can not be given as Patient is not Found in your subscriberList.");
        $obj.val(default_value);
        return false;
      }else{
        if(status == "Reassign") {
          $("#reassign_task_modal").modal({
            show:true,
            backdrop:'static',
            keyboard:false
          });
          $("#reassign_doctor_id").data("action", $obj.data("action"));
          $("#reassign_doctor_id").attr("index", index);
        }else {
          $.couch.db(db).openDoc(index, {
            success: function(data) {
              data.status = status;
              $.couch.db(db).saveDoc(data, {
                success: function(data) {
                  newAlert('success', 'Status changed successfully !');
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  getDueTasks();
                  getTaskList();
                  getCompletedTaskList();
                },
                error: function(data, error, reason) {
                  newAlert('error', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
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
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:[pd_data._id,$obj.attr("user_id")]
  });
}

function reassignTask() {
  var index       = $("#reassign_doctor_id").attr("index");
  var reassign_doctor = {        
    id:   $("#reassign_doctor_id").val(),
    name: $("#reassign_doctor").val()
  };

  if ((!reassign_doctor.id) || (!reassign_doctor.name)) {
    newAlert('danger', 'Please Select the doctor first');
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }
  else if (reassign_doctor.id == pd_data._id) {
    newAlert('danger', 'You can not reassign to yourself');
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }
  else {
    $.couch.db(db).openDoc(index, {
      success: function(data) {
        data.status               = "Reassign";
        if (!data.reassign_doctor) {
          data.reassign_doctor = [];
        }
        data.reassign_doctor.push(reassign_doctor);
        $.couch.db(db).saveDoc(data, {
          success: function(data) {
            if($("#reassign_doctor_id").data("action") == "dailyDashboard") {
              getCurrentTaskForDailyDashboard("noselect","noselect");
            }
            if($("#reassign_doctor_id").data("action") == "frontDesk") {
              getCurrentTaskForFrontDesk("noselect","noselect");  
            }
            getTaskList();
            getCompletedTaskList();
            newAlert('success', 'Task reassigned successfully !');
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#reassign_task_modal").modal("hide");
          },
          error: function(data, error, reason) {
            newAlert('error', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
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
}

function saveCvg() {
  var d  = new Date();
  var cvg_doc = {
    update_ts:            d,
    doctype:              "cvg",
    doctor_id:            pd_data._id,
    cvg_blood_pressure:   $("#cvg_blood_pressure").is(':checked'),
    cvg_weight:           $("#cvg_weight").is(':checked'),
    cvg_heart_rate:       $("#cvg_heart_rate").is(':checked'),
    cvg_o2:               $("#cvg_o2").is(':checked'),
    cvg_respiration_rate: $("#cvg_respiration_rate").is(':checked'),
    cvg_fasting_glucose:  $("#cvg_fasting_glucose").is(':checked')
  }

  if($("#cvg_save").data("index")) {
    cvg_doc._id  = $("#cvg_save").data("index");
    cvg_doc._rev = $("#cvg_save").data("rev");
  }

  $.couch.db(db).saveDoc(cvg_doc, {
    success: function(data) {
      $("#customize_vitalsign_graphs").modal("hide");
      newAlert('success', 'Preference Saved Successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      getCvg();
      // getAnalyticsRange();
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function savePharmacy() {
  if(validationAddPharmacy()){
    $("#pharmacy_save").attr("disabled","disabled");
    var d  = new Date();
    var pharmacy_doc = {
      insert_ts:       d,
      doctype:         "pharmacy",
      dhp_code:        $("#pharmacy_dhp_code").val(),
      pharmacy_name:   $("#pharmacy_name").val(),
      pharmacy_phone:  $("#pharmacy_phone").val(),
      pharmacy_fax:    $("#pharmacy_fax").val(),
      pharmacy_email:  $("#pharmacy_email").val(),
      pharmacy_street: $("#pharmacy_street").val(),
      pharmacy_city:   $("#pharmacy_city").val(),
      pharmacy_state:  $("#pharmacy_state").val(),
      pharmacy_zip:    $("#pharmacy_zip").val()
    };

    var cron_pharmacy_doc = {
      doctype:         'cronRecords',
      operation_case:  '8',
      processed:       'No',
      dhp_code:        $("#pharmacy_dhp_code").val(),
      doctor_id:       pd_data._id,
      pharmacy_name:   $("#pharmacy_name").val(),
      pharmacy_phone:  $("#pharmacy_phone").val(),
      pharmacy_fax:    $("#pharmacy_fax").val(),
      pharmacy_email:  $("#pharmacy_email").val(),
      pharmacy_street: $("#pharmacy_street").val(),
      pharmacy_city:   $("#pharmacy_city").val(),
      pharmacy_state:  $("#pharmacy_state").val(),
      pharmacy_zip:    $("#pharmacy_zip").val()
    };

    $.couch.db(db).saveDoc(pharmacy_doc, {
      success: function(data) {
        $.couch.db(db).saveDoc(cron_pharmacy_doc,{
          success: function(data){
            newAlert('success', 'Pharmacy added successfully !');
            $('html, body').animate({scrollTop: 0}, 'slow');
            clearSavePharmacyForm();
            getPharmacy();
            getPharmacyOptions("pharmacy");
            $("#pharmacy_save").removeAttr("disabled");
          },
          error:function(data) {
            $("#pharmacy_save").removeAttr("disabled");
            newAlert('error', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
          }
        })
      },
      error: function(data, error, reason) {
        $("#pharmacy_save").removeAttr("disabled");
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    })
  }
}

function clearSavePharmacyForm() {
  $("#pharmacy_name").val("");
  $("#pharmacy_phone").val("");
  $("#pharmacy_fax").val("");
  $("#pharmacy_email").val("");
  $("#pharmacy_street").val("");
  $("#pharmacy_city").val("");
  $("#pharmacy_state").val("");
  $("#pharmacy_zip").val("");
}

function getPharmacy() {
  $.couch.db(db).view("tamsa/getPharmacy", {
    success: function(data) {
      var pharmacy_rows    = "";
      if (data.rows.length > 0) {
        for (var i = data.rows.length - 1; i >= 0; i--) {
          pharmacy_rows +='<tr><td><img src="images/Prescription.png" width="30" height="25"/></td><td>'+data.rows[i].value.pharmacy_name+'</td><td>'+data.rows[i].value.pharmacy_phone+'</td><td><button type="button" class="btn btn-warning pharmacy_select" val="'+data.rows[i].value._id+'" option="'+data.rows[i].value.pharmacy_name+" -- "+data.rows[i].value.pharmacy_phone+'">Select</button></td></tr>';
        };
      }
      else {
        pharmacy_rows = '<tr><td colspan="3">No Pharmacies have been added yet.</td></tr>';
      }
      $("#pharmacy_rows tbody").html(pharmacy_rows);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data.dhp_code],
    endkey: [pd_data.dhp_code,{}]
  });
}

function getPharmacyOptions(id,city) {
  if(city) var key = city
  else var key = {}
  $.couch.db(db).view("tamsa/getPharmacy", {
    success: function(data) {
      var pharmacy_options = [];
      if (data.rows.length > 0) {
        pharmacy_options.push("<option value=''>Select Pharmacy</option>");
        for (var i = data.rows.length - 1; i >= 0; i--) {
          pharmacy_options.push("<option value="+data.rows[i].value._id+">"+data.rows[i].value.pharmacy_name+" -- "+data.rows[i].value.pharmacy_phone+"</option>");
        };
      }
      else {
        if($("#past_history_tab_link").parent().hasClass("active")){
          pharmacy_options.push("<option value='' selected='selected'>No Pharmacy has been added. Use search button to search for the pharmacy</option>");
        }else{
          pharmacy_options.push("<option value='' selected='selected'>No Pharmacy has been added.</option>");
        }
      }
      $("#"+id).html(pharmacy_options.join(''));
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data.dhp_code],
    endkey: [pd_data.dhp_code,key]
  });
}

function clearPhSearchForm() {
  $("#phs_city").val("");
  getPharmacy();
}

function PhSearch() {
  $.couch.db(db).view("tamsa/getPharmacy", {
    success: function(data) {
      var pharmacy_rows    = "";
      if (data.rows.length > 0) {
        for (var i = data.rows.length - 1; i >= 0; i--) {
          pharmacy_rows +='<tr><td><img src="images/Prescription.png" width="30" height="25"/></td><td>'+data.rows[i].value.pharmacy_name+'</td><td>'+data.rows[i].value.pharmacy_phone+'</td><td><button type="button" class="btn btn-warning pharmacy_select" option="'+data.rows[i].value.pharmacy_name+" -- "+data.rows[i].value.pharmacy_phone+'">Select</button></td></tr>';
        };
      }
      else {
        pharmacy_rows = '<tr><td colspan="3">No Pharmacies have been added yet.</td></tr>';
      }
      $("#pharmacy_rows tbody").html(pharmacy_rows);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: [pd_data.dhp_code,$("#phs_city").val()]
  });
}

function  saveMiscSetting() {
  $("#save_misc_setting").attr("disabled","disabled");
  var d  = new Date();
  var frontDesk = {
    update_ts:         d,
    doctype:           "misc_setting",
    doctor_id:         pd_data._id,
    dhp_code:          pd_data.dhp_code,
    enable_front_disk: $("#misc_front_disk").is(':checked')
  };

  if ($("#save_misc_setting").attr("index") && $("#save_misc_setting").attr("rev")) {
    frontDesk._rev = $("#save_misc_setting").attr("rev");
    frontDesk._id  = $("#save_misc_setting").attr("index");
  }

  $.couch.db(db).saveDoc(frontDesk, {
    success: function(data) {
      newAlert('success', 'Saved successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#save_misc_setting").removeAttr("disabled");
    },
    error: function(data, error, reason) {
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#save_misc_setting").removeAttr("disabled");
    }
  })
}

function recentLabResultSelect($obj){
  var lab_result_id = $obj.attr('doc_id');
  $('.lab_results_recent').removeClass('img-tab-active');
  $obj.addClass('img-tab-active');
  $("#all_lab_results_options").val(lab_result_id);
  openLabReport(lab_result_id);
}

function displayPreviousCommentsAtLabResults(data){
  var comments_data = [];
  $(".CommentsTextWrapper").remove();
  if(data.comments && data.comments.length>0){
    for(var i=data.comments.length-1;i>=0;i--){
      comments_data.push('<div class="col-md-12 CommentsTextWrapper"><div class="CommentsText">'+data.comments[i].comment+'</div><div class="col-md-2 TimeComment">'+moment(data.comments[i].date).format("DD-MM-YYYY, hh:mm a")+'</div></div>');
    }
  }else{
    comments_data.push('<div class="col-md-12 CommentsTextWrapper"><div class="CommentsText">No Comments are Found.</div></div>');
  }
  $(".CommentPanel").append(comments_data.join(''));
  //$("#lab_result_previous_comment").html(comments_data.join(''));
}

function openLabReport(lab_result_id) {
  $('#lab_result_comment, #lab_result_previous_comment').show();
  $(".lab_results_recent").removeClass("img-tab-active");
  $("#doctor_comment").val("");
  $("#all_lab_results_options").val(lab_result_id)
  updateRecentLabResultWithSelectedLabResult(lab_result_id);
  if(lab_result_id == "noselect"){
    $("#lab_result_image, #lab_result_pdf").hide();
    $("#lab_result_pdf").children().remove();
    $("#no_image").show();
    $("#lab_result_medical_details, #labdetails, #lab_result_comment").hide();
  }else{
    $.couch.db(db).openDoc(lab_result_id, {
      success: function(data) {
        displayPreviousCommentsAtLabResults(data);
        var lab_approve_data = [];
        lab_approve_data.push('<div class="col-lg-6">');
        data.lab_result_approval_date ? lab_approve_data.push('<div class="approve"><label>Lab result approval date :  </label><span>'+data.lab_result_approval_date+'</span></div>') : lab_approve_data.push('');
        data.lab_result_approval_time ? lab_approve_data.push('<div class="approve"><label>Lab Results approval time : </label><span>'+data.lab_result_approval_time+'</span></div>') : lab_approve_data.push('');
        lab_approve_data.push('</div>');
        data.lab_results_approved_by_dr ? lab_approve_data.push('<div class="col-lg-6" style="text-align: right; margin-top: 11px;"> <label style="width:70%;"> Lab Results approved by : </label><span>'+data.lab_results_approved_by_dr+'</span></div>') : lab_approve_data.push('');
        $('#labdetails').html(lab_approve_data.join(''));
        var url = "";
        url     = $.couch.urlPrefix +'/'+db+'/'+lab_result_id+'/'+Object.keys(data._attachments)[0];
        if (data.Format == "PDF" || data._attachments[Object.keys(data._attachments)[0]].content_type == "application/pdf") {
          $("#lab_result_pdf").attr("href", url);
          $('div.media').media({width:780, height:420});
          $("#lab_result_image").attr("src", "");
          $("#lab_result_pdf").show();
          $("#no_image, #lab_result_image").hide();
        }
        else {
          $("#lab_result_pdf").attr("href", "#");
          $("#lab_result_image").attr("src", url);
          $("#no_image, #lab_result_pdf").hide();
          $("#lab_result_image").show();
        }
        if(data.usermedhis_docid && data.selfcare_docid && data.patientnotes_docid){
          $('#labdetails').html('<div class="col-lg-6"><div class="approve"><label>Lab result approval date :  </label><span>'+data.lab_result_approval_date+'</span></div><div class="approve"><label>Lab Results approval time : </label><span>'+data.lab_result_approval_time+'</span></div></div><div class="col-lg-6" style="text-align: right; margin-top: 11px;"> <label style="width:70%;"> Lab Results approved by : </label><span>'+data.lab_results_approved_by_dr+'</span></div>');
          
          $.couch.db(db).openDoc(data.usermedhis_docid,{
            success:function(ldata){
              $.couch.db(db).openDoc(data.selfcare_docid,{
                success:function (sdata){
                  $.couch.db(db).openDoc("lab_reference_value",{
                    success:function(pdata){
                      var lab_data=[];
                      lab_data.push('<tr class="Lab-test-header"><td>Lab Tests</td><td style="width: 55%;">Sign</td><td>Information</td></tr>');
                      lab_data.push('<tr><td colspan="3" class="test-name-bkground">LIPID Profile</td></tr>');
                      for(var i=0;i<pdata.reference_values.length;i++){ 
                         for(var j=0;j<pdata.reference_values[i].Lipid_Profile.length;j++){ 
                            lab_data.push('<tr><td>'+pdata.reference_values[i].Lipid_Profile[j].field_name+'</td><td><div style="float:left;width:100%;">');
                            for(var k=0;k<pdata.reference_values[i].Lipid_Profile[j].values.length;k++){

                              pdata.reference_values[i].Lipid_Profile[j].values[k].normal ? lab_data.push('<span style="width:117px;" id="lipid'+i+'" read='+pdata.reference_values[i].Lipid_Profile[j].values[k].normal+'><b>Normal :</b>'+pdata.reference_values[i].Lipid_Profile[j].values[k].normal+'</span>'):lab_data.push('');
                              pdata.reference_values[i].Lipid_Profile[j].values[k].near_optimal ? lab_data.push('<span style="width:152px;" optimal='+pdata.reference_values[i].Lipid_Profile[j].values[k].near_optimal+'><b>Near optimal :</b>'+pdata.reference_values[i].Lipid_Profile[j].values[k].near_optimal+'</span>'):lab_data.push('');
                              pdata.reference_values[i].Lipid_Profile[j].values[k].BorderLineHigh ? lab_data.push('<span style="width:181px;"><b>BorderLineHigh :</b>'+pdata.reference_values[i].Lipid_Profile[j].values[k].BorderLineHigh+'</span>'):lab_data.push('');
                              pdata.reference_values[i].Lipid_Profile[j].values[k].high ? lab_data.push('<span style="width:117px;"><b>High :</b>'+pdata.reference_values[i].Lipid_Profile[j].values[k].high+'</span>'):lab_data.push('');
                              pdata.reference_values[i].Lipid_Profile[j].values[k].very_high ? lab_data.push('<span style="width:117px;"><b>Very High :</b>'+pdata.reference_values[i].Lipid_Profile[j].values[k].very_high+'</span>'):lab_data.push('');
                            }
                            lab_data.push('</div></td>');
                           // if()
                            if(pdata.reference_values[i].Lipid_Profile[j].field_name == 'Total Cholesterol'){
                              if((parseFloat(ldata.tc_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.tc_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.tc_reading ? ldata.tc_reading : "NA")+'</td>');
                              }else{
                                ldata.tc_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.tc_reading+'</td>') : lab_data.push('<td>NA</td>');                                
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'dHDL') {               

                              if((parseFloat(ldata.hdl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.hdl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                 lab_data.push('<td>'+(ldata.hdl_reading ? ldata.hdl_reading : "NA")+'</td>'); 
                              }else{
                                ldata.hdl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.hdl_reading+'</td>') : lab_data.push('<td>NA</td>');    
                              }
                              
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'LDL') {
                              if((parseFloat(ldata.ldl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.ldl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.ldl_reading ? ldata.ldl_reading : "NA")+'</td>');
                              }else{
                              ldata.ldl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.ldl_reading+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'TRIGLYCERIDES') {
                              if((parseFloat(ldata.tgl_reading) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.tgl_reading) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.tgl_reading ? ldata.tgl_reading : "NA")+'</td>');
                              }else{
                                ldata.tgl_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.tgl_reading+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'VLDL') {
                               if((parseFloat(ldata.vldl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.vldl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.vldl ? ldata.vldl : "NA")+'</td>');
                              }else{
                                 ldata.vldl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.vldl+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'CHOL/dHDL') {
                               if((parseFloat(ldata.chol_dhdl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.chol_dhdl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.chol_dhdl ? ldata.chol_dhdl : "NA")+'</td>');
                              }else{
                                 ldata.chol_dhdl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.chol_dhdl+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'dLDL/dHDL') {
                               if((parseFloat(ldata.dldl_dhdl) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.dldl_dhdl) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.dldl_dhdl ? ldata.dldl_dhdl : "NA")+'</td>');
                              }else{
                                 ldata.dldl_dhdl ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.dldl_dhdl+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'TOTAL LIPIDS') {
                               if((parseFloat(ldata.total_lipids) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.total_lipids) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.total_lipids ? ldata.total_lipids : "NA")+'</td>');
                              }else{
                                 ldata.total_lipids ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.total_lipids+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else if (pdata.reference_values[i].Lipid_Profile[j].field_name == 'DirectLDL') {
                               if((parseFloat(ldata.directL_dL) > parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].start)) && (parseFloat(ldata.directL_dL) < parseFloat(pdata.reference_values[i].Lipid_Profile[j].ranges[0].end))){
                                lab_data.push('<td>'+(ldata.directL_dL ? ldata.directL_dL : "NA")+'</td>');
                              }else{
                                 ldata.directL_dL ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.directL_dL+'</td>') : lab_data.push('<td>NA</td>');   
                              }
                            }else{
                              lab_data.push('<td>NA</td>');
                            }
                          }
                        lab_data.push('</tr>');
                        lab_data.push('<tr><td colspan="3" class="test-name-bkground">Glucose Test</td></tr>');
                      
                         for(var j=0;j<pdata.reference_values[i].Glucose_Test.length;j++){ 
                          if(pdata.reference_values[i].Glucose_Test[j].field_name == 'Random Blood Sugar'){
                            lab_data.push('<tr><td>'+pdata.reference_values[i].Glucose_Test[j].field_name+'</td><td><div>');
                             for(var k=0;k<pdata.reference_values[i].Glucose_Test[j].values.length;k++){
                               pdata.reference_values[i].Glucose_Test[j].values[k].normal ? lab_data.push('<span read='+pdata.reference_values[i].Glucose_Test[j].values[k].normal+' style="width: 112px;"><b>Normal : </b>'+pdata.reference_values[i].Glucose_Test[j].values[k].normal+'</span>') : lab_data.push('');
                               pdata.reference_values[i].Glucose_Test[j].values[k].Pre_Diabetic ? lab_data.push('<span style="width:130px;"><b>Pre Diabetic :</b>'+pdata.reference_values[i].Glucose_Test[j].values[k].Pre_Diabetic+'</span>'): lab_data.push('');
                               pdata.reference_values[i].Glucose_Test[j].values[k].Diabetic ? 
                               lab_data.push('<span><b>Diabetic :</b> '+pdata.reference_values[i].Glucose_Test[j].values[k].Diabetic+'</span>'): lab_data.push('');
                             }
                             lab_data.push('</div></td>');
                             if (pdata.reference_values[i].Glucose_Test[j].field_name == 'Random Blood Sugar') {
                               if((parseFloat(sdata.Fasting_Glucose) > parseFloat(pdata.reference_values[i].Glucose_Test[j].ranges[0].start)) && (parseFloat(sdata.Fasting_Glucose) < parseFloat(pdata.reference_values[i].Glucose_Test[j].ranges[0].end))){
                                 lab_data.push('<td>'+(sdata.Fasting_Glucose ? sdata.Fasting_Glucose : "NA")+'</td>');
                               }else{
                                 sdata.Fasting_Glucose ? lab_data.push('<td style="background:#C43227;color:#fff;">'+sdata.Fasting_Glucose+'</td>') : lab_data.push('<td>NA</td>');  
                               }
                             }else {
                               lab_data.push('<td>NA</td>');
                             }
                          }
                        }
                        lab_data.push('</tr>');
                        lab_data.push('<tr><td colspan="3" class="test-name-bkground">Blood Pressure</td></tr>');
                        for(var j=0;j<pdata.reference_values[i].Blood_Pressure.length;j++){ 
                          lab_data.push('<tr><td>'+pdata.reference_values[i].Blood_Pressure[j].field_name+'</td><td><div style="float: left; width: 100%;">');
                          for(var k=0;k<pdata.reference_values[i].Blood_Pressure[j].values.length;k++){
                            pdata.reference_values[i].Blood_Pressure[j].values[k].normal ? lab_data.push('<span style="width:134px;"><b>Normal :</b>'+pdata.reference_values[i].Blood_Pressure[j].values[k].normal+'</span>'):  lab_data.push('');
                            pdata.reference_values[i].Blood_Pressure[j].values[k].Prehypertension ? lab_data.push('<span style="width: 211px;"><b>Prehypertension :</b>'+pdata.reference_values[i].Blood_Pressure[j].values[k].Prehypertension+'</span>'):  lab_data.push('');
                            pdata.reference_values[i].Blood_Pressure[k].values[k].High_BP_Stage1 ? lab_data.push('<span style="width:209px;"><b>High BP-Stage1 :</b> '+pdata.reference_values[i].Blood_Pressure[k].values[k].High_BP_Stage1+'</span>'):  lab_data.push('');
                            pdata.reference_values[i].Blood_Pressure[j].values[k].High_BP_Stage2 ? lab_data.push('<span style="width:100%;"><b>High BP-Stage2 :</b> '+pdata.reference_values[i].Blood_Pressure[j].values[k].High_BP_Stage2+'</sapn>'):  lab_data.push('');
                            pdata.reference_values[i].Blood_Pressure[j].values[k].Low_BP ? lab_data.push('<span style="width:132px;"><b>Low BP :</b> '+pdata.reference_values[i].Blood_Pressure[j].values[k].Low_BP+'</span>'):  lab_data.push('');
                            pdata.reference_values[i].Blood_Pressure[j].values[k].Emergency ? lab_data.push('<span style="width:167px;"><b>Emergency : </b> '+pdata.reference_values[i].Blood_Pressure[j].values[k].Emergency+'</span>'):  lab_data.push('');
                          }
                          lab_data.push('</div></td>');
                          if (pdata.reference_values[i].Blood_Pressure[j].field_name == 'Systolic Blood Pressure') {
                            if((parseFloat(ldata.sbp_reading) > parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].start)) && (parseFloat(ldata.sbp_reading) < parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].end))){
                              lab_data.push('<td>'+ldata.sbp_reading ? ldata.sbp_reading : "NA"+'</td>');
                            }else{
                               ldata.sbp_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.sbp_reading+'</td>') : lab_data.push('<td>NA</td>'); 
                            }
                          }else if (pdata.reference_values[i].Blood_Pressure[j].field_name == 'Diastolic Blood Pressure') {
                            if((parseFloat(ldata.dbp_reading) > parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].start)) && (parseFloat(ldata.dbp_reading) < parseFloat(pdata.reference_values[i].Blood_Pressure[j].ranges[0].end))){
                              lab_data.push('<td>'+ldata.dbp_reading ? ldata.dbp_reading : "NA"+'</td>');
                            }else{
                               ldata.dbp_reading ? lab_data.push('<td style="background:#C43227;color:#fff;">'+ldata.dbp_reading+'</td>') : lab_data.push('<td>NA</td>'); 
                            }
                          }else {
                            lab_data.push('<td>NA</td>');
                          }
                        }
                        lab_data.push('</tr>');
                        lab_data.push('<tr><td class="test-name-bkground" colspan="3">Heart Health</td></tr>');
                        lab_data.push('<tr><td>SPO2(%)</td><td>--</td><td>'+sdata.O2+'</td></tr>');
                        lab_data.push('<tr><td>Heart Rate</td><td>--</td><td>'+sdata.HeartRate+'</td></tr>');
                      }
                      $("#lab_result_medical_details tbody").html(lab_data.join(''));
                      $("#lab_result_medical_details, #labdetails").show();                    
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
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }
}

function newinventoryModel(type, message, id)
{
   if($(".alert-test").length) {
    return;
  }
  else {
    $("#" + id).find(".alert-msg-box").append($("<div class='alert-test alert-"+type+" fade in' data-alert><p style = 'color:red'> " + message + " </p></div>"));
    $(".alert-test").delay(6000).fadeOut("slow", function () { $(this).remove(); });  
  }
}

function saveUserPic() {
  var file = $("#userpic_edit_pic").prop('files');
  
  if (!file[0]) {
    newAlertForModal('danger', 'Please select the image first.', 'userpic_edit_modal');
    $("#userpic_edit_save").removeAttr("disabled");
  }
  else {
    if (file[0].type.substring(0,5) != "image") {
      newAlertForModal('danger', 'Not a valid file', 'userpic_edit_modal');
      $("#userpic_edit_save").removeAttr("disabled");
    }
    else if (Number(file[0].size) > 5242880) {
      newAlertForModal('danger', 'Image size can not be larger than 5mb', 'userpic_edit_modal');
      $("#userpic_edit_save").removeAttr("disabled");
    }
    else {
      $("#userpic_edit_save").addClass("ajax-loader-large");
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
        success:function(data){
          var update_pic_date;
          if(data.rows.length > 0){
            update_pic_date = data.rows[0].value;
            delete update_pic_date._attachments;
            $.couch.db(personal_details_db).saveDoc(update_pic_date,{
              success:function(udata){
                $('#profile_pic_update_id').val(udata.id);
                $('#profile_pic_update_rev').val(udata.rev);
                $.couch.db(personal_details_db).openDoc($('#profile_pic_update_id').val(),{
                    success:function(data){
                      if(data.imgblob){
                        var newdata = data; 
                        delete newdata.imgblob;
                        $.couch.db(personal_details_db).saveDoc(newdata,{
                          success:function(mdata){
                            $("#userpic_edit_save").removeClass("ajax-loader-large");
                            $("#label_pic_upload").css("visibility","visible");
                            $("#userpic_edit_modal").modal("hide");
                            newAlert('success', 'Profile pic Updated Successfully !');
                            $('html, body').animate({scrollTop: 0}, 'slow');
                            $("#userpic_edit_save").removeAttr("disabled");
                            uploadProfilePicDataURIAsFile($("#userpic_edit_pic").get(0).files[0],personal_details_db,mdata.id,mdata.rev,$("#userpic_edit_pic").val(),userinfo.user_id,"File");
                              
                          },
                          error:function(data,error,reason){
                            newAlert("danger",reason);
                            $("html, body").animate({scrollTop: 0}, 'slow');
                            return false;
                          }
                        });   
                      }else{
                        $("#userpic_edit_save").removeClass("ajax-loader-large");
                        $("#label_pic_upload").css("visibility","visible");
                        $("#userpic_edit_modal").modal("hide");
                        newAlert('success', 'Profile pic Updated Successfully !');
                        $('html, body').animate({scrollTop: 0}, 'slow');
                        $("#userpic_edit_save").removeAttr("disabled");
                        uploadProfilePicDataURIAsFile($("#userpic_edit_pic").get(0).files[0],personal_details_db,udata.id,udata.rev,$("#userpic_edit_pic").val(),userinfo.user_id,"File");
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
        },
        error:function(data,error,reason){
          newAlertForModal('danger', reason, 'userpic_edit_modal');
          $("#userpic_edit_save").removeAttr("disabled");
        },
        key:userinfo.user_id
      });
    }
  }
}

function getUserInfoPic(){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success: function(data) {
      clearUserProfilePicUpdate();
      getUserpicAndInfo(data);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: userinfo.user_id
  });
}


function saveUserPicFromWebcam(){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(data){
      var update_pic_date;
      if(data.rows.length > 0){
        update_pic_date = data.rows[0].value;
        if(update_pic_date._attachments){
          delete update_pic_date._attachments; 
        }else if(update_pic_date.imgblob){
          delete update_pic_date.imgblob; 
        }
        $.couch.db(personal_details_db).saveDoc(update_pic_date,{
          success:function(udata){
            $('#profile_pic_update_id').val(udata.id);
            $('#profile_pic_update_rev').val(udata.rev);
            $("#userpic_edit_save").removeClass("ajax-loader-large");
            $("#label_pic_upload").css("visibility","visible");
            $("#userpic_edit_modal").modal("hide");
            var fname = "upload_"+moment().format("YYYY-MM-DD_hh:mm");
            uploadProfilePicDataURIAsFile($("#my_camera_preview").find("img")[0],personal_details_db,udata.id,udata.rev,fname,userinfo.user_id,"WebFile");

            newAlert('success', 'Profile pic Updated Successfully !');
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#userpic_edit_save").removeAttr("disabled");
          },
          error:function(data,error,reason){
           newAlertForModal('danger', reason, 'userpic_edit_modal'); 
          }
        });
      }
    },
    error:function(data,error,reason){
      newAlertForModal('danger', reason, 'userpic_edit_modal');
      $("#userpic_edit_save").removeAttr("disabled");
    },
    key: userinfo.user_id
  });
}

function uploadProfilePicDataURIAsFile(img,db_name,doc_id,doc_rev,filename,patient_user_id,file) {
  if(file =="File") {
    var form = new FormData(),
    request = new XMLHttpRequest();
    form.append("_id",doc_id);
    form.append("_rev",doc_rev);
    form.append("db",db_name);
    form.append("_attachments", img, filename);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 201) {
        getUserInfoPic();
      }
    };
    // request.open("POST", "/"+db_name+"/"+doc_id, true);
    request.open("POST", "/api/upload", true);
    request.send(form);
  }else if(file =="WebFile") {
    var canvas = document.createElement("canvas");
    //var canvas = document.getElementById("upload_file_camera").querySelectorAll("canvas");
    canvas.width  = "800";
    canvas.height = "600";
    var ctx       = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0,600,600);
    canvas.toBlob(function(blob) {
      var form    = new FormData(),
          request = new XMLHttpRequest();
      form.append("_rev",doc_rev);
      form.append("_id",doc_id);
      form.append("_attachments", blob, filename);
      form.append("db",db_name);
      request.onreadystatechange = function() {
        console.log(request);
        if (request.readyState == 4 && request.status == 201) {
          getUserInfoPic(); 
        }
      };
      // request.open("POST", "/"+db_name+"/"+doc_id, true);
      request.open("POST", "/api/upload", true);
      request.send(form);
    }, "image/png");
  }
}



function deleteHalfUpdatedProfilePic() {
  var id  = $('#profile_pic_update_id').val();
  var rev = $('#profile_pic_update_rev').val();

  if (id && rev) {
    var doc = {
      _id: id,
      _rev: rev
    };
    
    $.couch.db(db).removeDoc(doc, {
      success: function(data) {
        $("#userpic_edit_save").removeClass("ajax-loader-large");
        $("#label_pic_upload").css("visibility","visible");
        $("#userpic_edit_save").removeAttr("disabled");
        clearUserProfilePicUpdate();
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    })
  }
  else {
    clearUserProfilePicUpdate();
  }
}

function clearUserProfilePicUpdate() {
  $("#userpic_edit_pic").val("");
  $("#profile_pic_update_id").val("");
  $("#profile_pic_update_rev").val("");
  $("#my_camera_preview").html("");
}

function openAddDocumentModal(){
  $('#add_document_modal').modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  searchPatientByNameAutocompleter("d_patient_name",autocompleterSelectEventForSubscriberListOnAddDocument,false,pd_data._id,pd_data.dhp_code);
  searchPatientByNameAutocompleter("d_patient_dhpid",autocompleterSelectForSubscriberByPatientDHPListOnAddDocument,false,pd_data._id,pd_data.dhp_code);
  searchDHPDoctorsList("d_doctor_name",autocompleterSelectForDoctorsListOnAddDocument,pd_data.dhp_code);
}

function createSaveDocument() {
  if(validateSaveDocument()){
    var d = new Date();
    $("#save_document").addClass("ajax-loader-large");
    $("#document_save_label").css("visibility","hidden");

    $(".add-more-documents-parent").each(function(i){
      var document_doc = {
        doctype:           "document",
        user_id:           $("#d_patient_id").val(),
        patient_name:      $("#d_patient_name").val(),
        doctor_id:         $("#d_doctor_id").val(),
        doctor_name:       $("#d_doctor_name").val(),
        status:            "Review",
        insert_ts:         d,
        document_type:     $(this).find(".d-type").val(),
        document_name:     $(this).find(".d-name").val(),
        dhp_code:          pd_data.dhp_code        
      };
      if($(this).find(".d-type").val() == "Lab-Results" || $(this).find(".d-type").val() == "Imaging-Results"){
        document_doc.document_category = $(this).find(".d-category").val(); 
      }

      var task_doc = {
        doctor_id:      pd_data._id,
        doctor_name:    pd_data.first_name +" "+ pd_data.last_name,
        patient_name:   $("#d_patient_name").val(),
        doctype:        "task",
        insert_ts:      d,
        user_id:        $("#d_patient_id").val(),
        dhp_code:       pd_data.dhp_code,
        effective_date: moment(d).format("YYYY-MM-DD"),
        priority:       $("#document_task_priority").val(),
        comments:       $("#document_task_comment").val(),
        due_date:       $("#document_task_due_date").val(),
        notify:         false
      };

      if($("#d_doctor_id").val().trim() != pd_data._id){
        task_doc.status = "Reassign";
        task_doc.reassign_doctor = [{
          "id":   $("#d_doctor_id").val(),
          "name": $("#d_doctor_name").val()
        }]
      }else{
        task_doc.status = "Review";
      }
      if ($(this).find(".d-type").val() == "Lab-Results")
        task_doc['task'] = "eLabResults";
      else if ($(this).find(".d-type").val() == "Imaging-Results")
        task_doc['task'] = "eImagingResults";
      else 
        task_doc['task'] = "Other";
       saveDocument(document_doc,task_doc,$(this).find(".uploaded-file"));   
    });
  }else{
    $("#save_document").removeAttr("disabled");
    return false;
  }
}

function saveDocument(document_doc,task_doc,$form){
  $.couch.db(db).saveDoc(document_doc, {
    success: function(data) {
      $("#save_document").data("uploadDocsId").push(data.id);
      $("#save_document").data("uploadDocsRev").push(data.rev);
      $form.find(".upload-doc-id").val(data.id);
      $form.find(".upload-doc-rev").val(data.rev);

      task_doc.document_id = data.id;

      $.couch.db(db).saveDoc(task_doc, {
        success: function(tdata) {
          $("#save_document").data("uploadTaskId").push(data.id);
          $("#save_document").data("uploadTaskRev").push(data.rev);
          $form.ajaxSubmit({
            // Submit the form with the attachment
            url: "/"+ db +"/"+ data.id,
            success: function(response) {
              if(document_doc.document_type == "Lab-Results"){
                var cron_record = {
                  operation_case: "26",
                  doctype:        "cronRecords",
                  processed:      "No",
                  document_id:    data.id,
                  task_id:        tdata.id
                }
                $.couch.db(db).saveDoc(cron_record,{
                  success:function(data){
                    if($("#add_document_modal").hasClass('in')){
                      var id_index = $("#save_document").data("uploadDocsId").indexOf(data.id);
                      $("#save_document").data("uploadDocsId").splice(id_index,1);

                      var rev_index = $("#save_document").data("uploadDocsRev").indexOf(data.rev);
                      $("#save_document").data("uploadDocsRev").splice(rev_index,1);

                      var task_index = $("#save_document").data("uploadTaskId").indexOf(tdata.id);
                      $("#save_document").data("uploadTaskId").splice(task_index,1);

                      var task_rev_index = $("#save_document").data("uploadTaskRev").indexOf(tdata.rev);
                      $("#save_document").data("uploadTaskRev").splice(task_rev_index,1);

                      if($("#save_document").data("uploadDocsId").length == 0){
                        successDocumentsMessage();
                      }  
                    }
                  },
                  error:function(data,error,reason){
                    newAlertForModal('danger', reason, 'add_document_modal');
                  }
                });  
              }else{
                if($("#add_document_modal").hasClass('in')){
                  var id_index = $("#save_document").data("uploadDocsId").indexOf(data.id);
                  $("#save_document").data("uploadDocsId").splice(id_index,1);

                  var rev_index = $("#save_document").data("uploadDocsRev").indexOf(data.rev);
                  $("#save_document").data("uploadDocsRev").splice(rev_index,1);

                  var task_index = $("#save_document").data("uploadTaskId").indexOf(tdata.id);
                  $("#save_document").data("uploadTaskId").splice(task_index,1);

                  var task_rev_index = $("#save_document").data("uploadTaskRev").indexOf(tdata.rev);
                  $("#save_document").data("uploadTaskRev").splice(task_rev_index,1);

                  if($("#save_document").data("uploadDocsId").length == 0){
                    successDocumentsMessage();
                  }  
                }
              }
            },
            error: function(data, error, reason) {
              $("#save_document").removeAttr("disabled");
              $("#save_document").removeClass("ajax-loader-large");
              $("#document_save_label").css("visibility","visible");
              newAlertForModal('danger', reason, 'add_document_modal');
            }
          });
        },
        error: function(data,error,reason) {
          newAlertForModal('danger', reason, 'add_document_modal');
          $("#save_document").removeAttr("disabled");
        }
      });
    },
    error: function(data, error, reason) {
      $("#save_document").removeAttr("disabled");
      $("#save_document").removeClass("ajax-loader-large");
      $("#document_save_label").css("visibility","visible");
      newAlertForModal('danger', reason, 'add_document_modal');
    }
  })  
}

function successDocumentsMessage(){
  getDocuments();
  getDueTasks();
  $("#save_document").removeClass("ajax-loader-large");
  $("#document_save_label").css("visibility","visible");
  $("#add_document_modal").modal("hide");
  newAlert('success', 'Saved successfully !');
  $('html, body').animate({scrollTop: 0}, 'slow');
}

function deleteHalfSavedDoc() {
  if($("#save_document").data("uploadDocsId").length == 0){
    return true;
  }else{
    var len = $("#save_document").data("uploadDocsId").length;
    var docs = [];
    var task_docs = [];
    
    for(var i=0;i<len;i++){
      docs.push({
        _id:  $("#save_document").data("uploadDocsId")[i],
        _rev: $("#save_document").data("uploadDocsRev")[i]
      });
      task_docs.push({
        _id: $("#save_document").data("uploadTaskId")[i],
        _rev: $("#save_document").data("uploadTaskRev")[i]
      });
    }

    $.couch.db(db).bulkRemove({"docs": docs}, {
      success: function(data) {
        $.couch.db(db).bulkRemove({"docs": task_docs}, {
          success: function(data) {
            $("#save_document").removeAttr("disabled");
            $("#save_document").removeClass("ajax-loader-large");
            $("#document_save_label").css("visibility","visible");
            getDocuments();
            getDueTasks();
          },
          error: function(status) {
            newAlert("danger",reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            return false;
          }
        });        
      },
      error: function(status) {
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }
}  

function clearDocumentForm() {
  $("#d_patient_name").val("");
  $("#d_patient_id").val("");
  $("#d_doctor_name").val("");
  $("#d_doctor_id").val("");
  $(".delete-document").trigger("click");
  $(".d-name").val("");
  $(".d-type").val("Lab-Results");
  $(".document-userfile").val("");
  $(".upload-doc-id").val("");
  $(".upload-doc-rev").val("");
}

function getDocuments() {
  $.couch.db(db).view("tamsa/getDocuments", {
   success: function(data) {
    if(data.rows.length > 0){
      paginationConfiguration(data,"documents_pagination",10,displayDocuments);
    }else{
      var document_table = [];
      document_table.push('<tr><td>No Documents are Found.</td></tr>');
      $("#document_table tbody").html(document_table.join(''));
    }
   },
   error:function(data,error,reason){
     newAlert("danger",reason);
     $("html, body").animate({scrollTop: 0}, 'slow');
     return false;
   },
   startkey: [pd_data._id],
   endkey: [pd_data._id, {}, {}],
   include_docs: true
  });
}

function displayDocuments(start,end,data){
  var document_table = [];
  for (var i = start; i < end; i++) {
    if (data.rows[i].key[2] == "0") {
      document_table.push('<tr><td>'+data.rows[i].doc.document_name+'</td><td>'+data.rows[i].doc.document_type+'</td><td>'+data.rows[i].doc.patient_name+'</td><td>'+data.rows[i].doc.doctor_name+'</td><td>'+data.rows[i].doc.insert_ts.substring(0, 10)+'</td><td align="center" id="task_'+data.rows[i].id+'""></td><td><a class= "dwnld-hover" href="'+$.couch.urlPrefix +'/'+db+'/'+data.rows[i].id+'/'+Object.keys(data.rows[i].doc._attachments)[0]+'" target="blank" download><span doc_id='+data.rows[i].id+' class="glyphicon glyphicon-download-alt"></span></a></td></tr>');
    }
  };
  $("#document_table tbody").html(document_table.join(''));
  getDocumentTasks();
}

function getDocumentTasks() {
  $.couch.db(db).view("tamsa/getDocumentTasks", {
   success: function(data1) {
    for (var i = data1.rows.length -1; i >= 0; i--) {
      var document_table_tasks = "";
      document_table_tasks += '<select user_id="'+data1.rows[i].doc.user_id+'" data-main-val ="'+data1.rows[i].key[1]+'" type="text" class="form-control task_list_row" index="'+data1.rows[i].id+'"><option ';

      if (data1.rows[i].key[1] == "Review") {
        document_table_tasks += 'selected';
      }
      document_table_tasks += ' value="Review">Under Review</option><option ';

      if (data1.rows[i].key[1] == "Completed") {
        document_table_tasks += 'selected'; 
      }
      document_table_tasks += ' >Completed</option>';


      if (data1.rows[i].key[1] == "Reassign") {
        document_table_tasks += '<option selected >Reassign</option></select><br><strong>To:</strong><br>'+data1.rows[i].doc.reassign_doctor[data1.rows[i].key[3]].name+'</td></tr>';
      }
      else {
        document_table_tasks += '<option>Reassign</option></select></td></tr>';
      }

      $("#task_"+data1.rows[i].doc.document_id).html(document_table_tasks);
    } 
   },
   error:function(data,error,reason){
     newAlert("danger",reason);
     $("html, body").animate({scrollTop: 0}, 'slow');
     return false;
   },
   startkey: [pd_data._id],
   endkey: [pd_data._id, {}, {}, {}],
   include_docs: true
  });
}

function resetPasswordSubUser() {
  var pwd = $("#rp_new_password").val();
  var nospace = /\s/g;
  
  if (pwd.trim().length == 0) {
    newAlertForModal('danger', 'Password can not be blank','password_reset_user_modal');
    $("#rp_new_password").focus();
  }
  else if((pwd.match(nospace))){
    newAlertForModal('danger', 'Password can not contain spaces.','password_reset_user_modal');
    $("#rp_new_password").focus();
  }
  else if($("#rp_new_password").val() !== $("#rp_confirm_password").val()) {
    newAlertForModal('danger', 'Password does not match.','password_reset_user_modal');
    $("#rp_new_password").focus();
  }
  else{
    var reset_password = {
      user_id:      $("#rp_sub_user_save").attr("index"),
      new_password: $("#rp_new_password").val(),
      operation_case: "16",
      doctype:        "cronRecords",
      processed:      "No"
    }

    $.couch.db(db).saveDoc(reset_password, {
      success: function(data) {
        $("#password_reset_user_modal").modal("hide");
        $("#rp_new_password").val("");
        $("#rp_confirm_password").val("")
        newAlert('success', 'Saved successfully !');
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      error: function(data, error, reason) {
        newAlertForModal('success', reason, 'password_reset_user_modal');
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    })
  }

}

function getAutoCompleteImages(uvalue,source) {
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
    success: function(data2) {
      if (data2.rows.length > 0) {
        $("#phone_"+uvalue).html(data2.rows[0].value.phone);
        if(data2.rows[0].value._attachments){
          $("#"+source+uvalue).attr("src", $.couch.urlPrefix+'/'+personal_details_db+'/'+data2.rows[0].id+'/'+Object.keys(data2.rows[0].value._attachments)[0]);
        }else if(data2.rows[0].value.imgblob){
          $("#"+source+uvalue).attr("src",data2.rows[0].value.imgblob);
        }else{
          
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: uvalue,
    limit: 1
  });
}

function addPadf(operation,chart) {
  if (operation == "Procedures") {
    if (typeof(userinfo_medical.Procedure) == "string") {
      if($("#add_padf_item").val() != null){
        $("#add_padf").attr("disabled","disabled");
        userinfo_medical.Procedure = [userinfo_medical.Procedure, $("#add_padf_item").val()];
        saveAllPadf(userinfo_medical); 
      }else{
        newAlertForModal("danger", "Procedure can not be empty.",'add_padf_modal');
        $("#add_padf_item").focus();
      }

    }
    else {
      if($("#add_padf_item").val() != null){
        $("#add_padf").attr("disabled","disabled");
          userinfo_medical.Procedure = $("#add_padf_item").val();
          saveAllPadf(userinfo_medical);
      }else{
        newAlertForModal("danger", "Procedure can not be empty.",'add_padf_modal');
        $("#add_padf_item").focus();
      }
      
    }
  }
  else if (operation == "Allergies") {
    var bulksave = saveAllergies();
    if(bulksave.length != 0){
      $("#add_padf").attr("disabled","disabled");
      saveAllPadf(bulksave,chart);
    }else{
      newAlertForModal("danger", "Allergies can not be empty.",'add_padf_modal');
    }
    
  }
  else if (operation == "Diagnosis") {
    if($("#add_padf_item").val() != null){
      $("#add_padf").attr("disabled","disabled");
      userinfo_medical.Condition = $("#add_padf_item").val();
      saveAllPadf(userinfo_medical); 
    }else{
      newAlertForModal("danger", "Diagnoses can not be empty.",'add_padf_modal');
      $("#add_padf_item").focus();
    }
  }else if(operation == ""){

  }
}

function saveAllPadf(userinfo_medical,chart){
  $.couch.db(db).saveDoc(userinfo_medical, {
    success: function(data) {
      $("#add_padf_modal").modal("hide");
      console.log(chart);
      if(chart){
      }else{
        getPersonalDetailsMedicalHistory();
      }
      $("#add_padf_item").val("");
      $("#add_padf").removeAttr("disabled");
      $(".close").trigger("click");
      newAlert('success', 'Saved successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    error: function(status) {
      $("#add_padf").removeAttr("disabled");
      $(".close").trigger("click");
      newAlert('success', 'Saved successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function addOneNewAllergies() {
  $(".save-allergies:first").clone().appendTo("#issu_add_item_parent");
  $(".save-allergies:last").append('<span id = "remove_add_new_allergiess" class="glyphicon glyphicon-minus theme-color" style = "margin-left:19px;margin-top:11px;"></span>').css("margin-top","10px");
}

function errorOnExistingFMHAtMedicalHisptry(save_btn_id,modal_id) {
  newAlertForModal('danger', 'Medical History Already exist.', modal_id);
  $("#"+save_btn_id).removeAttr("disabled");
  return false;
}

function successOnExistingFMHAtMedicalHisptry() {
  $("#add_fmh_modal").modal("hide");
  $('html, body').animate({scrollTop: 0}, 'slow');
  newAlert('success', 'Saved successfully !');
  $("#fmh_relation").val("");
  $("#fmh_condition").val("");
  getPersonalDetailsMedicalHistory();
  $("#add_fmh").removeAttr("disabled");
}

function errorOnExistingFMH(action) {
  if(action == "medical_history"){
    errorOnExistingFMHAtMedicalHisptry("add_fmh","add_fmh_modal");  
  }
}

function successOnSavingFMH(action) {
  if(action == "medical_history"){
    successOnExistingFMHAtMedicalHisptry("add_fmh","add_fmh_modal");  
  }
}

function saveFamilyMedicalHistory(tamsaFactories) {
  $("#add_fmh").attr("disabled","disabled");
  if (validateFamilyMedicalHistory("mh_fmh_field_parent", "fmh_relation", "fmh_condition") && verifyFMHAtChartingTemplate("mh_fmh_field_parent", "fmh_relation", "fmh_condition")) {
    tamsaFactories.saveRequestForFMH("medical_history","mh_fmh_field_parent","fmh_relation","fmh_condition");
  }else{
    $("#add_fmh").removeAttr("disabled");
  }
}

function getRelationAndCondition(data,parent,relation_id,condition_id){
  var condition;
  var rel_cond = [];
  if(data != ""){
    $("."+parent).each(function(){
      rel_cond.push({
        relation:  $(this).find("."+relation_id).val(),
        condition: $(this).find("."+condition_id).val()
      });
    });
    data.relations = rel_cond;
    return data;
  }else{
    $("."+parent).each(function(){
      rel_cond.push({
        relation:  $(this).find("."+relation_id).val(),
        condition: $(this).find("."+relation_id).val()
      });
    });  
    return rel_cond;
  }
}

function saveNSMonitoring(id){
  var $element = $("#charting_ns_details");

  if ($("#"+id).is(':checked')) {
    monitoring_doc = {
      insert_ts:    d,
      ns_device_id: $element.find(".ns_device_id").val(),
      ns_startdate: $element.find(".ns_monitor_startdate").val(),
      ns_enddate:   $element.find(".ns_monitor_enddate").val(),
      user_id:      userinfo.user_id,
      doctor_id:    pd_data._id,
      doctype:      "ns_monitor"
    };

    $.couch.db(db).view("tamsa/getNSmonitoring", {
      success: function(data) {
        if (data.rows.length == 1) {
          monitoring_doc._id  = data.rows[0].doc._id;
          monitoring_doc._rev = data.rows[0].doc._rev;
        }
        else if (data.rows.length > 1){
          monitoring_doc._id  = data.rows[0].doc._id;
          monitoring_doc._rev = data.rows[0].doc._rev;
          for (var i = 1; i < data.rows.length; i++) {
            var extra_doc = {
                _id:  data.rows[i].doc._id,
                _rev: data.rows[i].doc._rev
            };
            $.couch.db(db).removeDoc(extra_doc, {
                success: function(data) {
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                }
            }); 
          };
        }
        $.couch.db(db).saveDoc(monitoring_doc, {
          success: function(data) {
            getNSmonitoring(id);
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
      key: [pd_data._id,userinfo.user_id],
      include_docs: true
    });
  }
  else if (!$("#"+id).is(':checked')) {
    $.couch.db(db).view("tamsa/getNSmonitoring", {
      success: function(data) {
        if (data.rows.length > 0){
          for (var i = 0; i < data.rows.length; i++) {
            var extra_doc = {
                _id:  data.rows[i].doc._id,
                _rev: data.rows[i].doc._rev
            };
            $.couch.db(db).removeDoc(extra_doc, {
                success: function(data) {
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                }
            }); 
          };
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key: [pd_data._id,userinfo.user_id],
      include_docs: true
    });
  }
}

function getNSmonitoring(id) {
  $.couch.db(db).view("tamsa/getNSmonitoring", {
    success: function(data) {
      if(id == "ns_monitor") $element = $("#ns_details")
      else $element = $("#charting_ns_details")
      if (data.rows.length > 0) {
        var today = new Date();
        if(isGte(today.getFullYear()+"-"+ (today.getMonth()+Number(1)) +"-"+ today.getDate(), data.rows[0].doc.ns_enddate)) {
          var doc = {
            _id: data.rows[0].doc._id,
            _rev: data.rows[0].doc._rev
          };
          
          $.couch.db(db).removeDoc(doc, {
            success: function(data) {
            },
            error:function(data,error,reason){
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          });

          $("#"+id).attr('checked', false);
          $element.hide();
          $("#"+id).attr("index", "");
          $("#"+id).attr("rev", "");
          $element.find(".ns_device_id").val("");
          $element.find(".ns_monitor_startdate").val("");
          $element.find(".ns_monitor_enddate").val("");
        }
        else {
          $("#"+id).attr("index", data.rows[0].doc._id);
          $("#"+id).attr("rev", data.rows[0].doc._rev);
          $("#"+id).attr('checked', true);
          $element.find(".ns_device_id").val(data.rows[0].doc.ns_device_id);
          $element.find(".ns_monitor_startdate").val(data.rows[0].doc.ns_startdate);
          $element.find(".ns_monitor_enddate").val(data.rows[0].doc.ns_enddate);
          $element.show();
        }
      }
      else {
        $("#"+id).attr('checked', false);
        $element.hide();
        $("#"+id).attr("index", "");
        $("#"+id).attr("rev", "");
        $element.find(".ns_device_id").val("");
        $element.find(".ns_monitor_startdate").val("");
        $element.find(".ns_monitor_enddate").val("");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key: [pd_data._id,userinfo.user_id],
    include_docs: true
  });
}

function addByDhpId() {
  $.couch.db(personal_details_db).view("tamsa/getPatientByPatientDhpId", {
    success: function(data) {
      if (data.rows.length > 0) {
        var physicians      = $("#physicians_by_dhp_id").val();
        var d               = new Date();
        var subscriber_docs = [];
        var conditions      = [];
        $.couch.db(db).view("tamsa/getExistingSubscribers", {
          success:function(exdata){
            var exist = "";
            if (exdata.rows.length > 0) {
              for (var i=0;i< physicians.length;i++) {
                for(var j=0;j<exdata.rows.length;j++) {
                  if(physicians[i] == exdata.rows[j].value ){
                    exist = "yes";
                    break;
                  }else{
                    exist = physicians[i];
                  }
                }
                if(exist != "yes" ){
                  var subscriber_doc = {
                    Designation:     "",
                    Email:           $("#physicians_by_dhp_id option").filter("option[value='"+exist+"']").data("email"),
                    Name:            $("#physicians_by_dhp_id option").filter("option[value='"+exist+"']").text(),
                    Phone:           $("#physicians_by_dhp_id option").filter("option[value='"+exist+"']").data("phone"),
                    Relation:        "Doctor",
                    "Select Report": "All conditions",
                    doctor_id:       exist,
                    doctype:         "Subscriber",
                    insert_ts:       d,
                    user_id:         data.rows[0].key[1],
                    User_firstname:  data.rows[0].doc.first_nm,
                    User_lastname:   data.rows[0].doc.last_nm,
                    patient_dhp_id:  $("#patient_add_dhp_id").val().trim(),
                    dhp_code:        pd_data.dhp_code,
                    frequency:       ""
                  }
                  if(pd_data.level == "Doctor"){
                    subscriber_doc.added_by = "Doctor";
                    subscriber_doc.adder_id = pd_data._id;
                    subscriber_doc.payment_status = "unpaid";
                  }else{
                    subscriber_doc.added_by = "Front_Desk";
                    subscriber_doc.adder_id = pd_data._id;
                    subscriber_doc.payment_status = "unpaid";
                  }
                  if($("#user_by_dhp_critical").is(":checked")){
                    subscriber_doc.report_freq = $("#user_by_dhp_alerts_option").val();
                  }
                  if($("#user_by_dhp_reports").is(":checked")){
                    subscriber_doc.alerts = $("#user_by_dhp_alerts_option").val();
                  }
                  subscriber_docs.push(subscriber_doc);
                }
              }
              if(subscriber_docs.length > 0){
                $.couch.db(db).bulkSave({"docs": subscriber_docs}, {
                  success: function(data) {
                    newAlert("success", "Patient has been successfully subscribed to selected doctors.");
                    $("#patient_add_dhp_id").val("");
                    getTotalNumberOfPatients();
                  },
                  error:function(data,error,reason){
                    newAlert("danger",reason);
                    $("html, body").animate({scrollTop: 0}, 'slow');
                    return false;
                  }
                });
              }else{
                newAlert('danger','Patient is already subscribed to selected doctors.');
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
              }
            }else{
              for (var i=0;i< physicians.length;i++) {
                var subscriber_doc = {
                  Designation:     "",
                  Email:           $("#physicians_by_dhp_id option").filter("option[value='"+physicians[i]+"']").data("email"),
                  Name:            $("#physicians_by_dhp_id option").filter("option[value='"+physicians[i]+"']").text(),
                  Phone:           $("#physicians_by_dhp_id option").filter("option[value='"+physicians[i]+"']").data("phone"),
                  Relation:        "Doctor",
                  "Select Report": "All conditions",
                  doctor_id:       physicians[i],
                  doctype:         "Subscriber",
                  insert_ts:       d,
                  user_id:         data.rows[0].key[1],
                  User_firstname:  data.rows[0].doc.first_nm,
                  User_lastname:   data.rows[0].doc.last_nm,
                  patient_dhp_id:  $("#patient_add_dhp_id").val().trim(),
                  dhp_code:        pd_data.dhp_code,
                  frequency:       ""
                }
                if(pd_data.level == "Doctor"){
                  subscriber_doc.added_by = "Doctor";
                  subscriber_doc.adder_id = pd_data._id;
                  subscriber_doc.payment_status = "unpaid";
                }
                else{
                  subscriber_doc.added_by = "Front_Desk";
                  subscriber_doc.adder_id = pd_data._id;
                  subscriber_doc.payment_status = "unpaid";
                }
                if($("#user_by_dhp_critical").is(":checked")){
                  subscriber_doc.report_freq = $("#user_by_dhp_alerts_option").val();
                }
                if($("#user_by_dhp_reports").is(":checked")){
                  subscriber_doc.alerts = $("#user_by_dhp_alerts_option").val();
                }
                subscriber_docs.push(subscriber_doc);
              }
              $.couch.db(db).bulkSave({"docs": subscriber_docs}, {
                success: function(data) {
                  newAlert("success", "Patient has been successfully subscribed to selected doctors.");
                  $("#patient_add_dhp_id").val("");
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
          key:data.rows[0].key[1] // user_id
        });

        if($("#critical_by_dhp_id").is(":checked")) {
          $.couch.db(db).view("tamsa/patientConditions",{
            success:function(cndata){
              if(cndata.rows.length>0){
                var cnval = "";
                for (var i=0;i<physicians.length;i++){
                  for(var j=0;j<cndata.rows.length;j++){
                    if(physicians[i] == cndata.rows[j].value.doctor_id){
                      cnval = "no";
                      break;
                    }else{
                      cnval = physicians[i];
                    }
                  }
                  if(cnval != "no"){
                    var condition = {
                      CONDITION:          'From Doctor Note',
                      CONDITION_SEVERITY: 'High',
                      doctype:            'Conditions',
                      user_id:            data.rows[0].key[1],
                      doctor_id:          cnval,
                      insert_ts:          new Date()
                    };
                    conditions.push(condition);
                  }
                }
              }else{
                for (var i=0;i<physicians.length;i++){
                  var condition = {
                    CONDITION:          'From Doctor Note',
                    CONDITION_SEVERITY: 'High',
                    doctype:            'Conditions',
                    user_id:            data.rows[0].key[1],
                    doctor_id:          physicians[i],
                    insert_ts:          new Date()
                  };
                  conditions.push(condition);
                }
              }  
              if(conditions.length>0){
                $.couch.db(db).bulkSave({"docs": conditions}, {
                  success: function(data) {
                    console.log("condition documents succeessfully added.");
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
            startkey: [userinfo.user_id, "From Doctor Note"],
            endkey:   [userinfo.user_id, "From Doctor Note",{}]
          });
        }

      }else {
        newAlert("danger", "No Patient found with the given DHP code.");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [$("#patient_add_dhp_id").val().trim()],
    endkey: [$("#patient_add_dhp_id").val().trim(), {}],
    include_docs:true
  });
}

function PrintHtmlWithJquery(output){
  // if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)){
   //  $(output).printMe({
   //   "path": "css/style.css;css/bootstrap-theme.css;css/bootstrap.css"
   // });
  // }else{
    $(output).printMe();
  //}
}

function printPatientDHPIDSlip(dhpid,dname,pname,age,gender,address,contact,regdate){
  //var d = new Date(regdate);
  //var printdate = (d.getDate() +"-"+(new Number(d.getMonth())+1) +"-"+d.getFullYear()) + " " + d.getHours()+":"+d.getMinutes();
  var new_age = "";
  if(age.toString().match(/[-]/)){
    if(age.match(/[a-z]/i)){
      new_age = getAge(age);
    }else{
      new_age = getAgeFromDOB(age);
    }
  }else{
    new_age = age;
  }

  var output = '<div id="printtest"><table class="table"><tr><td class="theme-color">Patient ID <span class="rght-float"></span></td><td class="txt-bold">'+dhpid+'</td><td class="theme-color">Doctor Name <span class="rght-float"></span></td><td class="txt-bold">'+dname+'</td></tr><tr><td class="theme-color">Patient Name<span class="rght-float"></span></td><td class="txt-bold">'+pname+'</td><td class="theme-color">Date & Time<span class="rght-float"></span></td><td class="txt-bold">'+moment(regdate).format("YYYY-MM-DD")+'</td></tr><tr><td class="theme-color">Age<span class="rght-float"></span></td><td class="txt-bold">'+new_age+'</td><td class="theme-color">Gender<span class="rght-float"></span></td><td class="txt-bold">'+gender+'</td></tr><tr><td class="theme-color">Address<span class="rght-float"></span></td><td class="txt-bold">'+address+'</td><td class="theme-color">Contact No.<span class="rght-float"></span></td><td class="txt-bold">'+contact+'</td></tr></table></div>';

  PrintHtmlWithJquery(output);
}

function getCriticalConditionStatusFromDoctorNote(id){
  $.couch.db(db).view("tamsa/patientConditions", {
    success: function(data) {

      if (data.rows.length > 0) {
        if(data.rows[0].value.CONDITION_SEVERITY == "High") {
          $("#"+id).prop('checked', true);
        }
        else {
          $("#"+id).prop('checked', false);
        }
        $("#"+id).val(data.rows[0].value._id);
        $("#"+id).attr('rev', data.rows[0].value._rev);
      }else{
        $("#"+id).val('');
        $("#"+id).attr('rev', '');
        $("#"+id).prop('checked', false); 
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:[userinfo.user_id,"From Doctor Note",pd_data._id]
  });    
}

function labResultComments(){
  $("#doctor_comment_save").attr("disabled","disabled");
  if(validateLabResultComments()){
    var d=new Date();
    $.couch.db(db).openDoc($("#all_lab_results_options").val(),{
      success:function(data){
        var newdata = data;
        var temp_comment = [];
        temp_comment.push({
          comment:$("#doctor_comment").val(),
          date: new Date()
        });
        if(newdata.comments) newdata.comments.push({comment:$("#doctor_comment").val(),date: new Date()})
        else newdata.comments = temp_comment;
        $.couch.db(db).saveDoc(newdata,{
          success:function(data){
            var cron_comment_doc = {
              comment:        $("#doctor_comment").val(),
              doctor_id:      pd_data._id,
              dhp_code:       pd_data.dhp_code,
              doc_id:         $("#all_lab_results_options").val(), 
              user_id:        userinfo.user_id,
              insert_ts:      d,
              email:          userinfo.user_email,
              doctor_name:    pd_data.first_name + " " + pd_data.last_name,
              patient_name:   userinfo.first_nm + " " + userinfo.last_nm,
              operation_case: "23",
              doctype:        "cronRecords",
              processed:      "No"
            };
            $.couch.db(db).saveDoc(cron_comment_doc,{
              success:function(udata){
                $.couch.db(db).openDoc(data.id,{  
                  success:function(data){
                    displayPreviousCommentsAtLabResults(data);
                    $("#doctor_comment").val("");
                    newAlert("success","comments are successfully saved and sent to patient.");
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    $("#doctor_comment_save").removeAttr("disabled");
                    return false;
                  },
                  error:function(data,error,reason){
                    newAlert("danger",reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    $("#doctor_comment_save").removeAttr("disabled");
                    return false;
                  }
                });
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                $("#doctor_comment_save").removeAttr("disabled");
                return false;
              }
            });
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#doctor_comment_save").removeAttr("disabled");
            return false;    
          }
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#doctor_comment_save").removeAttr("disabled");
        return false;
      }
    });
  }else{
    $("#doctor_comment_save").removeAttr("disabled");
  }
}

function toggleSearchForPatientDocument(){
  if($("#d_patient_toggle_lbl").html() == "DHP ID"){
    $("#d_patient_name").hide().val("");
    $("#d_patient_dhpid").show().val("");
    $("#d_patient_toggle_lbl").html("First Name");
  }else{
    $("#d_patient_name").show().val();
    $("#d_patient_dhpid").hide();
    $("#d_patient_toggle_lbl").html("DHP ID");
  }
}

function calculatePatientBMI(hght,wght){
  var height = Number(hght);
  var weight = Number(wght);
  
  var BMI = (weight/Math.pow(height,2))*10000;

  return BMI.toFixed(2);
}

function enableWebCam(cameraID,width,height,final_width,final_height,crop_width,crop_height,startFunction,errorFunction) {
  Webcam.set({
    // live preview size
    width: width,
    height: height,
    
    // device capture size
    dest_width: final_width,
    dest_height: final_height,
    
    // final cropped size
    crop_width: crop_width,
    crop_height: crop_height,
    
    // format and quality
    image_format: 'jpeg',
    jpeg_quality: 90
  });

  Webcam.on( 'live', function() {
    // camera is live, showing preview image
    startFunction();
  });

  Webcam.on('error', function(err) {
    errorFunction();
  });
  Webcam.attach('#'+cameraID);
}

function userProfilePicWebCamOn() {
  $("#upload_profile_pic_input").hide();
  $("#my_camera_parent").show();
  document.getElementById("pre_take_buttons_parent").style.display = '';
  $("#pre_take_buttons").css("display", "block");
  document.getElementById("post_take_buttons").style.display = 'none';
  $(this).css("color","#eb8613");
  $(".upload-picture").css("color","");
  $("#profile_pic_flag").val("take-a-picture");
}

function userProfilePicWebCamError() {
  newAlertForModal('danger', 'Not able to access Webcam.', 'userpic_edit_modal');
}

function preview_snapshot(pre_take_btn, post_take_btn, camera_preview_div, width, height) {
  // play sound effect
  var shutter = new Audio();
  shutter.autoplay = false;
  shutter.src = navigator.userAgent.match(/Firefox/) ? 'shutter.ogg' : 'shutter.mp3';
  try { shutter.currentTime = 0; } catch(e) {;} // fails in IE
  shutter.play();
  
  // freeze camera so user can preview current frame
  
  // swap button sets
  document.getElementById(pre_take_btn).style.display = 'none';
  document.getElementById(post_take_btn).style.display = '';
  Webcam.snap( function(data_uri) {
    // display results in page
    document.getElementById(camera_preview_div).innerHTML = 
      '<img src="'+data_uri+'" style="width:'+width+';height:'+height+';" /><br/>';
  });
  Webcam.freeze();
  //$("#upload_file_camera").find("canvas").css("width","600px");
  // $("#upload_file_camera").find("canvas").css("padding-left","200px");
}

function cancel_preview(pre_take_btn, post_take_btn) {
  // cancel preview freeze and return to live camera view
  Webcam.unfreeze();
  
  // swap buttons back to first set
  document.getElementById(pre_take_btn).style.display = '';
  document.getElementById(post_take_btn).style.display = 'none';
}

function save_photo() {
  // actually snap photo (from preview freeze) and display it
  Webcam.snap( function(data_uri) {
    // display results in page
    document.getElementById('my_camera_preview').innerHTML = 
      '<img src="'+data_uri+'" style="width:130;height:130;" /><br/>';
    
    // shut down camera, stop capturing
    Webcam.reset();
    
    // show results, hide photo booth
    document.getElementById('my_camera_preview').style.display = '';
  });
}

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

function deleteUserId(user_id) {
  $.couch.db(db).view("tamsa/deleteUserId", {
   success: function(data) {
    console.log(data);
    for (var i = data.rows.length - 1; i >= 0; i--) {
      var doc = {
          _id: data.rows[i].id,
          _rev: data.rows[i].value
      };
      $.couch.db(db).removeDoc(doc, {
           success: function(data) {
               console.log(data);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
      });
    };
   },
   error:function(data,error,reason){
     newAlert("danger",reason);
     $("html, body").animate({scrollTop: 0}, 'slow');
     return false;
   },
   key: user_id
  });
}

function addPatientDHPToSubscriberDoc() {
  $.couch.db(db).view("tamsa/getDoctorSubscribers", {
   success: function(data) {
    console.log(data);
    for (var i = data.rows.length - 1; i >= 0; i--) {
      addUserDhpCode(data.rows[i].doc);
    };
   },
   error:function(data,error,reason){
     newAlert("danger",reason);
     $("html, body").animate({scrollTop: 0}, 'slow');
     return false;
   },
   reduce: false,
   include_docs: true
  });
}

function addUserDhpCode(row) {
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
   success: function(data) {
    if (data.rows.length > 0) {
      if (data.rows[0].value.patient_dhp_id) {
        row.patient_dhp_id = data.rows[0].value.patient_dhp_id;
      }
      else {
        row.patient_dhp_id = '';
      }
      $.couch.db(db).saveDoc(row, {
          success: function(data) {
              console.log(data);
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
   key: row.user_id
  });
}

function togglePatientSearch(){
  if($("#search_toggle_lbl").html() == "DHP ID"){
    $("#search_name").hide().val("");
    $("#search_by_patient_dhp").show().val("");
    $("#search_toggle_lbl").html("First Name");
  }else{
    $("#search_name").show().val();
    $("#search_by_patient_dhp").hide();
    $("#search_toggle_lbl").html("DHP ID");
  }
}

function emailNotProvidedToggle($obj){
  if($obj.html() == "not Having EmailId."){
    $obj.html("Having Emailid.");
    $("#isu_email").val("emailnotprovided@digitalhealthpulse.com").attr("readonly","readonly");
  }else{
    $obj.html("not Having EmailId.");
    $("#isu_email").val("").removeAttr("readonly");
  }
}

function subscriberAlertsReportsModal() {
  if($("#subscription_approval_alerts").prop("checked"))
    $("#subscription_approval_alerts").click();
  if($("#subscription_approval_reports").prop("checked"))
    $("#subscription_approval_reports").click();

  $("#subscription_approval_alerts_option").val("Email");
  $("#subscription_approval_reports_frequency").val("Daily");
}

function resetUserPicModal() {
  if($("#profile_pic_flag").val() == "take-a-picture"){
    Webcam.reset();
  }
  $("#upload_profile_pic_input").hide();
  $("#pre_take_buttons_parent").hide();
  $("#my_camera_parent").hide();
  $(".upload-picture").css("color","");
  $(".take-picture").css("color","");
  $("#profile_pic_flag").val("");
}

function showInputForProfilePicUpload($obj) {
  $("#pre_take_buttons_parent").hide();
  $("#my_camera_parent").hide();
  $("#upload_profile_pic_input").show();
  $obj.css("color","#eb8613");
  $(".take-picture").css("color","");
  $("#profile_pic_flag").val("upload-picture");
}

function updateLabResultWithSelectedResult(attachemnt_id){
  $("#all_lab_results_options").val(attachemnt_id).trigger("change");
  updateRecentLabResultWithSelectedLabResult(attachemnt_id);
}

function updateRecentLabResultWithSelectedLabResult(lab_result_id){
  $(".lab_results_recent").each(function(){
    if($(this).attr("doc_id") == lab_result_id){
      $(this).addClass("img-tab-active");
    }
  });
}

function addMoreDocuments(){
  var add_more_documents = [];
  add_more_documents.push('<div style="margin-top: 21px;" class="row add-more-documents-parent">');
  add_more_documents.push('<div class="col-lg-1 col-md-6 col-sm-6 col-xs-12 paddside" style="padding-top: 10px;"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">&nbsp;</label></div></div><div class="col-md-12"><div class="form-group full-input"><span class="label label-warning pointer delete-document">Delete</span></div></div></div></div>');
  add_more_documents.push('<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Document Name</label></div></div><div style="" class="col-md-12"><div class="form-group full-input"><input type="text" class="form-control d-name"></div></div></div></div>');
  add_more_documents.push('<div class="col-lg-2 col-md-6 col-sm-6 col-xs-12 paddleft"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Type</label></div></div><div class="col-md-12"><div class="form-group full-input"><select data-required="true" class="d-type form-control select2-input parsley-validated"><option>Lab-Results</option><option>Imaging-Results</option><option>Video</option><option>Other</option></select></div></div></div></div>');
  add_more_documents.push('<div class="col-lg-2 col-md-6 col-sm-6 col-xs-12 paddside d-category-parent"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Category</label></div></div><div class="col-md-12"><div class="form-group full-input"><select data-required="true" name="document_category" class="form-control select2-input parsley-validated d-category"><option>Blood</option><option>Kidneys & Electrolytes</option><option>Nutrients</option><option>Liver</option><option>Sugars & Digestion</option><option>Hormones</option><option>Thyroid</option><option>Inflammation & Autoimmunity</option><option>Clotting</option><option>Specialized Tests</option><option>Infection</option><option>Urine</option></select></div></div></div></div>');
  add_more_documents.push('<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Choose your file</label></div></div><div class="col-md-12"><div class="form-group full-input"><form class="uploaded-file"><input type="hidden" class="upload-doc-id" name="_id" value=""><input type="hidden" class="upload-doc-rev" name="_rev" value=""><input type="file" style="" value="" class="page-browse-box-right document-userfile" name="_attachments"></form></div></div></div></div></div>');

  $(".add-more-documents-parent:last").after(add_more_documents.join(''));
}

function addMoreMISCDocuments(){

  var add_more_misc_documnets = '<div class="col-lg-12 col-md-12 col-sm-12 add-more-misc-documents-parent"><div class="col-lg-1 col-md-6 col-sm-6 col-xs-12" style="padding-right: 0px; padding-left: 0px; padding-top: 10px;"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">&nbsp;</label></div></div><div class="col-md-12"><span class="label label-warning pointer delete-misc-document">Delete</span></div></div></div><div class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Document Name</label></div></div><div class="col-md-12"><div class="form-group full-input"><input type="text" class="form-control misc-document-name"></div></div></div></div><div class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Category</label></div></div><div class="col-md-12"><div class="form-group full-input"><select type="text" class="form-control misc-document-category"><option>Legal</option><option>Financial</option><option>Insurance</option><option>Personal</option><option>Patient Documents</option></select></div></div></div></div><div class="col-lg-5 col-md-6 col-sm-6 col-xs-12 padding-reset"><div class="row"><div class="col-md-12"><div class="form-group form-input-set"><label for="select-multi-input">Choose your file</label></div></div><div class="col-md-12"><div class="form-group full-input"><form class="misc-document-form" role="form" enctype="multipart/form-data" method="post" action=""><input type="hidden" name="_id" class="form-control misc-document-id"><input type="hidden" name="_rev" class="form-control misc-document-rev"><input type="file" value="" class="page-browse-box-right misc-document-userfile" name="_attachments"></div></div></div></div>';

  $(".add-more-misc-documents-parent:last").after(add_more_misc_documnets);
}

function deleteDocuments($obj,classSelector){
  $obj.parents("."+classSelector).remove();
}

function addPatientDetailsWithChartingTemplatePrint(){
  $("#print_patient_details_name").html($("#mh_name_new").html());
  $("#print_patient_details_age").html($("#mh_age").html());
  $("#print_patient_details_gender").html($("#mh_gender_new").html());
  $("#print_patient_details_dhp_id").html($("#mh_patient_dhp_id").html());
  $("#print_patient_details_phone").html($("#mh_phone_no").html());
}

function menuOptionClickedHandler($obj){
  if($obj.children().html() == 'Your Patients' || $obj.children().html() == 'Practice Dashboard'){
  //  $('#mytabs').hide();
  }
  if($obj.children().length == 2){
    $("#mytabs li ul li").click(function(){
      $("#menu").css("z-index", "-1");
      $("#menu").hide();
      $(".layers").hide();
      $("#mytabs").hide();
    });
  }else{
    $("#menu").css("z-index", "-1");
    $("#menu").hide();
    $(".layers").hide();
    $("#mytabs").hide();
  }
}

function toggleLabResultCategory($obj){
  if($obj.val() == "Lab-Results" || $obj.val() == "Imaging-Results") {
    $obj.parents(".add-more-documents-parent").find(".d-category-parent").show();
  }else{
    $obj.parents(".add-more-documents-parent").find(".d-category-parent").hide();
  }
}

function timelineToggleDisplay($obj){
  $obj.parent().next().slideToggle();
    if($obj.hasClass('glyphicon-chevron-down')){
      $obj.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
    }
    else{
      $obj.addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
    }
}

function tabDisplayInPatientDashboard($obj){
  var tab_id = $obj.attr('href');
  $('ul.charts-tabs li').removeClass('active');
  $('.tab-container').slideUp();
  $obj.addClass('active');
  $(tab_id).addClass('active');
  $(tab_id).slideDown();
}

function getSelectedLabdata($obj){
  $('.search-result-box').removeClass('active');
  $obj.addClass('active');
  // pouchdb.get($obj.attr("doc_id")).then(function(doc) {
  //   if($("#lab_imaging_type").val() == "Lab") $('#la_lab_name').val(doc.lab_name);
  //   else $('#la_lab_name').val(doc.imaging_name);

  //   $('#la_city').val(doc.city);
  //   $('#la_contact_person_name').val(doc.contact_person_name);
  //   $('#la_contact_person_email').val(doc.contact_person_email);
  //   $('#la_contact_person_phone').val(doc.contact_person_phone);
  //   $('#la_address').val(doc.address);
  //   $('#la_reference').val(doc.reference);
  //   $('#la_save').data('index',doc._id);
  //   $('#la_save').data('rev',doc._rev);
  // }).catch(function (err) {
  //   console.log(err);
  // });
  $.couch.db(db).openDoc($obj.attr("doc_id"),{
    success:function(doc){
      if($("#lab_imaging_type").val() == "Lab") $('#la_lab_name').val(doc.lab_name);
      else $('#la_lab_name').val(doc.imaging_name);

      $('#la_state').val(doc.state);
      $('#la_contact_person_name').val(doc.contact_person_name);
      $('#la_contact_person_email').val(doc.contact_person_email);
      $('#la_contact_person_phone').val(doc.contact_person_phone);
      $('#la_address').val(doc.address);
      $('#la_reference').val(doc.reference);
      $('#la_services').val(doc.services?doc.services:"");
      $('#la_website').val(doc.website?doc.website:"");
      $('#la_save').data('index',doc._id);
      $('#la_save').data('rev',doc._rev);
      getCities(doc.state, "la_city", doc.city)
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function getSelectedImagedata($obj){
  $('.search-result-box').removeClass('active');
  $obj.addClass('active');
  $.couch.db(db).openDoc($obj.attr("doc_id"),{
    success:function(data){
      $('#ia_imaging_name').val(data.imaging_name);
      $('#ia_city').val(data.city);
      $('#ia_contact_person_name').val(data.contact_person_name);
      $('#ia_contact_person_email').val(data.contact_person_email);
      $('#ia_contact_person_phone').val(data.contact_person_phone);
      $('#ia_address').val(data.address);
      $('#ia_reference').val(data.reference);
      $('#ia_save').attr('edit_id',data._id);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('body,html').animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

function addMoreFMHInAddNewPatient(){
  var add_more_fmh_data = '<div style="padding-left: 0px;" class="fmh-parent col-md-12"><div class="col-lg-5 col-md-4 col-sm-4 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group full-input"><select class="form-control isu-fmh-relation"><option>Select</option><option>Sister</option><option>Brother</option><option>Father</option><option>Mother</option><option>Paternal Grand Father</option><option>Paternal Grand Mother</option><option>Maternal Grand Father</option><option>Maternal Grand Mother</option><option>Uncle</option><option>Aunt</option></select></div></div></div></div><div class="col-lg-5 col-md-4 col-sm-4 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group full-input"><select class="form-control isu-fmh-condition"><option>Select</option><option>Cancer</option><option>Clotting Disorder</option><option>Diabetes</option><option>Dementia/Alzheimers</option><option>Heart Disease</option><option>Gastro Intestinal Disorders</option><option>High Cholesterol</option><option>Hypertension</option><option>Kidney Disease</option><option>Lung Disease</option><option>Osteoporosis</option><option>Psychological Disorders</option><option>Stroke/Brain attack</option><option>Sudden Death Infant Syndrome (SIDS)</option><option>Unknown Disease</option></select></div></div></div></div><div style="padding-left: 15px; padding-top: 0px;" class="col-lg-2 col-md-4 col-sm-4 col-xs-12"><div class="row"><div style="padding-top: 0px;" class="col-md-12"><div style="margin-bottom: 0px;" class="form-group full-input"><label class="label label-warning remove-fmh pointer" style="padding-top: 4px; margin-top: 9px; float: left;">Remove</label></div></div></div></div></div>';

  $(".fmh-parent:last").after(add_more_fmh_data);
} 

function openStratChartnoteModel($obj){
  $obj.val("Select Action");
  $.couch.db(db).view("tamsa/getChartingTemplateMostRecentlyAccessedByDoctor",{
    success:function(data){
      if(data.rows.length > 0){
        $.couch.db(db).view("tamsa/getExistingChartingTemplates",{
          success:function(temp_info){
            $("#recently_chatrtion_template").html(data.rows[0].value.template_name);
            $("#recently_chatrtion_template").attr("temp_id",temp_info.rows[0].doc._id);
            $("#recently_chatrtion_template").attr("_id",$obj.attr("user_id"));
            $("#charting_template_default").attr("user_id",$obj.attr("user_id"));
          },
          error:function(data ,error ,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key: [pd_data._id,data.rows[0].value.template_name,data.rows[0].value.specialization],
          include_docs: true
        });
      }else{
        $("#not_chartnote_available").html("Name not available");
      }    
    },
    error:function(data ,error ,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey:[pd_data._id,{}],
    endkey:[pd_data._id],
    descending:true,
    limit:1   
  });
  $("#start_chartnote_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
}

function saveAuditRecord(audit_area, action_type, comments) {
  var d   = new Date();
  var doc = {
    doctype:      'audit_records',
    insert_ts:    d,
    doctor_id:    pd_data._id,
    doctor_name:  pd_data.first_name + " " + pd_data.last_name,
    comments:     comments,
    user_id:      userinfo.user_id,
    patient_name: userinfo.first_nm+ " " +userinfo.last_nm,
    audit_area:   audit_area,
    action_type:  action_type,
    dhp_code:     pd_data.dhp_code
  };
  $.couch.db(db).saveDoc(doc, {
    success: function(data) {
      return true;
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function getNotificationsMassege() {
  $.couch.db(db).view("tamsa/getAppointmentByDateTime",{
    success:function(data){
      if(data.rows.length > 0){
        getDateDetailsNotificationMassege(data.rows[0].doc.reminder_start);
      }
    },
    error:function(data,error,reason){
      console.log(error);
      return false;
    },
    startkey:[pd_data._id,moment().utc().format("D/M/YYYY,HH:mm")],
    endkey:[pd_data._id,moment().utc().format("D/M/YYYY,HH:mm"),{}],
    include_docs:true
  });    
}

function removeAutocompleterFromElement(id){
  $("#"+id).autocomplete("destroy");
}

function getServicesAndMicsDocuments(misc_doc_id,service_name,misc_select_id,service_select_id){
  $.couch.db(db).view("tamsa/getMiscDocuments", {
    success: function(data) {
      if(data.rows.length > 0){
        var misc_document_table = [];
         misc_document_table.push("<option>Select Hospital Documents</option>");
        for(var i=0;i<data.rows.length;i++){  
          misc_document_table.push("<option value='"+data.rows[i].doc._id+"'>"+data.rows[i].doc.document_name+"</option>");
        }
        $("#"+misc_select_id).html(misc_document_table.join(''));
      }else{
        $("#"+misc_select_id).html("<option>No Documents Found</option>");
      }
      if(misc_doc_id && misc_doc_id != "") $("#"+misc_select_id).val(misc_doc_id)
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data.dhp_code],
    endkey: [pd_data.dhp_code, {}],
    include_docs: true
  });
  $.couch.db(db).view("tamsa/getDiagnosisProcedures",{
    success:function(data){
      var subjective_billrecords = [];
      if(data.rows.length > 0 && data.rows[0].doc.services){
        subjective_billrecords.push("<option>Select Services</option>");
        for(var i=0;i<data.rows[0].doc.services.length;i++){
          subjective_billrecords.push("<option value="+data.rows[0].doc.services[i].form_id+">"+data.rows[0].doc.services[i].service_name+"</option>");
        }
        $("#"+service_select_id).html(subjective_billrecords.join(''));
      }else{
        $("#"+service_select_id).html('<option>No Documents Found</option>');
      }
      if(service_name && service_name != "") $("#"+service_select_id).val($("#"+service_select_id+" option:contains('"+service_name+"')").val())
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
      return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });
}

function getDHPConsultatntList(id) {
  $.couch.db(replicated_db).view("tamsa/getDoctorsList",{
    success:function(data){
      $("#"+id).find("option").remove();      
      if(data.rows.length > 0) {
        $("#"+id).append("<option value='noselect'>Select Consultant</option>");
        for(var i=0;i<data.rows.length;i++){
          if(pd_data._id != data.rows[i].doc._id){
            $("#"+id).append("<option value='"+data.rows[i].doc._id+"'>"+data.rows[i].doc.first_name+" "+data.rows[i].doc.last_name+"&nbsp;--&nbsp;"+data.rows[i].doc.phone+"</option>");
          }
        }
      }else{
        $("#"+id).append("<option value='noselect'>No Consultants are Found.</option>");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey:[pd_data.dhp_code],
    endkey:[pd_data.dhp_code,{},{}],
    include_docs:true
  });
}

function getDateDetailsNotificationMassege(date_info){
  var datereminder = new moment(date_info).utc();
  var getdate      = new moment(datereminder._d).format("YYYY-MM-DD hh:mm");
  var minute       = moment(getdate).format("mm");
  var hours        = moment(getdate).format("hh");
  console.log(hours,minute);
  getNotificationsMassegeseTimeout(hours,minute);
}

function getNotificationsMassegeseTimeout(hours,mini){
  var notice = notificationConfiguration('SENSORY HEALTH SYSTEMS', 'Next appointment on '+hours+':'+mini+'...', 'img/newlog.png',"Appointment");
  setTimeout(function(){notice},4000);
}

function notificationConfiguration(title,text,icon_src,name_notify) {
  PNotify.desktop.permission();
  var notification = (new PNotify({ 
    title: title, 
    text:  text,
    desktop: {
      desktop: true,
      icon:icon_src,
    } 
  })).get().click(function(e) {
    if ($('.ui-pnotify-closer, .ui-pnotify-sticker, .ui-pnotify-closer *, .ui-pnotify-sticker *').is(e.target)) return;
        gotoPageClickOnNotification(name_notify);
  });
  return notification;
}

function gotoPageClickOnNotification(name_notify) {
  if(name_notify == "Appointment"){
    var url = $state_global.href("appointments",{action:null});
    var mywindow = window.open(url,'_blank');
  }else{
    var url = $state_global.href("task_manager",{action:null});
    var mywindow = window.open(url,'_blank');
  }
}

function generateDueTaskNotification() {
  $.couch.db(db).view("tamsa/getDueTasksCount", {
    success: function(data) {
      if(data.rows.length > 0){
        var task_status_data = 0;
        for (var i = 0; i < data.rows.length; i++) {
          task_status_data = task_status_data + Number(data.rows[i].value);
        }
        due_task_text = 'You have '+task_status_data+' task due.';
      }else{
        due_task_text = 'No task due.';
      }
      $.couch.db(db).view("tamsa/getCommunicationSettings", {
        success:function (comdata) {
          var notification_hrs;
          if(comdata.rows.length > 0) {
            if(comdata.rows[0].doc.due_task_notification_hours == "Never") {
              return false;
            }
            notification_hrs = comdata.rows[0].doc.due_task_notification_hours ? comdata.rows[0].doc.due_task_notification_hours : 4;
          }else{
            notification_hrs = 4;
          }
          $.couch.db(db).view("tamsa/getDailyNotificationStatus", {
            success:function (data) {
              if(data.rows.length > 0) {
                var hrs_diff = moment().diff(moment(data.rows[0].doc.insert_ts), "miliseconds");
                if( hrs_diff > Number(notification_hrs)*60*60*1000) {
                  var notice = notificationConfiguration('SENSORY HEALTH SYSTEMS', due_task_text, 'img/newlog.png','Task');
                  showDueTaskNotification(notice,data,notification_hrs);
                }else{
                  var remaining = (Number(notification_hrs)*60*60*1000) - moment().diff(moment(data.rows[0].doc.insert_ts),"miliseconds");
                  //console.log(remaining);
                  setTimeout(function(){
                    var notice = notificationConfiguration('SENSORY HEALTH SYSTEMS', due_task_text, 'img/newlog.png','Task');
                    showDueTaskNotification(notice,data,notification_hrs);
                  },Number(remaining));
                }
              }else {
                var notice = notificationConfiguration('SENSORY HEALTH SYSTEMS', due_task_text, 'img/newlog.png','Task');
                showDueTaskNotification(notice,data,notification_hrs);
              }
            },
            error:function(data,error,reason){
              console.log(error);
              return false;
            }, 
            key:[pd_data.dhp_code,moment().format("YYYY-MM-DD")],
            include_docs:true
          });   
        },
        error:function(data,error,reason){
          console.log(error);
          return false;
        },
        key:pd_data.dhp_code,
        include_docs:true
      });
    },
    error:function(data,error,reason){
      console.log(error);
      return false;
    },
    startkey: [pd_data._id, "Review"],
    endkey:   [pd_data._id, "Review", {}, {}],
    reduce:   true,
    group:    true
  });
}

function showDueTaskNotification(notice,data,notification_hrs) {
  notice;
  var notification_doc = {
    doctype:"notification_status",
    doctor_id: pd_data._id,
    dhp_code: pd_data.dhp_code,
    insert_ts: new Date(),
    last_updated_time: moment().format("HH:mm")
  }
  if(data && data.rows.length > 0) {
    notification_doc._id  = data.rows[0].doc._id;
    notification_doc._rev = data.rows[0].doc._rev;
  }
  $.couch.db(db).saveDoc(notification_doc, {
    success:function (data) {
      setInterval(function(){generateDueTaskNotification()},Number(notification_hrs)*60*60*1000);
    },
    error:function(data,error,reason){
      console.log(error);
      return false;
    }
  });
}

function toggleLabelClass($obj){
  if($obj.hasClass("label-warning")){
    $obj.addClass("label-default");
    $obj.removeClass("label-warning");
  }else{
    $obj.addClass("label-warning");
    $obj.removeClass("label-default");
  }
}

function createModal(id){
  $("#"+id).modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
}

function getPatientAllergies (obj) {
  var patient_allergies = [];
  if(obj == "current"){
    if(userinfo_medical.Allergies){
      if(userinfo_medical.Allergies.length > 0){
        patient_allergies.push('<table class="table"><thead><tr><th>Allergies Name</th><th>Severe:</th><th>Reaction:</th></tr></thead><tbody>');
        for(var i=0;i<userinfo_medical.Allergies.length;i++){
          var element = userinfo_medical.Allergies[i];
          var arry =element.split(",");
          patient_allergies.push("<tr><td>"+arry[0]+"</td><td>"+(arry[1] ? arry[1] : "N/A")+"</td><td>"+(arry[2] ? arry[2] : "N/A")+"</td></tr>");
        }
        patient_allergies.push('</tbody></table>');
      }else{
        patient_allergies.push("No Allergies are found in Patient Medical information.");
      }
    }else{
      patient_allergies.push("No Allergies are found in Patient Medical information.");
    }  
  }else{
    if(userinfo_medical.Allergies){
      if(userinfo_medical.Allergies.length > 0){
        patient_allergies.push('');
        for(var i=0;i<userinfo_medical.Allergies.length;i++){
          var element = userinfo_medical.Allergies[i];
          var arry =element.split(",");
          patient_allergies.push("<li>Allergies name:"+arry[0]+"</li><li>Severe:"+(arry[1] ? arry[1] : "N/A")+"</li><li>Reaction:"+(arry[2] ? arry[2] : "N/A")+"</li>");
        }
      }else{
        patient_allergies.push("No Allergies are found.");
      }
    }  
  }  
  return patient_allergies;
}

function getAllExistingSpecializationList(id,template_id,callback){
  $.couch.db(db).view("tamsa/getExitstingSpecializationDocByDhpcode", {
    success:function(data){
      if(data.rows.length > 0){
        var list = '';
        list += '<option value="Select Specialization">Select Specialization</option>';
        for (var i = 0; i < data.rows[0].value.specialization_list.length; i++) {
          list += '<option value="'+data.rows[0].value.specialization_list[i]+'">'+data.rows[0].value.specialization_list[i]+'</option>';
        }
        $("#"+id).html(list);
        if(template_id) callback(template_id);
        if(id= "pdspecialization"){
          $("#"+id).val(pd_data.specialization);
        }
      }else{
        $.couch.db(db).view("tamsa/getSpecializationList", {
          success:function(data){
            if(data.rows.length > 0){
              var list = '';
              list += '<option value="Select Specialization">Select Specialization</option>';
              for (var i = 0; i < data.rows[0].value.specialization.length; i++) {
                list += '<option value="'+data.rows[0].value.specialization[i]+'">'+data.rows[0].value.specialization[i]+'</option>';
              }
              $("#"+id).html(list);
              if(template_id) callback(template_id);
              if(id= "pdspecialization"){
                $("#"+id).val(pd_data.specialization);
              }
            }else{
              console.log("specialization data not found");
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

function generateMultiSelect(id) {
  $("#"+id).multiselect();
}

function getFieldsFromSpecializationMultiselect(specialization_value){
  if(specialization_value !=  ""){
    $.couch.db(db).view("tamsa/getChartingTemplateSpecialization", {
      success: function(data) {
        console.log(data);
        if(data.rows.length > 0){
          existingFieldsFromSpecialization(specialization_value);
        }else{
          getFieldsFromSpecialization();
        }
      },
      error: function(data,error,reason) {
        newAlert('danger', "NS device id can not be blank.");
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      key: specialization_value,
      limit:5,
      reduce:true,
      group:true
    });
  }else{
    $(".charting_template_field_table .maintbody").html("");
    $("#add-new-field-parent").hide();
  }
}  

function getPrintCommonDetails(hdata,doc,pdata,chartdate) {
  var print_bill_data = [];
    print_bill_data.push('<div class="col-lg-12" style="border-bottom: 1px solid grey;" id="preview_header_parent">');
      print_bill_data.push('<table class="table common-preview-invoice-details">');
        print_bill_data.push('<tbody>');
          print_bill_data.push('<tr>');
            if(hdata.rows[0].doc.is_display_logo){
              print_bill_data.push('<td style="padding:0px;width:29%;"><img src="'+hdata.rows[0].doc.invoice_image+'" alt="Company Logo" title="Company Logo" width="75%"></td>');
            }
            print_bill_data.push('<td style="padding-bottom:0px;">');
              print_bill_data.push('<table style="float: left; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;"><span class="glyphicon glyphicon-map-marker" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;text-transform:uppercase;">'+(hdata.rows[0].doc.hospital_name ? hdata.rows[0].doc.hospital_name : pd_data.hospital_affiliated)+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_address+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_secondary_address+', '+hdata.rows[0].doc.hospital_city+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_state+', '+hdata.rows[0].doc.hospital_postal_zip_code+' India</td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');

            print_bill_data.push('<td>');
              print_bill_data.push('<table style="float: left; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon-earphone" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;">'+pd_data.hospital_phone+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px; font-size:15px;"></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');

            print_bill_data.push('<td>');
              print_bill_data.push('<table style="float: left; height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon glyphicon-globe" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;">'+hdata.rows[0].doc.hospital_email+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_website+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
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
                  print_bill_data.push('<tr>');
                    print_bill_data.push('<td style="line-height: 0.45 !important; font-size:18px; color:#000; font-family:arial;" align="left"><span>Doctor Name:: '+pd_data.first_name+' '+pd_data.last_name+'</span></td>');
                    if(doc) {
                      print_bill_data.push('<td style="line-height: 0.45 !important; font-size:15px; color:#000; font-family:arial;font-weight:bold;" align="right"><span>Date :: '+moment(doc.update_ts).format("DD-MM-YYYY")+'</span></td>');
                    }else if(chartdate){
                      print_bill_data.push('<td style="line-height: 0.45 !important; font-size:15px; color:#000; font-family:arial;font-weight:bold;" align="right"><span>Date :: '+chartdate+'</span></td>');
                    }
                    
                  print_bill_data.push('</tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');
          print_bill_data.push('</tr>');

          print_bill_data.push('<tr>');
            print_bill_data.push('<td style="line-height: 0.45 !important;width:100%;">');
              print_bill_data.push('<table class="table common-preview-invoice-details patitentAddress">');
                print_bill_data.push('<tbody>');
                 
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;font-weight:bold;font-size:15px;"><b style="color:rgb(119, 119, 119)">Patient Info:</b></td>');
                  print_bill_data.push('<td style="line-height: 0.45 ! important; padding-left: 25px;font-size:15px;">'+pdata.rows[0].value.first_nm+' '+pdata.rows[0].value.last_nm+' ('+pdata.rows[0].value.patient_dhp_id+')</td>');
                  print_bill_data.push('<td style="line-height: 0.45 !important; font-size:15px;"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-user"></span>'+(pdata.rows[0].value.gender ? pdata.rows[0].value.gender : "NA")+'</td>');

                  if(pdata.rows[0].value.age) var frmt_age = pdata.rows[0].value.age
                  else{
                    if(pdata.rows[0].value.date_of_birth) {
                      if(pdata.rows[0].value.date_of_birth.match(/[a-z]/i)) {
                        var frmt_age = getAge(pdata.rows[0].value.date_of_birth);
                      }else {
                        var frmt_age = getAgeFromDOB(pdata.rows[0].value.date_of_birth)
                      }
                    }
                  }

                  print_bill_data.push('<td style="line-height: 0.45 !important;font-size:15px;">'+(frmt_age ? (frmt_age + '&nbsp; Years') : "")+'</td>');
                  if(pdata.rows[0].value.phone){
                    print_bill_data.push('<td style="line-height: 0.45 !important;font-size:15px;"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-earphone"></span>'+pdata.rows[0].value.phone+'</td>');
                  }
                  print_bill_data.push('</tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;font-size:15px;;font-weight:bold;"><b style="color:rgb(119, 119, 119)">Address:</b></td>');
                    print_bill_data.push('<td coslpan = "2" style="line-height: 0.45 ! important; padding-left: 25px;font-size:15px;">'+(pdata.rows[0].value.address1 ? pdata.rows[0].value.address1 : "NA")+', '+(pdata.rows[0].value.address2 ? pdata.rows[0].value.address2 : "")+'</td>');
                    print_bill_data.push('<td style="line-height: 0.45 !important;padding-left:25px;font-size:15px;">'+pdata.rows[0].value.city+', '+pdata.rows[0].value.state+(pdata.rows[0].value.pincode ? (', '+pdata.rows[0].value.pincode) : "")+'</td>');
                    if(pdata.rows[0].value.user_email != "emailnotprovided@digitalhealthpulse.com") {
                      var pr_email = pdata.rows[0].value.user_email;
                    }else {
                      var pr_email = "NA";
                    }
                    print_bill_data.push('<td style="line-height: 0.45 !important;font-size:15px;"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-envelope"></span>'+pr_email+'</td>');
                  print_bill_data.push('</tr>');
                 
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');
          print_bill_data.push('</tr>');
        print_bill_data.push('</tbody>');
      print_bill_data.push('</table>');
    print_bill_data.push('</div>');

  return print_bill_data.join('');  
}

function getPrintCommonDetailsDoctor(hdata) {
  var print_bill_data = [];
    print_bill_data.push('<div class="col-lg-12" style="border-bottom: 1px solid grey;" id="preview_header_parent">');
      print_bill_data.push('<table class="table common-preview-invoice-details">');
        print_bill_data.push('<tbody>');
          print_bill_data.push('<tr>');
            if(hdata.rows[0].doc.is_display_logo){
              print_bill_data.push('<td style="padding:0px;width:29%;"><img src="'+hdata.rows[0].doc.invoice_image+'" alt="Company Logo" title="Company Logo" width="75%"></td>');
            }
            print_bill_data.push('<td style="padding-bottom:0px;">');
              print_bill_data.push('<table style="float: left; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;"><span class="glyphicon glyphicon-map-marker" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;text-transform:uppercase;">'+(hdata.rows[0].doc.hospital_name ? hdata.rows[0].doc.hospital_name : pd_data.hospital_affiliated)+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_address+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_secondary_address+', '+hdata.rows[0].doc.hospital_city+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_state+', '+hdata.rows[0].doc.hospital_postal_zip_code+' India</td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');

            print_bill_data.push('<td>');
              print_bill_data.push('<table style="float: left; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon-earphone" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;">'+pd_data.hospital_phone+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px; font-size:15px;"></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');

            print_bill_data.push('<td>');
              print_bill_data.push('<table style="float: left; height: 97px;" class="table common-preview-invoice-details invoice-header">');
                print_bill_data.push('<tbody>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon glyphicon-globe" style="color:#F2BB5C;margin-right:3px;font-size:15px;"></span><span style="font-size:15px;">'+hdata.rows[0].doc.hospital_email+'</span></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;">'+hdata.rows[0].doc.hospital_website+'</td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                  print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px; font-size:15px;"></td></tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
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
                  print_bill_data.push('<tr>');
                    print_bill_data.push('<td style="line-height: 0.45 !important; font-size:18px; color:#000; font-family:arial;" align="left"><span>Doctor Name:: '+pd_data.first_name+' '+pd_data.last_name+'</span></td>');
                  print_bill_data.push('</tr>');
                print_bill_data.push('</tbody>');
              print_bill_data.push('</table>');
            print_bill_data.push('</td>');
          print_bill_data.push('</tr>');
        print_bill_data.push('</tbody>');
      print_bill_data.push('</table>');
    print_bill_data.push('</div>');

  return print_bill_data.join('');  
}

function getFotterHtml(){
  var html = [];
  html.push("<div class='modal-footer' style='padding-top: 0px; padding-bottom: 10px; text-align:left;'><div class='col-lg-12 text-center'>I authorize the release of any medical information necessary to process this claim.</div><div style='padding-top: 15px; clear: both; border-top: 1px solid grey; margin-top: 0px;'><span style='color: rgb(0, 0, 0); font-family: arial; font-weight: bold; font-size: 9px;'>This bill is generated with Digital Health Pulse.<br>*Digital Health Pulse(DHP) is online (cloud) based clinical Practice Management product from Sensory Health Systems.Works in offline mode when required.</span><br><span style='font-size:11px; color:#000; font-family:arial; font-weight:bold;'>Interested? Call us at or Email us at info@sensoryhealth.com</span></div></div>");
  return html.join('');
}

function getReplicationMasterSource() {
  $.couch.db(db).openDoc("replication_configuration", {
    success:function(data) {
      if(data.replication_source) document_added_from = data.replication_source
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function showUploadFilesModal(userid,username) {
  createModal("upload_files_modal");
  $("#upload_patient_files").data("user_id", userid);
  $("#upload_patient_files").data("username", username);
}

function showInputToUploadFile() {
  $("#patient_uploaded_file_parent, #patient_upload_file_preference_parent, #patient_upload_file_comment_parent").show();
  $("#patient_uploaded_file").val("");
  $("#upload_files_from_computer").addClass("theme-color");
  $("#upload_patient_files").data("source", "computer");
  $("#upload_file_camera_parent").hide();
  $("#upload_file_pre_take_buttons_parent").css("display","none");
}

function getPatientUploadedImage(obj) {
  if(validateImageFile(obj)) {
    var file = $(obj).prop("files");
    if(file[0].type.substring(0,5) != "image") {
      returnImageURI(obj);
    }
  }
}

function displayPatientReportsInputs() {
  if($("#patient_upload_file_preference").val() == "Patient Reports") {
    $("#document_details_parent").show();
  }else {
    $("#document_details_parent").hide();
  }
}

function toggleCategoryForPatientReportsInputs() {
  if($("#upload_document_type").val() == "Lab-Results" || $("#upload_document_type").val() == "Imaging-Results") $("#upload_document_category_parent").show()
  else $("#upload_document_category_parent").hide();
}

function uploadPatientFiles() {
  // var canvas    = document.createElement('canvas');
  // canvas.width  = "800";
  // canvas.height = "600";
  // var ctx       = canvas.getContext('2d');
  // var img       = $("#patient_uploaded_file").parent().find("img")[0];
  // console.log(img);
  // ctx.drawImage(img, 0, 0,600,600);
  // canvas.toBlob(function(blob){
  //     console.log(blob);
  //     var form = new FormData(),
  //         request = new XMLHttpRequest();
  //     form.append("_rev","7-a0f0da674e45a026ba405caf97647b5d");
  //     form.append("_attachments", blob, "filename.png");
  //     // $(form).ajaxSubmit({
  //     //   // Submit the form with the attachment
  //     //   method:"POST",
  //     //   url: "/"+ db +"/ea24337ba2cf0ae23aeff13912007c7a",
  //     //   success: function(response) {
  //     //     console.log("saved");
  //     //   },
  //     //   error: function(data, error, reason) {
  //     //     console.log(reason);
  //     //   }
  //     // });
  //     request.open("POST", "/meluha_db5/ea24337ba2cf0ae23aeff13912007c7a", true);
  //     request.send(form);
  // }, "image/png");

  if(validatePatientUploadFiles()) {
    var patient_user_id = $("#upload_patient_files").data("user_id"),
        patient_name    = $("#upload_patient_files").data("username"),
        doctor_id       = pd_data._id,
        doctor_name     = pd_data.first_name + " " +pd_data.last_name,
        task_doc;
    var fname = "upload_"+moment().format("YYYY-MM-DD_hh:mm");
    var upload_doc = {
      user_id:           patient_user_id,
      patient_name:      patient_name,
      doctor_id:         doctor_id,
      doctor_name:       doctor_name,
      insert_ts:         new Date(),
      dhp_code:          pd_data.dhp_code
    };
    
    if($("#upload_document_comments").val()) {
      var comments = [];
      comments.push({
        "comment": $("#upload_document_comments").val(),
        "date":    new Date()
      });
      upload_doc.comments = comments;
    }

    if($("#patient_upload_file_preference").val() == "Patient Reports") {
      upload_doc.doctype = "document";
      upload_doc.status  = "Review";
      upload_doc.document_type = $("#upload_document_type").val();
      upload_doc.document_name = $("#upload_document_name").val();
      if($("#upload_document_type").val() == "Lab-Results" || $("#upload_document_type").val() == "Imaging-Results") {
        upload_doc.document_category = $("#upload_document_category").val();
      }
      
      task_doc = {
        doctor_id:      doctor_id,
        doctor_name:    doctor_name,
        patient_name:   patient_name,
        doctype:        "task",
        insert_ts:      d,
        user_id:        patient_user_id,
        dhp_code:       pd_data.dhp_code,
        effective_date: moment(d).format("YYYY-MM-DD"),
        priority:       $("#upload_document_task_priority").val(),
        comments:       "",
        due_date:       $("#upload_document_due_date").val(),
        notify:         false,
        status:         "Review"
      };

      if ($("#upload_document_type").val() == "Lab-Results")
        task_doc['task'] = "eLabResults";
      else if ($("#upload_document_type").val() == "Imaging-Results")
        task_doc['task'] = "eImagingResults";
      else 
        task_doc['task'] = "Other";
    }else if($("#patient_upload_file_preference").val() == "Dr. Chart Note") {
      upload_doc.doctype = "uploaded_patient_charting_template";
      if($("#upload_patient_files").data("source") == "computer") {
        upload_doc.document_name = $("#patient_uploaded_file").val();
      }else if($("#upload_patient_files").data("source") == "webcam"){
        upload_doc.document_name = fname;
      }
      upload_doc.update_ts = new Date();
    } else if($("#patient_upload_file_preference").val() == "Medications") {
      upload_doc.doctype = "uploaded_medication";
      if($("#upload_patient_files").data("source") == "computer") {
       upload_doc.document_name = $("#patient_uploaded_file").val();
      }else if($("#upload_patient_files").data("source") == "webcam"){
        upload_doc.document_name = fname;
      }
    }
    $.couch.db(db).saveDoc(upload_doc, {
      success:function(data) {
        if(task_doc) {
          task_doc.document_id = data.id;
          saveTaskDocumentAfterFileUpload(task_doc);
        }
        if($("#upload_patient_files").data("source") == "computer") {
          uploadDataURIAsFile($("#patient_uploaded_file").get(0).files[0],db,data.id,data.rev,$("#patient_uploaded_file").val(),patient_user_id);
        }else if($("#upload_patient_files").data("source") == "webcam") {
          var fname = "upload_"+moment().format("YYYY-MM-DD_hh:mm");
          uploadDataURIAsFile($("#upload_file_camera_preview").find("img")[0],db,data.id,data.rev,fname,patient_user_id); 
        }
        $("#upload_files_modal").modal("hide");
        newAlert("success","Files Uploaded Successfully.");
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

function uploadDataURIAsFile(img,db_name,doc_id,doc_rev,filename,patient_user_id) {
  if($("#upload_patient_files").data("source") == "computer") {
    var form = new FormData(),
        request = new XMLHttpRequest();
    form.append("_id",doc_id);
    form.append("_rev",doc_rev);
    form.append("db",db_name);
    form.append("_attachments", img, filename);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 201) {
        getUploadedMedicationList(patient_user_id);
        getTimeLineRecords(0,"");
      }
    };
    // request.open("POST", "/"+db_name+"/"+doc_id, true);
    request.open("POST", "/api/upload", true);
    request.send(form);
  }else if($("#upload_patient_files").data("source") == "webcam") {
    var canvas = document.createElement("canvas");
    //var canvas = document.getElementById("upload_file_camera").querySelectorAll("canvas");
    canvas.width  = "800";
    canvas.height = "600";
    var ctx       = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0,600,600);
    canvas.toBlob(function(blob) {
      var form    = new FormData(),
          request = new XMLHttpRequest();
      form.append("_rev",doc_rev);
      form.append("_attachments", blob, filename);
      form.append("db",db_name);
      form.append("_id",doc_id);
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 201) {
          getUploadedMedicationList(patient_user_id);
          getTimeLineRecords(0,"");
        }
      };
      // request.open("POST", "/"+db_name+"/"+doc_id, true);
      request.open("POST", "/api/upload", true);
      request.send(form);
    }, "image/png");
  }
}

function saveTaskDocumentAfterFileUpload(task_doc) {
  $.couch.db(db).saveDoc(task_doc, {
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function returnImageURI(obj) {
  var F = obj.files;
  var reader = new FileReader();
  reader.readAsDataURL(F[0]);
  return reader.onload = function(_file) {
    $(obj).data("img-data",_file.target.result);
    if($(obj).parent().find("img")) $(obj).parent().find("img").attr("src",_file.target.result);
  }
}

function clearUploadFilesModal() {
  $("#patient_uploaded_file_parent, #patient_upload_file_preference_parent, #patient_upload_file_comment_parent, #document_details_parent").hide();
  $("#patient_upload_file_preference").val("Select");
  $("#upload_document_comments, #patient_uploaded_file, #upload_document_name, #upload_document_due_date, #upload_document_effective_date").val("");
  $("#upload_document_type").val("Lab-Results");
  $("#upload_document_category").val("Blood");
  $("#upload_document_task_priority").val("Regular");
  $("#upload_files_from_computer, #upload_files_from_webcam").removeClass("theme-color");
  $("#upload_file_camera, #upload_file_camera_preview").html('');
  $("#upload_file_pre_take_buttons_parent").css("display","none");
  $("#upload_file_camera_parent").hide();
  // $("#upload_file_pre_take_buttons").hide();
  // $("#upload_file_post_take_buttons").hide();
}

function uploadFilesWebCamOn() {
  $("#patient_uploaded_file_parent, #document_details_parent").hide();
  $("#patient_upload_file_preference_parent, #patient_upload_file_comment_parent").show();
  $("#upload_file_pre_take_buttons_parent").css("display","block");
  $("#upload_file_pre_take_buttons").css("display","block");
  $("#upload_file_post_take_buttons").css("display","none");
  $("#upload_file_camera_parent").show();
  $("#upload_files_from_webcam").addClass("theme-color");
  $("#upload_files_from_computer").removeClass("theme-color");
  $("#upload_file_camera").css("width","400px");
  $("#upload_patient_files").data("source","webcam");
  // $("#profile_pic_flag").val("take-a-picture");
}

function uploadFilesWebCamError() {
  newAlertForModal('danger', 'Not able to access Webcam.', 'upload_files_modal');
}
//shared data bertween two controllers
function getAllLabs() {
  // pouchdb.query({map:labmap,reduce:"_count"}, {startkey: ["Lab", pd_data._id],endkey:["Lab", pd_data._id, {}],reduce:false,group:false}).then(function (data) {
  //   var labs = '';
  //   for (var i = 0; i < data.rows.length; i++) {
  //     labs += '<option value="'+data.rows[i].id+'">'+data.rows[i].value+'</option>';
  //   };
  //   $("#lo_laboratory").html(labs);
  // }).catch(function (err) {
  //   console.log(err);
  // });

  $.couch.db(db).view("tamsa/getLabsByCity", {
    success: function(data) {
      var labs = '';
      for (var i = 0; i < data.rows.length; i++) {
        labs += '<option value="'+data.rows[i].id+'">'+data.rows[i].value+'</option>';
      };
      $("#lo_laboratory").html(labs);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:    ["Lab",pd_data.dhp_code,pd_data.city],
    reduce: false,
    group:  false
  });
}