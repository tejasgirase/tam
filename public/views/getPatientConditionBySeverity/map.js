function(doc) {
 if(doc.doctype == "Conditions" && doc.user_id) {
		emit([doc.CONDITION_SEVERITY, doc.user_id, doc.CONDITION, doc.doctor_id], doc.CONDITION)
	}
}