function(doc) {
	if(doc.doctype == "CampaignID") {
		emit(doc.dhp_code, doc);
	}
}