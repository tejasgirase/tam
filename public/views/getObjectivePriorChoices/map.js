function(doc) {
  if(doc.doctype == 'patient_charting_template' && doc.finalize == "Yes"){
    for (var i = 0;i < doc.sections.length;i++) {
      for(var j=0;j < doc.sections[i].fields.length;j++){
        for(var k=0;k<doc.sections[i].fields[j].response_format_pair.length;k++){
          if(doc.sections[i].fields[j].response_format_pair[k].response == "soapnote"){
      	    for(var l=0;l<doc.sections[i].fields[j].response_format_pair[k].values.length;l++){
              if(doc.sections[i].fields[j].response_format_pair[k].values[l].objective.length > 0){
                for(var m=0;m<doc.sections[i].fields[j].response_format_pair[k].values[l].objective.length;m++){
                  for(var n=0;n<doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields.length;n++){
                    for(var p=0;p<doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields[n].choices.length;p++){
                  			
                      emit([doc.doctor_id,doc.user_id,doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields[n].field_name,0,doc.update_ts],doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields[n].choices);

                      emit([doc.doctor_id,doc.user_id,doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields[n].field_name,1,doc.update_ts],doc.sections[i].fields[j].response_format_pair[k].values[l].objective[m].fields[n].details_list);                            
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if(doc.doctype == "PhysicianNotes" && doc.user_id && doc.objective){
    for(var i=0;i<doc.objective[0].fields.length;i++){
      for(var j=0;j<doc.objective[0].fields[i].details_list.length;j++){
        emit([doc.doctor_id, doc.user_id,doc.objective[0].fields[i].field_name,0,doc.insert_ts],doc.objective[0].fields[i].choices);
        emit([doc.doctor_id, doc.user_id,doc.objective[0].fields[i].field_name,1,doc.insert_ts],doc.objective[0].fields[i].details_list);
      }
    }
  }
}