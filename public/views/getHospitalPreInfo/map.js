function (doc){
	if(doc.doctype == "hospital_pre_info"){
		emit(doc.dhp_code);
	}
}