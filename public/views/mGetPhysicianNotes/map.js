function(doc) {
if(doc.doctype == "PhysicianNotes")
  emit([doc.doctype, doc.user_id], doc);
}