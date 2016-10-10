function(doc) {
if(doc.doctype == "currentMedications" && doc.prescription_id)
  emit(doc.prescription_id, doc);
}