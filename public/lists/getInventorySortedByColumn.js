function(head, req) {
	var row;
	var rows = [];
	var moment = require("views/lib/moment");
	// send(JSON.stringify({"rows" : req}));
	while(row = getRow()) {
		rows.push(row) ;	
	}
	switch(req.query.sorting_parameter) {
		case "category" :
			rows.sort(function(a,b) {
				var textA = a.doc.category.toUpperCase();
				var textB = b.doc.category.toUpperCase();
				if(req.query.sort_order == "descending") return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
				else return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});			
		break;
		case "product_name" :
			rows.sort(function(a,b) {
				var textA = a.doc.product_name.toUpperCase();
				var textB = b.doc.product_name.toUpperCase();
				if(req.query.sort_order == "descending") return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
				else return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});			
		break;
		case "manufacturer_name" :
			rows.sort(function(a,b) {
				var textA = a.doc.manufacturer_name.toUpperCase();
				var textB = b.doc.manufacturer_name.toUpperCase();
				if(req.query.sort_order == "descending") return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
				else return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});			
		break;
		case "status" :
			rows.sort(function(a,b) {
				var textA = a.doc.status.toUpperCase();
				var textB = b.doc.status.toUpperCase();
				if(req.query.sort_order == "descending") return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
				else return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});			
		break;
		case "note" :
			rows.sort(function(a,b) {
				var textA = a.doc.note.toUpperCase();
				var textB = b.doc.note.toUpperCase();
				if(req.query.sort_order == "descending") return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
				else return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			});			
		break;
		case "inventory_added_date" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return (moment(b.doc.inventory_added_date) - moment(a.doc.inventory_added_date));
				else return (moment(a.doc.inventory_added_date) - moment(b.doc.inventory_added_date));
			});
		break;
		case "expiry_date" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return (moment(b.doc.expiry_date) - moment(a.doc.expiry_date));
				else return (moment(a.doc.expiry_date) - moment(b.doc.expiry_date));
			});
		break;
		case "cost" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.cost) - Number(a.doc.cost);
				else return Number(a.doc.cost) - Number(b.doc.cost);
			});
		break;
		case "price" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.price) - Number(a.doc.price);
				else return Number(a.doc.price) - Number(b.doc.price);
			});
		break;
		case "lot_no" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.lot_no) - Number(a.doc.lot_no);
				else return Number(a.doc.lot_no) - Number(b.doc.lot_no);
			});
		break;
		case "code_no" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.code_no) - Number(a.doc.code_no);
				else return Number(a.doc.code_no) - Number(b.doc.code_no);
			});
		break;
		case "quantity_remaining" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.quantity_remaining) - Number(a.doc.quantity_remaining);
				else return Number(a.doc.quantity_remaining) - Number(b.doc.quantity_remaining);
			});
		break;
		case "quantity_total" :
			rows.sort(function(a,b) {
				if(req.query.sort_order == "descending") return Number(b.doc.quantity_total) - Number(a.doc.quantity_total);
				else return Number(a.doc.quantity_total) - Number(b.doc.quantity_total);
			});
		break;
	}
	send(JSON.stringify({"rows" : rows}));
}