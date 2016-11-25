function(head, req) {
	var row,rows=[],total_charges=0,finalrows=[];
	var tempdocids = req.query.product_ids.split("|");
	while((row = getRow())) {
		finalrows.push(row);
		// for(var i=0;i<row.doc.subscription_plans.length;i++) {
			if(tempdocids.indexOf(row.value.product_plan_id) > -1) {
				total_charges+=Number(row.value.charges);
			}
		// }
	}
	send(JSON.stringify({"total" : total_charges,"tempdocids":finalrows}));
}