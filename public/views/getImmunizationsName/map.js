function(doc) {
	if(doc.doctype == "immunization_schedule" && doc.days && doc.patient_type == "child"){
		for(var i=0;i<doc.vaccine.length;i++){
			emit(doc.vaccine[i].vaccine_name,doc);
		}
	} 
}