function (head, req) {
	var row,dhp_code,
	rows         = [],
	newrows      = [],
	patient_tags = req.query.patient_tags.split(","),
	finalrows    = [];

	while((row = getRow())) {
		if(req.query.dhp_code !== "") {
			if(row.key[0] === 0 && row.value.dhp_code == req.query.dhp_code){
				if(rows.indexOf(row.value.user_id) < 0) {
					rows.push(row.value.user_id);
				}
			}
		}else {
			if(rows.indexOf(row.value.user_id) < 0) {
				rows.push(row.value.user_id);
			}
		}
		
		if(row.key[0] == 1){
			var tag_arr = [],
			tag_flag = false;

			for(var t=0;t<patient_tags.length;t++){
				if(row.value.patient_tags.indexOf(patient_tags[t]) > -1) {
					tag_arr.push(patient_tags[t]);
				}else {
					tag_flag = true;
					break;
				}
			}
			if(!tag_flag) {
				newrows.push({
					user_id:row.value.user_id,
					tags:tag_arr
				});	
			}
		}
	}

	for(var i=0;i<rows.length;i++){
		for(var j=0;j<newrows.length;j++){
			if(rows[i] == newrows[j].user_id){
				var row_doc = {
					user_id: rows[i],
					tags:newrows[j].tags
				};
				if(req.query.dhp_code) {
					row_doc.dhp_code = req.query.dhp_code;
				}else {
					row_doc.dhp_code = req.query.dhp_code;
				}
				finalrows.push(row_doc);
				break;
			}
		}
	}
	send(JSON.stringify({"rows" : finalrows,"rowsq" : rows, "newrows":newrows, "patient_tags":patient_tags}));
}