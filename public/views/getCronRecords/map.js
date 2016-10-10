function(doc) {
   if(doc.doctype == "cronRecords" && doc.processed == "No"){
	emit(doc.operation_case, doc);
   }
}