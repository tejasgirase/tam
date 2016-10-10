function(doc) {
  if(doc.doctype == "diagnosis_procedures")
    emit(doc.dhp_code,doc);
}