function(doc) {
	if(doc.doctype == "charting_template"){
		emit([doc.dhp_code,doc.publish,doc.specialization],doc);
	}
}