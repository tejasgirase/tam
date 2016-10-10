function(doc) {
if(doc.doctype == "cronRecords" && doc.processed=="Yes" && doc.user_id && doc.operation_case){
	if(doc.operation_case == "23" && doc.insert_ts){
		emit([doc.user_id,doc.insert_ts],doc.insert_ts);
	}
	if((doc.operation_case == "18" || doc.operation_case == "9" || doc.operation_case == "17") && doc.update_ts){
		emit([doc.user_id,doc.update_ts], doc.update_ts);
	}
}
}
