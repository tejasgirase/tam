function(doc) {
if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && doc.user_id)
  emit([doc.doctype, doc.user_id, doc.insert_ts], doc);
}