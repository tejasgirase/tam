var d    = new Date();
var pd_data = {};
var plController = {};
app.controller("patientListController",function($scope,$state,$compile,tamsaFactories,$stateParams){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.pdBack();
            tamsaFactories.displayDoctorInformation(data);
            tamsaFactories.sharedBindings();
            displayPatientList();
            patientListEventBindings();
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

  function getPatientConditions(start,end,data) {
    var critical_patient_data = [];
    $.couch.db(db).view("tamsa/getEprescribe", {
      success: function(edata) {
        for(var i=start;i<end;i++){
          // console.log(data.rows[i].condition_severity);
          if(data.rows[i].referral_sincerly){
            critical_patient_data.push('<div class="col-lg-12 ListContatiner ng-scope" ng-repeat="ListElems in ListElem" style="margin-top: 15px;">');
          }else{
            critical_patient_data.push('<div class="col-lg-12 ListContatiner ng-scope " ng-repeat="ListElems in ListElem" style="margin-top: 15px;">');
          }
          critical_patient_data.push('<div class="col-md-3 ListWrapper"><div class="row"><div class="col-md-4 paddtop15"><a ui-sref="medical_history({user_id:\''+data.rows[i].user_id+'\'})" class="patient_image_link" user_id="'+data.rows[i].user_id+'"><img class="round-image img_'+data.rows[i].user_id+' img-responsive" src="images/profile-pic.png" alt="profile-pic"/></a></div><div class="col-md-7 paddside cuswidth65"><div class="Username ng-binding name_'+data.rows[i].user_id+'"></div><div class="UserLocation ng-binding city_'+data.rows[i].user_id+'"></div>');
          // if(data.rows[i].referral_sincerly && data.rows[i].referral_sincerly != ""){
          //   critical_patient_data.push('<div  class="UserLocation ng-binding">Referred By: <span class="theme-color">'+data.rows[i].referral_sincerly+'</span></div>');
          // }
          critical_patient_data.push('</div></div></div><div class="col-md-3 ListWrapper">');
          if(data.rows[i].referral_sincerly && data.rows[i].referral_sincerly != ""){
            critical_patient_data.push('<div class="row TexualContentWrapper"><div class="col-md-6 ContentText font12 colorred">Referred By:</div><div class="col-md-6 ContentTextVal ng-binding font12">'+data.rows[i].referral_sincerly+'</div></div>');
            critical_patient_data.push('<div class="row TexualContentWrapper">');
          }else{
            critical_patient_data.push('<div class="row mrgtop15">');
          }

          critical_patient_data.push('<div class="col-md-6 ContentText">Alert Name:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].condition ? data.rows[i].condition:"NA")+'</div></div><div class="row TexualContentWrapper"><div class="col-md-6 ContentText">Severity: </div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].condition_severity ? data.rows[i].condition_severity:"NA")+'</div></div><div class="row TexualContentWrapper"><div class="col-md-6 ContentText">Number of alerts in past 24 hrs:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].condition ? "1 time":"NA")+'</div></div>');
          critical_patient_data.push('</div><div class="col-md-3 ListWrapper">');

          if(data.rows[i].referral_chart_note_id && data.rows[i].referral_chart_note_id != "No Chart Note"){
            critical_patient_data.push('<div class="row TexualContentWrapper"><div class="col-md-6 ContentText font12 colorred">chart note:</div><div class="col-md-6 ContentTextVal ng-binding font12 referd_charting_template pointer" index = "'+data.rows[i].referral_chart_note_id+'" user_id="'+data.rows[i].user_id+'" refer_id="'+data.rows[i].doc_id+'">'+data.rows[i].referral_chart_notes+'</div></div>');
            critical_patient_data.push('<div class="row TexualContentWrapper">');
          }else{
            critical_patient_data.push('<div class="row mrgtop15">');
          }

          critical_patient_data.push('<div class="col-md-6 ContentText">SpO2:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].selfcare_data.O2 ? data.rows[i].selfcare_data.O2: "NA")+'</div></div><div class="row TexualContentWrapper"><div class="col-md-6 ContentText">Heart Rate:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].selfcare_data.HeartRate ? data.rows[i].selfcare_data.HeartRate : "NA")+'</div></div><div class="row TexualContentWrapper"><div class="col-md-6 ContentText">Symptoms from Care-plans:</div><div class="col-md-6 ContentTextVal ng-binding">NA</div></div></div><div class="col-md-3 ListWrapper ListWrapperAbsolute">');
          if(data.rows[i].insert_ts && data.rows[i].insert_ts != ""){
            critical_patient_data.push('<div class="row TexualContentWrapper"><div class="col-md-6 ContentText font12 colorred">Referred Date:</div><div class="col-md-6 ContentTextVal ng-binding font12">'+moment(data.rows[i].insert_ts).format("YYYY-MM-DD")+'</div></div>');
            critical_patient_data.push('<div class="row TexualContentWrapper">');
          }else{
            critical_patient_data.push('<div class="row mrgtop15">');
          }

          critical_patient_data.push('<div class="col-md-6 ContentText">BP:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].selfcare_data.Value_Systolic_BP ? (data.rows[i].selfcare_data.Value_Systolic_BP+ "/" +data.rows[i].selfcare_data.Value_Diastolic_BP):"NA")+'</div><div class="col-md-6 ContentText">Weight:</div><div class="col-md-6 ContentTextVal ng-binding">'+(data.rows[i].weight ? data.rows[i].weight : "NA")+'</div></div><div class="row TexualContentWrapper"><select class="AppintmentTextBox mrg-left5 ServiceIcon action_to_patient" user_id="'+data.rows[i].user_id+'" doc_id= "'+(data.rows[i].doc_id ? data.rows[i].doc_id : "NA")+'"><option>Select Action</option><option>Send notification (Appointment)</option>');
            
            if(edata.rows.length > 0 && (edata.rows[0].value.push_medications || edata.rows[0].value.send_an_rx_directly || edata.rows[0].value.update_existing_medications)) critical_patient_data.push('<option>Update Medications</option>');

            // critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient not critical</b></option></select></div></div></div>');

          // critical_patient_data.push('<table class="table"><tbody><tr><td width="5%" rowspan="2"><div class="bor_circle1"><a ui-sref="medical_history({user_id:\''+data.rows[i].user_id+'\'})" class="patient_image_link" user_id="'+data.rows[i].user_id+'"><img class="img_'+data.rows[i].user_id+' img-responsive" src="images/profile-pic.png" alt="profile-pic" /></a></div></td><th width="25%" class="name_'+data.rows[i].user_id+'"></th><th width="25%">'+(data.rows[i].condition ? data.rows[i].condition:"")+'</th><th width="25%">1</th></tr><tr><td class="city_'+data.rows[i].user_id+'"></td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td colspan="4"><select class="my-account-form-control placeholder-no-fix sltpdt action_to_patient" autocomplete="off" type="text" user_id="'+data.rows[i].user_id+'"><option>Select Action</option><option>Send notification (Appointment)</option>');

          // if(edata.rows.length > 0 && (edata.rows[0].value.push_medications || edata.rows[0].value.send_an_rx_directly || edata.rows[0].value.update_existing_medications)) critical_patient_data.push('<option>Update Medications</option>')

          // critical_patient_data.push('<option>Start a chart note</option><option>New Imaging Order</option><option>New eLab Order</option><option>Add Task</option><option><b>Patient not critical</b></option></select></td></tr></tbody></table><hr/>');
          
          if($("#critical_patient_link").hasClass("ChoiceTextActive")) {
            var condition = data.rows[i].condition ? data.rows[i].condition : "NA"; 
            if(condition == "From Doctor Note" || condition == "NA"){
              critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient not critical</b></option></select></div>');
            }else{
              critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option></select></div>');
            }
          }else if($("#regular_patient_link").hasClass("ChoiceTextActive")){
            var condition = data.rows[i].condition ? data.rows[i].condition : "NA"; 
            if(condition == "From Doctor Note" || condition == "NA"){
              if(data.rows[i].condition_severity == "High"){
                critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient not critical</b></option></select></div>');
              }else{
                critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient critical</b></option></select></div>');  
              }
            }else{
              critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option></select></div>'); 
            }    
          }else{
            var condition = data.rows[i].condition ? data.rows[i].condition : "NA"; critical_patient_data.push('<option>Update Medications</option><option>Start a chart note</option><option>Referral complete</option><option>Upload Files</option></select></div>');
            // if(condition == "From Doctor Note" || condition == "NA"){
            //   if(data.rows[i].condition_severity == "High"){
            //     critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient not critical</b></option></select></div></div></div>');
            //   }else{
            //     critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option><option><b>Patient critical</b></option></select></div></div></div>');  
            //   }
            // }else{
            //   critical_patient_data.push('<option>Start a chart note</option><option>New eLab &amp Imaging Order</option><option>Add Task</option><option>Upload Files</option></select></div></div></div>'); 
            // }    
          }
          critical_patient_data.push('</div></div>');
          getPatientDetails(data.rows[i].user_id);
        }
        if($("#critical_patient_link").hasClass("ChoiceTextActive")) {
          $("#critical_patient_tab").find(".criticalPatients").html( critical_patient_data.join(''));
        }else if($("#regular_patient_link").hasClass("ChoiceTextActive")){  
          $("#regular_patient_tab").find(".criticalPatients").html(critical_patient_data.join(''));
        }else{
          $("#referred_patient_tab").find(".criticalPatients").html(critical_patient_data.join(''));
        }
        $compile($(".patient_image_link"))($scope);
        $("html, body").animate({scrollTop: 0}, 'slow');
      },
      error: function(data, error, reason) {
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      key: pd_data._id
    });
  }

  function displayPatientList(){
    //$("#practice_dashboard_link").parent().addClass("active");
    $("#my_account .tab-pane").removeClass("active");
    $("#my_account .nav-tabs li").removeClass("active");
    if(pd_data.level != "Doctor" && pd_data.level != ""){
      $("#current_madication, #diagnosis_link, #careplan_link, #charting_link").hide().removeClass("pd");
    }
   plController.getDoctorsPatientList();
  }

  function activeCriticalPatientLists(){
    $(".tab-pane").removeClass("active");
    $("#critical_patient_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#critical_patient_link").addClass("ChoiceTextActive");
    $(".hide_patient").hide();
    $("#critical_patient_tab").addClass("active");
    $("#critical_patient_tab").show();
  }

  function activeReferredPatientLists(){
    $(".tab-pane").removeClass("active");
    $("#referred_patient_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#referred_patient_link").addClass("ChoiceTextActive");
    $(".hide_patient").hide();
    $("#referred_patient_tab").addClass("active");
    $("#referred_patient_tab").show();
  }

  function activeRegularPatientLists(){
    $(".tab-pane").removeClass("active");
    $("#regular_patient_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#regular_patient_link").addClass("ChoiceTextActive");
    $(".hide_patient").hide();
    $("#regular_patient_tab").addClass("active");
    $("#regular_patient_tab").show();
  }

  function activeReferredPatientListsByDoctor(){
    $(".tab-pane").removeClass("active");
    $("#referred_patient_list_link").parent().find("div").removeClass("ChoiceTextActive")
    $("#referred_patient_list_link").addClass("ChoiceTextActive");
    $(".hide_patient").hide();
    $("#referred_patient_list_tab").addClass("active");
    $("#referred_patient_list_tab").show();
    getDoctorReferralPatients();
  }

  function getDoctorReferralPatients(){
    $("#refered_patient_list tbody").html("");
    $.couch.db(db).view("tamsa/getReferralPatientsByDoctorID",{
      success:function(data){
        if(data.rows.length > 0){
          paginationConfiguration(data,"refered_patient_list_pagination",10,getDoctorReferralPatientsInformation);
        }else{
          $("#refered_patient_list tbody").html("No records Found");
        }
      },
      error:function(data){
        console.log(data);
      },
      key:pd_data._id,
      descending:false
    });
  }

  function getDoctorReferralPatientsInformation(start,end,data){
    var refer_html = [];
    for (var i = start; i < end; i++) {
      refer_html.push('<tr><td>'+data.rows[i].value.User_firstname+' '+data.rows[i].value.User_lastname+'</td><td>'+moment(data.rows[i].value.insert_ts).format("YYYY-MM-DD")+'</td><td>'+(data.rows[i].value.update_ts ? moment(data.rows[i].value.update_ts).format("YYYY-MM-DD") : "Not Completed")+'</td><td>'+data.rows[i].value.doctor+'</td>');
      if(data.rows[i].value.referral_chart_notes == "No Chart Note"){
        refer_html.push('<td>NA</td>');
      }else{
        refer_html.push('<td ><span class="referrd_summary_chartnote_link pointer hover" index = "'+data.rows[i].value.referral_chart_note_id+'" user_id="'+data.rows[i].value.user_id+'" refer_id="'+data.rows[i].value._id+'">'+data.rows[i].value.referral_chart_notes+'</span></td>');
      }
      refer_html.push('<td>'+(data.rows[i].value.referral_note ? data.rows[i].value.referral_note :"NA")+'</td><tr>');
    }
    $("#refered_patient_list tbody").html(refer_html.join(''));
  }

  function patientListEventBindings(){
    $("#add_patient_task_modal").on("click","#save_patient_add_task",function(){
      savePatientTask();
    });

    $("#my_account").on("click","#critical_patient_link",function(){
     plController.getDoctorsPatientList();
    });

    $("#my_account").on("click","#referred_patient_link",function(){
      plController.getReferredPatients();
    });

    $("#my_account").on("click","#regular_patient_link",function(){
      plController.getRegularPatients();
    });

    $("#my_account").on("click","#referred_patient_list_link",function(){
      activeReferredPatientListsByDoctor();
    });

    $("#my_account").on("click","#charting_template_default",function(){
      $("#start_chartnote_model").modal("hide"); 
      $("#start_chartnote_model").on("hidden.bs.modal",function(){
        $state.go("patient_charting_templates",{user_id:$("#charting_template_default").attr('user_id'),template_state:"choose"});
      });
    });
    
    $("#my_account").on("click","#recently_chatrtion_template",function(){
      $("#start_chartnote_model").modal("hide");
      $("#start_chartnote_model").on("hidden.bs.modal",function(){
        $state.go("patient_charting_templates",{user_id:$("#recently_chatrtion_template").attr('_id'),template_id:$("#recently_chatrtion_template").attr('temp_id'),template_state:"choose"});
      });
    });

    $("#my_account").on("change",".action_to_patient",function() {
     criticalPatientActions($(this),$state);
    });

    $("#my_account").on("click",".referd_charting_template",function() {
      $state.go("patient_charting_templates",{user_id:$(".referd_charting_template").attr('user_id'),template_id:$(".referd_charting_template").attr('index'),template_state:"choose",template_parameter:$(".referd_charting_template").attr('refer_id')});
    });

    $("#my_account").on("click",".referrd_summary_chartnote_link",function() {
      $state.go("patient_charting_templates",{user_id:$(this).attr('user_id'),template_id:$(this).attr('index'),template_state:"choose"});
    });

    //searchPatientByNameAutocompleter("search_name",autocompleterSelectEventForSubscriberListOnPatientSearch,true,pd_data._id,pd_data.dhp_code);
    // searchPatientByNameAutocompleter("search_name_regular",autocompleterSelectEventForSubscriberListOnPatientSearch,true,pd_data._id,pd_data.dhp_code);
    // searchReferredPatientByNameAutocompleter("search_name_referred",autocompleterSelectEventForReferredSubscriberListOnPatientSearch,pd_data._id);

    var _view="searchDoctorPatientsByNameOrDHPId" ;
    var _viewDHP="searchDHPPatientsByNameOrDHPId" ;
    var _referview = "getReferredPatientsByPatientDHPId";
    searchPatientsByNameOrDHPIdAutocompleter("search_critical_patients",autocompleterSelectEventForSubscriberListOnPatientSearch,true,pd_data._id,pd_data.dhp_code,_view,_viewDHP);
    searchPatientsByNameOrDHPIdAutocompleter("search_name_regular",autocompleterSelectEventForSubscriberListOnPatientSearch,true,pd_data._id,pd_data.dhp_code,_view,_viewDHP);
    searchPatientsByNameOrDHPIdAutocompleter("search_name_referred",autocompleterSelectEventForSubscriberListOnPatientSearch,true,pd_data._id,pd_data.dhp_code,_referview);

    // searchPatientByDHPIdAutocompleter("search_by_patient_dhp",autocompleterSelectForSubscriberByPatientDHPOnPatientSearch,true,pd_data._id,pd_data.dhp_code);
    // searchPatientByDHPIdAutocompleter("search_by_patient_dhp_regular",autocompleterSelectForSubscriberByPatientDHPOnPatientSearch,true,pd_data._id,pd_data.dhp_code);
    // searchReferredPatientByDHPIdAutocompleter("search_by_patient_dhp_referred",autocompleterSelectForSubscriberByPatientDHPOnPatientSearch,pd_data._id);
  }

 plController.getDoctorsPatientList = function (){
    $('#timeline_list').html('');
    $('.pd').hide('slow');
    resetmenu();
    $('.norecord_msg1').hide();
    activeCriticalPatientLists();
    getDoctorPatients(pd_data._id);
  }

  function getDoctorPatients(key) {
    $("#critical_patient_tab").find(".criticalPatients").html('');
    $("#search_name").val("");
    var view  = "";
    var list  = "";
    var docid = "";
    if(pd_data.level == "Doctor"){
      view  = "tamsa/getDoctorSubscriberNew";
      list  = "criticalPatientsDoctorList";
      docid = pd_data._id;
    }else{
      view = "tamsa/getDhpSubscribersNew";
      key  = pd_data.dhp_code;
      list = "criticalPatientsDhpList";
      docid = pd_data.dhp_code;
    }
    showhideloader('show');

    $.couch.db(db).list("tamsa/"+list, view, {
      doctor_id:docid
    }).success(function(data){
      showhideloader('hide');
      if(data.rows.length > 0){
        $("#criticalHeading").hide();
        paginationConfiguration(data,"critical_patient_list_pagination",10,getPatientConditions);
      }else{
        $("#criticalHeading").show();
      }
    }).error(function(data, error, reason){
        showhideloader('hide');
        newAlert('danger',reason);
    });
  }

  function getPatientDetails(key) {
    $.couch.db(personal_details_db  ).view("tamsa/getPatientInformation", {
      success: function(data) {
        if(data.rows.length == 1){
          if($("#critical_patient_link").hasClass("ChoiceTextActive")){
            renderPatientDetailsOnPatientList("critical_patient_tab",data,key);
          }else if($("#regular_patient_link").hasClass("ChoiceTextActive")){
            renderPatientDetailsOnPatientList("regular_patient_tab",data,key);
          }else{
            renderPatientDetailsOnPatientList("referred_patient_tab",data,key);
          }
        }else if(data.rows.length  == 0){
          if($("#critical_patient_link").hasClass("ChoiceTextActive")){
            renderPatientDetailsOnPatientList("critical_patient_tab",data,key);
          }else if($("#regular_patient_link").hasClass("ChoiceTextActive")){
            renderPatientDetailsOnPatientList("regular_patient_tab",data,key);
          }else{
            renderPatientDetailsOnPatientList("referred_patient_tab",data,key);
          }
          // newAlert("danger","No patient details found for one of the patient.");
          // $("html, body").animate({scrollTop: 0}, 'slow');
          // return false;
        }else{
          // newAlert("danger","Multiple records of patient details found for single Patient.!!!");
          // $("html, body").animate({scrollTop: 0}, 'slow');
          // return false;
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key: key
    });
  }

  function renderPatientDetailsOnPatientList(parentid,data,key){
    if(data.rows.length == 1){  
      $("#"+parentid).find(".name_"+key+"").text(data.rows[0].value.first_nm+" "+data.rows[0].value.last_nm);
      $("#"+parentid).find(".city_"+key+"").text(data.rows[0].value.city);
      if(data.rows[0].value.imgblob){
        $("#"+parentid).find(".img_"+key+"").attr("src",data.rows[0].value.imgblob);
      }else if(data.rows[0].value._attachments){
          Object.keys(data.rows[0].value._attachments).forEach(function( name ) {
            var lengthimg = data.rows[0].value._attachments[name].length;
            if(Number(lengthimg) > 0) { 
              var url = $.couch.urlPrefix+'/'+personal_details_db+'/'+data.rows[0].id+'/'+Object.keys(data.rows[0].value._attachments)[0];
              $("#"+parentid).find(".img_"+key+"").attr("src", url);
            }  
          });
      }
    }else if(data.rows.length == 0){
      $("#"+parentid).find(".name_"+key+"").parent().parent().parent().parent().remove();
    }   
  }

  plController.getRegularPatients = function  () {
    activeRegularPatientLists();
    $.couch.db(db).list("tamsa/regularPatientsList", "getRegularDoctorSubscibers", {
     doctor_id:pd_data._id
    }).success(function(data){
      if(data.rows.length > 0){
        $("#regularHeading").hide();
        $("#search_name_regular").parent().parent().show();
        paginationConfiguration(data,"regular_patient_list_pagination",10,getPatientConditions);
      }else{
        $("#regularHeading").show();
        $("#search_name_regular").parent().parent().hide();
      }
    });
  }
  // function getRegularPatients(){
  //   activeRegularPatientLists();
  //   $.couch.db(db).list("tamsa/regularPatientsList", "getRegularDoctorSubscibers", {
  //     doctor_id:pd_data._id
  //   }).success(function(data){
  //     if(data.rows.length > 0){
  //       $("#regularHeading").hide();
  //       $("#search_name_regular").parent().parent().show();
  //       paginationConfiguration(data,"regular_patient_list_pagination",10,getPatientConditions);
  //     }else{
  //       $("#regularHeading").show();
  //       $("#search_name_regular").parent().parent().hide();
  //     }
  //   });
  // }

  plController.getReferredPatients = function (){
    activeReferredPatientLists();
    $.couch.db(db).list("tamsa/referredPatientList", "getReferredPatients", {
     doctor_id:pd_data._id
    }).success(function(data){
      if(data.rows.length > 0){
        $("#referredHeading").html("List of patients referred by other doctors.");
        paginationConfiguration(data,"referred_patient_list_pagination",10,getPatientConditions);
      }else{
        $("#referredPatients").html('');
          // $("#search_name_referred").parent().parent().hide();
        $("#referredHeading").html("There isn't any referred patient in Your practice.");
      }
    });
    // $.couch.db(db).view("tamsa/getDoctorReferral", {
    //   success: function(data) {
    //     if(data.rows.length > 0){
    //       $("#referredHeading").html("List of patients referred by other doctors.");
    //       // for (var i = 0; i < data.rows.length; i++) {
    //       //   getReferredPatientDetails(data.rows[i].key[3], data.rows[i].id);
    //       // }
    //       paginationConfiguration(data,"referred_patient_list_pagination",10,getPatientConditions);
    //       // $("#search_name_referred").parent().parent().show();
    //       // $("#referredPatients").find(".search-bg-design").show();
    //     }
    //     else{
    //       $("#referredPatients").html('');
    //       // $("#search_name_referred").parent().parent().hide();
    //       $("#referredHeading").html("There isn't any referred patient in Your practice.");
    //     }
    //   },
    //   error: function(status) {
    //     console.log(status);
    //   },
    //   startkey : ["N", pd_data._id],
    //   endkey: ["N", pd_data._id, {}, {}],
    //   reduce : false,
    //   group : false
    // });
  }

  function getReferredPatientDetails(key, r_id) {
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {  
      success: function(data) {
        url = "images/profile-pic.png";
        var html = "";
        for (var i = 0; i < data.rows.length; i++) {
          var r_name = data.rows[i].value.first_nm+" "+data.rows[i].value.last_nm;
          var r_city = data.rows[i].value.city;
          if(data.rows[i].value._attachments) var url = '/'+personal_details_db+'/'+data.rows[i].id+'/'+Object.keys(data.rows[i].value._attachments)[0]
        }

        $.couch.db(db).view("tamsa/getPatientConditionBySeverity", {
          success: function(data) {
            if(data.rows.length > 0) {
              html = '<table class="table"><tbody><tr><td width="5%" rowspan="2"><div class="bor_circle1"><a href="JavaScript: void(0);" class="patient_image_link" user_id="'+key+'"><img class="img-responsive" src="'+url+'" alt="profile-pic" /></a></div></td><th width="25%">'+r_name+'</th><th width="25%"></th><th width="25%"><span class="label label-danger">Critical</span></th></tr><tr><td>'+r_city+'</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td colspan="4"><select class="my-account-form-control placeholder-no-fix sltpdt action_to_patient" autocomplete="off" type="text" user_id="'+key+'" doc_id="'+r_id+'"><option>Select Action</option><option>Send notification (Appointment)</option><option>Update Medications</option><option>Start a chart note</option><option>Referral complete</option><option>Upload Files</option></select></td></tr></tbody></table><hr />';
            }
            else {
              html = '<table class="table"><tbody><tr><td width="5%" rowspan="2"><div class="bor_circle1"><a href="JavaScript: void(0);" class="patient_image_link" user_id="'+key+'"><img class="img-responsive" src="'+url+'" alt="profile-pic" /></a></div></td><th width="25%">'+r_name+'</th><th width="25%"></th><th width="25%"></th></tr><tr><td>'+r_city+'</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td colspan="4"><select class="my-account-form-control placeholder-no-fix sltpdt action_to_patient" autocomplete="off" type="text" user_id="'+key+'" doc_id="'+r_id+'"><option>Select Action</option><option>Send notification (Appointment)</option><option>Update Medications</option><option>Start a chart note</option><option>Referral complete</option><option>Upload Files</option></select></td></tr></tbody></table><hr />'; 
            }
            $("#referredPatients").append(html);
          },
          error: function(status) {
            console.log(status);
          },
          startkey: ["High",key],
          endkey: ["High",key, {}, {}],
          reduce : true,
          group : true
        });
      },
      error: function(status) {
        console.log(status);
      },
      key: key
    });
  }

  function criticalPatientActions($obj,$state){
    var action_type = $obj.val();
    if (action_type == "Send notification (Appointment)") {
      $state.go("patient_appointments",{user_id:$obj.attr("user_id")});
    }
    else if (action_type == "Update Medications") {
      $state.go("medical_history",{user_id:$obj.attr("user_id"),tab_id:"medication"});
      $obj.val("Select Action");
    }
    else if (action_type == "Start a chart note") {
      openStratChartnoteModel($obj);
    }
    else if (action_type == "Referral complete") {
      completeRefferal($obj.attr('doc_id'));
    }else if (action_type == "New eLab & Imaging Order") {
      $state.go("medical_history",{user_id:$obj.attr("user_id"),tab_id:"elab order"});
      $obj.val("Select Action");
    }else if (action_type == "Add Task") {
      openAddPatientTaskModal($obj);
    }else if(action_type == "Upload Files") {
      showUploadFilesModal($obj.attr("user_id"),$obj.closest(".ListContatiner").find(".Username").html());
    }else if(action_type == "Patient not critical") {
      var  id="";
      if($("#regular_patient_link").hasClass("ChoiceTextActive")){
        id ="regular_patient_link";
      }else{
        id="critical_patient_link";
      }
      tamsaFactories.makePatientCritical(false,id,$obj.attr("user_id"),pd_data._id);
    }else if(action_type == "Patient critical") {
      var id = "";
      if($("#regular_patient_link").hasClass("ChoiceTextActive")){
        id ="regular_patient_link";
      }else{
        id ="critical_patient_link";
      }
      tamsaFactories.makePatientCritical(true,id,$obj.attr("user_id"),pd_data._id);
    }
  }

  function autocompleterSelectEventForSubscriberListOnPatientSearch(ui,search_id){
    $('#timeline_list').html('');
    //$('#profile').hide();
    if(ui.item.key[1] == "No results found"){
      return false;
    }else{
      $state.go("medical_history",{user_id:ui.item.key[2]})
      // $("#"+search_id).val('');
      // $('#mytabs').show();
      // tamsaFactories.getSearchPatient(ui.item.key[2]);
      // $("#past_history_tab_link").click();
    }
    return false;
  }

  function autocompleterSelectEventForReferredSubscriberListOnPatientSearch(ui,search_id){
    $('#timeline_list').html('');
    if(ui.item.key[2] == "No results found"){
      return false;
    }else{
      $state.go("medical_history",{user_id:ui.item.key[2]});
    }
  }

  function autocompleterSelectForSubscriberByPatientDHPOnPatientSearch(ui,search_id){
    $('#timeline_list').html('');
    if(ui.item.key[1] == "No results found"){
      return false;
    }else{
      $state.go("medical_history",{user_id:ui.item.doc.user_id});
    }
  }

});