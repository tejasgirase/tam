function(doc) {
if(doc.doctype && doc.created_tstmp)
  emit(doc.doctype, doc);
}