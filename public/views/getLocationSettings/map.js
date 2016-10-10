function (doc) {
	if(doc.doctype == "location") {
		emit(doc.dhp_code);
	}
}