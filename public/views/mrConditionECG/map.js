function(doc) {
if(doc.doctype == "ECG" && doc.hw_device_id == "SHS:BT:DEMO:CODE")
  emit([doc.user_id,doc.hw_device_id,doc.created_tstmp], doc);


}