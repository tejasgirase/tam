function(doc) {
	if(doc.doctype =='Lab' && !doc.reference && doc.reference != "") emit([doc.doctype, doc.dhp_code, doc.city], doc.lab_name)
	if(doc.doctype =='Imaging' && !doc.reference && doc.reference != "") emit([doc.doctype, doc.dhp_code, doc.city], doc.imaging_name)
}