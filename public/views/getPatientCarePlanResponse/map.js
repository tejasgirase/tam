function(doc) {
if(doc.doctype == "patient_careplan_response") {
	if(doc.section_name == "Fitness") {
     		if(doc["Exercise for 30mts"]){
			for(var i=0;i<doc["Exercise for 30mts"].length;i++){
			 emit(doc["Exercise for 30mts"][i].date,doc["Exercise for 30mts"][i]);
			}
		}
     		if(doc["Walk"]){
			for(var i=0;i<doc["Walk"].length;i++){
			 emit(doc["Walk"][i].date,doc["Walk"][i]);
			}
		}
     		if(doc["Exercise for 15mts"]){
			for(var i=0;i<doc["Exercise for 15mts"].length;i++){
			 emit(doc["Exercise for 15mts"][i].date,doc["Exercise for 15mts"][i]);
			}
		}
	}
	if(doc.section_name == "Therapy") {
     		if(doc["Record reaction"]) {
			for(var i=0;i<doc["Record reaction"].length;i++){
			 emit(doc["Record reaction"][i].date,doc["Record reaction"][i]);
			}
		}
     		if(doc["Record any body pain"]) {
			for(var i=0;i<doc["Record any body pain"].length;i++){
			 emit(doc["Record any body pain"][i].date,doc["Record any body pain"][i]);
			}
		}
	}       
}

}