function(doc) {
	if(doc.create_timestamp && doc.doctype){
	  emit(doc.create_timestamp,doc.doctype);
	}
}