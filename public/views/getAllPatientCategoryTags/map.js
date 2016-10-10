function (doc) {
	if(doc.doctype == "patient_category_tags") {
		for(var i=0;i<doc.tag_list.length;i++){
			emit(doc.tag_list[i]);
		}
	}
}