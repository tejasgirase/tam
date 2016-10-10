function(doc) {
if(doc.doctype == "TamsaSelfCare")
  emit(doc.user_id, doc);
}