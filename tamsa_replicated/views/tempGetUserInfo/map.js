function(doc) {
if(doc.type =='user' && doc.name)
  emit(doc._id,doc.dhp_code);
}