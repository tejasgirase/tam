function(doc) {
  if(doc.doctype == "patient_careplan_response") {
    for(var i=0;i<doc.field_response.length;i++){
      emit([1,doc.doctor_id,doc.user_id,doc.template_name,doc.specialization,doc.field_response[i].date], [doc.field_response[i],doc.section_name]);
      var response = doc.field_response[i].response.toLowerCase();
      if(response == "yes" || response == "done" || response == "true" ){
	emit([2,doc.doctor_id,doc.user_id,doc.template_name,doc.specialization,doc.field_response[i].date], [doc.field_response[i],doc.section_name]);
      }else if(	response == "no" || response == "not done" || response == "false"){
	emit([3,doc.doctor_id,doc.user_id,doc.template_name,doc.specialization,doc.field_response[i].date], [doc.field_response[i],doc.section_name]);       
      }
    }				
  }
}