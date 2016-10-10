function(doc) {
if(doc.doctype == "Diet")
  emit([doc.doctype, doc.user_id], doc);
}