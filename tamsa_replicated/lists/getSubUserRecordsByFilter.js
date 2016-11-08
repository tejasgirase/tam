function(head, req){
	var row;
	var rows = [];
	var moment =  require("views/lib/moment");
	while(row = getRow()) {
		var slevel,sadmin,sactive,sinsert_ts,supdate_ts;

		if(req.query.filter_level != "Select" && row.doc.level == req.query.filter_level){
			slevel = true;
		}else{
			if(req.query.filter_level == "Select"){
				slevel = true;
			}else{ 
				slevel = false;
			}	
		}

		if(req.query.filter_admin != "Select" && row.doc.admin == req.query.filter_admin){
			sadmin = true
		}else{
			if(req.query.filter_admin == "Select"){
				sadmin =true;
			}else{ 
				sadmin =false;
			}	
		}

		if(req.query.filter_active != "Select" && row.doc.active == req.query.filter_active){
			sactive = true;
		}else{
			if(req.query.filter_active == "Select"){
				sactive = true;
			}else{ 
				sactive = false;
			}	
		}

		if(row.doc.insert_ts){
			if(req.query.filter_insert_ts != "" && (moment(req.query.filter_insert_ts).diff(moment(row.doc.insert_ts),"days") == 0)){
					sinsert_ts = true;
			}else{
				if(req.query.filter_insert_ts == ""){ 
					sinsert_ts = true;
				}else{ 
					sinsert_ts = false;
				}	
			}
		}else{
			if(req.query.filter_insert_ts == ""){
				sinsert_ts = true;
			}else{
				sinsert_ts = false;
			}
		}

		if(row.doc.update_ts){
			if(req.query.filter_update_ts != "" && (moment(req.query.filter_update_ts).diff(moment(row.doc.update_ts),"days") == 0)){
					supdate_ts = true;
			}else{
				if(req.query.filter_update_ts == ""){ 
					supdate_ts = true;
				}else{ 
					supdate_ts = false;
				}	
			}
		}else{
			if(req.query.filter_update_ts == ""){
				supdate_ts = true;
			}else{
				supdate_ts = false;
			}
		}
		
		if(slevel && sadmin && sactive && sinsert_ts && supdate_ts){
				rows.push(row);
		}
	}
	send(JSON.stringify({"rows" : rows}));
}