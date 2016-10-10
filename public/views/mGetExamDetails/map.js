function(doc) {
if(doc.doctype == "Anual_Exam")
  emit( doc.user_id, doc);
}