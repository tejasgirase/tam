function(doc) {
if(doc.doctype== "RiskAnalysisScore" )
  emit(doc.user_id, doc);


}