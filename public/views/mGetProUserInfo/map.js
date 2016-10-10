function(doc) {
if(doc.doctype == "ProUserInfo"  || doc.doctype=="MedHis" )
  emit(doc.doctype, doc);
}