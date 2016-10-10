function(doc) {
  if (doc.doctype == "Subscriber" && doc.user_id && doc.patient_dhp_id && doc.User_firstname && doc.User_lastname && doc.dhp_code) {
    emit([doc.dhp_code,doc.patient_dhp_id, doc.user_id, doc.User_firstname +" "+doc.User_lastname,doc.patient_dhp_id],doc);
    emit([doc.dhp_code,doc.User_firstname +" "+doc.User_lastname, doc.user_id, doc.User_firstname +" "+doc.User_lastname,doc.patient_dhp_id],doc);
  }
}