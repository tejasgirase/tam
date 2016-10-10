function(doc) {
	if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.Relation == "Doctor" && doc.user_id && doc.doctor_id && doc.patient_dhp_id && doc.dhp_code){
	  emit([doc.dhp_code,doc.patient_dhp_id],doc);
  }
}