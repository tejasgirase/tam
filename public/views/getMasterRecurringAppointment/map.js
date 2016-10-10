function(doc){
	if(doc.doctype=="master_recurring_appointment"){
		emit(doc._id,doc);
	}
}