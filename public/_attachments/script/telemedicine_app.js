function anchor_tag(obj){
  if($(obj).hasClass("orange")){
    $(obj).toggleClass("telemedicine_greenbox_hover");
    $(obj).find(".telemedicine_issue_active").toggle();
  }else{
    $(obj).toggleClass("graybox_hover");
    $(obj).find("h2").toggleClass('txtwhite');
    $(obj).find("ul li").toggleClass('txtwhite');
    $(obj).find(".telemedicine_issue_active").toggle();
  }
}

function newAlertForModal (type, message, id) {
  $("#" + id).find(".alert-msg-box").append($("<div class='alert-test alert-"+type+" fade in' data-alert><p style = 'color:red'> " + message + " </p></div>"));
  $(".alert-test").delay(2000).fadeOut("slow", function () { $(this).remove(); });
}

function singleUserValidation(){
  if(required() && validatePhoneNumber("isu_phone") && verifyEmail("isu_email") && verifyFMH() && validatioInAllergiess()){
    return true;
  }else{
    return false;
  }
}

function validatePhoneNumber(phoneid){
  var phone_filter = /^(\+\d{1,3}[- ]?)?\d{10}$|^(\+\d{1,3}[- ]?)?\d{11}$/;
  if(!phone_filter.test($("#"+phoneid).val().trim())){
    newAlertForModal('error', 'Family Condition can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#"+phoneid).focus();
    return false;
  }else{
    return true;
  }
}

function verifyEmail(id){
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (!filter.test($("#"+id).val().trim())) {
    newAlertForModal('error', 'Family Condition can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#"+id).focus();
    return false;
  }else{
    return true;
  }
}

function FMHRelationValidation(){
  var validate;
  //$("#isu-fmh-relation").each(function(){
    if($("#isu-fmh-relation").val() == "Select"){
      validate = true;
      newAlertForModal('error', 'Family Condition can not be empty.',"register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
      return validate;
    }
  //});
  if(validate){
    return false; 
  }else{
    return true;
  }
}

function FMHConditionValidation(){
  var validate;
  //$("#isu-fmh-condition").each(function(){
    if($("#isu-fmh-condition").val() == "Select"){
      validate = true;
      newAlertForModal('error', 'Family Condition can not be empty.',"register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
      return validate;
    }
  //});
  if(validate){
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

function required(){
  if($("#isu_first_name").val().trim() == ""){
    newAlertForModal('error', 'First Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_first_name").focus();
    return false;
  }else if($("#isu_last_name").val().trim() == ""){
    newAlertForModal('error', 'Last Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_last_name").focus();
    return false;
  }else if($("#isu_height").val().trim() == ""){
    newAlertForModal('error', 'Height can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_height").focus();
    return false;
  }else if($("#isu_weight").val().trim() == ""){
    newAlertForModal('error', 'Weight can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_weight").focus();
    return false;
  }else if($("#isu_ename").val().trim() == ""){
    newAlertForModal('error', 'Emergency Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_ename").focus();
    return false;
  }else if($("#isu_ephone").val().trim() == ""){
    newAlertForModal('error', 'Emergency phone number can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_ephone").focus();
    return false;
  }else if($("#isu_erelation").val().trim() == ""){
    newAlertForModal('error', 'Emergency relation field can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_erelation").focus();
    return false;
  }else if($("#isu_phone").val().trim() == ""){
    newAlertForModal('error', 'Phone Number can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_phone").focus();
    return false;
  }else if($("#isu_email").val().trim() == ""){
    newAlertForModal('error', 'Email address can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_email").focus();
    return false;
  }else if($("#isu_address1").val().trim() == ""){
    newAlertForModal('error', 'Address can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_address1").focus();
    return false;
  }else if($("#isu_pincode").val().trim() == ""){
    newAlertForModal('error', 'Pincode can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_pincode").focus();
    return false;
  }else if($("#isu_state").val() == "select state"){
    newAlertForModal('error', 'State Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_state").focus();
    return false;
  }else if($("#isu_city").val() == "select city"){
    newAlertForModal('error', 'City Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_city").focus();
    return false;
  }else if($("#isu_country").val() == ""){
    newAlertForModal('error', 'Country Name can not be empty.',"register_subscriber_modal");
    $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    $("#isu_country").focus();
    return false;
  }else{
    return true;
  }
}

function clearTelemedicneForm(){
  $("#closet_symptom_dpval").empty();
  $("#subject_id").val("");
  $("#health_id").val("");
  $("#upload_symptoms_doc").val("");
}

function validateHealthIssue() {
  if($("#subject_id").val().trim().length == 0) {
    newAlertForModal('error', 'Subject Can not be blank', 'closest_symptom_model');
    $("#subject_id").focus();
    return false;
  }
  else if($("#health_id").val().trim().length == 0) {
    newAlertForModal('error', 'Health Issue Can not be blank', 'closest_symptom_model');
    $("#health_id").focus();
    return false; 
  }
  else {
    return true;
  }
}

function validatioInAllergiess() {
  var validate;
  $(".save-allergies").each( function(){
    if($(this).find(".issu_name_allergies").val().trim() == "Select Allergies" || $(this).find(".issu_name_allergies").val().trim() == ""){
      validate = false;
      newAlertForModal("error", "Allergies can not be empty.","register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
      $(this).find(".issu_name_allergies").focus();
      return validate;
    }else if($(this).find(".issu_name_severe").val().trim() == "Select Severe" || $(this).find(".issu_name_severe").val().trim() == ""){
      validate = false;
      newAlertForModal("error", "Severe can not be empty.","register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
      $(this).find(".issu_name_severe").focus();
      return validate;
    }else if($(this).find(".issu_name_reaction").val().trim() == "Select Reaction" || $(this).find(".issu_name_reaction").val().trim() == ""){
      validate = false;
      newAlertForModal("error", "Reaction can not be empty.","register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
      $(this).find(".issu_name_reaction").focus();
      return validate;
    }else{
      validate = true;
    }
  });
return validate;
}