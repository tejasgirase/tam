function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.finalize == "Yes") {
		emit([doc.user_id, doc.template_name,doc.specialization,doc.update_ts], doc);
	}
}