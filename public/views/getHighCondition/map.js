function(doc) {
 if(doc.doctype == "Conditions" && doc.user_id) {
		emit([doc.doctor_id, doc.CONDITION, doc.user_id]);
	}
}