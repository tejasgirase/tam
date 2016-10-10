function(doc) {
	if(doc.doctype == "currentMedications" && doc.user_id && (doc.update_ts || doc.insert_ts)){
		var ed = new Date(doc.drug_end_date.split("-")[0],doc.drug_end_date.split("-")[1] - 1,doc.drug_end_date.split("-")[2]);
		ed.setHours(23);
		ed.setMinutes(59);
		ed.setSeconds(59);	

		var sd = new Date(doc.drug_stop_date);
		sd.setHours(00);
		sd.setMinutes(00);
		sd.setSeconds(01);		

		var cd = new Date();
		cd.setHours(23);
		cd.setMinutes(59);
		cd.setSeconds(59);

		if(doc.drug_stop_date){
			if(new Date() <= sd){
				if(doc.update_ts) emit([doc.user_id,doc.drug.trim()],doc)
				else emit([doc.user_id,doc.drug.trim()],doc)	
			}
		}else{
			if(new Date() <= ed){
			  if(doc.update_ts) emit([doc.user_id,doc.drug.trim()],doc)
			  else emit([doc.user_id,doc.drug.trim()],doc)
			}
		}
	}
}