function (doc) {
	if(doc.doctype == 'Subscriber' && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.doctor_id && doc.patient_dhp_id){
		emit([doc.user_id,0], doc);
	}else if (doc.doctype == 'Conditions' && doc.user_id && doc.CONDITION_SEVERITY == "High") {
		emit([doc.user_id, 1, doc.CONDITION_SEVERITY], doc);		
	}
}