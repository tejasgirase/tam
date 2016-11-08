function(doc) {
  if(doc.doctype =="UserInfo" && doc.first_nm && doc.last_nm && doc.user_id && doc.user_email && doc.patient_dhp_id){
    emit(doc.user_email, [doc.user_id,doc.patient_dhp_id]);
  }
}
