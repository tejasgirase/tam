function(doc) {
  if(doc.doctype == "misc_document" && doc._attachments && doc.dhp_code && doc.doctor_id){
		emit([doc.dhp_code, doc.doctor_id],doc);
  }
}