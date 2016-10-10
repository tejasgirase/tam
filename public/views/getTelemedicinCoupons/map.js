function(doc){
	if(doc.doctype == "telemedicine_coupons"){
		emit([doc.coupon_code],doc);
	}
}