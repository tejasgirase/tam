function(doc) {
  if(doc.doctype =='task' && doc.priority){
    if(doc.status == "Completed"){
      emit([1,doc.doctor_id,doc.status, doc.task, 0], doc);
    }else{
      emit([doc.doctor_id,doc.status, doc.task, 0], doc);
    }
    if (doc.reassign_doctor) {
      var status = '';
      for (var i = doc.reassign_doctor.length - 1; i >= 0; i--) {
         if (i == doc.reassign_doctor.length -1 && doc.status == "Reassign")
           status = "Review";
         else
           status = doc.status;
        if(doc.status == "Completed"){
          emit([1,doc.reassign_doctor[i].id,status, doc.task, i+1], doc);
        }else{
          emit([doc.reassign_doctor[i].id,status, doc.task, i+1], doc);
        }
      }
    }
  }
}