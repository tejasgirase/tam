 function(doc) {
		if(doc.doctype == "inventory" && doc.dhp_code && Number(doc.price) && Number(doc.cost)){
		  emit([doc.dhp_code,doc.lot_no,doc._id],doc);
		}
}