function(doc) {
	if (doc.doctype == 'Subscriber' && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.doctor_id && doc.patient_dhp_id) {
		emit([doc.user_id, 0], doc);
	}else if (doc.doctype == 'Conditions' && doc.user_id && doc.CONDITION_SEVERITY) {
		emit([doc.user_id, 1, doc.CONDITION_SEVERITY], doc);		
	}else if(doc.doctype == "UserInfo" && doc.user_id){
		emit([doc.user_id, 2],doc);
	}else if(doc.doctype == "SelfCare" && doc.user_id && doc.insert_ts){
		emit([doc.user_id, 3],doc);
	}
}