function(doc) {
if(doc.doctype =='MapDevices')
  emit(doc.user_id,doc);
}