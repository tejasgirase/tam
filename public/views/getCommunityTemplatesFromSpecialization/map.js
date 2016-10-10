function(doc) {
	if(doc.doctype == "charting_template" && doc.publish == "Yes"){
		emit([doc.publish,doc.specialization],doc);
	}
}