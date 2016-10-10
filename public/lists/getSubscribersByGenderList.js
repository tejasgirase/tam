function(head, req) {
	var row;
	var rows = [];
	var male_list = [];
	var female_list = [];
	var finalrows = [];
	var male_count = 0, female_count = 0, total_count = 0, temp_count = 0;
	var gender_list = req.query.genderlist;
	
	while(row = getRow()) {
		if(row.doc.gender && row.doc.gender != "") {
			total_count++;
			if(row.doc.gender == "Male") {
				if(male_list.map(function(e) { return e.user_id; }).indexOf(row.doc.user_id) == -1) {
					male_list.push(row.doc);
					male_count++;
				}else {
					temp_count++
				}
				
			}else if(row.doc.gender == "Female") {
				if(female_list.map(function(e) { return e.user_id; }).indexOf(row.doc.user_id) == -1) {
					female_list.push(row.doc);
					female_count++;	
				}
			}
		}
		rows.push(row);
	}

	var male_percent = (male_count/total_count)*100;
	var female_percent = (female_count/total_count)*100;

	finalrows.push({
		"percent":female_percent.toFixed(2),
		"label":"Female",
		"color":"#E6B91E"
	},{
		"percent":male_percent.toFixed(2),
		"label":"Male",
		"color": "#90C226"
	});
	send(JSON.stringify({"rows" : finalrows, "male_list": male_list, "female_list": female_list, "temp_count": temp_count}));
}