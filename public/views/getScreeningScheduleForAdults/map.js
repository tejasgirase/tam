function(doc) {
	if(doc.doctype == "screening_schedule_for_adults"){
		if(doc.gender == "both" || doc.gender == "male"){
			emit(["Male",doc.age_lower_limit,doc.age_upper_limit],doc.screening_name);	
		}else{
			emit(["Female",doc.age_lower_limit,doc.age_upper_limit],doc.screening_name);
		}
	} 
}