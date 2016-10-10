function(doc) {
if(doc.doctype == "FAQ")
  emit(doc.doctype, doc);
}