function (doc){
	if(doc.doctype == "patient_charting_template" && doc.finalize == "No"){
		emit([doc.dhp_code,doc.user_id,doc.template_name,doc.specialization],doc);
	}
}