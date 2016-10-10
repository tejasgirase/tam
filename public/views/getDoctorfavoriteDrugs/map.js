function(doc) {
if(doc.doctype == "currentMedications" && doc.favorite_drug == true)
  emit([doc.doctor_id, doc.drug, doc.drug_strength, doc.drug_unit], doc.drug);
}