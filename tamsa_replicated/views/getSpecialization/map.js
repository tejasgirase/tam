function(doc) {
if(doc.type =='user' && doc.specialization)
  emit(doc.specialization, doc._id);
}