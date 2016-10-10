function(doc) {
	if(doc.doctype == "careplan_template" && doc.publish == "Yes"){
		emit(doc.template_name, doc);
	}
}