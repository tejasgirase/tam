function (doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.dhp_code) {
		emit([doc.user_id,doc.dhp_code,doc.doctor_id,doc.Name]);
	}
}