function (doc) {
	if(doc.doctype == "currentMedications") {
		emit([0,doc.dhp_code,doc.drug.trim()]);
	}
	if(doc.doctype == "currentMedications" && (doc.current_drug_switched_from || doc.current_drug_switched_to)) {
		emit([1,doc.dhp_code,doc.drug.trim()])
	}
}