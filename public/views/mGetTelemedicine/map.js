function(doc) {
if(doc.doctype == "inquiry")
  emit( doc.user_id, doc);
}