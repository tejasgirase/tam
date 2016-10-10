function(doc) {
if(doc.doctype == "Subscriber")
  emit([doc.doctype, doc.user_id], doc);
}