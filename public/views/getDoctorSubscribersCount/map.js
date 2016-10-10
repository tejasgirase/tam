function(doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.dhp_code){
  		emit([doc.doctor_id,doc.dhp_code],doc);
	}
}