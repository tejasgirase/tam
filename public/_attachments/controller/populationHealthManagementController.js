var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};
var margin = {top: 0, right: 200, bottom: 0, left: 200},
  width = 800,
  step = 200;
var line_chart_data = {
  "chartLabel": "Compliance",
  "inputData": [{
    "label": "Engagement",
    "data": [0.5,
    0.74,
    0.45,
    0.42,
    0.47,
    0.5,
    0.55,
    0.65,
    0.6,
    0.55,
    0.65,
    0.75],
        "marker": "circle"    
  },
  {
    "label": "Adherence",
    "data": [0.25,
    0.35,
    0.25,
    0.2,
    0.23,
    0.28,
    0.3,
    0.32,
    0.31,
    0.25,
    0.35,
    0.45],
        "marker": "square" 
  },
  {
    "label": "No Tasks",
    "data": [0.15,
    0.18,
    0.01,
    0.12,
    0.15,
    0.05,
    0.15,
    0.17,
    0.05,
    0.1,
    0.12,
    0.03],
        "marker" : "diamond"
  }]
};

var dataPayload = {
  "legend": [{
  "brandName": "Brand1",
  "color": "#0000FF"
  }, {
    "brandName": "Brand2",
    "color": "#20b2aa"
  }, {
    "brandName": "Brand3",
    "color": "#ff0000"
  }, {
    "brandName": "Generic",
    "color": "#87ceeb"
  }],
  "data": [
    {
      "name": "Diabetes",
      "inputData": [
        {
          "y": 20,
          "x": "Brand1"
        },
        {
          "y": 25,
          "x": "Brand2"
        },
        {
          "y": 35,
          "x": "Brand3"
        },
        {
          "y": 30,
          "x": "Generic"
        }
      ]
    },
    {
      "name": "Cholesterol",
      "inputData": [
        {
          "y": 15,
          "x": "Brand1"
        },
        {
          "y": 25,
          "x": "Brand2"
        },
        {
          "y": 10,
          "x": "Brand3"
        },
        {
          "y": 22,
          "x": "Generic"
        }
      ]
    },
    {
      "name": "Hyper Tension",
      "inputData": [
        {
          "y": 25,
          "x": "Brand1"
        },
        {
          "y": 5,
          "x": "Brand2"
        },
        {
          "y": 15,
          "x": "Brand3"
        },
        {
          "y": 10,
          "x": "Generic"
        }
      ]
    },
    {
      "name": "Heart Failure",
      "inputData": [
        {
          "y": 5,
          "x": "Brand1"
        },
        {
          "y": 10,
          "x": "Brand2"
        },
        {
          "y": 20,
          "x": "Brand3"
        },
        {
          "y": 5,
          "x": "Generic"
        }
      ]
    }
  ]
};

var wellnessData = {
  "data":  [{
    "x": 2,
    "y": 0
    },{
    "x": 12,
    "y": 0
    },{
    "x": 17,
    "y": 0
    },{
    "x": 22,
    "y": 2
    }, {
    "x": 27,
    "y": 4
    }, {
    "x": 32,
    "y": 3.5
    }, {
    "x": 37,
    "y": 8
    }, {
    "x": 42,
    "y": 9
    }, {
    "x": 52,
    "y": 10
    }, {
    "x": 57,
    "y": 18
    },{
    "x": 62,
    "y": 20
    },{
    "x": 67,
    "y": 25
    },{
    "x": 72,
    "y": 20
    },{
    "x": 77,
    "y": 15
    },{
    "x": 82,
    "y": 5
    },{
    "x": 87,
    "y": 2
    },{
    "x": 92,
    "y": 0
    },{
    "x": 97,
    "y": 0
    }]
}

var mostRecommendedRxData = {
  "data" : [{
  "value": 1.8,
  "label": "Medication1"
    },{
  "value": 2,
  "label": "Medication2"
  },{
  "value": 2.5,
  "label": "Medication3"
  },{
  "value": 3,
  "label": "Medication4"
  },{
  "value": 3.5,
  "label": "Medication5"
  },{
  "value": 3.8,
  "label": "Medication6"
  },{
  "value": 4.5,
  "label": "Medication7"
  },{
  "value": 5,
  "label": "Medication8"
  },{
  "value" : 9.6,
  "label" :"Medication9"
  },{
  "value" : 9.9,
  "label" :"Medication10"
  }]
}

var mostDiagnosedData = {
  "data" : [{
  "value": 1.8,
  "label": "Astigmatism"
    },{
  "value": 2,
  "label": "Anxiety-related problems"
  },{
  "value": 2.5,
  "label": "Behavioual and emotional problems"
  },{
  "value": 3,
  "label": "Chronik sinusitis"
  },{
  "value": 3.5,
  "label": "Dermatitis and eczema"
  },{
  "value": 3.8,
  "label": "Allergy(undefined)"
  },{
  "value": 4.5,
  "label": "short-sighted/myopla"
  },{
  "value": 5,
  "label": "Long-sighted/hyperopla"
  },{
  "value" : 9.6,
  "label" :"Asthma"
  },{
  "value" : 9.9,
  "label" :"Hayfever and allergic rhinitis"
  }]
}

var options = {start:10,
  legendRectWidth: 10,
  legendRectHeight: 10,
  legend_label_color: 'blue',
  legend_spacing: 15,
  legendY: 9,
  chartWidth:400,
  chartHeight:200,
  innerRadius: 0,
  outerRadius: function(w) {
    return w/2;
  }
};

app.controller("populationHealthManagementController",function($scope,$state,$stateParams,tamsaFactories){
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
            bindingsForPopulationHealthManagementController();
            getActiveDailyDashboardTab();
            tamsaFactories.displayDoctorInformation(data);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
        });
      }
    }
  });

  function bindingsForPopulationHealthManagementController() {
  	$("#population_health_tab").on("click","#daily_dashboard_health_management" ,function(){
  		activateDailyDashboardHealthManagement($(this));
  	});

  	$("#population_health_tab").on("click","#executive_dashboard_health_management" ,function(){
  		activateExecutiveDashboardHealthManagement($(this));
  	});

    $("#population_health_tab").on("click","#medication_switches_from_to" ,function(){
      activateMedicationSwitchTab($(this));
    });

    $("#population_health_tab").on("click","#patient_statistics",function(){
      activatePatientStatisticsTab($(this));
    });

    $("#population_health_tab").on("click","#campaign_dashboard",function(){
      activateCampaignDashboard($(this));
    });

    $("#population_health_tab").on("change","#medication_switch",function(){
      generateDataForMedicationSwitch();
    });

    $("#population_health_tab").on("click",".executive-lbls",function(){
      generateGraphRequestForExecutiveLabels($(this));
    });

    $("#population_health_tab").on("click",".threshold_values",function(){
      $("#population_health_management_patient_list tbody").html("");
      $("#population_health_management_patient_list_pagination").html("");
      $("#export_list").hide();      
      displayPatientListForThresholds($(this));
    });

    $("#population_health_tab").on("click","#total_signups",function(){
      $("#export_list").show();
      $("#population_health_management_patient_list tbody").html("");
      $("#population_health_management_patient_list_pagination").html("");
      displayCampaignSignupList();
    });

    $("#population_health_tab").on("click",".phm_daily_dahsboard",function(){
      generatePHMDailyDashboard($(this));
    });
    // $("#population_health_tab").on("click","#export_list",function(){
    //   console.log($("#export_list").data("export_data"));
    //   exportPatientListAsCSV();
    // });
  }

  function generatePHMDailyDashboard($obj) {
    if(Number($obj.html()) > 0) {
      if($obj.attr("id") == "total_patient_seen") {}
      else{
        createModal("population_health_management_patient_list_modal");
        $("#export_list").hide();
        $("#population_health_management_patient_list_pagination").html("");
        $("#population_health_management_patient_list_header").html($obj.parent().find("span:last").html());
        $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>Age</th><th>Scheduled Date & Time</th><th>Appointment Note</th></tr>");
        $("#population_health_management_patient_list").block({"msg": "Please Wait...."});
        paginationConfiguration($obj.data(),"population_health_management_patient_list_pagination",10,displayDashboardPatientList);
        // displayDashboardPatientList($obj);  
      }
    }else {
      newAlert("danger","No Records availabel.");
    }
  }

  function displayDashboardPatientList(start,end,updata) {
    $("#population_health_management_patient_list tbody").html("");
    for(var i=start;i<end;i++) {
      getDetailsForDashboardPatientList(updata.rows[i].doc,updata.rows.length);
    }
  }

  function getDetailsForDashboardPatientList(appdata,len) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(pdata) {
        if(pdata.rows.length > 0) {
          var temp_data = [];
          temp_data.push("<tr class='pmh-dashboard'>");
          temp_data.push("<td>"+pdata.rows[0].doc.first_nm+" "+pdata.rows[0].doc.last_nm+"</td>");
          temp_data.push("<td>"+pdata.rows[0].doc.user_email+"</td>");
          temp_data.push("<td>"+pdata.rows[0].doc.phone+"</td>");
          temp_data.push("<td>"+(pdata.rows[0].doc.gender ? pdata.rows[0].doc.gender : "NA")+"</td>");
          temp_data.push("<td>"+(pdata.rows[0].doc.age ? pdata.rows[0].doc.age : "NA")+"</td>");
          temp_data.push("<td>"+moment(appdata.reminder_start).format("DD-MM-YYYY hh:mm")+ " -- " +moment(appdata.reminder_end).format("hh:mm a")+"</td>");
          temp_data.push("<td>"+appdata.reminder_note+"</td>");
          temp_data.push("</tr>");
          $("#population_health_management_patient_list tbody").append(temp_data.join(''));
          $('#population_health_management_patient_list').unblock();
        }else {
          console.log(appdata.user_id + "-- >" + appdata._id);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:appdata.user_id,
      include_docs:true
    });
  }

  function displayCampaignSignupList() {
    $.couch.db(personal_details_db).view("tamsa/getTotalSignupsForCampaign", {
      success:function(pdata) {
        if(pdata.rows.length > 0) {
          createModal("population_health_management_patient_list_modal");
          // $("#export_list").hide();
          $("#population_health_management_patient_list_header").html("Patient List");
          $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Age</th><th>HeartRate</th><th>Systolic BP</th><th>Diastolic BP</th><th>Glucose</th></tr>");
          $("#population_health_management_patient_list_pagination").html("");
          for(var i=0;i<pdata.rows.length;i++){
            getALLData(pdata.rows[i].doc,pdata.rows.length);
          }
        }else {
          newAlert("danger","Invalid campaign Id. Please Contact Admin.");
        }
      },
      error:function(data,error,reason) {
        console.log(error);
      },
      key:$("#search_by_campaign_id").val(),
      include_docs:true
    });
  }

  function getALLData(perdata, datalen) {
    $.couch.db(db).view("tamsa/testPatientsInfo", {
      success: function (meddata) {
        if(meddata.rows.length > 0) {
          var output = [];
            output.push('<tr class="signup_list">');
              output.push('<td>'+perdata.first_nm+' '+perdata.last_nm+'</td>');
              output.push('<td>'+(perdata.user_email ? perdata.user_email : "NA")+'</td>');
              output.push('<td>'+(perdata.phone ? perdata.phone : "NA")+'</td>');
              output.push('<td>'+(perdata.age ? perdata.age : "NA")+'</td>');
              output.push('<td>'+(meddata.rows[0].doc.hr ? meddata.rows[0].doc.hr : "NA")+'</td>');
              output.push('<td>'+(meddata.rows[0].doc.Systolic_bp ? meddata.rows[0].doc.Systolic_bp : "NA")+'</td>');
              output.push('<td>'+(meddata.rows[0].doc.Diastolic_bp ? meddata.rows[0].doc.Diastolic_bp : "NA")+'</td>');
              output.push('<td>'+(meddata.rows[0].doc.glucose ? meddata.rows[0].doc.glucose : "NA")+'</td>');
            output.push('</tr>');
          $("#population_health_management_patient_list tbody").append(output.join(''));
          if(Number($(".signup_list").length) == datalen) {
            generateExportCampaignPatientListAsCSV();
          }
        }else {
          console.log(perdata.user_id);
        }
      },
      error: function(data,error,reason) {
        console.log(error);
      },
      key:perdata.user_id,
      include_docs:true
    });
  }

  function displayPatientListForThresholds($obj) {
    if($obj.data("type") == "heartrate") {
      var patient_list = $("#threshold_graph_parent").data("heartrate");
      if(patient_list.length != 0) displayHRPatientList(patient_list)
      else  {
        newAlert("danger", "no records are availabel.");
      }
    }else if($obj.data("type") == "systolic") {
      var patient_list = $("#threshold_graph_parent").data("systolic");
      if(patient_list.length != 0) displayHRPatientList(patient_list);
      else {
        newAlert("danger", "no records are availabel.");
      }
    }else if($obj.data("type") == "diastolic") {
      var patient_list = $("#threshold_graph_parent").data("diastolic");
      if(patient_list.length != 0) displayHRPatientList(patient_list);
      else {
        newAlert("danger", "no records are availabel.");
      }
    }else if($obj.data("type") == "glucose") {
      var patient_list = $("#threshold_graph_parent").data("glucose");
      if(patient_list.length != 0) displayHRPatientList(patient_list);
      else {
        newAlert("danger", "no records are availabel.");
      }
    }else {
    }
  }

  function displayHRPatientList(patient_list) {
    createModal("population_health_management_patient_list_modal");
    $("#export_list").hide();
    $("#population_health_management_patient_list_header").html("Patient List");
    $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Age</th><th>HeartRate</th><th>Systolic BP</th><th>Diastolic BP</th><th>Glucose</th></tr>");
    $("#population_health_management_patient_list_pagination").html("");
    var output = [];
    for(var i=0;i<patient_list.length;i++){
      getPatientInformationForThreshold(patient_list[i],"heartrate");
    }
  }

  function displaySBPPatientList(patient_list) {
    createModal("population_health_management_patient_list_modal");
    $("#export_list").hide();
    $("#population_health_management_patient_list_header").html("Patient List");
    $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Age</th><th>HeartRate</th><th>Systolic BP</th><th>Diastolic BP</th></tr>");
    $("#population_health_management_patient_list_pagination").html("");
    var output = [];
    for(var i=0;i<patient_list.length;i++){
      getPatientInformationForThreshold(patient_list[i], "systolic_bp");
    }
  }

  function displayDBPPatientList(patient_list) {
    createModal("population_health_management_patient_list_modal");
    $("#export_list").hide();
    $("#population_health_management_patient_list_header").html("Patient List");
    $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Age</th><th>HeartRate</th><th>Systolic BP</th><th>Diastolic BP</th></tr>");
    $("#population_health_management_patient_list_pagination").html("");
    var output = [];
    for(var i=0;i<patient_list.length;i++){
      getPatientInformationForThreshold(patient_list[i],"diastolic_bp");
    }
  }

  function displayGlucosePatientList() {
    createModal("population_health_management_patient_list_modal");
    $("#export_list").hide();
    $("#population_health_management_patient_list_header").html("Patient List");
    $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Age</th><th>HeartRate</th><th>Systolic BP</th><th>Diastolic BP</th></tr>");
    $("#population_health_management_patient_list_pagination").html("");
    for(var i=0;i<patient_list.length;i++){
      getPatientInformationForThreshold(patient_list[i],"diastolic_bp");
    } 
  }

  function getPatientInformationForThreshold(listdata,type3) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success: function (pdata) {
        if(pdata.rows.length > 0) {
          var output = [];
          output.push('<tr>');
            output.push('<td>'+pdata.rows[0].doc.first_nm+' '+pdata.rows[0].doc.last_nm+'</td>');
            output.push('<td>'+(pdata.rows[0].doc.user_email ? pdata.rows[0].doc.user_email : "NA")+'</td>');
            output.push('<td>'+(pdata.rows[0].doc.phone ? pdata.rows[0].doc.phone : "NA")+'</td>');
            output.push('<td>'+(pdata.rows[0].doc.age ? pdata.rows[0].doc.age : "NA")+'</td>');
            output.push('<td>'+(listdata.hr ? listdata.hr : "NA")+'</td>');
            output.push('<td>'+(listdata.Systolic_bp ? listdata.Systolic_bp : "NA")+'</td>');
            output.push('<td>'+(listdata.Diastolic_bp ? listdata.Diastolic_bp : "NA")+'</td>');
            output.push('<td>'+(listdata.glucose ? listdata.glucose : "NA")+'</td>');
          output.push('</tr>');
          $("#population_health_management_patient_list tbody").append(output.join(''));          
        }
      },
      error:function(data,error,reason){
        console.log(reason);
        // newAlert("danger",reason);
        // $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:listdata.user_id,
      include_docs:true
    });
  }

  function activateDailyDashboardHealthManagement($obj) {
    $obj.parent().find("div").removeClass("ChoiceTextActive");
    $obj.addClass("ChoiceTextActive");
    $(".check-show").hide();
    $("#daily_dashboard_list_tab").show();
  }

  function activateExecutiveDashboardHealthManagement($obj) {
    $obj.parent().find("div").removeClass("ChoiceTextActive");
    $obj.addClass("ChoiceTextActive");
    $(".check-show").hide();
    $("#executive_dashboard_list_tab").show();
    $("#medication_switch_graph").html("");
    activateDateRangePicker("pmh_executive_patient_range",generatePatientGraphAtExecutiveDashboard);
    $("#demographics").block({"msg":"Please Wait...."});
    generateDemographicAtExecutiveDasboard();
    new InitChart(dataPayload,160,200,{top: 20,right: 20,bottom: 20,left: 10});
    var bar_margin = {top: 20, right: 10, bottom: 30, left: 250};
    barChart.draw('#mostdiagnosed', mostDiagnosedData, bar_margin, 500 - bar_margin.left - bar_margin.right, 300 - bar_margin.top - bar_margin.bottom );
    barChart.draw('#mostrecommendedrx', mostRecommendedRxData, bar_margin, 500 - bar_margin.left - bar_margin.right, 300 - bar_margin.top - bar_margin.bottom );
    generatePatientGraphAtExecutiveDashboard();
    // stackedBarChart.draw({top: 12,left: 60,right: 24,bottom: 24},{width: 250},payload.visitsData, "#patientBreakupByVisitType", 'day');
  }

  function activateMedicationSwitchTab($obj) {
    $obj.parent().find("div").removeClass("ChoiceTextActive");
    $obj.addClass("ChoiceTextActive");
    $(".check-show").hide();
    $("#medication_switch_from_to_tab").show();
    $("#switching_medication_label_parent").hide();
    $("#medication_switch_graph").html("");
    getDHPMedicationList();
  }

  function activatePatientStatisticsTab($obj) {
    $obj.parent().find("div").removeClass("ChoiceTextActive");
    $obj.addClass("ChoiceTextActive");
    $(".check-show").hide();
    $("#patient_statistics_tab").show();
    $("#monthChart, #percentContainer").html("");
    getPatientStatistics();
  }

  function activateCampaignDashboard($obj) {
    $obj.parent().find("div").removeClass("ChoiceTextActive");
    $obj.addClass("ChoiceTextActive");
    $(".check-show").hide();
    $("#campaign_dashboard_tab").show();
    $("#fscore, #mscore, #nscore, #wellness, #aggregate_recommendations").html("");
    scoreChart.draw(['#fscore', '#mscore', '#nscore'],250, 150, 100, "data/scores.json");
    wellnessChart.draw('#wellness', wellnessData, 800,300,{top: 20,right: 20,bottom: 20,left: 50});
    barsWithoutAxes.draw('#aggregate_recommendations', [20,10,20,200],400,400,"data/vitamin-data.json");
    activateAutocompleterOnSearchByCampaignId();
    // $("#export_list").data("export_datatype","campaign_list");
    $("#export_list").data("export_datatype",0);
  }

  function activateAutocompleterOnSearchByCampaignId() {
    $("#search_by_campaign_id").autocomplete({
      search: function(event, ui) { 
         $("#search_by_campaign_id").addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/getDHPCampaigns", {
          success: function(data) {
            response(data.rows);
            $("#search_by_campaign_id").removeClass('myloader');
          },
          error: function(status) {
            console.log(status);
          },
          key:pd_data.dhp_code,
          include_docs:true
        });
      },
      focus: function(event, ui) {
        $("#search_by_campaign_id").val(ui.item.doc.campaign_id);
        return false;
      },
      minLength: 1,
      select: function( event, ui ) {
        displaySelectedCampiagnDetails(ui);
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
        //$("#search_by_campaign_id").removeClass('myloader');
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
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>"+ item.doc.campaign_id + "</a>")
          .appendTo(ul);
      }
    };
  }

  function displaySelectedCampiagnDetails(ui) {
    $("#campaign_details_parent").removeClass("no-display");
    $("#campaign_id_parent").find("b").html(ui.item.doc.campaign_id);
    $("#campaign_name").html((ui.item.doc.campaign_name ? ui.item.doc.campaign_name : "Campaign Name"));
    getTotalSignupsForCampaign(ui.item.doc.campaign_id);
    getCompanyDetailsForCampaign(ui.item.doc.campaign_id);
    getCampaignVitalSignsGraph(ui.item.doc.campaign_id);
    $.couch.db(db).openDoc("lab_reference_value", {
      success:function(labdata) {
        getUserVitalsDataForCampaign(ui.item.doc.campaign_id,labdata);
      },
      error:function(data,error,reason){
        console.log(error);
        return false;
      }
    });
  }

  function getCampaignVitalSignsGraph(campaign_id) {
    $.couch.db(db).openDoc("lab_reference_value", {
      success: function(data) {
        // var lipid_profile = data.reference_values[0].Lipid_Profile;
        // if(lipid_profile[0].field_name -- )
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function getTotalSignupsForCampaign(campaign_id) {
    $.couch.db(personal_details_db).view("tamsa/getTotalSignupsForCampaign", {
      success:function(data) {
        if(data.rows.length > 0 ) {
          var age = 0,bmi=0;
          var master_bmi = [];
          for(var i=0;i<data.rows.length;i++){
            //console.log(calculatePatientBMI(data.rows[i].doc.height,data.rows[i].doc.weight));
            if(data.rows[i].doc.age) {
              age += (data.rows[i].doc.age ? Number(data.rows[i].doc.age) : 0);
            }
            // bmi += (Number(data.rows[i].doc.weight) && Number(data.rows[i].doc.height) ? 
            //           calculatePatientBMI(data.rows[i].doc.height,data.rows[i].doc.weight) : 0);
            //   if(bmi > 25) master_bmi.push(data.rows[i].doc) 
          }
          // var bmi_percentage = (master_bmi.length / data.rows.length) * 100;
          var age_percentage = (age/data.rows.length).toFixed(0);
          //$("#bmi_threshold").html(bmi_percentage);
          $("#total_signups").html(data.rows.length);
          $("#average_age").html(age_percentage);
        }else {
          $("#total_signups, #average_age").html("0");
        }
      },
      error:function(data,error,reason){
        console.log(error);
        return false;
      },
      key:campaign_id,
      include_docs:true
    });
  }

  function getUserVitalsDataForCampaign(campaign_id,labdata) {
    $.couch.db(db).view("tamsa/getUserVitalsDataForCampaign", {
      success:function(data) {
        if(data.rows.length > 0 ) {
          // var sys_range = labdata.reference_values[0].Blood_Pressure[0].values[0].Emergency;
          // var dia_range = labdata.reference_values[0].Blood_Pressure[1].values[0].Emergency;
          var sys_range = 120;
          var dia_range = 80;
          var glucose_range = 200;
          var SPO2 = 120;
          var heartrate=[],systolic_bp=[],diastolic_bp=[], glucose= [];
          var master_heartrate = [], 
              master_systolic_bp = [],
              master_glucose = [],
              master_SPO2 = [];
              master_diastolic_bp = [];
          for(var i=0;i<data.rows.length;i++) {
            // console.log(calculatePatientBMI(data.rows[i].doc.height,data.rows[i].doc.weight));
            // bmi += (Number(data.rows[i].doc.weight) && Number(data.rows[i].doc.height) ? 
            //           calculatePatientBMI(data.rows[i].doc.height,data.rows[i].doc.weight) : 0);
            //   if(bmi > 25) master_bmi.push(data.rows[i].doc) 
            //   
            if(Number(data.rows[i].doc.hr)) {
              if(Number(data.rows[i].doc.hr) > 75) {
                heartrate.push(data.rows[i].doc);
              }
              master_heartrate.push(data.rows[i].doc);
            }
            if(Number(data.rows[i].doc.Systolic_bp)) {
              if(Number(data.rows[i].doc.Systolic_bp) >= sys_range) {
                systolic_bp.push(data.rows[i].doc.Systolic);
              }
              master_systolic_bp.push(data.rows[i].doc);
            }
            if(Number(data.rows[i].doc.Diastolic_bp)) {
              if(Number(data.rows[i].doc.Diastolic_bp) >= dia_range) {
                diastolic_bp.push(data.rows[i].doc);
              }
              master_diastolic_bp.push(data.rows[i].doc);
            }
            if(Number(data.rows[i].doc.glucose)) {
              if(Number(data.rows[i].doc.glucose) > glucose_range) {
                glucose.push(data.rows[i].doc);
              }
              master_glucose.push(data.rows[i].doc);
            }
          }
          $("#threshold_graph_parent").html("");
          if(master_heartrate.length > 0) {
            var heartrate_percentage = (heartrate.length / master_heartrate.length) * 100;
            $("#threshold_graph_parent").append('<div class="col-lg-3"><h4>HeartRate &gt; 75</h4><div data-type="heartrate" class="threshold threshold_values">'+heartrate_percentage.toFixed(1)+'%</div></div>');
            $("#threshold_graph_parent").data("heartrate", heartrate);
          }
          if(master_systolic_bp.length > 0) {
            var systolic_percentage = (systolic_bp.length / master_systolic_bp.length) * 100;
            $("#threshold_graph_parent").append('<div class="col-lg-3"><h4>Systolic BP &gt; '+sys_range+'</h4><div data-type="systolic" class="threshold threshold_values">'+systolic_percentage.toFixed(1)+'%</div></div>');
            $("#threshold_graph_parent").data("systolic", systolic_bp);
          }
          if(master_diastolic_bp.length > 0) {
            var diastolic_percentage = (diastolic_bp.length / master_diastolic_bp.length) * 100;
            $("#threshold_graph_parent").append('<div class="col-lg-3"><h4>Diastolic BP &gt; '+dia_range+'</h4><div data-type="diastolic" class="threshold threshold_values">'+diastolic_percentage.toFixed(1)+'%</div></div>');
            $("#threshold_graph_parent").data("diastolic", diastolic_bp);
          }
          if(master_glucose.length > 0) {
            var glucose_percentage = (glucose.length / master_glucose.length) * 100;
            $("#threshold_graph_parent").append('<div class="col-lg-3"><h4>Glucose &gt; 200</h4><div data-type="glucose" class="threshold threshold_values">'+glucose_percentage.toFixed(1)+'%</div></div>');
            $("#threshold_graph_parent").data("glucose", glucose);
          }
        }else {
          //$("#total_signups, #average_age").html("0");
        }
      },
      error:function(data,error,reason){
        console.log(error);
        return false;
      },
      key:campaign_id,
      include_docs:true
    });
  }

  function getCompanyDetailsForCampaign(campaign_id) {
    $.couch.db(db).view("tamsa/getCompanyDetailsForCampaign", {
      success:function(data) {
        if(data.rows.length > 0 ) {
          $("#company_host").html((data.rows[0].doc.company_name ? data.rows[0].doc.company_name : "Company Name"));
        }else {
          $("#company_host").html("Company Name");
        }
      },
      error:function(data,error,reason){
        console.log(error);
        return false;
      },
      key:campaign_id,
      include_docs:true
    });
  }

  function generateGraphRequestForExecutiveLabels($obj) {
    if($obj.attr("id") == "executive_cancellation_rates") {
      generateCancellationRates();
    }
  }

  function generateCancellationRates() {
    $.couch.db(db).view("tamsa/getAppointmentsByDhpId", {
      success: function(data) {
        if(data.rows.length > 0) {
          var cancel_count = 0, total_count = 0;
          for(var i=0;i<data.rows.length;i++){
            if(data.rows[i].doc.status == "cancelled") {
              cancel_count++;
            }else {
              total_count++;
            }
          }
        }else {

        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data.dhp_code],
      endkey:[pd_data.dhp_code, {}],
      include_docs:true
    });
  }

  function getPatientStatistics() {
    $('#patient_bmi_statistics_parent, #patient_gender_statistics_parent, #percentContainer').block({ message: "Loading....",centerX: true, centerY: true}); 
    $.couch.db(db).list("tamsa/getSubscribersMedicationInfoList", "getDhpSubscibersWithMedicalInfo", {
      dhp_code:pd_data.dhp_code,
      include_docs: true
    }).success(function (data) {
      $('#patient_bmi_statistics_parent, #percentContainer').unblock();
      drawPieChart('#patient_bmi_statistics',100,100,20,data.rows,data.overweight,data.normal,data.underweight,options);
      drawPercentageChart('#percentContainer',50,51,150,90,"#34DDDD","24px","12px",data.patient_data,data.cholesterol_visualize_data,data.diabetes_visualize_data,data.hypertension_visualize_data);
    }).error(function (error,reason) {
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    });

    $.couch.db(db).list("tamsa/getSubscribersByGenderList", "getDHPSubscribers", {
    startkey:[pd_data.dhp_code],
    endkey:[pd_data.dhp_code, {}],
    reduce:false,
    include_docs:true
    }).success(function (data) {
      $('#patient_gender_statistics_parent').unblock();
      drawPieChart('#patient_gender_statistics', 100,100,20, data.rows,data.male_list,data.female_list,"",options);
    }).error(function (data) {
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    });
    drawLineChart('#monthChart',[50, 40, 40, 40], 650, 300, line_chart_data, 8, 8);
  }

  function generateDataForMedicationSwitch() {
    if($("#").val() == "Select Medication") {
      $("#medication_switch_graph").html("<span class='danger'>No medication is selected.</span>");
      $("#switching_medication_label_parent").show();
    }else {
      $.couch.db(db).view("tamsa/getMedicationSwitchRecords", { 
        success: function (meddata) {
          var medlen = meddata.rows.length
          if(medlen > 0) {
            $.couch.db(db).view("tamsa/getMedicationSwitchRecords", { 
              success: function (data) {
                if(data.rows.length > 0) {
                  var medication_switch = {},
                      from_final_obj,
                      to_final_obj,
                      temp_swfrom = [],
                      temp_swto   = [];
                  medication_switch.fromMedication = [];
                  for(var i=0;i<data.rows.length;i++){
                    if(data.rows[i].doc.current_drug_switched_from) {
                      if(temp_swfrom.length > 0) {
                        var obj = temp_swfrom.filter(function (obj) {
                            return obj.name === data.rows[i].doc.current_drug_switched_from;
                        });
                        if(obj.length > 0 ) {
                          obj[0].switchPercent = Number(obj[0].switchPercent) + 1;
                        }else {
                          temp_swfrom.push({
                            name: data.rows[i].doc.current_drug_switched_from,
                            switchPercent: 1
                          });    
                        }
                      }else {
                        temp_swfrom.push({
                          name: data.rows[i].doc.current_drug_switched_from,
                          switchPercent: 1
                        });
                      }
                    }
                    if(data.rows[i].doc.current_drug_switched_to) {
                      if(temp_swto.length > 0) {
                        var obj = temp_swto.filter(function (obj) {
                            return obj.name === data.rows[i].doc.current_drug_switched_to;
                        });
                        if(obj.length > 0 ) {
                          obj[0].switchPercent = Number(obj[0].switchPercent) + 1;
                        }else {
                          temp_swto.push({
                            name: data.rows[i].doc.current_drug_switched_to,
                            switchPercent: 1
                          });    
                        }
                      }else {
                        temp_swto.push({
                          name: data.rows[i].doc.current_drug_switched_to,
                          switchPercent: 1
                        });
                      }
                    }
                  }
                  for(var i=0;i<temp_swfrom.length;i++){
                    temp_swfrom[i].switchPercent = ((Number(temp_swfrom[i].switchPercent) / medlen) * 100).toFixed(1);
                  }
                  for(var i=0;i<temp_swto.length;i++){
                    temp_swto[i].switchPercent = ((Number(temp_swto[i].switchPercent) / medlen) * 100).toFixed(1);
                  }
                  var payload = {
                    "fromMedication": temp_swfrom,
                    "toMedication": temp_swto,
                    "medicationName": $("#medication_switch").val()
                  }
                  displayMedicationSwitchGraph(payload);
                }else {
                  $("#medication_switch_graph").html("<span class='col-lg-12 text-danger'>No Records Found for selected medication.</span>");
                  $("#switching_medication_label_parent").hide();
                }
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              },
              key:[1,pd_data.dhp_code,$("#medication_switch").val()],
              include_docs:true
            });
          }else {
            $("#medication_switch_graph").html("<span class='col-lg-12 text-danger'>No Records Found for selected medication.</span>");
            $("#switching_medication_label_parent").hide();
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:[0,pd_data.dhp_code,$("#medication_switch").val()],
        include_docs:true
      });  
    }
  }

  function displayMedicationSwitchGraph(payload) {
    $("#medication_switch_graph").html("");
    $("#switching_medication_label_parent").show();
    $(".switching_medication_label").html(payload.medicationName);
    switchedMedication(payload.medicationName, payload.fromMedication, payload.toMedication);    
  }

  function getDHPMedicationList($obj) {
    $.couch.db(db).view("tamsa/getUniqueMedicationList", {
      success: function(data) {
        if(data.rows.length > 0) {
          var output = [];
          output.push('<option>Select Medication</option>');
          for(var i=0;i<data.rows.length;i++) {
            output.push('<option>'+data.rows[i].key[1].trim()+'</option>');
          }
          $("#medication_switch").html(output);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey: [pd_data.dhp_code],
      endkey: [pd_data.dhp_code, {}],
      reduce : true,
      group : true
    });
  }

  function getActiveDailyDashboardTab(){
  	$("#daily_dashboard_health_management").parent().find("div").removeClass("ChoiceTextActive");
  	$("#daily_dashboard_health_management").addClass("ChoiceTextActive");
  	$(".check-show").hide();
  	$("#daily_dashboard_list_tab").show();
  	getDailyDashboardScheduledOnline("patinet_scheduled_online");
  }

  function getDailyDashboardScheduledOnline(id, schedule_status){
    var status  = schedule_status || {};
  	$.couch.db(db).view("tamsa/getAppointmentsByDhpId" ,{
  		success:function(data) {
  			if(data.rows.length > 0){
  				$("#"+id).html(data.rows.length).data(data);
          if(id == "patinet_scheduled_online") getDailyDashboardScheduledOnline("patient_cancellations","cancelled")
          if(id == "patient_cancellations") {
            getDailyDashboardScheduledOnline("patient_no_show","no_show");
          }
          if(id == "patient_no_show") {
            updateTotalPatientSeenCount();
          }
  			}else{
  				$("#"+id).html("NA");
  			}
  		},
  		error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
  		startkey:[pd_data.dhp_code],
  		endkey:[pd_data.dhp_code,status],
  		include_docs:true
  	});
  }

  function updateTotalPatientSeenCount() {
    var total_scheduled = Number($("#patinet_scheduled_online").html()),
        total_cancelled = Number($("#patient_cancellations").html()),
        total_noshow    = Number($("#patient_no_show").html()),
        total_seen      = total_scheduled - (total_cancelled + total_noshow);
    $("#total_patient_seen").html((total_seen ? total_seen : 0));
  }

  function linkType(d) {
    return d.target.type.split(/\s+/).map(function(t) { return "to-" + t; })
        .concat(d.source.type.split(/\s+/).map(function(t) { return "from-" + t; }))
        .join(" ");
  }
      
  function reset(g, scale, direction, maxWidth) {
      g.selectAll("*")
        .style("stroke-opacity", null)
        .style("fill-opacity", null)
        .style("display", null);

      var node = g.selectAll(".node g")
        .attr("class", function(d) { return d.type; })
        .attr("transform", function(d, i) { return "translate(" + d.depth * step + "," + d.x + ")"; });

      g.selectAll(".link path")
        .attr("class", linkType)
        .attr("style", function (d) {
          if (!!scale) {
              if ("switchPercent" in d.source) {
                  return "stroke-width:" + scale(d.source.switchPercent) + "px;";        
              } else if ("switchPercent" in d.target) {
                  return "stroke-width:" + scale(d.target.switchPercent) + "px;";        
              }
          }
          return "stroke-width:1.5px;";    
        })    
        .attr("d", d3.svg.diagonal()
          .source(function(d) { var obj = {y: d.source.depth * step + (d.source.flipped ? -1 : +1) * d.source.width , x: d.source.x };
                               return obj;})
          .target(function(d) { var obj = {y: d.target.depth * step, x: d.target.x}; 
                               return obj;
                              })
          .projection(function(d) { return [d.y, d.x]; }));


      g.selectAll(".bar g")
          .attr("transform", function (d){
              var obj = {y: (direction === "right") ?(d.target.depth * step - maxWidth) : (d.target.depth * step + maxWidth), x: d.target.x};
              return "translate(" + obj.y + "," + obj.x + ")";
          });
      g.selectAll(".bar g >path")
        .attr("style", function (d) {
          if (!!scale) {
              if ("switchPercent" in d.source) {
                  return "stroke-width:" + scale(d.source.switchPercent) + "px;" ;       
              } else if ("switchPercent" in d.target) {
                  return "stroke-width:" + scale(d.target.switchPercent) + "px;" ;       
              }
          }
          return "stroke-width:1.5px;";    
        })
      .attr("d", function(d) {
          return "M" + 0  + "," + 0 + "L" + ((direction === "right")?( - 50 ) : ( + 50 )) + ",0" ;
       });
      g.selectAll(".bar g > text")
          .attr("x", function (){
              return ((direction === "right")?( - 85 ) : ( + 55 ));
          })
          .text(function(d) {
              if ("switchPercent" in d.source) {
                  return d.source.switchPercent + "%";        
              } else if ("switchPercent" in d.target) {
                  return d.target.switchPercent + "%";        
              }
          });
  }
      
  function drawTree(leftRoot, rightRoot, outerHeight, svg, direction, scale) {
    //if (arguments.length < 3) outerHeight = rightRoot rightRoot = null;

    var height = outerHeight - margin.top - margin.bottom;

    var tree = d3.layout.tree()
        .size([height, 1])
        .separation(function() { return 1; });
    var g = svg.selectAll("g" + '.' + direction)
        .data([].concat(
          leftRoot ? {type: "left", nodes: tree.nodes(leftRoot)} : [],
          rightRoot ? {type: "right", nodes: tree.nodes(rightRoot).map(flip), flipped: true} : []
        ))
      .enter().append("g")
        .attr("class", function(d) { return d.type; })
        .attr("transform", function(d) {
            return "translate(" + (width+margin.left)/2 + "," + margin.top + ")"; 
        });

    var link = g.append("g")
        .attr("class", "link")
      .selectAll("path")
        .data(function(d) {
            return tree.links(d.nodes); })
      .enter().append("path")
        .attr("class", linkType);

    var group_bar_text = g.append("g")
        .attr("class", "bar")
      .selectAll("path")
        .data(function(d) {
            return tree.links(d.nodes); })
      .enter().append("g");
      
    group_bar_text.append("path")
        .attr("class", "quantity");
    group_bar_text.append("text")
        .attr("dy", ".35em");    
      
    var node = g.append("g")
        .attr("class", "node")
      .selectAll("g")
        .data(function(d) { return d.nodes; })
      .enter().append("g")
        .attr("class", function(d) { return d.type; });
    var maxWidth = 10;    
    node.append("text")
        .attr("dy", ".35em")
        .text(function(d,i) { if (i === 0) return "";
                              else return d.name; })
        .each(function(d) { d.width = Math.max(43, this.getComputedTextLength() + 12); if (maxWidth < d.width) maxWidth = d.width;})
        .attr("x", function(d) { return d.flipped ? 6 - d.width : 6; });

    //"join" in d;
    //Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
      
    node.filter(function(d) {
          return "join" in d; }).insert("path", "text")
        .attr("class", "join");
    reset.call({}, g, scale, direction, maxWidth);
      
    function flip(d) {
      d.depth *= -1;
      d.flipped = true;
      return d;
    }

    return svg;
  }

  function addPropertyToAllItemsInArray(arr, propertyName, propertyValue) {
    return arr.map(function(obj) {
        obj[propertyName] = propertyValue;
        return obj;
    });
  } 

  function switchedMedication(medicationName, fromMedication, toMedication) {
    var height = 24 * d3.max([fromMedication.length, toMedication.length]) - margin.top - margin.bottom,
        svg = d3.select("#medication_switch_graph").append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .style("width", "inherit")
      .style("margin", "1em 0 1em; ");
    fromMedication = fromMedication.sort(function(a,b){ return a.switchPercent < b.switchPercent;}); 
    toMedication = toMedication.sort(function(a,b){ return a.switchPercent < b.switchPercent;});
    var minValue = d3.min([d3.min(fromMedication,function(d){return d.switchPercent;}), d3.min(toMedication,function(d){return d.switchPercent;})]),
    maxValue = d3.max([d3.max(fromMedication,function(d){return d.switchPercent;}), d3.max(toMedication,function(d){return d.switchPercent;})]),
    scale = d3.scale.linear().domain([minValue, maxValue]).range([1.5, 15]);
    drawTree(
       null,
      {type: "medication", name: "Lipitor", children: addPropertyToAllItemsInArray(fromMedication, "type", "datum")},
      24 * fromMedication.length, svg , 'right', scale
    );  
    svg.append("g").attr("transform", "translate(" + (width/2 + (margin.left + margin.right)/4) + ", " + (height + margin.top + margin.bottom)/2 + ")" )
        .append("text")
        .attr("dy", ".35em")
        .attr("style", "text-anchor:middle;color:#f2bb5c;")
        .text(medicationName);
    drawTree(
      {type: "medication", name: "Lipitor", children: addPropertyToAllItemsInArray(toMedication, "type", "datum")}, null,
      24 * toMedication.length, svg , 'left', scale
    );    
  }   

  function displayPatientBMIList(data,type) {
    if(data.length > 0) {
      createModal("population_health_management_patient_list_modal");
      $("#population_health_management_patient_list_header").html("Patient List with BMI "+type);
      $("#population_health_management_patient_list_pagination").html("");
      $("#export_list").show();
      $("#export_list").data("export_datatype",0);
      var mydata = {rows:data};
      paginationConfiguration(mydata,"population_health_management_patient_list_pagination",10,displayPHMBMIPatientList);
      generateExportBMIPatientListAsCSV(data);
    }else {
      newAlert("danger","No Record Founds.");
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  }

  function displayPHMBMIPatientList(start,end,data) {
    $("#population_health_management_patient_list thead").html('<tr><th>Patient Name</th><th>Age</th><th>Email</th><th>Contact No</th><th>Height (cms)</th><th>Weight (kg)</th><th>Bmi</th></tr>');
    var output = [];
    $('#population_health_management_patient_list').block({ message: "Fetching Data....",centerX: true, centerY: true});
    for(var i=start; i<end; i++) {
      output.push('<tr class="bmi_details" data-user_id="'+data.rows[i].user_id+'">');
      output.push('<td class="bmi_list_name">Fetching Details...</td>');
      output.push('<td class="bmi_list_age">...</td>');
      output.push('<td class="bmi_list_email">...</td>');
      output.push('<td class="bmi_list_phone">...</td>');
      output.push('<td>'+data.rows[i].height+'</td>');
      output.push('<td>'+data.rows[i].weight+'</td>');
      output.push('<td>'+data.rows[i].bmi+'</td>');
      output.push('</tr>');
    }
    $("#population_health_management_patient_list tbody").html(output.join(''));
    var bmi_len = $(".bmi_details").length;
    $(".bmi_details").each(function(i) {
      if(i == (bmi_len -1)) {
        $('#population_health_management_patient_list').unblock();
      } else {
      }
      displayPMHBMIWithDetails($(this));
    });
  }

  function displayPMHBMIWithDetails($obj) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(data) {
        if(data.rows.length > 0) {
          $obj.find(".bmi_list_name").html(data.rows[0].doc.first_nm + " "+data.rows[0].doc.last_nm);
          $obj.find(".bmi_list_age").html((data.rows[0].doc.age ? data.rows[0].doc.age : "NA"));
          $obj.find(".bmi_list_email").html((data.rows[0].doc.user_email ? data.rows[0].doc.user_email : "NA"));
          $obj.find(".bmi_list_phone").html((data.rows[0].doc.phone ? data.rows[0].doc.phone : "NA"));
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:$obj.data("user_id"),
      include_docs:true
    });  
  }

  function generateExportBMIPatientListAsCSV(data) {
    var export_data = [];
    for(var i=0;i<data.length;i++) {
      getAllPatientInformationForBMI(i,data,export_data);
    }
  }

  function getAllPatientInformationForBMI(i,pdata,exp_data) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(mdata) {
        if(mdata.rows.length > 0) {
          var temp_export_data = [mdata.rows[0].doc.first_nm + " " + mdata.rows[0].doc.last_nm, (mdata.rows[0].doc.age ? mdata.rows[0].doc.age : ""), mdata.rows[0].doc.user_email, mdata.rows[0].doc.phone, pdata[i].height, pdata[i].weight, pdata[i].bmi];
          exp_data[i] = temp_export_data;
          // console.log(i +" --> "+ (exp_data.length - 1));
          if(i == (pdata.length - 1)) {
            var header = ["Patient Name","Age","Email","Phone","Height","Weight","BMI"];
            exp_data.unshift(header);
            var csvContent = "data:text/csv;charset=utf-8,";
            console.log(exp_data.length);
            exp_data.forEach(function(infoArray, index){
               dataString = infoArray.join(",");
               csvContent += ((index < exp_data.length) ? dataString+ "\n" : dataString);
            });
            var encodedUri = encodeURI(csvContent);
            $("#export_list").attr("href",encodedUri);
            $("#export_list").attr("download", "list.csv");
          }
        }else {
          console.log(pdata[i].user_id);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:pdata[i].user_id,
      include_docs:true
    });
  }

  function displayPatientListForPHMGender(data,type) {
    if(data.length > 0) {
      createModal("population_health_management_patient_list_modal");
      $("#population_health_management_patient_list_header").html("Patient List ("+type+")");
      $("#export_list").show();
      $("#export_list").data("export_datatype",0);
      var mydata = {rows:data};
      paginationConfiguration(mydata,"population_health_management_patient_list_pagination",10,displayPHMPatientList);
      $("#export_list").data("export_datatype",0);
      // generateExportBMIPatientListAsCSV(data)
      generateExportGenderPatientListAsCSV(data);
    }else {
      newAlert("danger","No Record Founds.");
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  }

  function displayPHMPatientList(start,end,data) {
    $("#population_health_management_patient_list thead").html('<tr><th>Patient Name</th><th>Age</th><th>Email</th><th>Contact No</th><th>Patient DHP ID</th></tr>');
    var output = [];
    $('#population_health_management_patient_list').block({ message: "Fetching Data....",centerX: true, centerY: true});
    for(var i=start; i<end; i++) {
      output.push('<tr class="gender_details" data-user_id="'+data.rows[i].user_id+'">');
      output.push('<td class="gender_list_name">Fetching Details...</td>');
      output.push('<td class="gender_list_age">...</td>');
      output.push('<td class="gender_list_email">...</td>');
      output.push('<td class="gender_list_phone">...</td>');
      output.push('<td class="gender_list_dhp_id">...</td>');
      output.push('</tr>');
    }
    $("#population_health_management_patient_list tbody").html(output.join(''));
    var gen_len = $(".gender_details").length;
    $(".gender_details").each(function(i) {
      if(i == (gen_len -1)) {
        $('#population_health_management_patient_list').unblock();
      }
      displayPMHGenderWithDetails($(this));
    });
  }

  function displayPMHGenderWithDetails($obj) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(data) {
        if(data.rows.length > 0) {
          $obj.find(".gender_list_name").html(data.rows[0].doc.first_nm + " "+data.rows[0].doc.last_nm);
          $obj.find(".gender_list_age").html((data.rows[0].doc.age ? data.rows[0].doc.age : "NA"));
          $obj.find(".gender_list_email").html((data.rows[0].doc.user_email ? data.rows[0].doc.user_email : "NA"));
          $obj.find(".gender_list_phone").html((data.rows[0].doc.phone ? data.rows[0].doc.phone : "NA"));
          $obj.find(".gender_list_dhp_id").html((data.rows[0].doc.patient_dhp_id ? data.rows[0].doc.patient_dhp_id : "NA"));
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:$obj.data("user_id"),
      include_docs:true
    });  
  }

  function generateExportGenderPatientListAsCSV(data) {
    var export_data = [];
    for(var i=0;i<data.length;i++) {
      getAllPatientInformationForGender(i,data,export_data);
    }
  }

  function getAllPatientInformationForGender(i,pdata,exp_data) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(mdata) {
        if(mdata.rows.length > 0) {
          // var full_address = (mdata.rows[0].doc.address1 ? mdata.rows[0].doc.address1+(mdata.rows[0].doc.address2 ? (" "+mdata.rows[0].doc.address2) : "") : "");
          var temp_export_data = [mdata.rows[0].doc.first_nm + " " + mdata.rows[0].doc.last_nm, (mdata.rows[0].doc.age ? mdata.rows[0].doc.age : ""), mdata.rows[0].doc.user_email, mdata.rows[0].doc.phone, mdata.rows[0].doc.patient_dhp_id];
          exp_data[i] = temp_export_data;
          var last_cnt = Number($("#export_list").data("export_datatype")); 
          $("#export_list").data("export_datatype",last_cnt + 1);
          // console.log(i +" --> "+ (exp_data.length - 1));
          if(Number($("#export_list").data("export_datatype")) == pdata.length) {
            var header = ["Patient Name","Age","Email","Phone","Patient DHP ID"];
            exp_data.unshift(header);
            var csvContent = "data:text/csv;charset=utf-8,";
            exp_data.forEach(function(infoArray, index){
               dataString2 = infoArray.join(",");
               csvContent += ((index < exp_data.length) ? dataString2+ "\n" : dataString2);
            });
            var encodedUri = encodeURI(csvContent);
            $("#export_list").attr("href",encodedUri);
            $("#export_list").attr("download", "list.csv");
          }
        }else {
          console.log(pdata[i].user_id);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:pdata[i].user_id,
      include_docs:true
    });
  }

  function generateVisualizePatientList(label,data) {
    createModal("population_health_management_patient_list_modal");
    $("#export_list").show();
    $("#export_list").data("export_datatype",0);
    $("#population_health_management_patient_list_pagination").html("");
    $("#population_health_management_patient_list_header").html(label);
    $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>Age</th><th>Conditions</th></tr>");
    $('#population_health_management_patient_list').block({ message: "Please Wait....",centerX: true, centerY: true});
    var mydata = {rows:data};
    paginationConfiguration(mydata,"population_health_management_patient_list_pagination",10,displayVisualizePatientList);
    generateExportVisualizePatientListAsCSV(data);
  }

  function displayVisualizePatientList(start,end,data) {
    var output = [];
    for(var i=start; i<end; i++) {
      output.push('<tr class="visualize_details" data-user_id="'+data.rows[i].doc.user_id+'">');
      output.push('<td class="visualize_list_name">Fetching Details...</td>');
      output.push('<td class="visualize_list_email">...</td>');
      output.push('<td class="visualize_list_phone">...</td>');
      output.push('<td class="visualize_list_gender">...</td>');
      output.push('<td class="visualize_list_age">...</td>');
      output.push('<td class="visualize_list_conditions">'+data.rows[i].doc.Condition+'</td>');
      output.push('</tr>');
    }
    $("#population_health_management_patient_list tbody").html(output.join(''));
    var gen_len = $(".visualize_details").length;
    $(".visualize_details").each(function(i) {
      if(i == (gen_len -1)) {
        $('#population_health_management_patient_list').unblock();
      }
      displayPMHVisualizeWithDetails($(this));
    });
  }

  function displayPMHVisualizeWithDetails($obj) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(data) {
        if(data.rows.length > 0) {
          $obj.find(".visualize_list_name").html(data.rows[0].doc.first_nm + " "+data.rows[0].doc.last_nm);
          $obj.find(".visualize_list_email").html((data.rows[0].doc.user_email ? data.rows[0].doc.user_email : "NA"));
          $obj.find(".visualize_list_phone").html((data.rows[0].doc.phone ? data.rows[0].doc.phone : "NA"));
          $obj.find(".visualize_list_gender").html((data.rows[0].doc.gender ? data.rows[0].doc.gender : "NA"));
          $obj.find(".visualize_list_age").html((data.rows[0].doc.age ? data.rows[0].doc.age : "NA"));
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:$obj.data("user_id"),
      include_docs:true
    });  
  }

  function generateExportVisualizePatientListAsCSV(data) {
    var export_data = [];
    for(var i=0;i<data.length;i++) {
      getAllPatientInformationForVisualize(i,data,export_data);
    }
  }

  function getAllPatientInformationForVisualize(i,pdata,exp_data) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
      success:function(mdata) {
        if(mdata.rows.length > 0) {
          // var full_address = (mdata.rows[0].doc.address1 ? mdata.rows[0].doc.address1+(mdata.rows[0].doc.address2 ? (" "+mdata.rows[0].doc.address2) : "") : "");
          var temp_export_data = [mdata.rows[0].doc.first_nm + " " + mdata.rows[0].doc.last_nm, mdata.rows[0].doc.user_email, mdata.rows[0].doc.phone, (mdata.rows[0].doc.gender ? mdata.rows[0].doc.gender : ""), (mdata.rows[0].doc.age ? mdata.rows[0].doc.age : ""), pdata[i].doc.Condition];
          exp_data[i] = temp_export_data;
          var last_cnt = Number($("#export_list").data("export_datatype")); 
          $("#export_list").data("export_datatype",last_cnt + 1);
          // console.log(i +" --> "+ (exp_data.length - 1));
          if(Number($("#export_list").data("export_datatype")) == pdata.length) {
            var header = ["Patient Name","Email","Phone","Gender","Age","Conditions"];
            exp_data.unshift(header);
            var csvContent = "data:text/csv;charset=utf-8,";
            exp_data.forEach(function(infoArray, index){
               dataString2 = infoArray.join(",");
               csvContent += ((index < exp_data.length) ? dataString2+ "\n" : dataString2);
            });
            var encodedUri = encodeURI(csvContent);
            $("#export_list").attr("href",encodedUri);
            $("#export_list").attr("download", "list.csv");
          }
        }else {
          console.log(pdata[i].user_id);
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:pdata[i].doc.user_id,
      include_docs:true
    });
  }

  function drawPieChart(container,width,height,radius,payload,dataset1,dataset2,dataset3,options) {
    var WIDTH = "width", HEIGHT = "height",
        X = "x", Y= "y", FILL = "fill", G = "g";
    var node1 = payload;
    var outerRadius = width / 2;
    var innerRadius = 20;
    var arc = d3.svg.arc().innerRadius(options.innerRadius).outerRadius(options.outerRadius(width)),
    labelWidth = 70, labelHeight = 20;
    var pie = d3.layout.pie(),
    transformStr = "translate(" + width + "," + outerRadius + ")";
    pie.value(function(d){
      return d.percent;
    });

    var color = d3.scale.ordinal().range(node1.map(function(o,k){return o.color;}));
    var svg = d3.select(container)
                .attr(WIDTH, options.chartWidth)
                .attr(HEIGHT, options.chartHeight)
                .append(G)
                .attr("transform", transformStr);
    var arcs = svg.selectAll("g.arc")
                  .data(pie(node1))
                  .enter()
                  .append(G)
                  .attr("class", "arc pointer");

    arcs.append("path")
        .style(FILL, function(d) {
          return color(d.data.label);
        })
        .on("click", function(d) {
          if(d.data.label == "Male") {
            displayPatientListForPHMGender(dataset1, d.data.label);
          }else if(d.data.label == "Female") {
            displayPatientListForPHMGender(dataset2, d.data.label);
          }else if(d.data.label == ">25") {
            displayPatientBMIList(dataset1, d.data.label);
          }else if(d.data.label == "18-25") {
            displayPatientBMIList(dataset2, d.data.label);
          }else if(d.data.label == "<18") {
            displayPatientBMIList(dataset3, d.data.label);
          }else if(d.data.type == "demographic") {
            executiveDashobard.generatePatientsDemographicWise(d.data);
          }
        })
        .attr("d",arc)
        .append("title")
        .text(function(d){
          return d.value + "%";
        });

    var legend = d3.select(container).append(G)
      .attr("class", "legend")
      .attr(WIDTH, width*2 )
      .attr(HEIGHT, radius*2)
      .attr("transform", "translate(" + (width + 60) +", 5)");

    legend.selectAll(G)
      .data(node1)
      .enter()
      .append("rect")
      .attr(WIDTH, options.legendRectWidth)
      .attr(HEIGHT, options.legendRectHeight)
      .attr(X, function(d, i) {
        return 0;
      })
      .attr(Y, function(d, i){
        return labelHeight * i;
      })
      .style(FILL, function(d) {
        return color(d.label);
      });
    legend.selectAll(G)
      .data(node1)
      .enter().append("text")
      .attr(X, function (d,i) {
        return options.legendRectWidth;
      })
      .attr(Y, function (d,i) {
        return options.legendRectHeight + labelHeight * i;
      })
      .style(FILL, options.legend_label_color)
      .text(function(d) {
        return d.label;
      });
    // legend.selectAll(G)
    //     .data(node1)
    //     .enter()
    //     .append("rect")
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .attr("x", function(d, i) {
    //         return 10 + labelWidth * i;   
    //     })
    //     .attr("y", 0) 
    //     .style("fill", function(d) {
    //         return color(d.label);
    //     });
    // legend.selectAll(G)
    //     .data(node1)
    //     .enter().append("text")
    //     .attr("x", function (d,i) {
    //         return 10 + labelWidth * i + 15;
    //     })
    //     .attr("y", 9)
    //     .style("fill", "blue")
    //     .text(function(d) { 
    //         return d.label; 
    //     });
  }

  function drawPieChartOld(container,width,height,radius,payload,dataset1,dataset2,dataset3) {
    var node1 = payload;
    var outerRadius = width / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        labelWidth = 70;
    var pie = d3.layout.pie(),
    transformStr = "translate(" + width + "," + outerRadius + ")";
    pie.value(function(d){ 
        return d.percent;
    }); 
    var color = d3.scale.ordinal().range(node1.map(function(o,k){return o.color;}));
    var svg = d3.select(container)
                .attr("width", width*2 )
                .attr("height", height + 40)
                .append('g')
                .attr("transform", transformStr);
    var arcs = svg.selectAll("g.arc")
                  .data(pie(node1))
                  .enter()
                  .append("g")
                  .attr("class", "arc pointer");
                  
    arcs.append("path")
        .style("fill", function(d) {
            return color(d.data.label);
        })
        .on("click", function(d) {
          if(d.data.label == "Male") {
            displayPatientListForPHMGender(dataset1, d.data.label);
          }else if(d.data.label == "Female") {
            displayPatientListForPHMGender(dataset2, d.data.label);
          }else if(d.data.label == ">25") {
            displayPatientBMIList(dataset1, d.data.label);
          }else if(d.data.label == "18-25") {
            displayPatientBMIList(dataset2, d.data.label);
          }else if(d.data.label == "<18") {
            displayPatientBMIList(dataset3, d.data.label);
          }
        })
        .attr("d",arc);
            
    var start = 10;    
    var legend = d3.select(container).append("g")
            .attr("class", "legend")
            .attr("width",width*2 )
            .attr("height", radius*2)
            .attr("transform", "translate(0," + (height + 20) + ")");
            
    legend.selectAll("g")
        .data(node1)
        .enter()
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", function(d, i) {
            return start + labelWidth * i;   
        })
        .attr("y", 0) 
        .style("fill", function(d) {
            return color(d.label);
        });
    legend.selectAll("g")
        .data(node1)
        .enter().append("text")
        .attr("x", function (d,i) {
            return start + labelWidth * i + 15;
        })
        .attr("y", 9)
        .style("fill", "blue")
        .text(function(d) { 
            return d.label; 
        });
  }

  function drawPercentageChart(container, r1,r2,width,height,color, percentFontSize, labelFontSize, values, cholesterol, diabetes, hypertension) {
    var bodySelector = d3.select(container),
        textHeight = 50,
        paddingText = 40,
        dy= ".321em",
        svgBox =  bodySelector.append("svg")
                    .attr("width", '100%')
                    .attr("height", height + textHeight + paddingText ),
        degree = Math.PI/180;
    svgBox.selectAll("g")
          .data(values)
          .enter()
          .append("g")
          .attr("class", "indicator")
          .attr("transform", function(d, i) { return "translate(" + i* width + ",40)";})
          .attr ("width", width).attr("height",height)
          .append("path")
          .attr("d", d3.svg.arc()
            .innerRadius(r1)
            .outerRadius(r2)
            .startAngle(0)
            .endAngle(function (d) {
                return (d.percent/100*360)* degree;
            })
          )
          .attr("id" , function(d, i) {
             return "path" + (i+1);
          })
          .attr("fill", color)
          .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    svgBox.selectAll(".indicator")
          .data(values)
          .append("text")
          .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
          .attr("dy", dy)
          .attr("font-size", percentFontSize)
          .attr("text-anchor", "middle")
          .text(function(d) {
              return d.percent + "%";
          }).on("click", function(d) {
            if(d.label == "A1C > 6") {
              generateVisualizePatientList(d.lebel, diabetes);
            }else if(d.label == "Hypertension") {
              generateVisualizePatientList(d.lebel, hypertension);
            }else if(d.label == "Cholesterol") {
              generateVisualizePatientList(d.lebel, cholesterol);
            }else {
              console.log("No records for selected label.Please contact admin.");
            }
          });
    svgBox.selectAll(".indicator")
          .data(values)
          .append("text")
          .attr("transform", "translate(" + width/2 + "," + (height + paddingText) + ")")
          .attr("dy", dy)
          .attr("font-size", labelFontSize)
          .attr("text-anchor","middle")
          .text(function(d) {
              return d.label;
          });
  }

  function drawLineChart(container, m,chartWidth, chartHeight, testjson, xPointWidth, yPointWidth) {
    var w = chartWidth - m[0] - m[2],
        h= chartHeight - m[1] - m[3], xPts = [], yPts = [],
        buildChart = function(graph, data, lineClass, shapeColor, x_scale, y_scale, shape) {
            var xPts = [], yPts = [];         
            var line = d3.svg.line()
                .x(function(d,i) { 
                    return x_scale(i); 
                })
                .y(function(d) {
                    return y_scale(d);
                }),container = graph.append("g"),
                    symbol = d3.svg.symbol();
            symbol.type(shape);    
            container.append("path")
                    .attr("d", line(data))
                    .attr('class', lineClass);
            container.selectAll('path')
                .data(data)
                .enter().append('path')
                .attr('transform', function(d,i) { return "translate(" + x_scale(i) + "," + y_scale(d) + ")";})
                .attr("d", symbol)
                .attr("class", shapeColor);      
        };
        var dataSource = testjson.inputData, dataElems = [], i=0;
        for ( i = 0; i < dataSource.length; i++) {
            dataElems = dataElems.concat(dataSource[i].data);
        }
        var xLabels = d3.time.scale().domain([new Date(2013, 1, 1), new Date(2013, 11, 31)]).range([0, w]);
        var xScale = d3.scale.linear().domain([0, dataSource[0].data.length]).range([0, w]);
        var yScale = d3.scale.linear().domain([0, d3.max(dataElems)]).range([h, 0]);

        var monthGraphChart = d3.select(container).append("svg:svg")
                .attr("width", '100%')
                .attr("height", h + m[1] + m[3]),
            graph= monthGraphChart.append("svg:g")
                .attr("transform", "translate(" + m[0] + "," + m[1] + ")");

        var xAxis = d3.svg.axis().scale(xLabels).ticks(d3.time.months).tickFormat(d3.time.format("%b %d")).orient("bottom");
        graph.append("svg:g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis);

        var yAxisLeft = d3.svg.axis().scale(yScale).ticks(5).tickFormat(function (d){
              return  d; 
          }).orient("left").tickSize(-w).tickSubdivide(true);

        var g = graph.append("svg:g")
                .attr("class", "y axis")
                .attr("transform", "translate(-25,0)")
                .call(yAxisLeft);

        for ( i = 0; i < dataSource.length; i++) {
            buildChart(graph, dataSource[i].data, 'line' + (i + 1), 'shapePoint' + [i+1], xScale, yScale, dataSource[i].marker);
        }
  }

  var scoreChart = {
    //Start score chart
    draw: function(containers, width, height, radius) {
      var donutChart = function(selector, w,h,r,data,text,color) {
        var degree = Math.PI/180;
        var vis = d3.select(selector)
          .append("svg:svg")
          .data([data])
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
            .attr("transform", "translate(" + r + "," + r + ")")
        var arc = d3.svg.arc()
          .outerRadius(r)
          .innerRadius(r-30);
        var pie = d3.layout.pie()
          .value(function(d) { return d.value; })
          .startAngle(-90 * (degree))
          .endAngle(1.6);
          var arcs = vis.selectAll("g.slice")
          .data(pie)
          .enter()
          .append("svg:g")
          .attr("class", "slice");
          arcs.append("svg:path")
              .attr("fill", function(d, i) { return color[i]; } ) //set the color for each slice to be chosen from the color function defined above
              .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
          arcs.append("svg:text")                                     //add a label to each slice
              .attr("transform", function(d) {                    //set the label's origin to the center of the arc
              return "translate(0,-75)";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text("0");

        var text = vis.append("svg:text")
          .attr("transform", function(d) { return "translate(0,0)"; })
          .attr("dy", ".321em")
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text(text);
      }
      
      var data = [
        {
          "data": [{"label":"one", "value":50},{"label":"two", "value":50}],
          "text" : "0",
          "colors": ["#CCCC00","#F0F0F0"]
        },
        {
          "data": [{"label":"one", "value":50},{"label":"two", "value":50}],
          "text" : "0",
          "colors": ["#CCCC00","#F0F0F0"]
        },
        {
          "data": [{"label":"one", "value":75},{"label":"two", "value":25}],
          "text" : "9.0",
          "colors": ["#CC9900","#F0F0F0"]
        }
      ];
    
      for (var i = 0 ; i < data.length; i++) {
        donutChart(containers[i], width,
          height,
          radius,
          data[i].data,
          data[i].text,
          data[i].colors);
      }
    }
    //End score chart
  }

  var wellnessChart = {
    ////////Start Bar chart
    draw: function (container,barChartData, width, height, margins) {
      //Start declarations
      var vis = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height),
      data= barChartData.data,
      colors = ["red","green","yellow","red","red","red","red","#EE7600","#EE7600","#FF8C00","#FF8C00",
      "#00FF00","#00EE00","#00CD00", "#008B45","green"],
      xRange = d3.scale.ordinal().rangeRoundBands([margins.left, width - margins.right], 0.1).domain(data.map(function (d) {
        return d.x;
      })),
      yRange = d3.scale.linear().range([height - margins.top, margins.bottom]).domain([0,
        d3.max(data, function (d) {
        return d.y;
        })
      ]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .tickSubdivide(true),
      yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(5)
        .orient("left")
        .tickSubdivide(true);
      //End declarations
      vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
      .call(xAxis);

      vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (margins.left) + ',0)')
      .call(yAxis);

      vis.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return xRange(d.x);
      })
      .attr('y', function (d) {
        return yRange(d.y);
      })
      .attr('width', xRange.rangeBand())
      .attr('height', function (d) {
        return ((height - margins.bottom) - yRange(d.y));
      })
      .attr('fill', function (d,i){ return colors[i];});
    }
    //End Bar chart
  };

  var barChart = {
    ////////Start Bar chart
    draw: function (container, payload, margin, width, height) {
      var data = payload.data;
      var xScale = d3.scale.linear()
      .domain([0, 10])
      .range([0, width], 0.2);
       var yScale = d3.scale.ordinal()
      .rangeRoundBands([height, 0], 0.2);
       var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(6)
      .tickFormat( function(d) { return d;})
      .tickValues([0,2,4,6,8,10]);

      var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(function(d) {
        return d.label;
      });

      yScale.domain(data.map(function(d) {
        return d.label;
      }));

      var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      //.selectAll("text")
      //.style("text-anchor", "end")
      //.attr("dx", ".8em")
      //.attr("dy", ".15em");

      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis)
      .selectAll("text")
      .style("text-anchor","end");
      //.attr("dx", ".8em")
      //.attr("dy", ".15em");

      svg.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", function(d) {
        return  yScale(d.label);
      })
      .attr("width", function(d) {
        return  xScale(d.value);
      })
      .attr("height",yScale.rangeBand())
      .style("fill", "green");
    }
    //End Bar chart
  };
  var recommendationChartData =  {
    "name":"barchart",
    "inputData":[
      { 
      "value": 1.8,
      "label": "Low GI Diet"
      },{
      "value": 1.8,
      "label": "Medication" 
      },{
      "value": 2.5,
      "label": "Vitamin B complex"
      },{
      "value": 3,
      "label": "Multi-Vitamin"
      },{
      "value": 3.5,
      "label": "Omega-3"
      },{
      "value": 5,
      "label": "Vitamin D"  
      }]
    }
      
  var barsWithoutAxes = {
    //Start bar chart drawing without axes
    draw: function(container, margin,barWidth,barHeight) {
      var width = barWidth - margin[3] - margin[1],
        height = barHeight - margin[0] - margin[2];

      var inputData = recommendationChartData.inputData;
      var xScale = d3.scale.linear().domain([0, inputData.length]).range([0, width]);
      var gap = 4;
      var yScale = d3.scale.ordinal().rangeRoundBands([(height + 2 * gap),0],.2);
      var xAxis = d3.svg.axis();

      var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

      yScale.domain(inputData.map(function(d) {
      return d.label;
      }));

      var svg = d3.select(container).append("svg")
        .attr("width", width + margin[3] + margin[1])
        .attr("height", height + margin[0] + margin[2])
        .append("g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis)
      .selectAll("text")
      .style("text-anchor","end");

      svg.selectAll("rect")
      .data(inputData)
      .enter().append("rect")
      .attr("x",0)
      .attr("y", function(d) {
        return  yScale(d.label);
      })
      .attr("width", function(d) {
      return  xScale(d.value);
      })
      .attr("height",yScale.rangeBand())
      .style("fill", "#778899");
    }
  };

  var InitChart = function(dataPayload,WIDTH, containerHeight, MARGINS) {
    var i = 0, dataElementCount = dataPayload.data.length,
        HEIGHT = containerHeight - 20,
        legendColors = dataPayload.legend,
        legendContainer = d3.select('#legendContainer');
    for (i = 0; i < legendColors.length; i++ ) {
     var legend = legendContainer.append("div").attr("class", "legendStyle");
     legend.append("div").attr("style", "margin-right:10px;width:20px;height:15px;display:inline-block;background:" + legendColors[i].color + ";");
     legend.append("div").attr("style", "display:inline-block;width:70%;line-height:20px;").text(legendColors[i].brandName);
    }
    var drawBars = function(vis, inputData, xRange, yRange, height, margins, color) {
     vis.selectAll('rect')
      .data(inputData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return xRange(d.x);
      })
      .attr('y', function (d) {
        return yRange(d.y);
      })
      .attr('width', xRange.rangeBand())
      .attr('height', function (d) {
        return ((height - margins.bottom) - yRange(d.y));
      })
      .attr('fill', function (d) {return color(d.x);});
    },
    xFunc = function (d) {
        return d.x;
    },
    yFunc = function (d) {
            return d.y;
    };

    for (i = 0; i < dataElementCount; i++) {
        var inputData = dataPayload.data[i].inputData;
        var svgContainer = d3.select('#visualisation' + i)
                    .attr("width", WIDTH)
                    .attr("height", containerHeight),
        vis = svgContainer.append("g"),
        xRange = d3.scale.ordinal().domain(inputData.map(xFunc)).rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.2),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
          d3.max(inputData, yFunc)
        ]),
        x = d3.scale.identity().domain([MARGINS.left, WIDTH - MARGINS.right]),
        xAxis = d3.svg.axis()
            .scale(x)
            .ticks(0).outerTickSize([0]),
        yAxis = d3.svg.axis()
            .scale(yRange)
            .orient("left").ticks(0).outerTickSize([0]);
        svgContainer.append("g").append("text")
            .attr("transform", 'translate(' + WIDTH/2 +',' + (HEIGHT) + ')')
            .attr("height", "50")
            .attr("text-anchor", "middle")
            .text(dataPayload.data[i].name);
        vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

        vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);
        var color = d3.scale.ordinal()
                .range(legendColors.map(function (d) {
                            return d.color;
                    })
                );
        drawBars(vis, inputData, xRange, yRange, HEIGHT, MARGINS, color);
    }
  };
 
  var stackedBarChart = {
    draw: function(margins, legendPanel, dataset, container, dataItem) {
      var WIDTH = $(container).width(),
        HEIGHT = $(window).height()/2,
        width = 800,
        height = 300,
        // width = WIDTH - margins.left - margins.right - legendPanel.width,
        // height = HEIGHT - margins.top - margins.bottom,
        series = dataset.map(function(d) {
          return d.name;
        }),
        stack = d3.layout.stack();

      dataset = dataset.map(function(d) {
        var lbl_name = d.name;
        return d.data.map(function(o, i) {
          // Structure it so that your numeric
          // axis (the stacked amount) is y
          return {
            y: o.count,
            x: o[dataItem],
            user_id:o.user_ids,
            lbl_name:lbl_name
          };
        });
      });
      stack(dataset);
      dataset = dataset.map(function(group) {
        return group.map(function(d) {
          // Invert the x and y values, and y0 becomes x0
          return {
            x: d.y,
            y: d.x,
            x0: d.y0,
            user_id:d.user_id,
            lbl_name:d.lbl_name
          };
        });
      });
      var svg = d3.select(container)
        .append('svg')
        .attr('width', width + margins.left + margins.right + legendPanel.width)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
        xMax = d3.max(dataset, function(group) {
          return d3.max(group, function(d) {
            return d.x + d.x0;
          });
        }),
        xScale = d3.scale.linear()
        .domain([0, xMax])
        .range([0, width]),
        dataItems = dataset[0].map(function(d) {
          return d.y;
        }),
        yScale = d3.scale.ordinal()
        .domain(dataItems)
        .rangeRoundBands([0, height], 0.1),
        xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom'),
        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left'),
        colours = d3.scale.category10(),
        groups = svg.selectAll('g')
        .data(dataset)
        .enter()
        .append('g')
        .style('fill', function(d, i) {
          return colours(i);
        }),
        rects = groups.selectAll('rect')
        .data(function(d) {
          return d;
        })
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return xScale(d.x0);
        })
        .attr('class','pointer')
        .attr('y', function(d, i) {
          return yScale(d.y);
        })
        .attr('height', function(d) {
          return yScale.rangeBand();
        })
        .attr('width', function(d) {
          return xScale(d.x);
        })
        .on('click', function(d) {
          generatePHMExecutiveDashboard(d);
        })
        .append("title")
        .text(function(d){
          return d.x;
        });

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'axis')
        .call(yAxis);

      var lbl_svg = d3.select("#series_labels")
        .append('svg')
        .attr('width', 170)
      lbl_svg.append('rect')
        .attr('fill', 'yellow')
        .attr('width', 160)
        .attr('height', 30 * dataset.length)
        .attr('x', 0)
        .attr('y', 20);

      series.forEach(function(s, i) {
        lbl_svg.append('text')
          .attr('fill', 'black')
          .attr('x', 5)
          .attr('y', i * 25 + 40)
          .text(s);
        lbl_svg.append('rect')
          .attr('fill', colours(i))
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', 135)
          .attr('y', i * 24 + 28);
      });
    }
  };

  var generatePHMExecutiveDashboard = function(data) {
    $.blockUI();
    var mydata = {rows:data.user_id}
    $("#population_health_management_patient_list tbody").html('');
    $("#population_health_management_patient_list thead").html('<tr><th>Patient Name</th><th>Email</th><th>Contact No</th><th>Gender</th><th>Age</th><th>Patient DHP ID</th><th>Appointment Date</th><th>Appointment Time</th></tr>');
    $("#population_health_management_patient_list_pagination").html("");
    $("#population_health_management_patient_list_header").html("List of " + data.lbl_name +  " On " + data.y);
    var generateExportExecutivePatientListAsCSV = function(data) {
      var export_data = [],
          datalen = data.user_id.length;
      for(var i=0;i<datalen;i++) {
        getAllPatientInformationForExecutiveDashboard(i,data.user_id[i],export_data,datalen);
      }
    }

    var getAllPatientInformationForExecutiveDashboard = function(i,pdata,exp_data,dlen) {
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(mdata) {
          if(mdata.rows.length > 0) {
            var appointment_date = moment(pdata.reminder_start).format("DD-MM-YYYY");
            var appointment_start_time = moment(pdata.reminder_start).format("hh:mm a");
            var appointment_end_time = moment(pdata.reminder_end).format("hh:mm a");
            var temp_export_data = [mdata.rows[0].doc.first_nm + " " + mdata.rows[0].doc.last_nm, mdata.rows[0].doc.user_email, mdata.rows[0].doc.phone, (mdata.rows[0].doc.gender ? mdata.rows[0].doc.gender : ""), (mdata.rows[0].doc.age ? mdata.rows[0].doc.age : ""), mdata.rows[0].doc.patient_dhp_id, appointment_date, appointment_start_time, appointment_end_time ];
            exp_data[i] = temp_export_data;
          }else {
            console.log("personal information not found for --> " + pdata.user_id);
          }
          if(i == (dlen - 1)) {
            var header = ["Patient Name","Email","Phone","Gender","Age","Patient DHP ID, Appointment Date, Start Time, End Time"];
            exp_data.unshift(header);
            var csvContent = "data:text/csv;charset=utf-8,";
            exp_data.forEach(function(infoArray, index){
               dataString = infoArray.join(",");
               csvContent += ((index < exp_data.length) ? dataString+ "\n" : dataString);
            });
            var encodedUri = encodeURI(csvContent);
            $("#export_list").attr("href",encodedUri);
            $("#export_list").attr("download", "list.csv");
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:pdata.user_id,
        include_docs:true
      });
    }

    var displayPatientInformation = function(appdata,len) {
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(pdata) {
          if(pdata.rows.length > 0 ) {
            var output = [];
            output.push('<tr>');
            output.push('<td>'+pdata.rows[0].doc.first_nm+ " " +pdata.rows[0].doc.last_nm+'</td>');
            output.push('<td>'+pdata.rows[0].doc.user_email+'</td>');
            output.push('<td>'+pdata.rows[0].doc.phone+'</td>');
            output.push('<td>'+(pdata.rows[0].doc.gender ? pdata.rows[0].doc.gender : "NA")+'</td>');
            output.push('<td>'+(pdata.rows[0].doc.age ? pdata.rows[0].doc.age : "NA")+'</td>');
            output.push('<td>'+pdata.rows[0].doc.patient_dhp_id+'</td>');
            output.push('<td>'+moment(appdata.reminder_start).format("DD-MM-YYYY")+'</td>');
            output.push('<td>'+ moment(appdata.reminder_start).format("hh:mm a")+ " " + moment(appdata.reminder_end).format("hh:mm a") +'</td>');
            output.push('</tr>');
            $("#population_health_management_patient_list tbody").append(output.join(''));
            if(len == $("#population_health_management_patient_list tbody tr").length) {
              $.unblockUI();
              createModal("population_health_management_patient_list_modal");
              generateExportExecutivePatientListAsCSV(data);
            }
          }else {
            console.log("No Personal Info For --> " + appdata.user_id);
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:appdata.user_id,
        include_docs:true
      });
    }
    
    var getPatientInformation = function(start,end,data) {
      for(var i=start;i<end;i++) {
        displayPatientInformation(data.rows[i],data.rows.length);
      }
    }
    paginationConfiguration(mydata,"population_health_management_patient_list_pagination",10,getPatientInformation);
  }

  function generatePatientGraphAtExecutiveDashboard() {
    $("#dailyChart").block({"msg":"Please Wait....."});
    $.couch.db(db).list("tamsa/getDHPAppointmentsByRangeList", "getDHPAppointmentsByRange", {
      startkey:[pd_data.dhp_code,$("#pmh_executive_patient_range").data('daterangepicker').startDate.format('YYYY-MM-DD')],
      endkey:[pd_data.dhp_code,$("#pmh_executive_patient_range").data('daterangepicker').endDate.format('YYYY-MM-DD')],
      dhp_code:pd_data.dhp_code,
      include_docs: true
    }).success(function (data) {
      $("#dailyChart").unblock();
      $("#dailyChart, #series_labels").html("");
      stackedBarChart.draw({top: 12,left: 60,right: 24,bottom: 24},{width: 250},data.rows, "#dailyChart", 'day');
    }).error(function (error,reason) {
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    });
  }

  function activateDateRangePicker(id,callback) {
    $("#"+id).daterangepicker({
      maxDate: moment(),
      locale: {
        format: 'YYYY-MM-DD'
      },
      startDate: moment().subtract(7, 'days').format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    });
    $('#'+id).on('apply.daterangepicker', function(ev, picker) {
      callback();
    });
  }

  function generateDemographicAtExecutiveDasboard() {
    $("#demographics").html("");
    $("#demographics").data("dm_count", 0);
    $("#demographics").data("pcode_count", 0);
    $.couch.db(db).view("tamsa/getDHPSubscribers", {
      success:function(data) {
        var datalen = data.rows.length;
        if(datalen > 0) {
          var patient_array = [];
          for(var i=0;i<datalen;i++){
            getDemographicDetails(data.rows[i].key[1],patient_array,datalen);
          }
        }else {
          console.log("no Records Found.");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[pd_data.dhp_code],
      endkey:[pd_data.dhp_code, {}],
      reduce:true,
      group:true
    });

    var getDemographicDetails = function(user_id,patient_array,dlen) {
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(pdata){
          if(pdata.rows.length > 0 ) {
            var pincode = pdata.rows[0].doc.pincode;
            if(pincode) {
              var pcode_count = Number($("#demographics").data("pcode_count"));
              $("#demographics").data("pcode_count", pcode_count + 1);
              patient_array[pincode] = patient_array[pincode] || [];
              patient_array[pincode].push(pdata.rows[0].doc);
            }
            var dm_count = Number($("#demographics").data("dm_count"));
            $("#demographics").data("dm_count",dm_count + 1);
          }else {
            console.log("personal info not found for userid --> " + user_id);
          }
          if(dlen == Number($("#demographics").data("dm_count"))) {
            var demographic_data = [];
            var final_pcode_count = Number($("#demographics").data("pcode_count"));
            for(pcode in patient_array){
              var pincode_strength = patient_array[pcode].length;
              var percentage = ((pincode_strength * 100)/final_pcode_count).toFixed(0);
              demographic_data.push({
                "percent": percentage,
                "label":   pcode,
                "color":   getRandomColor(),
                "type":    "demographic",
                "data":    patient_array[pcode]
              });
            }
            $("#demographics").unblock();
            drawPieChart('#demographics', 100,100,20, demographic_data,"","","",options);
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
  }

  var executiveDashobard = (function(demodata) {
    var displayPatientsDemographicWise = function(start,end,data) {
      var output = [];
      for(var i=start;i<end;i++){
        output.push('<tr>');
        output.push('<td>'+data.rows[i].first_nm + " " + data.rows[i].last_nm+'</td>');
        output.push('<td>'+data.rows[i].user_email+'</td>');
        output.push('<td>'+data.rows[i].phone+'</td>');
        output.push('<td>'+(data.rows[i].gender ? data.rows[i].gender : "NA")+'</td>');
        output.push('<td>'+(data.rows[i].age ? data.rows[i].age : "NA")+'</td>');
        output.push('<td>'+data.rows[i].patient_dhp_id+'</td>');
        output.push('</tr>');
      }
      $("#population_health_management_patient_list tbody").html(output.join(''));
      $.unblockUI();
      createModal("population_health_management_patient_list_modal");
    }

    var generateExportDemographicPatientListAsCSV = function (data) {
      var export_data = [];
      for(var i=0;i<data.length;i++){
        export_data[i] = [data[i].first_nm + " " + data[i].last_nm, data[i].user_email, data[i].phone, (data[i].gender ? data[i].gender : ""), (data[i].age ? data[i].age : ""), data[i].patient_dhp_id ];
      }

      var header = ["Patient Name","Email","Phone","Gender","Age","Patient DHP ID"];
      export_data.unshift(header);
      var csvContent = "data:text/csv;charset=utf-8,";
      export_data.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
         csvContent += ((index < export_data.length) ? dataString+ "\n" : dataString);
      });
      var encodedUri = encodeURI(csvContent);
      $("#export_list").attr("href",encodedUri);
      $("#export_list").attr("download", "list.csv");
    }
    var generatePatientsDemographicWise = function(demodata) {
      $.blockUI();
      var mydata = {rows: demodata.data};
      $("#population_health_management_patient_list tbody, #population_health_management_patient_list_pagination").html("");
      $("#population_health_management_patient_list_header").html("Patient Visited from the Location(Pincode)::"+ demodata.label);
      $("#population_health_management_patient_list thead").html("<tr><th>Patient Name</th><th>Email</th><th>Contact No</th><th>Gender</th><th>Age</th><th>Patient DHP ID</th></tr>");
      paginationConfiguration(mydata,"population_health_management_patient_list_pagination",10,displayPatientsDemographicWise);
      generateExportDemographicPatientListAsCSV(demodata.data);
    }
    return {
      generatePatientsDemographicWise: generatePatientsDemographicWise
    }
  })();

  var getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});

function generateExportCampaignPatientListAsCSV() {
  var ex_row = [];
  $(".signup_list").each(function (index) {
    var ex_col= [];
    for(var i=0; i < 8; i++){
      ex_col[i] = $(this).find("td:nth-child("+(i+1)+")").html();
    }
    ex_row[index] = ex_col;
  });
  var header = ["Patient Name","Email", "Phone", "Age", "HeartRate", "Systolic BP", "Diastolic BP", "Glucose"];
  ex_row.unshift(header);
  var csvContent = "data:text/csv;charset=utf-8,";
  ex_row.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += ((index < ex_row.length) ? dataString+ "\n" : dataString);
  });
  var encodedUri = encodeURI(csvContent);
  $("#export_list").attr("href",encodedUri);
  $("#export_list").attr("download","list.csv");
}