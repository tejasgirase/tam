function(doc) {
if(doc.doctype =='Analytics' || doc.doctype == 'Subscriber' || (doc.doctype == "patient_careplan" && doc.active == "yes"))
  emit(doc.user_id,doc);
}