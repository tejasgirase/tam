function(doc){
	if(doc.doctype == "patient_careplan" && doc.cp_startdate && doc.cp_enddate){
		emit([doc.user_id,0], doc);
	}
	if(doc.doctype == "patient_careplan_response") {
		for(var i=0;i<doc.field_response.length;i++){
			emit([doc.user_id,1],[doc.field_response[i],doc.section_name]);
		}
	}
}