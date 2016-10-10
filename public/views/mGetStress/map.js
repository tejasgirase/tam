function(doc) {
if(doc.doctype == "StressnSleep" )
  emit(doc.user_id, doc);
}