function(head, req) {
	var row,
			rows = [],
			moment = require("views/lib/moment"),
			dob,
			type_val,
			user_diff,
			vaccine_name,
			dose_details,
			upcoming_details,
			finalrows = [];
	
	while(row = getRow()) {
		rows.push(row) ;
	}
	dob = req.query.user_dob;
	for(var i=0; i<rows.length; i++) {
		type_val = rows[i].value[0].min_age_type.toLowerCase();
		user_diff = moment().utc().diff(moment(dob),type_val);
		vaccine_name = rows[i].value[1];
		if(user_diff >= rows[i].value[0].min_age_value) {
			dose_details = rows[i].value[0];
			upcoming_details  = "";
		}else{
			dose_details = "";
			upcoming_details = rows[i].value[0];
		}
		finalrows.push({
			vaccine_name:     vaccine_name,
			dose_details:     dose_details,
			upcoming_details: upcoming_details
		});
	}
	send(JSON.stringify({"rows" : finalrows}));
}