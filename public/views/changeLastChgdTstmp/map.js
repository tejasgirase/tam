function(doc) {
	if(doc.last_chgd_tstmp){
	  emit(doc.last_chgd_tstmp,doc.doctype);
	}
}