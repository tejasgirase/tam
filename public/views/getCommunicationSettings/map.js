function(doc) {
if(doc.doctype == "communication_setting")
  emit(doc.dhp_code,doc);
}