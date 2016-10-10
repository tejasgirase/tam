function(doc) {
if(doc.doctype == "PwdRecvryQues")
  emit(doc.doctype, doc);
}