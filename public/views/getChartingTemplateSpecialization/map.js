function(doc) {
	if(doc.doctype == "charting_template" && doc.specialization){
		emit(doc.specialization,doc);
	}
}