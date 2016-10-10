function(doc) {
if(doc.First_Name && doc.Last_Name && doc.user_id && doc.emailid)
	emit(doc.emailid, doc);
}