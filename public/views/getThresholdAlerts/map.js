function(doc) {
if(doc.doctype =='Analytics')
  emit([doc.doctor_id, doc.user_id, doc.Analytics],doc);
}