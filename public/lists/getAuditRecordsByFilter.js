function(head, req) {
	var row;
	var rows = [];
	var moment = require("views/lib/moment");
	// send(JSON.stringify({"rows" : req}));
	while(row = getRow()) {
		var tarea,taction,tdate,tdoctor,tpatient;
		if(req.query.filter_area != "Select" && row.doc.audit_area == req.query.filter_area){
			//rows.push(row);
			tarea = true;
		}else{
			if(req.query.filter_area == "Select") tarea = true;
			else tarea = false;
		}

		if(req.query.filter_action != "Select" && row.doc.action_type == req.query.filter_action){
			taction = true;
		}else{
			if(req.query.filter_action == "Select") taction = true;
			else taction = false;
		}

		var audit_date = moment(row.doc.insert_ts).format("YYYY-MM-DD");
		if(req.query.filter_date != "" && (moment(req.query.filter_date).diff(moment(audit_date), "days")  == 0)){
			tdate = true;
		}else{
			if(req.query.filter_date == "") tdate = true;
			else tdate = false;
		}

		if(req.query.filter_doctor_name != "Select" && row.doc.doctor_name == req.query.filter_doctor_name){
			tdoctor = true;
		}else{
			if(req.query.filter_doctor_name == "") tdoctor = true;
			else tdoctor = false;
		}

		if(req.query.filter_patient_name != "Select" && row.doc.patient_name == req.query.filter_patient_name){
			tpatient = true;
		}else{
			if(req.query.filter_patient_name == "") tpatient = true;
			else tpatient = false;
		}

		if(tarea && taction && tdate && tdoctor && tpatient){
			rows.push(row);
		}
	}
	var finel_rows = [];
	if(rows.length > Number(req.query.limit_rows)){
		for (var i = Number(req.query.skip_rows); i < Number(req.query.limit_rows); i++) {
			finel_rows.push(rows[i]);
		}
	}else{
		for (var i = Number(req.query.skip_rows); i < rows.length; i++) {
			finel_rows.push(rows[i]);
		}
	}
	send(JSON.stringify({"tes":Number(req.query.skip_rows),"re":Number(req.query.limit_rows),"rows" : finel_rows,"length":rows.length}));
}