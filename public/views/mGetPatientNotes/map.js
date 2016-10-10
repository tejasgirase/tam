function(doc) {
if(doc.doctype == "PatientNotes" || doc.doctype=="Anual_Exam")
  emit([doc.doctype, doc.user_id], doc);
}