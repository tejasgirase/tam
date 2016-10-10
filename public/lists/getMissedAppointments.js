function(head, req) {
	var row;
	var finalrows = [];
	var autoremove_date = new Date();
	autoremove_date.setDate(autoremove_date.getDate() - Number(req.query.autoremove_days));
	while(row = getRow()) {
		if(row.doc.doctype == "appointment_request"){
			var appointment_date = new Date(row.doc.appointment_date);
			if(autoremove_date.getTime() > appointment_date.getTime() && !row.doc.missed_mail_sent){
				finalrows.push(row.value);
			}
		}
	}
	send(JSON.stringify({"rows":finalrows}));
}