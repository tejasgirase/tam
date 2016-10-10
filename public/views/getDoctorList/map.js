function(doc) {
if(doc.type =='user' && doc.level != "Nurse" && doc.level != "Staff")
  emit(doc.dhp_code,doc);
}