function(doc) {
	if(doc.user_id)
	  emit(doc.user_id, [doc._id, doc._rev]);
}