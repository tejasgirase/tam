function (doc, req) {
	return ((doc.doctype == req.query.doctype)||(doc.doctype == req.query.doctype2));
	//return true;      
}
