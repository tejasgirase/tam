function(doc) {
 if(doc.doctype == "refer_a_doc" && doc.referred_doctor_name && doc.rd_doctor_email)
  emit(doc.doctor_id, doc);
}
