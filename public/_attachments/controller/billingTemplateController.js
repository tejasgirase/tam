var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("billingTemplateController",function($scope,$state,$stateParams,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(data.name == null)
         window.location.href = "index.html";
      else {
        $.couch.db(replicated_db).openDoc("org.couchdb.user:"+data.name+"", {
          success: function(data) {
            pd_data = data;
            bindingsForBillingTemplate();
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
});

function bindingsForBillingTemplate(){
  $("#create_bill").on("click",".remove-new-sbr", function (){
   $(this).parent().parent().remove();
   calculateBillAmount();
   calculateTotalBillAmountAfterDiscount();
  });

  $("#create_bill").on("click","#add_subjective_billrecords",function(){
   generateSubjectiveBillrecord();
  });

  $("#create_bill").on("click","#bill_reprint",function(){
   billReprint($(this).data("index"));
  });

  $("#create_bill").on("click","#bill_resend",function(){
   billResend();
  });

  $("#create_bill").on("keypress",".billrecord_discount, .billrecord_amount",function (e) {
   if (e.which != 8 && e.which !== 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
     $(this).focus();
     return false;
   }
  });

  $("#create_bill").on("change",".sbr_subjective_code",function(){
   getDiagnosisProcedureCodes(this);
  });

  $("#create_bill").on("change", ".sbr_charges", function() {
   calculateBillAmount();
  });

  $("#create_bill").on("change", "#total_bill_discount", function() {
   calculateTotalBillAmountAfterDiscount();
  });

  $("#create_bill").on("focusout", "#advance_paid", function(){
   calculateBillAfterAdvancePay();
  });

  $("#create_bill").on("click","#savebill",function(){
   createSaveRequestForPatientBill("savebill");
  });

  $("#create_bill").on("click","#savebill_print",function(){
    createSaveRequestForPatientBill("savebill_print");
  });
}

function eventBindingsForDashboardBilling(){
  $("#dashboard_billing_parent").on("click", ".bill_view", function() {
    getInvoiceSummaryView($(this).attr("index"));
  });

  $("#dashboard_billing_parent").on("click", ".bill_edit", function() {
    getInvoiceSummaryEdit($(this).attr("index"));
  });

  $("#dashboard_billing_parent").on("click", "#ebill_add_pref", function() {
    getInvoiceSummaryAdd($(this).attr("index"));
  });

  $("#dashboard_billing_parent").on("click","#back_to_bill_summary_list",function(){
    $(".tab-pane").removeClass("active");
    $("#e_billing").addClass("active");
    getEbillList();
  });
}
 
function autocompleterSelectBillingForDoctorsList(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    $("#"+search_id).val("");
  }else{
    $("#"+search_id).val(ui.item.key[1]);
    $("#"+search_id).data("doctor_id",ui.item.value);
    $("#"+search_id).data("dhp_code",ui.item.doc.dhp_code);
    $("#bill_doctor_email_new").attr("readonly","readonly").val(ui.item.doc.email);
    $("#bill_dhp_code_new").attr("readonly","readonly").val(ui.item.doc.dhp_code+"/"+ui.item.doc.random_code);
    $("#bill_doctor_phone_new").attr("readonly","readonly").val(ui.item.doc.phone);
  }
}

function autocompleterSelectEventForSubscriberListOnFrontDeskBilling(ui,search_id){
  if(ui.item.key[1] == "No results found"){
    return false;
  }else{
    $("#"+search_id).val(ui.item.key[1]);
    $("#"+search_id).data("user_id",ui.item.key[2]);
    getUserDetailsFromUserIDBilling(ui.item.key[2]);
  }
  return false;
}

function getUserDetailsFromUserIDBilling(userid){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(data){
      if(data.rows.length > 0){
        $("#bill_patient_addr_new").attr("readonly","readonly").val(data.rows[0].doc.address1);
        $("#patient_bill_dhp_new").attr("readonly","readonly").val(data.rows[0].doc.patient_dhp_id);
        $("#bill_patient_phone_new").attr("readonly","readonly").val(data.rows[0].doc.phone);
        $("#bill_patient_email_new").attr("readonly","readonly").val(data.rows[0].doc.user_email);
        if(data.rows[0].doc.date_of_birth) {
          $("#bill_patient_dob_lbl").html("Date Of Birth");
          $("#bill_patient_dob").html('<input type = "text" name="" id="bill_patient_dob_new" class="form-control" readonly="readonly" value="'+data.rows[0].doc.date_of_birth+'">');
        }else{
          $("#bill_patient_dob_lbl").html("Age");
          $("#bill_patient_dob").html('<input type = "text" name="" id="bill_patient_dob_new" class="form-control" readonly="readonly" value="'+(data.rows[0].doc.age ? data.rows[0].doc.age : "NA")+'">');
        }
        $("#savebill_print, #bill_reprint").data("userid",data.rows[0].doc.user_id);
        $("#savebill_print, #bill_reprint").data("useremail",data.rows[0].doc.user_email);
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