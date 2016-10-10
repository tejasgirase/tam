function (doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.dhp_code) {
		emit([0,doc.dhp_code],doc);
	}
	if (doc.doctype == "UserInfo" && doc.user_id && doc.patient_tags) {
  	emit([1,doc.user_id], doc);
 	}
}