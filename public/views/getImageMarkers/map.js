function (doc) {
	if(doc.doctype == "image_marker"){
		emit(doc.label,doc.mouser)
	}
}