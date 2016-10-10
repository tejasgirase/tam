function(doc){
	if(doc.doctype == "audit_records" && doc.dhp_code){
		emit([doc.dhp_code,doc.insert_ts],doc);
	}
}