function (doc) {
	if(doc.doctype=="notification_status") {
		var moment = require("views/lib/moment");
		emit([doc.dhp_code,moment(doc.insert_ts).format("YYYY-MM-DD")]);
	}
}