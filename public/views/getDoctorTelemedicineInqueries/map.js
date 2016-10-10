function(doc) {
	if(doc.doctype == "inquiry" && doc.practice_id){
		emit([doc.practice_id,doc.Health_Category],doc);
	}else if(doc.doctype == "inquiry" && doc.dhp_code) {
		emit([doc.dhp_code,doc.Health_Category],doc);
  }
}