function (doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.doctor_id){
		emit([doc.doctor_id, doc.user_id], doc.user_id)
	}
}