function(doc) {
if(doc.doctype =='Referral' && doc.sender_doctor_id)
  emit(doc.sender_doctor_id,doc);
}