function(doc) {
  if(doc.doctype == "currentMedications" && doc.drug_stop_date){
    emit(doc._id)
  }
}