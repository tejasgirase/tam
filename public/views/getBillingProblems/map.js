function(doc) {
   if((doc.doctype == "patient_bill" || doc.doctype == "telemedicine_receipt") && doc.invoice_no && doc.finalize == "Yes"){
        var moment = require("views/lib/moment");
	var bill_amt = Number(doc.bill_history[0].total_bill_topay) - (Number(doc.bill_history[0].total_cash_paid) + Number(doc.bill_history[0].total_online_paid) + Number(doc.bill_history[0].advance_paid));

	var adate = moment(doc.insert_ts).utc().format("YYYY-MM-DD");
	emit([doc.dhp_code,adate,doc.doctor_id], bill_amt);
   }
}