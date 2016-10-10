function(doc) {
if(doc.doctype == "AlertDetails")
  emit([doc.doctype, doc.user_id], doc);
}