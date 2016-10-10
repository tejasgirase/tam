function(doc) {
	if(doc.doctype=="Appointments" && doc.notification_type == "Appointment" && !doc.block_start){
		var moment = require("views/lib/moment");
		var h="0";
		var m="10";
		var fdate = moment(doc.reminder_start).subtract({'hours': h, 'minutes': m}).utc().format("D/M/YYYY,HH:mm");
		emit ([doc.doctor_id,fdate,doc.status],doc);
	}
}
