function(doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname){
  		emit([doc.user_id,doc.doctor_id]);
	}
}