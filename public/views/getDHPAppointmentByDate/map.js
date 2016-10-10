function(doc) {
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment" && doc.dhp_code && doc.status && !doc.block_start){
		var moment = require("views/lib/moment");
		emit ([doc.dhp_code,moment(doc.reminder_start).utc().format("YYYY-MM-DD"),doc.location,doc.status],doc);
	}
}