// var d    = new Date();
// var pd_data = {};
// app.controller("patientInfoController",function($scope,$state,tamsaFactories,$stateParams){
//   $.couch.session({
//     success: function(data) {
//       if(data.userCtx.name == null)
//          window.location.href = "index.html";
//       else {
//         $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
//           success: function(data) {
//             pd_data = data;
//             tamsaFactories.pdBack();
//             tamsaFactories.sharedBindings();
//             patientInfoEventBindings();
//             if($stateParams.user_id){
//               displaySearchPatient($stateParams.user_id);
//             }else{
//               displayPatientInfo();
//             }
//           },
//           error:function(data,error,reason){
//             newAlert("danger",reason);
//             $("html, body").animate({scrollTop: 0}, 'slow');
//             return false;
//           }
//         });
//       }
//     }
//   });
// });
// function displaySearchPatient(user_id) {
//   $(".tab-pane").removeClass("active");
//   $("#single_user").addClass("active");
//   clearPatientProfileDetails();
//   activateSearchPatient();
//   updateSearchPatientWithUserDetails(user_id);
// }

// function updateSearchPatientWithUserDetails(user_id){
//   var view = "";
//   var keyval = "";
//   if(pd_data.level == "Doctor" || pd_data.level == ""){
//     view = "tamsa/getDoctorSubscribers";
//     keyval = pd_data._id;
//   }else{
//     view = "tamsa/getDhpSubscribers";
//     keyval  = pd_data.dhp_code;
//   }
//   $.couch.db(db).view(view, {
//     success: function(data) {
//       if(data.rows.length > 0){
//         $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
//           success:function(persoal_info){
//             $.couch.db(db).view("tamsa/testPatientsInfo",{
//               success:function(medical_info){
//                 if(persoal_info.rows.length > 0){
//                   getPatientProfileDetails(persoal_info,medical_info);
//                 }
//               },
//               error:function(medical_info,error,reason){
//                 newAlert("danger",reason);
//                 $("html, body").animate({scrollTop: 0}, 'slow');
//                 return false;
//               },
//               key: [user_id,1],
//               include_docs:true
//             });
//           },
//           error:function(persoal_info,error,reason){
//             newAlert("danger",reason);
//             $("html, body").animate({scrollTop: 0}, 'slow');
//             return false;
//           },
//           key: user_id,
//           include_docs:true
//         });
//       }
//       else{
//         newAlert("danger","Patient is not a subscriber. You can not edit.");
//         $("html, body").animate({scrollTop: 0}, 'slow');
//         return false;
//       }
//     },
//     error: function(status) {
//       console.log(status);
//     },
//     key: [keyval,user_id],
//     reduce:true,
//     group:true
//   });
// }

// function displayPatientInfo() {
//   $(".tab-pane").removeClass("active");
//   $("#single_user").addClass("active");
//   $("#import_patient_tab").addClass("active");
//   clearPatientProfileDetails();
//   activateImportPatient();
// }

// function activateImportPatient(){
//   $(".tab-pane").removeClass("active");
//   $("#search_patient_tab").hide();
//   $("#import_patient_tab").addClass("active");
//   $("#import_patients_link").parent().find("div").removeClass("ChoiceTextActive")
//   $("#import_patients_link").addClass("ChoiceTextActive");
//   // $("#single_user").find("#single_user_add").trigger("click");
//   activateSingleUserAdd($("#single_user_add"));
// }

// function activateSearchPatient(){
//   $("#search_patient_tab").show();
//   $(".tab-pane").removeClass("active");
//   $("#search_patient_tab").addClass("active");
//   $("#search_patient_link").parent().find("div").removeClass("ChoiceTextActive")
//   $("#search_patient_link").addClass("ChoiceTextActive");
// }

// function activateSingleUserAdd($obj){
//   $obj.addClass("btn-warning");
//   $("#single_user_by_dhp_id, #import_from_csv").addClass("btn-default").removeClass("btn-warning");
//   $("#single_user_add_parent").show();
//   $("#import_from_csv_parent,#single_user_by_dhp_id_parent").hide();
//   $("#isu_physicians option").remove();
//   getStates("isu_state","select state");
//   $("#isu_city").html('<option selected="selected" value="select city">Select city</option>');

//   $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
//     success: function(data){
//       for(var i=0; i<data.rows.length;i++){
//         if( data.rows[i].value == pd_data._id || pd_data.level != "Doctor"){
//           $("#isu_physicians").append("<option selected='selected' value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
//           $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
//           $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
//         }else{
//           $("#isu_physicians").append("<option email = "+data.rows[i].doc.email+" phone="+data.rows[i].doc.phone+" value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
//           $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
//           $("#isu_physicians option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
//         }
//       }
//     },error: function(data,error,reason){
//       console.log(data);
//     },
//     startkey: [pd_data.dhp_code],
//     endkey: [pd_data.dhp_code,{}],
//     include_docs:true
//   });
// }

// function autocompleterSelectEventForOnPatientSearch(ui,search_id){
//   $('#timeline_list').html('');
//   if(ui.item.key[1] == "No results found"){
//     return false;
//   }else{
//     getPatientProfileForUpdate(ui.item.key[2]);
//   }
//   return false;
// }

// function patientInfoEventBindings(){
//   $("#single_user").on("click",".remove-fmh", function() {
//     $(this).parents(".fmh-parent").remove();
//   });
  
//   $("#single_user").on("click","#save_by_dhp_id",function(){
//     addByDhpId();
//   });
  
//   $("#single_user").on("click",".add_more_fmh", function() {
//     addMoreFMHInAddNewPatient();
//   });

//   $("#single_user").on("click","#import_patients_link",function(){
//     activateImportPatient();
//   });

//   $("#single_user").on("click","#search_patient_link",function(){
//     activateSearchPatient();
//   });

//   $("#single_user").on("click","#single_user_add",function() {
//     activateSingleUserAdd($(this));
//   });

//   $("#single_user").on("click","#single_user_by_dhp_id",function() {
//     $(this).addClass("btn-warning");
//     $("#single_user_add, #import_from_csv").addClass("btn-default").removeClass("btn-warning");
//     $("#single_user_by_dhp_id_parent").show();
//     $("#import_from_csv_parent,#single_user_add_parent").hide();
//     $("#physicians_by_dhp_id option").remove();

//     $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
//       success: function(data){
//         for(var i=0; i<data.rows.length;i++){
//           if( data.rows[i].value == pd_data._id || pd_data.level != "Doctor"){
//             $("#physicians_by_dhp_id").append("<option selected='selected' value ='"+data.rows[i].value+"'>"+data.rows[i].key[1]+"</option>");
//             $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
//             $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
//           }else{
//             $("#physicians_by_dhp_id").append("<option value ='"+data.rows[i].value+"'>"+data.rows[i].key[1] +"</option>");
//             $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("email",data.rows[i].doc.email);
//             $("#physicians_by_dhp_id option").filter("option[value='"+data.rows[i].value+"']").data("phone",data.rows[i].doc.phone);
//           }
//         }
//       },error: function(data,error,reason){
//         console.log(data);
//       },
//       startkey: [pd_data.dhp_code],
//       endkey: [pd_data.dhp_code,{}],
//       include_docs:true
//     });
//   });

//   $("#single_user").on("click","#import_from_csv",function(){
//     $(this).addClass("btn-warning").removeClass("btn-default");
//     $("#single_user_by_dhp_id, #single_user_add").addClass("btn-default").removeClass("btn-warning");
//     $("#import_from_csv_parent").show();
//     $("#single_user_by_dhp_id_parent, #single_user_add_parent").hide();
//   });

//   $("#single_user").on("focusout","#isu_height, #isu_weight",function(){
//     if(isNaN(calculatePatientBMI($("#isu_height").val(),$("#isu_weight").val()))){
//       $("#isu_BMI").val("");
//     }else{
//       $("#isu_BMI").val(calculatePatientBMI($("#isu_height").val(),$("#isu_weight").val()));
//     }
//   });
  
//   $("#single_user").on("click","#isu_email_not_provided",function(){
//     emailNotProvidedToggle($(this));
//   });

//   searchPatientsByNameOrDHPIdAutocompleter("search_patients_update_profile",autocompleterSelectEventForOnPatientSearch,true,pd_data._id,pd_data.dhp_code);

//   $("#single_user").on("click","#update_patient_profile",function(){
//     updatePatientProfile();
//   });

//   $("#single_user").on("change","#isu_state", function() {
//     getCities($("#isu_state").val(), "isu_city", "select city");
//   });
//   $("#single_user").on("change","#edit_patient_state", function() {
//     getCities($("#edit_patient_state").val(), "edit_patient_city", "select city");
//   });

//   $("#single_user").on("click","#age_link",function(){
//     if($(this).html() == "Enter Age"){
//       $(this).html("Date Of Birth");
//       $("#db_label").html("Age*");
//       $("#isu_date_of_birth").val("").hide().datepicker("destroy");
//       $("#isu_age").show();
//     }else{
//       $("#db_label").html("Date Of Birth*");
//       $("#isu_date_of_birth").show();
//       $("#isu_age").hide();
//       $(this).html("Enter Age");
//     }
//   });
//   $("#single_user").on("click","#edit_link",function(){
//     if($(this).html() == "Enter Age"){
//       $(this).html("Date Of Birth");
//       $("#dbl_label").html("Age*");
//       $("#issu_date_of_birth").hide().datepicker("destroy");
//       $("#issu_age").show();
//     }else{
//       $("#dbl_label").html("Date Of Birth*");
//       $("#issu_date_of_birth").show();
//       $("#issu_age").hide();
//       $(this).html("Enter Age");
//     }
//   });

//   $('#single_user').on('click','#import_patient', function(){
//     uploadfile();
//   }); 
//   $('#single_user').on('click','#skipped_rows_parent1', function(){
//     downloadPatientSkippedRowsCSV($("#skipped_rows_link_patient").data("skip_row"));
//   });
  

//   $('#single_user').on('click','#isu_upload', function(){
//     saveSinglePatient();
//   });

//   $("#single_user").on("click","#add_new_allergiess",function(){
//     addOneNewAllergies();
//   });

//   $("#single_user").on("click","#remove_add_new_allergiess",function(){
//     $(this).parent().remove();
//   });

//   generateMultiSelect("isu_allergies");
//   generateMultiSelect("isu_condition");
// }