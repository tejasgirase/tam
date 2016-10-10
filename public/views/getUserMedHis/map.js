function(doc) {
if(doc.doctype == "UserMedHis" && doc.user_id)
  emit([doc.user_id,doc.insert_ts], doc);
}