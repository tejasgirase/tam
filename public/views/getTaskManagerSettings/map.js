function(doc){
	if(doc.doctype=="task_manager_settings"){
		emit(doc.dhp_code,doc);
	}
}