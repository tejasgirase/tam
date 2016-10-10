function(doc) {
  if (doc.doctype == "Subscriber" && doc.user_id && doc.patient_dhp_id && doc.User_firstname && doc.User_lastname && doc.doctor_id) {
    emit([doc.doctor_id,doc.patient_dhp_id, doc.user_id,doc.User_firstname +" "+doc.User_lastname,doc.patient_dhp_id],doc);
    emit([doc.doctor_id,doc.User_firstname +" "+doc.User_lastname, doc.user_id,doc.User_firstname +" "+doc.User_lastname,doc.patient_dhp_id],doc);
  }
}