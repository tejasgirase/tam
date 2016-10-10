function(doc) {
  if (doc.doctype == "medication_list") {
    for (var idx in doc.medication_list) {
      emit([doc.dhp_code, doc.medication_list[idx].drug_name.trim()], doc.medication_list[idx].drug_name);
    }
  }
}