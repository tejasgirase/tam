function(doc) {
	if (doc.doctype == "UserInfo" && doc.user_id && doc.first_nm) {
  	emit([doc.user_id, 1], doc);
 	}
}