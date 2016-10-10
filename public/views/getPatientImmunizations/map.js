function(doc) {
	if(doc.doctype == "patient_immunization_details" && doc.immunization_info){
		for(var i=0;i<doc.immunization_info.length;i++) {
			emit([doc.user_id,doc.immunization_info[i].immunization_name,doc.immunization_info[i].dose_name],doc.immunization_info[i]);
		}		
	}
}