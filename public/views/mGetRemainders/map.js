function(doc) {
if(doc.doctype=="Alerts" || doc.doctype=="Remainder" || doc.reminder_type=="Remainder_Physician_Notes"  ||doc.reminder_type=="Remainder_Patient_Notes")
	
  		emit (doc.user_id,doc)
}