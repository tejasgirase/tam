function(doc) {
if(doc.doctype == "Analytics" && doc.ReportFrequency.length > 0 && doc.update_ts)
  emit([doc.doctype, doc.user_id], [doc.ReportFrequency, doc.update_ts]);
}