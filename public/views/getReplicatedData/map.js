function(doc) {
  emit([doc.dhp_code,doc.user_id,doc.doctor_id], doc);
}