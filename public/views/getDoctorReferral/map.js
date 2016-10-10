function(doc) {
if(doc.doctype =='Referral')
  emit([doc.read_receipt, doc.doctor_id, doc.sender_doctor_id, doc.user_id], doc);
}