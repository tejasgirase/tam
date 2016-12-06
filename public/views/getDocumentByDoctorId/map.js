function(doc) {
  if(doc.doctype == "document" && doc.doctor_id){
		if(!doc.comments) {
					emit(doc.doctor_id,doc);
		}else if (doc.comments.length == 0 && doc.comments == ""){
				emit(doc.doctor_id,doc);
		}else {

		}
	}
}