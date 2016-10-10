function(doc) {
if(doc.doctype == "TamsaSchedules")
{
  emit([doc.ts_TemplateName, doc.user_id], doc);
  emit(doc.user_id, doc);
}
}