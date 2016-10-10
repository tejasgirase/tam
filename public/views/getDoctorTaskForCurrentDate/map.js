function(doc) {
  if(doc.doctype =='task' && doc.priority && doc.status != "Completed" && doc.user_id){
    emit([doc.doctor_id, doc.task, doc.status, 0], doc);
    emit([1, doc.doctor_id, doc.user_id, doc.status, 0], doc);
    emit([2, doc.doctor_id, doc.task, doc.user_id,doc.status, 0], doc);
    if (doc.reassign_doctor) {
      var status = '';
      for (var i = doc.reassign_doctor.length - 1; i >= 0; i--) {
        if (i == doc.reassign_doctor.length -1 && doc.status == "Reassign"){
          status = "Review";
        }else{
          status = doc.status;
        }
        emit([doc.reassign_doctor[i].id, doc.task, status, i+1], doc);
        emit([1,doc.reassign_doctor[i].id, doc.user_id, status, i+1], doc);
        emit([2,doc.reassign_doctor[i].id, doc.task, doc.user_id, status, i+1], doc);
      }
    }
  }
}