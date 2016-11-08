function (doc, req) {
	var temp;
	if(doc._id == "indian_states_cities" || doc._id == "mets_risk_analysis_range" || doc._id == "cvd_risk_analysis_range" || doc._id == "soapnote_charting_template" || doc._id == "lab_reference_value" ){
		return true;
	}
	if(doc.dhp_code && doc.dhp_code == req.query.dhp_code){
		return true
	}

	if(req.query.doctor_list && req.query.doctor_list != ""){
		var querylist = req.query.doctor_list.split("|");
		for(var i=0;i<querylist.length;i++){
			if(doc.doctor_id != "" && querylist[i] == doc.doctor_id){
				temp = true;
				break;
			}else{
				temp = false;
			}	
		}
	}	

	if(req.query.patient_list && req.query.patient_list != ""){
		var patient_querylist = req.query.patient_list.split("|");
		for(var i=0;i<patient_querylist.length;i++){
			if(doc.user_id != "" && patient_querylist[i] == doc.user_id){
				temp = true;
				break;
			}else{
				temp = false;
			}	
		}
	}

	if(temp){
		return true;
	}else{
		return false;
	}	
}	