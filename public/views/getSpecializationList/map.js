function(doc){
	if(doc._id == "specialization_list" ){
  	emit(doc.doctype, doc);
		for(var i = 0 ; i < doc.specialization.length; i++){
			emit(doc.specialization[i].toLowerCase(),doc);
		}
	}
}