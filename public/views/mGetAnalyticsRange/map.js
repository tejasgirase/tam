function(doc) {
if(doc.doctype && doc.doctype =='SelfCare')
  emit([doc.doctype, doc.user_id, doc.insert_ts_int], doc);
}