function(doc) {
	if(doc.doctype == "PhysicianNotes" && doc.visit_type)
	{
		emit([doc.doctor_id, doc.user_id, doc.insert_ts.substring(0,10), 0]);
	}
	if(doc.doctype == "patient_charting_template" && doc.finalize == "Yes") 
	{
		emit([doc.doctor_id, doc.user_id, doc.update_ts.substring(0,10), 1]);
	}
}