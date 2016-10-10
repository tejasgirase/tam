function(doc) {
	if(doc.doctype == "UserMedHis" && doc.insert_ts) {
		var moment = require("views/lib/moment");
		var date = moment(doc.insert_ts).utc().format("YYYY-MM-DD");
		if (date != "Invalid date")	{
			emit([doc.user_id, date], doc);
		}
	}
}