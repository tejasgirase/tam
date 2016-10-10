function getInvitationNumber() {
    var letters = "0123456789";
    var pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    var index = Math.floor(pool.length * Math.random());
    var drawn = pool.splice(index, 1);
    return letters.substring(drawn[0], drawn[0]+1);
};

function getInvitationcode() {
  var length = Number(8);
  var code = "";
  for (var i = 0; i < length; i++) {
    code += getInvitationNumber();
  };

  return code;
}

function uploadfile() {
  if($("#userfile").val()){
    var fileinfo = $("#userfile").prop("files")[0];
    if(fileinfo.name.slice(-3) == 'csv'){
      fileUplodapatient(fileinfo);
    }else{
      newAlert("danger","Importing File is not CSV.Please select CSV File");
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  }else{
    newAlert('danger', "No File is selected for Import.");
    $('html, body').animate({scrollTop: 0}, 'slow');
  }
}
  function fileUplodapatient(fileinfo){
  var oFreader = new FileReader();
  oFreader.readAsText(fileinfo);
  oFreader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    if(validateImportPatientDetails(data)){
      var info_patients = [];
      var skip_patients = [];
      $("#import_patient").data("total_rows",data.length -1);
      // console.log(data.length);
      for(var i=1;i<data.length;i++){
        validateImportPatientSave(data,i,info_patients,skip_patients);
      }
    }else{
      return false;
    }
  };
  oFreader.onerror = function(){ alert('Unable to read ' + fileinfo.name); };
}

function validateImportPatientDetails(data){
  if(data.length == 0 || data.length == 1){
    console.log("val1");
    newAlert("danger","Invalid CSV file. Please import valid csv file.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }else if(data[0][0] != 'first_nm' || data[0][1] != 'last_nm' || data[0][2] != 'date_of_birth'|| data[0][3] != 'user_email' || data[0][4] != 'phone' || data[0][5] != 'address1'|| data[0][6] != 'address2' || data[0][7] != 'ename' || data[0][8] != 'ephone' || data[0][9] != 'gender' || data[0][10] != 'country' || data[0][11] != 'state' || data[0][12] != 'city' || data[0][13] != 'pincode'|| data[0][14] != 'Ethnicity'|| data[0][15] != 'Status' || data[0][16] != 'erelation' || data[0][17] != 'height' || data[0][18] != 'weight'|| data[0][19] != 'waist'|| data[0][20] != 'update_ts'|| data[0][21] != 'doctype'|| data[0][22] != 'user_id'|| data[0][23] != 'Procedure'|| data[0][24] != 'Medication'|| data[0][25] != 'Condition'|| data[0][26] != 'Allergies'|| data[0][27] != 'Family_Medical_History'){
    console.log("val2");
    newAlert("danger","Selected file does not match the csv template for user import.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }else{
    return true;
  } 
}
function validateImportPatientSave(data,i,info_patients,skip_patients){
  if(data[i][0] == '' || data[i][1] == '' || data[i][2] == '' || data[i][4] == '' || data[i][5] == '' || data[i][7] == '' || data[i][8] == '' || data[i][9] == '' || data[i][10] == '' || data[i][11] == '' || data[i][12] == '' || data[i][13] == '' || data[i][16] == '' || data[i][17] == '' || data[i][18] == '' ){
    data[i].push("One of the Required filed is Blank.");
    skip_patients.push(data[i]);
    $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
    if($("#import_patient").data("total_rows") == "0"){
      newAlert("danger","Selected file does not match the csv template for user import.");
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  }else if(i != 1){
    for(var j = i-1;j>0;j--){
      if(data[j][0] == data[i][0] && data[j][1] == data[i][1] && data[j][2] == data[i][2] && data[j][3] == data[i][3] && data[j][4] == data[i][4]){
        var error = true;
        break;
      }
    }
    if(error){
      data[i].push("Patient Already Exists within importing File.")
      skip_patients.push(data[i]);
      $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
      if($("#import_patient").data("total_rows") == "0"){
        console.log(skip_patients);
        console.log(info_patients);
        savePatientDetailsFromCSV(data,i,info_patients,skip_patients);
      }
    }else{
      validationForAlreadyExistsPatientsInDB(data,i,info_patients,skip_patients);
    }
  }else{
    validationForAlreadyExistsPatientsInDB(data,i,info_patients,skip_patients);
  }
}
function validationForAlreadyExistsPatientsInDB(data,i,info_patients,skip_patients){
  if(data[i][3] == "emailnotprovided@digitalhealthpulse.com"){
    $.couch.db(personal_details_db).view("tamsa/getPatientPhoneNumber", {
      success: function(userdata){
        if(userdata.rows.length > 0){
          var dataskip = data[i].push("Patient already exists.");
          data[i].push("Patient alreadsdasdasy exists.");
          skip_patients.push(data[i]);
        }else{
          $("#patient_dhp_id").val("SHS-"+getInvitationcode());    
          var d               = new Date();
          var SHS_id          = "SHS-"+getInvitationcode();
          var user_id         = $.couch.newUUID();
          var patient_pi_data = {
            MaritalStatus:  data[0][15],
            address1:       data[i][5],
            address2:       data[i][6],
            bloodgroup:     '',
            city:           data[i][12],
            country:        data[i][10],
            doctype:        'UserInfo',
            ename:          data[i][7],
            ephone:         data[i][8],
            erelation:      data[i][16],
            first_nm:       data[i][0],
            gender:         data[i][9],
            date_of_birth:  moment(data[i][2]).format("YYYY-MM-DD"),
            age:            getAgeFromDOB(data[i][2]),
            initial:        "false",
            update_ts:      d,
            last_nm:        data[i][1],
            patient_dhp_id: SHS_id,
            user_email:     data[i][3],
            free_credits:        3,
            credit_start_date:   moment(d).format("YYYY-MM-DD"),
            credit_end_date:     moment(d).add(4, 'months').format("YYYY-MM-DD"),
            applied_coupen_code: [],
            purchased_credits:   0,
            phone:          data[i][4],
            pincode:        data[i][13],
            state:          data[i][11],
            user_id:        user_id,      
          };
          var patient_medical_data = {
          _id:            user_id,
          doctype:        "UserInfo",
          user_id:        user_id,
          patient_dhp_id: SHS_id,
          user_email:     data[i][3],
          update_ts:      d,
          insert_ts:      d,
          height:         data[i][17],
          waist:          data[i][19],
          weight:         data[i][18],
          Procedure:      data[i][23].split(","),
          Medication:     data[i][24].split(","),
          Condition:      data[i][25].split(","),
          Allergies:      data[i][26].split(","),
          initial:        'false',
          Diastolic_bp:   '',
          Pulse:          '',
          Systolic_bp:    '',
          alcohol:        '',
          hdl:            '',
          ldl:            '',
          mobile_id:      '',
          smoking:        '',
          tgl:            '',
          };
          
          var patient_subscriber = {
            Designation:     "",
            Email:           pd_data.email,
            Name:            pd_data.first_name +" "+pd_data.last_name,
            Phone:           pd_data.phone,
            Relation:        "Doctor",
            "Select Report": "All conditions",
            doctor_id:       pd_data._id,
            doctype:         "Subscriber",
            insert_ts:       d,
            user_id:         user_id,
            User_firstname:  data[i][0],
            User_lastname:   data[i][1],
            patient_dhp_id:  SHS_id,
            frequency:       ""
          };
          var patient_cron_record = {
            doctype:        'cronRecords',
            operation_case: '6',
            processed:      'No',
            doctor_id:      pd_data._id,
            first_nm:       data[i][0],
            last_nm:        data[i][1],
            user_email:     data[i][3],
            phone:          data[i][4],
            MaritalStatus:  data[0][15],
            address1:       data[i][5],
            address2:       data[i][6],
            ename:          data[i][7],
            ephone:         data[i][8],
            user_id:        user_id,
            gender:         data[i][9],
            country:        data[i][10],
            state:          data[i][11],
            city:           data[i][12],
            pincode:        data[i][13],
            date_of_birth:  moment(data[i][2]).format("YYYY-MM-DD"),
            erelation:      data[i][16],
            height:         data[i][17],
            weight:         data[i][18],
            waist:          data[i][19],
            bloodgroup:    '',
            Procedure:      '',
            Medication:     '',
            Condition:      '',
            Allergies:      '',
            patient_dhp_id: SHS_id,
            update_ts:      d,
            insert_ts:      d
          };
          var patient_medication_bulk_doc = [];
          var patient_medication_array = data[i][24].split(",");
          for(var j=0;j<patient_medication_array.length;j++){
            if(patient_medication_array[j] != ""){
              var patient_medication_doc = {
                doctype:                              "currentMedications",
                medications_added_from_addNewPatient: "Yes",
                update_ts:                            d,
                user_id:                              user_id,
                doctor_id:                            pd_data._id,
                doctor_name:                          pd_data.first_name+'  '+pd_data.last_name,
                drug:                                 patient_medication_array[j],
                route:                                "",
                favorite_drug:                        "",
                medication_instructions:              "",
                drug_quantity:                        "",
                desperse_form:                        "",
                substitution:                         "",
                pharmacy_doc_id:                      "",
                pharmacy:                             "",
                pharmacy_instructions:                "",
                drug_strength:                        "",
                drug_unit:                            "",
                drug_start_date:                      "",
                drug_end_date:                        "",
                medication_chart_note:                "",
                medication_time:                      [],
                Notified:                             "N",
                Medication_Taken:                     "N"
              };
            
              patient_medication_bulk_doc.push(patient_medication_doc);
            }  
          }
          info_patients.push(patient_pi_data);
        }
        $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
        if($("#import_patient").data("total_rows") != "0"){
          savePatientDetailsFromCSV(info_patients,patient_pi_data,patient_medical_data,patient_subscriber,patient_cron_record,skip_patients,patient_medication_bulk_doc);
        }   
      },
      error:function(data,error,reason){
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');       
      },
      key: [data[i][4],data[i][0]]   
    });
  }else{
    $("#getemailid").val(data[i][3]);
    if(verifyEmail("getemailid")){
       $.couch.db(personal_details_db).view("tamsa/getPatientEmail", {
        success: function(udata){
          if(udata.rows.length > 0){
            data[i].push("Patient already exists.");
            skip_patients.push(data[i]);
          }else{
            // $("#patient_dhp_id").val("SHS-"+getInvitationcode());    
            var d               = new Date();
            var SHS_id          = "SHS-"+getInvitationcode();
            var user_id         = $.couch.newUUID();
            var patient_pi_data = {
              MaritalStatus:  data[i][15],
              address1:       data[i][5],
              address2:       data[i][6],
              bloodgroup:     '',
              city:           data[i][12],
              country:        data[i][10],
              doctype:        'UserInfo',
              date_of_birth:  moment(data[i][2]).format("YYYY-MM-DD"),
              age:            getAgeFromDOB(data[i][2]),
              ename:          data[i][7],
              ephone:         data[i][8],
              erelation:      data[i][16],
              first_nm:       data[i][0],
              gender:         data[i][9],
              initial:        "false",
              update_ts:      d,
              last_nm:        data[i][1],
              patient_dhp_id: SHS_id,
              user_email:     data[i][3],
              phone:          data[i][4],
              pincode:        data[i][13],
              state:          data[i][11],
              free_credits:        3,
              credit_start_date:   moment(d).format("YYYY-MM-DD"),
              credit_end_date:     moment(d).add(4, 'months').format("YYYY-MM-DD"),
              applied_coupen_code: [],
              purchased_credits:   0,
              user_id:        user_id   
            };
            var patient_medical_data = {
              _id:            user_id,
              doctype:        "UserInfo",
              user_id:        user_id,
              patient_dhp_id: SHS_id,
              user_email:     data[i][3],
              update_ts:      d,
              insert_ts:      d,
              height:         data[i][17],
              waist:          data[i][19],
              weight:         data[i][18],
              Procedure:      data[i][23].split(","),
              Medication:     data[i][24].split(","),
              Condition:      data[i][25].split(","),
              Allergies:      data[i][26].split(","),
              initial:        'false',
              Diastolic_bp:   '',
              Pulse:          '',
              Systolic_bp:    '',
              alcohol:        '',
              hdl:            '',
              ldl:            '',
              mobile_id:      '',
              smoking:        '',
              tgl:            ''
            };
            var patient_subscriber = {
              Designation:     "",
              Email:           pd_data.email,
              ame:            pd_data.first_name +" "+pd_data.last_name,
              Phone:           pd_data.phone,
              Relation:        "Doctor",
              "Select Report": "All conditions",
              doctor_id:       pd_data._id,
              doctype:         "Subscriber",
              insert_ts:       d,
              user_id:         user_id,
              User_firstname:  data[i][0],
              User_lastname:   data[i][1],
              patient_dhp_id:  SHS_id,
              frequency:       ""
            };
            var patient_cron_record = {
              doctype:        'cronRecords',
              operation_case: '6',
              processed:      'No',
              first_nm:       data[i][0],
              last_nm:        data[i][1],
              user_email:     data[i][3],
              phone:          data[i][4],
              address1:       data[i][5],
              address2:       data[i][6],
              doctor_id:      pd_data._id,
              ename:          data[i][7],
              ephone:         data[i][8],
              user_id:        user_id,
              MaritalStatus:  data[0][15],
              date_of_birth:  moment(data[i][2]).format("YYYY-MM-DD"),
              gender:         data[i][9],
              country:        data[i][10],
              state:          data[i][11],
              city:           data[i][12],
              pincode:        data[i][13],
              erelation:      data[i][16],
              height:         data[i][17],
              weight:         data[i][18],
              waist:          data[i][19],
              bloodgroup:    '',
              Procedure:      data[i][23].split(","),
              Medication:     data[i][24].split(","),
              Condition:      data[i][25].split(","),
              Allergies:      data[i][26].split(","),
              patient_dhp_id: SHS_id,
              update_ts:      d,
              insert_ts:      d
            };
            var patient_medication_bulk_doc = [];
            var patient_medication_array = data[i][24].split(",");
            for(var j=0;j<patient_medication_array.length;j++){
              if(patient_medication_array[j] != ""){
                var patient_medication_doc = {
                  doctype:                              "currentMedications",
                  medications_added_from_addNewPatient: "Yes",
                  update_ts:                            d,
                  user_id:                              user_id,
                  doctor_id:                            pd_data._id,
                  doctor_name:                          pd_data.first_name+'  '+pd_data.last_name,
                  drug:                                 patient_medication_array[j],
                  favorite_drug:                        "",
                  route:                                "",
                  medication_instructions:              "",
                  drug_quantity:                        "",
                  desperse_form:                        "",
                  substitution:                         "",
                  pharmacy_doc_id:                      "",
                  pharmacy:                             "",
                  pharmacy_instructions:                "",
                  drug_strength:                        "",
                  drug_unit:                            "",
                  drug_start_date:                      "",
                  drug_end_date:                        "",
                  medication_chart_note:                "",
                  medication_time:                      [],
                  Notified:                             "N",
                  Medication_Taken:                     "N"
                };
              
                patient_medication_bulk_doc.push(patient_medication_doc);
              }  
            }
            info_patients.push(patient_pi_data);
          } 
          $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
          if($("#import_patient").data("total_rows") != "0"){
            savePatientDetailsFromCSV(info_patients,patient_pi_data,patient_medical_data,patient_subscriber,patient_cron_record,skip_patients,patient_medication_bulk_doc);
          }
        },      
          error:function(data,error,reason){
              newAlert('danger', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');       
          },
          key: data[i][3] 
      });
    }
  }
}

function savePatientDetailsFromCSV(info_patients,patient_pi_data,patient_medical_data,patient_subscriber,patient_cron_record,skip_patients,patient_medication_bulk_doc){
  if(info_patients.length > 0){
    $.couch.db(personal_details_db).saveDoc(patient_pi_data, {
      success: function(data) {
        $.couch.db(db).saveDoc(patient_medical_data, {
          success: function(data) {
            $.couch.db(db).saveDoc(patient_subscriber, {
              success: function(data) {
                $.couch.db(db).saveDoc(patient_cron_record, {
                  success: function(data) {
                    $.couch.db(db).bulkSave({"docs": patient_medication_bulk_doc}, {
                      success: function(data) {
                        if(skip_patients.length > 0){
                          $("#skipped_rows_parent1").show();
                          $("#skipped_rows_link_patient").data("skip_row",skip_patients);
                          newAlert('warning', "Patient partially imported with skipped Rows.");
                        }else{
                          $("#skipped_rows_parent1").hide();
                          $("#skipped_rows_link_patient").data("skip_row","");
                          newAlert('success', "Patient successfully Imported.");
                        }
                        $("#userfile").val("");
                        newAlert('success', ''+info_patients.length+' users imported from the given file.');
                        $('html, body').animate({scrollTop: 0}, 'slow');
                      },
                      error: function(status){
                        console.log(status);
                      }
                    });
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
  }else{
    if(skip_patients.length > 0){
      $("#skipped_rows_parent1").show();
      $("#skipped_rows_link_patient").data("skip_row",skip_patients);
      newAlert('danger', "Patient Details are invalid.");
    }else{
      $("#skipped_rows_parent1").hide();
      $("#skipped_rows_link_patient").data("skip_row","");
      newAlert('danger', "No Patient Details are found in importing File.");
    }
    $("#userfile").val("");
    $('html, body').animate({scrollTop: 0}, 'slow');
  }
}
function downloadPatientSkippedRowsCSV(skip_patients){
  var header = ["first_nm", "last_nm", "date_of_birth", "user_email", "phone", "address1", "address2", "ename", "ephone", "gender", "country", "state", "city", "pincode", "Ethnicity", "Status", "erelation", "height", "weight", "waist", "update_ts", "doctype", "user_id", "Procedure", "Medication", "Condition", "Allergies", "Family_Medical_History","Reason For Skip"];
  skip_patients.unshift(header);
  var csvContent = "data:text/csv;charset=utf-8,";
  skip_patients.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < skip_patients.length ? dataString+ "\n" : dataString;
  });
  var encodedUri = encodeURI(csvContent);
  $("#import_skipped_rows_link_patient").attr("href",encodedUri);
  $("#import_skipped_rows_link_patient").attr("download", "error.csv");
  document.getElementById("import_skipped_rows_link_patient").click();
  $("#skipped_rows_parent1").hide();
}


function calculateDOBFromAge(age) {
  var dyear = moment().subtract(Number(age), 'years');
  dyear.month("June");
  dyear.date("01");
  return dyear;
}

function getAgeFromDOB(dob){
  var birthdate = moment(dob).format("YYYY-MM-DD");
  return moment().diff(birthdate, 'years');
}

function saveSinglePatient($obj,print,fpage){
  $obj.attr("disabled","disabled");
  if(singleUserValidation()){
    $("#isu_patient_dhp_id").val("SHS-"+getInvitationcode());
    $obj.addClass("ajax-loader-large");
    // $("#save_patient_label").css("visibility","hidden");
    var allergies_array = [];
    $(".save-allergies").each( function(){
      if($(this).find(".issu_name_allergies").val() != "Select Allergies" && $(this).find(".issu_name_severe").val() != "Select Severe" && $(this).find(".issu_name_reaction").val() != "Select Reaction"){
        var bulk_allergies = "";
        bulk_allergies += $(this).find(".issu_name_allergies").val()+","; 
        bulk_allergies += $(this).find(".issu_name_severe").val()+","; 
        bulk_allergies += $(this).find(".issu_name_reaction").val(); 
        allergies_array.push(bulk_allergies);
      }
    });
    
    var procedure_array = $("#isu_procedure").val(),
        medication_array    = $("#isu_medication").val().split(","),
        condition_array     = $("#isu_condition").val(),
        d                   = new Date(),
        user_id             = $.couch.newUUID(),
        relation_condition  = [],
        medication_bulk_doc = [],
        isu_patient_medication_doc,
        fmh_doc,
        isu_patient_medication_doc,
        isu_pi_data,
        isu_contactdata,
        isu_cron_record_doc,
        isu_more_subscriber_doc,
        isu_subscriber_doc;

    if(fpage === undefined){
      fpage = "ASU";
    }

    if(medication_array.length > 0) {
      for(var i=0;i<medication_array.length;i++){
        if(medication_array[i] != ""){
          isu_patient_medication_doc = {
            doctype:                              "currentMedications",
            medications_added_from_addNewPatient: "Yes",
            update_ts:                            d,
            user_id:                              user_id,
            drug:                                 medication_array[i],
            doctor_name:                        "",
            doctor_id:                        "",
            favorite_drug:                        "",
            medication_instructions:              "",
            route:                                "",
            drug_quantity:                        "",
            desperse_form:                        "",
            substitution:                         "",
            pharmacy_doc_id:                      "",
            pharmacy:                             "",
            pharmacy_instructions:                "",
            drug_strength:                        "",
            drug_unit:                            "",
            drug_start_date:                      "",
            drug_end_date:                        "",
            medication_chart_note:                "",
            medication_time:                      [],
            Notified:                             "N",
            Medication_Taken:                     "N"
          };
          medication_bulk_doc.push(isu_patient_medication_doc);
        }  
      }  
    }
    
    isu_pi_data = {
      MaritalStatus:  $("#isu_status").val(),
      address1:       $("#isu_address1").val(),
      address2:       $("#isu_address2").val(),
      bloodgroup:     $("#isu_blood_group").val(),
      city:           $("#isu_city").val(),
      country:        $("#isu_country").val(),
      doctype:        "UserInfo",
      // user_email:     $("#isu_email").val(),
      ename:          $("#isu_ename").val(),
      ephone:         $("#isu_ephone").val(),
      erelation:      $("#isu_erelation").val(),
      first_nm:       $("#isu_first_name").val(),
      gender:         $("#isu_sex").val(),
      initial:        false,
      update_ts:      d,
      last_nm:        $("#isu_last_name").val(),
      patient_dhp_id: $("#isu_patient_dhp_id").val(),
      phone:          $("#isu_phone").val(),
      pincode:        $("#isu_pincode").val(),
      state:          $("#isu_state").val(),
      user_email:     $("#isu_email").val(),
      free_credits:        3,
      credit_start_date:   moment(d).format("YYYY-MM-DD"),
      credit_end_date:     moment(d).add(4, 'months').format("YYYY-MM-DD"),
      applied_coupen_code: [],
      purchased_credits:   0,
      user_id:        user_id      
    };
    
    isu_contactdata = {
      _id:            user_id,
      //first_nm:     $("#isu_first_name").val(),
      //last_nm:      $("#isu_last_name").val(),
      //gender:       $("#isu_sex").val(),
      //country:      $("#isu_country").val(),
      //state:        $("#isu_state").val(),
      //city:         $("#isu_city").val(),
      //pincode:      $("#isu_pincode").val(),
      //Status:       $("#isu_status").val(),
      //phone:        $("#isu_phone").val(),
      //ename:        $("#isu_ename").val(),
      //ephone:       $("#isu_ephone").val(),
      //erelation:    $("#isu_erelation").val(),
      //address1:     $("#isu_address1").val(),
      //address2:     $("#isu_address2").val(),
      //blood_group:  $("#isu_blood_group").val(),
      doctype:        "UserInfo",
      user_id:        user_id,
      patient_dhp_id: $("#isu_patient_dhp_id").val(),
      user_email:     $("#isu_email").val(),
      update_ts:      d,
      insert_ts:      d,
      height:         $("#isu_height").val(),
      waist:          $("#isu_waist").val(),
      weight:         $("#isu_weight").val(),
      Procedure:      procedure_array,
      Medication:     medication_array,
      Condition:      condition_array,
      Allergies:      allergies_array,
      initial:        "",
      Diastolic_bp:   "",
      Pulse:          "",
      Systolic_bp:    "",
      alcohol:        "",
      hdl:            "",
      ldl:            "",
      mobile_id:      "",
      smoking:        "",
      tgl:            ""
    };
    
    isu_cron_record_doc = {
      doctype:        'cronRecords',
      operation_case: '6',
      processed:      'No',
      first_nm:       $("#isu_first_name").val(),
      last_nm:        $("#isu_last_name").val(),
      user_email:     $("#isu_email").val(),
      phone:          $("#isu_phone").val(),
      address1:       $("#isu_address1").val(),
      address2:       $("#isu_address2").val(),
      ename:          $("#isu_ename").val(),
      ephone:         $("#isu_ephone").val(),
      user_id:        user_id,
      gender:         $("#isu_sex").val(),
      country:        $("#isu_country").val(),
      state:          $("#isu_state").val(),
      city:           $("#isu_city").val(),
      pincode:        $("#isu_pincode").val(),
      status:         $("#isu_status").val(),
      erelation:      $("#isu_erelation").val(),
      height:         $("#isu_height").val(),
      weight:         $("#isu_weight").val(),
      waist:          $("#isu_waist").val(),
      blood_group:     $("#isu_blood_group").val(),
      Procedure:      procedure_array,
      Medication:     medication_array,
      Condition:      condition_array,
      Allergies:      allergies_array,
      patient_dhp_id: $("#isu_patient_dhp_id").val(),
      update_ts:      d,
      insert_ts:      d
    }
    
    $(".fmh-parent").each(function(){
      relation_condition.push({
        relation: $(this).find(".isu-fmh-relation").val(),
        condition: $(this).find(".isu-fmh-condition").val()
      })
    });
    var fmh_doc = {
      update_ts: d,
      relations:              relation_condition,
      doctype:                "Family_Medical_History",
      user_id:                user_id
    }
    if(fpage == "ASU"){
      var physician_list             = $("#isu_physicians").val(),
          condition_bulk_docs        = [],
          isu_bulk_subscriber_doc    = [];
      isu_cron_record_doc.doctor_ids = [];
      // For assigning a patient to multiple doctors
      for(var i = 0;i<physician_list.length;i++){
        if($("#single_user_critical").is(":checked")){
          var condition = {
            CONDITION:          'From Doctor Note',
            CONDITION_SEVERITY: 'High',
            doctype:            'Conditions',
            user_id:            user_id,
            doctor_id:          physician_list[i],
            insert_ts:          new Date()
          };
          condition_bulk_docs.push(condition);
        }
        isu_more_subscriber_doc = {
          Designation:     "",
          Email:           $("#isu_physicians option").filter("option[value='"+physician_list[i]+"']").data("email"),
          Name:            $("#isu_physicians option").filter("option[value='"+physician_list[i]+"']").text(),
          Phone:           $("#isu_physicians option").filter("option[value='"+physician_list[i]+"']").data("phone"),
          Relation:        "Doctor",
          "Select Report": "All conditions",
          doctor_id:       physician_list[i],
          doctype:         "Subscriber",
          insert_ts:       d,
          user_id:         user_id,
          User_firstname:  $("#isu_first_name").val(),
          User_lastname:   $("#isu_last_name").val(),
          patient_dhp_id:  $("#isu_patient_dhp_id").val(),
          dhp_code:        pd_data.dhp_code,
          frequency:       ""
        };
        if(pd_data.level == "Doctor"){
          isu_more_subscriber_doc.added_by = "Doctor";
          isu_more_subscriber_doc.adder_id = pd_data._id;
          isu_more_subscriber_doc.payment_status = "unpaid";
        }
        else{
          isu_more_subscriber_doc.added_by = "Front_Desk";
          isu_more_subscriber_doc.adder_id = pd_data._id;
          isu_more_subscriber_doc.payment_status = "unpaid";
        }
        if($("#single_user_critical").is(":checked")){
          isu_more_subscriber_doc.report_freq = $("#single_user_alerts_option").val();
        }
        if($("#single_user_reports").is(":checked")){
          isu_more_subscriber_doc.alerts = $("#single_user_alerts_option").val();
        }
        isu_bulk_subscriber_doc.push(isu_more_subscriber_doc);
        isu_cron_record_doc.doctor_ids.push(physician_list[i]);
      }
    }else{
      isu_subscriber_doc = {
        Designation:     "",
        Email:           "",
        Name:            "",
        Phone:           "",
        Relation:        "Doctor",
        "Select Report": "All conditions",
        doctor_id:       "",
        doctype:         "Subscriber",
        insert_ts:       d,
        user_id:         user_id,
        User_firstname:  $("#isu_first_name").val(),
        User_lastname:   $("#isu_last_name").val(),
        patient_dhp_id:  $("#isu_patient_dhp_id").val(),
        frequency:       ""
      };
      if($("#single_user_critical").is(":checked")){
        isu_subscriber_doc.report_freq = $("#single_user_alerts_option").val();
      }
      if($("#single_user_reports").is(":checked")){
        isu_subscriber_doc.alerts = $("#single_user_alerts_option").val();
      }
      isu_contactdata.subscribe_doctor = $("#isu_dr_practise_id").val();
    }
    if($("#isu_date_of_birth").css("display") == "none"){
      var age = calculateDOBFromAge($("#isu_age").val()).format("YYYY-MM-DD");
      isu_cron_record_doc.date_of_birth = age;
      isu_pi_data.date_of_birth         = age;
      isu_cron_record_doc.age           = $("#isu_age").val();
      isu_pi_data.age                   = $("#isu_age").val();
    }else{
      var tmp_age = $("#isu_date_of_birth").val();
      var frmt_age;
      if(tmp_age.match(/[a-z]/i)){
        frmt_age = getAge(tmp_age)
      }else{
        frmt_age = getAgeFromDOB(tmp_age);
      }

      isu_cron_record_doc.date_of_birth = $("#isu_date_of_birth").val();
      isu_cron_record_doc.age           = frmt_age ;

      // isu_contactdata.date_of_birth = $("#isu_date_of_birth").val();
      // isu_contactdata.age           = frmt_age;

      isu_pi_data.date_of_birth = $("#isu_date_of_birth").val();
      isu_pi_data.age           = frmt_age;
    }

    date_of_birth = $("#isu_date_of_birth").val();
    if($("#isu_email").val() == "emailnotprovided@digitalhealthpulse.com"){
      $.couch.db(personal_details_db).view("tamsa/getPatientPhoneNumber",{
        success: function(data){
          singleUserSaveRequest(data,user_id,fpage,isu_contactdata,isu_pi_data,fmh_doc,isu_cron_record_doc,isu_subscriber_doc,isu_bulk_subscriber_doc,condition_bulk_docs,medication_bulk_doc,$obj,print);
        },
        error: function(data){
        },
        key : [$("#isu_phone").val(),$("#isu_first_name").val().trim()]
      })
    }else{
      $.couch.db(personal_details_db).view("tamsa/getPatientEmail",{
        success: function(data){
          $.couch.db(replicated_db).view("tamsa/getUserInfo",{
            success: function(data2){
              if (data2.rows.length > 0) {
                if(fpage == "TC") {
                  newAlertForModal('danger', 'Email is already in use.', "register_subscriber_modal");
                  $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
                }
                else {
                  newAlert('danger', 'Email is already in use.');
                  $('html, body').animate({scrollTop: 0}, 'slow');
                }

                $obj.removeAttr("disabled");
                $obj.removeClass("ajax-loader-large");
                // $("#save_patient_label").css("visibility","visible");
              }
              else {
                singleUserSaveRequest(data,user_id,fpage,isu_contactdata,isu_pi_data,fmh_doc,isu_cron_record_doc,isu_subscriber_doc,isu_bulk_subscriber_doc,condition_bulk_docs,medication_bulk_doc,$obj,print);
              }
            },
            error: function(data){
            },
            key : $("#isu_email").val()
          });
        },
        error: function(data){
        },
        key : $("#isu_email").val()
      });
    }
  }else{
    $obj.removeAttr("disabled");
    return false;   
  }
}

function clearPatientAddForm() {
  $("#isu_first_name").val("");
  $("#isu_last_name").val("");
  $("#isu_date_of_birth").val("");
  $("#isu_blood_group").val("");
  $("#isu_email").val("").removeAttr("readonly");
  $("#isu_phone").val("");
  $("#isu_address1").val("");
  $("#isu_address2").val("");
  $("#isu_ename").val("");
  $("#isu_ephone").val("");
  $("#isu_sex").val("");
  $("#isu_state").val("select state");
  $("#isu_city").val("select city");
  $("#isu_pincode").val("");
  $("#isu_status").val("");
  $("#isu_erelation").val("");
  $("#isu_height").val("");
  $("#isu_weight").val("");
  $("#isu_waist").val("");
  $("#isu_BMI").val("");
  $("#isu_procedure").val("");
  $("#isu_medication").val("");
  $("#isu_condition").val("");
  $("#isu_allergies").val("");
  $(".remove-fmh").trigger("click");
  $(".isu-fmh-relation, .isu-fmh-condition").val("Select");
}

function getStates(state,stateval){
  $.couch.db(db).view("tamsa/getCitiesByState", {
    success:function(data){
      $("#"+state).empty();
      $("#"+state).html('<option selected="selected" value="select state">Select State</option>');      
      for(var i = 0; i<data.rows.length; i++ ){
        $("#"+state).append("<option>"+data.rows[i].key+"</option>");
      }
      if(stateval){
        $("#"+state).val(stateval);
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    },
    reduce:true,
    group:true
  });
}

function getCities(selectedstate, cityid, cityval){
  $.couch.db(db).view("tamsa/getCitiesByState", {
    success:function(data){
      if(data.rows.length > 0){
        $("#"+cityid).empty();
        $("#"+cityid).html('<option selected="selected" value="select city">Select city</option>');
        for(var i = 0; i<data.rows[0].value.length; i++){
          $("#"+cityid).append("<option>"+data.rows[0].value[i]+"</option>");
        }
        if(cityval)$("#"+cityid).val(cityval);
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    },
    key:selectedstate,
    reduce:false,
    group:false
  });
}

function singleUserSaveRequest(data,user_id,fpage,isu_contactdata,isu_pi_data,fmh_doc,isu_cron_record_doc,isu_subscriber_doc,isu_bulk_subscriber_doc,condition_bulk_docs,medication_bulk_doc,$obj,print){
  if(data.rows.length == 0){
    $.couch.db(db).saveDoc(isu_contactdata,{
      success: function(data) {
        $.couch.db(personal_details_db).saveDoc(isu_pi_data,{
          success: function(data) {
            $.couch.db(db).saveDoc(fmh_doc, {
              success: function(data) {
              },
              error: function(data,error,reason) {
                if(fpage == "TC"){
                  newAlertForModal('danger',reason,'register_subscriber_modal');
                  $('html, body, #register_subscriber_modal').animate({scrollTop: 0}, 'slow');
                }else{
                  newAlert('danger', reason);
                  $('html, body').animate({scrollTop: 0}, 'slow');
                }
              }
            });
            if(fpage == "TC"){
              clearPatientAddForm();
              $obj.removeClass("ajax-loader-large");
              // $("#save_patient_label").css("visibility","visible");
              $('#register_subscriber_modal').modal("hide");
              if($("#isu_dr_practise_id").val().trim().length > 0){
                $.couch.db(replicated_db).view("tamsa/getDoctorPractiseCode",{
                  success:function(data){
                    if(data.rows.length > 0){
                      isu_cron_record_doc.doctor_ids = [];
                      isu_cron_record_doc.doctor_ids.push(data.rows[0].value._id);
                      isu_subscriber_doc.doctor_id  = data.rows[0].value._id;
                      isu_subscriber_doc.dhp_code   = data.rows[0].value.dhp_code;
                      isu_subscriber_doc.Email      = data.rows[0].value.email;
                      isu_subscriber_doc.Name       = data.rows[0].value.first_name +" "+data.rows[0].value.last_name;
                      isu_subscriber_doc.Phone      = data.rows[0].value.phone;
                      
                      if(data.rows[0].value.level == "Doctor"){
                        isu_subscriber_doc.added_by = "Doctor";
                      }
                      else{
                        isu_subscriber_doc.added_by = "Front_Desk";
                      }
                      isu_subscriber_doc.payment_status = "unpaid";
                      isu_subscriber_doc.adder_id = data.rows[0].value._id;
                      for(var j=0;j<medication_bulk_doc.length;j++){
                        medication_bulk_doc[j].doctor_id = data.rows[0].value._id;
                        medication_bulk_doc[j].Name      = data.rows[0].value.first_name +" "+data.rows[0].value.last_name;
                      }
                      $.couch.db(db).saveDoc(isu_subscriber_doc,{
                        success:function(data){
                          $.couch.db(db).saveDoc(isu_cron_record_doc,{
                            success: function(data){
                              $.couch.db(db).bulkSave({"docs": medication_bulk_doc}, {
                                success: function(data) {
                                },
                                error: function(data){
                                  console.log(status);
                                }
                              });
                            },
                            error: function(data,error,reason) {
                            }
                          });
                          newAlertForModal('success',"User Successfully registered.",'register_subscriber_modal');
                          $('html, body, #register_subscriber_modal').animate({scrollTop: 0}, 'slow');
                          return false;
                        },
                        error:function(data,error,reason){
                          newAlertForModal('danger',reason,'register_subscriber_modal');
                          $('html, body, #register_subscriber_modal').animate({scrollTop: 0}, 'slow');
                          return false;
                        }
                      });
                    }
                    else {
                      $.couch.db(db).saveDoc(isu_cron_record_doc,{
                        success: function(data){
                        },
                        error: function(data){
                          console.log(status);
                        }
                      });
                    }
                  },
                  error:function(data,error,reason){
                    newAlertForModal('danger',reason,'register_subscriber_modal');
                    $('html, body, #register_subscriber_modal').animate({scrollTop: 0}, 'slow');
                    return false;
                  },
                  key:$("#isu_dr_practise_id").val()
                });
              }
              else {
                $.couch.db(db).saveDoc(isu_cron_record_doc,{
                  success: function(data){
                  },
                  error: function(data){
                    console.log(status);
                  }
                });
              }
              $.cookie('TC_patient_id',user_id,{ expires: 365 });
              $.cookie('TC_patient_email',isu_contactdata.user_email,{ expires: 365 });
              $.cookie('TC_patient_dhp_id',isu_contactdata.patient_dhp_id,{ expires: 365 });
              window.location = "telemedicine.html";
            }else{
              $.couch.db(db).bulkSave({"docs": isu_bulk_subscriber_doc}, {
                success:function(data){
                  for(var j=0;j<medication_bulk_doc.length;j++){
                    medication_bulk_doc[j].doctor_id = pd_data._id;
                    medication_bulk_doc[j].doctor_name      = pd_data.first_name+" "+pd_data.last_name;
                  }
                  $.couch.db(db).bulkSave({"docs": medication_bulk_doc}, {
                    success: function(data) {
                      if(print == "print_file"){
                        printPatientDHPIDSlip($("#isu_patient_dhp_id").val(),pd_data.first_name+ " " +pd_data.last_name,$("#isu_first_name").val()+ " " +$("#isu_last_name").val(),isu_cron_record_doc.age,$("#isu_sex").val(),$("#isu_address1").val()+" "+$("#isu_address2").val(),$("#isu_phone").val(),isu_contactdata.insert_ts);
                      }
                      // clearPatientAddForm();
                    },
                    error: function(data){
                      console.log(status);
                    }
                  });
                  if($("#single_user_critical").is(":checked")){
                    $.couch.db(db).bulkSave({"docs": condition_bulk_docs}, {
                      success:function(data){
                        $.couch.db(db).saveDoc(isu_cron_record_doc,{
                          success: function(data){
                          },
                          error: function(data){
                            console.log(status);
                          }
                        });
                        newAlert('success', 'Patient added successfully.');
                        $('html, body').animate({scrollTop: 0}, 'slow');
                        $obj.removeClass("ajax-loader-large");
                        // $("#save_patient_label").css("visibility","visible");
                      },
                      error:function(error,reason){
                        console.log(error);
                        $obj.removeClass("ajax-loader-large");
                        // $("#save_patient_label").css("visibility","visible");
                      }
                    });
                  }
                  else {
                    $.couch.db(db).saveDoc(isu_cron_record_doc,{
                      success: function(data){
                        if(print == "print_file"){
                          printPatientDHPIDSlip($("#isu_patient_dhp_id").val(),pd_data.first_name+ " " +pd_data.last_name,$("#isu_first_name").val()+ " " +$("#isu_last_name").val(),isu_cron_record_doc.age,$("#isu_sex").val(),$("#isu_address1").val()+" "+$("#isu_address2").val(),$("#isu_phone").val(),isu_contactdata.insert_ts);
                         } 
                        clearPatientAddForm();
                      },
                      error: function(data){
                        console.log(status);
                      }
                    });
                    newAlert('success', 'Patient added successfully.');
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    $obj.removeClass("ajax-loader-large");
                    // $("#save_patient_label").css("visibility","visible");
                  }
                },
                error:function(data,error,reason){
                  console.log(error);
                  $obj.removeClass("ajax-loader-large");
                  // $("#save_patient_label").css("visibility","visible");
                }
              }); 
            }
          },
          error: function(data,error,reason) {
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
          }
        });
      },
      error: function(data, error, reason) {
        if(fpage == "TC"){
          $('html, body, #register_subscriber_modal').animate({scrollTop: 0}, 'slow');
          newAlertForModal('error',reason,"register_subscriber_modal");
        }else{
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
        $obj.removeClass("ajax-loader-large");
        // $("#save_patient_label").css("visibility","visible");
      }
    });
  }else{
    if(fpage == "TC") {
      newAlertForModal('danger', 'Patient already registered.', "register_subscriber_modal");
      $('#register_subscriber_modal').animate({scrollTop: 0}, 'slow');
    }
    else {
      newAlert('danger', 'Patient already registered.');
      $('html, body').animate({scrollTop: 0}, 'slow');
    }

    $obj.removeClass("ajax-loader-large");
    // $("#save_patient_label").css("visibility","visible");
  }
  $obj.removeAttr("disabled");
 }

function dhpCodeInAll() {
  $.couch.db(db).view("tamsa/tempGetSubscribers",{
    success:function(data){
      console.log(data);
      for (var i = data.rows.length - 1; i >= 0; i--) {
        
        subDhpCodeInAll(data.rows[i]);
        // data.rows[i].value.patient_dhp_id = "SHS-"+getInvitationcode();
        // $.couch.db(db).saveDoc(data.rows[i].value, {
        //   success: function(data) {
        //       console.log(data);
        //   },
        //   error: function(status) {
        //       console.log(status);
        //   }
        // });
      };
    },
    error:function(data,error,reason){
     console.log(data);
    },
    limit: 50
  });
}

function subDhpCodeInAll(row) {
  console.log(row);
  $.couch.db(replicated_db).view("tamsa/tempGetUserInfo",{
    success:function(userdata){
      if(userdata.rows.length == 1) {
        row.value.dhp_code = userdata.rows[0].value;

        if (row.value.dph_code) {
          delete row.value.dph_code;
        }
        //console.log(row.value);
        $.couch.db(db).saveDoc(row.value, {
          success: function(data) {
              console.log(data);
          },
          error: function(status) {
              console.log(status);
          }
        });
      }
    },
    error:function(userdata,error,reason){
     console.log(userdata);
    },
    key: row.key[0]
  });
}
// function practiceCodeInAll() {
//   $.couch.db(db).view("tamsa/tempGetPatients",{
//     success:function(data){
//       for (var i = data.rows.length - 1; i >= 0; i--) {
//        var extra_doc = {
//          _id:  data.rows[i].value._id,
//          _rev: data.rows[i].value._rev
//        };
//        $.couch.db(db).removeDoc(extra_doc, {
//            success: function(data) {
//            },
//            error: function(status) {
//              console.log(status);
//            }
//        });
//       };
//     },
//     error:function(data,error,reason){
//      console.log(data);
//     }
//   });
// }
