function(doc) {
	if(doc.doctype == "immunization_details" && doc.dhp_code){
		emit([doc.dhp_code,doc.immunization_name],doc.immunization_name);
	} 
}