function(doc) {
   if(doc.doctype == "telemedicine_receipt"){
   		emit([doc.dhp_code, doc.user_id, doc.insert_ts], doc);
   }
}