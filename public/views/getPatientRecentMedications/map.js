function(doc) {
	if(doc.doctype == "currentMedications"){
		var moment = require("views/lib/moment");
		var recentdate = moment().subtract(3,"Month").format("YYYY-MM-DD");
		var todaydate = moment().format("YYYY-MM-DD");
		var enddate = ((doc.drug_stop_date) ? (moment(doc.drug_stop_date).format("YYYY-MM-DD")) : (moment(doc.drug_end_date).format("YYYY-MM-DD")));
		if(doc.drug_start_date){
			var startdate = moment(doc.drug_start_date).format("YYYY-MM-DD");	
			if(startdate >= todaydate){
				emit([doc.user_id],doc);
			}else{
				if(enddate > recentdate){
					emit([doc.user_id],doc);
				}
			}	
		}
	}
}
