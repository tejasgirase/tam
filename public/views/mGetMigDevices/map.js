function(doc) {
if(doc.doctype =='MigDevices' && doc.MigrationStatus == "InProgress")
  emit(doc.user_id,doc);
}