function(doc) {
  if (doc.doctype == "UserInfo" && doc.user_id && doc.patient_dhp_id) {
    emit([doc.patient_dhp_id, doc.user_id]);
  }
}