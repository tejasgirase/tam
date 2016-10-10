function (doc) {
	if (doc.user_id && doc.first_nm && doc.doctype =="UserInfo" && doc.patient_dhp_id) {
	  emit(doc.user_id, doc);
	}
}