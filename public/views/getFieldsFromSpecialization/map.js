function(doc) {
	if(doc.doctype == "charting_template"){
		for (var i = 0;i < doc.sections.length;i++) {
			for(var j=0;j < doc.sections[i].fields.length;j++){
				emit([doc.specialization,doc.sections[i].fields[j].f_name,doc.sections[i].fields[j].response_format_pair]);
			}
    }
	}
}