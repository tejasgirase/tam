function(doc) {
	if(doc.doctype == "Family_Medical_History" && doc.relations) {
		for(var i=0;i<doc.relations.length;i++){
			emit([doc.user_id,doc.relations[i].relation, doc.relations[i].condition],doc.relations[i]);
		}
	}
}