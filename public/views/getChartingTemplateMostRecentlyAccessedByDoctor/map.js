function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.dhp_code && doc.doctor_id && doc.update_ts) {
		emit([doc.doctor_id,doc.update_ts],doc);
	}
}