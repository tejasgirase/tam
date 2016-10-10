function(doc) {
  if (doc.doctype == "patient_careplan" && doc.cp_startdate && doc.cp_enddate) {
    for (var i = 0; i < doc.fields.length; i++) {
      if (doc.fields[i].section_name && doc.fields[i].section_name == "Therapy") {
        for (var j = 0; j < doc.fields[i].section_fields.length; j++) {
          if (doc.fields[i].section_fields[j].field_name == "Record mood") {
              emit(doc.fields[i].section_fields[j].field_name, doc.fields[i].section_fields[j].field_response);
          }
        }
      }
    }
  }
}
