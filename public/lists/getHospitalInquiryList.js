function(head, req) {
	var row;
	var rows = [];
	while((row = getRow())) {
		if(row.doc.practice_id) {
			if(row.doc.practice_id == req.query.practice_id){
				rows.push(row);
			}	
		}else if(row.doc.dhp_code == req.query.dhp_code) {
			rows.push(row);
		}
	}
	send(JSON.stringify({"rows" : rows}));
}