function(doc) {
	if(doc.doctype == "VaccineDetails" && doc.user_id) emit(doc.user_id,doc.Vaccine_Name)
	if(doc.doctype == "ScreeningDetails" && doc.user_id) emit(doc.user_id,doc.Screening_Name)
}