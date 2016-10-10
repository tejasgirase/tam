function(doc) {
  if(doc.doctype == 'PhysicianNotes' && doc.subjective) {
    for (var i in doc.subjective) {
        emit([doc.user_id, doc.subjective[i]], doc.subjective[i]);
    }
  }

  if(doc.doctype == 'patient_charting_template' && doc.finalize == "Yes"){
    for (var i = 0;i < doc.sections.length;i++) {
      for(var j=0;j < doc.sections[i].fields.length;j++){
        for(var k=0;k<doc.sections[i].fields[j].response_format_pair.length;k++){
          if(doc.sections[i].fields[j].response_format_pair[k].response == "soapnote"){
    	    for(var l=0;l<doc.sections[i].fields[j].response_format_pair[k].values.length;l++){
              if(doc.sections[i].fields[j].response_format_pair[k].values[l].subjective.length > 0){
                for(var m=0;m<doc.sections[i].fields[j].response_format_pair[k].values[l].subjective.length;m++){
  	          emit([doc.user_id, doc.sections[i].fields[j].response_format_pair[k].values[l].subjective[m]],doc.sections[i].fields[j].response_format_pair[k].values[l].subjective[m]);
	        }
              }
            }
          }
        }
      }
    }
  }

}