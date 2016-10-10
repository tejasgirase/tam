var https      = require("https");
var fs         = require("fs");
var express    = require("express");
var app        = express();
var path       = require("path");
var cons       = require('consolidate');
var Cloudant   = require('cloudant');
var cloudant   = Cloudant("https://nirmalpatel59:nirmalpatel@nirmalpatel59.cloudant.com");
var db         = cloudant.db.use("yhsqizvkmp");
var medical_db = cloudant.db.use("meluha_db5");

// app.use(express.static('public/'));
app.use(express.static("public/_attachments/"));
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'public/_attachments/'));
app.set('view engine', 'html');

app.get("/",function(req,res) {
	res.render("index.html");
});

app.get("/my-account.html",function(req,res) {
	res.render("my-account.html");
});

app.get("/api/open",function(req,res) {
	db.get(req.query._id,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			console.log(err);
			res.send("test");
		}
	});
});

// app.post("/api/view",function(req,res) {
// 	console.log(req.query);
// 	medical_db.view("tamsa","getMiscSetting",{key: ["org.couchdb.user:n@n.com","H-testingdhp"],
//       include_docs:true},function(err, body) {
// 		if(!err) {
// 			res.send(body);
// 		}else {
// 			console.log(err);
// 			res.send("test23");
// 		}
// 	});
// });

app.get("/api/view",function(req,res) {
	console.log("get");
	console.log(req.query);
	if(req.query.view_data.key) {
		var mykey = req.query.view_data.key;
	}
	medical_db.view(req.query.design_doc,req.query.view,req.query.view_data,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			console.log(err);
			res.send("test23");
		}
	});
});

app.get("/api/list",function(req,res) {
	console.log("list");
	console.log(req.query);
	medical_db.viewWithList(req.query.design_doc, req.query.view, req.query.list, req.query.view_data, function(err, body) {
	  if (!err) {
	    res.send(body);
	  }
	});
	// medical_db.view(req.query.design_doc,req.query.view,req.query.view_data,function(err, body) {
	// 	if(!err) {
	// 		res.send(body);
	// 	}else {
	// 		console.log(err);
	// 		res.send("test23");
	// 	}
	// });
});


https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(55554,"192.168.0.66", function() {
	console.log("server is running on port 55554");
});

// app.listen(3005,"192.168.0.66", function(){
// 	console.log("server is listening on port 3005");
// });