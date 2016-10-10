var document_added_from;
$(document).ready(function(){
  $("#tc_agree").click(function(event) {
    $('#new_subscriber_modal').modal({
      show:true,
      backdrop:'static',
      keyboard:false
    });
    $("register_modal_content").hide();
  });
  $('body').on("show.bs.modal","#new_subscriber_modal",function(){
    $("#new_subscriber_modal #email_sub_id").focus();
  });
  $("#tc_disagree").click(function(event) {
    window.location = "index.html";
  });
  $("#submit_subscription").click(function(event) {
     $.couch.db(personal_details_db).view("tamsa/getPatientEmail", {
       success: function(data) {
        if(data.rows.length == 0){
          newAlertForModal('error', 'No User Found...',"new_subscriber_modal");
        }else{
          $.cookie('TC_patient_id',data.rows[0].value[0],{ expires: 365 });
          $.cookie('TC_patient_email',$("#email_sub_id").val(),{ expires: 365 });
          $.cookie('TC_patient_dhp_id',data.rows[0].value[1],{ expires: 365 });
          $("#email_sub_id").val('');
          $('#new_subscriber_modal').modal('hide');
          $(this).delay(2000,function(){window.location = "telemedicine.html"})            
        }
       },
       error:function(data,error,reason){
         newAlert("danger",reason);
         $("html, body").animate({scrollTop: 0}, 'slow');
         return false;
       },
       key : $("#email_sub_id").val()
     });
  });
  $("#register_subscription").click(function(){
      //alert("new register_subscription modal");
      $('#new_subscriber_modal').modal('hide');
      $('#register_subscriber_modal').modal({
        show:true,
        backdrop:'static',
        keyboard:false
      });
    $(document).on('focus',".datetime-with-maxdate", function(){
      $(this).datepicker({
        dateFormat:      'yy-mm-dd',
        changeMonth:     true,
        changeYear:      true,
        yearRange:       'c-75:c',
        showOn:          "both",
        buttonImage:     "images/datetime.gif",
        buttonImageOnly: true,
        buttonText:      "Select date"
      });
      $(this).parent().css("position","relative");
      $(this).parent().find("img").css({
        position:"absolute",
        top:"10px"
      });
    });
    getStates("isu_state");
  });
  $('#register_subscriber_modal').on('show.bs.modal', function (e) {
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
  });
  
  $('#isu_upload').click(function(){
    saveSinglePatient($(this),print,"TC");
  });   
  $('#email_sub_id').on('keydown', function(e) {
    if (e.keyCode == 13 && $("#email_sub_id").val().length > 0) {
      $("#submit_subscription").trigger('click');
    }
  });
  $("body").on("click","#age_link",function(){
    if($(this).html() == "Enter Age"){
      $(this).html("Date Of Birth");
      $("#db_label").html("Age*");
      $("#isu_date_of_birth").val("").hide().datepicker("destroy");
      $("#isu_age").show();
    }else{
      $("#db_label").html("Date Of Birth*");
      $("#isu_date_of_birth").show();
      $("#isu_age").hide();
      $(this).html("Enter Age");
    }
  });

  $("#register_subscriber_modal").on("click","#close_subscribe_modal",function(){
    $("#isu_upload").removeClass("ajax-loader-large");
    $("#save_patient_label").css("visibility","visible");
  });

  $("#isu_state").on("change", function() {
    getCities($("#isu_state").val(), "isu_city","select city");
  });

  $("#isu_allergies").multiselect();
  $("#isu_condition").multiselect();
  $("#register_subscriber_modal").on("click","#add_new_allergiess",function(){
    var allergies_list = [];
  allergies_list.push('<div class="col-sm-12 save-allergies" style = "margin-top:10px;"><div style= "float: left"><select class="issu_name_allergies my-select form-control placeholder-no-fix" type="text" id="issu_name_allergies"><optgroup label="Food"><option selected="selected">Select Allergies</option><option>Fruit</option><option>Garlic</option><option>Meat</option><option>Milk</option><option>Oats</option><option>Peanut</option><option>Fish / Shellfish</option><option>Soy</option><option>Nut</option><option>Wheat</option><option>Gluten</option><option>Egg</option><option>Sulfites</option><option>Casein</option></optgroup><optgroup label="Drug"><option>Tetracycline</option><option>Dilantin</option><option>Tegretol (carbamazepine)</option><option>Penicillin</option><option>cephalosporins</option><option>sulfonamides</option><option>Local anesthetics</option><option>Non-steroidal anti-inflammatories (cromolyn sodium, nedocromil sodium, etc.)</option><option>I.V. contrast dye</option></optgroup><optgroup label="Environmental"><option>BT,CT</option><option>PT,APT</option><option>Pollen</option><option>Cat</option><option>Dog</option><option>Insect sting</option><option>Bee sting</option><option>Mold</option><option>Perfume</option><option>Cosmetics</option><option>Semen</option><option>Latex</option><option>House dust mites</option><option>Nickel</option><option>Gold</option><option>Chromium</option><option>Cobalt Chloride</option><option>Formaldehyde</option><option>Sun</option><option>Phorographic developers</option></optgroup></select></div>');
  allergies_list.push('<div style= "float: left"><select class="form-control issu_name_severe my-select placeholder-no-fix" type="text" id="issu_name_severe"><option selected="selected">Select Severe</option><option>Very Mild</option><option>Mild</option><option>Modest</option><option>Severe</option>Severity</select></div>');
  allergies_list.push('<div style= "float: left"><select class="form-control issu_name_reaction my-select placeholder-no-fix" type="text" id="issu_name_reaction"><option selected="selected">Select Reaction</option>  <option>Bloating/gas</option><option>Bradycardia</option><option>Chest Pain</option><option>Conjunctivitis</option><option>Cough</option><option>Diarrhea</option><option>Difficulty speaking or swallowing</option><option>Dizziness/Lightheadedness</option><option>Facial swelling</option><option>Hives</option><option>Irregular Heartbeat</option><option>Itchiness</option><option>Loss of consciousness</option><option>Nausea</option><option>Pain/cramping</option><option>Rash</option><option>Respiratory Distress</option><option>Runny nose</option><option>Shortness of breath</option><option>Tachycardia</option><option>Tongue swelling</option><option>Vomiting</option>Reaction<option>Wheezing</option></select></div><span id = "add_new_allergiess" class="glyphicon glyphicon-plus theme-color" style = "position: absolute;margin-left:0px;margin-top:13px"></span><span id = "remove_add_new_allergiess" class="glyphicon glyphicon-minus theme-color" style = "position: absolute;margin-left:18px;margin-top:13px"></span></div>');
  $("#issu_add_item_parent").append(allergies_list.join(''));
  });

  $("#register_subscriber_modal").on("click","#remove_add_new_allergiess",function(){
    $(this).parent().remove();
  });
});