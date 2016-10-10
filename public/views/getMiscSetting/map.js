function(doc) {
	if(doc.doctype == "misc_setting"){
	  emit([doc.doctor_id,doc.dhp_code],doc);
	}
}