function(doc) {
   if(doc.doctype == "cvg"){
      emit(doc.doctor_id, doc);
   }
}