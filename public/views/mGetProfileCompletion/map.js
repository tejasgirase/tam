function(doc) {
if(doc.doctype=="Diet" || doc.doctype=="Exercise" || doc.doctype=="UserMedHis" || doc.doctype=="Anual_Exam"||doc.doctype=="UserInfo"||doc.doctype=="Subscriber")
  emit(doc.user_id, doc.doctype);
}