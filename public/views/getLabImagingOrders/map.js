function(doc) {
  if(doc.doctype == "LabImagingOrder"){
  	emit([doc.doctor_id,doc.user_id],doc);
	}
}