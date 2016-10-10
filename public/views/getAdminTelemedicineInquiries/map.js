function(doc) {
   if(doc.doctype == "inquiry" && doc.dhp_code){
   		if(doc.admin_dhp_code){
   			emit(doc.admin_dhp_code,doc);
   		}else if(doc.dhp_code) {
   			emit(doc.dhp_code,doc);
   		}
   }
}