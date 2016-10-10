function(doc) {
if(doc.doctype == "Authorisation")
  emit([doc.doctype, doc.user_id], doc);
}