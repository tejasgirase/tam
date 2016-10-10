function(doc) {
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment" && !doc.block_start){
		var moment = require("views/lib/moment");
		var appt_date = moment(doc.reminder_start).utc().format("YYYY-MM-DD");
		emit([doc.doctor_id,appt_date,doc.location,doc.status],doc);
	}
}