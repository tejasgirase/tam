function(doc) {
  if (doc.doctype == "patient_charting_template" && doc.finalize == "Yes") {
    for (var i=0; i<doc.sections.length; i++) {
      for (var j=0; j<doc.sections[i].fields.length; j++) {
        for (var k=0; k<doc.sections[i].fields[j].response_format_pair.length; k++) {
          if (doc.sections[i].fields[j].response_format_pair[k].response == "soapnote" && doc.sections[i].fields[j].response_format_pair[k].values[0].assessment.length > 0) {
            emit([doc.user_id,doc.update_ts],doc.sections[i].fields[j].response_format_pair[k].values[0].assessment);
          }
        }
      }
    }
  }
}