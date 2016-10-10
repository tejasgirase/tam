function(head, req) {
	var row;
	var rows = [];
	var newrows = [];
	var finalrows = [];
	var selfcare_array = [];
	var medical_info = [];
	var moment = require("views/lib/moment");
	var selfcare_data,weight;
	// send(JSON.stringify({"rows" : req}));
	while(row = getRow()) {
		if(row.key[1] == 0 && row.value.doctor_id == req.query.doctor_id){
			rows.push(row);
		}
		if(row.key[1] == 1){
			if(row.value.doctor_id){
				if(row.value.doctor_id == req.query.doctor_id) newrows.push(row)
			}else{
				newrows.push(row);
			}
		}
		if(row.key[1] == 3){
			selfcare_array.push(row);
		}
		if(row.key[1] == 2){
			medical_info.push(row);
		}
	}

	for(var i=0;i<rows.length;i++){
		var con_flag             = true;
		var selfcare_final_array = [];
		
		for(var j=0;j<newrows.length;j++){
			if(rows[i].value.user_id == newrows[j].value.user_id){
				var condition_severity, condition;
				condition_severity = newrows[j].value.CONDITION_SEVERITY;
				condition = newrows[j].value.CONDITION;
				break;
			}else{
				if(j == newrows.length -1){
					condition_severity = "NA";
					condition = "NA";
				}
			}
		}		

		for(var k=0;k<medical_info.length;k++){
			if(rows[i].value.user_id == medical_info[k].value.user_id){
				weight = medical_info[k].value.weight;	
				break;
			}
			if(!weight) weight = "NA";
		}

		for(var k=0;k<selfcare_array.length;k++){
			if(rows[i].value.user_id == selfcare_array[k].value.user_id && !selfcare_array[k].value.insert_ts_int){
				selfcare_final_array.push(selfcare_array[k].value);
			}
		}

		selfcare_final_array.sort(function (a,b){
			return moment.utc(b.insert_ts).diff(moment.utc(a.insert_ts));
		});
				
		if(selfcare_final_array.length > 0){
			selfcare_data = selfcare_final_array;
		}else{
			selfcare_data = "NA";
		}

		finalrows.push({
			weight: weight,
			selfcare_data: selfcare_data[0],
			condition_severity: condition_severity,
			condition: condition,
			user_id: rows[i].value.user_id
		});
	}
	send(JSON.stringify({"rows" : finalrows}));
}