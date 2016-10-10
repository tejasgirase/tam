var tamsaRiskCalculator = tamsaRiskCalculator || {};
app.controller("riskCalculatorController",function($scope,$state,$stateParams,tamsaFactories){
  tamsaFactories.pdBack();
  tamsaFactories.getSearchPatient($stateParams.user_id, "patientImageLink", "", activateRiskCalculator);
  function activateRiskCalculator(){
    $(".menu_items").removeClass("active");
    $("#clinical_risk_calculator_link").parent().addClass('active');
    eventBindingsForRiskCalculator();
    tamsaRiskCalculator.getPatientMetabolicRiskParameters();
  }

  function eventBindingsForRiskCalculator(){
    $("#patient_clinical_risk_calculator").on("click","#metabolic_risk_calculator_link",function(){
      tamsaRiskCalculator.getPatientMetabolicRiskParameters();
    });

    $("#patient_clinical_risk_calculator").on("click","#cvd_risk_calculator_link",function(){
      getPatientCVDRiskParameters();
    });

    $("#patient_clinical_risk_calculator").on("click","#calculate_metabolics_risk_score",function(){
      validateRiskFromMetabolicParams("current_risk_score");
    });

    $("#patient_clinical_risk_calculator").on("click","#save_metabolics_risk_score",function(){
      confirmMetabolicRiskScoreSave();
    });

    $("#patient_clinical_risk_calculator").on("click","#yes_metabolic_params_change",function(){
      if($(this).data("action") == "metabolic") saveMetabolicRiskScore()
      else saveCVDRiskScore()
    });

    $("#patient_clinical_risk_calculator").on("click","#no_metabolic_params_change",function(){
      $("#confirm_metabolic_params_modal").hide();
    });

    $("#patient_clinical_risk_calculator").on("click","#save_cvd_risk_score",function(){
      confirmCVDRiskScoreSave();
      // saveCVDRiskScore();
    });

    $("#patient_clinical_risk_calculator").on("click","#calculate_cvd_risk_score",function(){
      validateRiskFromCVDParams("current_cvd_score");
      // calculateRiskFromCVDParams();
    });

    $("#patient_clinical_risk_calculator").on("click",".remove-metabolic-fmh", function() {
      $(this).parent().parent().remove();
    });

    $("#patient_clinical_risk_calculator").on("click",".add-metabolic-fmh", function() {
      addNewFamilyMedicationOnRisk();
    });
  }

  //display at clinical risk calculator
  function metabolicRiskscore(score,min_val,max_val,selector_id){
    var gaugeOptions = gaugeOptionsForRiskCalculators();
    $('#'+selector_id).highcharts(Highcharts.merge(gaugeOptions, {
      yAxis: {
          min: min_val,
          max: max_val,
          title: {
              text: (selector_id == "past_risk_score" ? "Past Score" : "Current Score")
          }
      },
      series: [{
          name: 'Metabolic_ Score',
          data: [score],
          dataLabels: {
            enabled:true,
            formatter: function(){
              var met_score = this.y;
              var t = (max_val - min_val);
              if(met_score >= min_val && met_score < (t/4)){
                s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
                return s;
              }else if(met_score >= (t/4) && met_score < (t/2)){
                s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
                return s;  
              }else if(met_score >= (t/2)){
                s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
                return s;  
              }
            }
          },
          tooltip: {
              valueSuffix: 'revolutions/min'
          }
      }]
    }));
  }

  function cvdRiskScore(score,min_val,max_val,selector){
    var gaugeOptions = gaugeOptionsForRiskCalculators();
    $('#'+selector).highcharts(Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: min_val,
        max: max_val,
        title: {
          text: (selector == "past_cvd_score" ? "Past Score" : "Current Score")
        }
      },
      series: [{
        name: 'Framingham_Score',
        data: [score],
        dataLabels: {
          enabled:true,
          formatter: function(){
            var met_score = this.y;
            if(userinfo.gender == "Male"){
            	if(met_score >= -10 && met_score <= 0){
            	  s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
            	  return s;
            	}else if(met_score >= 1 && met_score <= 10){
            	  s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
            	  return s;  
            	}else if(met_score >= 11){
            	  s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
            	  return s;  
            	}
            }else{
            	if(met_score >= -8 && met_score <= 7){
            	  s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
            	  return s;
            	}else if(met_score >= 8 && met_score <= 17){
            	  s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
            	  return s;
            	}else if(met_score >= 18){
            	  s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
            	  return s;
            	}
            }
          }
        },
        tooltip: {
            valueSuffix: 'revolutions/min'
        }
      }]
    }));
  }

  function clearMetabolicRiskParameters(){
  	$("#waist_mets").val("");
  	$("#triglyceride_mets").val("");
  	$("#hdl_cholesterol_mets").val("");
  	$("#age_mets").val("");
  	$("#bp_systolic_mets").val("");
  	$("#bp_diastolic_mets").val("");
  	$("#fasting_glucose_mets").val("");
  	$("#family_history_relation_mets").val("");
  	$("#family_history_condition_mets").val("");
  }

  tamsaRiskCalculator.getPatientMetabolicRiskParameters = function(){
   	clearMetabolicRiskParameters();
    $("#metabolic_risk_calculator_link").parent().find("div").removeClass("ChoiceTextActive");
    $("#metabolic_risk_calculator_link").addClass("ChoiceTextActive");
    $("#metabolic_risk_calculator_tab").addClass("active");
  	$("#cvd_risk_calculator_tab").removeClass("active");
  	$('.error_not_smoking').html('');
  	$('.metabolic_risk_graph').hide();
  	$('#waist_mets').val(userinfo_medical.waist);
    $("#calculate_metabolics_risk_score").data("waist",$('#waist_mets').val());
  	// if(userinfo.age){
   //    $('#age_mets').val(getAgeFromDOB(userinfo.date_of_birth));
  	// 	$('#age_mets').val(userinfo.age);
  	// }else{
    if(userinfo.date_of_birth) {
      if(userinfo.date_of_birth.match(/[a-z]/i)){
        $('#age_mets').val(getAge(userinfo.date_of_birth));
      }else{
        $('#age_mets').val(getAgeFromDOB(userinfo.date_of_birth));
      }  
    }else {
      $('#age_mets').val("");
      console.log("date of birth not Found.");
    }
  	// }
    $("#calculate_metabolics_risk_score").data("age",$('#age_mets').val());

    for(var i=0;i<userinfo_medical.Condition.length;i++){
      if(userinfo_medical.Condition[i].toLowerCase() == "diabetis" || userinfo_medical.Condition[i].toLowerCase() == "diabetic"){
        $("#diabetic_condition").val("Yes");
        break;
      }else{
        $("#diabetic_condition").val("Select");
      }
    }

    $("#calculate_metabolics_risk_score").data("diabetic_condition",$('#diabetic_condition').val());

  	displayFMHDetailsOnMetabolicRiskScore();

    $.couch.db(db).view("tamsa/getRiskAnalysisScores",{
      success:function(data){
        if(data.rows.length > 0){
          $('#bp_systolic_mets').val(data.rows[0].doc.systolic_bp);
          $('#bp_diastolic_mets').val(data.rows[0].doc.diastolic_bp);
          $('#fasting_glucose_mets').val(data.rows[0].doc.fasting_glucose);
          $('#two_hr_post_glucose').val(data.rows[0].doc.two_hr_post_glucose);
          $('#triglyceride_mets').val(data.rows[0].doc.triglyceride);
          $('#hdl_cholesterol_mets').val(data.rows[0].doc.hdl);
          $("#calculate_metabolics_risk_score").data("current_metabolic_score", data.rows[0].doc.MetabolicScore);
          $("#calculate_metabolics_risk_score").data("past_metabolic_score", data.rows[0].doc.past_metabolic_score);
          $("#calculate_metabolics_risk_score").data("index", data.rows[0].doc._id);
          $("#calculate_metabolics_risk_score").data("rev", data.rows[0].doc._rev);

          $("#calculate_metabolics_risk_score").data("triglyceride",$('#triglyceride_mets').val());
          $("#calculate_metabolics_risk_score").data("hdl_cholesterol",$('#hdl_cholesterol_mets').val());
          $("#calculate_metabolics_risk_score").data("systolic_bp",$('#bp_systolic_mets').val());
          $("#calculate_metabolics_risk_score").data("diastolic_bp",$('#bp_diastolic_mets').val());
          $("#calculate_metabolics_risk_score").data("fasting_glucose",$('#fasting_glucose_mets').val());
          $("#calculate_metabolics_risk_score").data("two_hr_post_glucose",$('#two_hr_post_glucose').val());
        }else{
          $.couch.db(db).view("tamsa/getAnalyticsRange", {
            success: function(sdata) {
              $.couch.db(db).view("tamsa/getUserMedHis",{
                success:function(meddata) {
                  if(sdata.rows.length > 0) {
                    if(sdata.rows[0].doc.Value_Systolic_BP) $('#bp_systolic_mets').val(sdata.rows[0].doc.Value_Systolic_BP)
                    if(sdata.rows[0].doc.Value_Diastolic_BP) $('#bp_diastolic_mets').val(sdata.rows[0].doc.Value_Diastolic_BP)
                    if(sdata.rows[0].doc.Fasting_Glucose) $('#fasting_glucose_mets').val(sdata.rows[0].doc.Fasting_Glucose)
                    if(sdata.rows[0].doc.two_hr_post_glucose) $('#two_hr_post_glucose').val(sdata.rows[0].doc.two_hr_post_glucose)
                  }
                  if(meddata.rows.length > 0) {
                    if(meddata.rows[0].doc.tgl_reading) $('#triglyceride_mets').val(meddata.rows[0].doc.tgl_reading)
                    if(meddata.rows[0].doc.hdl_reading) $('#hdl_cholesterol_mets').val(meddata.rows[0].doc.hdl_reading)
                  }
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                },
                descending:true,
                startkey: [userinfo.user_id,{}],
                endkey: [userinfo.user_id],
                include_docs:true,
                limit:1
              });
            },
            error:function(data,error,reason){
              newAlert('error', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
            },
            descending:true,
            startkey: ['SelfCare',userinfo.user_id,{}],
            endkey: ['SelfCare',userinfo.user_id],
            include_docs:true,
            limit:1
          });
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[userinfo.user_id,"metabolic",{}],
      endkey:[userinfo.user_id,"metabolic"],
      descending:true,
      limit:1,
      include_docs:true
    });  
  }

  function calculateRiskFromMetabolicParams(rdata,selector_id,waist,triglyceride,hdl,systolic_bp,diastolic_bp,fasting_glucose,age,post_glucose,diabetic_condition){
  	var final_risk_score=0;
  	var up,down;
  	// for waist
  	if(userinfo.gender == "Male"){
  		for(var i=0;i<rdata.waist_man.length;i++){
  			down = rdata.waist_man[i].range.split("-")[0];
  			up = rdata.waist_man[i].range.split("-")[1];
  			
  			if(up == "all"){
  				if(Number(waist) >= Number(down)){
  					final_risk_score += Number(rdata.waist_man[i].score);
  					break;
  				}	
  			}else{
  				if(Number(waist) > Number(down) && Number(waist) <= Number(up)){
  					final_risk_score += Number(rdata.waist_man[i].score);
  					break;
  				}	
  			}
  			
  		}
  	}else{
  		for(var i=0;i<rdata.waist_woman.length;i++){
  			down = rdata.waist_woman[i].range.split("-")[0];
  			up = rdata.waist_woman[i].range.split("-")[1];
  			if(up == "all"){
  				if(Number(waist) >= Number(down)){
  					final_risk_score += Number(rdata.waist_man[i].score);
  					break;
  				}	
  			}else{
  				if(Number(waist) >= Number(down) && Number(waist) <= Number(up)){
  					final_risk_score += Number(rdata.waist_man[i].score);
  					break;
  				}
  			}
  		}
  	}
  	// for Triglyceride
  	for(var i=0;i<rdata.Triglyceride.length;i++){
  			down = rdata.Triglyceride[i].range.split("-")[0];
  			up = rdata.Triglyceride[i].range.split("-")[1];
  			if(up == "all"){
  				if(Number(triglyceride) >= Number(down)){
  					final_risk_score += Number(rdata.Triglyceride[i].score);
  					break;
  				}	
  			}else{
  				if(Number(triglyceride) >= Number(down) && Number(triglyceride) <= Number(up)){
  						final_risk_score += Number(rdata.Triglyceride[i].score);
  						break;
  				}	
  			}
  	}
  	// for hdl_cholesterol_mets
  	for(var i=0;i<rdata.HDL.length;i++){
  		down = rdata.HDL[i].range.split("-")[0];
  		up = rdata.HDL[i].range.split("-")[1];
  		if(up == "all"){
  				if(Number(hdl) >= Number(down)){
  					final_risk_score += Number(rdata.HDL[i].score);
  					break;
  				}	
  		}else{
  			if(Number(hdl) >= Number(down) && Number(hdl) <= Number(up)){
  				final_risk_score += Number(rdata.HDL[i].score);
  				break;
  			}	
  		}
  	}
  	// for systolic_bp
  	for(var i=0;i<rdata.systolic_bp.length;i++){
  		down = rdata.systolic_bp[i].range.split("-")[0];
  		up = rdata.systolic_bp[i].range.split("-")[1];
  		if(up == "all"){
  				if(Number(systolic_bp) >= Number(down)){
  					final_risk_score += Number(rdata.systolic_bp[i].score);
  					break;
  				}	
  		}else{
  			if(Number(systolic_bp) >= Number(down) && Number(systolic_bp) <= Number(up)){
  				final_risk_score += Number(rdata.systolic_bp[i].score);
  				break;
  			}	
  		}
  	}
  	// for diastolic_bp
  	for(var i=0;i<rdata.diastolic_bp.length;i++){
  		down = rdata.diastolic_bp[i].range.split("-")[0];
  		up = rdata.diastolic_bp[i].range.split("-")[1];
  		if(up == "all"){
  				if(Number(diastolic_bp) >= Number(down)){
  					final_risk_score += Number(rdata.diastolic_bp[i].score);
  					break;
  				}	
  		}else{
  			if(Number(diastolic_bp) >= Number(down) && Number(diastolic_bp) <= Number(up)){
  				final_risk_score += Number(rdata.diastolic_bp[i].score);
  				break;
  			}	
  		}
  	}
  	// for fasting_glucose
    if(fasting_glucose){
      for(var i=0;i<rdata.fasting_glucose.length;i++){
        down = rdata.fasting_glucose[i].range.split("-")[0];
        up = rdata.fasting_glucose[i].range.split("-")[1];
        if(up == "all"){
          if(Number(fasting_glucose) >= Number(down)){
            final_risk_score += Number(rdata.fasting_glucose[i].score);
            break;
          } 
        }else{
          if(Number(fasting_glucose) >= Number(down) && Number(fasting_glucose) <= Number(up)){
            final_risk_score += Number(rdata.fasting_glucose[i].score);
            break;
          } 
        }
      }
    }else if(post_glucose){
      for(var i=0;i<rdata.two_hr_post_glucose.length;i++){
        down = rdata.two_hr_post_glucose[i].range.split("-")[0];
        up = rdata.two_hr_post_glucose[i].range.split("-")[1];
        if(up == "all"){
          if(Number(post_glucose) >= Number(down)){
            final_risk_score += Number(rdata.two_hr_post_glucose[i].score);
            break;
          } 
        }else{
          if(Number(post_glucose) >= Number(down) && Number(post_glucose) <= Number(up)){
            final_risk_score += Number(rdata.two_hr_post_glucose[i].score);
            break;
          } 
        }
      }
    }
    if(diabetic_condition == "Yes"){
      final_risk_score += 4;
    }
  	// for age
  	for(var i=0;i<rdata.age.length;i++){
  		down = rdata.age[i].range.split("-")[0];
  		up = rdata.age[i].range.split("-")[1];
  		if(up == "all"){
  			if(Number(age) >= Number(down)){
  				final_risk_score += Number(rdata.age[i].score);
  				break;
  			}	
  		}else{
  			if(Number(age) >= Number(down) && Number(age) <= Number(up)){
  				final_risk_score += Number(rdata.age[i].score);
  				break;
  			}	
  		}
  	}

    if($(".mets_fmh_risk_score").length > 0){
      $(".mets_fmh_risk_score").each(function(){
        if(($(this).find(".mets_fmh_relation").val() == "Sister" || $(this).find(".mets_fmh_relation").val() == "Brother" || $(this).find(".mets_fmh_relation").val() == "Father" || $(this).find(".mets_fmh_relation").val() == "Mother" || $(this).find(".mets_fmh_relation").val() == "Grandfather" || $(this).find(".mets_fmh_relation").val() == "Grandmother") && ($(this).find(".mets_fmh_condition").val() == "Diabetis" || $(this).find(".mets_fmh_condition").val() == "hypertension" || $(this).find(".mets_fmh_condition").val() == "cvd")){
          final_risk_score += 2;
          return false;
        }
      });
    }
    //adding ethnic race condition
    final_risk_score += 2;
    metabolicRiskscore(final_risk_score,-1,30,selector_id);
    return final_risk_score;
  }

  function validateRiskFromMetabolicParams(selector_id) {
  	if(validateMetabolicRiskCalculator()){
  		$('.metabolic_risk_graph').show();
      if($("#calculate_metabolics_risk_score").data("waist") == $("#waist_mets").val() &&
         $("#calculate_metabolics_risk_score").data("triglyceride") == $("#triglyceride_mets").val() &&
         $("#calculate_metabolics_risk_score").data("systolic_bp") == $("#bp_systolic_mets").val() &&
         $("#calculate_metabolics_risk_score").data("diastolic_bp") == $("#bp_diastolic_mets").val() &&
         $("#calculate_metabolics_risk_score").data("hdl_cholesterol") == $("#hdl_cholesterol_mets").val() &&
         $("#calculate_metabolics_risk_score").data("fasting_glucose") == $("#fasting_glucose_mets").val() &&
         $("#calculate_metabolics_risk_score").data("two_hr_post_glucose") == $("#two_hr_post_glucose").val() &&
         $("#calculate_metabolics_risk_score").data("diabetic_condition") == $("#diabetic_condition").val() &&
         $("#calculate_metabolics_risk_score").data("age") == $("#age_mets").val()){
          metabolicRiskscore(Number($("#calculate_metabolics_risk_score").data("current_metabolic_score")),-1,30,"current_risk_score");
          if($("#calculate_metabolics_risk_score").data("past_metabolic_score")) {
            metabolicRiskscore(Number($("#calculate_metabolics_risk_score").data("past_metabolic_score")),-1,30,"past_risk_score");
          }else{
            $("#past_risk_score").html('<span style="position: absolute; left: 53px; color: rgb(235, 134, 19); bottom: 74px; font-size: 13px;">No Prior Reference value found.</span>');
          }
      }else{
        $.couch.db(db).openDoc("mets_risk_analysis_range",{
          success:function(rdata){
            var temp_final_score = calculateRiskFromMetabolicParams(rdata,selector_id,$('#waist_mets').val(),$('#triglyceride_mets').val(),$('#hdl_cholesterol_mets').val(),$('#bp_systolic_mets').val(),$('#bp_diastolic_mets').val(),$('#fasting_glucose_mets').val(),$('#age_mets').val(),$("#two_hr_post_glucose").val(),$("#diabetic_condition").val());
            if($("#calculate_metabolics_risk_score").data("current_metabolic_score")) {
              metabolicRiskscore(Number($("#calculate_metabolics_risk_score").data("current_metabolic_score")),-1,30,"past_risk_score");
              $("#calculate_metabolics_risk_score").data("past_metabolic_score",Number($("#calculate_metabolics_risk_score").data("current_metabolic_score")));
            }else{
              $("#past_risk_score").html('<span style="position: absolute; left: 53px; color: rgb(235, 134, 19); bottom: 74px; font-size: 13px;">No Prior Reference value found.</span>');
            }
            $("#calculate_metabolics_risk_score").data("current_metabolic_score",Number($("#calculate_metabolics_risk_score").data("current_metabolic_score")));
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });  
        // metabolicRiskscore(Number($("#calculate_metabolics_risk_score").data("current_metabolic_score")),-1,30,"past_risk_score");
      }
  	}
  }

  function getPatientCVDRiskParameters(){
  	$("#cvd_risk_calculator_link").parent().find("div").removeClass("ChoiceTextActive");
  	$("#cvd_risk_calculator_link").addClass("ChoiceTextActive");
  	$('.error_not_smoking').html('');
  	$("#metabolic_risk_calculator_tab").removeClass("active");
  	$("#cvd_risk_calculator_tab").addClass("active");
  	$('#smoking_cvd').val(userinfo_medical.smoking);
    if(userinfo.date_of_birth) {
      if(userinfo.date_of_birth.match(/[a-z]/i)){
        $('#age_cvd').val(getAge(userinfo.date_of_birth) ? getAge(userinfo.date_of_birth) : "");
      }else{
        $('#age_cvd').val(getAgeFromDOB(userinfo.date_of_birth) ? getAgeFromDOB(userinfo.date_of_birth) : "");
      }
    }else {
      $('#age_cvd').val("");
    }
    $.couch.db(db).view("tamsa/getRiskAnalysisScores",{
      success:function(data){
        if(data.rows.length > 0){
          $('#systolic_bp_cvd').val(data.rows[0].doc.systolic_bp);
          $('#hdl_cholesterol_cvd').val(data.rows[0].doc.hdl);
          $('#total_cholesterol_cvd').val(data.rows[0].doc.total_cholesterol);
          $("#calculate_cvd_risk_score").data("total_cholesterol",$("#total_cholesterol_cvd").val());
          $("#calculate_cvd_risk_score").data("hdl_cholesterol",$("#hdl_cholesterol_cvd").val());
          $("#calculate_cvd_risk_score").data("systolic_bp",$("#systolic_bp_cvd").val());
          $("#calculate_cvd_risk_score").data("age",$("#age_cvd").val());
          $("#calculate_cvd_risk_score").data("smoking",$("#smoking_cvd").val());
          $("#calculate_cvd_risk_score").data("current_cvd_score", data.rows[0].doc.FraminghamScore);
          $("#calculate_cvd_risk_score").data("past_cvd_score", data.rows[0].doc.past_cvd_score);
          $("#calculate_cvd_risk_score").data("index", data.rows[0].doc._id);
          $("#calculate_cvd_risk_score").data("rev", data.rows[0].doc._rev);
        }else{
          $.couch.db(db).view("tamsa/getAnalyticsRange", {
            success: function(sdata) {
              $.couch.db(db).view("tamsa/getUserMedHis",{
                success:function(meddata) {
                  if(sdata.rows.length > 0) {
                    $('#systolic_bp_cvd').val(sdata.rows[0].value.Value_Systolic_BP);
                  }
                  if(meddata.rows.length > 0) {
                    $('#hdl_cholesterol_cvd').val(meddata.rows[0].value.hdl_reading);
                    $('#total_cholesterol_cvd').val(meddata.rows[0].value.total_lipids);
                  }
                },
                error:function(data,error,reason){
                  newAlert("danger",reason);
                  $("html, body").animate({scrollTop: 0}, 'slow');
                  return false;
                },
                descending:true,
                startkey: [userinfo.user_id,{}],
                endkey: [userinfo.user_id],
                include_docs:true,
                limit:1
              });
            },
            error:function(data,error,reason){
              newAlert('error', reason);
              $('html, body').animate({scrollTop: 0}, 'slow');
              return false;
            },
            descending:true,
            startkey: ['SelfCare',userinfo.user_id,{}],
            endkey: ['SelfCare',userinfo.user_id],
            include_docs:true,
            limit:1
          });        
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      startkey:[userinfo.user_id,"cvd",{}],
      endkey:[userinfo.user_id,"cvd"],
      descending:true,
      limit:1,
      include_docs:true
    });  
  }

  function calculateRiskFromCVDParams(rdata,selector){
    var final_risk_score=0;
    var up,down;
    // for age
    for(var i=0;i<rdata.age.length;i++){
      down = rdata.age[i].range.split("-")[0];
      up = rdata.age[i].range.split("-")[1];
      if(up == "all"){
        if(Number($('#age_cvd').val()) >= Number(down)){
          if(userinfo.gender == "Male") final_risk_score += Number(rdata.age[i].man)
          else if(userinfo.gender == "Female") final_risk_score += Number(rdata.age[i].woman)
          break;
        } 
      }else{
        if(Number($('#age_cvd').val()) >= Number(down) && Number($('#age_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male") final_risk_score += Number(rdata.age[i].man)
          else if(userinfo.gender == "Female") final_risk_score += Number(rdata.age[i].woman)
          break;
        } 
      }
    }
    // for Total Cholesterol
    var tempbreak = false;
    for(var i=0;i<rdata.total_cholesterol.length;i++){
      down = rdata.total_cholesterol[i].range.split("-")[0];
      up = rdata.total_cholesterol[i].range.split("-")[1];
      if(up == "all"){
        if(Number($('#total_cholesterol_cvd').val()) >= Number(down)){
          if(userinfo.gender == "Male"){
            for(var j=0;j<rdata.total_cholesterol[i].man_value.length;j++){
              var inner_down = rdata.total_cholesterol[i].man_value[j].age_range.split("-")[0];
              var inner_up   = rdata.total_cholesterol[i].man_value[j].age_range.split("-")[1];
              if(Number($('#age_cvd').val()) >= inner_down && Number($('#age_cvd').val()) <= inner_up){
                final_risk_score += Number(rdata.total_cholesterol[i].man_value[j].value);
                tempbreak = true;
                break;  
              }
            } 
          }else{
            for(var j=0;j<rdata.total_cholesterol[i].man_value.length;j++){
              var inner_down = rdata.total_cholesterol[i].woman_value[j].age_range.split("-")[0];
              var inner_up   = rdata.total_cholesterol[i].woman_value[j].age_range.split("-")[1];
              if(Number($('#age_cvd').val()) >= inner_down && Number($('#age_cvd').val()) <= inner_up){
                final_risk_score += Number(rdata.total_cholesterol[i].woman_value[j].value);
                tempbreak = true;
                break;  
              } 
            }
          }
          if(tempbreak){
            tempbreak = false;
            break;
          }
        } 
      }else{
        if(Number($('#total_cholesterol_cvd').val()) >= Number(down) && Number($('#total_cholesterol_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male"){
            for(var j=0;j<rdata.total_cholesterol[i].man_value.length;j++){
              var inner_down    = rdata.total_cholesterol[i].man_value[j].age_range.split("-")[0];
              var inner_up      = rdata.total_cholesterol[i].man_value[j].age_range.split("-")[1];
              if(Number($('#age_cvd').val()) >= inner_down && Number($('#age_cvd').val()) <= inner_up){
                final_risk_score += Number(rdata.total_cholesterol[i].man_value[j].value);
                tempbreak = true;
                break;                
              }
            }
          }else{
            for(var j=0;j<rdata.total_cholesterol[i].woman_value.length;j++){
              var inner_down    = rdata.total_cholesterol[i].woman_value[j].age_range.split("-")[0];
              var inner_up      = rdata.total_cholesterol[i].woman_value[j].age_range.split("-")[1];
              final_risk_score += Number(rdata.total_cholesterol[i].woman_value[j].value);
              tempbreak = true;
              break;              
            }
          }
          if(tempbreak){
            tempbreak = false;
            break;
          }
        }
      }
    }
    // for smoking
    if($("#smoking_cvd").val() == 0 || $("#smoking_cvd").val() == "No"){
      for(var i=0;i<rdata.smoking.nonsmoker.length;i++){
        down  = rdata.smoking.nonsmoker[i].age_range.split("-")[0];
        up    = rdata.smoking.nonsmoker[i].age_range.split("-")[1];
        if(Number($('#age_cvd').val()) >= Number(down) && Number($('#age_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male") final_risk_score += Number(rdata.smoking.nonsmoker[i].man_value);
          else final_risk_score += Number(rdata.smoking.nonsmoker[i].woman_value);
          break;
        } 
      }
    }else{
      for(var i=0;i<rdata.smoking.smoker.length;i++){
        down  = rdata.smoking.smoker[i].age_range.split("-")[0];
        up    = rdata.smoking.smoker[i].age_range.split("-")[1];
        if(Number($('#age_cvd').val()) >= Number(down) && Number($('#age_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male") final_risk_score += Number(rdata.smoking.smoker[i].man_value);
          else final_risk_score += Number(rdata.smoking.smoker[i].woman_value);
          break;
        } 
      }
    }
    // for HDL
    for(var i=0;i<rdata.HDL.length;i++){
      down = rdata.HDL[i].range.split("-")[0];
      up = rdata.HDL[i].range.split("-")[1];
      if(up == "all"){
        if(Number($('#hdl_cholesterol_cvd').val()) >= Number(down)){
          if(userinfo.gender == "Male"){
            final_risk_score += Number(rdata.HDL[i].man);
          }else{
            final_risk_score += Number(rdata.HDL[i].woman);
          }
          break;
        } 
      }else{
        if(Number($('#hdl_cholesterol_cvd').val()) >= Number(down) && Number($('#hdl_cholesterol_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male"){
            final_risk_score += Number(rdata.HDL[i].man);
          }else{
            final_risk_score += Number(rdata.HDL[i].woman);
          }
          break;
        } 
      }
    }
    for(var i=0;i<rdata.systolic_bp.length;i++){
      down = rdata.systolic_bp[i].range.split("-")[0];
      up = rdata.systolic_bp[i].range.split("-")[1];
      if(up == "all"){
        if(Number($('#systolic_bp_cvd').val()) >= Number(down)){
          if(userinfo.gender == "Male"){
            final_risk_score += Number(rdata.systolic_bp[i].man_treated_value);
          }else{
            final_risk_score += Number(rdata.systolic_bp[i].woman_treated_value);
          }
          break;
        } 
      }else{
        if(Number($('#systolic_bp_cvd').val()) >= Number(down) && Number($('#systolic_bp_cvd').val()) <= Number(up)){
          if(userinfo.gender == "Male"){
            final_risk_score += Number(rdata.systolic_bp[i].man_treated_value);
          }else{
            final_risk_score += Number(rdata.systolic_bp[i].woman_treated_value);
          }
          break;
        } 
      }
    }
    if(userinfo.gender == "Male"){
      var temp_min = -10;
      var temp_max = 20;
    }else{
      var temp_min = -8;
      var temp_max = 27;
    }
    cvdRiskScore(final_risk_score,temp_min,temp_max,selector);
    return final_risk_score;
  }

  function validateRiskFromCVDParams(selector){
    if(validateCVDRiskCalculator()){
      $('.cvd_risk_graph').show();
      if(userinfo.gender == "Male"){
        var temp_min = -10;
        var temp_max = 20;
      }else{
        var temp_min = -8;
        var temp_max = 27;
      }
      if($("#calculate_cvd_risk_score").data("total_cholesterol") == $("#total_cholesterol_cvd").val() &&
      $("#calculate_cvd_risk_score").data("hdl_cholesterol") == $("#hdl_cholesterol_cvd").val() &&
      $("#calculate_cvd_risk_score").data("systolic_bp") == $("#systolic_bp_cvd").val() &&
      $("#calculate_cvd_risk_score").data("age") == $("#age_cvd").val() &&
      $("#calculate_cvd_risk_score").data("smoking") == $("#smoking_cvd").val()){
        cvdRiskScore(Number($("#calculate_cvd_risk_score").data("current_cvd_score")),temp_min,temp_max,"current_cvd_score");  
        if($("#calculate_cvd_risk_score").data("past_cvd_score")) {
          metabolicRiskscore(Number($("#calculate_cvd_risk_score").data("past_cvd_score")),temp_min,temp_max,"past_cvd_score");
        }else{
          $("#past_risk_score").html('<span style="position: absolute; left: 53px; color: rgb(235, 134, 19); bottom: 74px; font-size: 13px;">No Prior Reference value found.</span>');
        }
      }else{
        $.couch.db(db).openDoc("cvd_risk_analysis_range",{
          success:function(rdata){
            var temp_score = calculateRiskFromCVDParams(rdata,selector);
            console.log(temp_score);
            if($("#calculate_cvd_risk_score").data("current_cvd_score")) {
              cvdRiskScore(Number($("#calculate_cvd_risk_score").data("current_cvd_score")),temp_min,temp_max,"past_cvd_score");
              $("#calculate_cvd_risk_score").data("past_cvd_score",Number($("#calculate_cvd_risk_score").data("current_cvd_score")));
            }else{
              $("#past_cvd_score").html('<span style="position: absolute; left: 53px; color: rgb(235, 134, 19); bottom: 74px; font-size: 13px;">No Prior Reference value found.</span>');
            }
            $("#calculate_cvd_risk_score").data("current_cvd_score",Number($("#calculate_cvd_risk_score").data("current_cvd_score")));
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }
    }
  }

  function confirmMetabolicRiskScoreSave(){
    if(validateMetabolicRiskCalculator()){
      if($("#calculate_metabolics_risk_score").data("waist") == $("#waist_mets").val() &&
         $("#calculate_metabolics_risk_score").data("triglyceride") == $("#triglyceride_mets").val() &&
         $("#calculate_metabolics_risk_score").data("systolic_bp") == $("#bp_systolic_mets").val() &&
         $("#calculate_metabolics_risk_score").data("diastolic_bp") == $("#bp_diastolic_mets").val() &&
         $("#calculate_metabolics_risk_score").data("hdl_cholesterol") == $("#hdl_cholesterol_mets").val() &&
         $("#calculate_metabolics_risk_score").data("fasting_glucose") == $("#fasting_glucose_mets").val() &&
         $("#calculate_metabolics_risk_score").data("two_hr_post_glucose") == $("#two_hr_post_glucose").val() &&
         $("#calculate_metabolics_risk_score").data("diabetic_condition") == $("#diabetic_condition").val() &&
         $("#calculate_metabolics_risk_score").data("age") == $("#age_mets").val()){
          newAlert("danger","No data has been changed.");
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
      }else{
        $("#yes_metabolic_params_change").data("action","metabolic");
        $("#confirm_metabolic_params_modal").modal({
          show:true,
          backdrop:'static',
          keyboard:false
        });
      }
    }
  }

  function saveMetabolicRiskScore(){
    $.couch.db(db).openDoc("mets_risk_analysis_range",{
      success:function(rdata){
        var selfcare_doc = {
         Fasting_Glucose:    $("#fasting_glucose_mets").val(),
         HeartRate:          "",
         O2:                 "",
         OutOfRange:         "",
         Respiration_Rate:   "",
         Time_BP:            "Time",
         Time_Fasting:       "Time",
         Time_HeartRate:     "Time",
         Time_Oxygen:        "Time",
         Time_Respiration:   "Time",
         Time_Weight:        "Time",
         Value_Diastolic_BP: $("#bp_diastolic_mets").val(),
         Value_Systolic_BP:  $("#bp_systolic_mets").val(),
         Value_MAP:          calculateMAP(Number($("#bp_systolic_mets").val()),Number($("#bp_diastolic_mets").val())),
         Value_temp:         "",
         Value_weight:       "",
         // weight:             "",
         height:             "",
         bmi:                "",
         waist:              $("#waist_mets").val(),
         doctype:            "SelfCare",
         insert_ts:          new Date(),
         user_id:            userinfo.user_id
        }
        var usermedhis_doc = {
         "doctype":               "UserMedHis",
         "user_id":               userinfo.user_id,
         "Procedure":             [],
         "Medication":            [],
         "Condition":             [],
         "Allergies":             [],
         "alcohol":               "",
         "smoking":               "",
         "hdl_reading":           $("#hdl_cholesterol_mets").val(),
         "ldl_reading":           "",
         "tgl_reading":           $("#triglyceride_mets").val(),
         "cholesterol_date":      "",
         "sbp_reading":           $("#bp_systolic_mets").val(),
         "dbp_reading":           $("#bp_diastolic_mets").val(),
         "Pulse":                 "",
         "bp_date":               "",
         "Fasting Glucose":       $("#fasting_glucose_mets").val(),
         "two_hr_post_glucose":   $("#two_hr_post_glucose").val(),
         "Cholesterl_check_Time": "",
         "fasting_date":          "",
         "tc_reading":            "",
         "update_ts":             "",
         "insert_ts":             new Date()
        }
        var temp_score = calculateRiskFromMetabolicParams(rdata,"current_risk_score",$('#waist_mets').val(),$('#triglyceride_mets').val(),$('#hdl_cholesterol_mets').val(),$('#bp_systolic_mets').val(),$('#bp_diastolic_mets').val(),$('#fasting_glucose_mets').val(),$('#age_mets').val(),$("#two_hr_post_glucose").val(),$("#diabetic_condition").val());
        if($("#calculate_metabolics_risk_score").data("past_metabolic_score") == "") {
          var past_met_score = ($("#calculate_metabolics_risk_score").data("current_metabolic_score") ? $("#calculate_metabolics_risk_score").data("current_metabolic_score") : "");
        }else{
          var past_met_score = ($("#calculate_metabolics_risk_score").data("past_metabolic_score") ? $("#calculate_metabolics_risk_score").data("past_metabolic_score") : "");
        }
        var riskscore_doc = {
          user_id:              userinfo.user_id,
          doctype:              "RiskAnalysisScore",
          MetabolicScore:       temp_score,
          insert_ts:            new Date(),
          systolic_bp:          $("#bp_systolic_mets").val(),
          diastolic_bp:         $("#bp_diastolic_mets").val(),
          fasting_glucose:      $("#fasting_glucose_mets").val(),
          waist:                $("#waist_mets").val(),
          triglyceride:         $("#triglyceride_mets").val(),
          hdl:                  $("#hdl_cholesterol_mets").val(),
          two_hr_post_glucose:  $("#two_hr_post_glucose").val(),
          diabetic_condition:   $("#diabetic_condition").val(),
          age:                  $("#age_mets").val(),
          risk_type:            "metabolic",
          past_metabolic_score: past_met_score
        }
        if($("#calculate_metabolics_risk_score").data("index") && $("#calculate_metabolics_risk_score").data("rev")) {
          riskscore_doc._id  = $("#calculate_metabolics_risk_score").data("index");
          riskscore_doc._rev = $("#calculate_metabolics_risk_score").data("rev");
        }
        var bulk_data = [];
        bulk_data.push(selfcare_doc);
        bulk_data.push(usermedhis_doc);
        bulk_data.push(riskscore_doc);

        $.couch.db(db).bulkSave({"docs":bulk_data},{
          success:function(data){
            $("#confirm_metabolic_params_modal").modal("hide");
            newAlert("success","Risk score updated successfully");
            $("html, body").animate({scrollTop: 0}, 'slow');
            if(verifyFMHAtChartingTemplate("mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition") && validateFamilyMedicalHistory("mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition","chart")){
              tamsaFactories.saveRequestForFMH("risk","mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition");
            }else{
              tamsaRiskCalculator.getPatientMetabolicRiskParameters();
            }
            return false;
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function updateFMHFromRiskCalculator() {
    if(verifyFMHAtChartingTemplate("mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition") && validateFamilyMedicalHistory("mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition","chart")) {
      tamsaFactories.saveRequestForFMH("","mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition");
    }
  }

  function displayFMHDetailsOnMetabolicRiskScore() {
    $(".hide_mets_fmh").remove();
    getPastFamilyMedicalHistory("family_medical_history_mets","mets_fmh_risk_score","mets_fmh_relation","mets_fmh_condition","add-metabolic-fmh");
  }

  function saveCVDRiskScore(){
    $.couch.db(db).openDoc("cvd_risk_analysis_range",{
      success:function(rdata){
        var selfcare_doc = {
         Fasting_Glucose:    "",
         HeartRate:          "",
         O2:                 "",
         OutOfRange:         "",
         Respiration_Rate:   "",
         Time_BP:            "Time",
         Time_Fasting:       "Time",
         Time_HeartRate:     "Time",
         Time_Oxygen:        "Time",
         Time_Respiration:   "Time",
         Time_Weight:        "Time",
         Value_Diastolic_BP: "",
         Value_Systolic_BP:  $("#systolic_bp_cvd").val(),
         Value_MAP:          "",
         Value_temp:         "",
         Value_weight:       "",
         // weight:             "",
         height:             "",
         bmi:                "",
         waist:              "",
         doctype:            "SelfCare",
         insert_ts:          new Date(),
         user_id:            userinfo.user_id
        }
        var usermedhis_doc = {
         "doctype":               "UserMedHis",
         "user_id":               userinfo.user_id,
         "Procedure":             [],
         "Medication":            [],
         "Condition":             [],
         "Allergies":             [],
         "alcohol":               "",
         "smoking":               "",
         "hdl_reading":           $("#hdl_cholesterol_cvd").val(),
         "ldl_reading":           "",
         "tgl_reading":           "",
         "cholesterol_date":      "",
         "sbp_reading":           $("#systolic_bp_cvd").val(),
         "dbp_reading":           "",
         "Pulse":                 "",
         "bp_date":               "",
         "Fasting Glucose":       "",
         "two_hr_post_glucose":   "",
         "Cholesterl_check_Time": "",
         "fasting_date":          "",
         "tc_reading":            $("#total_cholesterol_cvd").val(),
         "update_ts":             "",
         "insert_ts":             new Date()
        }
        var temp_score = calculateRiskFromCVDParams(rdata,"current_cvd_score");

        if($("#calculate_cvd_risk_score").data("past_cvd_score") == "") {
          var past_cvd_score = ($("#calculate_cvd_risk_score").data("current_cvd_score") ? $("#calculate_cvd_risk_score").data("current_cvd_score") : "");
        }else{
          var past_cvd_score = ($("#calculate_cvd_risk_score").data("past_cvd_score") ? $("#calculate_cvd_risk_score").data("past_cvd_score") : "");
        }

        var riskscore_doc = {
          user_id:           userinfo.user_id,
          doctype:           "RiskAnalysisScore",
          FraminghamScore:   temp_score,
          insert_ts:         new Date(),
          systolic_bp:       $("#systolic_bp_cvd").val(),
          hdl:               $("#hdl_cholesterol_cvd").val(),
          total_cholesterol: $("#total_cholesterol_cvd").val(),
          age:               $("#age_cvd").val(),
          smoking:           $("#smoking_cvd").val(),
          risk_type:         "cvd",
          past_cvd_score:    past_cvd_score
        }
        if($("#calculate_cvd_risk_score").data("index") && $("#calculate_cvd_risk_score").data("rev")) {
          riskscore_doc._id  = $("#calculate_cvd_risk_score").data("index");
          riskscore_doc._rev = $("#calculate_cvd_risk_score").data("rev");
        }
        var bulk_data = [];
        bulk_data.push(selfcare_doc);
        bulk_data.push(usermedhis_doc);
        bulk_data.push(riskscore_doc);

        $.couch.db(db).bulkSave({"docs":bulk_data},{
          success:function(data){
            $("#confirm_metabolic_params_modal").modal("hide");
            newAlert("success","Risk score updated successfully");
            $("html, body").animate({scrollTop: 0}, 'slow');
            getPatientCVDRiskParameters();
            return false;
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function confirmCVDRiskScoreSave(){
    if(validateCVDRiskCalculator()){
      if($("#calculate_cvd_risk_score").data("total_cholesterol") == $("#total_cholesterol_cvd").val() &&
      $("#calculate_cvd_risk_score").data("hdl_cholesterol") == $("#hdl_cholesterol_cvd").val() &&
      $("#calculate_cvd_risk_score").data("systolic_bp") == $("#systolic_bp_cvd").val() &&
      $("#calculate_cvd_risk_score").data("age") == $("#age_cvd").val() &&
      $("#calculate_cvd_risk_score").data("smoking") == $("#smoking_cvd").val()){
        newAlert("danger","No data has been changed.");
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        $("#yes_metabolic_params_change").data("action","cvd");
        $("#confirm_metabolic_params_modal").modal({
          show:true,
          backdrop:'static',
          keyboard:false
        });
      }
    }
  }
});

function displayCVDScoreOnChart(scoredata) {
  var gaugeOptions = gaugeOptionsForRiskCalculators();
  if(scoredata){
    if(scoredata.FraminghamScore){
      $("#score_ts").html("Reading Time : <span style='color:#2C3E50;'> " +moment(scoredata.insert_ts).format("YYYY-MM-DD H:m:s")+"</span><a data-toggle='modal' role='button' data-target='#no_more_labs' href='#' style='color: rgb(124, 181, 236); font-weight: bold; float: right; font-size: 13px; text-decoration: underline;'>More Labs</a>");
      if(userinfo.gender == "Male"){
        var temp_min = -10;
        var temp_max = 20;
      }else{
        var temp_min = -8;
        var temp_max = 27;
      }
      $('#framingham_score').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
          min: temp_min,
          max: temp_max,
          title: {
            text: 'Framingham Score'
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Framingham_Score',
          data: [Number(scoredata.FraminghamScore)],
          dataLabels: {
            enabled:true,
            formatter: function(){
              var cvd_score = this.y;
              if(userinfo.gender == "Male"){
                if(cvd_score >= -10 && cvd_score <= 0){
                  s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
                  return s;
                }else if(cvd_score >= 1 && cvd_score <= 10){
                  s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
                  return s;  
                }else if(cvd_score >= 11){
                  s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
                  return s;  
                }
              }else{
                if(cvd_score >= -8 && cvd_score <= 7){
                  s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
                  return s;
                }else if(cvd_score >= 8 && cvd_score <= 17){
                  s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
                  return s;
                }else if(cvd_score >= 18){
                  s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
                  return s;
                }
              }
            }
          },
          tooltip: {
              valueSuffix: 'revolutions/min'
          }
        }]
      }));
    }else {
      $("#framingham_score").html('<span style="position: absolute; font-size: 10px; left: 53px; color: rgb(235, 134, 19); bottom: 74px;">Framingham Score not found.<br>Not enough info availabel.</span>');
    }
  }else {
    $("#framingham_score").html('<span style="position: absolute; font-size: 10px; left: 53px; color: rgb(235, 134, 19); bottom: 74px;">Framingham Score not found.<br>Not enough info availabel.</span>');
  }  
}

function riskScore(scoredata) {
  var gaugeOptions = gaugeOptionsForRiskCalculators();
  //Display risk scores at patient medical History
  if(scoredata && scoredata.MetabolicScore){
    $.couch.db(db).openDoc("mets_risk_analysis_range",{
      success:function(rdata){
        $('#metabolic_score').highcharts(Highcharts.merge(gaugeOptions, {
          yAxis: {
            min: -1,
            max: 30,
            title: {
              text: 'Metabolic Score'
            }
          },
          series: [{
            name: 'Metabolic_ Score',
            data: [Number(scoredata.MetabolicScore)],
            dataLabels: {
              enabled:true,
              formatter: function(){
                var met_score = this.y;
                if(met_score >= -1 && met_score <= 10){
                  s = '<div style="text-align:center"><span style="color:black;">Low</span></div>';
                  return s;
                }else if(met_score >= 11 && met_score <= 20){
                  s = '<div style="text-align:center"><span style="color:black;">Moderate</span></div>';
                  return s;  
                }else if(met_score >= 21){
                  s = '<div style="text-align:center"><span style="color:black;">High</span></div>';
                  return s;  
                }
              }
            },
            tooltip: {
              valueSuffix: 'revolutions/min'
            }
          }]
        }));
      },error:function(data,error,reason){
        newAlert("danger",reason);
        $('body,html').animate({scrollTop: 0}, 'slow');
      }
    });
  }else{
    $("#metabolic_score").html('<span style="position: absolute; font-size: 10px; left: 53px; color: rgb(235, 134, 19); bottom: 74px;">Metabolic Score not found.<br>Not enough info availabel.</span>');
  }
  if($("#mh_BMI").text() != "NA") {
    $('#bmi_score').highcharts(Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: 44,
        title: {
            text: 'BMI Score'
        }
      },
      series: [{
        name: 'BMI Score',
        data: [Number($("#mh_BMI").text())],
        dataLabels: {
          enabled:true,
          formatter: function(){
            var bmi = this.y;
            var s;
            if(bmi < 18.5){
              s = '<div style="text-align:center"><span>'+bmi+'</span><br/><span style="color:black;">UnderWeight</span></div>';
              return s;
            }else if(bmi >= 18.5 && bmi<25){
              s = '<div style="text-align:center"><span></span>'+bmi+'<br/><span style="color:black;">Normal Weight</span></div>';
              return s;  
            }else if(bmi>=25 && bmi<30){
              s = '<div style="text-align:center"><span></span>'+bmi+'<br/><span style="color:black;">Over Weight</span></div>';
              return s;  
            }else{
              s = '<div style="text-align:center"><span></span>'+bmi+'<br/><span style="color:black;">Obesity</span></div>';
              return s;  
            }
          }
        },
        tooltip: {
            valueSuffix: ' revolutions/min'
        }
      }]
    }));
  }else {
    $("#bmi_score").html('<span style="position: absolute; font-size: 10px; left: 53px; color: rgb(235, 134, 19); bottom: 74px;">BMI Score not found.<br>Not enough info availabel.</span>');
  }
}

function gaugeOptionsForRiskCalculators(){
  var guage_settings = {
    chart: {
        type: 'solidgauge',
        width : 290
    },
    title: null,
    pane: {
      center: ['50%', '85%'],
      size: '150%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    // the value axis
    yAxis: {
      stops: [
        [0.25, '#009900'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#DF5353'], // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickPixelInterval: 400,
      tickWidth: 0,
      showFirstLabel:false,
      showLastLabel:false,
      title: {
          y: -70
      },
      labels: {
          y: 16,
          enabled:false
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  }
  return guage_settings;
}