function(head, req) {
	var row,
	    startdate = req.query.startkey[1],
	    enddate   = req.query.endkey[1],
	    moment    = require("views/lib/moment"),
	    diffdays  = moment(req.query.endkey[1]).diff(moment(req.query.startkey[1]),"d"),
			rows      = [],
			checkedIn = [],
			noshow    = [],
			cancelled = [];

	while(row = getRow()) {
		rows.push(row);
	}

	rows.sort(function(a,b) {
		return moment(a.doc.reminder_start)- moment(b.doc.reminder_start);
	});

	var innerdata = [];
	for(var i=0; i<= diffdays; i++) {
		var tempdate = moment(startdate).add(i, "days").format("YYYY-MM-DD"),
				checkedIn_count = [],
				noshow_count = [],
				cancelled_count = [];
		for(var j=0; j<rows.length; j++) {
			if(tempdate == moment(rows[j].doc.reminder_start).utc().format("YYYY-MM-DD")) {
				if(rows[j].doc.status == "checked_in") {
					checkedIn_count.push(rows[j].doc);
				}else if(rows[j].doc.status == "scheduled") {
					cancelled_count.push(rows[j].doc);
				}else	if(rows[j].doc.status == "no_show") {
					noshow_count.push(rows[j].doc);
				}
			}
		}
		
		checkedIn.push({
			"day": moment(startdate).add(i,"days").format("DD MMM"),
			"count":checkedIn_count.length,
			"user_ids":checkedIn_count
		});
		
		noshow.push({
			"day": moment(startdate).add(i,"days").format("DD MMM"),
			"count":noshow_count.length,
			"user_ids":noshow_count
		});
		
		cancelled.push({
			"day": moment(startdate).add(i,"days").format("DD MMM"),
			"count":cancelled_count.length,
			"user_ids":cancelled_count
		});
	}

	var stackedBarChartData = [];
	stackedBarChartData.push({
		"data": checkedIn,
		"name": "Patients Visited"
	},{
		"data": noshow,
		"name": "Noshow Patients"
	},{
		"data": cancelled,
		"name": "Cancelled Patients"
	});
	send(JSON.stringify({"rows" : stackedBarChartData}));
}