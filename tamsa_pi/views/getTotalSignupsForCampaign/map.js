function(doc) {
	if(doc.doctype == "UserInfo" && doc.campaign_id) {
		emit(doc.campaign_id);
	}
}