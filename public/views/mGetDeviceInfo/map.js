function(doc) {
if(doc.doctype == "DeviceInfo")
  emit([doc.doctype,doc.user_id], doc);
}