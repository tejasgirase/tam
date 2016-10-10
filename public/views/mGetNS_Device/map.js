function(doc) {
if(doc.doctype == "NSDevice")
  emit(doc.user_id, doc);
}