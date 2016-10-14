var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("patientAddMedicationController",function($scope,$state,$stateParams,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(data.userCtx.name == null)
         window.location.href = "index.html";
      else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            displayAddNewMedication();
            bindingsForNewMedicationForm();
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

function displayAddNewMedication(){
  getPharmacyOptions("pharmacy");
  // getChartNotesForMedication();
}

function autoCalculateMedicationQuantity($obj,total_days) {
  var tempchk = false,
      quantity = 0;

  $obj.find(".medication-time").each(function() {
    if($(this).prop("checked")) {
      quantity += Number($(this).closest(".adddrug").find(".dose-common").val());
      tempchk = true;
    }
  });
  if(tempchk) {
    $obj.find(".drug_quantity").val(quantity * total_days);
  }
}

function toggleMedicationDoseDetails($obj) {
  if($obj.prop("checked")) {
    $obj.closest(".adddrug").find(".dose-common")
    .val("1")
    .removeClass("no-display");
  }else {
    $obj.closest(".adddrug").find(".dose-common").addClass("no-display");
  }
  autoCalculateMedicationQuantityFromMedicationTime($obj.closest(".medication_details_parent"));
}

function autoCalculateMedicationQuantityFromMedicationTime($obj) {
  if($obj.find(".drug_start_date").val()) {
    var sd = $obj.find(".drug_start_date").data("daterangepicker").startDate;
    var ed = $obj.find(".drug_start_date").data("daterangepicker").endDate;
    var diff = ed.diff(sd,"days") + 1;
    autoCalculateMedicationQuantity($obj,diff);
  }else {
    console.log("in else");
  }
}

function bindingsForNewMedicationForm(){
  $("#medication_common_form_parent").on("keypress",".dose-common",function(e){
    return allowOnlyNumbersAndDot(e);
  });

  $("#medication_common_form_parent").on("change",".dose-common",function(){
    autoCalculateMedicationQuantityFromMedicationTime($(this).closest(".medication_details_parent"));
  });

  $("#medication_common_form_parent").on("click",".medication-time",function(){
    toggleMedicationDoseDetails($(this));
  });

  $('#medication_common_form_parent').on('apply.daterangepicker', ".drug_start_date", function(ev, picker) {
    autoCalculateMedicationQuantity($(this).closest(".medication_details_parent"),(picker.endDate).diff(picker.startDate, "days") + 1);
  });

  $("#medication_common_form_parent").on("focus",".drug",function(){
    drugNameAutocompleter($(this));
  });

  $("#medication_common_form_parent").on("click","#add_more_medication",function(e){
    e.preventDefault();
    generateNewMedicationForm();
  });

  $("#medication_common_form_parent").on("click",".remove_medication_tab",function(e){
    e.preventDefault();
    removeMedicationTab($(this));
  });

  $("#medication_common_form_parent").on("focusout",".drug",function(){
    if($(this).val().trim() != "") $("#medication_tabs").find("[href='#"+$(this).closest(".medication_details_parent").attr("id")+"']").html($(this).val())
  });

  $("#medication_common_form_parent").on("click","#save_medication_new, #save_medication_for_patient_only, #save_new_medication, #save_new_print_medication",function(){
    showSummaryChangesBeforeSaveMedication($(this));
  });

  $(document).on('focus',".drug_start_date", function(){
    $(this).daterangepicker({
      minDate: moment(),
      dateLimit: {
        "months": 12
      },
      locale: {
        format: 'YYYY-MM-DD'
      }
    });
  });  

  $("#medication_tabs").tabs();
}

function removeMedicationTab($obj) {
  var id = $obj.closest("li").find("a").attr("href");
  $(id).remove();
  $obj.closest("li").remove();
  $("#medication_name_tabs").find("li:nth-last-child(2)").find("a").trigger("click");
}

function generateNewMedicationForm() {
  var id_code = "default_medication_"+getPcode(5,"numeric");
  var output  = [];
  output.push('<div class="row medication_details_parent" id="'+id_code+'">');
    output.push('<div class="col-lg-12 Premrg">');
      output.push('<div class="col-lg-2 col-md-2 col-xs-12 Premrg1">Drug*</div>');
      output.push('<div class="col-lg-4 col-md-6 col-xs-12 Premrg1">');
        output.push('<input type="text" autocomplete="off" class="form-control drug">');
      output.push('</div>');
      output.push('<div class="col-lg-3 col-md-6 col-xs-12 Premrg1">');
        output.push('<div class="adddrug"><div class="hideCheckbox">');
          output.push('<span><input type="checkbox" value="" class="favorite_drug"></span>Add drug to favorites');
        output.push('</div></div>');
      output.push('</div>');
      output.push('<div class="col-lg-3 col-md-6 col-xs-12 Premrg1">');
        output.push('<div class="adddrug">');
          output.push('<span><input type="checkbox" class="substitution" value=""></span>Allow Substitution');
        output.push('</div>');
      output.push('</div>');
    output.push('</div>  ');
    output.push('<div class="col-lg-12 Premrg">');
      output.push('<div class="col-lg-2 col-md-2 col-xs-12 Premrg1">Patient Instructions</div>');
      output.push('<div class="col-lg-9 col-md-9 col-xs-12 Premrg1">');
        output.push('<textarea type="text" data-required="true" class="form-control parsley-validated medication_instructions"></textarea>');
      output.push('</div>');
    output.push('</div>');

    output.push('<div class="col-lg-12 Premrg">');
      output.push('<div class="col-lg-5 col-md-3 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-5"><label for="drug_start_date">Choose Date Range*</label></div>');
          output.push('<div class="col-lg-5">');
            output.push('<input type="text" class="form-control drug_start_date text-center" id="drug_start_date">');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
      output.push('<div class="col-lg-7 col-md-3 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1">');
            output.push('<div class="adddrug"><span><input type="checkbox" class="medication-time mt_morning" value="morning"></span><span>Morning</span><input class="cuswidth25 dose-common morning-dose no-display" value="1"></div>');
          output.push('</div>');
          output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1 paddright">');
            output.push('<div class="adddrug"><span><input type="checkbox" class="medication-time mt_afternoon" value="afternoon"></span><span>AfterNoon</span><input class="cuswidth25 dose-common afternoon-dose no-display" value="1"></div>');
          output.push('</div>');
          output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1">');
            output.push('<div class="adddrug"><span><input type="checkbox" class="medication-time mt_evening" value="evening"></span><span>Evening</span><input class="cuswidth25 dose-common evening-dose no-display" value="1"></div>');
          output.push('</div>');
          output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1">');
            output.push('<div class="adddrug"><span><input type="checkbox" class="medication-time mt_night" value="night"></span><span>Night</span><input class="cuswidth25 dose-common night-dose no-display" value="1"></div>');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
    output.push('</div>');

    output.push('<div class="col-lg-12 Premrg">');
      output.push('<div class="col-lg-2 col-md-2 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-5">Quantity</div>');
          output.push('<div class="col-lg-7">');
            output.push('<input type="text" class="form-control drug_quantity" readonly="readonly">');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
      output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-5 medic-str">Disperse Form*</div>');
          output.push('<div class="col-lg-7">');
            output.push('<select name="desperse_form" class="form-control select2-input parsley-validated desperse_form" data-required="true">');
              output.push('<option value="">Select</option>');
              output.push('<option value="Tablet">Tablet</option>');
              output.push('<option value="Capsule">Capsule</option>');
              output.push('<option value="Vaccine">Vaccine</option>');
              output.push('<option value="Syrup">Syrup</option>');
              output.push('<option value="Other">Other</option>');
            output.push('</select>');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
      output.push('<div class="col-lg-2 col-md-2 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-6 medic-str">Strength*</div>');
          output.push('<div class="col-lg-6">');
            output.push('<input type="text" class="form-control drug_strength">');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
      output.push('<div class="col-lg-2 col-md-3 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-6 medic-str">');
            output.push('Units*');
          output.push('</div>');
          output.push('<div class="col-lg-6 paddside">');
            output.push('<select class="form-control select2-input parsley-validated drug_unit" data-required="true">');
              output.push('<option value="">Select</option>');
              output.push('<option value="mg">mg</option>');
              output.push('<option value="ml">ml</option>');
              output.push('<option value="drops">drops</option>');
              output.push('<option value="mcg">mcg</option>');
              output.push('<option value="tablets">tablets</option>');
            output.push('</select>');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
      output.push('<div class="col-lg-3 col-md-3 col-xs-12 Premrg1">');
        output.push('<div class="row">');
          output.push('<div class="col-lg-4 medic-str">');
            output.push('Route');
          output.push('</div>');
          output.push('<div class="col-lg-8">');
            output.push('<input type="text" class="form-control medication_route">');
          output.push('</div>');
        output.push('</div>');
      output.push('</div>');
    output.push('</div>');
    
  output.push('</div>');

  $(output.join('')).insertAfter($(".medication_details_parent:last"));
  $('<li class="inline-flex"><a href="#'+id_code+'">Medication</a><span class="ui-icon ui-icon-close pointer remove_medication_tab">Remove Tab</span></li>').insertBefore($("#add_more_medication").closest("li"))
  $("#medication_tabs").tabs( "refresh" );
  if($("#current_madication").hasClass("active")) $(".drug_start_date, .drug_end_date").removeClass("zindex1151")
  else $(".drug_start_date, .drug_end_date").addClass("zindex1151");
  $("#medication_name_tabs").find(".ui-tabs-anchor").last().trigger("click"); 
}

function getChartNotesForMedication(){
  $.couch.db(db).view("tamsa/getDoctorChartNotes", {
    success: function(data) {
      var chart_notes = '';
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          chart_notes += '<option value="'+data.rows[i].value+'">'+data.rows[i].key[2]+' -- '+data.rows[i].key[3]+'</option>';
        };
        $("#medication_chart_notes").html(chart_notes);
      }
      else {
        chart_notes += '<option>No Chart Note</option>';
        $("#medication_chart_notes").html(chart_notes);
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    startkey: [pd_data._id, userinfo.user_id],
    endkey: [pd_data._id, userinfo.user_id, {}]
  });
}
