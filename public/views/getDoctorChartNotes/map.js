function(doc) {
  if (doc.doctype == "PhysicianNotes" && doc.reminder_type == "Physician_Notes" && doc.subjective) {
    mysubjective = doc.subjective.toString();
    mydate = doc.insert_ts.substring(0, 10);
    emit([doc.doctor_id, doc.user_id, mysubjective, mydate], doc._id);
  }
  if (doc.doctype == "patient_charting_template" && doc.finalize == "Yes") {
    mydate = doc.update_ts.substring(0, 10);
    emit([doc.doctor_id, doc.user_id, doc.template_name, mydate], doc._id);
  }
}
