function(doc) {
if(doc.doctype== "RiskAnalysisScore" && doc.risk_type)
  emit([doc.user_id,doc.risk_type,doc.insert_ts], doc);
}