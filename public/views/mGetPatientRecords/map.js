function(doc) {
if(doc.doctype == "Patient_Records")
  emit(doc.user_id, doc);
}