function (doc)
{
  if (doc.doctype == "UserInfo")
  {
    emit([doc.user_id,1], doc);
  }
	if(doc.doctype == "PatientNotes")
  	{
    		emit([doc.user_id,2], doc);
 	 }  
}