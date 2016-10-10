function calculateBillAmount() {
  var total_amount   = 0;
  var total_discount = 0;
  $("tr.new-added-subjective-bill").each(function() {
    $this          = $(this);
    var amount     = $this.find(".sbr_charges").val();
    total_amount   = Number(total_amount) + Number(amount);
    // var discount   = $this.find(".billrecord_discount").val();
    // if(Number(amount) < Number(discount)){
    //   $this.find(".billrecord_discount").val("").focus();
    //   newAlert("danger", "Discount can not be more than Fee.");
    //   $('html, body').animate({scrollTop: $("#assessment_billrecords").offset().top - 100}, 1000);
    //   return false;
    // }
    // var total      = Number(amount) - Number(discount);
    // total_discount = Number(total_discount) + Number(discount);
    // $this.find(".billrecord_total").val(total);
  });
  $("#total_bill_amount, #total_bill_topay, #total_balance_due").val(total_amount);
  // $("#total_bill_discount").val(total_discount);
  // $("#total_bill_topay").val(Number(total_amount) - Number(total_discount));
  // calculateBillAfterAdvancePay();
}

function calculateTotalBillAmountAfterDiscount(){
  var total    = Number($("#total_bill_amount").val());
  var discount = Number($("#total_bill_discount").val());

  var grand_total = total - discount;
  if(total < discount){
    $("#total_bill_discount").val("").focus();
    newAlert("danger", "Discount can not be more than Fee.");
    $('html, body').animate({scrollTop: $("#total_bill_discount").offset().top - 100}, 1000);
    return false;
  }
  else{
    $("#total_bill_topay, #total_balance_due").val(grand_total);
    calculateBillAfterAdvancePay();
    return true;
  }
}

function calculateBillAfterAdvancePay(){
  var balance_due = Number($("#total_bill_topay").val()) - Number($("#advance_paid").val());
  if(balance_due >= 0){
    $("#total_balance_due").val(balance_due);
    $("#patient_credit").val(0);
  }else{
    $("#patient_credit").val(Math.abs(balance_due));
    $("#total_balance_due").val(0);
  }
}

function createSaveRequestForPatientBill(action) {
  $("#savebill, #savebill_print").attr("disabled","disabled");
  if(billingInfoValidation(action)){
    if(pd_data.level == "Doctor"){
      var doctor_id = pd_data._id;
      var dhp_code = pd_data.dhp_code;
      var doctor_name = pd_data.first_name +" "+pd_data.last_name;
    }else{
      var doctor_id   = $("#bill_doctor_name_new").data("doctor_id");
      var dhp_code    = $("#bill_doctor_name_new").data("dhp_code");
      var doctor_name = $("#bill_doctor_name_new").val();
    }
    if($("#savebill_print, #bill_reprint").data("userid") && 
      $("#savebill_print, #bill_reprint").data("useremail")){
      var userid = $("#savebill_print, #bill_reprint").data("userid");
      var email  = $("#savebill_print, #bill_reprint").data("useremail");
    }
    var d  = new Date();
    var bill_doc = {
      insert_ts:     d,
      user_id:       userid,
      doctor_id:     doctor_id,
      doctype:       "patient_bill",
      dhp_code:      dhp_code,
      doctor_name:   doctor_name,
      due_date:      $("#billing_due_date").val(),
      email_sent_on: email,
      finalize:      $("#billing_appointment_finalize").val(),
      bill_history:  [{
        bill_additional_notes:        $("#bill_additional_notes").val(),
        total_bill_amount:            $("#total_bill_amount").val(),
        total_bill_discount:          $("#total_bill_discount").val(),
        total_bill_topay:             $("#total_bill_topay").val(),
        total_cash_paid:              $("#total_cash_paid").val(),
        total_online_paid:            $("#total_online_paid").val(),
        total_balance_due:            $("#total_balance_due").val(),
        insurance_balance_due:        $("#insurance_balance_due").val(),
        advance_paid:                 $("#advance_paid").val(),
        patient_credit:               $("#patient_credit").val(),
        diagnosis_procedures_details: [],
      }]
    }
    $("tr.cmn-subjective-bill").each(function() {
      $this      = $(this);
      var record = {
        date:                     $this.find(".sbr_date").val(),
        diagnosis_procedure_type: $this.find(".sbr_type").text(),
        diagnosis_code:           getDiagnosesProcedureCodeValue($this),
        billing_code:             $this.find(".sbr_billing_code").val(),
        description:              $this.find(".sbr_description").val(),
        charges:                  $this.find(".sbr_charges").val()
      }
      bill_doc.bill_history[0].diagnosis_procedures_details.push(record);
    });
    if ($("#savebill").data("index") && $("#savebill").data("rev")) {
      bill_doc._id  = $("#savebill").data("index");
      bill_doc._rev = $("#savebill").data("rev");
      
      if($("#billing_appointment_finalize").val() == "Yes") {
        if ($("#billing_appointment_finalize").attr("disabled")) {
          saveFinalizeBill(bill_doc);
          return;
        }
        if($("#savebill").data("invoice_no") == "NA"){
          savePatientBillNewInvoice(action,bill_doc);
        }else{
          bill_doc.invoice_no = $("#savebill").data("invoice_no");
          savePatientBill(action,bill_doc,userid);
        }
      }else{
        bill_doc.invoice_no = "NA";
        savePatientBill(action,bill_doc,userid);
      }
    }else{
      if($("#billing_appointment_finalize").val() == "Yes") {
        savePatientBillNewInvoice(action,bill_doc,userid);
      }else{
         bill_doc.invoice_no = "NA";
        savePatientBill(action,bill_doc,userid);
      }
    }
  }else{
    $("#savebill, #savebill_print").removeAttr("disabled");
    return false;
  }
}

function savePatientBillNewInvoice(action,bill_doc,userid){
  $.couch.db(db).view("tamsa/getNewInvoiceNumber",{
    success:function(idata){
      if (idata.rows[0])
        bill_doc.invoice_no = Number(idata.rows[0].doc.invoice_no) + 1;
      else {
        bill_doc.invoice_no = 1;
      }
      savePatientBill(action,bill_doc,userid);
    },
    error:function(data,erro,reason){
      $("#savebill, #savebill_print").removeAttr("disabled");
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey:[pd_data.dhp_code,{}],
    endkey:[pd_data.dhp_code],
    descending:true,
    include_docs:true,
    limit:1,
  });
}

function savePatientBill(action,bill_doc,userid){
  if($("#savebill_print").data("invoice_setting") != "NA"){
    if(action == "savebill"){
      $.couch.db(db).saveDoc(bill_doc, {
        success: function(data) {
          if ($("#billing_appointment_finalize").val() == "Yes") {
            var cron_record = {
              bill_id:        data.id,
              doctype:        "cronRecords",
              operation_case: 17,
              processed:      "No",
              update_ts:      new Date(),
              user_id:        userid,
              total_bill_topay: $("#total_bill_topay").val()
            }
            $.couch.db(db).saveDoc(cron_record, {
              success: function(data) {
                $('html, body').animate({scrollTop: 0}, 'slow');
                newAlert('success', 'Saved successfully !');
                clearBillForm();
                if(userinfo.length > 0){
                  $("#back_to_billing_list").trigger("click");  
                }else{
                  $("#back_to_bill_summary_list").trigger("click");  
                }
                getBillList();
                $("#savebill, #savebill_print").removeAttr("disabled");
              },
              error: function(data,error,reason) {
                $("#savebill, #savebill_print").removeAttr("disabled");
                newAlert('danger', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          }
          else {
            if(userinfo.length > 0){
              $("#back_to_billing_list").trigger("click");  
            }else{
              $("#back_to_bill_summary_list").trigger("click");  
            }
            
            $('html, body').animate({scrollTop: 0}, 'slow');
            newAlert('success', 'Saved successfully !');
            
            clearBillForm();
            getBillList();
            $("#savebill, #savebill_print").removeAttr("disabled");
          }
        },
        error: function(data,error,reason) {
          $("#savebill, #savebill_print").removeAttr("disabled");
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    }else{
      $.couch.db(db).saveDoc(bill_doc, {
        success: function(data) {
          $('html, body').animate({scrollTop: 0}, 'slow');
          newAlert('success', 'Saved successfully !');
          if ($("#billing_appointment_finalize").val() == "Yes") {
            printPatientBill(data.id);
          }
          if(userinfo.length > 0){
            $("#back_to_billing_list").trigger("click");  
          }else{
            $("#back_to_bill_summary_list").trigger("click");  
          }
          getBillList();
          $("#savebill, #savebill_print").removeAttr("disabled");
          clearBillForm();
        },
        error: function(data,error,reason) {
          $("#savebill, #savebill_print").removeAttr("disabled");
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    }
  }else{
    newAlert("danger", "Please Set Invoice Setting First.");
    $("#savebill, #savebill_print").removeAttr("disabled");
    $('html, body').animate({scrollTop: 0}, 1000);
    return false;
  }
}

function checkInvoiceSetting(){
  $.couch.db(db).view("tamsa/getPrintSetting",{
    success:function(data){
      if(data.rows.length == 1){
        $("#bill_hospital_addr").html(data.rows[0].doc.hospital_address);
        $("#savebill_print, #bill_reprint").data("invoice_setting",data.rows[0].doc._id);
      }else{
        $("#savebill_print, #bill_reprint").data("invoice_setting","NA");
      }
      $("#bill_hospital_name").html(pd_data.hospital_affiliated);
      $("#bill_doctor_name").html(pd_data.first_name+" "+pd_data.last_name);
      $("#bill_doctor_email").html(pd_data.email);
      $("#bill_dhp_code").html(pd_data.dhp_code+" / "+ pd_data.random_code);
      $("#bill_doctor_phone").html(pd_data.phone);

      $("#bill_patient_name").html(userinfo.first_nm+" "+ userinfo.last_nm);
      if(userinfo.address1 && userinfo.address1 != "") $("#bill_patient_addr").html(userinfo.address1)
      else $("#bill_patient_addr").html("NA")
      if(userinfo.date_of_birth) {
        $("#bill_patient_dob_lbl").html("Date Of Birth");
        $("#bill_patient_dob").html(userinfo.date_of_birth);
      }else {
        $("#bill_patient_dob_lbl").html("Age");
        $("#bill_patient_dob").html(userinfo.age ? userinfo.age : "NA");
      }
      $("#patient_bill_dhp").html(userinfo.patient_dhp_id);
      $("#bill_patient_phone").html(userinfo.phone);
      $("#bill_patient_email").html(userinfo.user_email);
      $("#savebill_print, #bill_reprint").data("userid",userinfo.user_id);
      $("#savebill_print, #bill_reprint").data("useremail",userinfo.user_email);
    },
    error:function(edata,error,reason){
      newAlert("danger", reason);
      $('html, body').animate({scrollTop: 0}, 1000);
      return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });
}

function getDiagnosesProcedureCodeValue($obj){
  if($obj.find(".sbr_subjective_code").val() == "None"){
    return $obj.find(".sbr_code_val").val();
  }else if($obj.find(".sbr_subjective_code").val() == "SoapNote"){
    return "";
  }else{
    return $obj.find(".sbr_subjective_code").val();
  }
}

function printPatientBill(docid){
  $.couch.db(db).openDoc(docid,{
    success:function(data){
      var last_rec = data.bill_history.length;
      $.couch.db(db).view("tamsa/getPrintSetting",{
        success:function(hdata){
          if(hdata.rows.length > 0){
            $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
              success:function(pdata){
                var print_bill_data = [];
                print_bill_data.push('<style type=text/css>.invoice_phone{border-right: 1px solid rgb(210, 210, 210);float: left;    height: 89px;margin-left:6px;margin-top: 7px;padding-right: 12px;} .webaddress{height: 89px; float: left; margin-left: 6px; margin-top: 9px; width: 160px;} .invoice-details b{color: rgb(119, 119, 119); font-size: 15px;} .invoice-details .title{font-size: 19px; font-weight: bold; color: rgb(119, 119, 119); margin-right: 19px;} .invoice-details .invoicetab{background: rgb(242, 187, 92) none repeat scroll 0% 0%; border-radius: 10px 10px 0px 0px; color: rgb(255, 255, 255); text-align: left; float: left; padding: 16px; margin-right: 5px;width:144px;border:1px solid #333;} .invoice-table th{background: none !important;color: #67a22d;text-transform: uppercase;} .invoice-table span{background: rgb(103, 162, 45) none repeat scroll 0% 0%; border-radius: 106px; padding: 6px 11px; color: rgb(255, 255, 255);} table.invoice-display-table tr:nth-child(odd){background:#CCCCCC;} table.invoice-display-table th{background:#fff !important;} .table.patitentAddress tr td{padding-top: 3px;}.invoicetotal td{padding-left: 58px;} .invoice-header td{padding-bottom:3px !important;;padding-top:3px !important;}</style><div class="row" id="" style="padding-top: 0px;">');
                  print_bill_data.push('<div class="col-lg-12" style="border-bottom: 1px solid grey;" id="preview_header_parent">');
                    print_bill_data.push('<table class="table common-preview-invoice-details">');
                      print_bill_data.push('<tbody>');
                        print_bill_data.push('<tr>');
                          if(hdata.rows[0].doc.is_display_logo){
                            print_bill_data.push('<td style="padding:0px;width:29%;"><img src="'+hdata.rows[0].doc.invoice_image+'" alt="Company Logo" title="Company Logo" width="75%"></td>');  
                          }
                          print_bill_data.push('<td style="padding-bottom:0px;">');
                            print_bill_data.push('<table style="float: left; width: 43%; border-right: 1px solid rgb(210, 210, 210); height: 97px;" class="table common-preview-invoice-details invoice-header">');
                              print_bill_data.push('<tbody>');
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span class="glyphicon glyphicon-map-marker" style="color:#F2BB5C;margin-right:3px;"></span>'+pd_data.hospital_affiliated+'</td></tr>');
                                print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_address+'</td></tr>');
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_secondary_address+', '+hdata.rows[0].doc.hospital_city+'</td></tr>');
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:23px;">'+hdata.rows[0].doc.hospital_state+', '+hdata.rows[0].doc.hospital_postal_zip_code+' India</td></tr>');
                                print_bill_data.push('</tbody>');
                                print_bill_data.push('</table><div class="invoice_phone"><span class="glyphicon glyphicon-earphone" style="color:#f2bb5c;margin-right:5px;"></span>'+pd_data.hospital_phone+'</div><div class="webaddress"><span style="float: left; width: 100%; margin-bottom: 20px;"><span style="color: rgb(242, 187, 92);margin-right:5px;" class="glyphicon glyphicon-globe"></span>info@babybeeps.com</span><span style="margin-left: 18px;">www.babybeeps.com</span></div>');
                          print_bill_data.push('</td>');
                        print_bill_data.push('</tr>');
                      print_bill_data.push('</tbody>');
                    print_bill_data.push('</table>');
                  print_bill_data.push('</div>');
                  print_bill_data.push('<div class="col-lg-12">');
                    print_bill_data.push('<table class="table preview-invoice-patient-details common-preview-invoice-details">');
                      print_bill_data.push('<tbody>');
                        print_bill_data.push('<tr>');
                          print_bill_data.push('<td style="line-height: 0.45 !important;width:40%;">');
                            print_bill_data.push('<table class="table common-preview-invoice-details patitentAddress">');
                              print_bill_data.push('<tbody>');
                               
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important"><b style="text-transform:uppercase;color:rgb(119, 119, 119)">Bill To:</b></td></tr>');
                                print_bill_data.push('<tr><td style="line-height: 0.45 ! important; padding-left: 25px;font-weight: bold;">'+pdata.rows[0].value.first_nm+' '+pdata.rows[0].value.last_nm+' ('+pdata.rows[0].value.patient_dhp_id+')</td></tr>');
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span style="color:#F2BB5C;margin-right:4px;" class="glyphicon glyphicon-map-marker"></span>'+((pdata.rows[0].value.address1) ? pdata.rows[0].value.address1 : "NA")+'</td></tr>');
                                if(pdata.rows[0].value.address2){
                                  print_bill_data.push('<tr><td style="line-height:0.45 !important;padding-left:25px;">'+pdata.rows[0].value.address2+'</td></tr>');
                                }                              
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important;padding-left:25px;">'+(pdata.rows[0].value.city ? pdata.rows[0].value.city : "NA")+', '+(pdata.rows[0].value.state ? pdata.rows[0].value.state : "NA")+(pdata.rows[0].value.pincode ? (', '+ pdata.rows[0].value.pincode) : "")+'</td></tr>');
                                if(pdata.rows[0].value.phone){
                                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-earphone"></span>'+pdata.rows[0].value.phone+'</td></tr>');
                                }
                                if(pdata.rows[0].value.emailid){
                                  print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span style="color:#f2bb5c;margin-right:5px;" class="glyphicon glyphicon-envelope"></span>'+pdata.rows[0].value.emailid+'</td></tr>');
                                }
                                print_bill_data.push('<tr><td style="line-height: 0.45 !important"><span><span style="color: rgb(242, 187, 92);margin-right:5px;" class="glyphicon glyphicon-globe"></span>www.babybeeps.com</span></td></tr>');
                              print_bill_data.push('</tbody>');
                            print_bill_data.push('</table>');
                          print_bill_data.push('</td>');
                          print_bill_data.push('<td style="line-height: 0.45 !important">');
                            print_bill_data.push('<table class="table common-preview-invoice-details invoice-details" style="text-align:right;">');
                              print_bill_data.push('<tbody>');
                                print_bill_data.push('<tr><td style="width:100%;"><span class="title">INVOICE</span></span><span><b>DHP Code : </b><span style="color: rgb(51, 51, 51); font-weight: bold;">'+hdata.rows[0].doc.dhp_code+'</span><span class="preview-invoice-no" style="background:#fff;"><b>INVOICE NO : </b><span style="color:#333;">#'+data.invoice_no+'</span></span></td></tr>');

                                print_bill_data.push('<td style="line-height: 0.45 ! important; padding-right: 0px;"><div class="invoicetab" style=""><b style="color: rgb(255, 255, 255);">Total Due</b><br><br><br><span style="margin-left: 57px;">'+data.bill_history[0].total_balance_due+'</span></div><div style="background:#67a22d;" class="invoicetab"><b style="color: rgb(255, 255, 255);">Invoice Date</b><br><br><br><span style="margin-left:50px;">'+data.insert_ts.substring(0,10)+'</span></div><div style="background:#67a22d;" class="invoicetab"><b style="color: rgb(255, 255, 255);">Due Date</b><br><br><br><span style="margin-left:50px;">'+data.due_date+'</span></div></td>');
                              print_bill_data.push('</tbody>');
                            print_bill_data.push('</table>');
                          print_bill_data.push('</td>');
                        print_bill_data.push('</tr>');
                      print_bill_data.push('</tbody>');
                    print_bill_data.push('</table>');
                  print_bill_data.push('</div>');
                  print_bill_data.push('<div class="row">');
                    print_bill_data.push('<div style="padding-left:45px;padding-right:15px;width:810px;">');
                      print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="700px" style="padding: 0px; margin: 0px auto;">');
                        print_bill_data.push('<tbody>');
                          print_bill_data.push('<tr>');
                            print_bill_data.push('<td style="line-height: 0.45 !important">');
                              print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="790" style="margin: 4px auto;">');
                                print_bill_data.push('<tbody>');
                                  print_bill_data.push('<tr>');
                                    print_bill_data.push('<td style="line-height: 0.45 !important">');
                                      print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="765" style="margin-top: 5px;" class="mrg-top invoice-table">');
                                        print_bill_data.push('<tbody>');
                                          print_bill_data.push('<tr>');
                                            print_bill_data.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold;">');
                                              print_bill_data.push('<table class="table invoice-display-table">');
                                                print_bill_data.push('<thead>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<th>Sr. No</th><th>Date Of Service</th><th>Description</th><th>Diagnosis Code</th><th>Billing Code</th><th>Total</th>');
                                                  print_bill_data.push('</tr>');
                                                print_bill_data.push('</thead>');
                                                print_bill_data.push('<tbody>');

                                                for(var i=0;i<data.bill_history[0].diagnosis_procedures_details.length;i++){
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td><span>'+(i+1)+'</span></td>');
                                                    print_bill_data.push('<td>'+data.bill_history[0].diagnosis_procedures_details[i].date+'</td>');
                                                    print_bill_data.push('<td>'+data.bill_history[0].diagnosis_procedures_details[i].diagnosis_code);
                                                    if(data.bill_history[0].diagnosis_procedures_details[i].diagnosis_procedure_type){
                                                      print_bill_data.push('<br><b>('+data.bill_history[0].diagnosis_procedures_details[i].diagnosis_procedure_type+')</b>');  
                                                    }
                                                    print_bill_data.push('</td>');
                                                    print_bill_data.push('<td>'+data.bill_history[0].diagnosis_procedures_details[i].billing_code+'</td>');
                                                    print_bill_data.push('<td>'+data.bill_history[0].diagnosis_procedures_details[i].description+'</td>');
                                                    print_bill_data.push('<td>'+data.bill_history[0].diagnosis_procedures_details[i].charges+'</td>');
                                                  print_bill_data.push('</tr>');
                                                }
                                                print_bill_data.push('</tbody>');
                                              print_bill_data.push('</table>');
                                            print_bill_data.push('</td>');
                                          print_bill_data.push('</tr>');
                                          print_bill_data.push('<tr>');
                                          print_bill_data.push('<td valign="top" align="left" style="font-size: 14px; color: rgb(0, 0, 0); font-family: arial; font-weight: bold; padding-top: 17px; float: left; width: 54%;">');
                                              //if(data.bill_history[0].bill_additional_notes){
                                                print_bill_data.push('<h5 style="text-transform:uppercase;">Additional Notes:</h5><textarea style="height: 60px; background: rgb(239, 239, 239) none repeat scroll 0% 0%; float: left; width: 365px; font-weight: normal; font-size: 13px; padding: 5px; border: 1px solid rgb(51, 51, 51);">'+data.bill_history[0].bill_additional_notes+'</textarea>');
                                              //}
                                             
                                                print_bill_data.push('<div style="float:left;width:100%;"><h5 style="text-transform:uppercase;">Standard Memo:<h5><textarea style="height: 60px; background: rgb(239, 239, 239) none repeat scroll 0% 0%; float: left; width: 365px; font-weight: normal; font-size: 13px; padding: 5px; border: 1px solid rgb(51, 51, 51);">');
                                                if(data.bill_history[0].standard_memo){
                                                  print_bill_data.push(data.bill_history[0].standard_memo);
                                                }
                                                print_bill_data.push('</textarea></div>');

                                            print_bill_data.push('</td>');
                                            print_bill_data.push('<td style="padding: 30px 0px; float: left; width: 46%;">');
                                              print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="100%" class="invoicetotal">');
                                                print_bill_data.push('<tbody>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Total Charges:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].total_bill_amount+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Total Discounts:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].total_bill_discount+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Total:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].total_bill_topay+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Advance Paid:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].advance_paid+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Patient Credit:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].patient_credit+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;"><strong>Total Paid Via Cash</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].total_cash_paid+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr style="background: rgb(103, 162, 45) none repeat scroll 0% 0%; border:1px solid #333;">');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size: 13px; font-family: arial; padding: 7px; color: rgb(255, 255, 255);"><strong>Total Balance Due:</strong></td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size: 13px; font-family: arial;color:rgb(255, 255, 255);font-weight:bold;">'+data.bill_history[0].total_balance_due+'</td>');
                                                  print_bill_data.push('</tr>');
                                                  print_bill_data.push('<tr>');
                                                    print_bill_data.push('<td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">Insurance Balance Due:</td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">'+data.bill_history[0].insurance_balance_due+'</td>');
                                                  print_bill_data.push('</tr>');
                                                   print_bill_data.push('<tr><td width="180" valign="middle" height="20" align="left" style="font-size:13px; color:#000; font-family:arial;">Total Paid Via Credit Card</td>');
                                                    print_bill_data.push('<td valign="middle" height="20" align="left" style="font-size: 13px; font-family: arial; padding: 7px; color: rgb(255, 255, 255);">'+data.bill_history[0].total_online_paid+'</td></tr>');
                                                print_bill_data.push('</tbody>');
                                              print_bill_data.push('</table>');
                                            print_bill_data.push('</td>');
                                          print_bill_data.push('</tr>');
                                        print_bill_data.push('</tbody>');
                                      print_bill_data.push('</table>');
                                    print_bill_data.push('</td>');
                                  print_bill_data.push('</tr>');
                                  print_bill_data.push('<tr>');
                                  print_bill_data.push('<td><h5 style="text-transform: uppercase; color: rgb(0, 0, 0) !important;font-size: 15px;">Term And Condition </h5><div style="font-size: 15px; margin-bottom: 11px;">Lorem ipsum dolor sit amet, cinsectetur adipisicing elit, see do aiusmod tempot incididunt utlabore et dolore magna alique. ut enim ad minim veniam, quis mostrud exerctiona ullamco laboris nisi aliquieo ex ea.com</div></td>');
                                  print_bill_data.push('<tr>');
                                print_bill_data.push('</tbody>');
                              print_bill_data.push('</table>');
                            print_bill_data.push('</td>');
                          print_bill_data.push('</tr>');
                        print_bill_data.push('</tbody>');
                      print_bill_data.push('</table>');
                    print_bill_data.push('</div>');
                  print_bill_data.push('</div>');
                print_bill_data.push('</div>');
                print_bill_data.push('<div style="padding-top: 0px; padding-bottom: 10px; text-align:left;" class="modal-footer">');
                  print_bill_data.push('<div class="col-lg-12 text-center">I authorize the release of any medical information necessary to process this claim.</div>');
                  print_bill_data.push('<div style="padding-top: 15px; clear: both; border-top: 1px solid grey; margin-top: 0px;"><span style="color: rgb(0, 0, 0); font-family: arial; font-weight: bold; font-size: 9px;">This bill is generated with Digital Health Pulse.<br>*Digital Health Pulse(DHP) is online (cloud) based clinical Practice Management product from Sensory Health Systems.Works in offline mode when required.</span><br><span style="font-size:11px; color:#000; font-family:arial; font-weight:bold;">Interested? Call us at or Email us at info@sensoryhealth.com</span></div>');
                print_bill_data.push('</div>');

                //PrintHtmlWithJquery(print_bill_data);
                //$("#testprintHTML").html(print_bill_data.join(''));
                printNewHtml(print_bill_data.join(''));
              },
              error:function(data,error,reason){
                newAlert('danger', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
              },
              key:data.user_id
            });
          }else{
            newAlert("danger", "Please Set Invoice Setting First.");
            $("#savebill, #savebill_print").removeAttr("disabled");
            $('html, body').animate({scrollTop: 0}, 1000);
            return false;
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
    },
    error:function(data,error,reason){
      console.log(data);
    }
  });
}

function getBillList() {
  $('#billing_list_table tbody').html('');
  $("#billing_list_table").block({"msg":"Please Wait...."});
  $.couch.db(db).view("tamsa/getBillList", {
    success: function(data) {
      if(data.rows.length > 0){
        $.couch.db(db).view("tamsa/getEbilling", {
          success: function(edata) {
            if(edata.rows.length > 0) {
              paginationConfiguration(data,"billing_pagination",10,displayBillingList,edata.rows[0].value.enable_billing);
            }else {
              paginationConfiguration(data,"billing_pagination",10,displayBillingList,true);
            }
          },
          error: function(status, error, reason) {
            console.log(error);
          },
          key: pd_data.dhp_code
        });
      }else{
        $("#billing_list_table").unblock();
        $("#billing_list_table tbody").html('<tr><td colspan="6">No Bills were generated.</td></tr>');
      }
    },
    error: function(status) {
      console.log(status);
    },
    startkey:     [pd_data.dhp_code,userinfo.user_id,{}],
    endkey:       [pd_data.dhp_code,userinfo.user_id],
    descending:   true,
    include_docs: true
  });
}

function displayBillingList(start,end,data,ebill_pref){
  var billing_list_tbody = [];
  for (var i = start; i < end; i++) {
    billing_list_tbody.push('<tr><td>'+data.rows[i].doc.insert_ts.substring(0,10)+'</td><td>'+data.rows[i].doc.doctor_name+'</td><td align="right">'+data.rows[i].doc.bill_history[data.rows[i].doc.bill_history.length - 1].total_bill_topay+'</td><td>'+data.rows[i].doc.email_sent_on+'</td>');
    if(data.rows[i].doc.email_sent_date){
      billing_list_tbody.push('<td>'+data.rows[i].doc.email_sent_date+'</td>');
    }else{
      billing_list_tbody.push('<td>Not Sent</td>');
    }
    billing_list_tbody.push('<td>'+data.rows[i].doc.invoice_no+'</td>');
    billing_list_tbody.push('<td><span class="glyphicon glyphicon-eye-open bill_view" title="View" index="'+data.rows[i].id+'"></span>');
    if(ebill_pref) {
      billing_list_tbody.push('<span class="glyphicon glyphicon-pencil bill_edit" title="edit" index="'+data.rows[i].id+'"></span>');
    }else {
      $("#create_bill_link").hide();
    }
    billing_list_tbody.push('</td></tr>');
  }
  $("#billing_list_table tbody").html(billing_list_tbody.join(''));
  $("#billing_list_table").unblock();
}

function clearBillForm() {
  $("#finalized_message").show();
  $(".no_records").show();
  $("#bill_additional_notes").val("").removeAttr("readonly");
  $("#total_bill_amount").val(0);
  $("#subjective_billrecords tbody tr").not(".no_records").remove();
  $("#total_bill_discount").val(0);
  $("#total_bill_topay").val(0);
  $("#total_cash_paid").val(0).removeAttr("readonly");

  $("#total_online_paid").val(0).removeAttr("readonly");
  $("#total_balance_due").val(0);
  $("#advance_paid").val(0).removeAttr("readonly");
  $("#billing_due_date").val(moment().format("YYYY-MM-DD"));
  $("#billing_due_date").removeAttr("readonly");
  $("#patient_credit").val(0);
  $("#insurance_balance_due").val(0);
  $("#bill_reprint, #bill_resend").hide();
  $("#billing_appointment_finalize").val("No").removeAttr("disabled");
  $("#savebill, #savebill_print").removeData("index").removeData("rev").show();
  $("#invoice_no").html("");
}

function getBillView(index,triggerpage) {
  clearBillForm();
  checkInvoiceSetting();
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      var length = data.bill_history.length;

        $("#create_bill_link").trigger("click");
        $("#bill_additional_notes").val(data.bill_history[length -1].bill_additional_notes).attr("readonly","readonly");
        $("#total_bill_amount").val(data.bill_history[length -1].total_bill_amount).attr("readonly","readonly");
        $("#total_bill_discount").val(data.bill_history[length -1].total_bill_discount).attr("readonly","readonly");
        $("#total_bill_topay").val(data.bill_history[length -1].total_bill_topay).attr("readonly","readonly");
        $("#total_cash_paid").val(data.bill_history[length -1].total_cash_paid).attr("readonly","readonly");
        $("#total_online_paid").val(data.bill_history[length -1].total_online_paid).attr("readonly","readonly");
        $("#billing_due_date").val(data.due_date).attr("readonly","readonly");
        $("#total_balance_due").val(data.bill_history[length -1].total_balance_due);
        $("#insurance_balance_due").val(data.bill_history[length -1].insurance_balance_due);
        $("#add_subjective_billrecords").hide();
        $("#bill_resend").attr("index",data._id);
        $("#invoice_no").html(data.invoice_no);
        $("#billing_appointment_finalize").val(data.finalize).attr("disabled", true);
        data.bill_history[length -1].advance_paid ? $("#advance_paid").val(data.bill_history[length -1].advance_paid).attr("readonly","readonly") : $("#advance_paid").val(0).attr("readonly","readonly");
        data.bill_history[length -1].patient_credit ? $("#patient_credit").val(data.bill_history[length -1].patient_credit).attr("readonly","readonly") : $("#patient_credit").val(0).attr("readonly","readonly");

        var view_diagnosis_procedure_tbody = [];
        view_diagnosis_procedure_tbody.push('<tr class = "no_records" style = "display:none;"><td colspan="3">No records</td></tr>');

        for (var i = 0; i < data.bill_history[length -1].diagnosis_procedures_details.length; i++) {
          if(data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_procedure_type){
            view_diagnosis_procedure_tbody.push('<tr><td width="25%">'+data.bill_history[length -1].diagnosis_procedures_details[i].date+'</td><td width="25%">'+data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code+'<br><b>('+data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_procedure_type+')</b></td><td width="15%">'+data.bill_history[length -1].diagnosis_procedures_details[i].billing_code+'</td><td width="20%">'+data.bill_history[length -1].diagnosis_procedures_details[i].description+'</td><td width="14%">'+data.bill_history[length -1].diagnosis_procedures_details[i].charges+'</td></tr>');
          }else{
            view_diagnosis_procedure_tbody.push('<tr><td width="25%">'+data.bill_history[length -1].diagnosis_procedures_details[i].date+'</td><td width="25%">'+data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code+'</td><td width="15%">'+data.bill_history[length -1].diagnosis_procedures_details[i].billing_code+'</td><td width="20%">'+data.bill_history[length -1].diagnosis_procedures_details[i].description+'</td><td width="14%">'+data.bill_history[length -1].diagnosis_procedures_details[i].charges+'</td></tr>');  
          }
          
        };

        if(length > 0)
          $("#subjective_billrecords tbody").html(view_diagnosis_procedure_tbody);
        else
          $("#subjective_billrecords tbody").html('<tr><td colspan="3">No records</td></tr>');

        $("#savebill, #savebill_print").hide();

        if (data.finalize == "Yes") {
          $("#bill_reprint, #bill_resend").show().data({
            "index":data._id,
            "invoice_no":data.invoice_no
          });
        }else{
          $("#bill_reprint, #bill_resend").hide().removeData("index");
        }
        if(triggerpage == "invoice_summary"){
          getUserdetailsForBillingInfo(data.user_id); 
        }
    },
    error: function(status) {
        console.log(status);
    }
  });
}

function getBillEdit(index,triggerpage) {
  clearBillForm();
  checkInvoiceSetting();
  $.couch.db(db).openDoc(index, {
    success: function(data) {
      var length = data.bill_history.length;
      $("#create_bill_link").trigger("click");
      $("#bill_additional_notes").val(data.bill_history[length -1].bill_additional_notes);
      $("#total_bill_amount").val(data.bill_history[length -1].total_bill_amount);
      $("#total_bill_discount").val(data.bill_history[length -1].total_bill_discount).removeAttr("readonly");
      $("#total_bill_topay").val(data.bill_history[length -1].total_bill_topay);
      $("#total_cash_paid").val(data.bill_history[length -1].total_cash_paid);
      $("#total_online_paid").val(data.bill_history[length -1].total_online_paid);
      $("#total_balance_due").val(data.bill_history[length -1].total_balance_due);
      $("#insurance_balance_due").val(data.bill_history[length -1].insurance_balance_due);
      $("#advance_paid").val(data.bill_history[length -1].advance_paid).removeAttr("readonly");
      $("#patient_credit").val(data.bill_history[length -1].patient_credit);
      $("#billing_due_date").val(data.due_date).removeAttr("readonly");
      $("#billing_appointment_finalize").val(data.finalize);
      $("#invoice_no").html(data.invoice_no);

      if (data.finalize == "Yes") {
        $("#billing_appointment_finalize").attr("disabled", true);
        $("#finalized_message").hide();
      }else{
        $("#billing_appointment_finalize").attr("disabled", false);
        $("#finalized_message").show();
      }

      var diagnosis_procedures_details_tbody = [];
      diagnosis_procedures_details_tbody.push('<tr class = "no_records" style = "display:none;"><td colspan="3">No records</td></tr>');
      if(data.bill_history[length -1].diagnosis_procedures_details){
        for (var i = 0; i < data.bill_history[length -1].diagnosis_procedures_details.length; i++) {
          var date_val           = data.bill_history[length -1].diagnosis_procedures_details[i].date;
          var set_type = (data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_procedure_type)?data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_procedure_type:"";
          if(set_type == "None"){
            var set_diagnosis_code = "None";
            var set_code_tmp_val = (data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code)?data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code:"";
            var set_code_val = '<input type="text" class="form-control mrg-top5 sbr_code_val" placeholder="Enter Code" value="'+set_code_tmp_val+'">';
          }else if(set_type == "SoapNote"){
            var set_diagnosis_code = "SoapNote";
            var set_code_val = ""; 
            // var set_code_val = (data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code)?data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code:"";
          }else{
            var set_diagnosis_code = (data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code)?data.bill_history[length -1].diagnosis_procedures_details[i].diagnosis_code:"";
            var set_code_val = "";
          }
          var set_billing_code   = (data.bill_history[length -1].diagnosis_procedures_details[i].billing_code)?data.bill_history[length -1].diagnosis_procedures_details[i].billing_code:"";
          var description_val    = data.bill_history[length -1].diagnosis_procedures_details[i].description;
          var charges_val        = data.bill_history[length -1].diagnosis_procedures_details[i].charges;

          diagnosis_procedures_details_tbody.push('<tr class="cmn-subjective-bill new-added-subjective-bill"><td width="25%"><input type="text" class="form-control sbr_date" value="'+date_val+'"></td><td width="25%"><input class="sbr_subjective_code form-control" type="text" value="'+set_diagnosis_code+'" readonly="readonly"><span class="sbr_type" style="display:none">'+set_type+'</span>'+set_code_val+'</td><td width="15%"><input type="text" class="sbr_billing_code form-control" value="'+set_billing_code+'"></td><td width="20%"><input type="text" class="sbr_description form-control" value="'+description_val+'"></td><td width="14%"><input type="text" class="sbr_charges form-control" value="'+charges_val+'"></td><td width="1%"><span class="label label-warning remove-new-sbr">remove</span></td></tr>');
        }
      }  
      if(length > 0)
        $("#subjective_billrecords tbody").html(diagnosis_procedures_details_tbody);
      else
        $("#subjective_billrecords tbody").html('<tr><td colspan="3">No records</td></tr>');

      $("#savebill, #savebill_print").data({
        "index":index,
        "rev":data._rev,
        "invoice_no":data.invoice_no,
      }).show();
      
      $("#bill_reprint, #bill_resend").hide();
      if(triggerpage == "invoice_summary"){
        getUserdetailsForBillingInfo(data.user_id);
      }else{
        $("#savebill_print, #bill_reprint").data("userid",userinfo.user_id);
        $("#savebill_print, #bill_reprint").data("useremail",userinfo.user_email);
      }
    },
    error: function(status) {
      console.log(status);
    }
  });
}

function getUserdetailsForBillingInfo(userid){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(udata){
      if(udata.rows.length > 0){
        $("#bill_patient_name").html(udata.rows[0].value.first_nm+" "+udata.rows[0].value.last_nm);
        $("#bill_patient_name").data("userid",udata.rows[0].value.user_id);
        $("#bill_patient_name").data("email",udata.rows[0].value.user_email);
        if(udata.rows[0].value.age){
          $("#bill_patient_dob_lbl").html("Age");
          $("#bill_patient_dob").html((udata.rows[0].value.age != "") ? udata.rows[0].value.age : "NA");
        }else{
          $("#bill_patient_dob_lbl").html("Date Of Birth");
          $("#bill_patient_dob").html((udata.rows[0].value.date_of_birth != "") ? udata.rows[0].value.date_of_birth : "NA");
        }
        if(userinfo.address1 && userinfo.address1 != "") $("#bill_patient_addr").html(udata.rows[0].value.address1+", "+udata.rows[0].value.address2)
        else $("#bill_patient_addr").html("NA")
        $("#bill_patient_phone").html(udata.rows[0].value.phone);
        $("#bill_patient_email").html(udata.rows[0].value.user_email);
        if(udata.rows[0].value.patient_dhp_id){
          $("#patient_bill_dhp").html(udata.rows[0].value.patient_dhp_id);
        }
        $("#savebill_print, #bill_reprint").data("userid",udata.rows[0].value.user_id);
        $("#savebill_print, #bill_reprint").data("useremail",udata.rows[0].value.user_email);
      }else{
        newAlert("danger",reason);
        $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
        return false;
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
      return false;
    },
    key:userid
  });
}

function generateSubjectiveBillrecord() {
  $.couch.db(db).view("tamsa/getDiagnosisProcedures",{
    success:function(data){
      var subjective_billrecords = [];
      if(data.rows.length == 1){
        subjective_billrecords.push('<tr class="cmn-subjective-bill new-added-subjective-bill"><td width="25%"><input type="text" class="form-control sbr_date"></td><td width="25%"><select class="sbr_subjective_code form-control"><option><b>None</b></option><option><b>SoapNote</b></option>');
          if(data.rows[0].doc.diagnosis){
            subjective_billrecords.push('<optgroup label="Diagnosis">');
            for(var i=0;i<data.rows[0].doc.diagnosis.length;i++){
              subjective_billrecords.push('<option>'+data.rows[0].doc.diagnosis[i].hospital_diagnosis_code+'</option>');
            }
            subjective_billrecords.push('</optgroup>');
          }
          if(data.rows[0].doc.procedures){
            subjective_billrecords.push('<optgroup label="Procedures">');
            for(var i=0;i<data.rows[0].doc.procedures.length;i++){
              subjective_billrecords.push('<option>'+data.rows[0].doc.procedures[i].hospital_procedure_code+'</option>');
            }  
            subjective_billrecords.push('</optgroup>');
          }
          if(data.rows[0].doc.services){
            subjective_billrecords.push('<optgroup label="Services">');
            for(var i=0;i<data.rows[0].doc.services.length;i++){
              subjective_billrecords.push('<option>'+data.rows[0].doc.services[i].hospital_service_code+'B</option>');
            }
            subjective_billrecords.push('</optgroup>');
          }
          subjective_billrecords.push('</select><span class="sbr_type"></span><input type="text" placeholder = "Enter Code" class="form-control mrg-top5 sbr_code_val"></td><td width="15%"><input type="text" class="sbr_billing_code form-control"></td><td width="20%"><input type="text" class="sbr_description form-control"></td><td width="14%"><input type="text" class="sbr_charges form-control"></td><td width="1%"><span class="label label-warning remove-new-sbr">remove</span></td></tr>');

            if($(".cmn-subjective-bill").length > 0){
              $(".cmn-subjective-bill:last").after(subjective_billrecords.join(''));
            }else{
              $(".no_records").after(subjective_billrecords.join(''));
            }
            $(".no_records").hide();
        //    updateIndex();
      }else if(data.rows.length == 0){
        subjective_billrecords.push('<tr class="cmn-subjective-bill new-added-subjective-bill"><td width="25%"><input type="text" class="form-control sbr_date"></td><td width="25%"><select class="sbr_subjective_code form-control">');
        
        subjective_billrecords.push('<option>None</option><option>SoapNote</option>');

        subjective_billrecords.push('</select><span class="sbr_type"></span><input type="text" placeholder = "Enter Code" class="form-control mrg-top5 sbr_code_val"></td><td width="15%"><input type="text" class="sbr_billing_code form-control"></td><td width="20%"><input type="text" class="sbr_description form-control"></td><td width="14%"><input type="text" class="sbr_charges form-control"></td><td width="1%"><span class="label label-warning remove-new-sbr">remove</span></td></tr>');
        if($(".cmn-subjective-bill").length > 0){
          $(".cmn-subjective-bill:last").after(subjective_billrecords.join(''));
        }else{
          $(".no_records").after(subjective_billrecords.join(''));
        }
        $(".no_records").hide();
      }else if(data.rows.length>1){
        newAlert("danger","Too many documents for Daignosis and procedures.");
        $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
        return false;  
      }
      calculateTotalBillAmountAfterDiscount();
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

function getDiagnosisProcedureCodes(obj){
  if($(obj).val() == "None"){
    // $(obj).parent().next().hide();
    $(obj).parent().find(".sbr_code_val").show();
    $(obj).parents("tr").find(".sbr_billing_code").val("");
    $(obj).parents("tr").find(".sbr_description").val("");
    $(obj).parents("tr").find(".sbr_code_val").val("");
    $(obj).parents("tr").find(".sbr_type").text("None");
    $(obj).parents("tr").find(".sbr_charges").val("").removeAttr("readonly").trigger("change");
  }else if($(obj).val() == "SoapNote"){
    if(validateInvoiceSoapNote(obj)){
      $(obj).parent().find(".sbr_code_val").hide();
      getRecordsForBill($(obj));
    }else{
      $(obj).val("None").trigger("change");
    }
    $(obj).parents("tr").find(".sbr_type").text("SoapNote");
    $(obj).parents("tr").find(".sbr_code_val").val("");
    $(obj).parents("tr").find(".sbr_billing_code").val("");
    $(obj).parents("tr").find(".sbr_description").val("");
    $(obj).parents("tr").find(".sbr_charges").val("").removeAttr("readonly").trigger("change");
  }else{
    getDiagnosisProcedureDetails(obj);
  }
}

function validateInvoiceSoapNote(obj){
  var $dov = $(obj).parent().parent().find(".sbr_date");
  if($dov.val() == ""){
    $dov.val("").focus();
    newAlert("danger", "Date of visit can not be empty.");
    $('html, body').animate({scrollTop: $dov.offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}

function getDiagnosisProcedureDetails(obj){
  $(obj).parent().find(".sbr_code_val").hide();
  var selected = $(':selected', obj);
  $(obj).next().text(selected.closest('optgroup').attr('label'));
  $.couch.db(db).view("tamsa/getDiagnosisProcedures",{
    success:function(data){
      if(data.rows.length == 1){
        if($(obj).next().text() == "Diagnosis"){
          for(var i=0;i<data.rows[0].doc.diagnosis.length;i++){
            if(data.rows[0].doc.diagnosis[i].hospital_diagnosis_code == $(obj).val()){
              $(obj).parents("tr").find(".sbr_billing_code").val(data.rows[0].doc.diagnosis[i].hospital_billing_code);
              $(obj).parents("tr").find(".sbr_description").val(data.rows[0].doc.diagnosis[i].description);
              $(obj).parents("tr").find(".sbr_charges").val(data.rows[0].doc.diagnosis[i].charges).attr("readonly","readonly").trigger("change");
            }
          }
        }else if($(obj).next().text() == "Procedures"){
          for(var i=0;i<data.rows[0].doc.procedures.length;i++){
            if(data.rows[0].doc.procedures[i].hospital_procedure_code == $(obj).val()){
              $(obj).parents("tr").find(".sbr_billing_code").val(data.rows[0].doc.procedures[i].hospital_billing_code);
              $(obj).parents("tr").find(".sbr_description").val(data.rows[0].doc.procedures[i].description);
              $(obj).parents("tr").find(".sbr_charges").val(data.rows[0].doc.procedures[i].charges).attr("readonly","readonly").trigger("change");
            }
          }
        }else{
          var str = $(obj).val();
          for(var i=0;i<data.rows[0].doc.services.length;i++){
            if(data.rows[0].doc.services[i].hospital_service_code ==  str.substring(0, str.length - 1)){
              $(obj).parents("tr").find(".sbr_billing_code").val(data.rows[0].doc.services[i].hospital_billing_code);
              $(obj).parents("tr").find(".sbr_description").val(data.rows[0].doc.services[i].description);
              $(obj).parents("tr").find(".sbr_charges").val(data.rows[0].doc.services[i].charges).attr("readonly","readonly").trigger("change");
            }
          }
        }
        calculateTotalBillAmountAfterDiscount();
      }
    },
    error:function(data,error,reason){
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });
}

function getRecordsForBill($obj) {
  var $dov = $obj.parent().parent();
  $.couch.db(db).view("tamsa/getRecordsForBill", {
    success: function(data) {
      if(data.rows.length > 0){
        var description_val="";
        for (var i = 0; i < data.rows.length; i++){
          if(data.rows[i].key[3] == 0){
            description_val += (data.rows[i].doc.assessment.toString()) ? data.rows[i].doc.assessment.toString() + ", ":"";
            description_val += (data.rows[i].doc.objective.toString()) ? data.rows[i].doc.objective.toString()+ ", ":"";
          }else if(data.rows[i].key[3] == 1){
            for (var j = 0; j < data.rows[i].doc.sections.length; j++) {
              for (var k = 0; k < data.rows[i].doc.sections[j].fields.length; k++) {
                for (var l = 0; l < data.rows[i].doc.sections[j].fields[k].response_format_pair.length; l++) {
                  if (data.rows[i].doc.sections[j].fields[k].response_format_pair[l].response == "soapnote") {
                    description_val += data.rows[i].doc.sections[j].fields[k].response_format_pair[l].values[0].assessment.toString()+ ", ";
                    description_val += data.rows[i].doc.sections[j].fields[k].response_format_pair[l].values[0].objective.toString()+ ", ";
                  }
                }
              }
            };
          }
        }      
        description_val = description_val.trim()
        description_val = description_val.substring(0,description_val.length -1);
        $dov.find(".sbr_description").val(description_val);
      }else{
        newAlert("danger", "No SoapNote Records Found for given Date.");
        $('html, body').animate({scrollTop: $dov.offset().top - 100}, 1000);
        $dov.find(".sbr_subjective_code").val("None").trigger("change");
        return false;
      }
    },
    error: function(data,error,reason) {
      newAlert('danger', reason);
      $('html, body').animate({scrollTop: $dov.offset().top - 100}, 1000);
      return false;
    },
    startkey : [pd_data._id, userinfo.user_id, $dov.find(".sbr_date").val(), 0],
    endkey : [pd_data._id, userinfo.user_id, $dov.find(".sbr_date").val(), 1],
    include_docs: true
  });
}

function billReprint(docid){
  if($("#bill_reprint").data("invoice_setting") != "NA"){
    printPatientBill(docid);
  }else{
    newAlert("danger", "Please Set Invoice Setting First.");
    $("#savebill, #savebill_print").removeAttr("disabled");
    $('html, body').animate({scrollTop: 0}, 1000);
    return false;
  }
}

function billResend(){
  if($("#bill_reprint").data("invoice_setting") != "NA"){
    $.couch.db(db).openDoc($("#bill_resend").attr("index"),{
      success:function(data){
        var cron_record = {
          bill_id:          $("#bill_resend").attr("index"),
          doctype:          "cronRecords",
          operation_case:   17,
          processed:        "No",
          update_ts:        new Date(),
          user_id:          data.user_id,
          total_bill_topay: data.bill_history[0].total_bill_topay
        }  
        $.couch.db(db).saveDoc(cron_record, {
          success: function(data) {
            $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
            newAlert('success', 'Successfully Resend. You will shortly receive your bill details.');
            // clearBillForm();
            $("#back_to_billing_list").trigger("click");
          },
          error: function(data,error,reason) {
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
          }
        });
      },
      error:function(data,error,reason){
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: $("#create_bill").offset().top - 100}, 1000);
      }
    });
  }else{
    newAlert("danger", "Please Set Invoice Setting First.");
    $('html, body').animate({scrollTop: 0}, 1000);
    return false; 
  }
}

function updateIndex(){
  $(".cmn-subjective-bill").find("td:first").each(function(index){
    $(this).html(index + 1);
  });
}

function saveFinalizeBill(bill) {
  $.couch.db(db).openDoc(bill._id, {
    success: function(data) {
      data.bill_history.push(bill.bill_history[0]);
      $.couch.db(db).saveDoc(data, {
        success: function(data) {
          $('html, body').animate({scrollTop: 0}, 'slow');
          newAlert('success', 'Saved successfully !');
          clearBillForm();
          $("#back_to_billing_list").trigger("click");
          getBillList();
          $("#savebill, #savebill_print").removeAttr("disabled");
        },
        error: function(status) {
            console.log(status);
        }
      });
    },
    error: function(status) {
        console.log(status);
    }
  });
}

function getEbillList(){
  $("#invoice_summary_table").block({'msg':'Please Wait....'});
  $.couch.db(db).view("tamsa/getEBillList", {
    success: function(data) {
      if(data.rows.length>0){
        paginationConfiguration(data,"ebill_pagination",10,displayEbillList);
      }else{
        var invoice_summary_tbody = [];
        invoice_summary_tbody.push('<tr><td colspan="8" class="text-center">No Bills were generated.</td></tr>');
        $("#invoice_summary_table tbody").html(invoice_summary_tbody.join(''));
        $("#ebill_view_pref").hide();
        $("#invoice_summary_table").unblock();
      }
    },
    error: function(status) {
      console.log(status);
    },
    startkey:     [pd_data.dhp_code,{}],
    endkey:       [pd_data.dhp_code],
    descending:   true,
    include_docs: true
  });
}

function displayEbillList(start,end,data){
  var invoice_summary_tbody = [];
  for (var i = start; i < end; i++) {
    invoice_summary_tbody.push('<tr><td width="10%">'+data.rows[i].doc.insert_ts.substring(0,10)+'</td><td width="10%">'+data.rows[i].doc.doctor_name+'</td><td width="10%">'+data.rows[i].doc.bill_history[data.rows[i].doc.bill_history.length - 1].total_bill_topay+'</td><td width="40%" style="word-break:break-all;">'+data.rows[i].doc.email_sent_on+'</td>');
    if(data.rows[i].doc.email_sent_date){
      invoice_summary_tbody.push('<td width="10%">'+data.rows[i].doc.email_sent_date+'</td>');
    }else{
      invoice_summary_tbody.push('<td width="10%">Not Sent</td>');
    }
    invoice_summary_tbody.push('<td width="10%" class="billing-patient-name" userid='+data.rows[i].doc.user_id+'></td>');
    invoice_summary_tbody.push('<td width="5%"><span class="glyphicon glyphicon-eye-open bill_view" title="View" index="'+data.rows[i].id+'"></span>');
    if(!ebill_pref) {
      $("#ebill_add_pref").hide();
    }else {
      $("#ebill_view_pref").hide();
      invoice_summary_tbody.push('<span class="glyphicon glyphicon-pencil bill_edit" title="Edit" index="'+data.rows[i].id+'"></span></td>');
    }
    invoice_summary_tbody.push('</tr>');
  }
  $("#invoice_summary_table tbody").html(invoice_summary_tbody.join(''));
  billingPatientName();
  $("#invoice_summary_table").unblock();
}

function billingPatientName(){
  $(".billing-patient-name").each(function(){
    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
      success:function(data){
        if(data.rows.length > 0){
          $("#invoice_summary_table tbody").find("td[userid = '"+data.rows[0].value.user_id+"']").html(data.rows[0].value.first_nm + " " + data.rows[0].value.last_nm);  
        }else{
          newAlert('danger',"User data is missing.");
          $('html, body').animate({scrollTop: 0}, 'slow');
          return false;
        }
      },
      error:function(data,error,reason){
        newAlert('danger',reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      },
      key: $(this).attr("userid")
    });
  });
}

function getInvoiceSummaryView(index){
  $(".tab-pane").removeClass("active");
  $("#create_bill_parent").addClass("active");
  getBillView(index,"invoice_summary");
  $("#back_to_billing_list").attr("id","back_to_bill_summary_list");
}

function getInvoiceSummaryEdit(index){
  $(".tab-pane").removeClass("active");
  $("#create_bill_parent").addClass("active");
  getBillEdit(index,"invoice_summary");
  $("#back_to_billing_list").attr("id","back_to_bill_summary_list");
}

function getInvoiceSummaryAdd(){
  $(".tab-pane").removeClass("active");
  $("#create_bill_parent").addClass("active");
  getBillingNewAdd("invoice_add");
  $("#back_to_billing_list").attr("id","back_to_bill_summary_list");
}

function getBillingNewAdd(invoice_add){
  $.couch.db(db).view("tamsa/getPrintSetting",{
    success:function(data){
      if(data.rows.length == 1){
        $("#savebill_print, #savebill").data("frontdesk","test");
        $("#bill_hospital_addr").html(data.rows[0].doc.hospital_address);
        $("#savebill_print, #bill_reprint").data("invoice_setting",data.rows[0].doc._id);
        $("#bill_hospital_name").html(data.rows[0].doc.hospital_name);
        $("#bill_hospital_name").html(data.rows[0].doc.hospital_name);
        $("#bill_doctor_email").html(data.rows[0].doc.hospital_email);
      }else{
        $("#savebill_print, #bill_reprint").data("invoice_setting","NA");
      }
      if(pd_data.level == "Doctor"){
        $("#bill_doctor_name").html(pd_data.first_name+" "+pd_data.last_name);
        $("#bill_dhp_code").html(pd_data.dhp_code+" / "+ pd_data.random_code);
        $("#bill_doctor_phone").html(pd_data.phone);
      }else{
        $("#bill_doctor_name").html('<input type   = "text" name="" id="bill_doctor_name_new" class="form-control" placeholder="Search Doctor Name Here">');
        $("#bill_dhp_code").html('<input type      = "text" name="" id="bill_dhp_code_new" class="form-control">');
        $("#bill_doctor_phone").html('<input type  = "text" name="" id="bill_doctor_phone_new" class="form-control">');
        searchDHPDoctorsList("bill_doctor_name_new",autocompleterSelectBillingForDoctorsList,pd_data.dhp_code);
      }
      $("#bill_patient_name").html('<input type = "text" name="" id="bill_patient_name_new" class="form-control" placeholder="Search Patient Name Here">');
      $("#bill_patient_addr").html('<input type = "text" name="" id="bill_patient_addr_new" class="form-control">')
      // if(userinfo.date_of_birth) {
        $("#bill_patient_dob_lbl").html("Date Of Birth");
        $("#bill_patient_dob").html('<input type = "text" name="" id="bill_patient_dob_new" class="form-control">');
      // }else {
      //   $("#bill_patient_dob_lbl").html("Age");
      //   $("#bill_patient_dob").html(userinfo.age ? userinfo.age : "NA");
      // }
      $("#patient_bill_dhp").html('<input type   = "text" name="" id="patient_bill_dhp_new" class="form-control">');
      $("#bill_patient_phone").html('<input type = "text" name="" id="bill_patient_phone_new" class="form-control">');
      $("#bill_patient_email").html('<input type = "text" name="" id="bill_patient_email_new" class="form-control">');
      searchDHPPatientByNameAutocompleter("bill_patient_name_new",autocompleterSelectEventForSubscriberListOnFrontDeskBilling,false,pd_data.dhp_code);
   },
    error:function(edata,error,reason){
      newAlert("danger", reason);
      $('html, body').animate({scrollTop: 0}, 1000);
      return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });  
}