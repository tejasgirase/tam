function(doc) {

 	if (doc.doctype == "Patient_Records" && doc.Format == "IMAGE" && doc.user_id){
  	emit([doc.user_id, 0], doc);	
 	}
}