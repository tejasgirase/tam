function(doc) {
	if(doc.doctype=="currentMedications" || doc.doctype=="LabOrder" || doc.doctype=="patient_careplan" || (doc.finalize == "Yes" && doc.doctype=="patient_charting_template")){
		var moment = require("views/lib/moment");
		if(doc.insert_ts) emit(moment(doc.insert_ts).format("YYYY-MM-DD"), doc.doctype)
		else if(doc.update_ts) emit(moment(doc.update_ts).format("YYYY-MM-DD"), doc.doctype)
	}
}