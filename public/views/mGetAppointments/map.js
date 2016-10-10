function(doc) {
if(doc.doctype=="Appointments")
	
  		emit (doc.user_id,doc)
}