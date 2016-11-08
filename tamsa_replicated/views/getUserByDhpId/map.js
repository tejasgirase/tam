function(doc) {
if(doc.dhp_code && doc.admin && !doc.delete)
  emit([doc.dhp_code,doc.admin], doc);
}