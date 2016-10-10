function(doc) {
  if(doc.doctype == 'print_settings')
    emit(doc.dhp_code,doc);
}