function(doc) {
if(doc.doctype == "VaccineDetails" || doc.doctype == "ScreeningDetails" || doc.doctype=="PersInfo" )
  emit(doc.user_id, doc);
}