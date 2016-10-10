//need to run on DHP
//local = False,False
//babybeeps = False,True
//DHP = True,True
//Start:: To Add Dhp Code in Charting Templates
function addDHPToPatientChartingTemplate(){
  //var view = "getChartingTemplateByDoctorId"; // form patient_charting_template
  var view = "getChartingTemplates"; //for charting_template
  $.couch.db(db).view("tamsa/"+view,{
    success:function(data){
      for(var i=0;i<data.rows.length;i++){
        updateDHPToChartingTemplateData(data.rows[i].doc);
      }
    },
    error:function(data){
      console.log(data);
    },
    include_docs:true,
    reduce:false
  });
}

function updateDHPToChartingTemplateData(data){
  $.couch.db(replicated_db).openDoc(data.doctor_id,{
    success:function(ddata){
      var newdata = data;
      newdata.doctor_name = ddata.first_name + " " +  ddata.last_name;
      newdata.practice_code = ddata.random_code;
      newdata.dhp_code = ddata.dhp_code;
      //console.log(newdata);
       $.couch.db(db).saveDoc(newdata,{
         success:function(sdata){
           console.log(sdata);
         },
         error:function(data){
           console.log(data);
         }
       });
    },
    error:function(data){
      console.log(data);
    }
  });
}
//End:: To Add Dhp Code in Charting Templates

function updateDrugStopDateInMedication(){
  $.couch.db(db).view("tamsa/tempGetMedicationByUserid",{
    success:function(data){
      for(var i=0;i<data.rows.length;i++){
        modifyDrugStopDateToDrugEndDate(data.rows[i].doc);
      }
    },
    error:function(data){
      console.log(data);
    },
    include_docs:true
  });
}

function modifyDrugStopDateToDrugEndDate(data){
  var newdata = data;
  newdata.drug_end_date = newdata.drug_stop_date;
  delete newdata.drug_stop_date;
  $.couch.db(db).saveDoc(newdata,{
    success:function(chkdata){
      console.log(chkdata);
    },
    error:function(data,error,reason){
      console.log(error);
    }
  });
}
//Done on babybeeps dhp
function addPatientDHPToUserinfoDoc() {
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
   success: function(data) {
    for (var i = data.rows.length - 1; i >= 0; i--) {
      if (data.rows[i].key[1] == 1 && data.rows[i].value.unique_invitation_code) {
        //console.log(data.rows[i]);
        renameTopatientDhpCode(data.rows[i].value);
      }
    };
   },
   error: function(status) {
     console.log(status);
   }
  });
}

function renameTopatientDhpCode(row) {
  row.patient_dhp_id = row.unique_invitation_code;
  delete row.unique_invitation_code;

  $.couch.db(db).saveDoc(row, {
    success: function(data) {
      console.log(data);
    },
    error: function(status) {
      console.log(status);
    }
  });
}



function renameCreateTimestampToInsertTS(){
  $.couch.db(db).view("tamsa/changeCreateTimestamp", {
    success: function(data) {
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          //console.log(data.rows[i].key);
          //console.log(data.rows[i].doc);
          var newdata = data.rows[i].doc;
          newdata.insert_ts = newdata.create_timestamp;
          delete newdata.create_timestamp;
          console.log(newdata);
          $.couch.db(db).saveDoc(newdata, {
            success: function(data) {
                console.log(data);
            },
            error: function(status) {
                console.log(status);
            }
          });
        }
      }else{
        console.log("no more data with create timestamp");
      }
    },
    error: function(status) {
      console.log(status);
    },
    include_docs:true    
  });
}

function renameLastChgdTsmp(){
  $.couch.db(db).view("tamsa/changeLastChgdTstmp", {
    success: function(data) {
      console.log(data.rows.length);
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
  //        console.log(data.rows[i].doc._id + " --> " +data.rows[i].doc.phone +" --> "+data.rows[i].doc.user_email);
          var newdata = data.rows[i].doc;
            newdata.update_ts = newdata.last_chgd_tstmp;
            delete newdata.last_chgd_tstmp;
            console.log(newdata);
          $.couch.db(db).saveDoc(newdata, {
              success: function(data) {
                  console.log(data);
              },
              error: function(status) {
                  console.log(status);
              }
            });
                 
        }
      }else{
        console.log("no more data with last chgd timestamp");
      }
    },
    error: function(status) {
      console.log(status);
    },
    include_docs:true,
  });
}

function renameCreatedToInsertTS(){
 $.couch.db(db).view("tamsa/changeTimestampToInsertTS", {
   success: function(data) {
     console.log(data.rows.length);
      if(data.rows.length > 0){
       for(var i=0;i<data.rows.length;i++){
 //        console.log(data.rows[i].doc._id + " --> " +data.rows[i].doc.phone +" --> "+data.rows[i].doc.user_email);
         
         var newdata = data.rows[i].doc;
           newdata.insert_ts = newdata.created_tstmp;
           delete newdata.created_tstmp;
           console.log(newdata);
         
         $.couch.db(db).saveDoc(newdata, {
             success: function(data) {
                 console.log(data);
             },
             error: function(status) {
                 console.log(status);
             }
           });
                
       }
     }else{
       console.log("no more data with last chgd timestamp");
     }
   },
   error: function(status) {
     console.log(status);
   },
   include_docs:true,
   limit:100
 });
}

function renameLastChangedTimestampToUpdateTS(){
  $.couch.db(db).view("tamsa/testFamilyMedicalHistory", {
    success: function(data) {
      console.log(data.rows.length);
      for(var i=0;i<data.rows.length;i++){
        if(data.rows[i].doc.last_changed_timestamp){
          var newdata = data.rows[i].doc;
          newdata.update_ts = newdata.last_changed_timestamp;
          delete newdata.last_changed_timestamp;
          console.log(newdata);
          var count = 0
            $.couch.db(db).saveDoc(newdata, {
              success: function(data) {
                console.log(data);
                count++;
              },
              error: function(status) {
                console.log(status);
              }
            });
          console.log(count)
        }
      }
    },
    error: function(status) {
      console.log(status);
    },
    include_docs:true
  });
}

function updateUserInfoInPiDBFromDB5(){
  $.couch.db(db).view("tamsa/getPatientsInfoOnly",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          getPIFromUserId(data.rows[i].value);
        }
      }else{
        console.log("no data found");
      }
    },
    error:function(data){
      console.log(data);
    }
  });
}

function getPIFromUserId(userdata){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(udata){
      updateValueForPIDB(udata,userdata);     
    },
    error:function(edata){
      console.log(edata);
    },
    key:userdata.user_id
  });
}

function updateValueForPIDB(udata,userdata){
  var newdata = userdata;
  if(udata.rows.length > 0){
    //console.log(udata.rows);
    //console.log(newdata);
    console.log("in IF");    
    newdata._id = udata.rows[0].value._id;
    newdata._rev = udata.rows[0].value._rev;
    newdata.MaritalStatus = newdata.Status;
    newdata.initial    = "TRUE";
    newdata.work       = "";

    delete newdata.Allergies;
    delete newdata.Condition;
    delete newdata.Medication;
    delete newdata.Procedure;
    delete newdata.height;
    delete newdata.weight;
    delete newdata.waist;
    delete newdata.insert_ts;
    delete newdata.Status;
    delete newdata.Family_Medical_History;
    console.log(newdata);

    $.couch.db(personal_details_db).saveDoc(newdata,{
      success:function(data){
        console.log(data);
      },
      error:function(data,error,reason){
        console.log(data);
      }
    });
  }else{
    console.log("in else");
    if(newdata.Status){
      newdata.MaritalStatus = newdata.Status;
    }else{
      newdata.MaritalStatus = "";
    }
    newdata.initial       = "TRUE";
    newdata.work          = "";

    delete newdata.Allergies;
    delete newdata.Condition;
    delete newdata.Medication;
    delete newdata.Procedure;
    delete newdata.height;
    delete newdata.weight;
    delete newdata.waist;
    delete newdata.insert_ts;
    delete newdata.Status;
    delete newdata.Family_Medical_History;
    delete newdata._id;
    delete newdata._rev;
    delete newdata.Family_Condition;
    delete newdata.Family_physician;
    console.log(newdata);

    $.couch.db(personal_details_db).saveDoc(newdata,{
      success:function(data){
        console.log(data);
      },
      error:function(data,error,reason){
        console.log(data);
      }
    });
  }
}

function updateReferralDocWithPatientDHPID(){
  $.couch.db(db).view("tamsa/getDoctorReferral",{
    success:function(data){
      // console.log(data);
      for(var i=0;i<data.rows.length;i++){
        updateReferralDoc(data.rows[i].value);
      }
    },
    error:function(status){
      console.log(status);
    },
    reduce:false,
    group:false
  });
}

function updateReferralDoc(data){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(udata){
      console.log(udata);
      var newdata = data;
      newdata.patient_dhp_id = udata.rows[0].value.patient_dhp_id;
      console.log(newdata);

      $.couch.db(db).saveDoc(newdata,{
        success:function(data){
          console.log(data);
        },
        error:function(status){
          console.log(status);
        }
      });
    },
    error:function(status){
      console.log(status);
    },
    key:data.user_id
  });  
}

//done babybeeps dhp
function updateEmailIdToUserEmailInUserInfoDoc(){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(data){
      console.log(data);
      for(var i=0;i<data.rows.length;i++){
        updateEmailIdToUserEmail(data.rows[i].value);
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    },
    limit:10
  });
}

function updateEmailIdToUserEmail(udata){
  var newdata        = udata;
  console.log(udata);
  if(udata.emailid){
    newdata.user_email = udata.emailid;
    delete newdata.emailid;
  }
  newdata.initial    = false;
  console.log(newdata); 
  saveUserEmail(newdata);
  
}

function saveUserEmail(newdata){
    $.couch.db(personal_details_db).saveDoc(newdata,{
      success:function(data){
        console.log(data);
      },
      error:function(data,error,reason){
        console.log(reason);
      }
    });
}



function deleteDocFromID(id,mydb){
  $.couch.db(mydb).openDoc(id,{
    success:function(data){
      var newdoc = {
        _id:  data._id,
        _rev: data._rev
      };
      
      $.couch.db(mydb).removeDoc(newdoc, {
        success: function(data) {
          console.log(data);
        },
        error: function(data) {
          console.log(data);
        }
      }) 
    },
    error:function(data){
      console.log(data);
    }
  });
}

function openLogDoc(id){
  $.couch.db("logs").openDoc(id,{
    success:function(data){
      console.log(data);
      for(var i=0;i<data.success.length;i++){
        deleteDocFromID(data.success[i].pi_db,personal_details_db);
        deleteDocFromID(data.success[i].db,db);
        deleteDocFromID(data.success[i].lab_doc,db);
        deleteDocFromID(data.success[i].med_his,db);
        deleteDocFromID(data.success[i].selfcare,db);
        deleteDocFromID(data.success[i].Patient_Notes,db);
        deleteDocFromID(data.success[i].subscriber_doc,db);
      }
    },
    error:function(data){
      console.log(data);
    }
  });
}


//need to run on DHP
//local = True
//babybeeps = True
//DHP = False
//Start:: To remove Subscribers documents which are not having PI info
function removeSubscriberWithoutUserInfo(){
  $.couch.db(db).view("tamsa/getDhpSubscriberByName",{
    success:function(data){
      //console.log(data);
      for(var i=0;i<data.rows.length;i++){
        removePatientInformation(data.rows[i].doc.user_id,data.rows[i].doc._id,data.rows[i].doc._rev);
      }
    },
    error:function(data){
      console.log(data);
    },
    include_docs:true,
    reduce:false
  });
}

function removePatientInformation(userid,id,rev){
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function(data){
      if(data.rows.length >0){
        console.log("found" + " -- " + userid+" -- "+id);
      }else{
        console.log(userid+" -- "+id);
        var remove_doc = {
          _id: id,
          _rev: rev
        }
        $.couch.db(db).removeDoc(remove_doc,{
          success:function(data){
            console.log(data);
            console.log("removed user id" + userid);
          },
          error:function(data){
            console.log(data);
          }
        });
      }
    },
    error:function(data){
      console.log(data);
    },
    key:userid
  });  
}
//End:: To remove Subscribers documents which are not having PI info
//to add dhp code in appointments run following code
//Done Babybeeps DHP
function addDhpCodeInAppointments(){
  $.couch.db(db).view("tamsa/getAppointmentByDate",{
    success:function(data){
      for(var i=0;i<data.rows.length;i++){
        getDoctorDetailsForAppointment(data.rows[i].doc)
      }
    },error:function(data,error,reason){
      console.log(error);
    },
    include_docs:true
  });
}

function getDoctorDetailsForAppointment(data){
  $.couch.db(replicated_db).openDoc(data.doctor_id,{
    success:function(docdata){
      if (!(data.dhp_code)) {
        data.dhp_code = docdata.dhp_code
      }
      data.status = "scheduled";
      data.flag = "Low";
      $.couch.db(db).saveDoc(data,{
        success:function(sdata){
          console.log(sdata);
        },
        error:function(data,error,reason){
          console.log(reason);
        }
      });
    },
    error:function(data,error,reason){
      console.log(reason);
    }
  });
}

//to copy view result to destination
function copyDefaultDoseDocFromImmunizationDetails(viewname){
  $.couch.db(db).saveDoc({"_id":"vaccination_default_rules"},{
    success:function(vaccine_data){
      $.couch.db(db).view("tamsa/getImmunizationDetails",{
        success:function(data){
          if(data.rows.length > 0){
            var temparray=[]; 
            for(var i=0;i<data.rows.length;i++){
              temparray.push({
                vaccine_names:data.rows[i].doc.vaccine_names,
                default_dose:data.rows[i].doc.default_dose,
                vaccination_name:data.rows[i].doc.immunization_name
              });
            }
            var savedoc = {
              _id:vaccine_data.id,
              _rev:vaccine_data.rev,
              vaccination_details:temparray
            }
            $.couch.db(db).saveDoc(savedoc,{
              success:function(data){
                console.log(data);
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        include_docs: true
      })
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

function resetCustomDose(viewname){
  $.couch.db(db).view("tamsa/getImmunizationDetails",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          saveCustomDose(data.rows[i].doc);
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    include_docs:true
  });
}

function saveCustomDose(data){
  var newdata = data;
  delete newdata.default_dose;
  delete newdata.vaccine_names;
  $.couch.db(db).saveDoc(newdata,{
    success:function(data){
      console.log(data);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}
var temparray=["0e33c17316bae34249e719e8da005768", "0e33c17316bae34249e719e8da01afce", "0e33c17316bae34249e719e8da007f74", "0e33c17316bae34249e719e8da0154d3", "0e33c17316bae34249e719e8da003fc8", "0e33c17316bae34249e719e8da00cf2b", "0e33c17316bae34249e719e8da019477", "0e33c17316bae34249e719e8da0179a4", "0e33c17316bae34249e719e8da01ca75", "0e33c17316bae34249e719e8da011eff", "0e33c17316bae34249e719e8da01a2a5", "0e33c17316bae34249e719e8da012edb", "0e33c17316bae34249e719e8da00da92", "0e33c17316bae34249e719e8da006a72", "0e33c17316bae34249e719e8da00e62c", "0e33c17316bae34249e719e8da010475", "0e33c17316bae34249e719e8da009a7b", "0e33c17316bae34249e719e8da01630a", "0e33c17316bae34249e719e8da013fb2","vaccination_default_rules"];

function replicateImmunization(){
  $.couch.replicate(db, "http://nimesh:nimesh@192.168.0.67:5984/meluha_db5", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
  }, {
    doc_ids: temparray
  });  
}

//Remaining on DHP
//run after kiran add labs on DHP
function updateLabByCityView(){
  $.couch.db(db).view("tamsa/getLabsByCity",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          changeStateFieldName(data.rows[i].doc);
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    include_docs:true,
    reduce:false,
    limit:100
  });
}

function changeStateFieldName(data){
  var newdata   = data;
  if(newdata.State){
    newdata.state = newdata.State;
    delete newdata.State; 
  }
  if(newdata.City){
    newdata.city  = newdata.City;
    delete newdata.City;
  }
  $.couch.db(db).saveDoc(newdata,{
    success:function(data){
      console.log(data);
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
  // console.log(newdata);
}

function copyDefaultDoseDocFromImmunizationDetails(viewname){
  $.couch.db(db).saveDoc({"_id":"screening_default_rules"},{
    success:function(screening_data){
      var alert_data = {
       "insert_ts": "2016-01-11T11:14:58.381Z",
       "dhp_code": "H-testingdhp",
       "doctype": "health_maintenance_alerts",
       "alert_name": "alcohol alerts",
       "type": "Recommendation",
       "gender": "Male",
       "min_age": "18",
       "min_age_choice": "Year",
       "max_age": "35",
       "max_age_choice": "Year",
       "is_every_visit": true,
       "is_status_active": true,
       "risk_factors": [],
       "grade": "A",
       "alert_code": "alcohol 100",
       "recommendation": "for youth",
       "url": "no",
       "source": "no source",
       "test_interval": "6",
       "test_interval_choice": "Month"
    }
      $.couch.db(db).view("tamsa/getScreeningScheduleForAdults",{
        success:function(data){
          if(data.rows.length > 0){
            var temparray=[]; 
            for(var i=0;i<data.rows.length;i++){
              temparray.push({
                vaccine_names:data.rows[i].doc.vaccine_names,
                default_dose:data.rows[i].doc.default_dose,
                vaccination_name:data.rows[i].doc.immunization_name
              });
            }
            var savedoc = {
              _id:screening_data.id,
              _rev:screening_data.rev,
              vaccination_details:temparray
            }
            $.couch.db(db).saveDoc(savedoc,{
              success:function(data){
                console.log(data);
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        include_docs: true
      })
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }
  });
}

//local = True
//babybeeps = True
//DHP = True
//Start:: To Show Charting Template in Descending order by insert timestamp With Patient Name
function getChartingTemplatesForDoctorDashboard() {
  $.couch.db(db).view("tamsa/addPatientNameInPatientChartingTemplates",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          getPatientDetailsFromUserId(data.rows[i].doc);
        }
      }else{
        console.log("no charting templates found.");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $('html, body').animate({scrollTop: 0},'slow');
      return false;
    },
    startkey:[pd_data._id],
    emdkey:[pd_data._id,{}],
    include_docs:true,
  });
}

function getPatientDetailsFromUserId(data) {
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
    success:function (pdata) {
      if(pdata.rows.length > 0) {
        var newdata = data;
        newdata.patient_first_name = pdata.rows[0].doc.first_nm;
        newdata.patient_last_name = pdata.rows[0].doc.last_nm;

        $.couch.db(db).saveDoc(newdata, {
          success:function(sdata) {
            console.log(data);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }else {
        console.log("no User Details are found.");
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    key:data.user_id,
    include_docs:true
  });
}
//End:: To Show Charting Template in Descending order by insert timestamp With Patient Name



function deleteViewResult() {
  $.couch.db(db).view("tamsa/addPatientNameInPatientChartingTemplates",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          console.log(data.rows[i].key[0]);
          //deleteDocFromID(data.rows[i].key[0]);
        }
      }else{
        console.log("No Records found");
      }
    },
    error:function(data,error,reason){
      
    }
  });
}

//To merge Lab and Imaging Server
//run on babybeeps done
//run on DHP remaining
//view change as following
//  if((doc.doctype == "LabOrder" || doc.doctype == "ImagingOrder") && doc.cancelled != "yes"){
//    emit([doc.doctor_id,doc.user_id],doc);
//  }

function mergeLabAndImagingOrder() {
  $.couch.db(db).view("tamsa/getLabImagingOrders",{
    success:function(data){
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length;i++){
          var newdata = data.rows[i].doc;
          if(newdata.doctype == "LabOrder") newdata.order_type = "lab"
          else if(newdata.doctype == "ImagingOrder") newdata.order_type = "imaging"
          newdata.doctype = "LabImagingOrder",
          $.couch.db(db).saveDoc(newdata, {
            success:function(data) {
              console.log(data);
            },
            error:function(data,error,reason){
              console.log(reason);
              return false;
            }
          });
        }
      }else{
        console.log("No Records found");
      }
    },
    error:function(data,error,reason){
      console.log(reason); 
    },
    include_docs:true
  });
}

//To add DHp Code in Patient Medications
//run on babybeeps remaining
//run on DHP done
//view used restructurePatientMedications
//remove View after run on production

function addDhpCodeToPatientMedications() {
  $.couch.db(db).view("tamsa/restructurePatientMedications", {
    success: function (data) {
      if(data.rows.length > 0) {
        for(var i=0;i<data.rows.length;i++){
          if(!data.rows[i].doc.dhp_code){
            getDHpCodeFromDoctorId(data.rows[i].doc);
          }
        }
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    },
    include_docs:true
  });
}

function getDHpCodeFromDoctorId(doc_data) {
  var newdata = doc_data;
  $.couch.db(replicated_db).openDoc(doc_data.doctor_id, {
    success: function(data) {
      if(data.dhp_code) {
        newdata.dhp_code = data.dhp_code;
        $.couch.db(db).saveDoc(newdata, {
          success:function (sucdata) {
            console.log(sucdata);
          },
          error:function(data,error,reason){
            console.log(reason);
          }
        });
      }else {
        console.log("in else");
        console.log(doc_data._id);
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    }
  });
}

//To add gender in subscriber Document
//run on babybeeps done
//run on DHP done
//view used restructurePatientMedications
//remove View after run on production
function addGenderToSubscriberDoc() {
  $.couch.db(db).view("tamsa/getDHPSubscribers", {
    success: function (data) {
      if(data.rows.length > 0) {
        for(var i=0;i<data.rows.length;i++){
          if(!data.rows[i].doc.gender){
            getGenderFromUserID(data.rows[i].doc);
          }
        }
      }
    },
    error:function(data,error,reason){
      newAlert("danger",reason);
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    },
    reduce:false,
    group:false,
    include_docs:true
  });
}

function getGenderFromUserID(doc_data) {
  var newdata = doc_data;
  $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
    success: function(data) {
      if(data.rows.length > 0) {
        newdata.gender = data.rows[0].doc.gender;
         $.couch.db(db).saveDoc(newdata, {
          success:function (sucdata) {
            console.log(sucdata);
          },
          error:function(data,error,reason){
            console.log(reason);
          }
        });
      }else {
        console.log("in else");
        console.log(doc_data._id);
      }
    },
    error:function(data,error,reason){
      console.log(reason);
    },
    key:doc_data.user_id,
    include_docs:true
  });
}