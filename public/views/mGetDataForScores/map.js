function(doc) {
if(doc.doctype =='UserInfo' || doc.doctype == "UserMedHis" || doc.doctype == "Exercise" || doc.doctype=="RiskAnalysisScore")
  emit(doc.user_id, doc);
}