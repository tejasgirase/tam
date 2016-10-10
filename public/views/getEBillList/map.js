function(doc) {
   if(doc.doctype == "patient_bill"){
       emit([doc.dhp_code, doc.insert_ts], doc);
   }
}