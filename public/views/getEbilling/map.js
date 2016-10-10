function(doc) {
   if(doc.doctype == "EBilling" && doc.dhp_code){
       emit(doc.dhp_code, doc);
   }
}