function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.update_ts && doc.finalize == "No") {
		emit([doc.doctor_id,doc.update_ts],doc);
	}
}
