function(doc) {
  if (doc.doctype == "medication_list") {
    for (var idx in doc.medication_list) {
	var Isndex = doc.medication_list.indexOf(doc.medication_list[idx]);
      emit([doc.dhp_code, doc.medication_list[idx].drug_name, doc.medication_list[idx].strength, doc.medication_list[idx].units, doc.medication_list[idx].type, (doc.medication_list[idx].route ? doc.medication_list[idx].route : ""),Isndex], doc.medication_list[idx].drug_name);
      emit(doc.medication_list[idx].drug_name);
    }
  }
}