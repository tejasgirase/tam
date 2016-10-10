function(doc) {
    if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname){
      emit([doc.doctor_id,doc.User_firstname +" "+doc.User_lastname, doc.user_id],doc);
    }
  }