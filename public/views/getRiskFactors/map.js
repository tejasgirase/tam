function(doc){
	if(doc.doctype == "health_maintenance_alerts" && doc.risk_factors){
		for(var i=0;i<doc.risk_factors.length;i++){
			emit(doc.risk_factors[i],doc);
		}
	}
}