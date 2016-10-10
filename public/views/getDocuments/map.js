function(doc) {
  if(doc.doctype == "document" && doc._attachments && !doc.usermedhis_docid){
		emit([doc.doctor_id, doc._id, 0],doc);
  }
}