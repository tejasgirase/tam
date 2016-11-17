function(doc) {
	if(doc.doctype === "subscription_list" && doc.subscription_plans && doc.subscription_plans.length > 0) {
		for(var i=0;i<doc.subscription_plans.length;i++) {
			emit(doc.subscription_plans[i].name,doc.subscription_plans[i]);
		}
	}
}