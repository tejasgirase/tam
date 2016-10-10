function(doc) {
if(doc.doctype == "Vaccination")
  emit([doc.doctype,doc.user_id], doc);
}