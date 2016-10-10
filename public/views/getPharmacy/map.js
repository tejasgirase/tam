function(doc) {
   if(doc.doctype == "pharmacy"){
	emit([doc.dhp_code,doc.pharmacy_city], doc);
   }
}