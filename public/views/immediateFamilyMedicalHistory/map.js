function(doc) {
	if(doc.doctype == "Family_Medical_History" && doc.relations){
		for(var i=0;i<doc.relations.length;i++) {
			if((doc.relations[i].condition.toLowerCase() == "CVD".toLowerCase() || doc.relations[i].condition.toLowerCase() == "Diabetes".toLowerCase() || doc.relations[i].condition.toLowerCase() == "hypertension".toLowerCase())){
				emit(doc.user_id, doc);	
			}	
		}	
	}
}