function(doc) {
	if((doc.doctype == "subscription_request" && doc.status == "Pending") || (doc.doctype == "appointment_request" && doc.status == "Review")) {
			emit([doc.doctor_id, doc.user_id, doc.doctype],doc);
	}
}