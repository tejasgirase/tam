function(doc) {
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment"){
		var moment = require("views/lib/moment");
		if(doc.block_start) var appt_date = moment(doc.block_start).utc().format("YYYY-MM-DD")
		else var appt_date = moment(doc.reminder_start).utc().format("YYYY-MM-DD")
		emit ([doc.doctor_id,appt_date,doc.status],doc);
	}
}