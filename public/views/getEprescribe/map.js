function(doc) {
  if(doc.doctype=="Eprescribe")
    emit (doc.doctor_id,doc)
}