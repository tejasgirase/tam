function(doc) {
if(doc.doctype=="VaccineDetails")
    emit(doc.user_id,doc)
}