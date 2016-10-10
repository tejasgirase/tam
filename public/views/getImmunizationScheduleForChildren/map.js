function(doc) {
	if(doc.doctype == "immunization_schedule" && doc.days){
		emit(doc.days,doc.Vaccine_Name);
	} 
}