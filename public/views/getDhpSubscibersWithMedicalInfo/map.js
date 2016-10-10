function (doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.dhp_code){
		emit([doc.user_id, 1], doc);
	}

	if(doc.doctype == "UserInfo" && doc.height && doc.weight && doc.user_id){
		emit([doc.user_id, 2], doc);
	}
}