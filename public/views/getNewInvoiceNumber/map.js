function(doc) {
   if((doc.doctype == "patient_bill" || doc.doctype == "telemedicine_receipt") && doc.invoice_no != "NA"){
       emit([doc.dhp_code, doc.insert_ts], doc.invoice_no);
   }
}