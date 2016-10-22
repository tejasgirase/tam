function(head, req) {
	var row;
	var rows = [];
	var newrows = [];
	var finalrows = [];
	while(row = getRow()) {
		if(row.key[1] == 0 && row.value.dhp_code == req.cookie.mtfH){
			rows.push(row) ;
		}
		if(row.key[1] == 1){
			if(!row.value.doctor_id) newrows.push(row)
		}
	}
	for(var i=0;i<newrows.length;i++){
		for(var j=0;j<rows.length;j++){
			if(newrows[i].value.user_id == rows[j].value.user_id){
				//finalrows.push(rows[j].value.user_id);
				finalrows.push({
					condition:      newrows[i].value.CONDITION,
					user_id:        rows[j].value.user_id,
					patient_dhp_id: (rows[i].value.patient_dhp_id ? rows[i].value.patient_dhp_id : "NA")
				});
				break;
			}
		}
	}
	send(JSON.stringify({"rows" : finalrows}));
}