function(doc) {
if(doc.type =='user' && doc.name)
  emit(doc.name,doc);
}