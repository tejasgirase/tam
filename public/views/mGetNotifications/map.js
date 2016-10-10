function(doc) {
if(doc.doctype == "Notificaitons" && doc.ReadReceipt=="N")
  emit(doc.user_id, doc);
}