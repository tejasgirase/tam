function(doc) {
	var moment = require("views/lib/moment");
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment" && moment(doc.reminder_start).isValid() && doc.doctor_id && doc.user_id) {
		emit ([doc.doctor_id,moment(doc.reminder_start).utc().format("YYYY-MM-DD")],doc);
	}
}