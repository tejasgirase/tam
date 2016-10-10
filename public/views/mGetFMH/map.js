function(doc) {
if(doc.doctype == "Family_Medical_History")
  emit([doc.doctype, doc.user_id], doc);
}