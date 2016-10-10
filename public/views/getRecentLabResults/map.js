function(doc) {
	if((doc.doctype == "document" && doc._attachments && doc.document_category && (doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results"))) 
  emit([doc.user_id,doc.document_category,doc.insert_ts], doc.document_name);

	if((doc.doctype == "Anual_Exam" && doc.insert_ts) || (doc.doctype == "document" && doc._attachments && !(doc.document_category) && (doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results"))){
		emit([doc.user_id,'Other Exams',doc.insert_ts], doc.document_name);
	}
}