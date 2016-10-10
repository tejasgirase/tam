function(doc) {
  if (doc.insert_ts && (((doc.doctype == "document" && doc._attachments && (doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results")) || (doc.doctype == "Anual_Exam")) || (doc.doctype == "Biometrics_labresults") || (doc.doctype == "PhysicianNotes" && doc.visit_type && typeof(doc.objective) != "string"))) {
    emit([doc.user_id, doc.insert_ts, doc.doctype], doc);
    if (doc.doctype == "Anual_Exam" || doc.document_type == "Imaging-Results" || doc.document_type == "Lab-Results") {
      emit([0, doc.user_id, "Anual_Exam", doc.insert_ts], doc);
    } else {
      emit([0, doc.user_id, doc.doctype, doc.insert_ts], doc);
    }
  }
  if (doc.doctype == "patient_charting_template" && doc.finalize == "Yes" && doc.update_ts) {
    emit([doc.user_id, doc.update_ts, doc.doctype], doc);
    emit([0, doc.user_id, doc.doctype, doc.update_ts], doc);
  }
  if (doc.doctype == "uploaded_patient_charting_template") {
    emit([doc.user_id, doc.update_ts, "patient_charting_template"], doc);
    emit([0, doc.user_id, "patient_charting_template", doc.update_ts], doc);
  }
}
