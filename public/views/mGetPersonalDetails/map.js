function(doc) {
if(doc.doctype == "UserInfo" )
  	
	emit(doc.user_id, doc);
}