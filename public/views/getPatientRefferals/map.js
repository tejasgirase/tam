function(doc) {
if(doc.doctype =='Referral')
  emit(doc.user_id,doc);
}