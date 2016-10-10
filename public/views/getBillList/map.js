function(doc) {
   if((doc.doctype == "patient_bill" || doc.doctype == "telemedicine_receipt") && doc.invoice_no){
       emit([doc.dhp_code, doc.user_id, doc.insert_ts], doc);
   }
}