function(head, req) {
	var row;
	var rows = [];
	var newrows = [];
	var finalrows = [];
	var selfcare_array = [];
	var medical_info = [];
	var moment = require("views/lib/moment");
	var selfcare_data,weight;

	while(row = getRow()) {
		if(row.key[1] == 0 && row.value.doctor_id == req.query.doctor_id){
			rows.push(row) ;
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

	for(var i=0;i<newrows.length;i++){
		for(var j=0;j<rows.length;j++){
			if(newrows[i].value.user_id == rows[j].value.user_id){
				var selfcare_final_array = [];
				//finalrows.push(rows[j].value.user_id);
				if(req.query.source){
					rows[j].value.condition = newrows[i].value.CONDITION;
					rows[j].value.condition_severity = newrows[i].value.CONDITION_SEVERITY;
					if(newrows[i].value.insert_ts)rows[j].value.condition_ts = newrows[i].value.insert_ts
					else rows[j].value.condition_ts = "NA"
					finalrows.push(rows[j].value);
				}else{
					for(var k=0;k<medical_info.length;k++){
						if(rows[j].value.user_id == medical_info[k].value.user_id){
							weight = medical_info[k].value.weight;	
							break;
						}
						if(!weight) weight = "NA";
					}

					for(var k=0;k<selfcare_array.length;k++){
						if(rows[j].value.user_id == selfcare_array[k].value.user_id && !selfcare_array[k].value.insert_ts_int){
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
						condition_severity: newrows[i].value.CONDITION_SEVERITY,
						condition: newrows[i].value.CONDITION,
						user_id: rows[j].value.user_id
					});
				}
				break;
			}
		}
	}
	send(JSON.stringify({"rows" : finalrows}));
	//send(JSON.stringify({"rows" : newrows}));
}