function(doc) {
if(doc.doctype == "UserJobDesc")
  emit(doc.user_id, doc);
}