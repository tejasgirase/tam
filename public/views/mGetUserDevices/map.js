function(doc) {
if(doc.doctype =='MapDevices')
  emit(doc.parent_user_id,doc);
}