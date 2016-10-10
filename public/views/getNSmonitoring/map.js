function(doc) {
  if (doc.doctype == "ns_monitor")
  emit([doc.doctor_id, doc.user_id],doc);
}