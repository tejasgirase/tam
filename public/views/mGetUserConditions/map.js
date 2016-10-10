function(doc) {
if(doc.doctype == "ECG" || doc.doctype == "PULSE_OXY" || doc.doctype == "BODY_TEMP")
  emit(doc.user_id, doc);
}