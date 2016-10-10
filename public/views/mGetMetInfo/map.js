function(doc) {
if(doc.doctype =='UserInfo')
  emit([doc.doctype,doc.user_id], doc);
}