function(head, req) {
	var row;
	var rows=[];
	// send(JSON.stringify({"rows" : req}));
	while(row = getRow()) {
		rows.push(row) ;
	}
	rows.sort(function(a,b) {
		return a.value-b.value;
	});
	rows.reverse();
	send(JSON.stringify({"rows" : rows}));
}