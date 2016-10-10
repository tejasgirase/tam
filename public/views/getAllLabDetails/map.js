function(doc) {
	if(doc.doctype =='Lab' && !doc.reference && doc.reference != "")  emit(doc,doc);
	if(doc.doctype =='Lab' && !doc.reference && doc.reference != "")  emit([0,doc.doctype,doc.contact_person_phone],doc);
	if(doc.doctype =='Imaging' &&!doc.reference && doc.reference != "")  emit(doc,doc);
	if(doc.doctype =='Imaging' &&!doc.reference && doc.reference != "")  emit([0,doc.doctype,doc.contact_person_phone],doc);
}