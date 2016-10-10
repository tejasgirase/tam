function (doc){
	if(doc.doctype == "patient_category_tags")
	emit(doc.dhp_code,doc);
}