function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.dhp_code && doc.update_ts && doc.finalize == "Yes") {
		emit([doc.dhp_code,doc.template_name,doc.specialization],doc);
	}
}