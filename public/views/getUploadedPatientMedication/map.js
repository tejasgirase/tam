function (doc){
	if(doc.doctype == "uploaded_medication") {
		emit(doc.user_id,doc.insert_ts);
	}
}