function(doc) {
if(doc.type =='user' && doc.name && doc.first_name && doc.last_name && doc.random_code)
  emit(doc.random_code, doc);
}