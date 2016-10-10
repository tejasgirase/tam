function(doc) {
	if(doc.doctype == "hospital_specialization_list" ){
  		emit(doc.dhp_code,doc);
	}
}