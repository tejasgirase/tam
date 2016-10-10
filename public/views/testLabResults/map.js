function(doc) {
	if((doc.doctype == "document" && doc._attachments && !(doc.document_category) && (doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results"))){
		emit([doc.user_id, 'Other Exams', doc.document_name], doc.document_name);
 	}
 	if((doc.doctype == "Anual_Exam") || (doc.doctype == "Biometrics_labresults")){
 		emit([doc.user_id, 'Other Exams', doc.Exam_Name], doc.Exam_Name);	
 	}
	if(doc.doctype == "document" && doc.document_category && (doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results")) 
  	emit([doc.user_id, doc.document_category, doc.document_name], doc.document_name);
}