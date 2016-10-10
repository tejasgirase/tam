function(doc) {
if(doc.doctype =='Subscriber' && doc.doctor_id && doc.Name)
  emit([doc.doctor_id, doc.Name], doc.doctor_id);
}