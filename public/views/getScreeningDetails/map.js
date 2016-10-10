function(doc) {
 if(doc.doctype == "ScreeningDetails")
   emit([doc.user_id,doc.Screening_Name],doc);
}