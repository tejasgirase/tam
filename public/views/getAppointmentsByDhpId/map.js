function(doc) {
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment" && !doc.block_start && doc.user_id){
		var moment = require("views/lib/moment");
		var appt_date = moment(doc.reminder_start).utc().format("YYYY-MM-DD");
		emit([doc.dhp_code,doc.status],doc);
	}
}