function (doc) {
	if(doc.doctype == "currentMedications") {
		emit(doc);
	}
}