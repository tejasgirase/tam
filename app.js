var https       = require("https");
var fs          = require("fs");
var express     = require("express");
var app         = express();
var path        = require("path");
var bodyParser  = require("body-parser");
var cons        = require('consolidate');
var config      = require("./config");
var Cloudant_ip = config.CLOUDENT_IP;
var Cloudant    = require('cloudant');
var cloudant    = Cloudant(Cloudant_ip);
var Port        = config.PORT;
var Local_ip    = config.LOCAL_IP;

// app.use(express.static('public/'));
app.use(express.static("public/_attachments/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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
	var opendb = cloudant.db.use(req.query.db);
	opendb.get(req.query._id,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			console.log(err);
			res.status(500).json({ error: err.error, reason:err.reason});
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
	if(req.query.view_data.key) {
		var mykey = req.query.view_data.key;
	}
	var view_data = JSON.parse(req.query.view_data);
	var viewdb = cloudant.db.use(req.query.db);
	viewdb.view(req.query.design_doc,req.query.view,view_data.option_list,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.get("/api/list",function(req,res) {
	var view_data = JSON.parse(req.query.view_data);
	var listdb = cloudant.db.use(req.query.db);
	listdb.viewWithList(req.query.design_doc, req.query.view, req.query.list, view_data.option_list, function(err, body) {
	  if (!err) {
	    res.send(body);
	  }else {
	  	res.status(500).json({ error: err.error, reason:err.reason});
	  }
	});
});

app.post("/api/save",function(req,res) {
	var savedb = cloudant.db.use(req.body.db);
	savedb.insert(JSON.parse(req.body.doc),function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.put("/api/update",function(req,res) {
	var updatedb = cloudant.db.use(req.body.db);
	updatedb.insert(JSON.parse(req.body.doc),function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.post("/api/bulk",function(req,res) {
	var bulk_data = JSON.parse(req.body.master_docs);
	var bulksavedb = cloudant.db.use(req.body.db);
	bulksavedb.bulk({"docs":bulk_data.docs},function(err, body) {
		if(!err) {
			res.status(201).send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.post("/api/remove/:id",function(req,res) {
	var bulksavedb = cloudant.db.use(req.query.db);
	bulksavedb.insert(req.body,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(Port,Local_ip, function() {
	console.log("server is running on port "+Port);
});

// app.listen(3005,"192.168.0.66", function(){
// 	console.log("server is listening on port 3005");
// });