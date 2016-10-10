function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.update_ts) {
		emit([doc.dhp_code,doc.update_ts],doc);
	}
}
