function (doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.dhp_code){
		emit([doc.User_firstname + " " + doc.User_lastname,doc.user_id,doc.patient_dhp_id]);
		emit([doc.patient_dhp_id,doc.user_id,doc.User_firstname + " " + doc.User_lastname]);
	}
}