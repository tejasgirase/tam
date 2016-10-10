function(doc){
	if(doc.doctype=="Appointments" && doc.master_recurring_id){
		emit(doc.master_recurring_id,doc._id);
	}
}