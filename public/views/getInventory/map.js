 function(doc) {
		if(doc.doctype == "inventory"){
		  emit([0,doc.dhp_code,doc.category,doc.manufacturer_name,doc.product_name,doc.code_no,doc.lot_no],doc);
		  emit([1,doc.dhp_code,doc.category],doc);
		  emit([2,doc.dhp_code,doc.category,doc.manufacturer_name],doc);
		  emit([3,doc.dhp_code,doc.category,doc.manufacturer_name,doc.product_name],doc);
		  emit([4,doc.dhp_code,doc.category,doc.product_name],doc);
		}
}