function(doc) {
if(doc.doctype == "Conditions" && doc.CONDITION_STATUS == "Abnormal" && doc.CONDITION_USER_ACTION != "Acknowledged")
  emit([doc.doctype,doc.user_id,doc.hw_device_id], doc);
}