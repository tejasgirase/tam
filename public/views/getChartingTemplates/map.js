function(doc) {
	if(doc.doctype == "charting_template" && doc.doctor_id && doc.dhp_code) {
	  emit([doc.dhp_code,doc.publish,doc.template_name],doc);
	}
}