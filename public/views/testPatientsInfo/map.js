function (doc) {
	if (doc.doctype == "UserInfo" && doc.user_id) {
  	emit(doc.user_id, doc);
 	}
}