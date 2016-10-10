function(doc){
	if(doc.doctype == "health_maintenance_alerts"){
		emit([0,doc.dhp_code,doc.gender],doc);
	}
	if(doc.doctype == "ScreeningDetails" && doc.screening_info){
		emit([1,doc.user_id],doc);
	}
}