function (doc) {
	if(doc.type =='user' && doc.name && doc.first_name && doc.last_name && doc.dhp_code && doc.dhp_code != "H-0000000000") {
	  emit([doc.dhp_code,doc.hospital_affiliated],doc._id);
	}
}