function(doc){
	if(doc.doctype == "patient_careplan" && doc.cp_startdate && doc.cp_enddate){
		var d = new Date(doc.cp_enddate);
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		if(doc.cp_stopdate){
			if(new Date(doc.cp_stopdate) < d){
			  emit([doc.user_id,0], doc);
			}else{
			  emit([doc.user_id,1], doc);
			}
		}else{
			if(new Date() > d){
			  emit([doc.user_id,0], doc);
			}else{
			  emit([doc.user_id,1], doc);
			}
		}
	}
}