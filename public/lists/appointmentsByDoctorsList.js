function(head, req) {
	var row;
	var rows = [];
	var finalrows = [];
	var tempdocids = req.query.docids.split("|");
	while(row = getRow()) {
		if(row.doc.block_end){
			rows.push(row);
		}else{
			if(tempdocids.indexOf(row.doc.doctor_id) > -1){
				rows.push(row);
			}else{
				finalrows.push(row);
			}	
		}
	}
	send(JSON.stringify({"rows" : rows}));
}