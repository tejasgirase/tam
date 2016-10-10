function(doc) {
	if(doc.doctype == "CompanyID") {
		emit(doc.campaign_id, doc);
	}
}