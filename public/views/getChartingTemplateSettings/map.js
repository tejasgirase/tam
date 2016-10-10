function(doc) {
if(doc.doctype == "charting_template_settings")
  emit(doc.dhp_code,doc);
}