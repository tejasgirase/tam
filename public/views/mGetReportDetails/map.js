function(doc) {
if(doc.doctype == "UserInfo" || doc.doctype == "UserMedHis")
  	emit(doc.user_id, doc);
}