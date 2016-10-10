function (doc) {
	if(doc.user_id) {
		emit([doc.user_id,doc.doctor_id,doc.dhp_code]);
	}
}