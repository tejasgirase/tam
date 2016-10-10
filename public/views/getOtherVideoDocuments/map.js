function(doc) {
   if(doc.doctype == "document" && (doc.document_type == "Video" || doc.document_type == "Other")){
	emit(doc.user_id,doc);
   }
}