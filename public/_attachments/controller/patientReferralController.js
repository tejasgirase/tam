var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("patientReferralController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activatePatientReferralTab);

  function activatePatientReferralTab(){
    $(".menu_items").removeClass("active");
    $("#prepare_referral_link").parent().addClass('active');
    clearSendReferral();
    doctorAutocompleterForPrepareRefferal();
    getChartNotesToAttach();
    eventBindingsForPrepareReferral();
    if(pd_data.level == "Doctor"){
      $("#referral_sincerly").val("Dr."+pd_data.first_name+" "+pd_data.last_name  );
    }
  }

  function eventBindingsForPrepareReferral(){
    $("#prepare_referral").on("click","#referral_send",function(){
      sendReferral(false);
    });

    $("#prepare_referral").on("click","#referral_send_print",function(){
      sendReferral(true);
    });
  }

  function clearSendReferral() {
    $("#referral_doctor").val("");
    $("#referral_doctor_id").val("");
    $("#referral_introduction").val("");
    $("#referral_conclusion").val("");
    $("#referral_sincerly").val("");
    $("#referral_chart_notes").val("");
    $("#clinical_summary").attr("checked", false);
    $("#referral_by_fax").attr("checked", false);
  }

  function doctorAutocompleterForPrepareRefferal(){
    $("#referral_doctor").autocomplete({
      search: function(event, ui) { 
         //$('.spinner').show();
         $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(replicated_db).view("tamsa/getDoctorsList", {
          success: function(data) {
            $("#referral_doctor").removeClass('myloader');
            var newdata = [];
            for(var i = 0;i<data.rows.length;i++){
              if(data.rows[i].id != pd_data._id){
                newdata.push(data.rows[i]);
              }
            }
            response(newdata);
          },
          error: function(status) {
            console.log(status);
          },
          startkey: [pd_data.dhp_code, request.term],
          endkey: [pd_data.dhp_code, request.term + "\u9999"]
        });
      },
      minLength: 1,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        if( ui.item.key[1] == "No results found"){
          $( this ).val("").focus();
        }else{
          $( this ).val(ui.item.key[1]);
          $("#referral_doctor_id").val(ui.item.value);  
        }
        
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

  function getChartNotesToAttach(){
    $.couch.db(db).view("tamsa/getDoctorChartNotes", {
      success: function(data) {
        var chart_notes = '';
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            chart_notes += '<option value="'+data.rows[i].value+'">'+data.rows[i].key[2]+' -- '+data.rows[i].key[3]+'</option>';
          };
          $("#referral_chart_notes").html(chart_notes);
          $("#medication_chart_notes").html(chart_notes);
        }
        else {
          chart_notes += '<option>No Chart Note</option>';
          $("#referral_chart_notes").html(chart_notes);
          $("#medication_chart_notes").html(chart_notes);
        }
      },
      error: function(status) {
          console.log(status);
      },
      startkey: [pd_data._id, userinfo.user_id],
      endkey: [pd_data._id, userinfo.user_id, {}]
    });
  }

  function sendReferral(print) {
    if(validatePatientReferral()){
      $("#referral_send_print, #referral_send").attr("disabled","disabled");
      if($("#referral_doctor_id").val() == pd_data._id) {
        newAlert('danger', "You can not Prepare Referral to yourslef.");
        $("#referral_doctor").val("");
        $("#referral_doctor_id").val("");
        $('html, body').animate({scrollTop: 0}, 'slow');
        $("#referral_send_print, #referral_send").removeAttr("disabled");
      }else {
        $.couch.db(db).view("tamsa/getDoctorReferral", {
          success: function(data) {
            if(data.rows.length > 0) {
              newAlert('danger', "You have already sent referral for this patient.");
              $('html, body').animate({scrollTop: 0}, 'slow');
              $("#referral_send_print, #referral_send").removeAttr("disabled");
            }else {
              var d            = new Date();
              var referral_doc = {
                insert_ts:       d,
                doctype:                "Referral",
                user_id:                userinfo.user_id,
                read_receipt:           "N",
                sender_doctor_id:       pd_data._id,
                sender_doctor:          pd_data.first_name+" "+pd_data.last_name,
                doctor:                 $("#referral_doctor").val(),
                doctor_id:              $("#referral_doctor_id").val(),
                referral_introduction:  $("#referral_introduction").val(),
                referral_conclusion:    $("#referral_conclusion").val(),
                referral_sincerly:      $("#referral_sincerly").val(),
                referral_chart_notes:   $("#referral_chart_notes option:selected").text(),
                referral_chart_note_id: $("#referral_chart_notes").val(),
                clinical_summary:       $("#clinical_summary").is(':checked'),
                referral_by_fax:        $("#referral_by_fax").is(':checked'),
                User_firstname:         userinfo.first_nm,
                User_lastname:          userinfo.last_nm,
                patient_dhp_id:         userinfo.patient_dhp_id
              };

              var cron_referral_doc = {
                operation_case:        "5",
                processed:             "No",
                doctype:               "cronRecords"
              };  

              $.couch.db(db).saveDoc(referral_doc, {
                success: function(data) {
                  newAlert('success', 'Referral Updated successfully !');
                  cron_referral_doc.referral_doc_id = data.id;
                  clearSendReferral();
                  $("#my_account_tab_link").trigger("click");

                  $.couch.db(db).saveDoc(cron_referral_doc, {
                    success: function(data) {
                    },
                    error: function(data, error, reason) {
                    }
                  })

                  if (print) {
                    var print_table = '<table style="border:1px solid grey"><thead><th colspan="2" style="border:1px solid grey">Prepare Referral</th></thead><tbody><tr><td style="border:1px solid grey">Refer to:</td><td style="border:1px solid grey">'+referral_doc.doctor+'</td></tr><tr><td style="border:1px solid grey">Introduction:</td><td style="border:1px solid grey">'+referral_doc.referral_introduction+'</td></tr><tr><td style="border:1px solid grey">Conclusion:</td><td style="border:1px solid grey">'+referral_doc.referral_conclusion+'</td></tr><tr><td style="border:1px solid grey">Sincerly:</td><td style="border:1px solid grey">'+referral_doc.referral_sincerly+'</td></tr><tr><td style="border:1px solid grey">Chart Notes:</td><td style="border:1px solid grey">'+referral_doc.referral_chart_notes+'</td></tr><tr><td style="border:1px solid grey">Clinical summary:</td><td style="border:1px solid grey">'+referral_doc.clinical_summary+'</td></tr><tr><td style="border:1px solid grey">Also send referral by fax:</td><td style="border:1px solid grey">'+referral_doc.referral_by_fax+'</td></tr></tbody></table>';
                      printNewHtml(print_table);
                  }
                  $("#referral_send_print, #referral_send").removeAttr("disabled");
                },
                error: function(data, error, reason) {
                  newAlert('danger', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                  $("#referral_send_print, #referral_send").removeAttr("disabled");
                }
              })
            }
          },
          error: function(data, error, reason) {
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#referral_send_print, #referral_send").removeAttr("disabled");
          },
          key:    ["N", $("#referral_doctor_id").val(), pd_data._id, userinfo.user_id],
          reduce: true,
          group:  true
        });
      }
    }
  }
  
});