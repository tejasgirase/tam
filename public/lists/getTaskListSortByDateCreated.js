function(head,req) {
	var row,
	    rows = [],
	    moment = require("views/lib/moment");
	while(row = getRow()) {
		rows.push(row);
	}
	rows.sort(function(a,b) {
		return moment(b.doc.insert_ts) - moment(a.doc.insert_ts);
	});
	send(JSON.stringify({rows:rows}));
}