function(doc) {
	var moment = require("views/lib/moment");
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.Value_Diastolic_BP) && Number(doc.Value_Systolic_BP) && doc.Value_Diastolic_BP != "" && doc.Value_Systolic_BP != "") {
	  emit([1, doc.user_id, doc.insert_ts]);
	}
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.Value_weight) && doc.Value_weight != "") {
	  emit([2, doc.user_id, doc.insert_ts]);
	}
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.HeartRate) && doc.HeartRate != "") {
	  emit([3, doc.user_id, doc.insert_ts]);
	}
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.O2) && doc.O2 != "") {
	  emit([4, doc.user_id, doc.insert_ts]);
	}
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.Respiration_Rate) && doc.Respiration_Rate != "") {
	  emit([5, doc.user_id, doc.insert_ts]);
	}
	if(doc.doctype && doc.doctype =='SelfCare' && doc.insert_ts && moment(doc.insert_ts).isValid() && doc.user_id && Number(doc.Fasting_Glucose) && doc.Fasting_Glucose != "") {
	  emit([6, doc.user_id, doc.insert_ts]);
	}
}