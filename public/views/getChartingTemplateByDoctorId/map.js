function(doc) {
	if(doc.doctype == "patient_charting_template" && doc.finalize == "Yes") {
		emit([doc.dhp_code, doc.template_name,doc.specialization,doc.doctor_id], doc);
	}
}
