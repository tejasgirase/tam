function (doc) {
	if(doc.doctype == "UserInfo" && doc.first_nm && doc.user_id && doc.phone && doc.patient_dhp_id){
		emit([doc.phone,doc.first_nm], doc.user_id);
	}
}