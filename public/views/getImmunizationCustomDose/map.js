function(doc) {
	if(doc.doctype == "immunization_details" && doc.dhp_code){
		for(var i=0; i<doc.custom_dose.length; i++) {
			emit(doc.dhp_code,[doc.custom_dose[i],doc.immunization_name]);
		}
	} 
}