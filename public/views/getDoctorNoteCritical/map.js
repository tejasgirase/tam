function(doc) {
 if(doc.doctype == "Conditions" && doc.user_id && doc.CONDITION == "From Doctor Note") {
	emit(doc.user_id, doc.CONDITION_SEVERITY)
 }
}