function(head, req) {
	var row,
  careplan  = [],
  response  = [],
  moment = require("views/lib/moment"),
  count = 0,
	total = 0,
	adherence,
	past_rows = [],
	adherence_lvl,
	adherence_title,
  finalrows = [];
	while(row = getRow()) {
		if(row.key[1] == 0) {
			careplan.push(row);
		}else if(row.key[1] == 1) {
			response.push(row);
		}
	}
	for(var i=0;i<careplan.length;i++) {
		for(var j=0;j<response.length;j++) {
			if(careplan[i].doc.template_name == response[j].doc.template_name && careplan[i].doc.specialization == response[j].doc.specialization) {
				for(var k=0;k<careplan[i].doc.fields.length;k++) {
					for(var l=0;l<careplan[i].doc.fields[k].section_fields.length;l++) {
						if(careplan[i].doc.fields[k].section_fields[l].field_name == response[j].value[0].field_name) {
							if(moment().utc().format("YYYY-MM-DD") >= moment(response[j].value[0].date).utc().format("YYYY-MM-DD")) {
								total++;
								if(response[j].value[0].response && (response[j].value[0].response.toLowerCase() == "yes" || response[j].value[0].response.toLowerCase() == "done" || response[j].value[0].response.toLowerCase() == "true")) {
									count++;
								}
							}
						}
					}
				}
			}
		}
		adherence = (count/total) * 100;
		if(adherence >= 75) {
			adherence_lvl = "GREEN";
			adherence_title = "High"
		}else if(adherence >= 50) {
			adherence_lvl = "GOLD";
			adherence_title = "Medium"
		}
		else if(adherence >= 0) {
			adherence_lvl = "RED";
			adherence_title = "Low"
		}

		if(careplan[i].doc.cp_stopdate) {
			if(moment(careplan[i].doc.cp_stopdate).utc() < moment().utc()) {
				past_rows.push({
					count:count,
					total:total,
					adherence:adherence_lvl,
					adherence_title:adherence_title,
					value:careplan[i].doc,		
				});
			}else {
				finalrows.push({
					count:count,
					total:total,
					adherence:adherence_lvl,
					adherence_title:adherence_title,
					value:careplan[i].doc,
				});
			}
		}else {
			if(moment().utc() > moment(careplan[i].doc.cp_enddate).utc()) {
				past_rows.push({
					count:count,
					total:total,
					adherence:adherence_lvl,
					adherence_title:adherence_title,
					value:careplan[i].doc,		
				});
			}else {
				finalrows.push({
					count:count,
					total:total,
					adherence:adherence_lvl,
					adherence_title:adherence_title,
					value:careplan[i].doc,
				});
			}
		}

		
	}
	
	send(JSON.stringify({"rows":finalrows, "past_rows":past_rows}));
}