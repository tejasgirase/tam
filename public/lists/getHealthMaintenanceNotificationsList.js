function(head, req) {
	var row;
	var alerts_array = [];
	var past_screenings = [];
	var finalrows = [];
	var moment = require("views/lib/moment");

	while(row = getRow()) {
		if(row.key[0] == 0){
			if((row.value.gender == req.query.user_gender) && ((req.query.user_age >= row.value.min_age) && (req.query.user_age < row.value.max_age))){
			alerts_array.push(row);
			}
		}
		
		if(row.key[0] == 1 && row.value.user_id == req.query.user_id){
			past_screenings.push(row);
		}
	}

	if(past_screenings.length > 0) {
		for(var i=0;i<alerts_array.length;i++){
			var past_data = [];
			if(past_screenings[0].value.screening_info) {
				for(var j=0;j<past_screenings[0].value.screening_info.length;j++){
					if(alerts_array[i].value.alert_name == past_screenings[0].value.screening_info[j].screening_name) {
						past_data.push({
							alert_date:   past_screenings[0].value.screening_info[j].date,
							alert_status: past_screenings[0].value.screening_info[j].status,
						});
					}
				}

				past_data.sort(function (a,b){
					return moment.utc(b.alert_date).diff(moment.utc(a.alert_date));
				});

				finalrows.push({
					alert_name:      alerts_array[i].value.alert_name,
					interval:        alerts_array[i].value.test_interval,
					interval_type:   alerts_array[i].value.test_interval_choice,
					past_screenings: past_data
				});
			}
		}
	}else {
		for(var i=0;i<alerts_array.length;i++){
			finalrows.push({
				alert_name:      alerts_array[i].value.alert_name,
				interval:        alerts_array[i].value.test_interval,
				interval_type:   alerts_array[i].value.test_interval_choice,
				past_screenings: []
			});	
		}
	}
	send(JSON.stringify({"rows" : finalrows}));
}