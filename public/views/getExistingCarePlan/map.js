function(doc) {
	if(doc.doctype == "careplan_template"){
		emit([doc.doctor_id,doc.template_name,doc.publish], doc);
	}
}