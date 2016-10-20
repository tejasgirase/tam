app.controller("telemedicineController",function($scope,$state,$stateParams,tamsaFactories){
	$.couch.session({
	  success: function(data) {
	    if(!data)window.location = "index.html";
	    else {
        pd_data = data;
        $scope.level = data.level;
        $scope.$apply();
        tamsaFactories.pdBack();
        tamsaFactories.sharedBindings();
				$(".tab-pane").removeClass("active");
				$("#telemedicine_inquiry_tab").addClass("active");
				$("#home").addClass("active");
				$("#personal_details_in").addClass("active");
				$("#lab_results_inner").addClass("active");
        tamsaFactories.displayDoctorInformation(data);
        telemedicineInqiuiriesEventBindings();
				getDoctorTelemedicineInqueries(data._id);
        if($stateParams.doc_id) {
          $.blockUI();
        }
	    }
	  },  
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });

	function telemedicineInqiuiriesEventBindings() {
    $("#telemedicine_inquiry_list").on("click",".telemedicine_row", function() {
      getTelemedicineInqueryDetails($(this));
    });

    $("#telemedicine_inquiry_list").on("click",".close-telemdicine-details", function() {
      closeTelemedicineInqueryDetails($(this));
    });
    
    $("#telemedicine_inquiry_list").on("click","#tir_send",function(){
      saveTelemedicineResponse();
    });
  }

  function getDoctorTelemedicineInqueries(doctor_id) {
    $.couch.db(db).list("tamsa/getHospitalInquiryList", "getDoctorTelemedicineInqueries", {
    include_docs:true,
    practice_id:pd_data.random_code,
    dhp_code:pd_data.dhp_code
    }).success(function(data){
      if (data.rows.length > 0) {
        $scope.teledata = data;
        $scope.$apply();
        if($stateParams.doc_id) {
          $("#telemedicine_inquiry_list").find("span[doc_id='"+$stateParams.doc_id+"']").trigger("click");
          $.unblockUI();
        }  
      }else {
        $scope.teledata = "";
        $scope.$apply();  
      }
    });
   //  $.couch.db(db).view("tamsa/getDoctorTelemedicineInqueries", {
  	//   success: function(data) {
  	//     if (data.rows.length > 0) {
   //        $scope.teledata = data;
   //        $scope.$apply();
   //        if($stateParams.doc_id) {
   //          $("#telemedicine_inquiry_list").find("span[doc_id='"+$stateParams.doc_id+"']").trigger("click");
   //          $.unblockUI();
   //        }
  	//       //paginationConfiguration(data, "telemedicine_inquiaries_pagination", 5, displayDoctorTelemedicineInqueiries);
  	//     } else {
  	//       var telemedicine_inq = [];
  	//       telemedicine_inq.push('<tr><td>No Inquiries are Found.</td></tr>');
  	//       $("#telemedicine_inquiry_list tbody").html(telemedicine_inq.join(''));
  	//     }
  	//   },
  	//   error:function(data,error,reason){
   //      newAlert("danger",reason);
   //      $("html, body").animate({scrollTop: 0}, 'slow');
   //      return false;
   //    },
  	//   startkey: [pd_data.random_code],
  	//   endkey: [pd_data.random_code, {}],
  	//   include_docs: true
  	// });
  }

  function displayDoctorTelemedicineInqueiries(start,end,data){
    var telemedicine_inq = [];
    for(var i=start;i<end;i++){
      telemedicine_inq.push('<tr><td class="text-align"><span doc_id="'+data.rows[i].doc._id+'" class="pointer telemedicine_row">'+(data.rows[i].doc.update_ts ? data.rows[i].doc.update_ts.substring(0, 10) : data.rows[i].doc.insert_ts.substring(0, 10))+'</span></td><td class="text-align">'+data.rows[i].doc.Health_Category+'</td><td class="text-align">'+data.rows[i].doc.patient_dhp_id+'</td></tr>');
    }
    $("#telemedicine_inquiry_list tbody").html(telemedicine_inq.join(''));
    if($stateParams.doc_id) {
      $("#telemedicine_inquiry_list").find("span[doc_id='"+$stateParams.doc_id+"']").trigger("click");
      $.unblockUI();
    }
  }

  function closeTelemedicineInqueryDetails($obj) {
    $obj.closest(".telemedicine-inquiry-details").remove();
    $(".telemedicine_row").closest("tr").removeClass("warning");
  }

  function getTelemedicineInqueryDetails($obj) {
    var inquery_id = $obj.attr("doc_id");
    $.couch.db(db).openDoc(inquery_id, {
      success: function(data) {
        // $("#tir_patient_detials").html('');
        $("#tir_doctor_comment").val('');
        $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
          success: function(data2) {
            if(data2.rows.length > 0){
              var patient_details_html = [];
              patient_details_html.push('<tr class="telemedicine-inquiry-details"><td colspan="3">');
              patient_details_html.push('<table class="table">');
                patient_details_html.push('<tr>');
                patient_details_html.push('<td><span class="mrgright5 theme-color"><b>Patient Name :: </b></span><span>'+data2.rows[0].value.first_nm+ " " + data2.rows[0].value.last_nm +'</span></td>');
                patient_details_html.push('<td><span class="mrgright5 theme-color"><b>Patient DHP ID ::</b></span><span>'+data2.rows[0].value.patient_dhp_id+'</span></td>');
                patient_details_html.push('<td><span class="mrgright5 theme-color"><b>Email ::</b></span><span>'+data2.rows[0].value.user_email+'</span><label class="pointer pull-right label label-warning close-telemdicine-details">Close</label></td>');
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td colspan = "3"><span class="mrgright5 theme-green"><b>Symptoms :: </b></span><span>'+data.symptoms+'</span></td>');
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td colspan = "3"><span class="mrgright5 theme-green"><b>Subject :: </b></span><span>'+(data.subject ? data.subject: "NA")+'</span></td>');
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td colspan="3"><span class="mrgright5 theme-green"><b>Health Issue :: </b></span><span>'+(data.Health_Issue_Description ? data.Health_Issue_Description : "NA")+'</span></td>');
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td colspan = "2"><span class="mrgright5 theme-green"><b>Communication History :: </b></span>');
                    if (data.doctor_response) {
                      if (typeof(data.doctor_response) == "string") {
                        patient_details_html.push(data.doctor_response);
                      }
                      else {
                        if(data.doctor_response.length == 0){
                          patient_details_html.push('<div>NA</div>');
                        }else{
                          for (var i = 0; i < data.doctor_response.length; i++) {
                            patient_details_html.push('<div><b>'+(data.doctor_response[i] ?  data.doctor_response[i].time.substring(0, 10) : "NA")+'&nbsp;:&nbsp;</b>'+(data.doctor_response[i].response ? data.doctor_response[i].response : "NA")+'</div>');
                          };
                        }
                      }
                    }else{
                      patient_details_html.push('No response Found.'); 
                    }
                    patient_details_html.push('</td>');
                  patient_details_html.push('<td><span class="mrgright5 theme-green"><b>Document :: </b></span>');
                  if (data._attachments) {
                    patient_details_html.push('<a target="blank" href='+$.couch.urlPrefix +'/'+db+'/'+data._id+"/"+Object.keys(data._attachments)[0]+'><span class="label label-warning">Download</span></a>');
                  }else {
                    patient_details_html.push('NA');  
                  }
                  patient_details_html.push('</td>');                
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td><span class="mrgright5 theme-green"><b>Doctor Response :: </b></td><td colspan="2"></span><textarea class="telemedicine-txtarea" id="tir_doctor_comment"></textarea></td>');
                  
                patient_details_html.push('</tr>');

                patient_details_html.push('<tr>');
                  patient_details_html.push('<td class="text-center" colspan="3"><button type="button" class="btn btn-warning cplan_field_btn" index="'+inquery_id+'" id="tir_send">Send</button></td>');
                patient_details_html.push('</tr>');

              patient_details_html.push('</table>');
              patient_details_html.push('</td></tr>');
              $obj.closest("tbody").find("tr").removeClass("warning");
              $obj.closest("tr").addClass("warning");
              $(".telemedicine-inquiry-details").remove();
              $(patient_details_html.join('')).insertAfter($obj.closest("tr"));
              // var patient_details_html = '<div class="row"><div class="col-md-3"><b>First Name:</b></div><div class="col-md-3">'+data2.rows[0].value.first_nm+'</div><div class="col-md-3"><b>Last Name:</b></div><div class="col-md-3">'+data2.rows[0].value.last_nm+'</div></div><div class="row"><div class="col-md-3"><b>Patient DHP:</b></div><div class="col-md-3">'+data2.rows[0].value.patient_dhp_id+'</div></div><div class="row"><div class="col-md-3"><b>Email:</b></div><div class="col-md-6">'+data2.rows[0].value.user_email+'</div></div>';
              // $("#tir_patient_detials").html(patient_details_html);
            }else{
              newAlert("danger","No Patient Found.");
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key: data.user_id
        });

        // $("#telemedicine_inquiries_response").modal({
        //   show:true,
        //   backdrop:'static',
        //   keyboard:false
        // });
        // $("#tir_symptoms").html(data.Health_Category);
        // $("#tir_health_issue_description").html(data.Health_Issue_Description);
      },
      error: function(status) {
        console.log(status);
      }
    });
  }

  function saveTelemedicineResponse() {
    $("#tir_send").attr("disabled","disabled");
    $.couch.db(db).openDoc($("#tir_send").attr('index'),{
      success:function(data){
        // $.couch.db(replicated_db).view("tamsa/getDoctorPractiseCode", {
        //   success:function(doc_data) {
        //     if(doc.data.length > 0) {

        //     }else {
        //       console.log("something is wrong. nodoctor details found for practice id.");
        //     }
        //   },
        //   error:function(data,error,reason){
        //     newAlert("danger",reason);
        //     $("html, body").animate({scrollTop: 0}, 'slow');
        //     return false;
        //   },
        //   key:rte,
        //   include_docs:true
        // });
        if(!data.practice_id) {
          var practice_id = pd_data.random_code;
        }
        var receipt_id;

        if(data.receipt_id) receipt_id = data.receipt_id;
        var doctor_response = [];
        var response = {
          response: $("#tir_doctor_comment").val(),
          time: new Date()
        };

        var cron_record = {
          operation_case:  "24",
          processed:       "No",
          doctype:         "cronRecords"
        };
        doctor_response.push(response);
        data.doctor_response = doctor_response;
        $.couch.db(db).saveDoc(data,{
          success:function(data2){
            cron_record.doc_id = data2._id; 
            $.couch.db(db).saveDoc(cron_record, {
              success: function(data) {
                if(receipt_id){
                  $.couch.db(db).openDoc(receipt_id,{
                    success:function(billdata){
                      var newdata       = billdata;
                      newdata.dhp_code  = pd_data.dhp_code;
                      newdata.doctor_id = pd_data.doctor_id;

                      $.couch.db(db).saveDoc(newdata,{
                        success:function(data){
                          newAlert('success', 'Saved Successfully');
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          $("#tir_send").removeAttr("disabled");
                          $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
                        },
                        error:function(data,error,reason){
                          newAlert('danger', reason);
                          $('html, body').animate({scrollTop: 0}, 'slow');
                          $("#tir_send").removeAttr("disabled");
                          $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
                        }
                      });
                    },
                    error:function(data,error,reason){
                      newAlert('danger', reason);
                      $('html, body').animate({scrollTop: 0}, 'slow');
                      $("#tir_send").removeAttr("disabled");
                      $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
                    }
                  });
                }else{
                  newAlert('success', 'Saved Successfully');
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  $("#tir_send").removeAttr("disabled");
                  $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
                }
              },
              error: function(data,error,reason) {
                newAlert('danger', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                $("#tir_send").removeAttr("disabled");
                $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
              }
            });
          },
          error:function(data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#tir_send").removeAttr("disabled");
            $("#telemedicine_inquiry_list").find("tr.warning").find(".telemedicine_row").trigger("click");
          }
        });
      },
      error:function(data,error,reason){
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#tir_send").removeAttr("disabled");
      }
    });
  }

});
