function(doc) {
	if(doc.doctype == "charting_template" && doc.publish == "No"){
		  emit([doc.doctor_id,doc.template_name,doc.specialization]);
	}
}