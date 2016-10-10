function(doc) {
if(doc.doctype == "Exercise")
  emit(doc.user_id, doc);
}