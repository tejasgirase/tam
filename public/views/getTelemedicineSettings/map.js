function(doc){
	if(doc.doctype == "telemedicine_setting" && doc.dhp_code && doc.last_update_by){
		emit(doc.dhp_code,doc);
	}
}