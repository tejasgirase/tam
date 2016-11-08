function(doc) {
if(doc.type =='user' && doc.name && doc.first_name && doc.last_name)
  emit(doc.phone);
}