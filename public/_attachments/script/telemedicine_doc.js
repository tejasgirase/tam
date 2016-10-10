$(document).ready(function(){
    if ($.cookie('TC_patient_id')) {
      $("#hidden_patient_id").val($.cookie('TC_patient_id'));
      $("#hidden_patient_email").val($.cookie('TC_patient_email'));
      $("#hidden_patient_dhp_id").val($.cookie('TC_patient_dhp_id'));
      $.removeCookie('TC_patient_id');
      $.removeCookie('TC_patient_email');
      $.removeCookie('TC_patient_dhp_id');
      $("#telemedicine_form").attr("action", payment_url);
    }else{
     window.location = "index.html";
    }
    $('#closest_symptom_model').on('hide.bs.modal', function (e) {
      $("#closet_symptom_dpval").val('');
      $("#subject_id").val('');
      $("#health_id").val('');
      $("#closet_symptom_dpval").empty();
    });
    $('#message_modal').on('show.bs.modal', function (e) {
        $(this).delay(6000).fadeOut("slow", function () { $(this).modal('hide');});
    });
    $('#message_modal').on('hide.bs.modal', function (e) {
       window.location = 'index.html'
    });

    $("#save_symptom").on("click", function(){
      selected_symptom = [];
      $(".telemedicine_greenbox_hover").each(function(i){
          selected_symptom.push($(this).attr("data-symval"));
      });
      $(".graybox_hover").each(function(i){
          selected_symptom.push($(this).attr("data-symval"));
      });
      $('#closest_symptom_model').modal({
            show:true,
            backdrop:'static',
            keyboard:false
          });
      for(var i = 0; i<selected_symptom.length; i++){
        $('<option value="'+selected_symptom[i]+'">'+selected_symptom[i]+'</option>').appendTo('#closet_symptom_dpval');
      }
    });
    
    Stripe.setPublishableKey('pk_test_mH5jugdml1Ji4fs6jRzsV7Cl');
    
    $('#telemedicine_form').submit(function(event) {
      event.preventDefault();      
      var file = $("#upload_symptoms_doc").prop('files');
      if(file[0]){
        if (Number(file[0].size) > 1073741824) {
          newAlertForModal('error', 'File can not be larger than 1GB', 'closest_symptom_model');
          return;
        }
        else if (file[0].type.substring(0,5) != "image" && file[0].type != "application/pdf" && file[0].type != "application/vnd.ms-powerpoint" && file[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && file[0].type != "application/vnd.openxmlformats-officedocument.presentationml.presentation" && file[0].type != "text/plain") {
          newAlertForModal('error', 'Invalid file format for the selected document type.', 'closest_symptom_model');
          return;
        }  
      }       

      var $form = $(this);
      $("#userid").val($("#hidden_patient_id").val());
      // Disable the submit button to prevent repeated clicks
      $form.find('button').prop('disabled', true);
      var tokan = Stripe.card.createToken($form, stripeResponseHandler);
    });

  $("#closest_symptom_model").on("click", "#telemedicine_nxt", function(){
    if (validateHealthIssue()) {
      $("#telemedicine_multiple").hide();
      $("#telemedicine_payment").show();
      $("#telemedicine_modal_title").html("Complete Your Telemedicine query.");  
    }else{
      return false;
    }
  });

  $("#closest_symptom_model").on("click", "#telemedicine_back", function(){
    $("#telemedicine_multiple").show();
    $("#telemedicine_payment").hide();
    $("#telemedicine_modal_title").html("If multiple symptoms, select the one that matches closest.");
  });

});

function stripeResponseHandler(status, response) {
  var $form = $('#telemedicine_form');
  if (response.error) {
    // Show the errors on the form
    newAlertForModal('error', response.error.message,"closest_symptom_model");
    $('#closest_symptom_model').animate({scrollTop: 0}, 'slow');
    $form.find('button').prop('disabled', false);
    return false;
  } else {
    // response contains id and card, which contains additional card details
    console.log(response.id);

    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit

    $form.find('button').prop('disabled', false);

    var postData = $form.serializeArray();
    var formURL = $form.attr("action");
    var tmp_selected_symptom = [];
    
    $(".telemedicine_greenbox_hover").each(function(i){
        tmp_selected_symptom.push($(this).attr("data-symval"));
    });
    $(".graybox_hover").each(function(i){
        tmp_selected_symptom.push($(this).attr("data-symval"));
    });

    var d = new Date();
    var save_symptoms_list = {
      doctype:                  "inquiry",
      user_id:                  $("#hidden_patient_id").val(),
      patient_dhp_id:           $("#hidden_patient_dhp_id").val(),
      user_email:               $("#hidden_patient_email").val(),
      symptoms:                 tmp_selected_symptom,
      subject:                  $("#subject_id").val(),
      Health_Category:          $("#closet_symptom_dpval").val(),
      Health_Issue_Description: $("#health_id").val(),
      Response:                 "Awaiting Response",
      update_ts:          d
    };
    
    var telemedicine_cron_list_doc = {
      doctype:                  'cronRecords',
      operation_case:           '7',
      processed:                'No',
      user_id:                  $("#hidden_patient_id").val(),
      patient_dhp_id:            $("#hidden_patient_dhp_id").val(),
      user_email:               $("#hidden_patient_email").val(),
      symptoms:                 tmp_selected_symptom,
      subject:                  $("#subject_id").val(),
      Health_Category:          $("#closet_symptom_dpval").val(),
      Health_Issue_Description: $("#health_id").val(),
      Response:                 "Awaiting Response",
      update_ts:                d
    }

    var telemedicine_receipt = {
      doctype:       'telemedicine_receipt',
      insert_ts:     d,
      user_id:       $("#hidden_patient_id").val(),
      email_sent_on: $("#hidden_patient_email").val(),
      dhp_code:      'H-0000000000',
      finalize:      "Yes",
      doctor_name:   "Sensory Health Systems Inc",
      bill_history:  [{
         billing_appointment_date: (d.getFullYear()+"-"+(new Number(d.getMonth())+1)+"-"+d.getDate()),
         bill_additional_notes: $("#health_id").val(),
         total_bill_amount: "750",
         total_bill_discount: "0",
         total_bill_topay: "750",
         total_cash_paid: "0",
         total_online_paid: "750",
         total_balance_due: "0",
         insurance_balance_due: "0",
         subjective_billrecords: [],
         assessment_billrecords: [{
                   date: (d.getFullYear()+"-"+(new Number(d.getMonth())+1)+"-"+d.getDate()),
                   assessment: "00000",
                   amount: "750",
                   discount: "0"
               }]
       }]
    }

    $.couch.db(db).view("tamsa/getSubscriberFromUserId",{
      success:function(data){
        var tmp_subscriber = [];
        for(i=0;i<data.rows.length;i++){
          tmp_subscriber.push({
            doctor_name: data.rows[i].key[1],
            dhp_code:    data.rows[i].key[2]
          });
        }
        save_symptoms_list.Patient_subscribed_doctors_dhp         = tmp_subscriber;
        telemedicine_cron_list_doc.Patient_subscribed_doctors_dhp = tmp_subscriber;
        $.ajax(
        {
          url : formURL,
          type: "POST",
          data : postData,
          success:function(data, textStatus, jqXHR) {
            if(data == 'TRUE') {
              var file = $("#upload_symptoms_doc").prop('files');
              $("#closest_symptom_model").modal("hide");
              
              $.couch.db(db).saveDoc(telemedicine_cron_list_doc,{
                success: function (data){
                  $.couch.db(db).saveDoc(telemedicine_receipt,{
                    success: function (data){
                      save_symptoms_list.receipt_id = data.id;
                      $.couch.db(db).saveDoc(save_symptoms_list, {
                        success: function(data) {
                          if(file[0]) {
                            $('#tele_id').val(data.id);
                            $('#tele_rev').val(data.rev);
                            $('#telemedicine_form').ajaxSubmit({
                              // Submit the form with the attachment
                              url: "/"+ db +"/"+ data.id,
                              success: function(response) {
                                clearTelemedicneForm();
                                $("#closest_symptom_model").modal('hide');
                                $('#message_modal').modal({
                                  show:true,
                                  backdrop:'static',
                                  keyboard:false
                                });
                              },
                              error: function(data, error, reason) {
                                newAlertForModal('error', reason, 'closest_symptom_model');
                              }
                            });
                          }
                          else {
                            clearTelemedicneForm();
                            $("#closest_symptom_model").modal('hide');
                            $('#message_modal').modal({
                              show:true,
                              backdrop:'static',
                              keyboard:false
                            });
                          }
                        },
                        error: function(status) {
                          console.log(status);
                        }
                      });
                    },
                    error : function (status) {
                      console.log(status);
                    }
                  });
                },
                error: function (status){
                  console.log(status);
                }
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
          }
        });
      },
      error:function(data,error,reason){
        console.log(reason);        
      },
      startkey: [$("#hidden_patient_id").val()],
      endkey:   [$("#hidden_patient_id").val(),{},{}],
      reduce:   true,
      group:    true
    });
  }
};