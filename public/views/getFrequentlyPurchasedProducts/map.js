function(doc) {
	if(doc.doctype == "inventory"){	  
		  emit([doc.dhp_code,doc.category,doc.manufacturer_name,doc.product_name]);
	}
}