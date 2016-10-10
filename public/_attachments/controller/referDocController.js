// var d    = new Date();
// var pd_data = {};
// app.controller("referDocController",function($scope,$state,tamsaFactories){
//   $.couch.session({
//     success: function(data) {
//       if(data.userCtx.name == null)
//          window.location.href = "index.html";
//       else {
//         $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
//           success: function(data) {
//             pd_data = data;
//             $scope.level = data.level;
//             $scope.$apply();
//             tamsaFactories.pdBack();
//             tamsaFactories.sharedBindings();
//             getReferADocForm();
//             eventBindingsReferDoc();

//           },
//           error: function(status) {
//             console.log(status);
//           }
//         });
//       }
//     }
//   });
// });

// function activeReferADoc() {
//   $(".tab-pane").removeClass("active");
//   $("#refer_a_doc_tab").addClass("active");
//   $("#refer_a_doc_link").parent().find("div").removeClass("ChoiceTextActive");
//   $("#refer_a_doc_link").addClass("ChoiceTextActive");
//   if(pd_data.level == "Doctor"){
//     $("#rd_sincerly").val("Dr."+pd_data.first_name+" " +pd_data.last_name);
//   }
// }

// function activeReferedSummary() {
//   $(".tab-pane").removeClass("active");
//   $("#refered_summary_tab").addClass("active");
//   $("#refered_summary_link").parent().find("div").removeClass("ChoiceTextActive");
//   $("#refered_summary_link").addClass("ChoiceTextActive");
//   getReferedSummary();
// }

// function getReferedSummary() {
//   $.couch.db(db).view("tamsa/getReferDocuments", {
//     success: function(data) {
//       if (data.rows.length > 0) {
//         paginationConfiguration(data, "refer_summary_list_pagination", 5, displayReferSummary);
//       } else {
//         var telemedicine_inq = [];
//         telemedicine_inq.push('<tr><td>No Inquiries are Found.</td></tr>')
//         $("#refer_summary_list tbody").html(telemedicine_inq.join(''));
//       }
//     },
//     error: function(data, errr, reason) {
//       newAlert("danger",reason);
//       $("html, body").animate({scrollTop: 0}, 'slow');
//       return false;
//     },
//     key: pd_data._id,
//     reduce: false
//   });
// }

// function displayReferSummary(start, end, data) {
//   var refer_summary = [];
//   for(var i=start;i<end;i++){
//     refer_summary.push('<tr><td class="text-align"><span>'+data.rows[i].value.insert_ts.substring(0, 10)+'</span></td><td class="text-align">'+data.rows[i].value.referred_doctor_name+'</td><td class="text-align">'+data.rows[i].value.rd_doctor_email+'</td></tr>');
//   }
//   $("#refer_summary_list tbody").html(refer_summary.join(''));
// }

// function eventBindingsReferDoc() {
//   $('#refer_a_doc').on('click', '#refer_a_doc_link', function (e) {
//     activeReferADoc();
//   });

//   $('#refer_a_doc').on('click', '#refered_summary_link', function (e) {
//     activeReferedSummary();
//   });

//   $("#refer_a_doc").on("click", '#rd_save',function() {
//     $("#rd_save").attr("disabled","disabled");
//     if(requiredReferDoc() && verifyEmail("rd_doctor_email")){
//       saveRd();
//     }else{
//       $("#rd_save").removeAttr("disabled");
//       return false;
//     }
//   });
// }

// function getReferADocForm(){
//   $(".tab-pane").removeClass("active");
//   $("#refer_a_doc").addClass("active");
//   activeReferADoc();
// }

// function saveRd() {
//   var d  = new Date();
//   var rd_doc = {
//     insert_ts:     d,
//     doctype:              "refer_a_doc",
//     doctor_id:            pd_data._id,
//     rd_doctor_email:      $("#rd_doctor_email").val(),
//     referred_doctor_name: $("#rd_doctor_name").val(),
//     intoduction:          $("#rd_introduction").val(),
//     sincerly:             $("#rd_sincerly").val()
//   };

//   var cron_record = {
//     operation_case:       "10",
//     processed:            "No",
//     doctype:              "cronRecords",
//     doctor_id:            pd_data._id,
//     rd_doctor_email:      $("#rd_doctor_email").val(),
//     referred_doctor_name: $("#rd_doctor_name").val(),
//     intoduction:          $("#rd_introduction").val(),
//     sincerly:             $("#rd_sincerly").val()
//   }

//   $.couch.db(db).saveDoc(rd_doc, {
//     success: function(data) {
//       newAlert('success', 'Reference sent successfully !');
//       $('html, body').animate({scrollTop: 0}, 'slow');
//       clearSaveRdForm();
//       $.couch.db(db).saveDoc(cron_record, {
//         success: function(data) {
//           $("#rd_save").removeAttr("disabled");
//           getReferCount();
//         },
//         error: function(data, error, reason) {
//           newAlert('error', reason);
//           $('html, body').animate({scrollTop: 0}, 'slow');
//           $("#rd_save").removeAttr("disabled");
//         }
//       })
//     },
//     error: function(data, error, reason) {
//       newAlert('error', reason);
//       $('html, body').animate({scrollTop: 0}, 'slow');
//       $("#rd_save").removeAttr("disabled");
//     }
//   })
// }

// function clearSaveRdForm() {
//   $("#rd_doctor_name").val("");
//   $("#rd_doctor_email").val("");
//   $("#rd_introduction").val("");
//   $("#rd_sincerly").val("");
// }
