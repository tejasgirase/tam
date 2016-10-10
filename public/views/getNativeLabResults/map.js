function(doc) {
   if(doc.doctype == "document" && doc._attachments && doc.usermedhis_docid && doc.selfcare_docid){
	emit([doc.doctor_id,doc.user_id,doc.insert_ts],doc);
   }
}