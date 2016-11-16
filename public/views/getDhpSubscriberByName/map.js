function(doc) {
    if(doc.doctype == "Subscriber" && doc.User_firstname && doc.User_lastname && doc.dhp_code){
      emit([doc.dhp_code,doc.User_firstname +" "+doc.User_lastname, doc.user_id],doc);
    }
  }