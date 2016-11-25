var email_filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
var phone_filter = /^[789]\d{9}$/;
var nospace      = /\s/g;

/**
 * [billingInfoValidation BillingInfo Cluster validation]
 * @return {[boolean]} [cluster of validation functions]
 */
function billingInfoValidation(){
	if(billingRequiredField() && checkIfPaymentDetailsNotANumber() && AddNewBillingRequiredField() && diagnosisProcedureDateOfVisit() && diagnosisProcedureDescription() && diagnosisProcedureCharges()){
    return true;
	}else{
		return false;
	}
}

/**
 * [allowOnlyNumbers allow only numerics in inputs]
 * @return {[Boolean]} [false if nonnumeric, true if numeric]
 */
function allowOnlyNumbers(e){
  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    return false;
  }else{
    return true;
  }
}

function allowOnlyNumbersAndDot(e) {
  if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
    return false;
  }else{
    return true;
  }
}

function allowOnlyTenNumbers(e,$obj){
  if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
    return false;
  }else{
    if($obj.val().trim().length > 9){
      if(e.which != 8 && e.which != 0 && e.which != 46){
        return false;  
      }else{
        return true;  
      }  
    }else{
      return true;    
    }
  }
}

/**
 * [billingRequiredField Billing Info Require validation]
 * @return {[Boolean]} 
 */

function AddNewBillingRequiredField(action){
  if(!$("#savebill").data("index") && !$("#savebill").data("rev") && $("#savebill").data("frontdesk")){
    if(pd_data.level == "Doctor" && validationPatientBilling()){
      return true;
    }else if(pd_data.level != "Doctor" && validationPatientAndDoctorBilling()){
      return true;
    }else{
      return false;
    }  
  }else{
    return true;
  }
}

function validationPatientAndDoctorBilling(){
  if($("#billing_due_date").val().trim() == ""){
    newAlert("danger", "Due Date can not be empty.");
    $('html, body').animate({scrollTop: $("#billing_due_date").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_doctor_name_new").val().trim() == ""){
    newAlert("danger", "Doctor Name can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_doctor_name_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_dhp_code_new").val().trim() == ""){
    newAlert("danger", "Doctor Dhp/Practice can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_dhp_code_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_doctor_phone_new").val().trim() == ""){
    newAlert("danger", "Doctor phone no can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_doctor_phone_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_name_new").val().trim() == ""){
    newAlert("danger", "Patient Name can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_name_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_phone_new").val().trim() == ""){
    newAlert("danger", "Patient Phone no can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_phone_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_email_new").val().trim() == ""){
    newAlert("danger", "Patient Email can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_email_new").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
} 

function validationPatientBilling(){
  if($("#billing_due_date").val().trim() == ""){
    newAlert("danger", "Due Date can not be empty.");
    $('html, body').animate({scrollTop: $("#billing_due_date").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_name_new").val().trim() == ""){
    newAlert("danger", "Patient Name can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_name_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_phone_new").val().trim() == ""){
    newAlert("danger", "Patient Phone no can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_phone_new").offset().top - 100}, 1000);
    return false;
  }else if($("#bill_patient_email_new").val().trim() == ""){
    newAlert("danger", "Patient Email can not be empty.");
    $('html, body').animate({scrollTop: $("#bill_patient_email_new").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}

function billingRequiredField(){
  if($("#total_bill_amount").val() == ""){
  	$("#total_bill_amount").val("0");
  	newAlert("danger", "Total bill amount can not be empty.");
  	$('html, body').animate({scrollTop: $("#total_bill_amount").offset().top - 100}, 1000);
  	return false;
  }else if($(".cmn-subjective-bill").length <= 0){
    newAlert("danger", "Diagnosis/Procedure details are not found.");
    $('html, body').animate({scrollTop: $("#subjective_billrecords").offset().top - 150}, 1000);
    return false;
  }else if($("#total_bill_topay").val() == ""){
  	$("#total_bill_topay").val("0");
  	return true;	
  }else if($("#total_cash_paid").val() == ""){
  	$("#total_cash_paid").val("0");
  	return true;
  }else if($("#total_online_paid").val() == ""){
  	$("#total_online_paid").val("0");
  	return true;
  }else if($("#total_balance_due").val() == ""){
  	$("#total_balance_due").val("0");
  	return true;
  }else if($("#insurance_balance_due").val() == ""){
  	$("#insurance_balance_due").val("0");
  	return true;
  }else{
  	return true;
  }
}

function checkIfPaymentDetailsNotANumber(){
  if(isNaN($("#total_bill_amount").val())){
    $("#total_bill_amount").val("0");
    newAlert("danger", "Total Charges amount is not a number.");
    $('html, body').animate({scrollTop: $("#total_bill_amount").offset().top - 100}, 1000);
    return false;
  }else if(isNaN($("#total_bill_topay").val())){
    $("#total_bill_topay").val("0");
    newAlert("danger", "Total amount is not a number.");
    $('html, body').animate({scrollTop: $("#total_bill_topay").offset().top - 100}, 1000);
    return false;
  }else if(isNaN($("#total_balance_due").val())){
    $("#total_balance_due").val("0");
    newAlert("danger", "Patient Balance Due is not a number.");
    $('html, body').animate({scrollTop: $("#total_balance_due").offset().top - 100}, 1000);
    return false;
  }else if(isNaN($("#patient_credit").val())){
    $("#patient_credit").val("0");
    newAlert("danger", "Patient Credit is not a number.");
    $('html, body').animate({scrollTop: $("#patient_credit").offset().top - 100}, 1000);
    return false;
  }else if(isNaN($("#insurance_balance_due").val())){
    $("#insurance_balance_due").val("0");
    newAlert("danger", "Insurance Balance Due is not a number.");
    $('html, body').animate({scrollTop: $("#insurance_balance_due").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}

function validateDiagnosisProcedureInvoiceSetting(){
  if(validateDiagnosisProcedureForm()){
    return true;
  }else{
    return false;
  }
}

function validateDiagnosisProcedureForm(){
  var type_val = $("#choose_diagnosis_procedure").val().trim();
  if($("#diagnosis_procedure_name_val").val().trim() == ""){
    newAlert("danger", type_val + " Name can not be empty.");
    $('html, body').animate({scrollTop: $("#diagnosis_procedure_name_val").offset().top - 100}, 1000);
    return false;
  }else if($("#diagnosis_procedure_billcode_val").val().trim() == ""){
    newAlert("danger", type_val + " Bill code can not be empty.");
    $('html, body').animate({scrollTop: $("#diagnosis_procedure_billcode_val").offset().top - 100}, 1000);
    return false;
  }else if($("#diagnosis_procedure_code_val").val().trim() == ""){
    newAlert("danger", "Hospital " + type_val + " Code can not be empty.");
    $('html, body').animate({scrollTop: $("#diagnosis_procedure_code_val").offset().top - 100}, 1000);
    return false;
  }else if($("#diagnosis_procedure_charges_val").val().trim() == ""){
    newAlert("danger", type_val + " Charges can not be empty.");
    $('html, body').animate({scrollTop: $("#diagnosis_procedure_charges_val").offset().top - 100}, 1000);
    return false;
  }else if($("#diagnosis_procedure_description_val").val().trim() == ""){
    newAlert("danger", type_val + " description can not be empty.");
    $('html, body').animate({scrollTop: $("#diagnosis_procedure_description_val").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}

/**
 * [diagnosisProcedureDateOfVisit]
 * Treatment: Date of Visit Validation
 * @return {[Boolean]}
 */
function diagnosisProcedureDateOfVisit(){
	var validate;
	$(".sbr_date").each(function(){
		if($(this).val() == ""){
			validate = true;
			newAlert("danger", "Please add date of visit in Diagnosis/Procedure.");
			$('html, body').animate({scrollTop: $("#subjective_billrecords").offset().top - 100}, 1000);
			return validate;
		}
	});
	if(validate){
		return false; 
	}else{
		return true;
	}
}
/**
 * [diagnosisProcedureBillingCode]
 * DiagnosisProcedure: Billing Code Validation
 * @return {[boolean]}
 */
// function diagnosisProcedureBillingCode(){
// 	var validate;
// 	$(".sbr_billing_code").each(function(){
// 		if($(this).val() == ""){
// 			validate = true;
// 			newAlert("danger", "Please add billing code in treatment.");
// 			$('html, body').animate({scrollTop: $("#subjective_billrecords").offset().top - 100}, 1000);
// 			return validate;
// 		}
// 	});
// 	if(validate){
// 		return false; 
// 	}else{
// 		return true;
// 	}
// }
/**
 * [treatmentFee]
 * Treatmenmt: Fee Validation
 * @return {[boolean]}
 */
function diagnosisProcedureCharges(){
	var validate;
	$(".sbr_charges").each(function(){
		if($(this).val() == ""){
			validate = true;
			newAlert("danger", "Please add Charges in Diagnosis/Procedures.");
			$('html, body').animate({scrollTop: $("#subjective_billrecords").offset().top - 100}, 1000);
			return validate;
		}
	});
	if(validate){
		return false; 
	}else{
		return true;
	}
}
/**
 * [diagnosisProcedureDescription]
 * Treatmenmt: Discount Validation
 * @return {[boolean]}
 */
function diagnosisProcedureDescription(){
	var validate;
	$(".sbr_description").each(function(){
		if($(this).val() == ""){
			validate = true;
			newAlert("danger", "Please add description value in Diagnosis/Procedures.");
			$('html, body').animate({scrollTop: $("#subjective_billrecords").offset().top - 100}, 1000);
			return validate;
		}
	});
	if(validate){
		return false; 
	}else{
		return true;
	}
}

function subUserValidation(action){
	var fname = $("#su_first_name").val();
	var lname = $("#su_last_name").val();
	var pwd   = $("#su_password").val();
	var phone = $("#su_phone_number").val();
	var email = $("#su_email").val();

	if (fname.trim().length == 0){
		newAlertForModal('danger', 'First name not can not be empty.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_first_name").focus();
		return false;
	}else if (lname.trim().length == 0){
		newAlertForModal('danger', 'Last name can not be empty.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_last_name").focus();
		return false;
	}else if (phone.trim().length == 0){
		newAlertForModal('danger', 'Phone number can not be empty.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_phone_number").focus();
		return false;
	}else if (email.trim().length == 0){
		newAlertForModal('danger', 'Email address can not be empty.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_email").focus();
		return false;
	}else if(!email_filter.test(email)){
		newAlertForModal('danger', 'Not a valid email address.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_email").focus();
		return false;
	}else if(!phone_filter.test(phone)){
		newAlertForModal('danger', 'Not a valid phone number.','add_sub_user_modal');
		$('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
		$("#su_phone_number").focus();
		return false;
	}else if(action == "save"){
		if (pwd.trim().length == 0) {
	    newAlertForModal('danger', 'Password can not be blank','add_sub_user_modal');
	    $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
	    $("#su_password").focus();
	    return false;
	  }else if((pwd.match(nospace))){
	    newAlertForModal('danger', 'Password can not contain spaces.','add_sub_user_modal');
	    $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
	    $("#su_password").focus();
	    return false;
	  }else if($("#su_password").val() !== $("#su_confirm_password").val()) {
	    $("#validationtext").text("");
	    newAlertForModal('danger', 'Password does not match.','add_sub_user_modal');
	    $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
	    $("#su_password").focus();
	    return false;
		}else{
			return true;
		}
	}
	else{
		return true;
	}
}

function carePlanValidation(){
	var valide;
  if ($("#cplan_name").val().trim().length == 0){
		newAlert("danger", "Care Plan name can not be empty.");
		$('html, body').animate({scrollTop: $("#cplan_name").offset().top - 100}, 1000);
		valide =false;
    return valide;
	}else if ($("#specialization_name").val() == null){
		newAlert("danger", "Specialization name can not be empty.");
		$('html, body').animate({scrollTop: $("#specialization_name").offset().top - 100}, 1000);
		valide =false;
    return valide;
	}
  else{
    $(".section-table").each(function(){
      if(!$(this).find(".careplan-rows")[0]){
        newAlert("danger", "This Section of value can not be empty.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
        valide =false;
        return valide;  
      }else{
        $(".careplan-rows").each(function(){
          if($(this).find(".cp-response-val").val() == "Select Response"){
            newAlert("danger", "Selcet Response value can not be empty.");
            $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
            valide =false;      
            return valide;     
          }else{
            valide = true;
            return valide;
          }
        });  
      }
    });
  }
  return valide;
}

function validateResetPassword() {
  var nospace = /\s/g;
  	
  if ($("#old_password_change").val().trim().length == 0) {
    newAlert("danger", "Please Enter old password");
    $("#old_password_change").focus();
    return false;
  }
  if ($("#new_password_change").val().trim().length == 0) {
  	newAlert("danger", "Please Enter new password");
    $("#new_password_change").focus();
    return false;	
  }
  if ($("#confirm_password_change").val().trim().length == 0) {
  	newAlert("danger", "Please Enter confirm password");
    $("#confirm_password_change").focus();
    return false;
  }
  else if(($("#new_password_change").val().match(nospace))) {
    newAlert("danger", "Password can not contain spaces");
    $("#new_password_change").focus();
    return false;
  }
  else if($("#new_password_change").val() !== $("#confirm_password_change").val()) {
    newAlert("danger", "Password does not match.");
    $("#new_password_change").focus();
    return false;
  }
  else {
  	return true;
  }
}

function validateChartingResponseField() {
  var validate;	
  if ($("#ctemplate-fieldname").val().trim().length == 0) {
		newAlertForModal('danger', 'Field name can not be blank.','build_charting_template_modal');	
		return false;
  }

  $(".cmn-ctemplate-response-val").each(function(){
    var $obj = $(this).parent().parent();
    if($obj.find(".cmn-ctemplate-response-val").val() == "multiple"){
      $obj.find(".cmn-ctemplate-format-val").parent().each(function(){
        if($(this).find(".cmn-ctemplate-format-val").val().trim() == ""){
          validate = false;
          newAlertForModal('danger', 'Single Select value can not be blank.','build_charting_template_modal'); 
        }else{
          validate = true;
        }
      });  
    }else if($obj.find(".cmn-ctemplate-response-val").val() == "combobox"){
      $obj.find(".cmn-ctemplate-format-val").parent().each(function(){
        if($(this).find(".cmn-ctemplate-format-val").val().trim() == ""){
          validate = false;
          newAlertForModal('danger', 'Multiple Select value can not be blank.','build_charting_template_modal'); 
        }else{
          validate = true;
        }
      });
    }else if($obj.find(".cmn-ctemplate-response-val").val() == "table"){
      if($obj.find(".cmn-ctemplate-format-val").val().trim() == ""){
        validate = false;
        newAlertForModal('danger', 'Table value can not be blank.','build_charting_template_modal');
      }else{
        validate = true;
      }
    }else if($obj.find(".cmn-ctemplate-response-val").val() == "grid"){
      if($obj.find(".cmn-ctemplate-format-val").val().trim() == ""){
        validate = false;
        newAlertForModal('danger', 'Grid value can not be blank.','build_charting_template_modal');
      }else{
        validate = true;
      }
    }
    // else if($obj.find(".cmn-ctemplate-response-val").val() == "biometrics"){
    //   if(!$obj.find(".biometrics_values").val()){
    //     validate = false;
    //     newAlertForModal('danger', 'Biometrics & Medical History value can not be blank.','build_charting_template_modal');
    //   }else{
    //     validate = true;
    //   }
    // }
    else{
      validate = true;
    }
  });
console.log(validate);
  return validate;
}

function validateFamilyMedicalHistory(parent,relation,condition,chart) {
  var validate = "";
  $("."+parent).each(function(){
    if ($(this).find("."+relation).val() == "Select Relation" || $(this).find("."+relation).val().trim().length == 0) {
      if(chart == ""){
        newAlertForModal('danger', 'Relation field can not be empty','add_fmh_modal');
      }  
      validate = false;
    }else if ($(this).find("."+condition).val().trim().length == 0 || $(this).find("."+condition).val() == "Select Condition") {
      if(chart == ""){
        newAlertForModal('danger', 'Condition field can not be empty','add_fmh_modal'); 
      }  
      validate = false; 
    }else {
      validate = true;
    }
  });
  return validate;
}

/**
 * [singleUserValidation]
 * Add New Patient Validations
 * @return {boolean}
 */
function singleUserValidation(){
  if(required() && validatePhoneNumber("isu_phone") && validatePhoneNumber("isu_ephone") && verifyEmail("isu_email") && verifyFMH()){
    return true;
  }else{
    return false;
  }
}

function FMHRelationValidation(){
  var validate;
  $(".isu-fmh-relation").each(function(){
    if($(this).val() == "Select"){
      validate = true;
      newAlert("danger", "Family Relation can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      return validate;
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function FMHConditionValidation(){
  var validate;
  $(".isu-fmh-condition").each(function(){
    if($(this).val() == "Select"){
      validate = true;
      newAlert("danger", "Family Condition can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      return validate;
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}
 
function required() {
  if($("#isu_first_name").val().trim() == ""){
    newAlert("danger", "First Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_first_name").offset().top - 100}, 1000);
    $("#isu_first_name").focus();
    return false;
  }else if($("#isu_last_name").val().trim() == ""){
    newAlert("danger", "Last Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_last_name").offset().top - 100}, 1000);
    $("#isu_last_name").focus();
    return false;
  }else if($("#isu_date_of_birth").val().trim() == "" && $("#isu_age").val().trim() == ""){
    newAlert("danger", "Date Of Birth or Age can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_date_of_birth").offset().top - 100}, 1000);
    $("#isu_date_of_birth").focus();
    return false;
  }else if($("#isu_sex").val().trim() == ""){
    newAlert("danger", "Sex can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_sex").offset().top - 100}, 1000);
    $("#isu_sex").focus();
    return false;
  }else if($("#isu_height").val().trim() == ""){
    newAlert("danger", "Height can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_height").offset().top - 100}, 1000);
    $("#isu_height").focus();
    return false;
  }else if($("#isu_weight").val().trim() == ""){
    newAlert("danger", "Weight can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_weight").offset().top - 100}, 1000);
    $("#isu_weight").focus();
    return false;
  }else if($("#isu_ename").val().trim() == ""){
    newAlert("danger", "Emergency Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_ename").offset().top - 100}, 1000);
    $("#isu_ename").focus();
    return false;
  }else if($("#isu_ephone").val().trim() == ""){
    newAlert("danger", "Emergency phone number can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_ephone").offset().top - 100}, 1000);
    $("#isu_ephone").focus();
    return false;
  }else if($("#isu_erelation").val().trim() == ""){
    newAlert("danger", "Emergency relation field can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_erelation").offset().top - 100}, 1000);
    $("#isu_erelation").focus();
    return false;
  }else if($("#isu_phone").val().trim() == ""){
  	newAlert("danger", "Phone Number should not be empty.");
  	$('html, body').animate({scrollTop: $("#isu_phone").offset().top - 100}, 1000);
  	$("#isu_phone").focus();
  	return false;
  }else if($("#isu_email").val().trim() == ""){
  	newAlert("danger", "Email id should not be empty.");
  	$('html, body').animate({scrollTop: $("#isu_email").offset().top - 100}, 1000);
  	$("#isu_email").focus();
  	return false;
  }else if($("#isu_address1").val().trim() == ""){
    newAlert("danger", "Address can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_address1").offset().top - 100}, 1000);
    $("#isu_address1").focus();
    return false;
  }else if($("#isu_pincode").val().trim() == ""){
    newAlert("danger", "Pincode can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_pincode").offset().top - 100}, 1000);
    $("#isu_pincode").focus();
    return false;
  }else if($("#isu_city").val() == ""){
    newAlert("danger", "City Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_city").offset().top - 100}, 1000);
    $("#isu_city").focus();
    return false;
  }else if($("#isu_state").val() == ""){
    newAlert("danger", "State Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_state").offset().top - 100}, 1000);
    $("#isu_state").focus();
    return false;
  }else if($("#isu_country").val() == ""){
    newAlert("danger", "Country Name can not be empty.");
    $('html, body').animate({scrollTop: $("#isu_country").offset().top - 100}, 1000);
    $("#isu_country").focus();
    return false;
  }else{
    return true;
  }
}

function verifyFMH() {
  var relation = [],
      validate;
  $(".fmh-parent").each(function() {
    if($(this).find(".isu-fmh-relation").val() != "Select" || $(this).find(".isu-fmh-condition").val()) {
      relation.push({
        relation: $(this).find(".isu-fmh-relation").val(),
        condition: $(this).find(".isu-fmh-condition").val()
      });  
    }
  });
  if(relation.length > 0) {
    for(var i=0;i<relation.length;i++){
      for(var j=i+1;j<relation.length;j++){
        if(relation[i].relation == relation[j].relation && relation[i].condition == relation[j].condition) {
          validate = true;
          break;
        }
      }
      if(validate) break;
    }  
  }
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function verifyFMHAtChartingTemplate(parent_class, relation_class, condition_class) {
  var relation = [],
      validate;
  $("."+parent_class).each(function() {
    if($(this).find("."+relation_class).val() != "Select" || $(this).find("."+condition_class).val()) {
      relation.push({
        relation: $(this).find("."+relation_class).val(),
        condition: $(this).find("."+condition_class).val()
      });  
    }
  });
  if(relation.length > 0) {
    for(var i=0;i<relation.length;i++){
      for(var j=i+1;j<relation.length;j++){
        if(relation[i].relation == relation[j].relation && relation[i].condition == relation[j].condition) {
          validate = true;
          break;
        }
      }
      if(validate) break;
    }  
  }
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function validatePhoneNumber(phoneid){
  var phone_filter = /^(\+\d{1,3}[- ]?)?\d{10}$|^(\+\d{1,3}[- ]?)?\d{11}$/;
	if(!phone_filter.test($("#"+phoneid).val().trim())){
    if(phoneid == "isu_email"){
  	  newAlert("danger", "Not a valid phone number.");
    }else{
      newAlert("danger", "Not a valid phone number in emergency contact.");
    }
  	$('html, body').animate({scrollTop: $("#"+phoneid).offset().top - 100}, 1000);
  	$("#"+phoneid).focus();
  	return false;
	}else{
		return true;
	}
}

function requiredReferDoc(){
  if($("#rd_doctor_email").val() == ""){
    newAlert("danger", "Please enter Recipient Email address.");
    $('html, body').animate({scrollTop: $("#rd_doctor_email").offset().top - 100}, 1000);
    $("#rd_doctor_email").focus();
    return false;
  }else if($("#rd_doctor_name").val() == ""){
    newAlert("danger", "Please enter Recipient Doctor Name.");
    $('html, body').animate({scrollTop: $("#rd_doctor_name").offset().top - 100}, 1000);
    $("#rd_doctor_name").focus();
    return false;
  }else if($("#rd_introduction").val() == ""){
    newAlert("danger", "Please enter Introduction note.");
    $('html, body').animate({scrollTop: $("#rd_introduction").offset().top - 100}, 1000);
    $("#rd_introduction").focus();
    return false;
  }else if($("#rd_sincerly").val() == ""){
    newAlert("danger", "Please enter your name and signature.");
    $('html, body').animate({scrollTop: $("#rd_sincerly").offset().top - 100}, 1000);
    $("#rd_sincerly").focus();
    return false;
  }else{
    return true;
  }
}

function verifyEmail(id){
	if (!email_filter.test($("#"+id).val().trim())) {
	  newAlert("danger", "Not a valid email address.");
	  $('html, body').animate({scrollTop: $("#"+id).offset().top - 100}, 1000);
	  $("#"+id).focus();
	  return false;
	}else{
	  return true;
	}
}

function validatePdSave() {
  if($("#first_name").val().trim() == ""){
    newAlert("danger", "First Name can not be empty.");
    $('html, body').animate({scrollTop: $("#first_name").offset().top - 100}, 1000);
    $("#first_name").focus();
    return false;
  }
  else if($("#last_name").val().trim() == ""){
    newAlert("danger", "Last Name can not be empty.");
    $('html, body').animate({scrollTop: $("#last_name").offset().top - 100}, 1000);
    $("#last_name").focus();
    return false;
  }
  else if($("#pdemail").val().trim() == "") {
    newAlert("danger", "Email can not be empty.");
    $('html, body').animate({scrollTop: $("#pdemail").offset().top - 100}, 1000);
    $("#pdemail").focus();
    return false;
  }
  else if (!email_filter.test($("#pdemail").val().trim())) {
    newAlert("danger", "Not a valid email address.");
    $('html, body').animate({scrollTop: $("#pdemail").offset().top - 100}, 1000);
    $("#pdemail").focus();
    return false;
  }
  else if ($("#pdemailalert").val().trim() == "") {
    newAlert("danger", "Alert Email can not be empty.");
    $('html, body').animate({scrollTop: $("#pdemailalert").offset().top - 100}, 1000);
    $("#pdemailalert").focus();
    return false;
  }
  else if (!email_filter.test($("#pdemailalert").val().trim())) {
    newAlert("danger", "Alert email address is not valid.");
    $('html, body').animate({scrollTop: $("#pdemailalert").offset().top - 100}, 1000);
    $("#pdemailalert").focus();
    return false;
  }
  else if ($("#pdphone").val().trim() == "") {
    newAlert("danger", "Phone can not be empty.");
    $('html, body').animate({scrollTop: $("#pdphone").offset().top - 100}, 1000);
    $("#pdphone").focus();
    return false;
  }
  else if ($("#pdphonealert").val().trim() == "") {
    newAlert("danger", "Alert phone can not be empty.");
    $('html, body').animate({scrollTop: $("#pdphonealert").offset().top - 100}, 1000);
    $("#pdphonealert").focus();
    return false;
  }
  else if (!phone_filter.test($("#pdphonealert").val().trim())) {
    newAlert("danger", "Alert phone number is not valid.");
    $('html, body').animate({scrollTop: $("#pdphonealert").offset().top - 100}, 1000);
    $("#pdphonealert").focus();
    return false;
  }
  else if ($("#pdspecialization").val() == "Select Specialization" && $("#pdspecializationatext").val().trim() == "") {
    newAlert("danger", "Specialization can not be empty.");
    $('html, body').animate({scrollTop: $("#pdspecialization").offset().top - 100}, 1000);
    $("#pdspecialization").focus();
    return false;
  }
  else if ($("#pdcity").val().trim() == "") {
    newAlert("danger", "City can not be empty.");
    $('html, body').animate({scrollTop: $("#pdcity").offset().top - 100}, 1000);
    $("#pdcity").focus();
    return false;
  }
  else if ($("#pdcity").val().trim().length < 2) {
    newAlert("danger", "Not a valid city.");
    $('html, body').animate({scrollTop: $("#pdcity").offset().top - 100}, 1000);
    $("#pdcity").focus();
    return false;
  }
  else if ($("#pdstate").val().trim() == "") {
    newAlert("danger", "State can not be empty.");
    $('html, body').animate({scrollTop: $("#pdstate").offset().top - 100}, 1000);
    $("#pdstate").focus();
    return false;
  }
  else if ($("#pdstate").val().trim().length < 2) {
    newAlert("danger", "Not a valid state.");
    $('html, body').animate({scrollTop: $("#pdstate").offset().top - 100}, 1000);
    $("#pdstate").focus();
    return false;
  }
  else if ($("#pdcountry").val().trim() == "") {
    newAlert("danger", "Country can not be empty.");
    $('html, body').animate({scrollTop: $("#pdcountry").offset().top - 100}, 1000);
    $("#pdcountry").focus();
    return false;
  }
  else if ($("#pdcountry").val().trim().length < 2) {
    newAlert("danger", "Not a valid country name.");
    $('html, body').animate({scrollTop: $("#pdcountry").offset().top - 100}, 1000);
    $("#pdcountry").focus();
    return false;
  }
  else if ($("#dhp_code").val().trim() == "") {
    newAlert("danger", "Dhp Code can not be empty.");
    $('html, body').animate({scrollTop: $("#dhp_code").offset().top - 100}, 1000);
    $("#dhp_code").focus();
    return false;
  }
  else if ($("#dhp_code").val().trim().length != 12) {
    newAlert("danger", "Not a valid DHP code.");
    $('html, body').animate({scrollTop: $("#dhp_code").offset().top - 100}, 1000);
    $("#dhp_code").focus();
    return false;
  }else if (!phone_filter.test($("#pdhospital_phone").val().trim()) && $("#pdhospital_phone").val().trim() != "") {
    newAlert("danger", "Please enter valid phone number.");
    $('html, body').animate({scrollTop: $("#pdhospital_phone").offset().top - 100}, 1000);
    $("#pdhospital_phone").focus();
    return false;
  }else if (!email_filter.test($("#pdhospital_email").val().trim()) && $("#pdhospital_email").val().trim() != "") {
    newAlert("danger", "Please enter valid email address.");
    $('html, body').animate({scrollTop: $("#pdhospital_email").offset().top - 100}, 1000);
    $("#pdhospital_email").focus();
    return false;
  }  
  else {
    return true; 
  }
}

function validateLabResultComments(){
  if($("#all_lab_results_options").val() == ""){
    newAlert("danger","No results are selected.Please select a Lab result first.")
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }else if($("#doctor_comment").val().trim() == ""){
    newAlert("danger","No comments are added.Please add comment first.")
    $('html, body').animate({scrollTop: $("#doctor_comment").offset().top - 100}, 1000);
    $("#doctor_comment").focus();
    return false;
  }else{
    return true;
  }
}

function validateSaveDocument(){
  if(validateDoctorAndPatientValueInAddDocument() && validateDocumentName() && validateDocumentUpload()){
    return true;
  }else{
    return false;
  }
}

function validateDoctorAndPatientValueInAddDocument(){
  if($("#d_patient_name").val().trim() == ""){
    newAlertForModal('danger', 'please enter Patient Name.', 'add_document_modal');
    $("#save_document").removeAttr("disabled");
    return false;
  }else if($("#d_doctor_name").val().trim() == ""){
    newAlertForModal('danger', 'please enter Doctor Name.', 'add_document_modal');
    $("#save_document").removeAttr("disabled");
    return false;
  }else{
    return true;
  }
}

function validateDocumentName(){
  var validate;
  $(".add-more-documents-parent").each(function(){
    if($(this).find(".d-name").val().trim() == ""){
      validate = true;
      newAlertForModal('danger', 'Please enter Document Name.', 'add_document_modal');
      $("#save_document").removeAttr("disabled");
      $(this).find(".d-name").focus();
      return validate;
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function validateDocumentUpload(){
  var validate;
  $(".add-more-documents-parent").each(function(){
    var file = $(this).find(".document-userfile").prop('files');
//    console.log(file[0]); 
    if (!file[0]) {
      newAlertForModal('danger', 'Please select the file first.', 'add_document_modal');
      $("#save_document").removeAttr("disabled");
      validate = true;
      return validate;
    }
    else {
      if (($(this).find(".d-type").val() == "Lab-Results" || $(this).find(".d-type").val() == "Imaging-Results") && (file[0].type.substring(0,5) != "image" && file[0].type != "application/pdf")) {
        validate = true;
        newAlertForModal('danger', 'You can select only pdf or image file with the given document type.', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
      else if (($(this).find(".d-type").val() == "Lab-Results" || $(this).find(".d-type").val() == "Imaging-Results") && Number(file[0].size) > 5242880) {
        validate = true;
        newAlertForModal('danger', 'Document File can not be larger than 5MB', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
      else if ($(this).find(".d-type").val() == "Video" && file[0].type != "video/mp4" && file[0].type != "video/mpeg" && file[0].type != "video/x-msvideo" && file[0].type != "video/quicktime" && file[0].type != "video/x-ms-wmv") {
        validate = true;
        newAlertForModal('danger', 'Not a valid file format. Please select a MP4 file.', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
      else if ($(this).find(".d-type").val() == "Video" && Number(file[0].size) > 157286400) {
        validate = true;
        newAlertForModal('danger', 'Video File can not be larger than 150MB', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
      else if ($(this).find(".d-type").val() == "Other" && (file[0].type.substring(0,5) != "image" && file[0].type != "application/pdf" && file[0].type != "application/vnd.ms-powerpoint" && file[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") && file[0].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && file[0].type != "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        validate = true;
        newAlertForModal('danger', 'Invalid file format for the selected document type.', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
      else if ($(this).find(".d-type").val() == "Other" && Number(file[0].size) > 5242880) {
        validate = true;
        newAlertForModal('danger', 'Document File can not be larger than 5MB', 'add_document_modal');
        $("#save_document").removeAttr("disabled");
        return validate;
      }
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function validateMiscDocuments(){
  if(validateMiscDocumentsDocumentName() && validateMiscDocumentsUpload()){
    return true;
  }else{
    return false;
  }
}

function validateMiscDocumentsDocumentName(){
  var validate;
  $(".misc-document-name").each(function(){
    if($(this).val().trim() == ""){
      validate = true;
      newAlertForModal('danger', 'please enter Document Name.', 'add_misc_document_modal');
      $("#misc_document_save").removeAttr("disabled");
      return validate;
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function validateMiscDocumentsUpload(){
  var validate;
  $(".add-more-misc-documents-parent").each(function(){
    var file = $(this).find(".misc-document-userfile").prop('files');
    if (!file[0]) {
      validate = true;
      newAlertForModal('danger', 'Please select the file first.', 'add_misc_document_modal');
      $("#misc_document_save").removeAttr("disabled");
      return validate;
    }
    else if (file[0].type.substring(0,5) != "image" && file[0].type != "application/pdf") {
      validate = true;
      newAlertForModal('danger', 'Selected file format is not supported.', 'add_misc_document_modal');
      $("#misc_document_save").removeAttr("disabled");
      return validate;
    }
    else if (Number(file[0].size) > 3145728) {
      validate = true;
      newAlertForModal('danger', 'File size can not be larger than 3MB', 'add_misc_document_modal');
      $("#misc_document_save").removeAttr("disabled"); 
      return validate;
    }
  });
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function validateInvoiceSettingPreview(){
  if($("#preview_image").attr("src") == "" && !($("#is_display_logo").prop("checked"))){
    newAlert("danger","No Logo uploaded.Please Upload a Logo First.");
    $('html, body').animate({scrollTop: $("#preview_image").offset().top - 100}, 1000);
    return false;
  }else if($("#invoice_address_val").val().trim() == ""){
    newAlert("danger","Please provide address.");
    $('html, body').animate({scrollTop: $("#invoice_address_val").offset().top - 100}, 1000);
    $("#invoice_address_val").focus();
    return false;
  }else if($("#invoice_sec_address_val").val().trim() == ""){
    newAlert("danger","Please provide secondary address.");
    $('html, body').animate({scrollTop: $("#invoice_sec_address_val").offset().top - 100}, 1000);
    $("#invoice_sec_address_val").focus();
    return false;
  }else if($("#invoice_address_states").val() == "select state"){
    newAlert("danger","Please select state.");
    $('html, body').animate({scrollTop: $("#invoice_address_states").offset().top - 100}, 1000);
    $("#invoice_address_states").focus();
    return false;
  }else if($("#invoice_address_city").val() == "select city"){
    newAlert("danger","Please select city.");
    $('html, body').animate({scrollTop: $("#invoice_address_city").offset().top - 100}, 1000);
    $("#invoice_address_city").focus();
    return false;
  }else if($("#invoice_address_zip").val().trim() == ""){
    newAlert("danger","Please select postal/zip code.");
    $('html, body').animate({scrollTop: $("#invoice_address_zip").offset().top - 100}, 1000);
    $("#invoice_address_zip").focus();
    return false;
  }else{
    return true;
  }
}

function validateAddInventoryDetails(){
  if($('#catid').val() == ''){
    $('#catid').focus();
    newAlertForModal('danger', 'Please enter Category.', 'add_cat_wiz');
    return false;
  }else if($('#product_name').val() == ''){
    $('#product_name').focus();
    newAlertForModal('danger', 'Please enter Product Name.', 'add_cat_wiz');
    return false;
  }else if($('#manf').val() == ''){
    $('#manf').focus();
    newAlertForModal('danger', 'Please enter Manufacture.', 'add_cat_wiz');
    return false;
  }else if($('#code').val() == ''){
    $('#code').focus();
    newAlertForModal('danger', 'Please enter Product code.', 'add_cat_wiz');
    return false;
  }else if($('#code').val().length > 8){
    $('#code').focus();
    newAlertForModal('danger', 'Code contain maximum 8 digit.', 'add_cat_wiz');
    return false;
  }else if($('#lot').val() == ''){  
    $('#lot').focus();
    newAlertForModal('danger', 'Please enter Product lot.', 'add_cat_wiz');
    return false;
  }else if($('#lot').val().length > 8){
    $('#lot').focus();
    newAlertForModal('danger', 'Lot number contain maximum 8 digit.', 'add_cat_wiz');
    return false;
  }else if($('#cost').val() == ''){
    $('#cost').focus();
    newAlertForModal('danger', 'Please enter Product cost.', 'add_cat_wiz');
    return false;
  }else if($('#price').val() == ''){
    $('#price').focus();
    newAlertForModal('danger', 'Please enter Product price.', 'add_cat_wiz');
    return false;
  }else if($('#qty_r').val() == ''){
    $('#qty_r').focus();
    newAlertForModal('danger', 'Please enter Product Ramining Quantity.', 'add_cat_wiz');
    return false;
  }else if($('#qty_t').val() == ''){
    $('#qty_t').focus();
    newAlertForModal('danger', 'Please enter Product Total Quantity.', 'add_cat_wiz');
    return false;
  }else if(Number($('#qty_t').val()) <= 0){
    $('#qty_t').focus();
    newAlertForModal('danger', 'Please enter Product Total Quantity is zero.', 'add_cat_wiz');
    return false;
  }
  else if($('#exp_date').val() == ''){
    $('#exp_date').focus();
    newAlertForModal('danger', 'Please enter Expiration Date.', 'add_cat_wiz');
    return false;
  }else if($('#status').val() == ''){
    $('#status').focus();
    newAlertForModal('danger', 'Please select Status.', 'add_cat_wiz');
    return false;
  }else if($('#date_add_inv').val() == ''){
    $('#date_add_inv').focus();
    newAlertForModal('danger', 'Please enter Date of Add in Inventory.', 'add_cat_wiz');
    return false;
  }else{
    return true;
  }
  $("#catvalid_fin").delay(4000).html('');
}

function validateEditInventoryDetails(x){
  if($(x.find(".edit_category_name")).val() == ''){
    newAlert("danger", "Please enter Category.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_name")).val() == ''){
    newAlert("danger", "Please enter product name.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_manufacture_name")).val() == ''){
    newAlert("danger", "Please enter manufacture.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_code")).val() == ''){
    newAlert("danger", "Please enter prodcut code.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_code")).val().length > 8){
    newAlert("danger", "Code contain maximum 8 digit.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_lot")).val() == ''){  
    newAlert("danger", "Please enter lot number.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_lot")).val().length > 8){
    newAlert("danger", "Lot number contain maximum 8 digit.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_cost")).val() == ''){
    newAlert("danger", "Please enter Product Cost.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_price")).val() == ''){
    newAlert("danger", "Please enter Product price.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_remaning_qty")).val() == ''){
    newAlert("danger", "Please enter Product Remaining Quantity..");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if(Number($(x.find(".edit_remaning_qty")).val()) > Number($(x.find(".edit_total_qty")).val())){
    newAlert("danger", "Remaining Quantity should not be more than Total Quantity..");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_total_qty")).val() == ''){
    newAlert("danger", "Please enter Product Total Quantity.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if(Number($(x.find(".edit_remaning_qty")).val()) <= 0 || Number($(x.find('#edit_total_qty')).val()) <= 0){
    newAlert("danger", "Quantity should not be negative or zero.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_expdate")).val() == ''){
    newAlert("danger", "Please enter Expiration Date.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_product_status")).val() == ''){
    newAlert("danger", "Please select Status.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else if($(x.find(".edit_date_add_inventory")).val() == ''){
    newAlert("danger", "Please enter Date of Add in Inventory.");
    $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}  

function validateConsultantAdd() {
  if($("#consultant_name").val() == ""){
    newAlert("danger","Please enter consultant name.");
    $('html, body').animate({scrollTop: $("#consultant_name").offset().top - 100}, 1000);
    return false;
  }else if($("#consultant_emailid").val() == ""){
    newAlert("danger","Please enter consultant's Email ID.");
    $('html, body').animate({scrollTop: $("#consultant_emailid").offset().top - 100}, 1000);
    return false;
  }else if($("#consultant_phone").val() == ""){
    newAlert("danger","Please enter consultant's Phone No.");
    $('html, body').animate({scrollTop: $("#consultant_phone").offset().top - 100}, 1000);
    return false;
  }else if(!email_filter.test($("#consultant_emailid").val().trim())){
    newAlert("danger","Please enter valid consultant's Email ID.");
    $('html, body').animate({scrollTop: $("#consultant_emailid").offset().top - 100}, 1000);
    return false;
  }else if (!phone_filter.test($("#consultant_phone").val().trim())) {
    newAlert("danger","Please enter valid consultant's Phone No.");
    $('html, body').animate({scrollTop: $("#consultant_phone").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  }
}

function validateNewMedicationForm(){
  if(validateMedicationDetails()) {
    return true;
  }else{
    return false;
  }
}

function validateMedicationDetails() {
  var validate;
  $(".medication_details_parent").each(function(){
    if($(this).find(".drug").val().trim() == "") {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".drug").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide Drug name.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide Drug name.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else if($(this).find(".desperse_form").val() == "" || $(this).find(".desperse_form").val() == null) {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".desperse_form").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide medication desperse form.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide medication desperse form.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else if($(this).find(".drug_strength").val() == "") {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".drug_strength").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide drug strength.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide drug strength.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else if($(this).find(".drug_unit").val() == "" || $(this).find(".drug_unit").val() == null) {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".drug_unit").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide drug unit.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide drug unit.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else if($(this).find(".drug_start_date").val() == "") {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".drug_start_date").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide drug start date.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide drug start date.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else if($(this).find(".drug_end_date").val() == "") {
      validate = false;
      $(this).parent().find('#'+$(this).attr("aria-labelledby")+'').trigger("click");
      $(this).find(".drug_end_date").focus();
      if($("#charting_link").hasClass("active")) {
        newAlertForModal('danger', 'Please provide drug end date.', 'add_medication_from_charting_modal');
        $('#add_medication_from_charting_modal').animate({scrollTop: 0}, 1000);
      }else {
        newAlert("danger","Please provide drug end date.");
        $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
      }
      return false;
    }else {
      validate = true;
    }
  });
  return validate; 
}

function validateStopMedication(){
  if($("#reason_for_stop_medication").val().trim() == ""){
    newAlertForModal('danger', 'Please enter Reason For stopping Medication Early.', 'delete_medication_modal');
    return false;
  }else{
    return true;
  }
}

function validateImmunizationRequiredField(){
  if($("#immunization_name").val() == "noselect"){
    newAlert("danger","Please select Immunization name.");
    $('html, body').animate({scrollTop: $("#immunization_name").offset().top - 100}, 1000);
    return false;
  }else if($("#dose_number").val() == "0" && !(isNaN($("#dose_number").val()))){
    newAlert("danger","Please add dose number.");
    $('html, body').animate({scrollTop: $("#dose_number").offset().top - 100}, 1000);
    return false;
  }else{
    return true;
  } 
}

function validateDoseDetails(){
  var validate;
  $(".immunization-dose-row").each(function(){
    if($(this).find(".min-age-value").val().trim() == "" || $(this).find(".min-age-value").val().trim() == "0"){
      validate = false;
      newAlert("danger","Please add Minimum Age value in Dose Detail.");
      return false;
    }else if($(this).find(".max-age-value").val().trim() == "" || $(this).find(".max-age-value").val().trim() == "0"){
      validate = false;
      newAlert("danger","Please add Maximum Age value in Dose Detail.");
      return false;
    }/*else if($(this).find(".dose-interval-value").val().trim() == "" || $(this).find(".dose-interval-value").val().trim() == "0"){
      validate = false;
      newAlert("danger","Please add dose interval value in Dose Detail.");
      return false;
    }*/else{
      validate = true;
    }
  });
  return validate;
}

function validateImmunizationSetting(){
  if(validateImmunizationRequiredField() && validateDoseDetails()){
    return true
  }else{
    return false;
  }
}

function validateSaveLabDocument(){
  if($('#la_lab_name').val() == ""){
    newAlert("danger","Please enter Lab/Imaging Name.");
    return false;
  }else if($('#la_city').val() == ""){
    newAlert("danger","Please enter city.");
    return false;
  }else if($('#la_contact_person_name').val() == ""){
    newAlert("danger","Please enter contact person name.");
    return false;
  }else if($('#la_contact_person_email').val() == ""){
    newAlert("danger","Please enter contact person email.");
    return false;
  }else if(!email_filter.test($("#la_contact_person_email").val().trim())){
    newAlert("danger","Email id is not valid.");
    return false;
  }else if($('#la_contact_person_phone').val() == ""){
    newAlert("danger","Please enter contact person phone.");
    return false;
  }else if(!phone_filter.test($("#la_contact_person_phone").val().trim())){
    newAlert("danger","Phone number is not valid.");
    return false;
  }else if($("#la_services").val().trim() == ""){
    newAlert("danger","Please enter services.");
    return false;
  }else{
    return true;
  }
}

function validateAlertConfiguration(){
  if($("#health_alert_name").val().trim() == ""){
    newAlertForModal('danger', 'Please enter Alert Name.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_name").focus();
    return false;
  }else if($("#health_alert_type").val() == "noselect"){
    newAlertForModal('danger', 'Please Select Alert Type.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_type").focus();
    return false;
  }else if($("#health_alert_gender").val() == "noselect"){
    newAlertForModal('danger', 'Please Select Gender.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_gender").focus();
    return false;
  }else if($("#health_alert_min_age").val().trim() == ""){
    newAlertForModal('danger', 'Please Select Min Age.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_min_age").focus();
    return false;
  }else if($("#health_alert_min_age_choice").val() == "noselect"){
    newAlertForModal('danger', 'Please Select Min Age.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_min_age_choice").focus();
    return false;
  }else if($("#health_alert_max_age").val().trim() == ""){
    newAlertForModal('danger', 'Please Select Max Age.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_max_age").focus();
    return false;
  }else if($("#health_alert_max_age_choice").val() == "noselect"){
    newAlertForModal('danger', 'Please Select Max Age.', 'add_health_alerts_modal');
    $("#save_health_alerts_configuration").removeAttr("disabled");
    $('#add_health_alerts_modal').animate({scrollTop: 0}, 'slow');
    $("#health_alert_max_age_choice").focus();
    return false;
  }else{
    return true;
  }
}

function validateNewTask(){
  if($("#task_type").val() == "noselect"){
    newAlertForModal('danger', 'Please Select Task Type.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_type").focus();
    return false;
  }else if($("#task_effective_date").val() == ""){
    newAlertForModal('danger', 'Please Select Effective Date.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_effective_date").focus();
    return false;
  }else if($("#task_assignee").val() == ""){
    newAlertForModal('danger', 'Please Select Task Assignee.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_assignee").focus();
    return false;
  }else if($("#task_due_date").val() == ""){
    newAlertForModal('danger', 'Please Select Due Date.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_due_date").focus();
    return false;
  }else if($("#task_patient").val() == ""){
    newAlertForModal('danger', 'Please Select Patient.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_patient").focus();
    return false;
  }else if(pd_data._id == $("#task_assignee").data("doctor_id") && $("#task_status").val() == "Reassign"){
    newAlertForModal('danger', 'A task can not be reassign to self.', 'add_new_task_modal');
    $("#save_new_task").removeAttr("disabled");
    $('#add_new_task_modal').animate({scrollTop: 0}, 'slow');
    $("#task_assignee").focus();
    return false;
  }else{
    return true;
  }
}

function validateSavePatientTask(){
  if($(".task_patient_checkbox:checked").length == 0){
    newAlertForModal('danger', 'Please add at least one Task.', 'add_patient_task_modal');
    $("#save_patient_add_task").removeAttr("disabled");
    $('#add_patient_task_modal').animate({scrollTop: 0}, 'slow');
    return false;
  }else{
    return true;
  }
}

function validateTaskManagerSetting(){
  if($("#task_manager_autoremove_request").val().trim() == ""){
    newAlert("danger","Please provide duration for request autoremoval.");
    $("#task_manager_autoremove_request").focus();
    return false;
  }else{
    return true;
  }
}

function validateAppointmentFromFrontDesk(){
  if(validateFieldsForFrontDeskForm() && requiredFieldValidatorForAppointment() && validateStartEndTimeAtFrontDeskAppointment()){
    return true;
  }else{
    return false;
  }
}

function requiredFieldValidatorForAppointment() {
  if($("#fd_appointment_date").val().trim() == ""){
    newAlert("danger","Please provide appointment date.");
    $("html, body").animate({scrollTop: $("#fd_appointment_date").offset().top - 100},'slow');
    $("#fd_appointment_date").focus();
    return false;
  }else if($("#fd_reminder_note").val().trim() == ""){
    newAlert("danger","Please provide reminder note for Appointment.");
    $("html, body").animate({scrollTop: $("#fd_reminder_note").offset().top - 100},'slow');
    $("#fd_reminder_note").focus();
    return false;
  }else {
    return true;
  }
}

function validateFieldsForFrontDeskForm() {
  if($("#fd_appointment_physician_list").val().trim() == ""){
    newAlert("danger","Please provide doctor name.");
    $("html, body").animate({scrollTop: $("#fd_appointment_physician_list").offset().top - 100},'slow');
    $("#fd_appointment_physician_list").focus();
    return false;
  }else if(!$("#fd_new_patient").prop("checked") && $("#fd_appointment_patient_list").val().trim() == ""){
    newAlert("danger","Please provide patient name.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_list").offset().top - 100},'slow');
    $("#fd_appointment_patient_list").focus();
    return false;
  }else if($("#fd_new_patient").prop("checked") && $("#fd_appointment_patient_first_name").val().trim() == ""){
    newAlert("danger","Please provide patient first name.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_first_name").offset().top - 100},'slow');
    $("#fd_appointment_patient_first_name").focus();
    return false;
  }else if($("#fd_new_patient").prop("checked") && $("#fd_appointment_patient_last_name").val().trim() == ""){
    newAlert("danger","Please provide patient last name.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_last_name").offset().top - 100},'slow');
    $("#fd_appointment_patient_last_name").focus();
    return false;
  }else if($("#fd_appointment_patient_email").val().trim() == ""){
    newAlert("danger","Please provide patient email.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_email").offset().top - 100},'slow');
    $("#fd_appointment_patient_email").focus();
    return false;
  }else if($("#fd_appointment_patient_phone").val().trim() == ""){
    newAlert("danger","Please provide patient phone.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_phone").offset().top - 100},'slow');
    $("#fd_appointment_patient_phone").focus();
    return false;
  }else if(!email_filter.test($("#fd_appointment_patient_email").val().trim())){
    newAlert("danger","Please provide valid patient email.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_email").offset().top - 100},'slow');
    $("#fd_appointment_patient_email").focus();
    return false;
  }else if(!phone_filter.test($("#fd_appointment_patient_phone").val().trim())){
    newAlert("danger","Please provide valid patient phone.");
    $("html, body").animate({scrollTop: $("#fd_appointment_patient_phone").offset().top - 100},'slow');
    $("#fd_appointment_patient_phone").focus();
    return false;
  }else{
    return true;
  }
}

function validateAppointmentPatient() {
  if($("#fd_appointment_patient_first_name").val().trim() == ""){
    newAlert("danger","Please provide patient first name.");
    $("#fd_appointment_patient_first_name").focus();
    return false;
  }else if($("#fd_appointment_patient_last_name").val().trim() == ""){
    newAlert("danger","Please provide patient last name.");
    $("#fd_appointment_patient_last_name").focus();
    return false;
  }else if($("#fd_appointment_physician_list").val().trim() == ""){
    newAlert("danger","Please provide doctor name.");
    $("#fd_appointment_physician_list").focus();
    return false;
  }else if($("#fd_appointment_patient_email").val().trim() == ""){
    newAlert("danger","Please provide patient email.");
    $("#fd_appointment_patient_email").focus();
    return false;
  }else if($("#fd_appointment_patient_phone").val().trim() == ""){
    newAlert("danger","Please provide patient phone.");
    $("#fd_appointment_patient_phone").focus();
    return false;
  }else if(!email_filter.test($("#fd_appointment_patient_email").val().trim())){
    newAlert("danger","Please provide valid patient email.");
    $("#fd_appointment_patient_email").focus();
    return false;
  }else if(!phone_filter.test($("#fd_appointment_patient_phone").val().trim())){
    newAlert("danger","Please provide valid patient phone.");
    $("#fd_appointment_patient_phone").focus();
    return false;
  }else{
    return true;
  }
}

function validateStartEndTimeAtFrontDeskAppointment() {
  var tdate1 = moment($("#fd_appointment_date").val());
  var tdate2 = moment($("#fd_appointment_date").val());
  var tdate3 = moment();
  tdate1.set('hour',$("#fd_start_time_hour").val());
  tdate1.set('minute',$("#fd_start_time_minute").val());

  tdate2.set('hour',$("#fd_end_time_hour").val());
  tdate2.set('minute',$("#fd_end_time_minute").val());
  tdate3.set('second',00);
  if(tdate3 > tdate1) {
    newAlert("danger","Not Allow to Make Appointment in Past. Please choose Different Date/Time.");
    $("html, body").animate({scrollTop: $("#fd_start_time_hour").offset().top - 100},'slow');
    $("#fd_start_time_hour").focus();
    return false;
  }else if(tdate1 >= tdate2){
    newAlert("danger","Start Date can not be same or greater than end date.");
    $("html, body").animate({scrollTop: $("#fd_start_time_hour").offset().top - 100},'slow');
    $("#fd_start_time_hour").focus();
    return false;
  }else{
    return true;
  }
}

function validatePatientReferral(){
  if($("#referral_doctor").val().trim() == ""){
    newAlert("danger","Please provide Doctor Name.");
    $("html, body").animate({scrollTop: $("#referral_doctor").offset().top - 100},'slow');
    $("#referral_doctor").focus();
    return false;
  }else if($("#referral_introduction").val().trim() == ""){
    newAlert("danger","Introduction content can not be empty.");
    $("html, body").animate({scrollTop: $("#referral_introduction").offset().top - 100},'slow');
    $("#referral_introduction").focus();
    return false;
  }else if($("#referral_conclusion").val().trim() == ""){
    newAlert("danger","Conclusion can not be empty.");
    $("html, body").animate({scrollTop: $("#referral_conclusion").offset().top - 100},'slow');
    $("#referral_conclusion").focus();
    return false;
  }else if($("#referral_sincerly").val().trim() == ""){
    newAlert("danger","Please provide your signature/Name.");
    $("html, body").animate({scrollTop: $("#referral_sincerly").offset().top - 100},'slow');
    $("#referral_sincerly").focus();
    return false;
  }else{
    return true;
  } 
}

function validateSaveLabOrder(){
  if($("#lo_order_number").val().trim() == ""){
    newAlert("danger","Please provide order Name.");
    $("html, body").animate({scrollTop: $("#lo_order_number").offset().top - 100},'slow');
    $("#lo_order_number").focus();
    return false;
  }else if($("#lo_type").val().trim() == "Select Order" || $("#lo_type").val().trim() == ""){
    newAlert("danger","Please Select Type.");
    $("html, body").animate({scrollTop: $("#lo_type").offset().top - 100},'slow');
    $("#lo_type").focus();
    return false;
  }else if($("#lo_referred_by").val().trim() == ""){
    newAlert("danger","Please provide referred doctor name.");
    $("html, body").animate({scrollTop: $("#lo_referred_by").offset().top - 100},'slow');
    $("#lo_referred_by").focus();
    return false;
  }else if($("#lo_date").val().trim() == ""){
    newAlert("danger","Please Select Date.");
    $("html, body").animate({scrollTop: $("#lo_date").offset().top - 100},'slow');
    $("#lo_date").focus();
    return false;
  }else if($("#lo_patient_name").val().trim() == ""){
    newAlert("danger","Please provide pateint name.");
    $("html, body").animate({scrollTop: $("#lo_patient_name").offset().top - 100},'slow');
    $("#lo_patient_name").focus();
    return false;
  }else if($("#lo_patient_dhp_id").val().trim() == ""){
    newAlert("danger","Please provide patient dhp id.");
    $("html, body").animate({scrollTop: $("#lo_patient_dhp_id").offset().top - 100},'slow');
    $("#lo_patient_dhp_id").focus();
    return false;
  }else if($("#lo_age").val().trim() == ""){
    newAlert("danger","Please provide patient age.");
    $("html, body").animate({scrollTop: $("#lo_age").offset().top - 100},'slow');
    $("#lo_age").focus();
    return false;
  }else if($("#lo_gender").val().trim() == ""){
    newAlert("danger","Please select patient gender.");
    $("html, body").animate({scrollTop: $("#lo_gender").offset().top - 100},'slow');
    $("#lo_gender").focus();
    return false;
  }else if($("#lo_laboratory").val().trim() == ""){
    newAlert("danger","Please select Laboratory.");
    $("html, body").animate({scrollTop: $("#lo_laboratory").offset().top - 100},'slow');
    $("#lo_laboratory").focus();
    return false;
  }else if(!$("#lo_tests").val()){
    newAlert("danger","Please select atleast  one Test.");
    $("html, body").animate({scrollTop: $("#lo_tests").offset().top - 100},'slow');
    $("#lo_tests").focus();
    return false;
  }else{
    return true;
  }  
}

function validateMetabolicRiskCalculator(){
  if($("#waist_mets").val().trim() == ""){
    newAlert("danger","Waist value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#waist_mets").offset().top - 100},'slow');
    $("#waist_mets").focus();
    return false;
  }else if($("#triglyceride_mets").val().trim() == ""){
    newAlert("danger","Triglyceride value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#triglyceride_mets").offset().top - 100},'slow');
    $("#triglyceride_mets").focus();
    return false;
  }else if($("#hdl_cholesterol_mets").val().trim() == ""){
    newAlert("danger","HDL cholesterol value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#hdl_cholesterol_mets").offset().top - 100},'slow');
    $("#hdl_cholesterol_mets").focus();
    return false;
  }else if($("#bp_systolic_mets").val().trim() == ""){
    newAlert("danger","Systolic BP value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#bp_systolic_mets").offset().top - 100},'slow');
    $("#bp_systolic_mets").focus();
    return false;
  }else if($("#bp_diastolic_mets").val().trim() == ""){
    newAlert("danger","Diastolic BP value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#bp_diastolic_mets").offset().top - 100},'slow');
    $("#bp_diastolic_mets").focus();
    return false;
  }else if($("#fasting_glucose_mets").val().trim() == "" && $("#two_hr_post_glucose").val().trim() == "" && $("#diabetic_condition").val() == "Select"){
    newAlert("danger","Either Fasting Glucose Or 2hr Post Glucose Or diabetic condition is required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#fasting_glucose_mets").offset().top - 100},'slow');
    $("#fasting_glucose_mets").focus();
    return false;
  }else if(isNaN($("#age_mets").val().trim())){
    newAlert("danger","Please provide valid Age value.");
    $("html, body").animate({scrollTop: $("#age_mets").offset().top - 100},'slow');
    $("#age_mets").focus();
    return false;
  }else{
    return true;
  }
}

function validateCVDRiskCalculator(){
  if($("#total_cholesterol_cvd").val().trim() == ""){
    newAlert("danger","Total cholesterol value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#total_cholesterol_cvd").offset().top - 100},'slow');
    $("#total_cholesterol_cvd").focus();
    return false;
  }else if($("#age_cvd").val().trim() == ""){
    newAlert("danger","age value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#age_cvd").offset().top - 100},'slow');
    $("#age_cvd").focus();
    return false;
  }else if(isNaN($("#age_cvd").val().trim())){
    newAlert("danger","Please provide valid Age value.");
    $("html, body").animate({scrollTop: $("#age_cvd").offset().top - 100},'slow');
    $("#age_cvd").focus();
    return false;
  }else if($("#hdl_cholesterol_cvd").val().trim() == ""){
    newAlert("danger","HDL cholesterol value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#hdl_cholesterol_cvd").offset().top - 100},'slow');
    $("#hdl_cholesterol_cvd").focus();
    return false;
  }else if($("#smoking_cvd").val().trim() == ""){
    newAlert("danger","Smoking value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#smoking_cvd").offset().top - 100},'slow');
    $("#smoking_cvd").focus();
    return false;
  }else if($("#systolic_bp_cvd").val().trim() == ""){
    newAlert("danger","Systolic BP value required to calculate Risk Score.");
    $("html, body").animate({scrollTop: $("#systolic_bp_cvd").offset().top - 100},'slow');
    $("#systolic_bp_cvd").focus();
    return false;
  }else{
    return true;
  }
}

function validateAppointment(){
  if($("#reminder_note").val().trim() == ""){
    newAlert("danger","Reminder Note is required to add Appointment");
    $("#reminder_note").focus();
    return false;
  }else{
    return true;
  }
}

function validateNewMarkerDetails(){
  if($("#new_marker_name").val().trim() == ""){
    newAlertForModal('danger', 'Please provide marker label.', 'add_new_marker_modal');
    $("#save_new_marker").removeAttr("disabled");
    $('#add_new_marker_modal').animate({scrollTop: 0}, 'slow');
    return false;
  }else if($("#new_marker_image").val().trim() == "Select Image"){
    newAlertForModal('danger', 'Please select marker image.', 'add_new_marker_modal');
    $("#save_new_marker").removeAttr("disabled");
    $('#add_new_marker_modal').animate({scrollTop: 0}, 'slow');
    return false;
  }else if($("#new_marker_mouser").val().trim() == "Select Mouser"){
    newAlertForModal('danger', 'Please select marker mouser.', 'add_new_marker_modal');
    $("#save_new_marker").removeAttr("disabled");
    $('#add_new_marker_modal').animate({scrollTop: 0}, 'slow');
    return false;
  }else{
    return true;
  }
}

function validateChartingTemplateImage() {
  if($("#charting_template_image_specialization").val() == "Select Specialization" && $("#charting_template_image_specialization_by_text").val().trim() == ""){
    newAlertForModal('danger', 'Please provide Specialization.', 'add_charting_template_images_modal');
    $("#charting_template_image_specialization").focus();
    return false;
  }else if($("#charting_template_image_name").val().trim() == ""){
    newAlertForModal('danger', 'Please provide Image Name.', 'add_charting_template_images_modal');
    $("#charting_template_image_name").focus();
    return false;
  }
  // else if($("#charting_template_image_width").val().trim() == ""){
  //   newAlertForModal('danger', 'Please select Image.', 'add_charting_template_images_modal');
  //   $("#charting_template_image_width").focus();
  //   return false;
  // }else if($("#charting_template_image_height").val().trim() == ""){
  //   newAlertForModal('danger', 'Please provide Image Height.', 'add_charting_template_images_modal');
  //   $("#charting_template_image_height").focus();
  //   return false;
  // }
  else if($("#charting_template_image_file").val() == "" && $("#charting_template_image_file").data("img-data") == ""){
    newAlertForModal('danger', 'Please Choose Image File.', 'add_charting_template_images_modal');
    $("#charting_template_image_name").focus();
    return false;
  }else{
    return true;
  }
}

function validateImageFile(obj) {
  var file = $(obj).prop("files");
  if(file[0].type.substring(0,5) != "image" && file[0].type != "application/pdf") {
    $(obj).val("");
    newAlertForModal('danger', 'Please choose a Image Files Only.', 'add_charting_template_images_modal');
    return false;
  }else if(Number(file[0].size) > 10485760) {
    $(obj).val("");
    newAlertForModal('danger', 'Uploaded File Size can not be greater than 10 MB.', 'add_charting_template_images_modal');
    return false;
  }else {
    return true;
  }
}  

function patientUpdateValidation(){
  if(requiredInfoPatient() && validatePhoneNumber("edit_patient_phone") && validatePhoneNumber("edit_patient_emergency_phone") && verifyEmail("edit_patient_emailid")){
    return true;
  }else{
    return false;
  }
}

function requiredInfoPatient(){
  if($("#edit_patient_name").val().trim() == ""){
    newAlert("danger", "First Name and Last Name can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_name").offset().top - 100}, 1000);
    $("#edit_patient_name").focus();
    return false;
  }else if($("#edit_patient_emailid").val().trim() == ""){
    newAlert("danger", "Email Id can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_emailid").offset().top - 100}, 1000);
    $("#edit_patient_emailid").focus();
    return false;
  }else if($("#issu_date_of_birth").val().trim() == "" && $("#issu_age").val().trim() == ""){
    newAlert("danger", "Date Of Birth or Age can not be empty.");
    $('html, body').animate({scrollTop: $("#issu_date_of_birth").offset().top - 100}, 1000);
    $("#isu_date_of_birth").focus();
    return false;
  }else if(!$("#edit_patient_gender").val() || $("#edit_patient_gender").val().trim() == "Select Gender"){
    newAlert("danger", "Gender can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_gender").offset().top - 100}, 1000);
    $("#edit_patient_gender").focus();
    return false;
  }else if($("#edit_patient_height").val().trim() == ""){
    newAlert("danger", "Height can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_height").offset().top - 100}, 1000);
    $("#edit_patient_height").focus();
    return false;
  }else if($("#edit_patient_weight").val().trim() == ""){
    newAlert("danger", "Weight can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_weight").offset().top - 100}, 1000);
    $("#edit_patient_weight").focus();
    return false;
  }else if($("#edit_patient_emergency_name").val().trim() == ""){
    newAlert("danger", "Emergency Name can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_emergency_name").offset().top - 100}, 1000);
    $("#edit_patient_emergency_name").focus();
    return false;
  }else if($("#edit_patient_emergency_phone").val().trim() == ""){
    newAlert("danger", "Emergency phone number can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_emergency_phone").offset().top - 100}, 1000);
    $("#edit_patient_emergency_phone").focus();
    return false;
  }else if($("#edit_patient_emergency_relation").val().trim() == ""){
    newAlert("danger", "Emergency relation field can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_emergency_relation").offset().top - 100}, 1000);
    $("#edit_patient_emergency_relation").focus();
    return false;
  }else if($("#edit_patient_address1").val().trim() == ""){
    newAlert("danger", "Address should not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_address1").offset().top - 100}, 1000);
    $("#edit_patient_address1").focus();
    return false;
  }else if($("#edit_patient_pincode").val().trim() == ""){
    newAlert("danger", "Pincode should not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_pincode").offset().top - 100}, 1000);
    $("#edit_patient_pincode").focus();
    return false;
  }else if($("#edit_patient_country").val().trim() == ""){
    newAlert("danger", "Country Name can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_country").offset().top - 100}, 1000);
    $("#edit_patient_country").focus();
    return false;
  }else if(!$("#edit_patient_state").val() || $("#edit_patient_state").val().trim() == "Select State"){
    newAlert("danger", "State Name can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_state").offset().top - 100}, 1000);
    $("#edit_patient_state").focus();
    return false;
  }else if($(!$("#edit_patient_state").val() || "#edit_patient_city").val().trim() == "Select city"){
    newAlert("danger", "City Name can not be empty.");
    $('html, body').animate({scrollTop: $("#edit_patient_city").offset().top - 100}, 1000);
    $("#edit_patient_city").focus();
    return false;
  }else{
    return true;
  }
}

function validatioOnAllergies() {
  var validate;
  $(".add-allergies").each(function(){
    if($(this).find(".add_padf_item_allergies").val().trim() == "Select Allergies" || $(this).find(".add_padf_item_allergies").val().trim() == ""){
      newAlertForModal("danger", "Allergies can not be empty.",'add_padf_modal');
      $(this).find(".add_padf_item_allergies").focus();
      validate = false;
      return validate;
    }else if($(this).find(".add_padf_item_severity").val().trim() == "Select Severe" || $(this).find(".add_padf_item_severity").val().trim() == ""){
      newAlertForModal("danger", "Severe can not be empty.",'add_padf_modal');
      $(this).find(".add_padf_item_severity").focus();
      validate = false;
      return validate;
    }else if($(this).find(".add_padf_item_reaction").val().trim() == "Select Reaction" || $(this).find(".add_padf_item_reaction").val().trim() == ""){
      newAlertForModal("danger", "Reaction can not be empty.",'add_padf_modal');
      $(this).find(".add_padf_item_reaction").focus();
      validate = false;
      return validate;
    }else{
      validate = true;
    }
  });
return validate;
}

// function validatioInAllergies() {
//   var validate;
//   $(".save-allergies").each( function(){
//     if($(this).find(".issu_name_allergies").val().trim() == "Select Allergies" || $(this).find(".issu_name_allergies").val().trim() == ""){
//       validate = false;
//       newAlert("danger", "Allergies can not be empty.");
//       $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
//       $(this).find(".issu_name_allergies").focus();
//       return validate;
//     }else if($(this).find(".issu_name_severe").val().trim() == "Select Severe" || $(this).find(".issu_name_severe").val().trim() == ""){
//       validate = false;
//       newAlert("danger", "Severe can not be empty.");
//       $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
//       $(this).find(".issu_name_severe").focus();
//       return validate;
//     }else if($(this).find(".issu_name_reaction").val().trim() == "Select Reaction" || $(this).find(".issu_name_reaction").val().trim() == ""){
//       validate = false;
//       newAlert("danger", "Reaction can not be empty.");
//       $('html, body').animate({scrollTop: $(this).offset().top - 100}, 1000);
//       $(this).find(".issu_name_reaction").focus();
//       return validate;
//     }else{
//       validate = true;
//     }
//   });
// return validate;
// }

function validatePatientUploadFiles() {
  if($("#upload_patient_files").data("source") == "computer") {
    if($("#patient_uploaded_file").val() == "" || $("#patient_uploaded_file").data("img-data") == "") {
      newAlertForModal('danger', 'Please choose a file to upload.', 'upload_files_modal');
      return false;
    }
  }else if($("#upload_patient_files").data("source") == "webcam") {
    if($("#upload_file_camera").find("canvas").length == 0) {
      newAlertForModal('danger', 'Please capture a photo from webcam to upload.', 'upload_files_modal');
      return false;  
    }
  }

  if($("#patient_upload_file_preference").val() == "Patient Reports") {
    if($("#upload_document_name").val() == "") {
      newAlertForModal('danger', 'Please provide Patient Reports name.', 'upload_files_modal');
      return false;  
    }else if($("#upload_document_due_date").val() == "") {
      newAlertForModal('danger', 'Please provide Due Date for task w.r.t to uploaded file.', 'upload_files_modal');
      return false;  
    }else if($("#upload_document_effective_date").val() == "") {
      newAlertForModal('danger', 'Please provide Effective Date for task w.r.t to uploaded file.', 'upload_files_modal');
      return false;  
    }
  }

  if($("#patient_upload_file_preference").val() == "Select") {
    newAlertForModal('danger', 'Please choose document preference.', 'upload_files_modal');
    return false;
  }
  return true;
}

function validateNewLocation() {
  if($("#location_primary_address").val().trim() == ""){
    newAlert("danger", "Primary Address can not be empty.");
    $('html, body').animate({scrollTop: $("#location_primary_address").offset().top - 100}, 1000);
    $("#location_primary_address").focus();
    return false;
  }else if($("#location_state").val().trim() == "select state"){
    newAlert("danger", "Location State can not be empty.");
    $('html, body').animate({scrollTop: $("#location_state").offset().top - 100}, 1000);
    $("#location_state").focus();
    return false;
  }else if($("#location_city").val().trim() == "select city"){
    newAlert("danger", "Location City can not be empty.");
    $('html, body').animate({scrollTop: $("#location_city").offset().top - 100}, 1000);
    $("#location_city").focus();
    return false;
  }else if($("#location_pincode").val().trim() == ""){
    newAlert("danger", "Pincode can not be empty.");
    $('html, body').animate({scrollTop: $("#location_pincode").offset().top - 100}, 1000);
    $("#location_pincode").focus();
    return false;
  }else if($("#location_email").val().trim() == ""){
    newAlert("danger", "Email ID can not be empty.");
    $('html, body').animate({scrollTop: $("#location_email").offset().top - 100}, 1000);
    $("#location_email").focus();
    return false;
  }else if($("#location_phone").val().trim() == ""){
    newAlert("danger", "Phone number can not be empty.");
    $('html, body').animate({scrollTop: $("#location_phone").offset().top - 100}, 1000);
    $("#location_phone").focus();
    return false;
  }else if(!email_filter.test($("#location_email").val())){
    newAlert("danger", "Please enter valid Email ID.");
    $('html, body').animate({scrollTop: $("#location_email").offset().top - 100}, 1000);
    $("#location_email").focus();
    return false;
  }else if(!phone_filter.test($("#location_phone").val())){
    newAlert("danger", "Please enter Valid Phone number.");
    $('html, body').animate({scrollTop: $("#location_phone").offset().top - 100}, 1000);
    $("#location_phone").focus();
    return false;
  }else{
    return true;
  }
}

function validationOnSaveCarePlan(){
  var validate;
  var checked = "";
  var return_false = "";
  if (!$("#cp_startdate").val()) {
    newAlert('danger', "Please select valid start and end date.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    validate = false;
    return validate;
  }
  $(".care-plan-section-rows").each(function(){
    if(checked == "wrong"){
      console.log("tejsa");
      validate = false;
      checked == "";
      return_false = "test";
      return validate;
    }
    if($(this).find(".care-plan-field-rows").find(".careplan-response-format-values").find(".cp_select_time").html()){
      $(this).find(".care-plan-field-rows").each(function(){
        if(checked == "wrong"){
          console.log("tejsa");
          validate = false;
          checked == "";
          return_false = "test";
          return validate;
        }
        if($(this).find(".cmn_chk").prop("checked")){
          var $ele = $(this).find(".careplan-response-format-values");
          if($ele.find(".cp_select_time").val() == "select time"){
            validate = false;
            checked = "wrong";
            newAlert('danger', "Please select time val.");
            $ele.find(".cp_select_time").focus();
            return false;
          }else if(!$ele.find(".cp-startdate").val()){
            validate = false;
            checked = "wrong";
            newAlert('danger', "Please select valid start date.");
            $ele.find(".cp-startdate").focus();
            return false;
          }else if(!$ele.find(".cp-enddate").val()){
            validate = false;
            checked = "wrong";
            newAlert('danger', "Please select valid end date.");
            $ele.find(".cp-enddate").focus();
            return false;
          }else{
            checked = "";
            validate = true;
          }
        }else{
          return_false = "";
          validate = true;
        }
      });
    }else{
      return_false == "true";
      validate = true;
    }
  });
  if(return_false == "test"){
    validate = false;
    return validate;
  }
 return validate;
}

function validatePatientImmunizationRecord() {
  if($("#patient_immunization_name").val().trim() == ""){
    newAlert("danger", "Vaccination Name can not be empty.");
    $('html, body').animate({scrollTop: $("#patient_immunization_name").offset().top - 100}, 1000);
    $("#patient_immunization_name").focus();
    return false;
  }else if($("#immunization_dose").val().trim() == ""){
    newAlert("danger", "Dose Details can not be empty.");
    $('html, body').animate({scrollTop: $("#immunization_dose").offset().top - 100}, 1000);
    $("#immunization_dose").focus();
    return false;
  }else if($("#immunization_injected_on").val().trim() == ""){
    newAlert("danger", "Vaccination Injected date can not be empty.");
    $('html, body').animate({scrollTop: $("#immunization_injected_on").offset().top - 100}, 1000);
    $("#immunization_injected_on").focus();
    return false;
  }else if($("#immunization_injected_by").val().trim() == ""){
    newAlert("danger", "Please select Doctor name who injected Vaccination.");
    $('html, body').animate({scrollTop: $("#immunization_injected_by").offset().top - 100}, 1000);
    $("#immunization_injected_by").focus();
    return false;
  }else{
    return true;
  }
}

function validationSaveFavouriteMedication(){
  var validate;
  $(".medication_add_section").each(function(){
    if($(this).find(".medication_name").val().trim() == ""){
      newAlertForModal('danger', 'Please provide Medication name.', 'add_favourite_medication_modal');
      $(this).find(".medication_name").focus();
      validate = false; 
      return false; 
    }else if($(this).find(".medication_disperse").val() == "Select" || $(this).find(".medication_disperse").val() == ""){
      newAlertForModal('danger', 'Please select Dispered form name.', 'add_favourite_medication_modal');
      $(this).find(".medication_disperse").focus();
      validate = false; 
      return false;
    }else if($(this).find(".medication_doce").val().trim() == ""){
      newAlertForModal('danger', 'Please provide Medication doce.', 'add_favourite_medication_modal');
      $(this).find(".medication_doce").focus();
      return false;
    }else if($(this).find(".medication_unit").val() == "Select" || $(this).find(".medication_unit").val() == ""){
      newAlertForModal('danger', 'Please provide Medication unit.', 'add_favourite_medication_modal');
      $(this).find(".medication_unit").focus();
      validate = false; 
      return false;
    }else{
      validate = true; 
      return true;
    }
  });
  if(validate){
    return true;
  }else{
    return false;
  }
}

function validateSectionInput() {
  if($("#current_sections").val() == "" && $("#new_section_val").val().trim() == "") {
    newAlert("danger","Please choose a section name");
    $('html, body').animate({scrollTop: $("#new_section_val").offset().top - 100}, 1000);
    return false;
  }else if($("#tokenfield").tokenfield("getTokens").length == 0) {
    newAlert("danger","Please enter atleast one field name.");
    $('html, body').animate({scrollTop: $("#tokenfield").offset().top - 100}, 1000);
    $("#tokenfield").focus();
    return false;
  }else if(!($("#response_freq").prop("checked")) && !($("#response_bool").prop("checked"))) {
    newAlert("danger","Please enter at least one response.");
    $('html, body').animate({scrollTop: $("#tokenfield").offset().top - 100}, 1000);
    return false;
  }else {
    return true;
  }
}

function validateRemovingSubscriber() {
  var docarr = $("#remove_patient_subscribed_doctor").val();
  if($("#remove_patient_hospital_id").val().length == 0) {
    newAlert("danger","Please Choose Hospital.");
    $('html, body').animate({scrollTop: $("#remove_patient_hospital_id").offset().top - 100}, 1000);
    return false;
  }else if(!docarr || docarr.length == 0) {
    newAlert("danger","Please Choose atleast one Doctor from Subscribed Doctors list.");
    $('html, body').animate({scrollTop: $("#remove_patient_subscribed_doctor").offset().top - 100}, 1000);
    return false;
  }else if(!($("#remove_patient_emailid").data("user_id"))) {
    newAlert("danger","Please select a Patient to Delete.");
    $('html, body').animate({scrollTop: $("#remove_patient_emailid").offset().top - 100}, 1000);
    return false;
  }else if(!$("#remove_reason").val()) {
    newAlert("danger","Please provid reason to delete this Patient.");
    $('html, body').animate({scrollTop: $("#remove_patient_emailid").offset().top - 100}, 1000);
    return false;
  }else {
    return true;
  }
}

function validationOnSaveSpecialization(){
  if($("#specialization_tokenfield").tokenfield("getTokens").length == 0){
    newAlert("danger","Please enter atleast one field name.");
    $('html, body').animate({scrollTop: $('#specialization_tokenfield').offset().top - 100}, 1000);
    $('#specialization_tokenfield').focus();
    return false;
  }else if($("#token_hospital_parent").css("display") != "none"){
    if($("#specialization_hospital_tokenfield").tokenfield("getTokens").length == 0){
        newAlert("danger","Please enter atleast one field name.");
        $('html, body').animate({scrollTop: $('#specialization_hospital_tokenfield').offset().top - 100}, 1000);
        $('#specialization_hospital_tokenfield').focus();
        return false;
      }else{
        return true;
      }
  }else{
    return true;
  }
}

function validatePatientTags() {
  if($("#patient_tag_parent").find(".theme-background").length == 0){
    $("#export_patient_by_categories_link, #admin_patient_category_list").addClass("no-display");
    newAlert("danger","Please select atleast one Tag name.");
    return false;
  }else{
    return true;
  } 
}

function validateAssigningForTelemedicineInquiries($obj) {
  if(!($obj.closest("tr").find(".assign_hospital").val())){
    newAlert("danger","Please select Hospital to assign the telemedicine inquiry.");
    return false;
  }else{
    return true;
  } 
}

function validateReplyTeleInquiry() {
  if(!($("#message_to_patient").val())) {
    newAlert("danger","Message can not be empty.");
    $("#message_to_patient").focus();
    return false;
  }else if(!($("#send_reply_teleinquiry").data("index"))) {
    newAlert("danger","Something wrong.Please reload the page.");
    return false;
  }else {
    return true;
  }
}

function validationAddPharmacy(){
  if($('#pharmacy_name').val() == ""){
    newAlert("danger","Please enter Pharmacy name Name.");
    return false;
  }else if($('#pharmacy_phone').val() == ""){
    newAlert("danger","Please enter Phone.");
    return false;
  }else if($('#dhp_code_pharmacy').val() == ""){
    newAlert("danger","Please select Dhp code.");
    return false;
  }else if($("#pharmacy_street").val().trim() == ""){
    newAlert("danger","Please enter street.");
    return false;
  }else if($("#pharmacy_state").val() == "select state" || $("#pharmacy_state").val() == ""){
    newAlert("danger","Please select state.");
    return false;
  }else if($("#pharmacy_city").val() == "select city" || $("#pharmacy_city").val() == "" || $("#pharmacy_city").val() == null){
    newAlert("danger","Please select city.");
    return false;
  }else if($("#pharmacy_zip").val().trim() == ""){
    newAlert("danger","Please enter zip code.");
    return false;
  }else{
    return true;
  }
}