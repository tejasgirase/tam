function(doc) {
	if(doc.doctype == "charting_template" && doc.publish == "Yes"){
		  emit([doc.template_name,doc.specialization]);
	}
}