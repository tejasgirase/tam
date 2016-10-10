function(doc) {
  if(doc.doctype =='task' && doc.priority){
    emit([doc.doctor_id, doc.status, doc.task], doc);
    
    if (doc.reassign_doctor) {
      var status = '';
      for (var i = doc.reassign_doctor.length - 1; i >= 0; i--) {
         if (i == doc.reassign_doctor.length -1 && doc.status == "Reassign")
           status = "Review";
         else
           status = doc.status;

         emit([doc.reassign_doctor[i].id, status, doc.task], doc);
      };
    }
  }
}