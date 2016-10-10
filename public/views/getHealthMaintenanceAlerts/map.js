function(doc){
	if(doc.doctype == "health_maintenance_alerts"){
		emit([doc.dhp_code,doc.alert_name],doc);
	}
}