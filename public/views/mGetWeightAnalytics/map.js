function(doc) {
if(doc.doctype =='SelfCare' && doc.Value_weight.length > 0 && doc.insert_ts)
  emit([doc.doctype,doc.user_id],[doc.Value_weight, doc.insert_ts]);
}